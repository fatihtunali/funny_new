/**
 * Script to add Spanish translations to existing destinations
 * Run with: npx tsx scripts/add-spanish-destinations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SpanishDestination {
  slug: string;
  nameEs: string;
  descriptionEs: string;
  attractionsEs: Array<{
    name: string;
    description: string;
    image: string;
    duration: string;
  }>;
  experiencesEs: string[];
  bestTimeToVisitEs?: string;
  gettingThereEs?: string;
  metaTitleEs: string;
  metaDescriptionEs: string;
}

const spanishDestinations: SpanishDestination[] = [
  {
    slug: 'istanbul',
    nameEs: 'Estambul',
    descriptionEs: 'Descubra la ciudad mágica donde Oriente se encuentra con Occidente, con sus impresionantes mezquitas, vibrantes bazares y pintorescos cruceros por el Bósforo',
    attractionsEs: [
      {
        name: 'Mezquita Azul',
        description: 'Obra maestra arquitectónica del siglo XVII con impresionantes azulejos azules y seis minaretes',
        image: '/images/BlueMosqueIstanbul6minarets.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Santa Sofía',
        description: 'Antigua basílica bizantina y mezquita otomana, ahora museo, símbolo de la rica historia de Estambul',
        image: '/images/ayasofya.jpg',
        duration: '2 horas'
      },
      {
        name: 'Gran Bazar',
        description: 'Uno de los mercados cubiertos más grandes y antiguos del mundo con más de 4.000 tiendas',
        image: '/images/grand-bazaar.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Palacio de Topkapi',
        description: 'Antiguo palacio de los sultanes otomanos con impresionantes tesoros y vistas al Bósforo',
        image: '/images/topkapi-palace.jpg',
        duration: '2-3 horas'
      }
    ],
    experiencesEs: [
      'Crucero por el Bósforo al atardecer',
      'Experiencia de baño turco tradicional en un hammam histórico',
      'Degustación de auténtica cocina turca en restaurantes locales',
      'Compras de alfombras, especias y artesanías en bazares tradicionales',
      'Espectáculos de danza de derviche giratorio',
      'Paseo por el histórico barrio de Sultanahmet'
    ],
    bestTimeToVisitEs: 'La mejor época para visitar Estambul es en primavera (abril-mayo) y otoño (septiembre-noviembre) cuando el clima es agradable y hay menos turistas. Los veranos pueden ser calurosos y húmedos, mientras que los inviernos son fríos y lluviosos.',
    gettingThereEs: 'Estambul cuenta con dos aeropuertos principales: Aeropuerto de Estambul (IST) en el lado europeo y Aeropuerto Sabiha Gökçen (SAW) en el lado asiático. El transporte público incluye tranvía, metro, autobús y ferry. Los taxis están ampliamente disponibles.',
    metaTitleEs: 'Visitar Estambul - Tours y Excursiones | Funny Tourism',
    metaDescriptionEs: 'Explore la fascinante ciudad de Estambul con nuestros tours guiados. Visite la Mezquita Azul, Santa Sofía, el Gran Bazar y más. Reserve su aventura turca hoy.'
  },
  {
    slug: 'cappadocia',
    nameEs: 'Capadocia',
    descriptionEs: 'Experimente el paisaje surrealista de chimeneas de hadas y disfrute de un impresionante paseo en globo aerostático sobre esta región única',
    attractionsEs: [
      {
        name: 'Paseos en Globo Aerostático',
        description: 'Vuelo al amanecer sobre chimeneas de hadas y valles únicos para una experiencia inolvidable',
        image: '/images/cappadociaballoonride.jpg',
        duration: '3-4 horas'
      },
      {
        name: 'Göreme',
        description: 'Museo al aire libre con iglesias rupestres bizantinas y frescos magníficos',
        image: '/images/goreme.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Ciudades Subterráneas',
        description: 'Antiguas ciudades subterráneas de varios niveles utilizadas por cristianos primitivos',
        image: '/images/underground-city.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Hoteles Cueva',
        description: 'Alojamientos únicos tallados en formaciones rocosas naturales con comodidades modernas',
        image: '/images/cave-hotel.jpg',
        duration: 'Estadía nocturna'
      }
    ],
    experiencesEs: [
      'Paseo en globo aerostático al amanecer sobre chimeneas de hadas',
      'Exploración de antiguos asentamientos trogloditas',
      'Alojamiento en auténticos hoteles cueva',
      'Tours en ATV por los valles del Amor y Rosa',
      'Sesiones de alfarería tradicional turca',
      'Cenas con espectáculo de danza folklórica'
    ],
    bestTimeToVisitEs: 'La mejor época para visitar Capadocia es de abril a junio y de septiembre a octubre. El clima es ideal para paseos en globo aerostático. Los inviernos pueden ser fríos con nieve, creando paisajes mágicos. Evite julio-agosto si es sensible al calor.',
    gettingThereEs: 'Los aeropuertos más cercanos son Kayseri (70 km) y Nevşehir (40 km). El transporte se organiza típicamente a través de hoteles o agencias de turismo. Alquilar un coche proporciona flexibilidad para explorar la región.',
    metaTitleEs: 'Tours en Capadocia - Paseos en Globo y Hoteles Cueva | Funny Tourism',
    metaDescriptionEs: 'Descubra la mágica Capadocia con paseos en globo aerostático, ciudades subterráneas y hoteles cueva únicos. Reserve su tour guiado de Capadocia hoy.'
  },
  {
    slug: 'antalya',
    nameEs: 'Antalya',
    descriptionEs: 'Disfrute de la combinación perfecta de hermosas playas, ruinas antiguas y un encantador casco antiguo en este paraíso mediterráneo',
    attractionsEs: [
      {
        name: 'Kaleiçi (Casco Antiguo)',
        description: 'Barrio histórico con calles estrechas, casas otomanas y el antiguo puerto',
        image: '/images/AntalyaOldCity.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Cascadas Düden',
        description: 'Espectaculares cascadas que caen al mar Mediterráneo',
        image: '/images/duden-falls.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Ruinas Antiguas',
        description: 'Teatros romanos, templos y ruinas cercanas como Perge y Aspendos',
        image: '/images/ancient-ruins.jpg',
        duration: '2-4 horas'
      },
      {
        name: 'Hermosas Playas',
        description: 'Extensas playas de arena con aguas cristalinas del Mediterráneo',
        image: '/images/antalya-beach.jpg',
        duration: 'Día completo'
      }
    ],
    experiencesEs: [
      'Relajación en playas de arena dorada',
      'Cruceros en barco a lo largo de la costa turquesa',
      'Exploración del casco antiguo histórico',
      'Visita a ruinas antiguas cercanas',
      'Degustación de mariscos mediterráneos frescos',
      'Deportes acuáticos y buceo'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a octubre para actividades de playa. Mayo-junio y septiembre-octubre ofrecen clima cálido con menos multitudes. El verano (julio-agosto) es el más concurrido. Los inviernos son suaves pero lluviosos.',
    gettingThereEs: 'El Aeropuerto de Antalya (AYT) es el segundo aeropuerto más concurrido de Turquía con vuelos internacionales. El tranvía y los autobuses conectan el aeropuerto con la ciudad. Los taxis y servicios de traslado están ampliamente disponibles.',
    metaTitleEs: 'Tours en Antalya - Playas y Ruinas Antiguas | Funny Tourism',
    metaDescriptionEs: 'Explore Antalya con nuestros tours guiados. Disfrute de hermosas playas, visite el casco antiguo histórico y descubra ruinas antiguas. Reserve ahora.'
  },
  {
    slug: 'kusadasi',
    nameEs: 'Kuşadası',
    descriptionEs: 'Vibrante ciudad costera, puerta de entrada a la Antigua Éfeso con hermosas playas y bulliciosos bazares',
    attractionsEs: [
      {
        name: 'Antigua Éfeso',
        description: 'Una de las ciudades antiguas mejor preservadas con la Biblioteca de Celso',
        image: '/images/Ephesus_Library.jpg',
        duration: '3-4 horas'
      },
      {
        name: 'Casa de la Virgen María',
        description: 'Lugar sagrado de peregrinación donde se cree que María pasó sus últimos días',
        image: '/images/MeryemAnaEvi.jpeg',
        duration: '1 hora'
      },
      {
        name: 'Isla de las Palomas',
        description: 'Pintoresca isla conectada por un puente con un castillo bizantino',
        image: '/images/pigeon-island.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Playa de las Damas',
        description: 'Playa popular con arena dorada y aguas cristalinas del Egeo',
        image: '/images/ladies-beach.jpg',
        duration: 'Medio día'
      }
    ],
    experiencesEs: [
      'Exploración de ruinas antiguas de Éfeso',
      'Peregrinación a la Casa de la Virgen María',
      'Compras en el bazar tradicional turco',
      'Relajación en playas del Egeo',
      'Cruceros en barco a islas griegas cercanas',
      'Degustación de cocina turca local'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a octubre para clima de playa. Abril-mayo y septiembre-octubre son ideales para tours con temperaturas agradables. Los veranos son calurosos pero perfectos para actividades de playa. Los inviernos son suaves pero más tranquilos.',
    gettingThereEs: 'Kuşadası está a 90 km del Aeropuerto Adnan Menderes de Esmirna (ADB). Los traslados se organizan fácilmente. También es un popular puerto de cruceros con instalaciones de atraque en el centro de la ciudad.',
    metaTitleEs: 'Tours en Kuşadası - Éfeso y Playas del Egeo | Funny Tourism',
    metaDescriptionEs: 'Visite Kuşadası y explore la antigua Éfeso, la Casa de la Virgen María y hermosas playas. Reserve su tour del Egeo turco hoy.'
  },
  {
    slug: 'ephesus',
    nameEs: 'Éfeso',
    descriptionEs: 'Camine por la historia en una de las ciudades antiguas mejor conservadas del Mediterráneo',
    attractionsEs: [
      {
        name: 'Biblioteca de Celso',
        description: 'Icónica fachada de biblioteca romana, una de las estructuras más fotografiadas',
        image: '/images/Ephesus_Library.jpg',
        duration: '30 minutos'
      },
      {
        name: 'Gran Teatro',
        description: 'Antiguo anfiteatro de 25.000 asientos con excelente acústica',
        image: '/images/ephesus-theater.jpg',
        duration: '45 minutos'
      },
      {
        name: 'Templo de Artemisa',
        description: 'Sitio de una de las Siete Maravillas del Mundo Antiguo',
        image: '/images/artemis-temple.jpg',
        duration: '30 minutos'
      },
      {
        name: 'Casas Terraza',
        description: 'Casas romanas de lujo con magníficos mosaicos y frescos',
        image: '/images/terrace-houses.jpg',
        duration: '1 hora'
      }
    ],
    experiencesEs: [
      'Caminata por calles de mármol antiguas',
      'Maravillarse con la arquitectura romana',
      'Visita a casas romanas lujosamente decoradas',
      'Aprendizaje sobre la historia cristiana primitiva',
      'Fotografía de monumentos icónicos',
      'Tour guiado con guías arqueólogos expertos'
    ],
    bestTimeToVisitEs: 'La mejor época es de marzo a mayo y de septiembre a noviembre. Las temperaturas son moderadas para caminar por el sitio arqueológico. Evite julio-agosto debido al calor extremo. Llegue temprano en la mañana para evitar multitudes y calor.',
    gettingThereEs: 'Éfeso está cerca de Selçuk, a 80 km del Aeropuerto de Esmirna. Las excursiones organizadas desde Kuşadası, Esmirna o Éfeso proporcionan transporte. El sitio está a 3 km de Selçuk, accesible en taxi o autobús.',
    metaTitleEs: 'Tour de la Antigua Éfeso - Biblioteca de Celso | Funny Tourism',
    metaDescriptionEs: 'Explore la antigua ciudad de Éfeso con tours guiados. Visite la Biblioteca de Celso, el Gran Teatro y las Casas Terraza. Reserve hoy.'
  },
  {
    slug: 'pamukkale',
    nameEs: 'Pamukkale',
    descriptionEs: 'Maravíllese con las terrazas de travertino blanco y el antiguo spa de Hierápolis en esta maravilla natural de Turquía',
    attractionsEs: [
      {
        name: 'Terrazas de Travertino',
        description: 'Impresionantes formaciones de piedra caliza blanca llenas de aguas termales turquesas',
        image: '/images/PamukkaleTravertenler.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Hierápolis',
        description: 'Ciudad antigua con teatro, necrópolis y complejo de baños bien conservados',
        image: '/images/hierapolis.jpg',
        duration: '2 horas'
      },
      {
        name: 'Piscinas Termales',
        description: 'Baños naturales de aguas termales con propiedades curativas',
        image: '/images/thermal-pools.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Piscina de Cleopatra',
        description: 'Antigua piscina con columnas romanas sumergidas y aguas termales',
        image: '/images/cleopatra-pool.jpg',
        duration: '1-2 horas'
      }
    ],
    experiencesEs: [
      'Caminar descalzo por terrazas de travertino blanco',
      'Baño en piscinas termales naturales',
      'Exploración de ruinas antiguas de Hierápolis',
      'Natación en la piscina de Cleopatra',
      'Fotografía de formaciones únicas de paisaje',
      'Relajación en spa de aguas termales terapéuticas'
    ],
    bestTimeToVisitEs: 'La mejor época es de marzo a mayo y de septiembre a noviembre. El clima es agradable para caminar por las terrazas. Los veranos son muy calurosos pero los amaneceres y atardeceres son mágicos. Evite los meses de invierno más fríos.',
    gettingThereEs: 'El aeropuerto más cercano es Denizli Çardak (70 km de distancia). Los traslados en autobús desde las principales ciudades turcas están disponibles. Los tours organizados desde Kusadasi o Antalya incluyen transporte.',
    metaTitleEs: 'Tour de Pamukkale - Terrazas de Travertino Blanco | Funny Tourism',
    metaDescriptionEs: 'Visite Pamukkale y Hierápolis con tours guiados. Camine por terrazas de travertino, nade en la piscina de Cleopatra y explore ruinas antiguas.'
  },
  {
    slug: 'fethiye',
    nameEs: 'Fethiye',
    descriptionEs: 'Experimente emocionantes aventuras de parapente, hermosas playas y aguas cristalinas en esta joya costera',
    attractionsEs: [
      {
        name: 'Playa Ölüdeniz',
        description: 'Playa icónica de la Laguna Azul con aguas turquesas tranquilas',
        image: '/images/fethiye-paragliding.jpg',
        duration: 'Día completo'
      },
      {
        name: 'Parapente',
        description: 'Vuelo en tándem desde la montaña Babadağ sobre la Laguna Azul',
        image: '/images/paragliding.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Laguna Azul',
        description: 'Laguna protegida con aguas turquesas perfectas para nadar',
        image: '/images/blue-lagoon.jpg',
        duration: 'Medio día'
      },
      {
        name: 'Valle de las Mariposas',
        description: 'Bahía aislada accesible solo por barco, hogar de especies de mariposas raras',
        image: '/images/butterfly-valley.jpg',
        duration: 'Medio día'
      }
    ],
    experiencesEs: [
      'Aventura de parapente desde 1.969 metros',
      'Cruceros en barco a bahías aisladas',
      'Exploración de tumbas antiguas de Licia',
      'Relajación en la playa de la Laguna Azul',
      'Senderismo por el Camino Licio',
      'Baño en el cañón de Saklıkent'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a octubre para actividades de playa y parapente. Junio-septiembre ofrece clima perfecto para deportes acuáticos. Abril-mayo y octubre son ideales para senderismo con temperaturas más frescas.',
    gettingThereEs: 'El Aeropuerto de Dalaman (DLM) está a 45 km de distancia. Los traslados en autobús y privados están disponibles. Fethiye está bien conectada por autobuses desde las principales ciudades turcas. Los barcos llegan desde islas griegas cercanas.',
    metaTitleEs: 'Tours en Fethiye - Parapente y Playa Ölüdeniz | Funny Tourism',
    metaDescriptionEs: 'Experimente Fethiye con parapente, la Laguna Azul y hermosas playas. Reserve su aventura en la costa turquesa hoy.'
  },
  {
    slug: 'marmaris',
    nameEs: 'Mármaris',
    descriptionEs: 'Explore el hermoso puerto deportivo, disfrute de deportes acuáticos y descubra la vibrante vida nocturna de este popular balneario costero',
    attractionsEs: [
      {
        name: 'Puerto Deportivo de Mármaris',
        description: 'Puerto deportivo moderno con yates de lujo, tiendas y restaurantes',
        image: '/images/FethiyeMarina.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Castillo de Mármaris',
        description: 'Fortaleza histórica con museo y vistas panorámicas de la bahía',
        image: '/images/marmaris-castle.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Clubes de Playa',
        description: 'Playas modernas con deportes acuáticos y entretenimiento',
        image: '/images/beach-club.jpg',
        duration: 'Día completo'
      },
      {
        name: 'Excursiones en Barco',
        description: 'Cruceros diarios a bahías, islas y cuevas cercanas',
        image: '/images/boat-tour.jpg',
        duration: 'Día completo'
      }
    ],
    experiencesEs: [
      'Paseo por el pintoresco puerto deportivo',
      'Cruceros en barco a bahías aisladas',
      'Vida nocturna y entretenimiento',
      'Deportes acuáticos y jet ski',
      'Compras en el bazar tradicional',
      'Degustación de mariscos mediterráneos'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a octubre para actividades de playa y deportes acuáticos. Julio-agosto es la más concurrida con vida nocturna animada. Junio y septiembre ofrecen buen clima con menos multitudes.',
    gettingThereEs: 'El Aeropuerto de Dalaman (DLM) está a 90 km de distancia con traslados fáciles. Los autobuses conectan Mármaris con las principales ciudades turcas. Los ferries operan a islas griegas cercanas durante la temporada de verano.',
    metaTitleEs: 'Tours en Mármaris - Puerto Deportivo y Playas | Funny Tourism',
    metaDescriptionEs: 'Descubra Mármaris con tours de puerto deportivo, clubes de playa y vida nocturna. Disfrute de deportes acuáticos y cruceros en barco. Reserve ahora.'
  },
  {
    slug: 'bodrum',
    nameEs: 'Bodrum',
    descriptionEs: 'Visite el castillo histórico, relájese en playas prístinas y disfrute del ambiente vibrante de esta joya del Egeo',
    attractionsEs: [
      {
        name: 'Castillo de Bodrum',
        description: 'Castillo cruzado medieval que alberga el Museo de Arqueología Submarina',
        image: '/images/antalyakekova.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Teatro Antiguo',
        description: 'Teatro romano bien conservado con capacidad para 13.000 espectadores',
        image: '/images/bodrum-theater.jpg',
        duration: '1 hora'
      },
      {
        name: 'Molinos de Viento',
        description: 'Molinos de viento históricos icónicos con vistas a la ciudad',
        image: '/images/windmills.jpg',
        duration: '1 hora'
      },
      {
        name: 'Clubes de Playa',
        description: 'Clubes de playa de lujo con música, comida y entretenimiento',
        image: '/images/bodrum-beach.jpg',
        duration: 'Día completo'
      }
    ],
    experiencesEs: [
      'Exploración del castillo medieval',
      'Vida nocturna en clubes de moda',
      'Cruceros en goleta de lujo',
      'Compras en el puerto deportivo de Bodrum',
      'Visita a bahías aisladas cercanas',
      'Cena en restaurantes de mariscos frente al mar'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a octubre para actividades de playa. Junio y septiembre ofrecen clima cálido con menos multitudes. Julio-agosto es el más concurrido con vida nocturna animada. La primavera es perfecta para visitas turísticas.',
    gettingThereEs: 'El Aeropuerto Milas-Bodrum (BJV) está a 36 km de distancia. Los traslados en autobús y privados están disponibles. Los ferries conectan Bodrum con islas griegas como Kos. Las conexiones de autobús a las principales ciudades turcas están disponibles.',
    metaTitleEs: 'Tours en Bodrum - Castillo y Clubes de Playa | Funny Tourism',
    metaDescriptionEs: 'Explore Bodrum con tours del castillo, playas y vida nocturna. Disfrute de cruceros en goleta y arqueología antigua. Reserve hoy.'
  },
  {
    slug: 'izmir',
    nameEs: 'Esmirna',
    descriptionEs: 'La tercera ciudad más grande de Turquía ofrece ruinas antiguas, mercados vibrantes y hermosa costa del Egeo con comodidades modernas',
    attractionsEs: [
      {
        name: 'Ágora de Esmirna',
        description: 'Mercado antiguo romano y centro cívico con columnas bien conservadas',
        image: '/images/izmir.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Plaza Konak',
        description: 'Plaza central con torre del reloj icónica, símbolo de Esmirna',
        image: '/images/konak-square.jpg',
        duration: '1 hora'
      },
      {
        name: 'Paseo Marítimo Kordon',
        description: 'Paseo costero pintoresco con cafés, restaurantes y vistas al atardecer',
        image: '/images/kordon.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Bazar Kemeraltı',
        description: 'Bazar histórico con calles laberínticas llenas de tiendas y cafés',
        image: '/images/kemeralti.jpg',
        duration: '2-3 horas'
      }
    ],
    experiencesEs: [
      'Paseo por el paseo marítimo de Kordon',
      'Compras en el bazar tradicional',
      'Degustación de cocina del Egeo',
      'Visita a museos y galerías de arte',
      'Exploración de barrios históricos',
      'Excursiones de un día a Éfeso y Pérgamo'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a junio y de septiembre a noviembre. El clima es agradable para visitas turísticas. Los veranos son calurosos pero perfectos para paseos por la costa. Los inviernos son suaves en comparación con otras ciudades turcas.',
    gettingThereEs: 'El Aeropuerto Adnan Menderes (ADB) está a 18 km del centro de la ciudad. El metro conecta el aeropuerto con el centro de la ciudad. Esmirna es un importante centro de transporte con conexiones de tren y autobús a toda Turquía.',
    metaTitleEs: 'Tours en Esmirna - Ágora y Bazar Kemeraltı | Funny Tourism',
    metaDescriptionEs: 'Descubra Esmirna con tours de ruinas antiguas, mercados vibrantes y la hermosa costa del Egeo. Reserve su tour hoy.'
  },
  {
    slug: 'ankara',
    nameEs: 'Ankara',
    descriptionEs: 'La capital de Turquía muestra la Turquía moderna junto con el patrimonio antiguo de Anatolia y monumentos nacionales significativos',
    attractionsEs: [
      {
        name: 'Anıtkabir',
        description: 'Mausoleo monumental de Mustafa Kemal Atatürk, el fundador de Turquía moderna',
        image: '/images/anitkabir.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Museo de Civilizaciones de Anatolia',
        description: 'Museo de clase mundial con artefactos de civilizaciones antiguas de Anatolia',
        image: '/images/anatolian-museum.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Castillo de Ankara',
        description: 'Fortaleza histórica con vistas panorámicas de la ciudad',
        image: '/images/ankara-castle.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Torre Atakule',
        description: 'Torre de observación moderna con restaurante giratorio',
        image: '/images/atakule.jpg',
        duration: '1-2 horas'
      }
    ],
    experiencesEs: [
      'Visita al Mausoleo de Atatürk',
      'Exploración del Museo de Civilizaciones',
      'Paseo por el barrio del castillo histórico',
      'Compras en centros comerciales modernos',
      'Degustación de cocina de Anatolia',
      'Asistencia a actuaciones culturales'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a junio y de septiembre a octubre. El clima es agradable para visitas turísticas. Los veranos pueden ser calurosos y secos. Los inviernos son fríos con nieve ocasional, creando una atmósfera diferente.',
    gettingThereEs: 'El Aeropuerto Esenboğa (ESB) está a 28 km del centro de la ciudad. Los autobuses de enlace conectan el aeropuerto con el centro de la ciudad. Ankara es un importante centro ferroviario con trenes de alta velocidad a Estambul, Konya y otras ciudades.',
    metaTitleEs: 'Tours en Ankara - Anıtkabir y Museos | Funny Tourism',
    metaDescriptionEs: 'Explore la capital de Turquía, Ankara. Visite Anıtkabir, el Museo de Civilizaciones de Anatolia y sitios históricos. Reserve su tour hoy.'
  },
  {
    slug: 'bursa',
    nameEs: 'Bursa',
    descriptionEs: 'Primera capital otomana con impresionantes mezquitas, baños termales y acceso a la estación de esquí de Uludağ',
    attractionsEs: [
      {
        name: 'Gran Mezquita',
        description: 'Obra maestra de la arquitectura otomana temprana con 20 cúpulas',
        image: '/images/bursa.jpg',
        duration: '1 hora'
      },
      {
        name: 'Tumba Verde',
        description: 'Mausoleo del sultán Mehmed I con impresionantes azulejos turquesas',
        image: '/images/green-tomb.jpg',
        duration: '1 hora'
      },
      {
        name: 'Montaña Uludağ',
        description: 'Estación de esquí en invierno, retiro de montaña en verano',
        image: '/images/uludag.jpg',
        duration: 'Día completo'
      },
      {
        name: 'Mercado Histórico de Seda',
        description: 'Bazar histórico famoso por la seda, textiles y artesanías',
        image: '/images/silk-market.jpg',
        duration: '2-3 horas'
      }
    ],
    experiencesEs: [
      'Exploración de mezquitas otomanas históricas',
      'Relajación en baños termales',
      'Esquí en la montaña Uludağ (invierno)',
      'Degustación del famoso İskender kebab',
      'Compras de seda y textiles',
      'Paseo en teleférico a Uludağ'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a junio y de septiembre a noviembre para visitas turísticas. Diciembre-marzo es perfecto para el esquí en Uludağ. Los veranos son cálidos, ideales para actividades de montaña. La primavera ofrece hermosas flores.',
    gettingThereEs: 'Bursa está a 150 km de Estambul. Los autobuses frecuentes conectan ambas ciudades. Los ferries desde Estambul a Yalova seguidos de autobús proporcionan una ruta escénica. El Aeropuerto Yenişehir está cerca pero con vuelos limitados.',
    metaTitleEs: 'Tours en Bursa - Patrimonio Otomano y Esquí Uludağ | Funny Tourism',
    metaDescriptionEs: 'Descubra Bursa con tours de mezquitas otomanas, baños termales y la montaña Uludağ. Experimente el patrimonio turco. Reserve ahora.'
  },
  {
    slug: 'trabzon',
    nameEs: 'Trabzon',
    descriptionEs: 'Hermosa ciudad del Mar Negro conocida por el impresionante Monasterio de Sumela encaramado en acantilados montañosos',
    attractionsEs: [
      {
        name: 'Monasterio de Sumela',
        description: 'Antiguo monasterio ortodoxo griego aferrado a un acantilado empinado',
        image: '/images/trabzon.jpg',
        duration: '3-4 horas'
      },
      {
        name: 'Lago Uzungöl',
        description: 'Pintoresco lago de montaña rodeado de bosques de pinos',
        image: '/images/uzungol.jpg',
        duration: 'Medio día'
      },
      {
        name: 'Pabellón de Atatürk',
        description: 'Mansión histórica en un hermoso parque con vistas al Mar Negro',
        image: '/images/ataturk-pavilion.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Castillo de Trabzon',
        description: 'Fortaleza bizantina con vistas panorámicas de la ciudad y el mar',
        image: '/images/trabzon-castle.jpg',
        duration: '1-2 horas'
      }
    ],
    experiencesEs: [
      'Visita al dramático Monasterio de Sumela',
      'Exploración del paisaje del lago Uzungöl',
      'Degustación de cocina única del Mar Negro',
      'Senderismo por montañas verdes',
      'Descubrimiento de la herencia póntica griega',
      'Relajación junto a las aguas del Mar Negro'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a septiembre. El verano ofrece clima agradable con paisajes verdes exuberantes. El Monasterio de Sumela puede estar cerrado en invierno debido a la nieve. La primavera y el otoño ofrecen menos multitudes y hermosos colores.',
    gettingThereEs: 'El Aeropuerto de Trabzon (TZX) tiene vuelos desde Estambul y Ankara. Los autobuses conectan Trabzon con otras ciudades del Mar Negro. La ruta costera ofrece vistas escénicas. Alquilar un coche proporciona flexibilidad para explorar la región.',
    metaTitleEs: 'Tours en Trabzon - Monasterio de Sumela y Uzungöl | Funny Tourism',
    metaDescriptionEs: 'Visite Trabzon y explore el Monasterio de Sumela, el lago Uzungöl y hermosos paisajes del Mar Negro. Reserve su tour hoy.'
  },
  {
    slug: 'konya',
    nameEs: 'Konya',
    descriptionEs: 'Centro espiritual de Turquía, hogar del mausoleo de Rumi y la hipnotizante ceremonia de derviche giratorio',
    attractionsEs: [
      {
        name: 'Museo Mevlana',
        description: 'Mausoleo de Rumi, poeta místico sufí y fundador de los derviches giróvagos',
        image: '/images/konya-mevlana.jpg',
        duration: '2 horas'
      },
      {
        name: 'Derviches Giróvagos',
        description: 'Ceremonia tradicional sema de la orden derviche giratorio mevlevi',
        image: '/images/whirling-dervishes.jpg',
        duration: '1 hora'
      },
      {
        name: 'Mezquita Alaeddin',
        description: 'Una de las mezquitas selyúcidas más antiguas de Turquía',
        image: '/images/alaeddin-mosque.jpg',
        duration: '1 hora'
      },
      {
        name: 'Museo Ince Minare',
        description: 'Madrasa selyúcida con minarete finamente tallado que alberga un museo',
        image: '/images/ince-minare.jpg',
        duration: '1-2 horas'
      }
    ],
    experiencesEs: [
      'Visita al Mausoleo de Rumi',
      'Asistencia a ceremonia de derviche giratorio',
      'Exploración de la arquitectura selyúcida',
      'Aprendizaje sobre el misticismo sufí',
      'Degustación de dulces tradicionales de Konya',
      'Compras en bazares históricos'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a junio y de septiembre a noviembre. El clima es agradable para visitas turísticas. Los veranos son muy calurosos y secos. Diciembre (Festival Mevlana) es especial para presenciar ceremonias de derviche pero muy concurrido.',
    gettingThereEs: 'El Aeropuerto de Konya (KYA) tiene vuelos desde Estambul. Los trenes de alta velocidad conectan Konya con Estambul y Ankara en 4-5 horas. Los autobuses están disponibles desde todas las principales ciudades turcas.',
    metaTitleEs: 'Tours en Konya - Museo Mevlana y Derviches Giróvagos | Funny Tourism',
    metaDescriptionEs: 'Experimente el corazón espiritual de Turquía en Konya. Visite el Museo Mevlana y presencie ceremonias de derviche giratorio. Reserve ahora.'
  },
  {
    slug: 'gallipoli',
    nameEs: 'Galípoli',
    descriptionEs: 'Campo de batalla histórico de la Primera Guerra Mundial que ofrece conmovedores memoriales, cementerios y sitios patrimoniales significativos de ANZAC',
    attractionsEs: [
      {
        name: 'Cala ANZAC',
        description: 'Playa de desembarco donde las fuerzas de ANZAC llegaron a tierra en 1915',
        image: '/images/gallipoli.jpg',
        duration: '1 hora'
      },
      {
        name: 'Cementerio Lone Pine',
        description: 'Cementerio de guerra con tumbas de soldados australianos',
        image: '/images/lone-pine.jpg',
        duration: '1 hora'
      },
      {
        name: 'Chunuk Bair',
        description: 'Sitio de batalla importante con monumentos neozelandeses',
        image: '/images/chunuk-bair.jpg',
        duration: '1 hora'
      },
      {
        name: 'Memorial de Mártires Turcos',
        description: 'Memorial masivo honrando a los soldados turcos caídos',
        image: '/images/turkish-memorial.jpg',
        duration: '1 hora'
      }
    ],
    experiencesEs: [
      'Visita a cementerios de guerra y memoriales',
      'Aprendizaje sobre la historia de la Primera Guerra Mundial',
      'Asistencia a servicios conmemorativos de ANZAC (25 de abril)',
      'Exploración de trincheras y campos de batalla',
      'Reflexión en lugares históricos',
      'Tours guiados con guías historiadores'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a mayo y de septiembre a octubre. El 25 de abril (Día de ANZAC) es significativo pero muy concurrido. Los veranos son calurosos con menos multitudes. La primavera ofrece clima agradable para explorar al aire libre.',
    gettingThereEs: 'Galípoli está en la Península de Gelibolu cerca de Çanakkale. El Aeropuerto de Çanakkale está cerca. Los autobuses desde Estambul tardan 5-6 horas. Los ferries cruzan los Dardanelos. Las excursiones organizadas proporcionan transporte completo.',
    metaTitleEs: 'Tours de Galípoli - Sitios ANZAC y Memoriales de Guerra | Funny Tourism',
    metaDescriptionEs: 'Explore los campos de batalla de Galípoli con tours guiados. Visite Cala ANZAC, cementerios de guerra y memoriales históricos. Reserve hoy.'
  },
  {
    slug: 'troy',
    nameEs: 'Troya',
    descriptionEs: 'Legendaria ciudad antigua de la Guerra de Troya, Patrimonio Mundial de la UNESCO con fascinantes ruinas arqueológicas',
    attractionsEs: [
      {
        name: 'Réplica del Caballo de Troya',
        description: 'Réplica a tamaño completo del legendario caballo de madera',
        image: '/images/pergamon.jpg',
        duration: '30 minutos'
      },
      {
        name: 'Ruinas de la Ciudad Antigua',
        description: 'Capas arqueológicas que abarcan 4.000 años de historia',
        image: '/images/troy-ruins.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Museo Arqueológico',
        description: 'Museo con artefactos de excavaciones de Troya',
        image: '/images/troy-museum.jpg',
        duration: '1-2 horas'
      },
      {
        name: 'Murallas de la Ciudad',
        description: 'Fortificaciones antiguas de diferentes períodos',
        image: '/images/city-walls.jpg',
        duration: '1 hora'
      }
    ],
    experiencesEs: [
      'Exploración de capas arqueológicas',
      'Fotografía con el Caballo de Troya',
      'Aprendizaje sobre la mitología griega',
      'Descubrimiento de la historia homérica',
      'Visita al museo arqueológico',
      'Tour guiado con guías expertos'
    ],
    bestTimeToVisitEs: 'La mejor época es de abril a junio y de septiembre a octubre. El clima es agradable para explorar el sitio al aire libre. Los veranos pueden ser muy calurosos. Llegue temprano en la mañana para evitar multitudes de tours y calor.',
    gettingThereEs: 'Troya está a 30 km de Çanakkale. Los autobuses locales operan desde Çanakkale. Los tours organizados desde Çanakkale incluyen transporte. Alquilar un coche proporciona flexibilidad. Combine con tours de Galípoli para una excursión completa de un día.',
    metaTitleEs: 'Tour de la Antigua Troya - Sitio Patrimonio de la UNESCO | Funny Tourism',
    metaDescriptionEs: 'Visite la legendaria antigua ciudad de Troya. Explore ruinas arqueológicas, vea la réplica del Caballo de Troya y aprenda sobre historia homérica.'
  },
  {
    slug: 'alanya',
    nameEs: 'Alanya',
    descriptionEs: 'Popular balneario mediterráneo con espectacular castillo, hermosas playas y vibrantes opciones de entretenimiento',
    attractionsEs: [
      {
        name: 'Castillo de Alanya',
        description: 'Castillo medieval en la cima de una colina con vistas panorámicas del Mediterráneo',
        image: '/images/alanya.jpg',
        duration: '2-3 horas'
      },
      {
        name: 'Playa de Cleopatra',
        description: 'Playa de arena dorada donde se dice que nadó Cleopatra',
        image: '/images/cleopatra-beach.jpg',
        duration: 'Medio día'
      },
      {
        name: 'Cueva Damlatas',
        description: 'Cueva natural con estalactitas y aire terapéutico',
        image: '/images/damlatas-cave.jpg',
        duration: '30 minutos'
      },
      {
        name: 'Torre Roja',
        description: 'Icónica torre de defensa octogonal del siglo XIII',
        image: '/images/red-tower.jpg',
        duration: '1 hora'
      }
    ],
    experiencesEs: [
      'Exploración del histórico Castillo de Alanya',
      'Relajación en la Playa de Cleopatra',
      'Excursiones en barco pirata',
      'Deportes acuáticos y parasailing',
      'Visita a cuevas y playas ocultas',
      'Vida nocturna y entretenimiento'
    ],
    bestTimeToVisitEs: 'La mejor época es de mayo a octubre para actividades de playa. Junio-septiembre ofrece clima perfecto para nadar. Abril-mayo y octubre son ideales para visitas turísticas con temperaturas más frescas. Los inviernos son suaves pero más tranquilos.',
    gettingThereEs: 'El Aeropuerto de Gazipasa-Alanya (GZP) está a 40 km de distancia. El Aeropuerto de Antalya (AYT) está a 120 km con más vuelos internacionales. Los autobuses conectan Alanya con las principales ciudades turcas. Los traslados están ampliamente disponibles.',
    metaTitleEs: 'Tours en Alanya - Castillo y Playa de Cleopatra | Funny Tourism',
    metaDescriptionEs: 'Descubra Alanya con tours del castillo, la Playa de Cleopatra y hermosas calas. Disfrute de deportes acuáticos y vida nocturna. Reserve hoy.'
  }
];

async function updateDestinations() {
  console.log('🚀 Starting Spanish translations update...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const dest of spanishDestinations) {
    try {
      console.log(`📍 Updating ${dest.slug}...`);

      // Check if destination exists
      const existing = await prisma.destination.findUnique({
        where: { slug: dest.slug }
      });

      if (!existing) {
        console.log(`   ⚠️  Destination '${dest.slug}' not found in database, skipping...`);
        errorCount++;
        continue;
      }

      // Update with Spanish content
      await prisma.destination.update({
        where: { slug: dest.slug },
        data: {
          nameEs: dest.nameEs,
          descriptionEs: dest.descriptionEs,
          attractionsEs: JSON.stringify(dest.attractionsEs),
          experiencesEs: JSON.stringify(dest.experiencesEs),
          bestTimeToVisitEs: dest.bestTimeToVisitEs,
          gettingThereEs: dest.gettingThereEs,
          metaTitleEs: dest.metaTitleEs,
          metaDescriptionEs: dest.metaDescriptionEs
        }
      });

      console.log(`   ✅ Successfully updated ${dest.nameEs} (${dest.slug})`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Error updating ${dest.slug}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Update complete!`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('='.repeat(50) + '\n');
}

async function main() {
  try {
    await updateDestinations();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
