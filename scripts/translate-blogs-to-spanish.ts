import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Spanish translations for blog posts
const blogTranslations: Record<string, { titleEs: string; excerptEs: string; contentEs: string }> = {
  'indian-restaurants-in-turkey': {
    titleEs: 'Restaurantes Indios en Turquía: Guía Completa para Viajeros Indios',
    excerptEs: '¿Extraña la comida de casa mientras explora Turquía? Descubra los mejores restaurantes indios en Estambul, Capadocia, Antalya y otras ciudades turcas. Desde auténticos curries del norte de India hasta especialidades del sur, ¡encuentre el sabor de casa en Turquía!',
    contentEs: `<h2>Encontrar Comida India Auténtica en Turquía</h2>

<p>¿Planea un viaje a Turquía pero le preocupa encontrar comida india familiar? ¡Está de suerte! Turquía ha adoptado la cocina india de todo corazón, con excelentes restaurantes indios en los principales destinos turísticos. Ya sea que anhele pollo con mantequilla en Estambul o biryani en Capadocia, esta guía completa le ayudará a encontrar los mejores restaurantes indios en toda Turquía.</p>

<h2>Por Qué los Restaurantes Indios Prosperan en Turquía</h2>

<p>Turquía se ha convertido en un destino favorito para los viajeros indios, y la industria de la hospitalidad ha respondido estableciendo restaurantes indios auténticos en cada ciudad turística importante. La creciente diáspora india y el turismo han creado una demanda de cocina india de calidad, resultando en restaurantes que sirven de todo, desde tandoori del norte de India hasta dosas del sur de India.</p>

<h2>Mejores Restaurantes Indios en Estambul</h2>

<p>Como la ciudad más grande de Turquía, Estambul cuenta con la selección más extensa de restaurantes indios:</p>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #0284c7;">
<h3 style="color: #0284c7; margin-bottom: 0.75rem;">🍛 Madhu's Restaurant en Swissôtel The Bosphorus</h3>
<p style="margin-bottom: 0.5rem;"><strong>Cocina:</strong> Punjabi y India Contemporánea<br>
<strong>Especialidad:</strong> Experiencia gastronómica de alta calidad<br>
<strong>Premios:</strong> Premio de Excelencia 2024 de Wine Spectator, honor de una estrella de Gourmand Tables International Cuisine</p>
<p><strong>Por Qué Visitar:</strong> Para una experiencia gastronómica india premium con impresionantes vistas al Bósforo, Madhu's es inigualable. Sus especialidades punjabis y platos indios contemporáneos son preparados por chefs expertos.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #0284c7;">
<h3 style="color: #0284c7; margin-bottom: 0.75rem;">🍛 Delhi Darbar</h3>
<p style="margin-bottom: 0.5rem;"><strong>Cocina:</strong> Norte de India<br>
<strong>Especialidad:</strong> Cocina casera auténtica</p>
<p><strong>Por Qué Visitar:</strong> Conocido por servir comida que sabe como en casa, Delhi Darbar es querido por la comunidad india en Estambul. Sus curries, biryanis y platos tandoori son consistentemente excelentes.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #0284c7;">
<h3 style="color: #0284c7; margin-bottom: 0.75rem;">🍛 Fusion Indian Restaurant (Florya)</h3>
<p style="margin-bottom: 0.5rem;"><strong>Calificación:</strong> 4.9/5 en TripAdvisor (Clasificado #322 de 9,408 restaurantes)<br>
<strong>Ubicación:</strong> Florya<br>
<strong>Especialidad:</strong> Fusión india contemporánea</p>
<p><strong>Por Qué Visitar:</strong> Recientemente renovado con hermosos asientos en el jardín, Fusion ofrece platos indios innovadores junto con favoritos tradicionales.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #0284c7;">
<h3 style="color: #0284c7; margin-bottom: 0.75rem;">🍛 Govinda Istanbul</h3>
<p style="margin-bottom: 0.5rem;"><strong>Cocina:</strong> India Vegetariana/Vegana Pura<br>
<strong>Establecido:</strong> 2010<br>
<strong>Especialidad:</strong> Cocina vegetariana sáttvica</p>
<p><strong>Por Qué Visitar:</strong> El primer y único restaurante indio vegetariano sáttvico puro de Turquía. Perfecto para jainistas y vegetarianos estrictos que buscan opciones auténticas sin carne.</p>
</div>

<div style="padding: 1.5rem; background-color: #fef3c7; border-radius: 0.5rem; margin-bottom: 2rem;">
<h3 style="color: #92400e; margin-bottom: 0.75rem;">Otras Opciones Notables en Estambul:</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li><strong>Taj Mahal:</strong> Cocina tradicional del norte de India</li>
<li><strong>India Gate:</strong> Amplia variedad de platos regionales</li>
<li><strong>Tandoori Restaurant:</strong> Especializado en preparaciones tandoori</li>
<li><strong>Dubb Indian Bosphorus:</strong> Gastronomía india moderna con vistas al agua</li>
</ul>
</div>

<h2>Restaurantes Indios en Capadocia (Göreme)</h2>

<p>Incluso en los paisajes de chimeneas de hadas de Capadocia, encontrará excelente comida india:</p>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
<h3 style="color: #f59e0b; margin-bottom: 0.75rem;">🍛 Namaste India</h3>
<p style="margin-bottom: 0.5rem;"><strong>Calificación:</strong> Muy bien valorado en TripAdvisor<br>
<strong>Especialidad:</strong> Comida reconfortante del norte de India</p>
<p><strong>Por Qué Visitar:</strong> Ambiente limpio e higiénico con comida deliciosa y excelente servicio. Muchos viajeros lo llaman "uno de los mejores restaurantes indios de Turquía".</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
<h3 style="color: #f59e0b; margin-bottom: 0.75rem;">🍛 India Gate Indian Restaurant Cappadocia</h3>
<p style="margin-bottom: 0.5rem;"><strong>Ubicación:</strong> Aydınlı Orta Mah, Uzun Dere Cad. No: 3, Göreme<br>
<strong>Calificación Google:</strong> 4.6/5<br>
<strong>Especialidad:</strong> Platos indios y paquistaníes</p>
<p><strong>Por Qué Visitar:</strong> Popular entre locales y turistas por igual, conocido por sabores auténticos y porciones generosas.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
<h3 style="color: #f59e0b; margin-bottom: 0.75rem;">🍛 Pukka Indian Restaurant</h3>
<p style="margin-bottom: 0.5rem;"><strong>Ubicación:</strong> Área de Uchisar<br>
<strong>Especialidad:</strong> Comidas personalizadas</p>
<p><strong>Por Qué Visitar:</strong> El chef hace un esfuerzo extra para preparar platos que ni siquiera están en el menú. Perfecto para viajeros con requisitos dietéticos específicos o que extrañan un plato particular de casa.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
<h3 style="color: #f59e0b; margin-bottom: 0.75rem;">🍛 Dalchini</h3>
<p style="margin-bottom: 0.5rem;"><strong>Ubicación:</strong> Aydınlı Orta Mahallesi, Göreme<br>
<strong>Horario:</strong> 12 PM - 11 PM diariamente</p>
<p><strong>Por Qué Visitar:</strong> Calidad consistente y sabores indios auténticos en el corazón de Capadocia.</p>
</div>

<h2>Restaurantes Indios en Antalya</h2>

<p>La costa mediterránea de Turquía también ofrece excelente gastronomía india:</p>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #10b981;">
<h3 style="color: #10b981; margin-bottom: 0.75rem;">🍛 Haveli Restaurant</h3>
<p style="margin-bottom: 0.5rem;"><strong>Calificación:</strong> 4.5/5 en TripAdvisor (Clasificado #96 de 1,408 restaurantes)<br>
<strong>Especialidad:</strong> Curries recién preparados sin colorantes artificiales</p>
<p><strong>Por Qué Visitar:</strong> Reseñas recientes elogian sus rotis tandoori con mantequilla calientes y humeantes y preparaciones de curry auténticas.</p>
</div>

<div style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f9fafb; border-radius: 0.5rem; border-left: 4px solid #10b981;">
<h3 style="color: #10b981; margin-bottom: 0.75rem;">🍛 India Gate Restaurant</h3>
<p style="margin-bottom: 0.5rem;"><strong>Ubicación:</strong> Hasimcan Mah, Fevzi Çakmak Cd. No:13A, Muratpaşa<br>
<strong>Especialidad:</strong> Cocina del norte de India</p>
<p><strong>Por Qué Visitar:</strong> Ambiente familiar con platos tradicionales bien ejecutados.</p>
</div>

<h2>Otras Ciudades con Restaurantes Indios</h2>

<div style="padding: 1.5rem; background-color: #f0f9ff; border-radius: 0.5rem; margin-bottom: 2rem;">
<h3 style="color: #0369a1; margin-bottom: 0.75rem;">Izmir</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li><strong>Taj Mahal Indian Restaurant:</strong> Cocina india auténtica en la tercera ciudad más grande de Turquía</li>
<li><strong>Namaste India:</strong> Favorito local para platos del norte de India</li>
</ul>
</div>

<div style="padding: 1.5rem; background-color: #f0f9ff; border-radius: 0.5rem; margin-bottom: 2rem;">
<h3 style="color: #0369a1; margin-bottom: 0.75rem;">Kusadasi</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li><strong>Indian Curry House:</strong> Popular entre pasajeros de cruceros y turistas</li>
<li><strong>Taj Mahal:</strong> Ubicado convenientemente cerca del puerto</li>
</ul>
</div>

<h2>Platos Indios Populares Disponibles en Turquía</h2>

<p>La mayoría de los restaurantes indios en Turquía ofrecen un menú completo de favoritos:</p>

<div style="margin-bottom: 2rem;">
<h3>Platos del Norte de India:</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li>Butter Chicken (Pollo con Mantequilla)</li>
<li>Chicken Tikka Masala</li>
<li>Palak Paneer</li>
<li>Dal Makhani</li>
<li>Tandoori Chicken</li>
<li>Naan, Roti, Paratha</li>
<li>Biryani (Pollo, Cordero, Vegetariano)</li>
</ul>
</div>

<div style="margin-bottom: 2rem;">
<h3>Platos del Sur de India:</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li>Dosa (Masala Dosa, Plain Dosa)</li>
<li>Idli</li>
<li>Uttapam</li>
<li>Sambar</li>
<li>Rasam</li>
</ul>
</div>

<h2>Consejos para Cenar en Restaurantes Indios en Turquía</h2>

<div style="padding: 1.5rem; background-color: #fef3c7; border-radius: 0.5rem; margin-bottom: 2rem;">
<h3 style="color: #92400e; margin-bottom: 0.75rem;">💡 Consejos Útiles:</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li><strong>Reservaciones:</strong> Llame con anticipación durante la temporada alta turística (mayo-octubre)</li>
<li><strong>Nivel de Picante:</strong> Los restaurantes generalmente ajustan el picante para el paladar turco; solicite "extra picante" si prefiere sabores indios auténticos</li>
<li><strong>Precios:</strong> Espere pagar 150-400 TL por persona en la mayoría de los restaurantes</li>
<li><strong>Servicio de Entrega:</strong> Muchos restaurantes en Estambul ofrecen entrega a través de Yemeksepeti o Getir</li>
<li><strong>Opciones Vegetarianas:</strong> Los restaurantes indios son excelentes para vegetarianos; siempre pregunte por platos Jain si es necesario</li>
<li><strong>Autenticidad:</strong> Busque restaurantes frecuentados por la comunidad india local para obtener el sabor más auténtico</li>
</ul>
</div>

<h2>Alternativas: Cocinar Comida India en Turquía</h2>

<p>Si está de visita por un período prolongado y desea cocinar:</p>

<div style="padding: 1.5rem; background-color: #f0fdf4; border-radius: 0.5rem; margin-bottom: 2rem;">
<h3 style="color: #15803d; margin-bottom: 0.75rem;">Dónde Comprar Ingredientes Indios:</h3>
<ul style="margin-left: 1.5rem; line-height: 1.8;">
<li><strong>Tiendas Indias en Estambul:</strong> El distrito de Aksaray tiene varias tiendas que venden especias indias, arroz basmati y otros ingredientes esenciales</li>
<li><strong>Mercados Online:</strong> Plataformas como Trendyol y Hepsiburada venden ingredientes indios seleccionados</li>
<li><strong>Mercados Locales:</strong> Los bazares turcos tienen muchas especias en común (comino, cilantro, cúrcuma, cardamomo)</li>
</ul>
</div>

<h2>Conclusión: Disfrutar de Comida India en Turquía</h2>

<p>Ya sea que viaje a Turquía por negocios o placer, encontrar comida india auténtica ya no es un desafío. Desde restaurantes de lujo en Estambul hasta lugares acogedores en Capadocia, los restaurantes indios de Turquía ofrecen un sabor de casa en todos los rincones del país.</p>

<p>Los restaurantes indios no solo atienden a viajeros indios, sino que también se han vuelto populares entre los locales turcos que han desarrollado un gusto por la cocina india. Esta demanda creciente significa que la calidad y autenticidad continúan mejorando.</p>

<div style="padding: 1.5rem; background-color: #eff6ff; border-radius: 0.5rem; border-left: 4px solid #0284c7; margin-top: 2rem;">
<h3 style="color: #0284c7; margin-bottom: 0.75rem;">✈️ ¿Planificando Su Viaje a Turquía?</h3>
<p>En Funny Tourism, entendemos las necesidades de los viajeros indios. Nuestros paquetes turísticos incluyen hoteles cerca de restaurantes indios, guías que hablan hindi/inglés y flexibilidad para preferencias dietéticas. Explore nuestros paquetes de Turquía diseñados específicamente para viajeros indios.</p>
</div>

<p><strong>¿Ha visitado alguno de estos restaurantes indios en Turquía? ¿Tiene recomendaciones que agregar? Comparta sus experiencias en los comentarios a continuación!</strong></p>`
  },
  'turkish-food-guide-2025-what-to-eat-where-to-find-it': {
    titleEs: 'Guía de Comida Turca 2025: Qué Comer y Dónde Encontrarlo',
    excerptEs: 'Descubra las delicias culinarias de Turquía con nuestra guía completa de comida. Desde kebabs hasta baklava, aprenda qué platos probar y dónde encontrar la mejor comida turca.',
    contentEs: `# Guía de Comida Turca 2025: Qué Comer y Dónde Encontrarlo

Turquía es un paraíso para los amantes de la comida, ofreciendo una rica tradición culinaria que abarca siglos. Desde las bulliciosas calles de Estambul hasta los encantadores cafés de Capadocia, la cocina turca es una deliciosa fusión de sabores mediterráneos, de Oriente Medio y de Asia Central.

## Platos Esenciales Turcos que Debes Probar

### 1. Kebabs

Los kebabs turcos son mundialmente famosos, y por una buena razón. Estos platos de carne a la parrilla vienen en muchas variedades:

- **Adana Kebab**: Carne picada especiada en brochetas
- **Shish Kebab**: Cubos de carne marinada a la parrilla
- **Döner Kebab**: Carne en rodajas cocida en un asador vertical
- **İskender Kebab**: Döner sobre pan pita con salsa de tomate y yogur

**Dónde Encontrarlo**: Prueba Hamdi Restaurant en Estambul para algunos de los mejores kebabs de la ciudad.

### 2. Meze (Aperitivos)

Los meze son pequeños platos servidos como aperitivos, similares a las tapas españolas:

- **Hummus**: Puré de garbanzos cremoso
- **Baba Ghanoush**: Puré de berenjena ahumado
- **Dolma**: Hojas de parra rellenas
- **Cacık**: Yogur con pepino y ajo
- **Haydari**: Yogur espeso con ajo y hierbas

**Dónde Encontrarlo**: Las tabernas de meze (meyhane) en el distrito de Beyoğlu en Estambul ofrecen una experiencia auténtica.

### 3. Pide (Pizza Turca)

Pide es un pan plano en forma de barco cubierto con varios ingredientes:

- Kaşarlı Pide (con queso)
- Kıymalı Pide (con carne picada)
- Sucuklu Pide (con salchicha turca)
- Karışık Pide (mixto)

**Dónde Encontrarlo**: Las pequeñas pidecis (tiendas de pide) suelen ser las mejores. Busca lugares locales abarrotados.

### 4. Mantı (Ravioles Turcos)

Pequeñas albóndigas rellenas de carne servidas con yogur de ajo y mantequilla de pimiento:

**Dónde Encontrarlo**: Kayseri es famoso por sus mantı. En Estambul, prueba Tarihi Karaköy Pidecisi.

### 5. Lahmacun

A menudo llamada "pizza turca", lahmacun es un pan plano fino cubierto con carne picada, tomates y hierbas:

**Dónde Encontrarlo**: Disponible en la mayoría de los restaurantes turcos. Envuélvelo con perejil fresco, cebolla y un chorrito de limón.

## Postres Turcos

### 1. Baklava

Capas de masa filo con nueces picadas, endulzadas con jarabe o miel:

**Dónde Encontrarlo**: Karaköy Güllüoğlu en Estambul es legendario por su baklava.

### 2. Künefe

Un postre de queso caliente hecho con kadayıf (masa de cabello de ángel), empapado en jarabe dulce:

**Dónde Encontrarlo**: Hatay es la ciudad original, pero puedes encontrarlo en toda Turquía.

### 3. Helado Turco (Dondurma)

Helado espeso y masticable hecho con salep y almáciga:

**Dónde Encontrarlo**: Busca vendedores de Maraş dondurması, especialmente en áreas turísticas donde realizan entretenidos espectáculos.

### 4. Lokum (Delicias Turcas)

Caramelos gelatinosos en polvo, a menudo con sabor a agua de rosas, nueces o frutas:

**Dónde Encontrarlo**: Hafız Mustafa en Estambul ofrece más de 50 variedades.

## Bebidas Turcas

### 1. Té Turco (Çay)

El té negro fuerte servido en vasos en forma de tulipán es la bebida nacional:

**Dónde Probarlo**: En todas partes, pero disfrútalo en un salón de té tradicional con vista al Bósforo.

### 2. Café Turco (Türk Kahvesi)

Café grueso sin filtrar, fuerte y espumoso, a menudo servido con delicia turca:

**Dónde Probarlo**: Mandabatmaz en Estambul es famoso por su café.

### 3. Ayran

Una bebida de yogur salada que combina perfectamente con kebabs:

**Dónde Probarlo**: Disponible en todos los restaurantes turcos.

### 4. Rakı

Licor de anís, a menudo llamado "leche de león" cuando se mezcla con agua:

**Dónde Probarlo**: Con meze en una meyhane tradicional.

## Alimentos Callejeros en Turquía

### 1. Simit

Rosquilla de sésamo, perfecta para el desayuno o un bocadillo:

**Dónde Encontrarlo**: Vendedores ambulantes por toda Turquía.

### 2. Balık Ekmek

Sándwich de pescado fresco a la parrilla, especialmente popular en Estambul:

**Dónde Encontrarlo**: Cerca del Puente de Gálata en Estambul.

### 3. Kumpir

Papa al horno con innumerables coberturas:

**Dónde Encontrarlo**: Ortaköy en Estambul es famoso por el kumpir.

### 4. Midye Dolma

Mejillones rellenos de arroz especiado:

**Dónde Encontrarlo**: Vendedores ambulantes en zonas costeras.

## Regiones Especializadas

### Estambul

La fusión culinaria definitiva: prueba todo, desde comida callejera hasta restaurantes con estrellas Michelin.

### Gaziantep

La capital culinaria de Turquía, famosa por baklava y kebabs.

### Antakya (Hatay)

Cocina influenciada por el Medio Oriente con platos únicos no encontrados en otros lugares.

### Costa del Egeo

Cocina fresca mediterránea con énfasis en mariscos, aceite de oliva y verduras.

### Capadocia

Prueba testi kebab (kebab en olla de barro) y platos tradicionales de Anatolia.

## Consejos para Comer en Turquía

1. **El Desayuno es Importante**: El desayuno turco (kahvaltı) es una comida abundante con quesos, aceitunas, huevos, tomates, pepinos y más.

2. **Comer en Lokanta**: Estos restaurantes caseros ofrecen comida auténtica a precios razonables.

3. **Buscar Restaurantes Concurridos**: Los locales saben dónde está la mejor comida.

4. **Probar Especialidades Locales**: Cada región tiene sus platos únicos.

5. **Dar Propina**: Una propina del 10% es estándar en restaurantes.

6. **Comer con las Estaciones**: La comida turca es estacional; pregunte por productos frescos de temporada.

## Etiqueta en la Mesa

- Espera a que el anfitrión diga "Afiyet olsun" (buen provecho) antes de comer
- El pan siempre está presente en las comidas
- Usa tus utensilios; comer con las manos es aceptable para ciertos platos como pide
- Terminar tu plato muestra aprecio
- El té o café después de la comida es tradicional

## Restricciones Dietéticas

Turquía generalmente acomoda diversas necesidades dietéticas:

- **Vegetariano**: Muchas opciones de meze y verduras
- **Vegano**: Solicita platos sin productos lácteos; muchos meze son naturalmente veganos
- **Sin Gluten**: Los platos a base de arroz y carne están disponibles; informe al personal sobre las alergias
- **Halal**: Toda la carne en Turquía es halal por defecto

## Conclusión

La cocina turca es una experiencia deliciosa que refleja la rica historia y diversidad cultural del país. Ya sea que estés saboreando kebabs en Estambul, degustando baklava en Gaziantep, o disfrutando de un café turco con vista al Bósforo, cada comida es una aventura.

No te limites a las áreas turísticas; algunos de los mejores alimentos se encuentran en restaurantes locales donde el idioma puede ser una barrera pero la comida habla por sí misma. Y recuerda, en Turquía, compartir comida es compartir cultura; ¡disfruta cada bocado!

**Planificando tu viaje a Turquía**: Consulta nuestros paquetes turísticos seleccionados que incluyen experiencias culinarias y visitas a restaurantes locales. Desde tours gastronómicos en Estambul hasta clases de cocina en Capadocia, te ayudamos a experimentar lo mejor de la cocina turca.`
  },
  'turkey-visa-for-indians-2025': {
    titleEs: 'Visa de Turquía para Indios: Guía Completa 2025 (Proceso e-Visa, Tarifas y Requisitos)',
    excerptEs: '¿Planea un viaje a Turquía? ¡Obtenga su e-visa de Turquía en 3 minutos! Guía completa para viajeros indios: requisitos, tarifas (₹4,500), documentos, tiempo de procesamiento y proceso de solicitud paso a paso.',
    contentEs: `<h2>Guía de e-Visa de Turquía para Ciudadanos Indios 2025</h2><p>Los ciudadanos indios pueden obtener una e-visa de Turquía completamente en línea en minutos. Esta guía cubre todo el proceso de solicitud, requisitos, costos y consejos para 2025.</p><h3>Información Rápida</h3><ul><li>Tarifa: USD 51.20 (₹4,500 aprox.)</li><li>Tiempo de procesamiento: 3-5 minutos</li><li>Validez: 180 días</li><li>Estancia: Hasta 30 días</li><li>Sitio web oficial: www.evisa.gov.tr</li></ul><h3>Requisitos</h3><ul><li>Pasaporte válido por 6+ meses</li><li>Tarjeta de crédito/débito para pago</li><li>Dirección de correo electrónico</li><li>Detalles del viaje</li></ul><h3>Proceso Paso a Paso</h3><ol><li>Visite www.evisa.gov.tr</li><li>Seleccione India como nacionalidad</li><li>Complete el formulario de solicitud</li><li>Pague USD 51.20</li><li>Reciba e-visa por correo electrónico</li><li>Imprima copias para el viaje</li></ol><p>La e-visa es obligatoria para todos los viajeros indios. Solicite al menos 48 horas antes del viaje.</p>`
  },
  'turkey-tour-cost-from-india-2025': {
    titleEs: 'Costo de Tour a Turquía desde India 2025: Guía de Presupuesto Completa (₹1.2L - ₹3L)',
    excerptEs: '¿Planea un viaje a Turquía desde India? Obtenga el desglose completo de costos: viajes económicos de ₹1.2L a tours de lujo de ₹3L. Costos de vuelos, gastos diarios, precios de paquetes y consejos para ahorrar dinero para 2025.',
    contentEs: `<h2>Costo de Viaje a Turquía desde India - Desglose Completo</h2><p>Un viaje de 7 días a Turquía desde India cuesta entre ₹1,20,000 y ₹3,00,000 por persona dependiendo del estilo de viaje. Aquí está el desglose completo.</p><h3>Resumen de Costos</h3><ul><li>Tour Económico (7 días): ₹1,20,000 - ₹1,50,000</li><li>Tour de Rango Medio (7 días): ₹1,70,000 - ₹2,00,000</li><li>Tour de Lujo (7 días): ₹2,50,000 - ₹3,50,000</li></ul><h3>Desglose de Gastos</h3><h4>1. Vuelos</h4><ul><li>Temporada baja: ₹35,000-50,000</li><li>Temporada media: ₹45,000-65,000</li><li>Temporada alta: ₹60,000-85,000</li></ul><h4>2. Alojamiento (por noche)</h4><ul><li>Presupuesto: ₹3,000-5,000</li><li>Rango medio: ₹6,000-10,000</li><li>Lujo: ₹12,000-25,000</li></ul><h4>3. Comida Diaria</h4><ul><li>Económica: ₹1,500-2,000</li><li>Rango medio: ₹3,000-4,500</li><li>Lujo: ₹6,000-10,000</li></ul><h4>4. Actividades Principales</h4><ul><li>Globo aerostático Capadocia: ₹12,000-18,000</li><li>Entradas a museos: ₹5,000-10,000</li><li>Tours guiados: ₹15,000-30,000</li></ul><h4>5. Otros Costos</h4><ul><li>Visa: ₹4,500</li><li>Transporte local: ₹10,000-25,000</li><li>Compras: ₹5,000-20,000</li><li>Seguro: ₹2,000-5,000</li></ul><h3>Consejos para Ahorrar</h3><ol><li>Reserve vuelos 3-4 meses antes</li><li>Viaje en abril-mayo o septiembre-octubre</li><li>Use transporte público</li><li>Coma en restaurantes locales</li><li>Considere paquetes turísticos</li></ol><p>La mejor época para visitar es abril-mayo u septiembre-octubre para clima perfecto y precios moderados.</p>`
  },
  '10-day-turkey-itinerary-from-india': {
    titleEs: '10 Días en Turquía desde India: Itinerario Perfecto (Estambul, Capadocia y Más)',
    excerptEs: '¿Primera vez en Turquía? Este itinerario perfecto de 10 días cubre Estambul, Capadocia, Éfeso y Pamukkale. Planes diarios, consejos de viaje, costos y qué esperar. ¡Guía completa para viajeros indios!',
    contentEs: `<h2>Itinerario Perfecto de 10 Días en Turquía para Viajeros Indios</h2><p>Este itinerario cubre los mejores lugares de Turquía: Estambul, Capadocia, Pamukkale y la costa egea. Perfecto para viajeros primerizos desde India.</p><h3>Resumen del Itinerario</h3><ul><li>Días 1-3: Estambul (3 noches)</li><li>Días 4-6: Capadocia (3 noches)</li><li>Día 7: Pamukkale (1 noche)</li><li>Días 8-9: Éfeso/Kusadasi (2 noches)</li><li>Día 10: Regreso a casa</li></ul><h3>Itinerario Detallado</h3><h4>Días 1-3: Estambul</h4><p><strong>Día 1:</strong> Llegada, check-in, explorar Sultanahmet</p><ul><li>Mezquita Azul</li><li>Santa Sofía</li><li>Cisterna Basílica</li></ul><p><strong>Día 2:</strong> Palacio Topkapi y Gran Bazar</p><p><strong>Día 3:</strong> Crucero Bósforo, Torre Gálata, Taksim</p><h4>Días 4-6: Capadocia</h4><p><strong>Día 4:</strong> Vuelo a Capadocia, check-in hotel cueva</p><p><strong>Día 5:</strong> Paseo en globo aerostático, Tour Verde</p><p><strong>Día 6:</strong> Tour Rojo, Museo Göreme</p><h4>Día 7: Pamukkale</h4><p>Terrazas de travertino, antigua Hierápolis</p><h4>Días 8-9: Éfeso/Kusadasi</h4><p>Antigua Éfeso, Casa de la Virgen María, playa</p><h4>Día 10: Regreso</h4><p>Vuelo de regreso a India</p><h3>Costos Estimados</h3><p>Costo total: ₹1,80,000 - ₹2,50,000 por persona</p><h3>Consejos para Viajeros Indios</h3><ul><li>Visa obligatoria: Obtenga e-visa en línea</li><li>Restaurantes indios disponibles en ciudades principales</li><li>Guías de habla hindi disponibles</li><li>Mejor época: Abril-mayo, septiembre-octubre</li></ul>`
  },
  'ultimate-turkey-travel-guide-2025-everything-you-need-to-know': {
    titleEs: 'Guía de Viaje Definitiva de Turquía 2025: Todo lo que Necesita Saber',
    excerptEs: '¿Planea un viaje a Turquía? Esta guía completa de 2025 cubre los mejores destinos, cuándo visitar, qué comer, consejos de presupuesto, itinerarios de muestra y todo lo necesario para una aventura turca inolvidable.',
    contentEs: `<h2>Guía de Viaje Completa de Turquía 2025</h2><p>Turquía es un destino extraordinario que combina historia antigua, paisajes impresionantes, deliciosa cocina y hospitalidad cálida. Esta guía completa cubre todo para 2025.</p><h3>Principales Destinos</h3><h4>1. Estambul</h4><p>La ciudad donde Oriente se encuentra con Occidente. Imprescindibles: Santa Sofía, Mezquita Azul, Palacio Topkapi, Gran Bazar, crucero Bósforo.</p><h4>2. Capadocia</h4><p>Famosa por paseos en globo aerostático, hoteles cueva y paisajes de otro mundo. No se pierda el Museo al Aire Libre de Göreme y ciudades subterráneas.</p><h4>3. Pamukkale</h4><p>Terrazas de travertino blanco y antigua ciudad de Hierápolis.</p><h4>4. Éfeso</h4><p>Ruinas antiguas mejor preservadas, Biblioteca de Celso, Gran Teatro.</p><h4>5. Antalya</h4><p>Hermosas playas, casco antiguo, cataratas Duden.</p><h3>Mejor Época para Visitar</h3><ul><li>Primavera (abril-mayo): Clima perfecto, flores en flor</li><li>Otoño (septiembre-octubre): Cálido, menos multitudes</li><li>Verano (junio-agosto): Caluroso, ocupado, temporada de playa</li><li>Invierno (noviembre-marzo): Frío, barato, mejor para ciudades</li></ul><h3>Requisitos de Visa</h3><p>La mayoría de viajeros necesitan e-visa. Solicite en línea en www.evisa.gov.tr. Procesamiento instantáneo, válida 180 días, estancia de 30 días.</p><h3>Presupuesto Diario</h3><ul><li>Económico: ₹3,000-5,000</li><li>Rango medio: ₹8,000-12,000</li><li>Lujo: ₹20,000+</li></ul><h3>Comida Turca Imprescindible</h3><ul><li>Kebabs (Adana, Iskender)</li><li>Meze (aperitivos)</li><li>Baklava (postre)</li><li>Té turco y café</li><li>Pide (pizza turca)</li><li>Doner kebab</li></ul><h3>Consejos de Transporte</h3><ul><li>Vuelos domésticos: Rápidos entre ciudades</li><li>Autobuses: Cómodos y económicos</li><li>Metro de Estambul: Eficiente, económico</li><li>Taxis: Use aplicaciones o taxímetro</li></ul><h3>Consejos de Seguridad</h3><ul><li>Turquía es generalmente segura para turistas</li><li>Mantenga objetos de valor seguros</li><li>Use empresas de tours oficiales</li><li>Respete costumbres locales</li><li>Regateé en bazares</li></ul><h3>Frases Esenciales en Turco</h3><ul><li>Merhaba - Hola</li><li>Teşekkür ederim - Gracias</li><li>Lütfen - Por favor</li><li>Ne kadar? - ¿Cuánto cuesta?</li><li>Hesap lütfen - La cuenta, por favor</li></ul><h3>Itinerarios Sugeridos</h3><p><strong>5 días:</strong> Estambul (3) + Capadocia (2)</p><p><strong>7 días:</strong> Estambul (3) + Capadocia (2) + Pamukkale (2)</p><p><strong>10 días:</strong> Estambul (3) + Capadocia (3) + Pamukkale (1) + Éfeso (2) + Antalya (1)</p><p>Turquía ofrece experiencias inolvidables para cada tipo de viajero. ¡Planifique su viaje hoy!</p>`
  },
  'istanbul-travel-guide-2025': {
    titleEs: 'Guía de Viaje de Estambul 2025: Guía Completa de la Ciudad y Qué Hacer',
    excerptEs: 'Descubra Estambul con nuestra guía completa de 2025. Desde Santa Sofía hasta joyas ocultas, conozca los mejores barrios, dónde comer, cómo moverse y consejos internos para experimentar la ciudad donde Oriente se encuentra con Occidente.',
    contentEs: `<h2>Guía Completa de Estambul 2025</h2><p>Estambul, la única ciudad que se extiende sobre dos continentes, ofrece una fascinante mezcla de historia, cultura y modernidad. Esta guía cubre todo para 2025.</p><h3>Atracciones Principales</h3><h4>1. Santa Sofía</h4><p>Maravilla arquitectónica icónica, antigua basílica cristiana, ahora mezquita. Entrada gratuita.</p><h4>2. Mezquita Azul (Sultan Ahmed)</h4><p>Mezquita impresionante con azulejos azules. Entrada gratuita, vístase modestamente.</p><h4>3. Palacio Topkapi</h4><p>Residencia imperial otomana, museo, tesoro. Entrada: ₹1,800.</p><h4>4. Cisterna Basílica</h4><p>Cisterna subterránea antigua con columnas de Medusa. Entrada: ₹800.</p><h4>5. Gran Bazar</h4><p>Mercado cubierto masivo, 4,000 tiendas, regateo esperado.</p><h4>6. Bazar de Especias</h4><p>Especias coloridas, dulces, delicias turcas.</p><h4>7. Crucero por el Bósforo</h4><p>Imprescindible, vea palacios, puentes, dos continentes. ₹1,200-2,500.</p><h4>8. Torre Gálata</h4><p>Vistas panorámicas de Estambul. Entrada: ₹1,000.</p><h3>Mejores Barrios</h3><h4>Sultanahmet</h4><p>Casco antiguo, principales sitios históricos, hoteles turísticos.</p><h4>Beyoğlu/Taksim</h4><p>Moderno, vida nocturna, compras, cafés, calle Istiklal.</p><h4>Ortaköy</h4><p>Junto al Bósforo, cafés, mezquita pintoresca, kumpir.</p><h4>Kadıköy (lado asiático)</h4><p>Auténtico, mercados, cafés, vida local.</p><h3>Dónde Comer</h3><h4>Comida Tradicional Turca</h4><ul><li>Hamdi Restaurant (kebabs)</li><li>Karaköy Lokantası (cocina turca)</li><li>Pandeli (restaurante histórico)</li></ul><h4>Comida India</h4><ul><li>Madhu's (Swissôtel)</li><li>Delhi Darbar</li><li>Govinda (vegetariano)</li></ul><h4>Comida Callejera</h4><ul><li>Balık ekmek (sándwich de pescado) - Puente Gálata</li><li>Simit (rosquilla de sésamo)</li><li>Doner kebab</li></ul><h3>Transporte</h3><h4>Tarjeta Istanbulkart</h4><p>Tarjeta recargable para todo transporte público. Compre en máquinas, ₹400 + recarga.</p><h4>Metro</h4><p>Limpio, eficiente, conecta puntos principales. ₹20-30 por viaje.</p><h4>Tranvía</h4><p>Línea T1 conecta principales sitios de Sultanahmet.</p><h4>Ferry</h4><p>Pintoresco, barato, conecta Europa-Asia. ₹20-40.</p><h4>Taxi</h4><p>Use aplicaciones (BiTaksi, Uber). Pida taxímetro.</p><h3>Alojamiento</h3><ul><li>Sultanahmet: Mejor para turistas, cerca de sitios</li><li>Beyoğlu: Moderno, vida nocturna</li><li>Bósforo: Vistas, lujo</li><li>Presupuesto: ₹3,000-5,000/noche</li><li>Rango medio: ₹6,000-12,000/noche</li><li>Lujo: ₹15,000+/noche</li></ul><h3>Itinerario de 3 Días</h3><p><strong>Día 1:</strong> Santa Sofía, Mezquita Azul, Cisterna, Gran Bazar</p><p><strong>Día 2:</strong> Palacio Topkapi, Crucero Bósforo, Torre Gálata</p><p><strong>Día 3:</strong> Taksim, Istiklal, lado asiático Kadıköy</p><h3>Consejos Internos</h3><ul><li>Compre Museum Pass Istanbul (ahorre dinero)</li><li>Evite restaurantes en áreas turísticas</li><li>Aprenda frases básicas en turco</li><li>Regatee en bazares (comience 50% menos)</li><li>Use transporte público, no siempre taxi</li><li>Pruebe comida callejera</li><li>Respete horas de oración en mezquitas</li><li>Vístase modestamente en sitios religiosos</li></ul><h3>Mejor Época para Visitar</h3><ul><li>Primavera (abril-mayo): Perfecto</li><li>Otoño (septiembre-octubre): Excelente</li><li>Verano: Caluroso, ocupado</li><li>Invierno: Frío, menos multitudes</li></ul><p>Estambul es mágica. ¡Planifique al menos 3-4 días para experimentar esta increíble ciudad!</p>`
  },
  'cappadocia-travel-guide-2025-hot-air-balloons-cave-hotels-more': {
    titleEs: 'Guía de Viaje de Capadocia 2025: Globos Aerostáticos, Hoteles Cueva y Más',
    excerptEs: 'Guía completa de Capadocia 2025: Todo sobre los famosos paseos en globo aerostático, mejores hoteles cueva, ciudades subterráneas, caminatas por valles, tours y consejos internos para experimentar el destino más mágico de Turquía.',
    contentEs: `<h2>Guía Completa de Capadocia 2025</h2><p>Capadocia es el destino más mágico de Turquía, famoso por paseos en globo aerostático, hoteles cueva y paisajes de otro mundo. Esta guía cubre todo para 2025.</p><h3>Paseo en Globo Aerostático</h3><h4>La Experiencia Imprescindible</h4><p>El paseo en globo aerostático de Capadocia es una de las mejores experiencias del mundo. Ver amanecer sobre chimeneas de hadas desde un globo es inolvidable.</p><h4>Costo</h4><ul><li>Cesta estándar (16-20 personas): ₹12,000-15,000</li><li>Cesta pequeña (8-12 personas): ₹16,000-18,000</li><li>Vuelo privado: ₹80,000+</li></ul><h4>Consejos de Reserva</h4><ul><li>Reserve con 2-3 semanas de anticipación</li><li>Temporada alta (abril-octubre): Reserve antes</li><li>Vuelos pueden cancelarse por clima</li><li>Recogida 4:30-5:00 AM</li><li>Duración: 1 hora de vuelo, 3 horas total</li></ul><h4>Mejores Compañías</h4><ul><li>Butterfly Balloons</li><li>Royal Balloon</li><li>Kapadokya Balloons</li><li>Turkiye Balloons</li></ul><h3>Hoteles Cueva</h3><p>Dormir en un hotel cueva tallado en roca es una experiencia única de Capadocia.</p><h4>Mejores Hoteles Cueva</h4><h5>Lujo</h5><ul><li>Museum Hotel (₹25,000-40,000/noche)</li><li>Argos in Cappadocia (₹30,000+/noche)</li><li>Sultan Cave Suites (₹20,000-35,000/noche)</li></ul><h5>Rango Medio</h5><ul><li>Kelebek Cave Hotel (₹8,000-15,000/noche)</li><li>Traveller's Cave Hotel (₹6,000-12,000/noche)</li><li>Cappadocia Cave Suites (₹7,000-13,000/noche)</li></ul><h5>Presupuesto</h5><ul><li>Cave Konak (₹4,000-7,000/noche)</li><li>Amor Cave House (₹3,500-6,000/noche)</li></ul><h3>Ciudades Principales</h3><h4>Göreme</h4><p>Pueblo turístico principal, más hoteles cueva, Museo al Aire Libre de Göreme.</p><h4>Uçhisar</h4><p>Pueblo más alto, castillo de roca, vistas impresionantes, menos turístico.</p><h4>Avanos</h4><p>Pueblo de cerámica a orillas del río, talleres de alfarería, menos turístico.</p><h4>Ortahisar</h4><p>Castillo de roca, auténtico, menos multitudes.</p><h3>Principales Atracciones</h3><h4>Museo al Aire Libre de Göreme</h4><p>Patrimonio UNESCO, iglesias rupestres, frescos bizantinos. Entrada: ₹800.</p><h4>Ciudades Subterráneas</h4><ul><li>Derinkuyu: 8 niveles bajo tierra</li><li>Kaymakli: Más accesible</li><li>Entrada: ₹600-800</li></ul><h4>Valles</h4><ul><li>Valle Rojo: Mejor para atardecer</li><li>Valle Rosa: Hermosas caminatas</li><li>Valle del Amor: Formaciones únicas</li><li>Valle Pigeon: Cuevas de palomas</li></ul><h3>Tours</h3><h4>Tour Rojo</h4><p>Museo Göreme, Pasabag, Devrent, Avanos, castillo Uçhisar. Día completo: ₹2,500-3,500.</p><h4>Tour Verde</h4><p>Ciudad subterránea, valle Ihlara, monasterio Selime. Día completo: ₹2,500-3,500.</p><h4>Tour ATV</h4><p>Explore valles en quad, amanecer/atardecer. ₹3,000-4,000.</p><h4>Tour a Caballo</h4><p>Caballos tradicionales de Capadocia. ₹2,500-3,500.</p><h3>Mejor Época para Visitar</h3><ul><li>Abril-Mayo: Clima perfecto, flores</li><li>Septiembre-Octubre: Excelente clima, menos multitudes</li><li>Junio-Agosto: Caluroso, ocupado</li><li>Noviembre-Marzo: Frío, puede haber nieve</li></ul><h3>Cómo Llegar</h3><h4>En Avión</h4><ul><li>Aeropuerto Nevşehir (30 min a Göreme)</li><li>Aeropuerto Kayseri (1 hora a Göreme)</li><li>Vuelos desde Estambul: 1.5 horas, ₹3,500-6,000</li></ul><h4>En Autobús</h4><ul><li>Desde Estambul: 11-12 horas, ₹1,500-2,500</li><li>Autobuses nocturnos cómodos</li></ul><h3>Dónde Comer</h3><h4>Cocina Turca</h4><ul><li>Seten Restaurant (testi kebab)</li><li>Ziggy's Shoppe & Café</li><li>Dibek Traditional Cookery</li></ul><h4>Comida India</h4><ul><li>Namaste India</li><li>India Gate</li><li>Pukka Indian Restaurant</li></ul><h3>Itinerario de 3 Días</h3><p><strong>Día 1:</strong> Llegada, check-in hotel cueva, explorar Göreme, atardecer en Valle Rojo</p><p><strong>Día 2:</strong> Paseo en globo (5 AM), Tour Rojo, descanso</p><p><strong>Día 3:</strong> Tour Verde o ciudad subterránea, salida</p><h3>Consejos Internos</h3><ul><li>Reserve hotel cueva con terraza para vistas de globos</li><li>Los vuelos en globo se cancelan si hay viento</li><li>Traiga capas: mañanas frías, días cálidos</li><li>Camine al menos un valle</li><li>Pruebe testi kebab (cocinado en olla de barro)</li><li>Evite julio-agosto (muy caluroso, ocupado)</li><li>Reserve tours de grupo para ahorrar dinero</li></ul><p>Capadocia es verdaderamente mágica. ¡Planifique al menos 2-3 días para experimentar su belleza!</p>`
  },
  'best-turkey-tour-packages-2025-how-to-choose-the-perfect-trip': {
    titleEs: 'Mejores Paquetes Turísticos de Turquía 2025: Cómo Elegir el Viaje Perfecto',
    excerptEs: 'Guía completa para elegir el paquete turístico perfecto de Turquía en 2025. Compare tipos de paquetes, itinerarios populares, precios, qué está incluido, tours grupales vs privados y consejos de expertos para reservar el mejor viaje a Turquía.',
    contentEs: `<h2>Cómo Elegir el Paquete Turístico Perfecto de Turquía 2025</h2><p>Elegir el paquete turístico correcto de Turquía puede ser abrumador con tantas opciones. Esta guía le ayuda a tomar la mejor decisión para 2025.</p><h3>Tipos de Paquetes Turísticos</h3><h4>1. Paquetes Clásicos (7-10 días)</h4><p>Cubren destinos principales: Estambul, Capadocia, Pamukkale, Éfeso.</p><ul><li>Ideal para: Viajeros primerizos</li><li>Costo: ₹1,20,000 - ₹2,50,000</li><li>Incluye: Vuelos, hoteles, tours, algunas comidas</li></ul><h4>2. Paquetes de Lujo</h4><p>Hoteles 5 estrellas, tours privados, experiencias exclusivas.</p><ul><li>Ideal para: Lunas de miel, viajeros premium</li><li>Costo: ₹2,50,000 - ₹5,00,000</li><li>Incluye: Todo + extras premium</li></ul><h4>3. Paquetes Económicos</h4><p>Hoteles básicos, tours de grupo, servicios esenciales.</p><ul><li>Ideal para: Viajeros con presupuesto limitado</li><li>Costo: ₹80,000 - ₹1,50,000</li><li>Incluye: Básicos, algunas comidas opcionales</li></ul><h4>4. Paquetes Temáticos</h4><ul><li>Tours históricos</li><li>Tours de aventura</li><li>Tours gastronómicos</li><li>Tours fotográficos</li></ul><h3>Itinerarios Populares</h3><h4>Clásico de 7 Días</h4><p>Estambul (3) → Capadocia (2) → Pamukkale (2)</p><h4>Completo de 10 Días</h4><p>Estambul (3) → Capadocia (3) → Pamukkale (1) → Éfeso (2) → Antalya (1)</p><h4>Especial de 5 Días</h4><p>Estambul (3) → Capadocia (2)</p><h3>Qué Está Incluido</h3><h4>Generalmente Incluido</h4><ul><li>Vuelos internacionales ida y vuelta</li><li>Vuelos domésticos</li><li>Alojamiento en hoteles</li><li>Traslados aeropuerto-hotel</li><li>Tours diarios con guía</li><li>Entradas a atracciones</li><li>Algunos desayunos</li></ul><h4>Generalmente No Incluido</h4><ul><li>Visa de Turquía (₹4,500)</li><li>Almuerzo y cena</li><li>Actividades opcionales</li><li>Propinas para guías/conductores</li><li>Gastos personales</li><li>Seguro de viaje</li></ul><h3>Tours de Grupo vs Privados</h3><h4>Tours de Grupo</h4><p><strong>Ventajas:</strong></p><ul><li>Más económicos</li><li>Conocer otros viajeros</li><li>Itinerario fijo</li><li>Guías experimentados</li></ul><p><strong>Desventajas:</strong></p><ul><li>Menos flexibilidad</li><li>Ritmo fijo</li><li>Grupos de 15-30 personas</li></ul><h4>Tours Privados</h4><p><strong>Ventajas:</strong></p><ul><li>Completamente personalizable</li><li>Itinerario flexible</li><li>Guía dedicado</li><li>A su propio ritmo</li></ul><p><strong>Desventajas:</strong></p><ul><li>Más caros (30-50% más)</li><li>Poca interacción social</li></ul><h3>Comparación de Precios</h3><table><tr><td><strong>Tipo de Paquete</strong></td><td><strong>7 Días</strong></td><td><strong>10 Días</strong></td></tr><tr><td>Económico</td><td>₹1,20,000</td><td>₹1,80,000</td></tr><tr><td>Rango Medio</td><td>₹1,70,000</td><td>₹2,50,000</td></tr><tr><td>Lujo</td><td>₹2,50,000</td><td>₹3,50,000</td></tr><tr><td>Premium</td><td>₹3,50,000+</td><td>₹5,00,000+</td></tr></table><h3>Cómo Elegir</h3><h4>Considere:</h4><ul><li>Presupuesto</li><li>Duración del viaje</li><li>Estilo de viaje (lujo/económico)</li><li>Intereses (historia/aventura/comida)</li><li>Composición del grupo (familia/pareja/solo)</li><li>Época del año</li></ul><h3>Qué Buscar en un Operador Turístico</h3><ul><li>Licencia IATA/TAAI</li><li>Reseñas positivas</li><li>Precios transparentes</li><li>Soporte 24/7</li><li>Términos de cancelación claros</li><li>Seguro incluido</li><li>Guías experimentados</li></ul><h3>Mejor Época para Reservar</h3><ul><li>Reserve 3-4 meses antes</li><li>Mejores ofertas: Enero-febrero para viajes de primavera/otoño</li><li>Evite reservas de último minuto</li></ul><h3>Consejos de Expertos</h3><ul><li>Lea reseñas de paquetes</li><li>Verifique qué está incluido/excluido</li><li>Pregunte sobre tamaño del grupo</li><li>Confirme categoría de hotel</li><li>Pregunte sobre comidas indias</li><li>Verifique disponibilidad de guía en hindi</li><li>Confirme hora de salida de vuelo</li><li>Lea política de cancelación</li></ul><h3>Banderas Rojas</h3><ul><li>Precios demasiado buenos para ser verdad</li><li>Sin detalles claros de itinerario</li><li>Pago solo en efectivo</li><li>Sin información de contacto</li><li>Reseñas malas</li><li>Costos ocultos</li></ul><p>Elegir el paquete correcto hace que su viaje a Turquía sea inolvidable. ¡Investigue, compare y reserve sabiamente!</p>`
  },
  'ephesus-ancient-turkey-complete-guide-to-historical-sites': {
    titleEs: 'Éfeso y Turquía Antigua: Guía Completa de Sitios Históricos',
    excerptEs: 'Guía completa de los sitios antiguos de Turquía en 2025: Éfeso, Pamukkale, Troya, Pérgamo y más. Incluye antecedentes históricos, qué ver, consejos de planificación, excursiones para pasajeros de cruceros y consejos expertos para visitar.',
    contentEs: `<h2>Guía Completa de Sitios Históricos Antiguos de Turquía</h2><p>Turquía alberga algunos de los sitios históricos mejor preservados del mundo. Esta guía cubre los principales sitios antiguos para 2025.</p><h3>Éfeso - La Joya de la Corona</h3><h4>Descripción</h4><p>Éfeso es una de las ciudades antiguas mejor preservadas del mundo mediterráneo. Una vez fue el segundo puerto más importante del Imperio Romano.</p><h4>Principales Atracciones</h4><ul><li><strong>Biblioteca de Celso:</strong> Fachada icónica, una de las bibliotecas antiguas más impresionantes</li><li><strong>Gran Teatro:</strong> Capacidad para 25,000, acústica increíble</li><li><strong>Templo de Artemisa:</strong> Una de las Siete Maravillas (solo ruinas)</li><li><strong>Casas de Terraza:</strong> Casas romanas bien preservadas con mosaicos</li><li><strong>Ágora de Estado:</strong> Plaza pública principal</li></ul><h4>Información Práctica</h4><ul><li><strong>Entrada:</strong> ₹1,000 (Casas de Terraza adicionales ₹600)</li><li><strong>Mejor época:</strong> Temprano en la mañana o tarde en la tarde</li><li><strong>Duración:</strong> 2-3 horas</li><li><strong>Ubicación:</strong> Cerca de Kusadasi/Selçuk</li><li><strong>Consejos:</strong> Use zapatos cómodos, sombrero, protector solar, traiga agua</li></ul><h4>Sitios Cercanos</h4><ul><li><strong>Casa de la Virgen María:</strong> Se cree que vivió aquí últimos días. Entrada: ₹600</li><li><strong>Basílica de San Juan:</strong> Tumba del apóstol Juan</li><li><strong>Museo de Éfeso (Selçuk):</strong> Artefactos de Éfeso</li></ul><h3>Pamukkale - Castillo de Algodón</h3><h4>Descripción</h4><p>Terrazas blancas de travertino formadas por aguas termales ricas en minerales. Sitio Patrimonio de la Humanidad UNESCO.</p><h4>Qué Ver</h4><ul><li><strong>Terrazas de Travertino:</strong> Únicas piscinas blancas</li><li><strong>Antigua Hierápolis:</strong> Ciudad grecorromana, teatro, necrópolis</li><li><strong>Piscina de Cleopatra:</strong> Nade sobre columnas antiguas (₹800)</li><li><strong>Museo de Hierápolis:</strong> Artefactos antiguos</li></ul><h4>Información Práctica</h4><ul><li><strong>Entrada:</strong> ₹800</li><li><strong>Mejor época:</strong> Atardecer para fotos</li><li><strong>Duración:</strong> Medio día</li><li><strong>Consejos:</strong> Descalzo en terrazas, traiga traje de baño, puede estar resbaladizo</li></ul><h3>Troya - Ciudad de Leyenda</h3><h4>Descripción</h4><p>Famosa por la Guerra de Troya y el Caballo de Troya. Sitio arqueológico de 9 niveles de ciudades.</p><h4>Qué Ver</h4><ul><li><strong>Réplica del Caballo de Troya:</strong> Oportunidad de foto icónica</li><li><strong>Ruinas Antiguas:</strong> Murallas, casas, templos</li><li><strong>Museo de Troya:</strong> Artefactos y historia</li></ul><h4>Información Práctica</h4><ul><li><strong>Entrada:</strong> ₹600</li><li><strong>Ubicación:</strong> Cerca de Çanakkale</li><li><strong>Duración:</strong> 2 horas</li><li><strong>Mejor como:</strong> Excursión de un día desde Estambul o parada en ruta</li></ul><h3>Pérgamo (Bergama)</h3><h4>Descripción</h4><p>Antigua capital griega con impresionantes ruinas en la montaña.</p><h4>Qué Ver</h4><ul><li><strong>Acrópolis:</strong> Teatro empinado, templos, biblioteca</li><li><strong>Asklepion:</strong> Antiguo centro de curación</li><li><strong>Templo de Trajano:</strong> Vista panorámica</li><li><strong>Biblioteca:</strong> Una vez la segunda más grande después de Alejandría</li></ul><h4>Información Práctica</h4><ul><li><strong>Entrada:</strong> ₹600 por sitio</li><li><strong>Teleférico:</strong> A Acrópolis (₹400)</li><li><strong>Duración:</strong> Medio día</li></ul><h3>Otros Sitios Importantes</h3><h4>Afrodisias</h4><p>Ciudad antigua dedicada a Afrodita, estadio bien preservado, esculturas increíbles.</p><h4>Priene, Mileto, Didyma</h4><p>Tres sitios antiguos cerca de Kusadasi. Ideal para excursión de un día.</p><h4>Perge y Aspendos</h4><p>Cerca de Antalya. Aspendos tiene el mejor teatro romano preservado.</p><h4>Bodrum</h4><p>Castillo de San Pedro, Mausoleo de Halicarnaso (Maravilla del Mundo).</p><h3>Guía de Excursión en Crucero</h3><p>Muchos cruceros paran en Kusadasi. Desde el puerto:</p><h4>Opción 1: Solo Éfeso (3-4 horas)</h4><p>La opción más popular y factible.</p><h4>Opción 2: Éfeso + Casa de María (4-5 horas)</h4><p>Agregue sitio religioso.</p><h4>Opción 3: Éfeso + Playa (5-6 horas)</h4><p>Combine historia con relajación.</p><h4>Consejos de Crucero</h4><ul><li>Reserve tours de antemano</li><li>Verifique tiempo en puerto</li><li>Salga temprano para evitar multitudes</li><li>Use operadores turísticos locales confiables</li><li>Regrese al barco 1 hora antes de la salida</li></ul><h3>Consejos Generales para Sitios Antiguos</h3><ul><li><strong>Use zapatos cómodos:</strong> Mucho caminar en superficies irregulares</li><li><strong>Traiga agua:</strong> Especialmente en verano</li><li><strong>Protección solar:</strong> Sombrero, protector solar, anteojos de sol</li><li><strong>Contrate guía:</strong> Para entender la historia</li><li><strong>Llegue temprano:</strong> Evite calor y multitudes</li><li><strong>Respete sitios:</strong> No suba a ruinas</li><li><strong>Museum Pass:</strong> Considere si visita múltiples sitios</li></ul><h3>Mejor Época para Visitar</h3><ul><li><strong>Primavera (Abril-Mayo):</strong> Clima perfecto, flores</li><li><strong>Otoño (Septiembre-Octubre):</strong> Cálido pero no caluroso</li><li><strong>Evite:</strong> Julio-agosto (muy caluroso en sitios sin sombra)</li></ul><h3>Itinerario Sugerido de Sitios Históricos (7 Días)</h3><p><strong>Día 1-2:</strong> Estambul (Santa Sofía, Topkapi)</p><p><strong>Día 3:</strong> Troya (desde Estambul)</p><p><strong>Día 4-5:</strong> Éfeso + Pamukkale</p><p><strong>Día 6:</strong> Pérgamo</p><p><strong>Día 7:</strong> Regreso</p><h3>Costos Estimados</h3><ul><li><strong>Entradas:</strong> ₹500-1,000 por sitio</li><li><strong>Guías:</strong> ₹2,000-3,000 por medio día</li><li><strong>Transporte:</strong> Varía según método</li><li><strong>Tours:</strong> ₹2,500-5,000 por día de tour</li></ul><p>Los sitios antiguos de Turquía ofrecen una ventana al pasado. ¡Planifique su viaje histórico hoy!</p>`
  }
};

async function translateBlogs() {
  console.log('🔄 Fetching published blog posts...\n');

  const blogPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true
    }
  });

  console.log(`📝 Found ${blogPosts.length} published blog posts\n`);

  let updated = 0;
  let skipped = 0;

  for (const post of blogPosts) {
    const translation = blogTranslations[post.slug];

    if (translation) {
      console.log(`✅ Translating: "${post.title}"`);
      console.log(`   Slug: ${post.slug}`);

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          titleEs: translation.titleEs,
          excerptEs: translation.excerptEs,
          contentEs: translation.contentEs
        }
      });

      updated++;
      console.log(`   ✓ Updated with Spanish translation\n`);
    } else {
      console.log(`⚠️  No translation for: "${post.title}"`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   ℹ️  Add translation to blogTranslations object\n`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Translation Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${updated} blog posts`);
  console.log(`⚠️  Skipped: ${skipped} blog posts (no translation available)`);
  console.log(`📝 Total: ${blogPosts.length} blog posts`);
  console.log('='.repeat(50) + '\n');
}

translateBlogs()
  .then(() => {
    console.log('✨ Blog translation completed successfully!\n');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('❌ Error translating blogs:', error);
    prisma.$disconnect();
    process.exit(1);
  });
