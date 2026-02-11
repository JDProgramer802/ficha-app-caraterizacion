export type EstadoFicha = "borrador" | "enviado";

export type ModuloIdentificacion = {
  fecha_diligenciamiento: string;
};

export type ModuloUnidadServicio = {
  regional: string;
  centro_zonal: string;
  nit_entidad: string;
  codigo_cuentame_uds: string;
  nombre_agente_educativo: string;
};

export type ModuloNinaNino = {
  fecha_nacimiento: string;
  edad: number | null;
  pais_nacimiento: string;
  nacionalidad_principal: string;
  nacionalidad_secundaria?: string;
  departamento_residencia: string;
  municipio_residencia: string;
  celular_acudiente: string;
  tipo_documento:
    | "Registro Civil"
    | "Cédula de ciudadanía"
    | "Tarjeta de identidad"
    | "Pasaporte"
    | "Permiso especial de permanencia (PEP)"
    | "No tiene";
  numero_documento: string;
  nombres: string;
  apellidos: string;
  sexo: "Mujer" | "Hombre" | "Intersexual";
  discapacidad: "SI" | "NO";
  categoria_discapacidad:
    | "Física"
    | "Intelectual"
    | "Psicosocial"
    | "Auditiva"
    | "Visual"
    | "Sordo ceguera"
    | "Múltiple"
    | "Sensorial (gusto, olfato, tacto)"
    | "Sistémica"
    | "Voz y habla"
    | "Piel, pelo y uñas"
    | "Ninguna";
  grupo_etnico:
    | "Población indígena"
    | "Población Negra"
    | "Población Afrocolombiana"
    | "Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina"
    | "Población Gitana o Rrom"
    | "Población Palenquera"
    | "Ninguno";
  lenguas_principal: string;
  lenguas_secundaria?: string;
  lenguas_terciaria?: string;
  lenguas_otra?: string;
  dormir_en: "Hamaca" | "Cama" | "Colchoneta" | "Estera" | "Cuna" | "Plancha" | "Otro";
  dormir_otro?: string;
  duerme_con_adultos_habitacion: "SI" | "NO";
  duerme_con_adultos_cama: "SI" | "NO";
  afiliacion_salud: "Afiliado" | "No afiliado";
  razon_no_afiliado?:
    | "En trámite"
    | "Falta de dinero"
    | "No sabe que debe afiliarse"
    | "No le interesa"
    | "No hay entidad cercana"
    | "Otra";
  razon_no_afiliado_otra?: string;
  esquema_vacunacion: "Esquema Completo" | "Esquema incompleto";
  razon_vacunacion_incompleta?:
    | "Falta de dinero"
    | "No sabe que debe vacunarse"
    | "No le interesa"
    | "Pertenece a movimiento anti vacunas"
    | "No hay entidad cercana"
    | "Motivos religiosos"
    | "Otra";
  razon_vacunacion_otra?: string;
  atencion_bucal_mayor6m?: "Con atención salud bucal" | "Sin atención salud bucal";
  motivo_no_bucal?:
    | "Falta de dinero"
    | "No sabe la utilidad de esta valoración"
    | "No le interesa"
    | "No hay entidad cercana"
    | "Motivos religiosos"
    | "Otro";
  motivo_no_bucal_otro?: string;
  valoracion_auditiva_mayor6m?: "Con valoración auditiva" | "Sin valoración auditiva";
  motivo_no_auditiva?:
    | "Falta de dinero"
    | "No sabe la utilidad de esta valoración"
    | "No le interesa"
    | "No hay entidad cercana"
    | "Motivos religiosos"
    | "Otro";
  motivo_no_auditiva_otro?: string;
  valoracion_visual_mayor3a?: "SI" | "NO";
  alergico_medicamento_alimento: "Si" | "No" | "No sabe";
  alergico_detalle?: string;
  valoracion_integral: "SI" | "NO";
  fecha_ultima_cita?: string;
  razon_no_valoracion_integral?:
    | "Falta de dinero"
    | "No sabe que debe recibir esta atención"
    | "No le interesa"
    | "No hay entidad cercana"
    | "Otro";
  razon_no_valoracion_integral_otra?: string;
  lactancia_materna_menor6m?: "SI" | "NO";
  motivo_no_lactancia_menor6m?:
    | "Empleo"
    | "Ausencia de la madre"
    | "Dificultades en el amamantamiento"
    | "Falta de motivación"
    | "No sabe como hacerlo"
    | "Tratamiento médico"
    | "Presión familiar"
    | "Otro";
  motivo_no_lactancia_menor6m_otro?: string;
  exclusiva_leche_materna_menor6m?: "Si, exclusivamente leche materna" | "No, recibe otros alimentos";
  edad_introduccion_alimentos_menor6m?:
    | "(0 meses)"
    | "(1 mes)"
    | "(2 meses)"
    | "(3 meses)"
    | "(4 meses)"
    | "(5 meses)";
  primer_alimento_menor6m?: string;
  recibio_leche_materna_exclusiva_7a24m?: "Si recibió leche materna exclusiva" | "No recibió leche materna exclusiva";
  motivo_no_exclusiva_7a24m?:
    | "Empleo"
    | "Ausencia de la madre"
    | "Dificultades en el amamantamiento"
    | "Falta de motivación"
    | "No sabía como hacerlo"
    | "Tratamiento médico"
    | "Presión familiar"
    | "Otro";
  motivo_no_exclusiva_7a24m_otro?: string;
  edad_introduccion_alimentos_7a24m?:
    | "(0 meses)"
    | "(1 mes)"
    | "(2 meses)"
    | "(3 meses)"
    | "(4 meses)"
    | "(5 meses)"
    | "(6 meses)"
    | "(7 meses)"
    | "(8 meses)"
    | "(9 meses)"
    | "(10 meses)"
    | "(11 meses)"
    | "(12 meses)";
  primer_alimento_7a24m?: string;
};

