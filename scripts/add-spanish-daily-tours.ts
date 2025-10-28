/**
 * Script to add Spanish translations to existing daily tours
 * Run with: npx tsx scripts/add-spanish-daily-tours.ts
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

// Professional Spanish translations for daily tours using formal "usted" tone
const spanishTranslations: SpanishTourTranslation[] = [
  {
    tourCode: 'T1',
    titleEs: 'Tour Clásico de Estambul',
    descriptionEs: 'Descubra los lugares emblemáticos de Estambul en este completo tour de día completo. Visite la majestuosa Mezquita Azul con sus impresionantes seis minaretes y hermosos azulejos azules de Iznik. Explore la histórica Santa Sofía, una maravilla arquitectónica que ha servido como iglesia, mezquita y museo. Maravíllese ante el opulento Palacio de Topkapi, antigua residencia de los sultanes otomanos, y recorra el vibrante Gran Bazar, uno de los mercados cubiertos más grandes y antiguos del mundo.',
    includedEs: 'Guía profesional de habla española\nTransporte en vehículo con aire acondicionado\nEntradas a todos los monumentos\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales\nEntradas opcionales a museos adicionales',
    notesEs: 'Por favor, vista modestamente al visitar mezquitas (los hombros y las rodillas deben estar cubiertas)\nLas mujeres deben cubrirse la cabeza al entrar a las mezquitas (se proporcionan pañuelos)\nEl Gran Bazar está cerrado los domingos\nSe recomienda calzado cómodo para caminar'
  },
  {
    tourCode: 'T2',
    titleEs: 'Tour del Crucero por el Bósforo y Palacio de Dolmabahce',
    descriptionEs: 'Experimente la belleza de Estambul desde el agua con un relajante crucero por el Bósforo. Navegue entre dos continentes mientras admira magníficas mansiones otomanas, fortalezas históricas y palacios imperiales a lo largo de las orillas. Después del crucero, visite el espléndido Palacio de Dolmabahce, el opulento palacio del siglo XIX que sirvió como centro administrativo del Imperio Otomano. Admire sus deslumbrantes candelabros de cristal, elaborados interiores y exquisita arquitectura europea.',
    includedEs: 'Crucero panorámico por el Bósforo\nGuía profesional\nEntrada al Palacio de Dolmabahce\nTransporte en vehículo con aire acondicionado\nRecogida y regreso al hotel',
    excludedEs: 'Comidas y bebidas\nPropinas\nGastos personales\nFotografías',
    notesEs: 'El Palacio de Dolmabahce está cerrado los lunes y jueves\nNo se permiten fotografías dentro del palacio\nSe requiere caminar moderadamente\nDisponible en tour privado o compartido (SIC)'
  },
  {
    tourCode: 'T3',
    titleEs: 'Tour de Capadocia',
    descriptionEs: 'Descubra el paisaje surrealista de Capadocia con sus formaciones rocosas únicas de chimeneas de hadas, ciudades antiguas subterráneas e iglesias rupestres históricas. Visite el Museo al Aire Libre de Göreme, Patrimonio de la Humanidad de la UNESCO con frescos bizantinos magníficamente preservados. Explore el impresionante Valle de Pasabag con sus chimeneas de hadas con múltiples cabezas y visite una ciudad subterránea donde los primeros cristianos se refugiaron de la persecución. Experimente la artesanía tradicional de la cerámica en Avanos.',
    includedEs: 'Guía profesional de habla española\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Paseo en globo aerostático (se puede reservar por separado)\nBebidas\nPropinas\nGastos personales',
    notesEs: 'Se recomienda calzado cómodo para caminar\nLleve sombrero y protector solar en verano\nLas temperaturas pueden variar significativamente entre el día y la noche\nDisponible como tour de día completo o de varios días'
  },
  {
    tourCode: 'T4',
    titleEs: 'Tour de Éfeso desde Kusadasi',
    descriptionEs: 'Viaje al pasado con una visita a la antigua ciudad de Éfeso, una de las ciudades greco-romanas mejor preservadas del Mediterráneo. Camine por las calles de mármol donde San Pablo predicó y visite la impresionante Biblioteca de Celso, el Gran Teatro con capacidad para 24,000 espectadores y los baños romanos. Continúe hasta la Casa de la Virgen María, donde se cree que pasó sus últimos años. Visite el Templo de Artemisa, una de las Siete Maravillas del Mundo Antiguo.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a todos los sitios arqueológicos\nAlmuerzo en restaurante local\nRecogida del puerto o hotel',
    excludedEs: 'Bebidas\nPropinas\nGastos personales\nEntradas opcionales a museos adicionales',
    notesEs: 'Se requiere caminar considerablemente por terreno irregular\nLleve sombrero, protector solar y agua\nCalzado cómodo para caminar es esencial\nDisponible para pasajeros de cruceros con horarios flexibles'
  },
  {
    tourCode: 'T5',
    titleEs: 'Tour Lado Asiático de Estambul',
    descriptionEs: 'Descubra el lado menos explorado pero igualmente fascinante de Estambul en el continente asiático. Visite el encantador distrito de Üsküdar con sus hermosas mezquitas y vistas panorámicas del Bósforo. Explore el vibrante barrio de Kadıköy con sus mercados animados, cafeterías de moda y cultura callejera auténtica. Disfrute de un paseo por la Torre de la Doncella, uno de los monumentos más icónicos de Estambul, y experimente la vida local lejos de las rutas turísticas habituales.',
    includedEs: 'Guía profesional de habla española\nTransporte en vehículo con aire acondicionado\nCruce en ferry por el Bósforo\nDegustación de comida callejera turca\nRecogida y regreso al hotel',
    excludedEs: 'Comida principal\nBebidas adicionales\nPropinas\nGastos personales',
    notesEs: 'Se requiere caminar moderadamente\nOportunidades excelentes para fotografías\nExperiencia cultural auténtica lejos de los sitios turísticos\nDisponible como tour de medio día o día completo'
  },
  {
    tourCode: 'T6',
    titleEs: 'Tour de Pamukkale y Hierápolis',
    descriptionEs: 'Visite el impresionante "Castillo de Algodón" de Pamukkale, famoso por sus terrazas de travertino blanco formadas por aguas termales ricas en minerales. Camine descalzo por las piscinas de color turquesa mientras disfruta de vistas espectaculares. Explore las antiguas ruinas de Hierápolis, una ciudad greco-romana con un teatro bien preservado, necrópolis y baños termales. Opcionalmente, nade en la Piscina de Cleopatra, un jacuzzi natural con columnas romanas sumergidas.',
    includedEs: 'Guía profesional arqueólogo\nTransporte en vehículo con aire acondicionado\nEntradas a Pamukkale y Hierápolis\nAlmuerzo en restaurante local\nRecogida y regreso al hotel',
    excludedEs: 'Entrada a la Piscina de Cleopatra (opcional)\nBebidas\nPropinas\nGastos personales',
    notesEs: 'Lleve traje de baño y toalla si desea nadar\nEl calzado no está permitido en los travertinos\nLleve protector solar y sombrero\nDisponible como tour de día completo desde varias ciudades'
  },
  {
    tourCode: 'T7',
    titleEs: 'Tour Gastronómico de Estambul',
    descriptionEs: 'Deléitese con los sabores de Estambul en este delicioso tour gastronómico que lo lleva a través de los mejores lugares culinarios de la ciudad. Pruebe kebabs tradicionales turcos, börek recién horneado, auténtico café turco y deliciosos postres como baklava y lokum. Visite el Mercado de Especias Egipcio lleno de aromas, explore restaurantes locales favoritos y aprenda sobre la rica herencia culinaria turca de guías expertos. Experimente la cultura de comida callejera en áreas auténticas.',
    includedEs: 'Guía gastronómico profesional\nTodas las degustaciones de comida y bebida\nVisita al Mercado de Especias\nCafé y té turco\nRecetas y consejos culinarios\nTransporte entre lugares',
    excludedEs: 'Comidas completas\nBebidas alcohólicas adicionales\nPropinas\nCompras personales',
    notesEs: 'Avise de restricciones dietéticas con anticipación\nSe requiere caminar moderadamente\nAdecuado para todos los niveles de aventura culinaria\nDisponible como tour de medio día o día completo'
  },
  {
    tourCode: 'T8',
    titleEs: 'Tour Privado de Antalya y Cascadas',
    descriptionEs: 'Descubra las maravillas naturales e históricas de Antalya, la perla de la Costa Turquesa. Explore el encantador casco antiguo de Kaleiçi con sus calles empedradas y arquitectura otomana. Visite las impresionantes Cascadas de Düden y las Cascadas del Bajo Düden que caen dramáticamente al mar Mediterráneo. Disfrute de tiempo libre en la playa de Konyaaltı o Lara, y explore el puerto antiguo con sus vistas panorámicas de las montañas Tauro.',
    includedEs: 'Guía profesional de habla española\nTransporte privado con aire acondicionado\nEntradas a los sitios\nAlmuerzo con vista al mar\nRecogida y regreso al hotel',
    excludedEs: 'Bebidas\nPropinas\nActividades acuáticas (opcional)\nGastos personales',
    notesEs: 'Lleve traje de baño para nadar (opcional)\nCalzado cómodo para caminar recomendado\nOportunidades excelentes para fotografías\nDisponible todo el año con horarios flexibles'
  },
  {
    tourCode: 'T9',
    titleEs: 'Tour de Troya y Galípoli',
    descriptionEs: 'Embárquese en un viaje histórico a dos de los sitios más significativos de Turquía. Visite la legendaria ciudad de Troya, famosa por la Guerra de Troya de Homero, y vea el famoso Caballo de Troya de madera. Explore las capas arqueológicas que abarcan 4,000 años de historia. Continúe a Galípoli para conmemorar los eventos de la Primera Guerra Mundial en este conmovedor sitio de batalla. Visite cementerios, monumentos y museos que honran a los soldados de ambos lados.',
    includedEs: 'Guía profesional historiador\nTransporte en vehículo con aire acondicionado\nCruce en ferry por los Dardanelos\nEntradas a todos los sitios\nAlmuerzo en restaurante local',
    excludedEs: 'Bebidas\nPropinas\nGastos personales\nEntradas opcionales a museos adicionales',
    notesEs: 'Tour emocionalmente conmovedor, especialmente Galípoli\nSe requiere caminar moderadamente\nMuy recomendado para entusiastas de la historia\nDisponible como tour de día completo desde Estambul o Çanakkale'
  },
  {
    tourCode: 'T10',
    titleEs: 'Tour de Compras de Estambul',
    descriptionEs: 'Experimente la mejor terapia de compras en Estambul visitando tanto bazares tradicionales como distritos comerciales modernos. Navegue por el laberíntico Gran Bazar con más de 4,000 tiendas que venden alfombras, joyas, cerámica y artesanías. Visite el aromático Mercado de Especias para especias, delicias turcas y tés. Explore la elegante Avenida Istiklal con boutiques internacionales y diseñadores turcos. Aprenda técnicas de negociación y obtenga información sobre compras de alfombras, cerámica y oro.',
    includedEs: 'Guía personal de compras\nTransporte en vehículo con aire acondicionado\nVisitas a bazares tradicionales y tiendas modernas\nAsesoramiento de expertos sobre calidad y precios\nTécnicas de negociación\nRecogida y regreso al hotel',
    excludedEs: 'Compras personales\nComidas y bebidas\nPropinas\nEnvío de artículos comprados',
    notesEs: 'Sin obligación de compra\nServicio de envío disponible para artículos grandes\nSe aceptan tarjetas de crédito en la mayoría de las tiendas\nRecomendado para entusiastas de las compras de todos los niveles'
  }
];

async function addSpanishTranslations() {
  console.log('🚀 Starting Spanish translation update for daily tours...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const translation of spanishTranslations) {
    try {
      // Check if tour exists
      const existingTour = await prisma.dailyTour.findUnique({
        where: { tourCode: translation.tourCode },
      });

      if (!existingTour) {
        console.log(`⚠️  Tour ${translation.tourCode} not found, skipping...`);
        errorCount++;
        errors.push(`Tour ${translation.tourCode} not found in database`);
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

  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully translated: ${successCount} tours`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n✨ Spanish translation update completed!\n');
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
