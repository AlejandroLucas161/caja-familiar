-- Seed de datos demo para Caja Familiar
-- Ejecutar DESPUÉS de crear el usuario demo con user_metadata.workspace = 'demo'

insert into public.movements (workspace, type, amount, person, category, description, created_at)
values
  ('demo', 'SEND', 250000, 'Alejandro', null, 'Pago del mes', now() - interval '5 days'),
  ('demo', 'EXPENSE', 35000, 'Mariangel', 'comida', 'Supermercado', now() - interval '3 days'),
  ('demo', 'EXPENSE', 12000, 'Bonnie', 'transporte', 'Combustible', now() - interval '1 day'),
  ('demo', 'EXPENSE', 8500, 'Alba', 'salud', 'Farmacia', now() - interval '1 day'),
  ('demo', 'SEND', 100000, 'Anais', null, 'Extra', now());
