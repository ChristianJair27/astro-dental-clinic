// Todo el contenido del sitio vive aquí. Para un cliente nuevo: reemplaza cada TODO-CLIENTE.
// Contenido de ejemplo FICTICIO: la clínica, la especialista y los testimonios no existen.

export type IconName =
  | 'tooth'
  | 'sparkle'
  | 'shield'
  | 'smile'
  | 'clock'
  | 'heart'
  | 'calendar'
  | 'card'
  | 'stethoscope'
  | 'file'
  | 'baby'
  | 'brace';

export interface Treatment {
  title: string;
  description: string;
  icon: IconName;
  /** Texto corto opcional: duración o "desde $". Déjalo vacío si el cliente no publica precios. */
  detail?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const site = {
  // --- Identidad (TODO-CLIENTE) ---
  name: 'Brisa Dental Querétaro',
  legalName: 'Brisa Dental Querétaro (demo)',
  url: 'https://example.com', // dominio final sin "/" al final
  locale: 'es-MX',
  title: 'Dentista en Querétaro | Limpieza, resinas, ortodoncia e implantes | Brisa Dental',
  description:
    'Consultorio dental en Querétaro: valoración con plan por escrito, limpieza, resinas, endodoncia, ortodoncia e implantes. Agenda tu cita por WhatsApp o en línea.',
  /** Tipo schema.org según giro: Dentist, Physician, Psychologist, MedicalClinic, Optician… */
  schemaType: 'Dentist',
  /** Solo para Physician/MedicalClinic (p. ej. 'Pediatric', 'Dermatology'). Vacío = no se publica. */
  medicalSpecialty: '',
  priceRange: '$$',
  themeColor: '#0f6e66',

  // --- Contacto (TODO-CLIENTE) ---
  phone: '+52 442 000 0000', // como se muestra
  phoneHref: '+524420000000', // E.164 para tel:
  whatsapp: '524420000000', // solo dígitos, con lada de país
  whatsappMessage: 'Hola, vi su página web y me gustaría agendar una cita.',
  /** Plantilla del mensaje cuando el paciente elige tratamiento/horario. {tratamiento} y {horario} se reemplazan. */
  whatsappTemplate: 'Hola, me gustaría agendar una cita para: {tratamiento}. Horario preferido: {horario}.',
  email: 'citas@example.com',
  address: {
    street: 'Av. Ejemplo 456, Consultorio 3, Col. Centro Sur',
    locality: 'Santiago de Querétaro',
    region: 'Qro.',
    postalCode: '76090',
    country: 'MX',
  },
  geo: { lat: 20.5733, lng: -100.3746 },
  mapQuery: 'Centro Sur, Santiago de Querétaro, Qro.',
  areaServed: ['Querétaro', 'Corregidora', 'El Marqués', 'Juriquilla'],
  hours: [
    { days: 'Lunes a viernes', open: '09:00', close: '20:00', schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { days: 'Sábado', open: '09:00', close: '14:00', schema: ['Saturday'] },
  ],
  hoursNote: 'Domingos y días festivos solo urgencias con cita previa por WhatsApp.',
  parking: 'Estacionamiento en la plaza y acceso en planta baja.',
  social: [] as { label: string; href: string }[],

  // --- Hero ---
  hero: {
    eyebrow: 'Consultorio dental en Querétaro',
    heading: 'Cuidamos tu sonrisa sin prisas y sin sorpresas',
    sub: 'Valoración completa, plan de tratamiento por escrito con costos claros y citas puntuales. Atención para adultos y niños.',
    primaryCta: 'Agendar por WhatsApp',
    secondaryCta: 'Pedir cita en línea',
    highlights: [
      'Plan y presupuesto por escrito antes de empezar',
      'Material esterilizado y desechable por paciente',
      'Recordatorio de cita por WhatsApp',
    ],
  },

  // --- Tratamientos ---
  treatmentsIntro: 'Te explicamos cada opción, su duración y su costo antes de iniciar. Tú decides.',
  treatments: [
    { icon: 'stethoscope', title: 'Valoración y diagnóstico', description: 'Revisión completa, fotografías intraorales y plan de tratamiento por escrito.', detail: '45 min' },
    { icon: 'sparkle', title: 'Limpieza dental', description: 'Profilaxis con ultrasonido y pulido. Recomendada cada 6 meses para prevenir caries y sarro.', detail: '40 min' },
    { icon: 'tooth', title: 'Resinas y restauraciones', description: 'Retiramos caries y restauramos con resina del color de tu diente.', detail: '30–60 min' },
    { icon: 'heart', title: 'Endodoncia', description: 'Tratamiento de conductos para salvar el diente cuando el nervio está dañado.', detail: '1–2 citas' },
    { icon: 'brace', title: 'Ortodoncia', description: 'Brackets metálicos, estéticos o alineadores. Te mostramos el plan de movimiento antes de empezar.', detail: 'Valoración' },
    { icon: 'shield', title: 'Implantes y prótesis', description: 'Reposición de piezas perdidas con implante, corona o prótesis según tu caso.', detail: 'Valoración' },
    { icon: 'smile', title: 'Blanqueamiento', description: 'Blanqueamiento en consultorio o con guardas para casa, previa revisión de sensibilidad.', detail: '1 cita' },
    { icon: 'baby', title: 'Odontopediatría', description: 'Primera visita, selladores y flúor para niños, en un ambiente tranquilo y sin regaños.', detail: '30 min' },
  ] satisfies Treatment[],
  /** Opciones extra del formulario además de los tratamientos. */
  extraTreatmentOptions: ['Urgencia / dolor', 'No estoy seguro(a)'],

  // --- Especialista (TODO-CLIENTE: datos reales y verificables) ---
  specialist: {
    name: 'Dra. Mariela Ochoa Sandoval', // nombre ficticio
    title: 'Cirujana Dentista',
    specialty: 'Odontología restauradora y estética',
    /** Obligatorio en publicidad de servicios de salud en México: cédula profesional visible. */
    cedulaProfesional: 'TODO-CLIENTE',
    /** Cédula de especialidad (si aplica). Vacío = no se muestra. */
    cedulaEspecialidad: 'TODO-CLIENTE',
    school: 'TODO-CLIENTE: universidad y año de egreso',
    bio: [
      'Más de 12 años atendiendo pacientes en Querétaro. Mi prioridad es que entiendas tu diagnóstico y que el tratamiento se adapte a tu tiempo y presupuesto.',
      'Trabajo con un enfoque conservador: primero prevenir, después restaurar y solo al final reemplazar.',
    ],
    credentials: [
      'Diplomado en rehabilitación oral (TODO-CLIENTE)',
      'Actualización continua en adhesión y estética dental (TODO-CLIENTE)',
      'Miembro de colegio de cirujanos dentistas (TODO-CLIENTE)',
    ],
    photoAlt: 'Fotografía de la especialista (imagen de ejemplo)',
  },

  // --- Primera visita ---
  firstVisit: {
    heading: 'Tu primera visita, paso a paso',
    sub: 'Sabemos que ir al dentista puede dar nervios. Así es una primera cita con nosotros:',
    steps: [
      { title: 'Agenda en 1 minuto', text: 'Por WhatsApp o con el formulario. Te confirmamos día y hora y te enviamos la ubicación.' },
      { title: 'Llega 10 minutos antes', text: 'Llenas una historia clínica breve. Trae tu identificación y, si tienes, radiografías recientes.' },
      { title: 'Valoración sin prisas', text: 'Revisamos dientes, encías y mordida. Te mostramos fotos y te explicamos lo que encontramos.' },
      { title: 'Plan por escrito', text: 'Te entregamos opciones de tratamiento, número de citas y costo. Tú decides cuándo empezar.' },
    ],
    bring: ['Identificación oficial', 'Radiografías previas (si tienes)', 'Lista de medicamentos que tomas', 'Póliza o datos de tu aseguradora'],
  },

  // --- Seguros y formas de pago (TODO-CLIENTE) ---
  payments: {
    heading: 'Seguros y formas de pago',
    sub: 'Queremos que el costo no sea un obstáculo para cuidar tu salud.',
    methods: ['Efectivo', 'Tarjeta de débito y crédito', 'Transferencia', 'Meses sin intereses con tarjetas participantes (TODO-CLIENTE)'],
    insurance:
      'Trabajamos por reembolso con aseguradoras de gastos médicos: te entregamos factura e informe para tu trámite. TODO-CLIENTE: lista de aseguradoras con convenio directo.',
    invoice: 'Emitimos factura CFDI. Los servicios dentales pueden ser deducibles de impuestos (consulta a tu contador).',
  },

  // --- Testimonios ---
  /** true = la página muestra "Testimonios de ejemplo". Ponlo en false SOLO con testimonios reales y con permiso por escrito. */
  testimonialsAreExamples: true,
  testimonials: [
    // EJEMPLO FICTICIO — reemplazar por testimonios reales con autorización del paciente.
    { name: 'Paciente A.', role: 'Limpieza y resinas', quote: 'Me explicaron todo con fotos antes de empezar y el presupuesto fue exactamente el que me dieron.' },
    // EJEMPLO FICTICIO
    { name: 'Paciente B.', role: 'Odontopediatría', quote: 'Mi hijo tenía miedo y salió contento. Mucha paciencia y un trato muy amable.' },
    // EJEMPLO FICTICIO
    { name: 'Paciente C.', role: 'Endodoncia', quote: 'Llegué con dolor y me atendieron el mismo día. Puntuales y muy limpios.' },
  ] satisfies Testimonial[],

  faq: [
    { q: '¿Cuánto cuesta la consulta de valoración?', a: 'TODO-CLIENTE: precio de valoración. Incluye revisión completa, fotografías y plan de tratamiento por escrito.' },
    { q: '¿Atienden urgencias?', a: 'Sí. Si tienes dolor, inflamación o se rompió un diente, escríbenos por WhatsApp y te damos el primer espacio disponible.' },
    { q: '¿Atienden niños?', a: 'Sí, desde la primera visita (alrededor de 1 año de edad). Recomendamos revisión cada 6 meses.' },
    { q: '¿Aceptan seguros de gastos médicos?', a: 'Trabajamos por reembolso: pagas en consultorio y te damos factura e informe para tu aseguradora.' },
    { q: '¿Puedo pagar a meses?', a: 'En tratamientos de ortodoncia, implantes y rehabilitación ofrecemos pagos diferidos y meses sin intereses con tarjetas participantes.' },
    { q: '¿Cómo cancelo o cambio mi cita?', a: 'Avísanos por WhatsApp con al menos 24 horas de anticipación para ofrecer tu espacio a otro paciente.' },
  ] satisfies FaqItem[],

  form: {
    heading: 'Pide tu cita',
    sub: 'Te confirmamos por WhatsApp o llamada en menos de 2 horas en horario de consultorio.',
    timeOptions: ['Mañana (9:00–13:00)', 'Mediodía (13:00–16:00)', 'Tarde (16:00–20:00)', 'Sábado (9:00–14:00)', 'Cualquier horario'],
    privacyNote: 'No incluyas datos clínicos detallados en este formulario; los revisamos en consulta.',
  },

  /** Aviso de privacidad (LFPDPPP). TODO-CLIENTE: el texto final lo valida el cliente o su asesor legal. */
  privacy: {
    responsible: 'TODO-CLIENTE: nombre o razón social del responsable',
    contactEmail: 'privacidad@example.com',
    updated: 'TODO-CLIENTE: fecha',
  },

  cta: {
    heading: '¿Tienes dolor o hace mucho que no vas al dentista?',
    sub: 'Escríbenos y te damos el primer horario disponible.',
  },
};

export type Site = typeof site;

/** Opciones del select de tratamiento del formulario. */
export const treatmentOptions = [...site.treatments.map((t) => t.title), ...site.extraTreatmentOptions];
