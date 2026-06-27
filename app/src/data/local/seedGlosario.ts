// Datos de prueba del glosario clinico bilingue, espejo de
// db/rimanakuy_salud_datos_frases.sql para poblar la base SQLite local.
//
// AVISO: las traducciones al quechua Chanka son una propuesta inicial,
// pendiente de validacion por un hablante nativo (ver validadoPor).

export interface FraseSeed {
  fraseEs: string;
  fraseQu: string;
}

export interface CategoriaSeed {
  nombre: string;
  frases: FraseSeed[];
}

export const VALIDADO_POR_DEFECTO = "PENDIENTE DE VALIDACION";

export const GLOSARIO_DOMINIO = "salud_general";
export const GLOSARIO_VERSION = "1.0";

export const CATEGORIAS_SEED: CategoriaSeed[] = [
  {
    nombre: "Triaje",
    frases: [
      {
        fraseEs: "Buenos dias, soy del personal de salud.",
        fraseQu: "Allin punchaw, nuqaqa hampiq llamkaqmi kani.",
      },
      { fraseEs: "Como se siente hoy?", fraseQu: "Imaynam kunan kachkanki?" },
      { fraseEs: "Cual es su nombre?", fraseQu: "Iman sutiyki?" },
      {
        fraseEs: "No tenga miedo, lo vamos a ayudar.",
        fraseQu: "Ama manchakuychu, yanapasqaykikum.",
      },
      { fraseEs: "Por favor, sientese aqui.", fraseQu: "Allichu, kaypi tiyaykuy." },
      {
        fraseEs: "Vino solo o acompanado?",
        fraseQu: "Sapallaykichu hamurqanki, icha pillawanchu?",
      },
    ],
  },
  {
    nombre: "Sintomas y dolor",
    frases: [
      { fraseEs: "Donde le duele?", fraseQu: "Maypin nanasunki?" },
      {
        fraseEs: "Desde cuando se siente asi?",
        fraseQu: "Haykapmantam chhayna kachkanki?",
      },
      { fraseEs: "Le duele la cabeza?", fraseQu: "Umaykim nanasunki?" },
      { fraseEs: "Le duele el estomago?", fraseQu: "Wiksaykim nanasunki?" },
      {
        fraseEs: "Tiene fiebre o escalofrios?",
        fraseQu: "Rupapakunkichu icha katatasunkichu?",
      },
      {
        fraseEs: "Tiene tos o le falta el aire?",
        fraseQu: "Uhuwanchu kachkanki icha samayta sasachakunkichu?",
      },
      {
        fraseEs: "Senale con el dedo donde siente el dolor.",
        fraseQu: "Dedoykiwan tuksiy maypi nanay kasqanta.",
      },
    ],
  },
  {
    nombre: "Indicaciones de tratamiento",
    frases: [
      {
        fraseEs: "Tome este medicamento dos veces al dia.",
        fraseQu: "Kay hampita sapa punchaw iskay kuti upyay.",
      },
      {
        fraseEs: "Tome una pastilla despues de comer.",
        fraseQu: "Mikuy qipata huk pastillata upyay.",
      },
      {
        fraseEs: "Debe descansar y tomar bastante liquido.",
        fraseQu: "Samanaykim, chaynataq achka yakuta upyanayki.",
      },
      {
        fraseEs: "Regrese en tres dias para el control.",
        fraseQu: "Kimsa punchawmanta kutimuy qawachikuq.",
      },
      {
        fraseEs: "Si empeora, venga de inmediato.",
        fraseQu: "Aswan mana allinyaptiykiqa, kunallan hamuy.",
      },
      {
        fraseEs: "No deje de tomar el tratamiento.",
        fraseQu: "Ama hampi upyayta saqinkichu.",
      },
    ],
  },
  {
    nombre: "Consentimiento informado",
    frases: [
      {
        fraseEs: "Le voy a explicar el procedimiento.",
        fraseQu: "Imaynam ruwasqayta willasqaykim.",
      },
      { fraseEs: "Esta de acuerdo con el examen?", fraseQu: "Examen ruwanaypaq munankichu?" },
      {
        fraseEs: "Usted puede preguntar lo que quiera.",
        fraseQu: "Imatapas munasqaykita tapuwankimanmi.",
      },
      {
        fraseEs: "Necesito su autorizacion para continuar.",
        fraseQu: "Qatipanaypaqqa permisoykitam munani.",
      },
      {
        fraseEs: "Toda su informacion sera confidencial.",
        fraseQu: "Llapan willakuyniykiqa pakasqam kanqa.",
      },
    ],
  },
  {
    nombre: "Datos del paciente",
    frases: [
      { fraseEs: "Cual es su nombre completo?", fraseQu: "Iman llapan sutiyki?" },
      { fraseEs: "Cuantos anos tiene?", fraseQu: "Hayka watayoqmi kanki?" },
      { fraseEs: "Donde vive?", fraseQu: "Maypim tiyanki?" },
      {
        fraseEs: "Tiene seguro de salud (SIS)?",
        fraseQu: "Salud seguroyoqchu (SIS) kanki?",
      },
      { fraseEs: "Esta embarazada?", fraseQu: "Chichu kachkankichu?" },
    ],
  },
];
