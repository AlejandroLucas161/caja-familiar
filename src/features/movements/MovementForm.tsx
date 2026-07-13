"use client";

import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeSelector } from "@/features/movements/TypeSelector";
import { PersonSelector } from "@/features/movements/PersonSelector";
import { CategorySelector } from "@/features/movements/CategorySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Movement, MovementInput, MovementType } from "@/types/movement";
import { dateInputToIso, toDateInputValue } from "@/utils/format";

const schema = z
  .object({
    type: z.enum(["SEND", "EXPENSE", "SAVING", "ADJUSTMENT"]),
    amount: z
      .string()
      .min(1, "Ingresá un monto")
      .refine(
        (v) => Number(v.replace(",", ".")) > 0,
        "El monto debe ser mayor a 0",
      ),
    person: z.string().min(1, "Seleccioná una persona"),
    category: z.string().nullable(),
    description: z.string().max(200).optional(),
    date: z.string().min(1, "Seleccioná una fecha"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "EXPENSE" && !data.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Seleccioná una categoría",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

interface MovementFormProps {
  initial?: Movement | null;
  onSubmit: (input: MovementInput) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
}

export function MovementForm({
  initial,
  onSubmit,
  submitLabel = "Guardar",
  loading = false,
}: MovementFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initial?.type ?? "SEND",
      amount: initial ? String(initial.amount) : "",
      person: initial?.person ?? "",
      category: initial?.category ?? null,
      description: initial?.description ?? "",
      date: toDateInputValue(initial?.createdAt),
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  useEffect(() => {
    if (type !== "EXPENSE") {
      form.setValue("category", null);
    }
  }, [type, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const amount = Number(values.amount.replace(",", "."));
    await onSubmit({
      type: values.type as MovementType,
      amount,
      person: values.person,
      category: values.type === "EXPENSE" ? values.category : null,
      description: values.description?.trim() || null,
      createdAt: dateInputToIso(values.date),
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-20">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo</Label>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <TypeSelector
              value={field.value}
              onChange={(v) => field.onChange(v)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-base font-semibold">
          Monto (USD)
        </Label>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground"
            aria-hidden
          >
            $
          </span>
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0"
            className="h-14 rounded-xl pl-10 text-2xl font-bold tabular-nums"
            {...form.register("amount")}
          />
        </div>
        {form.formState.errors.amount ? (
          <p className="text-base text-destructive" role="alert">
            {form.formState.errors.amount.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">
          {type === "SEND"
            ? "Persona que envía"
            : type === "EXPENSE"
              ? "Persona que gastó"
              : "Persona"}
        </Label>
        <Controller
          control={form.control}
          name="person"
          render={({ field }) => (
            <PersonSelector
              value={field.value || null}
              onChange={field.onChange}
            />
          )}
        />
        {form.formState.errors.person ? (
          <p className="text-base text-destructive" role="alert">
            {form.formState.errors.person.message}
          </p>
        ) : null}
      </div>

      {type === "EXPENSE" ? (
        <div className="space-y-2">
          <Label className="text-base font-semibold">Categoría</Label>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <CategorySelector
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {form.formState.errors.category ? (
            <p className="text-base text-destructive" role="alert">
              {form.formState.errors.category.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold">
          Comentario
        </Label>
        <Textarea
          id="description"
          placeholder="Opcional"
          className="min-h-24 rounded-xl text-base"
          {...form.register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-base font-semibold">
          Fecha
        </Label>
        <Input
          id="date"
          type="date"
          className="h-12 rounded-xl text-base"
          {...form.register("date")}
        />
      </div>

      {/* Botón fijo en zona de pulgar, encima del menú inferior */}
      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[430px]">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-xl text-lg font-semibold"
          >
            {loading ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
