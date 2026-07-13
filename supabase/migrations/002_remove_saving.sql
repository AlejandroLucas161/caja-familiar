-- Quitar tipo SAVING del constraint (proyectos ya migrados)
delete from public.movements where type = 'SAVING';
delete from public.movements where category = 'ahorro';

alter table public.movements drop constraint if exists movements_type_check;
alter table public.movements
  add constraint movements_type_check
  check (type in ('SEND', 'EXPENSE', 'ADJUSTMENT'));
