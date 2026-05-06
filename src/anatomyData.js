import { Activity, Bone, Brain, HeartPulse, Stethoscope, Utensils } from 'lucide-react'

const part = (id, name, ...args) => {
  let latinName = ''
  let position, summary, location, func, clinical, pathology = '', tags, imageUrl

  if (Array.isArray(args[0])) {
    // Old format: (id, name, position, summary, location, func, clinical, tags, imageUrl)
    position = args[0]
    summary = args[1]
    location = args[2]
    func = args[3]
    clinical = args[4]
    tags = args[5]
    imageUrl = args[6]
  } else {
    // New format: (id, name, latinName, position, summary, location, func, clinical, pathology, tags, imageUrl)
    latinName = args[0]
    position = args[1]
    summary = args[2]
    location = args[3]
    func = args[4]
    clinical = args[5]
    pathology = args[6]
    tags = args[7]
    imageUrl = args[8]
  }

  return {
    id,
    name,
    latinName,
    position,
    summary,
    location,
    function: func,
    clinical,
    pathology,
    tags,
    imageUrl,
  }
}


export const systems = [
  {
    id: 'skeletal',
    name: 'Sistema oseo',
    icon: Bone,
    color: '#f2ead4',
    accent: '#d8bc77',
    description: 'Huesos axiales y apendiculares: craneo, columna, costillas, pelvis y extremidades.',
  },
  {
    id: 'muscular',
    name: 'Sistema muscular',
    icon: Activity,
    color: '#d84a3c',
    accent: '#ff927a',
    description: 'Musculatura superficial y profunda para postura, mordida, carrera, salto y respiracion.',
  },
  {
    id: 'nervous',
    name: 'Sistema nervioso',
    icon: Brain,
    color: '#7e8cff',
    accent: '#c5ccff',
    description: 'Encefalo, medula espinal, plexos y nervios perifericos principales.',
  },
  {
    id: 'cardio',
    name: 'Arterias, venas y pulmones',
    icon: HeartPulse,
    color: '#ef4665',
    accent: '#51c9e8',
    description: 'Corazon, pulmones, aorta, venas cavas, yugular, cefalica, safenas y vasos mayores.',
  },
  {
    id: 'digestive',
    name: 'Organos internos',
    icon: Utensils,
    color: '#e2a949',
    accent: '#79c267',
    description: 'Digestivo, urinario y organos abdominales de valor clinico.',
  },
  {
    id: 'clinical',
    name: 'Vista clinica',
    icon: Stethoscope,
    color: '#43d1a8',
    accent: '#f7d66b',
    description: 'Zonas de exploracion fisica, constantes vitales, ganglios y puntos de alerta.',
  },
]

