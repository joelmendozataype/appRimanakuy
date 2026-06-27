-- =====================================================================
--  RIMANAKUY-Salud — Datos de prueba: GLOSARIO CLINICO BILINGUE
--  Frases clinicas Espanol  <->  Quechua Chanka (Ayacucho-Chanka)
--
--  Objetivo: poblar el catalogo (glosario / categoria / frase) para
--  poder probar el modulo de frases predefinidas de la app.
--
--  *** AVISO IMPORTANTE ***
--  Las traducciones al quechua Chanka son una PROPUESTA INICIAL de
--  trabajo. DEBEN ser revisadas y validadas por un hablante nativo o
--  interprete calificado antes de cualquier uso clinico real.
--  Por eso se cargan con validado_por = 'PENDIENTE DE VALIDACION'.
--
--  Compatibilidad: escrito en SQL estandar. Funciona en
--  Supabase/PostgreSQL, MySQL 8 y SQLite. Ejecutar UNA sola vez
--  sobre el catalogo vacio (resuelve las claves foraneas por nombre).
-- =====================================================================

-- 1) Glosario base
insert into glosario (dominio, version, fecha_actualizacion)
values ('salud_general', '1.0', '2026-06-27');

-- 2) Categorias
insert into categoria (glosario_id, nombre) values
 ((select glosario_id from glosario where dominio = 'salud_general'), 'Triaje'),
 ((select glosario_id from glosario where dominio = 'salud_general'), 'Sintomas y dolor'),
 ((select glosario_id from glosario where dominio = 'salud_general'), 'Indicaciones de tratamiento'),
 ((select glosario_id from glosario where dominio = 'salud_general'), 'Consentimiento informado'),
 ((select glosario_id from glosario where dominio = 'salud_general'), 'Datos del paciente');

-- 3) Frases por categoria  (frase_es, frase_qu)
-- ---------------------------------------------------------------------
-- TRIAJE
-- ---------------------------------------------------------------------
insert into frase (categoria_id, frase_es, frase_qu, validado_por) values
 ((select categoria_id from categoria where nombre='Triaje'), 'Buenos dias, soy del personal de salud.', 'Allin punchaw, nuqaqa hampiq llamkaqmi kani.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Triaje'), 'Como se siente hoy?', 'Imaynam kunan kachkanki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Triaje'), 'Cual es su nombre?', 'Iman sutiyki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Triaje'), 'No tenga miedo, lo vamos a ayudar.', 'Ama manchakuychu, yanapasqaykikum.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Triaje'), 'Por favor, sientese aqui.', 'Allichu, kaypi tiyaykuy.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Triaje'), 'Vino solo o acompanado?', 'Sapallaykichu hamurqanki, icha pillawanchu?', 'PENDIENTE DE VALIDACION');

-- ---------------------------------------------------------------------
-- SINTOMAS Y DOLOR
-- ---------------------------------------------------------------------
insert into frase (categoria_id, frase_es, frase_qu, validado_por) values
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Donde le duele?', 'Maypin nanasunki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Desde cuando se siente asi?', 'Haykapmantam chhayna kachkanki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Le duele la cabeza?', 'Umaykim nanasunki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Le duele el estomago?', 'Wiksaykim nanasunki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Tiene fiebre o escalofrios?', 'Rupapakunkichu icha katatasunkichu?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Tiene tos o le falta el aire?', 'Uhuwanchu kachkanki icha samayta sasachakunkichu?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Sintomas y dolor'), 'Senale con el dedo donde siente el dolor.', 'Dedoykiwan tuksiy maypi nanay kasqanta.', 'PENDIENTE DE VALIDACION');

-- ---------------------------------------------------------------------
-- INDICACIONES DE TRATAMIENTO
-- ---------------------------------------------------------------------
insert into frase (categoria_id, frase_es, frase_qu, validado_por) values
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'Tome este medicamento dos veces al dia.', 'Kay hampita sapa punchaw iskay kuti upyay.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'Tome una pastilla despues de comer.', 'Mikuy qipata huk pastillata upyay.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'Debe descansar y tomar bastante liquido.', 'Samanaykim, chaynataq achka yakuta upyanayki.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'Regrese en tres dias para el control.', 'Kimsa punchawmanta kutimuy qawachikuq.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'Si empeora, venga de inmediato.', 'Aswan mana allinyaptiykiqa, kunallan hamuy.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Indicaciones de tratamiento'), 'No deje de tomar el tratamiento.', 'Ama hampi upyayta saqinkichu.', 'PENDIENTE DE VALIDACION');

-- ---------------------------------------------------------------------
-- CONSENTIMIENTO INFORMADO
-- ---------------------------------------------------------------------
insert into frase (categoria_id, frase_es, frase_qu, validado_por) values
 ((select categoria_id from categoria where nombre='Consentimiento informado'), 'Le voy a explicar el procedimiento.', 'Imaynam ruwasqayta willasqaykim.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Consentimiento informado'), 'Esta de acuerdo con el examen?', 'Examen ruwanaypaq munankichu?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Consentimiento informado'), 'Usted puede preguntar lo que quiera.', 'Imatapas munasqaykita tapuwankimanmi.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Consentimiento informado'), 'Necesito su autorizacion para continuar.', 'Qatipanaypaqqa permisoykitam munani.', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Consentimiento informado'), 'Toda su informacion sera confidencial.', 'Llapan willakuyniykiqa pakasqam kanqa.', 'PENDIENTE DE VALIDACION');

-- ---------------------------------------------------------------------
-- DATOS DEL PACIENTE
-- ---------------------------------------------------------------------
insert into frase (categoria_id, frase_es, frase_qu, validado_por) values
 ((select categoria_id from categoria where nombre='Datos del paciente'), 'Cual es su nombre completo?', 'Iman llapan sutiyki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Datos del paciente'), 'Cuantos anos tiene?', 'Hayka watayoqmi kanki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Datos del paciente'), 'Donde vive?', 'Maypim tiyanki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Datos del paciente'), 'Tiene seguro de salud (SIS)?', 'Salud seguroyoqchu (SIS) kanki?', 'PENDIENTE DE VALIDACION'),
 ((select categoria_id from categoria where nombre='Datos del paciente'), 'Esta embarazada?', 'Chichu kachkankichu?', 'PENDIENTE DE VALIDACION');

-- ---------------------------------------------------------------------
-- (OPCIONAL) Usuario administrador de prueba
-- Reemplaza el hash por uno real generado por tu backend (bcrypt).
-- ---------------------------------------------------------------------
-- insert into usuario (rol_id, nombres, apellidos, usuario, clave_hash, establecimiento)
-- values ((select rol_id from rol where nombre='administrador'),
--         'Admin', 'Demo', 'admin', '<<BCRYPT_HASH_AQUI>>', 'Centro de Salud Demo');

-- =====================================================================
--  Verificacion rapida (opcional):
--  select c.nombre as categoria, count(*) as frases
--  from frase f join categoria c on c.categoria_id = f.categoria_id
--  group by c.nombre order by c.nombre;
-- =====================================================================
