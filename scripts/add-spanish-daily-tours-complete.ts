/**
 * Complete Spanish translations for all existing daily tours
 * Run with: npx tsx scripts/add-spanish-daily-tours-complete.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SpanishTourTranslation {
  tourCode: string;
  titleEs: string;
  descriptionEs: string;
  includedEs?: string;
  excludedEs?: string;
  notesEs?: string;
}

const spanishTranslations: SpanishTourTranslation[] = [
  // Istanbul Tours
  {
    tourCode: 'T1',
    titleEs: 'Tour Imperial',
    descriptionEs: 'Comenzamos nuestro recorrido por el distrito de Sultanahmet, el corazón de la antigua Estambul, en Santa Sofía. Construida por Justiniano en el siglo VI d.C., esta impresionante estructura fue la iglesia más grande de la cristiandad hasta la construcción de San Pedro en Roma mil años después. Continuamos hacia la Mezquita Azul, una de las mezquitas más magníficas de Estambul, famosa por sus azulejos azules de Iznik. Visitamos el Hipódromo Bizantino, que una vez fue el centro de la vida deportiva y política de Constantinopla.',
    includedEs: 'Guía profesional de habla española\nTransporte en vehículo con aire acondicionado\nEntradas a todos los monumentos\nRecogida y regreso al hotel',
    excludedEs: 'Almuerzo\nBebidas\nPropinas\nGastos personales',
    notesEs: 'Vista modesta requerida para mezquitas\nLas mujeres deben cubrirse la cabeza\nSe requiere caminar moderadamente'
  },
  {
    tourCode: 'T1-T2',
    titleEs: 'Tour de Día Completo de la Ciudad Antigua',
    descriptionEs: 'Tour turístico de día completo por Estambul que incluye el Palacio de Topkapi, Santa Sofía, la Mezquita Azul, el Hipódromo y el Gran Bazar. Explore los tesoros históricos de la antigua Constantinopla y experimente la rica herencia cultural de Estambul. Visite el opulento Palacio de Topkapi donde residieron los sultanes otomanos durante siglos, admire la impresionante arquitectura de Santa Sofía y la Mezquita Azul, y navegue por el laberíntico Gran Bazar con sus miles de tiendas.',
    includedEs: 'Guía profesional certificado\nTransporte en vehículo con aire acondicionado\nEntradas a Palacio de Topkapi y Santa Sofía\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales\nEntrada al Harén (opcional)',
    notesEs: 'El Gran Bazar está cerrado los domingos\nVista modesta requerida para lugares religiosos\nSe recomienda calzado cómodo'
  },
  {
    tourCode: 'T2',
    titleEs: 'Esplendores Otomanos',
    descriptionEs: 'Comenzamos nuestro tour en el Palacio de Topkapi, que desde el siglo XV al XIX fue la residencia principal de los sultanes otomanos. El palacio es ahora un museo y alberga una exquisita colección que incluye joyas imperiales, porcelana china y japonesa, armas, armaduras y miniaturas. Visitamos las salas estatales y las cocinas reales, y disfrutamos de las impresionantes vistas del Bósforo desde los jardines del palacio. Continuamos hacia el Museo de Arqueología de Estambul, uno de los museos más ricos del mundo.',
    includedEs: 'Guía experto arqueólogo\nTransporte privado con aire acondicionado\nEntrada al Palacio de Topkapi\nEntrada al Museo Arqueológico\nRecogida y regreso al hotel',
    excludedEs: 'Almuerzo\nBebidas\nPropinas\nEntrada al Harén (opcional)\nGastos personales',
    notesEs: 'El Palacio de Topkapi está cerrado los martes\nSe requiere caminar considerablemente\nOportunidades excelentes para fotografías'
  },
  {
    tourCode: 'T3',
    titleEs: 'Crucero Matutino por el Bósforo',
    descriptionEs: 'Comenzamos con una breve visita al Mercado de Especias del siglo XVII, uno de los bazares más coloridos y bulliciosos de Estambul. Luego disfrutamos de un crucero panorámico por el Bósforo, el estrecho que separa Europa y Asia. Desde nuestro barco, admiramos las vistas del skyline de Estambul, magníficas mezquitas, el Palacio de Dolmabahce y el elegante Palacio de Beylerbeyi, así como las villas de madera tradicionales llamadas "yalis" que bordean las orillas.',
    includedEs: 'Crucero por el Bósforo de 2 horas\nGuía profesional\nVisita al Mercado de Especias\nTransporte en vehículo con aire acondicionado\nRecogida y regreso al hotel',
    excludedEs: 'Almuerzo\nBebidas\nPropinas\nGastos personales',
    notesEs: 'Disponible diariamente\nClima dependiente (puede cancelarse en mal tiempo)\nOportunidades excelentes para fotografías'
  },
  {
    tourCode: 'T3-T5',
    titleEs: 'Tour de Día Completo del Bósforo',
    descriptionEs: 'Comenzamos con una breve visita al Mercado de Especias del siglo XVII, uno de los bazares más coloridos y bulliciosos de Estambul. Luego disfrutamos de un crucero panorámico por el Bósforo. Visitamos el Palacio de Dolmabahce, la última residencia de los sultanes otomanos, con sus deslumbrantes candelabros de cristal y elaborados interiores. Continuamos hasta el lado asiático para explorar Üsküdar, uno de los barrios más antiguos de Estambul, antes de regresar al hotel.',
    includedEs: 'Crucero panorámico por el Bósforo\nGuía profesional certificado\nEntrada al Palacio de Dolmabahce\nVisita al Mercado de Especias\nAlmuerzo en restaurante local\nTransporte en vehículo con aire acondicionado',
    excludedEs: 'Bebidas\nPropinas\nGastos personales\nFotografías',
    notesEs: 'El Palacio de Dolmabahce está cerrado los lunes y jueves\nNo se permiten fotografías dentro del palacio\nVista modesta requerida'
  },
  {
    tourCode: 'T6',
    titleEs: 'Estambul de Noche',
    descriptionEs: 'Visitamos un exclusivo club nocturno donde disfrutaremos de auténtica cocina turca, incluyendo el delicioso mezze de entrantes turcos. Durante la cena, disfrutamos de un espectáculo de música y danzas folklóricas turcas de diferentes regiones de Anatolia, culminando con el famoso espectáculo de danza del vientre. Experimente la vibrante vida nocturna y la cultura de Estambul en un ambiente auténtico y entretenido.',
    includedEs: 'Transporte de ida y vuelta al hotel\nCena tradicional turca con bebidas ilimitadas (no alcohólicas)\nEspectáculos de danza folklórica turca\nEspectáculo de danza del vientre\nGuía acompañante',
    excludedEs: 'Bebidas alcohólicas\nPropinas\nGastos personales\nFotografías profesionales',
    notesEs: 'Código de vestimenta: elegante casual\nReservación requerida con anticipación\nDisponible todas las noches\nNo recomendado para niños pequeños'
  },
  {
    tourCode: 'T7',
    titleEs: 'Tour de Día Completo de las Islas Príncipe',
    descriptionEs: 'Si siente la necesidad de escapar del bullicio de Estambul por un día, nada podría ser más fácil. Simplemente aborde un ferry hacia las Islas Príncipe en el Mar de Mármara. En estas islas, el único transporte motorizado permitido son los vehículos de servicio, lo que las convierte en un refugio tranquilo. Visitamos Büyükada, la isla más grande, donde disfrutamos de un paseo en carruaje tirado por caballos alrededor de la isla, exploramos el monasterio de San Jorge en la cima de la colina y disfrutamos de tiempo libre para nadar o almorzar.',
    includedEs: 'Ferry de ida y vuelta\nPaseo en carruaje tirado por caballos\nGuía profesional\nAlmuerzo en restaurante de pescado local\nTransporte al muelle de ferry\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nActividades acuáticas adicionales\nGastos personales',
    notesEs: 'Disponible abril-octubre (temporada de verano)\nLleve traje de baño y toalla\nVehículos motorizados no permitidos en las islas\nAmbiente relajante y tranquilo'
  },

  // Cappadocia Tours
  {
    tourCode: 'CAP-1',
    titleEs: 'Tour de Día Completo de la Ciudad',
    descriptionEs: 'CIUDAD SUBTERRÁNEA DE DERINKUYU o KAYMAKLI, estas dos ciudades subterráneas fueron viviendas para los cristianos que huían de la persecución romana. Estas ciudades con múltiples niveles bajo tierra tienen establos para animales, cocinas, salas de almacenamiento y capillas. Continuamos hacia el Valle de Ihlara, un cañón de 14 km de profundidad tallado por el río Melendiz. Visitamos algunas de las numerosas iglesias rupestres pintadas escondidas en las paredes del cañón. Almuerzo en un restaurante local junto al río.',
    includedEs: 'Guía profesional de habla española\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Se requiere condición física moderada\nNo recomendado para personas con claustrofobia\nCalzado cómodo esencial\nTemperaturas frescas bajo tierra'
  },
  {
    tourCode: 'CAP-2',
    titleEs: 'Tour de Día Completo de la Ciudad',
    descriptionEs: 'Explore los cautivadores paisajes de Capadocia con un tour de día completo visitando formaciones rocosas únicas, ciudades subterráneas antiguas e iglesias rupestres históricas. Visite el Museo al Aire Libre de Göreme con sus frescos bizantinos magníficamente preservados, explore el Valle de Pasabag con sus chimeneas de hadas únicas y visite Avanos, famoso por su cerámica tradicional. Descubra la fascinante historia y belleza natural de esta región única declarada Patrimonio de la Humanidad por la UNESCO.',
    includedEs: 'Guía profesional certificado\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios incluidos el Museo de Göreme\nAlmuerzo en restaurante local\nDemostración de cerámica en Avanos\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nPaseo en globo aerostático (opcional)\nGastos personales',
    notesEs: 'Se requiere caminar moderadamente\nLleve sombrero y protector solar\nOportunidades excelentes para fotografías\nDisponible todo el año'
  },
  {
    tourCode: 'CAP-3',
    titleEs: 'Tour de Día Completo de la Ciudad',
    descriptionEs: 'Mustafa Pasa fue habitado por familias greco-ortodoxas hasta principios del siglo XX. Las casas de piedra en estilo arquitectónico griego se encuentran en calles estrechas y sinuosas. Visitamos la Iglesia de San Basilio con sus exquisitos frescos. Continuamos hacia el Valle de Soganli con sus numerosas iglesias rupestres e impresionantes formaciones de chimeneas de hadas. Exploramos las iglesias con frescos bien preservados y disfrutamos de las vistas panorámicas de este valle menos visitado pero igualmente impresionante.',
    includedEs: 'Guía experto en historia del arte\nTransporte privado con aire acondicionado\nEntradas a todas las iglesias y museos\nAlmuerzo en restaurante local tradicional\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Tour fuera de las rutas turísticas habituales\nSe requiere caminar considerable\nMenos concurrido que otros valles\nMejor para entusiastas de la historia'
  },
  {
    tourCode: 'CAP-4',
    titleEs: 'Paseo en Globo Aerostático',
    descriptionEs: 'Contemple la belleza de Capadocia desde un globo aerostático de flotación suave, ofreciendo una vista de pájaro de este fascinante paisaje. Vuele al amanecer sobre valles, chimeneas de hadas y pueblos antiguos mientras el sol pinta el cielo con colores espectaculares. Esta experiencia inolvidable dura aproximadamente una hora y es seguida por una ceremonia de celebración con champán. Los globos aerostáticos de Capadocia son considerados entre los mejores del mundo debido al paisaje único y las condiciones ideales de vuelo.',
    includedEs: 'Vuelo en globo aerostático de 1 hora\nDesayuno ligero antes del vuelo\nCeremonia de champán y certificado de vuelo\nSeguro de vuelo\nTransporte de ida y vuelta al hotel\nPiloto experimentado y certificado',
    excludedEs: 'Propinas\nFotografías y videos profesionales (opcionales)\nGastos personales',
    notesEs: 'Sujeto a condiciones climáticas\nReservación temprana recomendada\nNo recomendado para mujeres embarazadas\nEdad mínima: 6 años\nSalida muy temprano en la mañana (antes del amanecer)'
  },

  // Kusadasi/Ephesus Tours
  {
    tourCode: 'KUS-01',
    titleEs: 'Día Completo Éfeso / Virgen María',
    descriptionEs: 'El tour incluye una visita a la Casa de la Virgen María y la ciudad de Éfeso. Éfeso es significativa en la historia cristiana ya que fue visitada por San Pablo y se cree que fue el último hogar de la Virgen María. Camine por las calles de mármol de esta antigua metrópolis greco-romana, visite la magnífica Biblioteca de Celso, el Gran Teatro con capacidad para 24,000 espectadores, y explore los Baños Romanos. Continúe hasta la Casa de la Virgen María, un pequeño santuario donde se cree que María pasó sus últimos años.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a Éfeso y Casa de la Virgen María\nAlmuerzo en restaurante local\nRecogida del puerto de cruceros o hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Se requiere caminar considerable por terreno irregular\nCalzado cómodo esencial\nLleve sombrero y agua\nHorarios flexibles para pasajeros de cruceros'
  },
  {
    tourCode: 'KUS-02',
    titleEs: 'Tour de Día Completo – Éfeso, Sirince, Templo de Artemisa (Diana)',
    descriptionEs: 'Nuestro guía le acompañará en los sitios de Éfeso, informándole sobre la historia de las estructuras romanas sobresalientes. Visite la Biblioteca de Celso, el Odeón, el Gran Teatro y las Casas en Terraza. Continúe hasta Sirince, un encantador pueblo conocido por sus vinos de frutas y arquitectura tradicional. Visite el Templo de Artemisa, una de las Siete Maravillas del Mundo Antiguo. Aprenda sobre la rica historia de la región y experimente la auténtica vida del pueblo turco.',
    includedEs: 'Guía certificado de habla española\nTransporte en vehículo con aire acondicionado\nEntradas a Éfeso y Casas en Terraza\nAlmuerzo en Sirince\nDegustación de vino en Sirince\nRecogida y regreso al hotel/puerto',
    excludedEs: 'Bebidas adicionales\nPropinas\nCompras personales\nGastos personales',
    notesEs: 'Se requiere caminar moderadamente\nOportunidades de compras en Sirince\nDisponible para pasajeros de cruceros\nDegustación de vinos de frutas locales incluida'
  },
  {
    tourCode: 'KUS-03',
    titleEs: 'Día Completo Pamukkale / Hierápolis',
    descriptionEs: 'Recogida de su hotel y conducción a Pamukkale, el "Castillo de Algodón" de Turquía. Explore las deslumbrantes terrazas blancas de travertino formadas por aguas termales ricas en minerales durante miles de años. Camine descalzo por las piscinas de color turquesa mientras disfruta de vistas espectaculares. Visite las antiguas ruinas de Hierápolis, una ciudad balneario greco-romana con un teatro magníficamente preservado, necrópolis extensa y baños termales. Opcionalmente, nade en la Piscina de Cleopatra con columnas romanas sumergidas.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a Pamukkale y Hierápolis\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Entrada a la Piscina de Cleopatra (opcional)\nBebidas\nPropinas\nGastos personales',
    notesEs: 'Lleve traje de baño y toalla\nEl calzado no está permitido en los travertinos\nLleve protector solar\nViaje largo (aproximadamente 3 horas cada trayecto)'
  },
  {
    tourCode: 'KUS-04',
    titleEs: 'Tour de Día Completo – Pérgamo, Acrópolis, Basílica Roja',
    descriptionEs: 'Recogida del hotel/aeropuerto y salida hacia Pérgamo que está en la actual Bergama. Pérgamo fue una de las ciudades más importantes del mundo antiguo y rivalizó con Alejandría por el dominio cultural. Visitamos la Acrópolis en la cima de la colina con su impresionante teatro empinado, el Templo de Trajano y la famosa Biblioteca. Continuamos hacia la Basílica Roja, un enorme templo romano convertido en basílica cristiana. Explore el Asclepeion, un antiguo centro de curación médica considerado el primer hospital del mundo.',
    includedEs: 'Guía experto arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios arqueológicos\nAlmuerzo en restaurante local\nRecogida y regreso al hotel/aeropuerto',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Se requiere caminar considerable, incluyendo subida a la Acrópolis\nCalzado cómodo esencial\nOportunidades excelentes para fotografías\nMenos concurrido que Éfeso'
  },
  {
    tourCode: 'KUS-05',
    titleEs: 'Día Completo Priene / Mileto / Dídima',
    descriptionEs: 'Salida hacia Priene que se encuentra aproximadamente a 20 km (12 millas) de Kusadasi. Es la primera ciudad planificada en cuadrícula del mundo. Visite el Templo de Atenea, el teatro y el estadio. Continúe a Mileto, una vez la ciudad jónica más poderosa y lugar de nacimiento de varios filósofos antiguos. Explore el impresionante teatro romano con capacidad para 15,000 espectadores. Termine en Dídima para visitar el magnífico Templo de Apolo, uno de los templos más grandes del mundo antiguo con columnas colosales aún en pie.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios arqueológicos\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Tour fuera de las rutas habituales\nSe requiere caminar moderadamente\nMenos turístico pero igualmente impresionante\nIdeal para entusiastas de la historia antigua'
  },
  {
    tourCode: 'KUS-06',
    titleEs: 'Tour de Día Completo de la Ciudad de Esmirna',
    descriptionEs: '¿Está listo para descubrir la tercera ciudad más grande de Turquía con nosotros? Esmirna, la perla del Egeo turco que fue fundada por los griegos y ha sido un importante puerto comercial a lo largo de su historia. Visitamos el Ágora de Esmirna, un mercado antiguo del período romano, subimos al Castillo de Kadifekale para vistas panorámicas de la bahía, exploramos el histórico Kemeraltı Bazaar para experiencias de compras auténticas y visitamos el Museo Arqueológico. Descubra esta vibrante ciudad cosmopolita donde la historia se encuentra con la modernidad.',
    includedEs: 'Guía profesional certificado\nTransporte en vehículo con aire acondicionado\nEntradas a todos los museos y sitios\nAlmuerzo en restaurante local tradicional\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nCompras personales\nGastos personales',
    notesEs: 'Ciudad cosmopolita y moderna\nOportunidades excelentes de compras\nVida local auténtica\nSe requiere caminar moderadamente'
  },
  {
    tourCode: 'KUS-07',
    titleEs: 'Tour de Medio Día - Pueblo de Sirince',
    descriptionEs: 'Sirince verdaderamente merece su nombre ya que significa pueblo bonito. Este es un pequeño y pintoresco pueblo de 600 habitantes ubicado en las colinas sobre Selçuk. Conocido por sus vinos de frutas, aceite de oliva y arquitectura tradicional otomana, Sirince ofrece una escapada pacífica de los sitios turísticos abarrotados. Pasee por calles empedradas, visite la iglesia de San Juan Bautista, pruebe vinos de frutas locales (melocotón, manzana, granada) y compre artesanías hechas a mano. Disfrute de tiempo libre para almorzar en un restaurante local con vistas panorámicas.',
    includedEs: 'Guía profesional\nTransporte en vehículo con aire acondicionado\nDegustación de vino de frutas\nRecogida y regreso al hotel',
    excludedEs: 'Almuerzo\nBebidas adicionales\nPropinas\nCompras personales\nGastos personales',
    notesEs: 'Tour relajante de medio día\nOportunidades excelentes para fotografías\nCompras de productos locales\nAmbiente de pueblo auténtico'
  },
  {
    tourCode: 'KUS-08',
    titleEs: 'Tour de Medio Día – Éfeso, Templo de Artemisa (Diana)',
    descriptionEs: 'Nuestro guía le acompañará en los sitios de Éfeso, informándole sobre la historia de las estructuras romanas sobresalientes. Visite la Biblioteca de Celso, uno de los edificios más hermosos e icónicos de Éfeso, el Gran Teatro donde San Pablo predicó, y camine por las calles de mármol donde alguna vez caminaron emperadores romanos. Visite el Templo de Artemisa, una de las Siete Maravillas del Mundo Antiguo. Este tour de medio día es perfecto para pasajeros de cruceros o visitantes con tiempo limitado.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntrada a Éfeso\nRecogida del puerto de cruceros o hotel\nRegreso al puerto/hotel',
    excludedEs: 'Almuerzo\nBebidas\nPropinas\nEntrada a las Casas en Terraza (opcional)\nGastos personales',
    notesEs: 'Ideal para pasajeros de cruceros\nDuración: aproximadamente 4 horas\nHorarios flexibles disponibles\nSe requiere caminar moderadamente'
  },

  // Antalya Tours
  {
    tourCode: 'ANT-1',
    titleEs: 'Perge - Aspendos - Kursunlu',
    descriptionEs: 'Salida por la mañana y conducción a Perge, originalmente establecida por los hititas alrededor del 1500 a.C., luego una importante ciudad greco-romana. Camine por las antiguas calles columnadas, visite el estadio bien preservado y el teatro. Continúe a Aspendos para ver el teatro romano mejor preservado del mundo antiguo, todavía utilizado para actuaciones hoy en día con su acústica perfecta. Termine con una visita relajante a las Cascadas de Kursunlu, ubicadas en un hermoso bosque de pinos con piscinas turquesas y abundante vida silvestre.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios arqueológicos\nEntrada a las Cascadas de Kursunlu\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales',
    notesEs: 'Combinación de sitios históricos y naturales\nSe requiere caminar moderadamente\nLleve calzado cómodo\nOportunidades excelentes para fotografías'
  },
  {
    tourCode: 'ANT-2',
    titleEs: 'Demre - Kekova Tour de Día Completo',
    descriptionEs: 'Salida por la mañana y llegada a Demre para visitar los mejores ejemplos de tumbas licias en Myra y la antigua Iglesia de San Nicolás, el Santa Claus original. Explore el impresionante teatro tallado en roca y las tumbas licias únicas talladas en acantilados. Continúe a Kekova para un crucero en barco sobre la ciudad sumergida, parcialmente visible bajo las aguas cristalinas debido a terremotos antiguos. Disfrute de nadar en bahías apartadas y visite el encantador pueblo de Simena con su castillo medieval.',
    includedEs: 'Guía profesional certificado\nTransporte en vehículo con aire acondicionado\nCrucero en barco en Kekova\nEntradas a todos los sitios\nAlmuerzo en barco o restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nEquipo de snorkel (disponible para alquilar)\nGastos personales',
    notesEs: 'Lleve traje de baño y toalla\nProtector solar y sombrero recomendados\nCombinación de historia y belleza natural\nDisponible abril-octubre'
  },
  {
    tourCode: 'ANT-03',
    titleEs: 'Safari en Jeep',
    descriptionEs: 'Una emocionante conducción de día completo por las carreteras pintorescas de la cordillera del Tauro, brindándole la oportunidad de experimentar pueblos rurales auténticos, paisajes espectaculares de montaña y belleza natural. Viaje en jeeps todoterreno a través de senderos polvorientos, cruce arroyos de montaña y visite aldeas tradicionales donde el tiempo parece haberse detenido. Disfrute de un almuerzo tradicional en un pueblo de montaña, nade en piscinas naturales de agua dulce y experimente la hospitalidad turca auténtica. Esta aventura incluye paradas fotográficas en miradores espectaculares.',
    includedEs: 'Vehículo jeep todoterreno con conductor experto\nGuía profesional\nAlmuerzo en pueblo de montaña\nPara refrescarse en piscinas naturales\nSeguro\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas alcohólicas\nPropinas\nGastos personales\nEquipo fotográfico profesional',
    notesEs: 'Aventura emocionante, caminos polvorientos\nNo recomendado para problemas de espalda\nLleve ropa cómoda que pueda ensuciarse\nProtector solar y sombrero esenciales\nEdad mínima: 7 años'
  },
  {
    tourCode: 'ANT-4',
    titleEs: 'Tour de la Ciudad de Antalya',
    descriptionEs: 'Salida del hotel para el tour de día completo de la ciudad y conducción a las Cascadas de Karpuz Kaldıran donde las cataratas se encuentran con el Mediterráneo en un espectáculo espectacular. Explore el encantador casco antiguo de Kaleiçi con sus calles empedradas estrechas, casas otomanas bellamente restauradas y murallas antiguas. Visite la Puerta de Adriano, el Minarete Yivli y el pintoresco puerto antiguo. Disfrute de tiempo libre para compras en el bazar o relajarse en un café con vista al Mediterráneo. Termine con una visita al Museo de Antalya, uno de los mejores museos arqueológicos de Turquía.',
    includedEs: 'Guía profesional certificado\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios y museos\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nCompras personales\nGastos personales',
    notesEs: 'Combinación perfecta de historia, cultura y naturaleza\nOportunidades excelentes de compras\nCalzado cómodo para caminar recomendado\nDisponible todo el año'
  }
];

async function addSpanishTranslations() {
  console.log('🚀 Starting comprehensive Spanish translation update for daily tours...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];
  const notFound: string[] = [];

  for (const translation of spanishTranslations) {
    try {
      // Check if tour exists
      const existingTour = await prisma.dailyTour.findUnique({
        where: { tourCode: translation.tourCode },
      });

      if (!existingTour) {
        console.log(`⚠️  Tour ${translation.tourCode} not found, skipping...`);
        errorCount++;
        notFound.push(translation.tourCode);
        continue;
      }

      // Update tour with Spanish translations
      await prisma.dailyTour.update({
        where: { tourCode: translation.tourCode },
        data: {
          titleEs: translation.titleEs,
          descriptionEs: translation.descriptionEs,
          includedEs: translation.includedEs,
          excludedEs: translation.excludedEs,
          notesEs: translation.notesEs,
        },
      });

      console.log(`✅ Updated ${translation.tourCode}: ${translation.titleEs}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating ${translation.tourCode}:`, error);
      errorCount++;
      errors.push(`${translation.tourCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 COMPREHENSIVE TRANSLATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successfully translated: ${successCount} tours`);
  console.log(`❌ Errors/Not Found: ${errorCount}`);
  console.log(`📝 Total tours processed: ${spanishTranslations.length}`);

  if (notFound.length > 0) {
    console.log('\n⚠️  Tours not found in database:');
    notFound.forEach(code => console.log(`   - ${code}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n✨ Spanish translation update completed!\n');
  console.log('Note: Tours with Spanish content will display in Spanish when locale=es');
  console.log('English content will be used as fallback when Spanish not available.\n');
}

// Run the script
addSpanishTranslations()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
