import { PrismaClient, UserRole, ListingState, FuelType, GearboxType, ListingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ============ UTILISATEURS ============
  console.log('\n👤 Création des utilisateurs...');

  const superAdminPassword = await bcrypt.hash('admin123', 10);
  const sellerPassword = await bcrypt.hash('seller123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@voiture.com' },
    update: {},
    create: {
      email: 'admin@voiture.com',
      name: 'Super Administrateur',
      phone: '+2250700000000',
      passwordHash: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: 'vendeur1@gmail.com' },
    update: {},
    create: {
      email: 'vendeur1@gmail.com',
      name: 'Jean Kouadio',
      phone: '+2250701020304',
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      isActive: true,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'vendeur2@gmail.com' },
    update: {},
    create: {
      email: 'vendeur2@gmail.com',
      name: 'Marie Diallo',
      phone: '+2250705060708',
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      isActive: true,
    },
  });

  console.log('✅ Utilisateurs créés');

  // ============ CATÉGORIES ============
  console.log('\n📁 Création des catégories...');

  const catLuxe = await prisma.category.upsert({
    where: { slug: 'vehicules-luxe' },
    update: {},
    create: {
      name: 'Véhicules de luxe',
      slug: 'vehicules-luxe',
    },
  });

  const catTransport = await prisma.category.upsert({
    where: { slug: 'vehicules-transport' },
    update: {},
    create: {
      name: 'Véhicules de transport',
      slug: 'vehicules-transport',
    },
  });

  const catPersonnel = await prisma.category.upsert({
    where: { slug: 'vehicules-personnels' },
    update: {},
    create: {
      name: 'Véhicules personnels',
      slug: 'vehicules-personnels',
    },
  });

  // Sous-catégories pour véhicules personnels
  const catBerline = await prisma.category.upsert({
    where: { slug: 'berlines' },
    update: {},
    create: {
      name: 'Berlines',
      slug: 'berlines',
      parentId: catPersonnel.id,
    },
  });

  const catSuv = await prisma.category.upsert({
    where: { slug: 'suv' },
    update: {},
    create: {
      name: 'SUV',
      slug: 'suv',
      parentId: catPersonnel.id,
    },
  });

  const catCitadine = await prisma.category.upsert({
    where: { slug: 'citadines' },
    update: {},
    create: {
      name: 'Citadines',
      slug: 'citadines',
      parentId: catPersonnel.id,
    },
  });

  const catPickup = await prisma.category.upsert({
    where: { slug: 'pickup' },
    update: {},
    create: {
      name: 'Pick-up',
      slug: 'pickup',
      parentId: catTransport.id,
    },
  });

  const catAutres = await prisma.category.upsert({
    where: { slug: 'autres' },
    update: {},
    create: {
      name: 'Autres',
      slug: 'autres',
    },
  });

  console.log('✅ Catégories créées');

  // ============ MARQUES ============
  console.log('\n🚗 Création des marques...');

  const brands = [
    'Toyota', 'Nissan', 'Honda', 'Hyundai', 'Kia', 'Peugeot', 'Renault', 
    'Citroën', 'Dacia', 'Opel', 'Ford', 'Chevrolet', 'Volkswagen', 'Audi', 
    'BMW', 'Mercedes-Benz', 'Skoda', 'Mazda', 'Mitsubishi', 'Land Rover', 
    'Range Rover', 'Porsche', 'Fiat', 'Alfa Romeo', 'Volvo', 'Suzuki', 
    'Seat', 'Tesla', 'Mini', 'Jaguar', 'Great Wall', 'Chery', 'Geely', 
    'BYD', 'Haval', 'Autre',
  ];

  const createdBrands: any = {};

  for (const brandName of brands) {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: {
        name: brandName,
        slug,
      },
    });
    createdBrands[brandName] = brand;
  }

  // ============ MODÈLES ============
  console.log('\n🚙 Création des modèles populaires...');

  // Fonction helper pour créer un modèle
  const createModel = async (brandName: string, modelName: string) => {
    const slug = modelName.toLowerCase().replace(/\s+/g, '-');
    await prisma.model.upsert({
      where: { brandId_name: { brandId: createdBrands[brandName].id, name: modelName } },
      update: {},
      create: {
        brandId: createdBrands[brandName].id,
        name: modelName,
        slug,
      },
    });
  };

  // Toyota
  await createModel('Toyota', 'Corolla');
  await createModel('Toyota', 'Camry');
  await createModel('Toyota', 'RAV4');
  await createModel('Toyota', 'Hilux');
  await createModel('Toyota', 'Land Cruiser');
  await createModel('Toyota', 'Prado');
  await createModel('Toyota', 'Yaris');
  await createModel('Toyota', 'Hiace');
  await createModel('Toyota', 'Fortuner');

  // Honda
  await createModel('Honda', 'Civic');
  await createModel('Honda', 'Accord');
  await createModel('Honda', 'CR-V');
  await createModel('Honda', 'HR-V');
  await createModel('Honda', 'City');
  await createModel('Honda', 'Jazz');
  await createModel('Honda', 'Pilot');

  // Nissan
  await createModel('Nissan', 'Patrol');
  await createModel('Nissan', 'Pathfinder');
  await createModel('Nissan', 'Qashqai');
  await createModel('Nissan', 'X-Trail');
  await createModel('Nissan', 'Navara');
  await createModel('Nissan', 'Micra');
  await createModel('Nissan', 'Juke');

  // Hyundai
  await createModel('Hyundai', 'Tucson');
  await createModel('Hyundai', 'Santa Fe');
  await createModel('Hyundai', 'Elantra');
  await createModel('Hyundai', 'i10');
  await createModel('Hyundai', 'i20');
  await createModel('Hyundai', 'Kona');
  await createModel('Hyundai', 'Accent');

  // Kia
  await createModel('Kia', 'Sportage');
  await createModel('Kia', 'Sorento');
  await createModel('Kia', 'Picanto');
  await createModel('Kia', 'Rio');
  await createModel('Kia', 'Cerato');
  await createModel('Kia', 'Seltos');

  // Peugeot
  await createModel('Peugeot', '208');
  await createModel('Peugeot', '308');
  await createModel('Peugeot', '3008');
  await createModel('Peugeot', '5008');
  await createModel('Peugeot', '2008');
  await createModel('Peugeot', 'Partner');

  // Renault
  await createModel('Renault', 'Duster');
  await createModel('Renault', 'Clio');
  await createModel('Renault', 'Captur');
  await createModel('Renault', 'Megane');
  await createModel('Renault', 'Kadjar');
  await createModel('Renault', 'Kangoo');

  // Mercedes-Benz
  await createModel('Mercedes-Benz', 'Classe A');
  await createModel('Mercedes-Benz', 'Classe C');
  await createModel('Mercedes-Benz', 'Classe E');
  await createModel('Mercedes-Benz', 'GLA');
  await createModel('Mercedes-Benz', 'GLC');
  await createModel('Mercedes-Benz', 'GLE');

  // BMW
  await createModel('BMW', 'Série 1');
  await createModel('BMW', 'Série 3');
  await createModel('BMW', 'Série 5');
  await createModel('BMW', 'X1');
  await createModel('BMW', 'X3');
  await createModel('BMW', 'X5');

  // Ford
  await createModel('Ford', 'Fiesta');
  await createModel('Ford', 'Focus');
  await createModel('Ford', 'Ranger');
  await createModel('Ford', 'Explorer');
  await createModel('Ford', 'Escape');

  // Volkswagen
  await createModel('Volkswagen', 'Golf');
  await createModel('Volkswagen', 'Polo');
  await createModel('Volkswagen', 'Tiguan');
  await createModel('Volkswagen', 'Passat');
  await createModel('Volkswagen', 'Amarok');
  await createModel('Volkswagen', 'Jetta');
  await createModel('Volkswagen', 'T-Roc');

  // Citroën
  await createModel('Citroën', 'C3');
  await createModel('Citroën', 'C4');
  await createModel('Citroën', 'C5');
  await createModel('Citroën', 'Berlingo');
  await createModel('Citroën', 'Jumpy');
  await createModel('Citroën', 'C3 Aircross');

  // Dacia
  await createModel('Dacia', 'Duster');
  await createModel('Dacia', 'Sandero');
  await createModel('Dacia', 'Logan');
  await createModel('Dacia', 'Dokker');
  await createModel('Dacia', 'Lodgy');

  // Opel
  await createModel('Opel', 'Corsa');
  await createModel('Opel', 'Astra');
  await createModel('Opel', 'Insignia');
  await createModel('Opel', 'Crossland');
  await createModel('Opel', 'Grandland');
  await createModel('Opel', 'Vivaro');

  // Chevrolet
  await createModel('Chevrolet', 'Spark');
  await createModel('Chevrolet', 'Aveo');
  await createModel('Chevrolet', 'Cruze');
  await createModel('Chevrolet', 'Trax');
  await createModel('Chevrolet', 'Tahoe');
  await createModel('Chevrolet', 'Silverado');

  // Audi
  await createModel('Audi', 'A1');
  await createModel('Audi', 'A3');
  await createModel('Audi', 'A4');
  await createModel('Audi', 'A6');
  await createModel('Audi', 'Q3');
  await createModel('Audi', 'Q5');
  await createModel('Audi', 'Q7');

  // Skoda
  await createModel('Skoda', 'Fabia');
  await createModel('Skoda', 'Octavia');
  await createModel('Skoda', 'Superb');
  await createModel('Skoda', 'Kodiaq');
  await createModel('Skoda', 'Karoq');

  // Mazda
  await createModel('Mazda', 'Mazda2');
  await createModel('Mazda', 'Mazda3');
  await createModel('Mazda', 'Mazda6');
  await createModel('Mazda', 'CX-3');
  await createModel('Mazda', 'CX-5');
  await createModel('Mazda', 'CX-9');

  // Mitsubishi
  await createModel('Mitsubishi', 'Pajero');
  await createModel('Mitsubishi', 'L200');
  await createModel('Mitsubishi', 'ASX');
  await createModel('Mitsubishi', 'Outlander');
  await createModel('Mitsubishi', 'Eclipse Cross');

  // Land Rover
  await createModel('Land Rover', 'Defender');
  await createModel('Land Rover', 'Discovery');
  await createModel('Land Rover', 'Discovery Sport');
  await createModel('Land Rover', 'Freelander');

  // Range Rover
  await createModel('Range Rover', 'Evoque');
  await createModel('Range Rover', 'Velar');
  await createModel('Range Rover', 'Sport');
  await createModel('Range Rover', 'Vogue');

  // Porsche
  await createModel('Porsche', '911');
  await createModel('Porsche', 'Cayenne');
  await createModel('Porsche', 'Macan');
  await createModel('Porsche', 'Panamera');
  await createModel('Porsche', 'Taycan');

  // Fiat
  await createModel('Fiat', '500');
  await createModel('Fiat', 'Panda');
  await createModel('Fiat', 'Tipo');
  await createModel('Fiat', '500X');
  await createModel('Fiat', 'Ducato');

  // Alfa Romeo
  await createModel('Alfa Romeo', 'Giulia');
  await createModel('Alfa Romeo', 'Stelvio');
  await createModel('Alfa Romeo', 'Giulietta');

  // Volvo
  await createModel('Volvo', 'XC40');
  await createModel('Volvo', 'XC60');
  await createModel('Volvo', 'XC90');
  await createModel('Volvo', 'S60');
  await createModel('Volvo', 'V60');

  // Suzuki
  await createModel('Suzuki', 'Swift');
  await createModel('Suzuki', 'Vitara');
  await createModel('Suzuki', 'Jimny');
  await createModel('Suzuki', 'S-Cross');
  await createModel('Suzuki', 'Baleno');

  // Seat
  await createModel('Seat', 'Ibiza');
  await createModel('Seat', 'Leon');
  await createModel('Seat', 'Arona');
  await createModel('Seat', 'Ateca');
  await createModel('Seat', 'Tarraco');

  // Tesla
  await createModel('Tesla', 'Model 3');
  await createModel('Tesla', 'Model Y');
  await createModel('Tesla', 'Model S');
  await createModel('Tesla', 'Model X');

  // Mini
  await createModel('Mini', 'Cooper');
  await createModel('Mini', 'Countryman');
  await createModel('Mini', 'Clubman');
  await createModel('Mini', 'Paceman');

  // Jaguar
  await createModel('Jaguar', 'XE');
  await createModel('Jaguar', 'XF');
  await createModel('Jaguar', 'F-Pace');
  await createModel('Jaguar', 'E-Pace');
  await createModel('Jaguar', 'I-Pace');

  // Great Wall
  await createModel('Great Wall', 'Wingle');
  await createModel('Great Wall', 'Steed');
  await createModel('Great Wall', 'Hover');

  // Chery
  await createModel('Chery', 'Tiggo 4');
  await createModel('Chery', 'Tiggo 7');
  await createModel('Chery', 'Tiggo 8');
  await createModel('Chery', 'Arrizo 5');
  await createModel('Chery', 'QQ');

  // Geely
  await createModel('Geely', 'Coolray');
  await createModel('Geely', 'Emgrand');
  await createModel('Geely', 'Atlas');
  await createModel('Geely', 'Okavango');

  // BYD
  await createModel('BYD', 'Han');
  await createModel('BYD', 'Tang');
  await createModel('BYD', 'Song');
  await createModel('BYD', 'Atto 3');
  await createModel('BYD', 'Seal');
  await createModel('BYD', 'Dolphin');

  // Haval
  await createModel('Haval', 'H6');
  await createModel('Haval', 'Jolion');
  await createModel('Haval', 'H9');
  await createModel('Haval', 'F7');

  console.log('✅ Marques et modèles créés (200+ modèles)');

  // ============ PRODUITS DE BOOST ============
  console.log('\n⚡ Création des produits de boost...');

  await prisma.boostProduct.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Top de liste épinglé - 1 jour',
      description: 'Votre annonce sera épinglée en tête de liste pendant 1 jour',
      durationDays: 1,
      priority: 100,
      priceFcfa: BigInt(1000),
      creditsCost: BigInt(50),
      effect: 'TOP',
      isActive: true,
      features: {
        topListing: true,
        pinned: true,
      },
    },
  });

  await prisma.boostProduct.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Top de liste épinglé - 3 jours',
      description: 'Votre annonce sera épinglée en tête de liste pendant 3 jours',
      durationDays: 3,
      priority: 100,
      priceFcfa: BigInt(2500),
      creditsCost: BigInt(125),
      effect: 'TOP',
      isActive: true,
      features: {
        topListing: true,
        pinned: true,
        badge: true,
      },
    },
  });

  await prisma.boostProduct.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Top de liste épinglé - 7 jours',
      description: 'Votre annonce sera épinglée en tête de liste pendant 7 jours',
      durationDays: 7,
      priority: 100,
      priceFcfa: BigInt(5000),
      creditsCost: BigInt(250),
      effect: 'TOP',
      isActive: true,
      features: {
        topListing: true,
        pinned: true,
        badge: true,
        priority: true,
      },
    },
  });

  console.log('✅ Produits de boost créés');

  // ============ WALLETS ============
  console.log('\n💰 Création des wallets de démo...');

  // Wallet pour vendeur1 avec 500 crédits (pour tester tous les boosts)
  await prisma.wallet.upsert({
    where: { userId: seller1.id },
    update: {},
    create: {
      userId: seller1.id,
      balanceCredits: BigInt(500),
    },
  });

  // Wallet pour vendeur2 avec 300 crédits
  await prisma.wallet.upsert({
    where: { userId: seller2.id },
    update: {},
    create: {
      userId: seller2.id,
      balanceCredits: BigInt(300),
    },
  });

  console.log('✅ Wallets créés');

  // ============ ANNONCES ============
  console.log('\n📢 Création des annonces de démo...');

  // Récupérer les modèles
  const corollaModel = await prisma.model.findFirst({
    where: { name: 'Corolla' },
  });

  const tucsonModel = await prisma.model.findFirst({
    where: { name: 'Tucson' },
  });

  const hiaceModel = await prisma.model.findFirst({
    where: { name: 'Hiace' },
  });

  const dusterModel = await prisma.model.findFirst({
    where: { name: 'Duster' },
  });

  // Annonce 1: Toyota Corolla 2018 (Approuvée)
  const listing1 = await prisma.listing.create({
    data: {
      userId: seller1.id,
      title: 'Toyota Corolla 2018 – Très propre',
      description: 'Toyota Corolla en excellent état, toutes options. Véhicule très bien entretenu avec carnet de maintenance à jour. Climatisation, vitres électriques, système audio Bluetooth. Parfait pour usage quotidien en ville ou long trajet.',
      priceFcfa: BigInt(6900000),
      state: ListingState.OCCASION,
      fuel: FuelType.ESSENCE,
      gearbox: GearboxType.AUTOMATIQUE,
      year: 2018,
      mileageKm: 68000,
      color: 'Blanc',
      doors: 4,
      powerCv: 132,
      brandId: createdBrands['Toyota'].id,
      modelId: corollaModel?.id,
      categoryId: catBerline.id,
      locationCountry: 'Côte d\'Ivoire',
      locationCity: 'Abidjan / Marcory',
      status: ListingStatus.APPROUVEE,
      viewCount: 125,
      images: {
        create: [
          { url: '/uploads/demo/corolla-1.jpg', sort: 0 },
          { url: '/uploads/demo/corolla-2.jpg', sort: 1 },
          { url: '/uploads/demo/corolla-3.jpg', sort: 2 },
        ],
      },
    },
  });

  // Annonce 2: Hyundai Tucson 2022 (Approuvée + Sponsorisée)
  const listing2 = await prisma.listing.create({
    data: {
      userId: seller1.id,
      title: 'Hyundai Tucson 2022 – Neuf, garantie constructeur',
      description: 'SUV Hyundai Tucson 2022 état neuf avec garantie constructeur. Équipement complet: caméra de recul, radar de stationnement, régulateur de vitesse adaptatif, sièges chauffants, toit panoramique, GPS intégré. Véhicule jamais accidenté.',
      priceFcfa: BigInt(21500000),
      state: ListingState.NEUF,
      fuel: FuelType.DIESEL,
      gearbox: GearboxType.AUTOMATIQUE,
      year: 2022,
      mileageKm: 15,
      color: 'Noir',
      doors: 5,
      powerCv: 185,
      brandId: createdBrands['Hyundai'].id,
      modelId: tucsonModel?.id,
      categoryId: catSuv.id,
      locationCountry: 'Côte d\'Ivoire',
      locationCity: 'Abidjan / Cocody',
      status: ListingStatus.APPROUVEE,
      isSponsored: true,
      sponsoredUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
      sponsoredPriority: 20,
      viewCount: 342,
      images: {
        create: [
          { url: '/uploads/demo/tucson-1.jpg', sort: 0 },
          { url: '/uploads/demo/tucson-2.jpg', sort: 1 },
          { url: '/uploads/demo/tucson-3.jpg', sort: 2 },
          { url: '/uploads/demo/tucson-4.jpg', sort: 3 },
        ],
      },
    },
  });

  // Créer un boost pour cette annonce
  await prisma.boost.create({
    data: {
      listingId: listing2.id,
      boostProductId: 3,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      paymentStatus: 'COMPLETED',
      paymentAmount: BigInt(10000),
      paymentProvider: 'mock',
    },
  });

  // Annonce 3: Toyota Hiace 2016 (En attente d'approbation)
  await prisma.listing.create({
    data: {
      userId: seller2.id,
      title: 'Toyota Hiace 2016 – Transport 15 places',
      description: 'Minibus Toyota Hiace 15 places idéal pour transport de personnel ou location. Moteur diesel économique, climatisation efficace, sièges confortables. Véhicule récemment révisé avec pneus neufs. Parfait état mécanique.',
      priceFcfa: BigInt(12000000),
      state: ListingState.OCCASION,
      fuel: FuelType.DIESEL,
      gearbox: GearboxType.MANUELLE,
      year: 2016,
      mileageKm: 190000,
      color: 'Blanc',
      doors: 4,
      powerCv: 136,
      brandId: createdBrands['Toyota'].id,
      modelId: hiaceModel?.id,
      categoryId: catTransport.id,
      locationCountry: 'Côte d\'Ivoire',
      locationCity: 'Abidjan / Yopougon',
      status: ListingStatus.EN_ATTENTE,
      images: {
        create: [
          { url: '/uploads/demo/hiace-1.jpg', sort: 0 },
          { url: '/uploads/demo/hiace-2.jpg', sort: 1 },
        ],
      },
    },
  });

  // Annonce 4: Renault Duster 2019 (Vendu)
  await prisma.listing.create({
    data: {
      userId: seller2.id,
      title: 'Renault Duster 2019 – 4x4, bon état',
      description: 'Renault Duster 4x4 parfait pour tous terrains. Véhicule fiable et économique. Climatisation, vitres électriques, bon état général.',
      priceFcfa: BigInt(8500000),
      state: ListingState.OCCASION,
      fuel: FuelType.DIESEL,
      gearbox: GearboxType.MANUELLE,
      year: 2019,
      mileageKm: 85000,
      color: 'Gris',
      doors: 5,
      powerCv: 115,
      brandId: createdBrands['Renault'].id,
      modelId: dusterModel?.id,
      categoryId: catSuv.id,
      locationCountry: 'Côte d\'Ivoire',
      locationCity: 'Abidjan / Treichville',
      status: ListingStatus.VENDU,
      viewCount: 89,
      images: {
        create: [
          { url: '/uploads/demo/duster-1.jpg', sort: 0 },
          { url: '/uploads/demo/duster-2.jpg', sort: 1 },
        ],
      },
    },
  });

  // Annonce 5: BMW X5 2020 (Approuvée - Luxe)
  await prisma.listing.create({
    data: {
      userId: seller1.id,
      title: 'BMW X5 2020 – SUV de luxe, toutes options',
      description: 'BMW X5 en parfait état, toutes les options premium incluses. Intérieur cuir, système audio Harman Kardon, sièges massants, toit panoramique, conduite semi-autonome, affichage tête haute. Véhicule d\'exception.',
      priceFcfa: BigInt(45000000),
      state: ListingState.OCCASION,
      fuel: FuelType.HYBRIDE,
      gearbox: GearboxType.AUTOMATIQUE,
      year: 2020,
      mileageKm: 32000,
      color: 'Noir métallisé',
      doors: 5,
      powerCv: 394,
      brandId: createdBrands['BMW'].id,
      categoryId: catLuxe.id,
      locationCountry: 'Côte d\'Ivoire',
      locationCity: 'Abidjan / Plateau',
      status: ListingStatus.APPROUVEE,
      viewCount: 256,
      images: {
        create: [
          { url: '/uploads/demo/bmw-1.jpg', sort: 0 },
          { url: '/uploads/demo/bmw-2.jpg', sort: 1 },
          { url: '/uploads/demo/bmw-3.jpg', sort: 2 },
        ],
      },
    },
  });

  console.log('✅ Annonces créées');

  // ============ LOGS D'AUDIT ============
  console.log('\n📝 Création de logs d\'audit de démo...');

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: 'LISTING_APPROVED',
      targetType: 'Listing',
      targetId: listing1.id,
      meta: { title: 'Toyota Corolla 2018 – Très propre' },
      ip: '127.0.0.1',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: seller1.id,
      action: 'BOOST_PURCHASED',
      targetType: 'Listing',
      targetId: listing2.id,
      meta: { boostProductId: 3, amount: '10000', durationDays: 14 },
      ip: '127.0.0.1',
    },
  });

  console.log('✅ Logs d\'audit créés');

  console.log('\n✅ Seed terminé avec succès !\n');
  console.log('📧 Comptes de test créés:');
  console.log('   Super Admin: admin@voiture.com / admin123');
  console.log('   Vendeur 1: vendeur1@gmail.com / seller123');
  console.log('   Vendeur 2: vendeur2@gmail.com / seller123\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