export const anatomyParts = {
  skeletal: [
    part('skull', 'Craneo', 'Cranium', [1.82, 1.2, 0.16], 'Caja osea que protege el encefalo y forma orbitas, cavidad nasal y base dental.', 'Cabeza, desde occipital hasta maxilar.', 'Proteccion neurologica, soporte facial y anclaje de musculos masticatorios.', 'Trauma craneal, asimetria, dolor oral o fracturas requieren revision veterinaria.', 'Fracturas, Osteosarcoma, Osteomielitis', ['craneo', 'cabeza', 'proteccion']),
    part('mandible', 'Mandibula', 'Mandibula', [2.06, 0.93, 0.22], 'Hueso movil de la boca con arcada dental inferior.', 'Region ventral del hocico y articulacion temporomandibular.', 'Masticacion, agarre y cierre de la boca.', 'Dolor al comer, maloclusion o fractura dental puede afectar alimentacion.', 'Luxación temporomandibular, Fractura de sínfisis mandibular, Neoplasias orales', ['mandibula', 'dientes', 'mordida']),
    part('teeth', 'Dientes permanentes', [2.2, 0.92, 0.28], 'Denticion adulta canina con incisivos, caninos, premolares y molares.', 'Arcadas maxilar y mandibular.', 'Corte, desgarro, trituracion y defensa.', 'Sarro, fracturas, enfermedad periodontal y dolor oral son muy frecuentes.', ['denticion', 'periodontal', 'caninos']),
    part('cervical', 'Vertebras cervicales C1-C7', [1.02, 1.13, 0.08], 'Segmento flexible del cuello; atlas y axis permiten movimientos finos de la cabeza.', 'Cuello, entre craneo y entrada toracica.', 'Soporte de cabeza, proteccion medular y movilidad cervical.', 'Dolor cervical, rigidez o debilidad puede indicar lesion vertebral o discal.', ['C1-C7', 'cuello', 'medula']),
    part('thoracic-vertebrae', 'Vertebras toracicas T1-T13', [0.17, 1.08, 0.04], 'Region vertebral donde articulan las costillas.', 'Dorso toracico.', 'Protege medula y da soporte a caja toracica.', 'Dolor dorsal o sensibilidad al tacto puede ser ortopedico o neurologico.', ['T1-T13', 'torax', 'columna']),
    part('lumbar', 'Vertebras lumbares L1-L7', [-0.82, 1.01, 0.04], 'Segmento robusto que transmite fuerza entre tronco y pelvis.', 'Lomo, detras de las costillas.', 'Flexion, extension y estabilidad durante carrera y salto.', 'Hernias, dolor lumbar o debilidad posterior son signos de alarma.', ['L1-L7', 'lomo', 'dolor']),
    part('sacrum', 'Sacro', [-1.31, 0.9, 0.05], 'Vertebras sacras fusionadas que unen columna y pelvis.', 'Base de la cola y cintura pelvica.', 'Transfiere fuerzas a miembros posteriores.', 'Dolor lumbosacro puede causar dificultad para levantarse.', ['sacro', 'pelvis', 'cadera']),
    part('caudal', 'Vertebras caudales', [-1.95, 0.92, 0.02], 'Huesos de la cola, variables segun raza.', 'Cola.', 'Equilibrio, comunicacion y expresion corporal.', 'Traumas de cola pueden lesionar nervios y piel.', ['cola', 'caudal', 'equilibrio']),
    part('ribs', 'Costillas', [-0.28, 0.84, 0.53], 'Arcos oseos que forman la caja toracica.', 'Laterales del torax, unidas a vertebras toracicas.', 'Protegen pulmones y corazon; participan en respiracion.', 'Fracturas costales pueden comprometer ventilacion.', ['costillas', 'torax', 'respiracion']),
    part('sternum', 'Esternon', [-0.15, 0.56, 0.38], 'Estructura ventral de la caja toracica.', 'Linea ventral del torax.', 'Anclaje costal y soporte toracico.', 'Dolor ventral tras golpe debe evaluarse.', ['esternon', 'ventral', 'torax']),
    part('scapula', 'Escapula', 'Os Scapulae', [0.73, 0.9, 0.48], 'Hueso plano del hombro, sin clavicula funcional como en humanos.', 'Lateral craneal del torax.', 'Permite gran amplitud de zancada y ancla musculos del hombro.', 'Cojera anterior o dolor de hombro puede venir de esta region.', 'Fracturas de cuello escapular, Osteosarcoma, Parálisis del nervio supraescapular', ['escapula', 'hombro', 'miembro anterior']),
    part('humerus', 'Humero', [0.65, 0.53, 0.62], 'Hueso largo proximal del miembro anterior.', 'Entre hombro y codo.', 'Palanca principal para apoyo y avance anterior.', 'Fractura o dolor causa cojera marcada.', ['humero', 'codo', 'apoyo']),
    part('radius-ulna', 'Radio y ulna', [0.67, 0.22, 0.68], 'Huesos del antebrazo canino.', 'Entre codo y carpo.', 'Soporte de peso y articulacion del codo y carpo.', 'Lesiones de crecimiento, fracturas y luxaciones afectan la marcha.', ['radio', 'ulna', 'antebrazo']),
    part('carpus', 'Carpo', [0.66, -0.12, 0.7], 'Conjunto de huesos equivalentes a la muneca.', 'Union distal del antebrazo y metacarpo.', 'Amortiguacion y flexion de la mano.', 'Hiperextension carpiana y esguinces son lesiones deportivas.', ['carpo', 'muneca', 'ligamentos']),
    part('metacarpals', 'Metacarpos y falanges anteriores', [0.66, -0.35, 0.72], 'Huesos de la mano y dedos.', 'Pata anterior distal.', 'Apoyo fino, traccion y distribucion de peso.', 'Dolor interdigital, fracturas o unas rotas causan cojera.', ['dedos', 'falanges', 'pata']),
    part('pelvis', 'Pelvis', 'Os Coxae', [-1.23, 0.58, 0.23], 'Ilion, isquion y pubis forman la cintura pelvica.', 'Region de la cadera.', 'Protege organos pelvicos y transmite potencia posterior.', 'Displasia, fracturas o dolor coxofemoral alteran la marcha.', 'Displasia de cadera, Fracturas de ilion, Luxación sacrococcígea', ['pelvis', 'cadera', 'displasia']),
    part('femur', 'Femur', 'Os femoris', [-1.16, 0.45, 0.62], 'Hueso largo del muslo.', 'Entre cadera y rodilla.', 'Palanca potente para extension y propulsion.', 'Fracturas, luxacion de cadera o dolor de rodilla pueden reflejarse aqui.', 'Fractura femoral distal, Necrosis aséptica de la cabeza femoral (Legg-Calvé-Perthes)', ['femur', 'muslo', 'rodilla']),
    part('patella', 'Rotula', [-1.1, 0.26, 0.76], 'Hueso sesamoideo de la rodilla.', 'Cara craneal de la articulacion femorotibiorrotuliana.', 'Mejora la accion del cuadriceps.', 'Luxacion patelar es comun en razas pequenas.', ['rotula', 'rodilla', 'luxacion']),
    part('tibia-fibula', 'Tibia y perone', [-1.1, 0.08, 0.68], 'Huesos de la pierna posterior.', 'Entre rodilla y tarso.', 'Soporte y transmision de fuerza al pie.', 'Fracturas o lesiones ligamentarias causan cojera posterior.', ['tibia', 'perone', 'pierna']),
    part('tarsus', 'Tarso, metatarsos y falanges', [-1.12, -0.24, 0.7], 'Huesos del corvejon y dedos posteriores.', 'Extremo distal del miembro posterior.', 'Impulso, salto y apoyo final.', 'Esguinces de tarso o lesiones digitales afectan propulsion.', ['tarso', 'corvejon', 'dedos']),
  ],
  muscular: [
    part('masseter', 'Masetero', 'Musculus masseter', [1.86, 1.03, 0.38], 'Musculo masticatorio potente.', 'Lateral de la mandibula.', 'Cierra la boca y aporta fuerza de mordida.', 'Dolor al comer o atrofia facial requiere exploracion oral y neurologica.', 'Miositis de los músculos masticatorios, Atrofia por denervación (N. Trigémino)', ['mordida', 'cara', 'masticacion']),
    part('temporalis', 'Temporal', 'Musculus temporalis', [1.67, 1.28, 0.28], 'Musculo amplio sobre el craneo.', 'Fosa temporal y arco cigomatico.', 'Eleva mandibula durante mordida.', 'Atrofia puede relacionarse con dolor, inflamacion o neurologia.', 'Atrofia por desuso, Miositis inmunomediata', ['temporal', 'craneo', 'mordida']),
    part('brachiocephalicus', 'Braquiocefalico', [1.16, 0.94, 0.43], 'Banda muscular cuello-hombro.', 'Desde cabeza/cuello hacia humero.', 'Avanza el miembro anterior y flexiona cuello.', 'Contracturas alteran postura cervical.', ['cuello', 'hombro', 'marcha']),
    part('trapezius', 'Trapecio', [0.72, 1.12, 0.44], 'Musculo superficial dorsal de cuello y torax.', 'Sobre escapula y cruz.', 'Eleva y estabiliza la escapula.', 'Dolor puede aparecer con tirones de collar o esfuerzo.', ['escapula', 'cruz', 'postura']),
    part('deltoid', 'Deltoides', [0.62, 0.72, 0.63], 'Musculo lateral del hombro.', 'Escapula y humero proximal.', 'Flexiona hombro y ayuda a estabilizarlo.', 'Lesiones provocan cojera anterior.', ['hombro', 'deltoides', 'cojera']),
    part('triceps', 'Triceps braquial', [0.55, 0.52, 0.53], 'Principal extensor del codo.', 'Region caudal del brazo.', 'Extiende codo para soportar peso.', 'Dolor limita apoyo anterior.', ['triceps', 'codo', 'extension']),
    part('pectorals', 'Pectorales', [0.45, 0.55, 0.42], 'Grupo ventral del pecho.', 'Entre esternon y miembro anterior.', 'Aduccion y estabilizacion del miembro anterior.', 'Tension puede limitar amplitud de paso.', ['pecho', 'esternon', 'aduccion']),
    part('latissimus', 'Dorsal ancho', [-0.05, 0.87, 0.56], 'Gran musculo lateral del tronco.', 'Espalda media y pared toracica.', 'Retrae el miembro anterior y ayuda en carrera.', 'Sobrecarga frecuente en perros deportivos.', ['dorsal', 'deporte', 'traccion']),
    part('intercostals', 'Intercostales', [-0.34, 0.78, 0.58], 'Musculos entre costillas.', 'Espacios intercostales.', 'Ayudan a expandir y estabilizar el torax.', 'Dolor toracico puede dificultar respiracion.', ['respiracion', 'torax', 'costillas']),
    part('abdominals', 'Abdominales', [-0.68, 0.48, 0.55], 'Pared muscular abdominal.', 'Ventral y lateral al abdomen.', 'Sostiene organos, flexiona tronco y ayuda al esfuerzo.', 'Dolor o distension abdominal requiere revision.', ['abdomen', 'pared', 'core']),
    part('gluteals', 'Gluteos', [-1.34, 0.68, 0.44], 'Musculos de la cadera.', 'Lateral y dorsal de pelvis.', 'Extienden y abducen la cadera.', 'Atrofia puede verse en dolor cronico de cadera.', ['gluteos', 'cadera', 'propulsion']),
    part('quadriceps', 'Cuadriceps femoral', 'Musculus quadriceps femoris', [-1.18, 0.45, 0.72], 'Principal extensor de rodilla.', 'Parte craneal del muslo.', 'Extension de rodilla, salto y levantarse.', 'Atrofia asociada a luxacion patelar o lesion ligamentaria.', 'Contractura del cuádriceps, Atrofia secundaria a ruptura de LCA', ['cuadriceps', 'rodilla', 'extension']),
    part('hamstrings', 'Isquiotibiales', [-1.35, 0.42, 0.48], 'Biceps femoral, semitendinoso y semimembranoso.', 'Cara caudal del muslo.', 'Extension de cadera y flexion de rodilla.', 'Tirones afectan carrera y salto.', ['isquiotibiales', 'muslo', 'salto']),
    part('gastrocnemius', 'Gastrocnemio', [-1.18, 0.04, 0.62], 'Musculo de la pantorrilla.', 'Caudal a tibia, hacia tendon calcaneo.', 'Extension del tarso y propulsion.', 'Lesion del tendon calcaneo causa apoyo anormal.', ['tarso', 'tendon', 'propulsion']),
  ],
  nervous: [
    part('brain', 'Encefalo', [1.82, 1.27, 0.12], 'Centro de conducta, sentidos, movimiento y funciones autonomas.', 'Dentro del craneo.', 'Integra informacion y coordina respuestas del cuerpo.', 'Convulsiones, desorientacion o inclinacion de cabeza son signos relevantes.', ['encefalo', 'convulsiones', 'conducta']),
    part('cerebellum', 'Cerebelo', [1.54, 1.23, 0.08], 'Region coordinadora de equilibrio y precision motora.', 'Parte caudal del encefalo.', 'Coordina marcha, postura y movimientos finos.', 'Ataxia o temblores de intencion sugieren evaluacion neurologica.', ['cerebelo', 'ataxia', 'equilibrio']),
    part('spinal-cord', 'Medula espinal', [0.05, 1.14, 0.14], 'Cordones nerviosos dentro del canal vertebral.', 'Desde base del craneo hacia region lumbar/sacra.', 'Comunica encefalo con extremidades y organos.', 'Paralisis, dolor espinal o perdida de sensibilidad es urgente.', ['medula', 'reflejos', 'paralisis']),
    part('brachial-plexus', 'Plexo braquial', [0.62, 0.73, 0.34], 'Red nerviosa que inerva el miembro anterior.', 'Entrada toracica y axila.', 'Control motor y sensitivo de hombro, brazo y mano.', 'Trauma por traccion puede causar perdida de apoyo anterior.', ['plexo', 'miembro anterior', 'axila']),
    part('radial-nerve', 'Nervio radial', [0.62, 0.34, 0.66], 'Nervio clave para extension del miembro anterior.', 'Brazo y antebrazo lateral.', 'Extiende codo, carpo y dedos.', 'Lesion puede causar incapacidad para apoyar dorsalmente la pata.', ['radial', 'carpo', 'extension']),
    part('median-ulnar', 'Nervios mediano y ulnar', [0.74, 0.22, 0.5], 'Nervios distales del antebrazo.', 'Cara medial y caudal del miembro anterior.', 'Sensibilidad y control de flexores del carpo/dedos.', 'Dolor o deficits sensitivos alteran uso de la mano.', ['mediano', 'ulnar', 'dedos']),
    part('lumbosacral-plexus', 'Plexo lumbosacro', [-1.12, 0.72, 0.25], 'Red nerviosa para pelvis y miembro posterior.', 'Region lumbar caudal y sacra.', 'Controla muslos, pierna, pie y esfinteres.', 'Dolor lumbosacro puede causar debilidad posterior.', ['lumbosacro', 'pelvis', 'nervios']),
    part('sciatic', 'Nervio ciatico', [-1.25, 0.42, 0.46], 'Gran nervio del miembro posterior.', 'Sale de pelvis y baja por muslo.', 'Inerva grupos caudales y distales de la pata.', 'Dolor irradiado, arrastre de dedos o debilidad pueden involucrarlo.', ['ciatico', 'pata trasera', 'dolor']),
    part('femoral-nerve', 'Nervio femoral', [-1.08, 0.46, 0.63], 'Nervio motor del cuadriceps.', 'Region inguinal y craneal del muslo.', 'Extiende rodilla y aporta sensibilidad medial.', 'Lesion genera dificultad para sostener peso.', ['femoral', 'cuadriceps', 'rodilla']),
    part('facial-nerve', 'Nervio facial', [1.74, 1.05, 0.42], 'Nervio de expresion facial.', 'Lateral de la cabeza.', 'Control de parpado, labios y oreja.', 'Paralisis facial causa caida de labio o falta de parpadeo.', ['facial', 'parpado', 'oreja']),
  ],
  cardio: [
    part('heart', 'Corazon', 'Cor', [0.13, 0.77, 0.43], 'Bomba muscular de cuatro camaras.', 'Torax medio, ligeramente hacia la izquierda.', 'Impulsa sangre a pulmones y circulacion sistemica.', 'Tos, fatiga, sincopes o respiracion rapida pueden indicar cardiopatia.', 'Miocardiopatía dilatada, Insuficiencia mitral, Efusión pericárdica', ['corazon', 'soplo', 'pulso']),
    part('lungs', 'Pulmones', [0, 0.91, 0.29], 'Organos esponjosos de intercambio gaseoso.', 'A ambos lados del corazon dentro del torax.', 'Oxigenan sangre y eliminan CO2.', 'Esfuerzo respiratorio o mucosas azuladas son urgencias.', ['pulmones', 'oxigeno', 'urgencia']),
    part('trachea', 'Traquea', [1.04, 0.98, 0.24], 'Tubo cartilaginoso de via aerea.', 'Cuello ventral y entrada del torax.', 'Conduce aire hacia bronquios.', 'Tos seca puede asociarse a irritacion o colapso traqueal.', ['traquea', 'tos', 'via aerea']),
    part('aorta', 'Aorta', [-0.08, 0.96, 0.24], 'Arteria principal que sale del ventriculo izquierdo.', 'Dorsal al corazon y hacia abdomen.', 'Distribuye sangre oxigenada al cuerpo.', 'Alteraciones vasculares pueden comprometer perfusion sistemica.', ['arteria', 'aorta', 'sistemica']),
    part('pulmonary-artery', 'Arteria pulmonar', [0.25, 0.87, 0.36], 'Vaso que lleva sangre del ventriculo derecho a pulmones.', 'Base del corazon hacia pulmones.', 'Permite circulacion pulmonar.', 'Hipertension pulmonar afecta tolerancia al ejercicio.', ['arteria pulmonar', 'pulmones', 'corazon']),
    part('pulmonary-veins', 'Venas pulmonares', [0.03, 0.83, 0.24], 'Venas que regresan sangre oxigenada al atrio izquierdo.', 'Desde pulmones hacia corazon.', 'Cierre del circuito pulmonar.', 'Congestion pulmonar puede verse en enfermedad cardiaca.', ['venas pulmonares', 'oxigenada', 'atrio']),
    part('cranial-cava', 'Vena cava craneal', [0.62, 0.86, 0.22], 'Gran vena que drena cabeza, cuello y miembros anteriores.', 'Entrada craneal del torax.', 'Retorna sangre al atrio derecho.', 'Distension yugular puede relacionarse con presion venosa elevada.', ['vena cava', 'retorno', 'torax']),
    part('caudal-cava', 'Vena cava caudal', [-0.62, 0.72, 0.2], 'Gran vena que drena abdomen y miembros posteriores.', 'Abdomen dorsal hacia torax.', 'Retorno venoso al corazon.', 'Compromiso abdominal puede afectar retorno venoso.', ['vena cava', 'abdomen', 'retorno']),
    part('jugular-vein', 'Vena yugular externa', [1.15, 0.91, 0.48], 'Vena superficial importante del cuello.', 'Lateral del cuello.', 'Drena cabeza y se usa para venopuncion en clinica.', 'Distension, dolor o hematomas post puncion deben vigilarse.', ['vena', 'yugular', 'venopuncion']),
    part('carotid', 'Arteria carotida comun', [1.13, 0.88, 0.32], 'Arteria profunda del cuello hacia cabeza.', 'Cuello ventrolateral profundo.', 'Irriga encefalo y estructuras cefalicas.', 'Zona delicada; no debe manipularse sin conocimiento clinico.', ['arteria', 'carotida', 'cabeza']),
    part('subclavian-axillary', 'Subclavia y axilar', [0.57, 0.68, 0.45], 'Vasos mayores hacia miembro anterior.', 'Entrada toracica, axila y hombro.', 'Perfusion y retorno vascular del miembro anterior.', 'Traumas axilares pueden sangrar de forma importante.', ['arteria', 'vena', 'axila']),
    part('cephalic-vein', 'Vena cefalica', [0.69, 0.18, 0.72], 'Vena superficial usada para cateter IV.', 'Cara craneolateral del antebrazo.', 'Retorno venoso del miembro anterior.', 'Flebitis, hematoma o extravasacion son riesgos clinicos.', ['vena', 'cateter', 'antebrazo']),
    part('femoral-vessels', 'Arteria y vena femoral', [-1.12, 0.42, 0.55], 'Paquete vascular mayor del muslo.', 'Region inguinal y medial del muslo.', 'Irriga y drena el miembro posterior.', 'Pulso femoral ayuda a evaluar circulacion.', ['femoral', 'pulso', 'muslo']),
    part('saphenous-veins', 'Venas safenas', [-1.24, 0.04, 0.68], 'Venas superficiales de la extremidad posterior.', 'Medial y lateral de pierna/tarso.', 'Retorno venoso distal; utiles para puncion en algunos casos.', 'Hematomas o sangrado pueden ocurrir tras extraccion.', ['safena', 'vena', 'puncion']),
    part('portal-vein', 'Vena porta hepatica', [-0.18, 0.61, 0.22], 'Sistema venoso que lleva sangre intestinal al higado.', 'Abdomen craneal, entre intestino e higado.', 'Transporta nutrientes absorbidos para procesamiento hepatico.', 'Shunts portosistemicos causan signos neurologicos y crecimiento pobre.', ['porta', 'higado', 'nutrientes']),
  ],
  digestive: [
    part('esophagus', 'Esofago', [0.92, 0.78, 0.2], 'Tubo muscular que transporta alimento.', 'Cuello y torax dorsal a traquea.', 'Conduce bolo alimenticio al estomago.', 'Regurgitacion sugiere problema esofagico.', ['esofago', 'regurgitacion', 'torax']),
    part('stomach', 'Estomago', [-0.34, 0.61, 0.5], 'Camara digestiva acida.', 'Abdomen craneal, detras del diafragma.', 'Almacena, mezcla y regula salida al duodeno.', 'Distension con arcadas sin vomito puede ser torsion gastrica.', ['estomago', 'vomito', 'urgencia']),
    part('liver', 'Higado', [-0.06, 0.64, 0.26], 'Organo metabolico grande.', 'Abdomen craneal derecho.', 'Produce bilis, procesa nutrientes y participa en coagulacion.', 'Ictericia, letargo o abdomen aumentado requieren examen.', ['higado', 'bilis', 'ictericia']),
    part('gallbladder', 'Vesicula biliar', [-0.02, 0.55, 0.36], 'Reservorio de bilis.', 'Cara visceral del higado.', 'Libera bilis al intestino para digestion de grasas.', 'Obstruccion biliar puede causar ictericia y dolor.', ['vesicula', 'bilis', 'grasas']),
    part('pancreas', 'Pancreas', [-0.36, 0.52, 0.3], 'Glandula digestiva y endocrina.', 'Cerca de duodeno y estomago.', 'Produce enzimas digestivas e insulina.', 'Pancreatitis causa vomitos, dolor y decaimiento.', ['pancreas', 'enzimas', 'insulina']),
    part('spleen', 'Bazo', [-0.58, 0.66, 0.55], 'Organo linfoide y reservorio sanguineo.', 'Abdomen izquierdo, cercano al estomago.', 'Filtra sangre y participa en inmunidad.', 'Masas esplenicas pueden sangrar dentro del abdomen.', ['bazo', 'sangre', 'abdomen']),
    part('duodenum', 'Duodeno', [-0.48, 0.48, 0.45], 'Primera porcion del intestino delgado.', 'Abdomen derecho craneal a medio.', 'Recibe bilis y enzimas pancreaticas.', 'Inflamacion puede causar vomitos y dolor abdominal.', ['duodeno', 'enzimas', 'bilis']),
    part('jejunum-ileum', 'Yeyuno e ileon', [-0.82, 0.46, 0.43], 'Porciones largas de absorcion intestinal.', 'Abdomen medio.', 'Absorben nutrientes y agua.', 'Diarrea cronica o perdida de peso puede originarse aqui.', ['intestino delgado', 'absorcion', 'diarrea']),
    part('colon', 'Colon', [-1.02, 0.46, 0.25], 'Intestino grueso.', 'Abdomen caudal.', 'Absorbe agua y forma heces.', 'Moco, sangre fresca o tenesmo sugieren colitis.', ['colon', 'heces', 'colitis']),
    part('kidneys', 'Rinones', [-0.72, 0.79, 0.12], 'Organos que filtran sangre y producen orina.', 'Abdomen dorsal, a ambos lados.', 'Regulan agua, electrolitos y eliminan desechos.', 'Aumento de sed, perdida de peso o vomito puede indicar enfermedad renal.', ['rinon', 'orina', 'sed']),
    part('bladder', 'Vejiga urinaria', [-1.14, 0.34, 0.24], 'Reservorio de orina.', 'Abdomen caudal/pelvis.', 'Almacena orina antes de miccion.', 'Esfuerzo para orinar o sangre es motivo de consulta.', ['vejiga', 'orina', 'cistitis']),
    part('rectum-anus', 'Recto y ano', [-1.58, 0.42, 0.12], 'Tramo final del tracto digestivo.', 'Pelvis y region perineal.', 'Evacuacion y control fecal.', 'Sacos anales, diarrea o dolor perineal son problemas comunes.', ['ano', 'recto', 'sacos anales']),
  ],
  clinical: [
    part('eyes', 'Ojos', [1.9, 1.18, 0.32], 'Organos visuales expuestos a trauma, ulceras e infecciones.', 'Orbitas y parpados.', 'Vision, proteccion corneal y comunicacion.', 'Ojo rojo, cerrado o con secrecion requiere revision rapida.', ['ojo', 'cornea', 'secrecion']),
    part('ears', 'Oidos', [1.72, 1.54, 0.28], 'Pabellon y conducto auditivo externo.', 'Lateral y dorsal de la cabeza.', 'Audicion y equilibrio.', 'Sacudir cabeza, mal olor o picazon sugiere otitis.', ['otitis', 'oreja', 'picazon']),
    part('oral-mucosa', 'Mucosas orales', [2.07, 0.93, 0.34], 'Color y humedad de encias orientan perfusion e hidratacion.', 'Boca y encia.', 'Evaluacion rapida de circulacion y oxigenacion.', 'Mucosas palidas, azules o amarillas son alarma.', ['encias', 'perfusion', 'triage']),
    part('submandibular-ln', 'Ganglio submandibular', [1.54, 0.82, 0.42], 'Ganglio palpable de cabeza/cuello.', 'Bajo la mandibula.', 'Filtra linfa de boca, cara y cabeza.', 'Aumento puede indicar infeccion oral, inflamacion o neoplasia.', ['ganglio', 'mandibula', 'palpacion']),
    part('prescapular-ln', 'Ganglio preescapular', [0.82, 0.84, 0.5], 'Ganglio superficial de miembro anterior/cuello.', 'Delante de la escapula.', 'Filtra cuello y extremidad anterior.', 'Aumento persistente debe evaluarse.', ['ganglio', 'escapula', 'inmunidad']),
    part('axillary-ln', 'Ganglio axilar', [0.46, 0.54, 0.43], 'Ganglio profundo de la axila.', 'Axila.', 'Drena parte del torax y miembro anterior.', 'Dolor o aumento puede acompanar heridas o tumores mamarios.', ['axila', 'ganglio', 'torax']),
    part('inguinal-ln', 'Ganglio inguinal', [-0.95, 0.34, 0.46], 'Ganglio superficial en ingle.', 'Region inguinal.', 'Drena abdomen caudal, genitales y miembro posterior.', 'Aumentos se palpan en exploracion fisica.', ['ingle', 'ganglio', 'palpacion']),
    part('popliteal-ln', 'Ganglio popliteo', [-1.3, 0.16, 0.48], 'Ganglio palpable detras de la rodilla.', 'Cara caudal de la rodilla.', 'Drena distal del miembro posterior.', 'Aumento puede indicar infeccion o inflamacion distal.', ['popliteo', 'rodilla', 'ganglio']),
    part('vitals', 'Constantes vitales', [0.18, 0.78, 0.68], 'Temperatura, pulso, respiracion, mucosas e hidratacion.', 'Evaluacion general en torax, boca, piel y recto.', 'Indican estabilidad fisiologica y gravedad.', 'Orientativo: temperatura 38.0-39.2 C, respiracion 10-30/min en reposo; frecuencia cardiaca varia por tamano.', ['temperatura', 'pulso', 'respiracion']),
    part('skin-coat', 'Piel y pelaje', [-0.1, 1.25, 0.58], 'Barrera externa y primer indicador de alergias o parasitos.', 'Toda la superficie corporal.', 'Proteccion, termorregulacion y sensibilidad.', 'Alopecia, costras, heridas o prurito necesitan diagnostico.', ['piel', 'pelaje', 'alergia']),
  ],
}

export const allParts = Object.values(anatomyParts).flat()
