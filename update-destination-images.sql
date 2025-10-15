-- Update Destination Attraction Images with New High-Quality Photos
-- Generated: 2025-10-15

-- ISTANBUL
UPDATE Destination SET attractions = '[
  {"name":"Blue Mosque (Sultan Ahmed Mosque)","description":"Marvel at the stunning blue tiles and six minarets of this iconic mosque","image":"/images/BlueMosqueIstanbul6minarets.jpg","duration":"1-2 hours"},
  {"name":"Hagia Sophia","description":"Ancient Byzantine basilica turned mosque, a masterpiece of architecture","image":"/images/ayasofya.jpg","duration":"2-3 hours"},
  {"name":"Grand Bazaar","description":"One of the largest covered markets in the world with over 4,000 shops","image":"/images/GrandBazaarDrone.jpg","duration":"2-4 hours"},
  {"name":"Topkapi Palace","description":"Former residence of Ottoman sultans with stunning views of the Bosphorus","image":"/images/topkapipalacegeneraldrone.jpg","duration":"2-3 hours"}
]' WHERE slug = 'istanbul';

-- CAPPADOCIA
UPDATE Destination SET attractions = '[
  {"name":"Hot Air Balloon Ride","description":"Float above the fairy chimneys at sunrise for breathtaking views","image":"/images/cappadociaballoonride.jpg","duration":"3 hours"},
  {"name":"Goreme Open Air Museum","description":"Ancient cave churches with beautiful frescoes","image":"/images/Goreme-Open-Air-Museum.jpg","duration":"2-3 hours"},
  {"name":"Underground Cities","description":"Explore ancient multi-level underground settlements","image":"/images/Underground-Cities.webp","duration":"1-2 hours"},
  {"name":"Cave Hotels","description":"Unique accommodation carved into fairy chimneys","image":"/images/Cave-Hotels.jpg","duration":"Overnight"}
]' WHERE slug = 'cappadocia';

-- ANTALYA
UPDATE Destination SET attractions = '[
  {"name":"Old Town (Kaleiçi)","description":"Historic Ottoman quarter with narrow streets and traditional houses","image":"/images/oldtownkaleici-antalya.jpg","duration":"2-3 hours"},
  {"name":"Düden Waterfalls","description":"Spectacular waterfalls cascading into the Mediterranean","image":"/images/duden-waterfalls-antalya.jpg","duration":"1-2 hours"},
  {"name":"Aspendos Theater","description":"Best-preserved Roman theater in the world with amazing acoustics","image":"/images/aspendos-theater-antalya.webp","duration":"2 hours"},
  {"name":"Konyaaltı Beach","description":"Beautiful pebble beach with crystal-clear waters and mountain backdrop","image":"/images/Konyaalti-Beach-Antalya.jpg","duration":"Half day"}
]' WHERE slug = 'antalya';

-- KUSADASI
UPDATE Destination SET attractions = '[
  {"name":"Ancient Ephesus","description":"One of the best-preserved ancient cities in the Mediterranean","image":"/images/Ephesus_Library.jpg","duration":"3-4 hours"},
  {"name":"House of Virgin Mary","description":"Sacred pilgrimage site where Mary is believed to have spent her last days","image":"/images/MeryemAnaEvi.jpeg","duration":"1 hour"},
  {"name":"Sirince Village","description":"Charming hillside Greek village famous for fruit wines","image":"/images/sirince.jpg","duration":"2 hours"},
  {"name":"Patara Beach","description":"Longest beach in Turkey with golden sand and ancient ruins","image":"/images/PataraBeach.jpg","duration":"Half day"}
]' WHERE slug = 'kusadasi';

-- EPHESUS
UPDATE Destination SET attractions = '[
  {"name":"Library of Celsus","description":"Stunning two-story facade of ancient Roman library","image":"/images/Ephesus_Library.jpg","duration":"30 minutes"},
  {"name":"Grand Theater","description":"Massive amphitheater seating 25,000 spectators","image":"/images/Ephesus_Library2.jpg","duration":"30 minutes"},
  {"name":"Temple of Artemis","description":"Ruins of one of the Seven Wonders of the Ancient World","image":"/images/didyma.jpg","duration":"30 minutes"},
  {"name":"Terrace Houses","description":"Luxurious homes of wealthy Romans with beautiful mosaics","image":"/images/Ephesus_Library2.jpg","duration":"1 hour"}
]' WHERE slug = 'ephesus';