export type IntegranteHogar = {
  parentesco:
    | "Padre"
    | "Madre"
    | "Hijo-a"
    | "Hermana-o"
    | "Prima-o"
    | "Sobrina-o"
    | "Nieta-o"
    | "Cónyuge"
    | "Padrastro"
    | "Madrastra"
    | "Hijastra-o"
    | "Abuela-o"
    | "Tía-o"
    | "Suegra-o"
    | "Nuera"
    | "Yerno"
    | "Cuñada-o"
    | "Padrino"
    | "Madrina"
    | "Familia sustituta / institución de protección"
    | "Otro";
  parentesco_otro?: string;
  nombres_apellidos: string;
  tipo_documento:
    | "Registro Civil"
    | "Cédula de ciudadanía"
    | "Tarjeta de identidad"
    | "Pasaporte"
    | "Permiso especial de permanencia (PEP)"
    | "No tiene";
  numero_documento: string;
  fecha_nacimiento?: string;
  edad?: number | null;
  pais_nacimiento?: string;
  sexo?: "Mujer" | "Hombre" | "Intersexual";
  genero?: string;
  orientacion_sexual?: string;
  grupo_etnico?:
    | "Población indígena"
    | "Población Negra"
    | "Población Afrocolombiana"
    | "Población Raizal descendiente del Archipiélago de San Andrés, Providencia y Santa Catalina"
    | "Población Gitana o Rrom"
    | "Población Palenquera"
    | "Ninguno";
  sabe_leer_escribir?: "Sí" | "No";
  actualmente_estudia?: "Sí" | "No";
  nivel_educativo_mas_alto?: string;
  actividad_principal_actual?: string;
  tipo_vinculacion_laboral?: string;
  ingreso_mensual_promedio?: string;
  observaciones?: string;
};

export type ModuloFamilia = {
  tipo_documento_usuario:
    | "Registro Civil"
    | "Cédula de ciudadanía"
    | "Tarjeta de identidad"
    | "Pasaporte"
    | "Permiso especial de permanencia (PEP)"
    | "No tiene";
  numero_documento_usuario: string;
  numero_personas_hogar: number | null;
  integrantes: IntegranteHogar[];
  clase_ubicacion?: "Cabecera municipal" | "Centro poblado" | "Rural disperso";
  territorio_etnico?: "SI" | "NO";
  territorio_tipo?: "Resguardo indígena" | "Territorio colectivo comunidad negra" | "No aplica";
  nombre_comunidad?: string;
  tipo_vivienda?:
    | "Casa"
    | "Cambuche"
    | "Apartamento"
    | "Vivienda tradicional indígena"
    | "Rancho"
    | "Finca"
    | "Casa lote"
    | "Establecimiento de reclusión"
    | "Otra";
  tipo_vivienda_otra?: string;
  tipo_tenencia?: "Propia" | "Familiar" | "En arriendo" | "Ocupador de hecho" | "En concesión" | "Otra";
  tipo_tenencia_otra?: string;
};

