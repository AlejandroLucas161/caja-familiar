-- Seed de datos demo para Caja Familiar (El Señor de los Anillos)
-- Ejecutar DESPUÉS de crear el usuario demo con user_metadata.workspace = 'demo'

delete from public.movements where workspace = 'demo';

insert into public.movements (workspace, type, amount, person, category, description, created_at)
values
  ('demo', 'SEND', 2500, 'Aragorn', null, 'Provisiones para la Compañía', now() - interval '5 days'),
  ('demo', 'EXPENSE', 320, 'Frodo', 'comida', 'Pan élfico en Bree', now() - interval '4 days'),
  ('demo', 'EXPENSE', 180, 'Sam', 'otros', 'Cuerda élfica', now() - interval '3 days'),
  ('demo', 'SEND', 900, 'Gandalf', null, 'Ayuda desde Rivendel', now() - interval '2 days'),
  ('demo', 'EXPENSE', 75, 'Legolas', 'transporte', 'Arquería del camino', now() - interval '1 day');