-- PAMUKKALE
UPDATE Destination SET attractions = '[
  {"name":"Travertine Terraces","description":"Stunning white calcium pools cascading down the hillside","image":"/images/PamukkaleTravertenler.jpg","duration":"2-3 hours"},
  {"name":"Hierapolis Ancient City","description":"Greco-Roman spa city with theater and necropolis","image":"/images/HierapolisAntikKentiPamukkale.jpg","duration":"2-3 hours"},
  {"name":"Archaeology Museum","description":"Ancient artifacts and sculptures from Hierapolis excavations","image":"/images/hierapolis-archaeology-museum.jpg","duration":"1 hour"},
  {"name":"Cleopatra''s Pool","description":"Ancient thermal pool with submerged Roman columns","image":"/images/Cleopatra-Pool-Pamukkale.webp","duration":"1 hour"}
]' WHERE slug = 'pamukkale';

-- FETHIYE
UPDATE Destination SET attractions = '[
  {"name":"Ölüdeniz Beach","description":"Stunning Blue Lagoon with turquoise waters","image":"/images/Oludeniz-Beach- Fethiye.jpg","duration":"Full day"},
  {"name":"Paragliding","description":"Tandem paragliding from Babada Mountain","image":"/images/paragliding-fethiye.jpg","duration":"2-3 hours"},
  {"name":"Butterfly Valley","description":"Secluded canyon beach accessible by boat","image":"/images/butterflyvalleyfethiye.jpg","duration":"Half day"},
  {"name":"Saklikent Gorge","description":"Dramatic canyon with ice-cold mountain water","image":"/images/saklikent-fethiye.jpg","duration":"Half day"}
]' WHERE slug = 'fethiye';

-- MARMARIS
UPDATE Destination SET attractions = '[
  {"name":"Marmaris Marina","description":"Luxury yacht harbor with waterfront restaurants","image":"/images/marmarismarina.jpg","duration":"2-3 hours"},
  {"name":"Marmaris Castle","description":"Historic fortress with panoramic bay views","image":"/images/marmaris-castle.jpg","duration":"1-2 hours"},
  {"name":"Beach Clubs","description":"Trendy beach venues with music and entertainment","image":"/images/MarmarisBeachClub.webp","duration":"Full day"},
  {"name":"Boat Tours","description":"Daily cruises to hidden bays and islands","image":"/images/Marmaris-BoatTour.jpg","duration":"Full day"}
]' WHERE slug = 'marmaris';

-- BODRUM
UPDATE Destination SET attractions = '[
  {"name":"Bodrum Castle","description":"Crusader castle housing the Museum of Underwater Archaeology","image":"/images/bodrumcastle.jpg","duration":"2-3 hours"},
  {"name":"Ancient Theater","description":"Well-preserved Hellenistic amphitheater with sea views","image":"/images/bodrumancienttheatre.jpg","duration":"1 hour"},
  {"name":"Windmills","description":"Iconic white windmills overlooking the bay","image":"/images/bodrum-windmills2.jpg","duration":"30 minutes"},
  {"name":"Beach Clubs","description":"Trendy waterfront venues and crystal-clear coves","image":"/images/bodrumbeachclubs.jpg","duration":"Full day"}
]' WHERE slug = 'bodrum';

-- IZMIR
UPDATE Destination SET attractions = '[
  {"name":"Agora of Smyrna","description":"Ancient Roman marketplace ruins with impressive columns and arches","image":"/images/smyrna-izmir.jpg","duration":"1-2 hours"},
  {"name":"Konak Square","description":"Historic clock tower and central plaza, heart of modern Izmir","image":"/images/konak-izmir.jpg","duration":"1 hour"},
  {"name":"Kordon Promenade","description":"Beautiful waterfront walkway with cafes, restaurants and sea views","image":"/images/kordon-izmir.webp","duration":"2-3 hours"},
  {"name":"Kemeraltı Bazaar","description":"Vibrant historic market with traditional goods, spices and local crafts","image":"/images/kemeralti-izmir.webp","duration":"2-4 hours"}
]' WHERE slug = 'izmir';

-- ANKARA
UPDATE Destination SET attractions = '[
  {"name":"Anıtkabir","description":"Mausoleum of Mustafa Kemal Atatürk, founder of modern Turkey","image":"/images/anitkabir.jpg","duration":"2-3 hours"},
  {"name":"Museum of Anatolian Civilizations","description":"Showcases archaeological treasures from ancient Anatolia","image":"/images/MuseumofAnatolianCivilizations.jpg","duration":"2-3 hours"},
  {"name":"Ankara Castle","description":"Historic fortress offering panoramic views of the city","image":"/images/AnkaraCastle.jpg","duration":"1-2 hours"},
  {"name":"Atakule Tower","description":"Modern observation tower with 360-degree city views","image":"/images/AtakuleTowerAnkara.jpg","duration":"1 hour"}
]' WHERE slug = 'ankara';