export type Ficha = {
  id: string;
  estado: EstadoFicha;
  currentStep?: number;
  modulo0_identificacion: ModuloIdentificacion;
  modulo1_unidad_servicio: ModuloUnidadServicio;
  modulo2_nina_nino: ModuloNinaNino;
  modulo3_familia: ModuloFamilia;
  createdAt: string;
  updatedAt: string;
};

export type FichaIndexItem = {
  id: string;
  estado: EstadoFicha;
  fecha: string;
  regional?: string;
  centro_zonal?: string;
  nombre_nina_nino?: string;
  documento?: string;
  currentStep?: number;
  updatedAt: string;
};

export function emptyFicha(id: string): Ficha {
  const now = new Date().toISOString();
  return {
    id,
    estado: "borrador",
    currentStep: 0,
    modulo0_identificacion: {
      fecha_diligenciamiento: ""
    },
    modulo1_unidad_servicio: {
      regional: "Atlántico",
      centro_zonal: "sur occidente",
      nit_entidad: "es8002329137",
      codigo_cuentame_uds: "0800100119364",
      nombre_agente_educativo: "Nelsy serrano"
    },
    modulo2_nina_nino: {
      fecha_nacimiento: "",
      edad: null,
      pais_nacimiento: "",
      nacionalidad_principal: "",
      nacionalidad_secundaria: "",
      departamento_residencia: "",
      municipio_residencia: "",
      celular_acudiente: "",
      tipo_documento: "Registro Civil",
      numero_documento: "",
      nombres: "",
      apellidos: "",
      sexo: "Mujer",
      discapacidad: "NO",
      categoria_discapacidad: "Ninguna",
      grupo_etnico: "Ninguno",
      lenguas_principal: "",
      lenguas_secundaria: "",
      lenguas_terciaria: "",
      lenguas_otra: "",
      dormir_en: "Cama",
      dormir_otro: "",
      duerme_con_adultos_habitacion: "NO",
      duerme_con_adultos_cama: "NO",
      afiliacion_salud: "Afiliado",
      razon_no_afiliado: undefined,
      razon_no_afiliado_otra: "",
      esquema_vacunacion: "Esquema Completo",
      razon_vacunacion_incompleta: undefined,
      razon_vacunacion_otra: "",
      atencion_bucal_mayor6m: undefined,
      motivo_no_bucal: undefined,
      motivo_no_bucal_otro: "",
      valoracion_auditiva_mayor6m: undefined,
      motivo_no_auditiva: undefined,
      motivo_no_auditiva_otro: "",
      valoracion_visual_mayor3a: undefined,
      alergico_medicamento_alimento: "No",
      alergico_detalle: "",
      valoracion_integral: "SI",
      fecha_ultima_cita: "",
      razon_no_valoracion_integral: undefined,
      razon_no_valoracion_integral_otra: "",
      lactancia_materna_menor6m: undefined
      ,
      motivo_no_lactancia_menor6m: undefined,
      motivo_no_lactancia_menor6m_otro: "",
      exclusiva_leche_materna_menor6m: undefined,
      edad_introduccion_alimentos_menor6m: undefined,
      primer_alimento_menor6m: "",
      recibio_leche_materna_exclusiva_7a24m: undefined,
      motivo_no_exclusiva_7a24m: undefined,
      motivo_no_exclusiva_7a24m_otro: "",
      edad_introduccion_alimentos_7a24m: undefined,
      primer_alimento_7a24m: ""
    },
    modulo3_familia: {
      tipo_documento_usuario: "Registro Civil",
      numero_documento_usuario: "",
      numero_personas_hogar: 0,
      integrantes: [],
      clase_ubicacion: undefined,
      territorio_etnico: undefined,
      territorio_tipo: undefined,
      nombre_comunidad: "",
      tipo_vivienda: undefined,
      tipo_vivienda_otra: "",
      tipo_tenencia: undefined,
      tipo_tenencia_otra: ""
    },
    createdAt: now,
    updatedAt: now
  };
}
