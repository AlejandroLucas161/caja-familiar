"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/AuthContext";

export function useMovementRealtime() {
  const { workspace } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspace) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`movements:${workspace}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "movements",
          filter: `workspace=eq.${workspace}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspace, queryClient]);
}