-- BURSA
UPDATE Destination SET attractions = '[
  {"name":"Grand Mosque (Ulu Camii)","description":"Magnificent Ottoman mosque with 20 domes and beautiful calligraphy","image":"/images/GrandMosqueBursa.jpg","duration":"1 hour"},
  {"name":"Green Tomb (Yeşil Türbe)","description":"Stunning turquoise-tiled mausoleum of Sultan Mehmed I","image":"/images/GreenTombBursa.jpg","duration":"30 minutes"},
  {"name":"Uludağ Mountain","description":"Premier ski resort in winter, hiking paradise in summer","image":"/images/UludagMountain.jpg","duration":"Full day"},
  {"name":"Historic Silk Market","description":"Traditional covered bazaar selling silk products and local crafts","image":"/images/HistoricSilkMarketBursa.jpg","duration":"2-3 hours"}
]' WHERE slug = 'bursa';

-- TRABZON
UPDATE Destination SET attractions = '[
  {"name":"Sumela Monastery","description":"Spectacular cliff-side monastery with breathtaking mountain views","image":"/images/sumelamonastery.jpg","duration":"3-4 hours"},
  {"name":"Uzungöl Lake","description":"Picturesque mountain lake surrounded by green valleys and forests","image":"/images/uzungollake.jpg","duration":"Half day"},
  {"name":"Atatürk Pavilion","description":"Beautiful historic mansion set in lush gardens","image":"/images/ataturkpavilion.webp","duration":"1-2 hours"},
  {"name":"Trabzon Castle","description":"Ancient fortress with Byzantine and Ottoman heritage","image":"/images/trabzon.jpg","duration":"1 hour"}
]' WHERE slug = 'trabzon';

-- KONYA
UPDATE Destination SET attractions = '[
  {"name":"Mevlana Museum","description":"Mausoleum of Rumi, the famous Persian poet and Sufi mystic","image":"/images/MevlanaMuseum.jpg","duration":"2-3 hours"},
  {"name":"Whirling Dervishes Ceremony","description":"Mesmerizing spiritual dance performance of the Mevlevi Order","image":"/images/WhirlingDervishes.jpg","duration":"1 hour"},
  {"name":"Alaeddin Mosque","description":"Historic Seljuk mosque with beautiful architecture","image":"/images/alaeddinmosque.jpg","duration":"1 hour"},
  {"name":"İnce Minare Museum","description":"Former Seljuk madrasa showcasing Islamic art and woodwork","image":"/images/InceMinare.webp","duration":"1-2 hours"}
]' WHERE slug = 'konya';

-- GALLIPOLI
UPDATE Destination SET attractions = '[
  {"name":"ANZAC Cove","description":"Historic landing site of Australian and New Zealand forces in 1915","image":"/images/anzac-cove.jpg","duration":"1-2 hours"},
  {"name":"Lone Pine Cemetery","description":"Moving memorial and cemetery honoring fallen Australian soldiers","image":"/images/Lone-Pine-Cemetery.jpg","duration":"1 hour"},
  {"name":"Chunuk Bair","description":"Strategic hilltop battle site with panoramic views","image":"/images/chunuk-bair.jpg","duration":"1 hour"},
  {"name":"Turkish Martyrs Memorial","description":"Impressive monument commemorating Turkish fallen soldiers","image":"/images/TurkishMartyrsMemorial.jpg","duration":"30 minutes"}
]' WHERE slug = 'gallipoli';

-- TROY
UPDATE Destination SET attractions = '[
  {"name":"Trojan Horse Replica","description":"Famous wooden horse from the legendary tale, perfect for photos","image":"/images/pergamon.jpg","duration":"30 minutes"},
  {"name":"Ancient City Ruins","description":"Nine layers of ancient cities spanning 4,000 years of history","image":"/images/bergama.jpg","duration":"2-3 hours"},
  {"name":"Archaeological Museum","description":"Artifacts and treasures from the excavations of Troy","image":"/images/pergamon.jpg","duration":"1-2 hours"},
  {"name":"City Walls","description":"Impressive fortifications from multiple historical periods","image":"/images/bergama.jpg","duration":"1 hour"}
]' WHERE slug = 'troy';

-- ALANYA
UPDATE Destination SET attractions = '[
  {"name":"Alanya Castle","description":"Medieval fortress on hilltop with stunning panoramic sea views","image":"/images/Alanya-Castle.jpg","duration":"2-3 hours"},
  {"name":"Cleopatra Beach","description":"Beautiful sandy beach with crystal-clear turquoise waters","image":"/images/Cleopatra-Beach-in-Alanya.jpg","duration":"Half day"},
  {"name":"Damlataş Cave","description":"Stunning stalactite cave with therapeutic microclimate","image":"/images/damlatas-cave-in-alanya-in-turkey.jpg","duration":"30 minutes"},
  {"name":"Red Tower (Kızıl Kule)","description":"Historic Seljuk tower and symbol of Alanya","image":"/images/Alanya_Red_Tower_2.jpg","duration":"1 hour"}
]' WHERE slug = 'alanya';
