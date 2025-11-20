const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  try {
    // ============ UTILISATEURS ============
    console.log('\n👤 Création des utilisateurs...');
    
    const superAdminPassword = await bcrypt.hash('admin123', 10);
    const sellerPassword = await bcrypt.hash('seller123', 10);

    await prisma.user.upsert({
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

    await prisma.user.upsert({
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

    console.log('✅ 2 utilisateurs créés');

    // ============ CATÉGORIES ============
    console.log('\n📁 Création des catégories...');
    
    const categories = [
      { name: 'Voitures', slug: 'voitures' },
      { name: '4x4 et SUV', slug: '4x4-suv' },
      { name: 'Motos', slug: 'motos' },
      { name: 'Utilitaires', slug: 'utilitaires' },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    console.log('✅ 4 catégories créées');

    // ============ MARQUES ============
    console.log('\n🏷️ Création des marques...');
    
    const brands = [
      'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Peugeot', 'Renault', 'Citroën',
      'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet', 'Mazda',
      'Mitsubishi', 'Suzuki', 'Isuzu', 'Subaru', 'Lexus', 'Infiniti', 'Acura',
      'Land Rover', 'Range Rover', 'Jaguar', 'Volvo', 'Porsche', 'Ferrari',
      'Lamborghini', 'BYD', 'Haval', 'Chery', 'Geely', 'Great Wall', 'Tesla'
    ];

    for (const brandName of brands) {
      await prisma.brand.upsert({
        where: { name: brandName },
        update: {},
        create: {
          name: brandName,
          slug: brandName.toLowerCase().replace(/\s+/g, '-'),
        },
      });
    }

    console.log(`✅ ${brands.length} marques créées`);

    // ============ MODÈLES (200+) ============
    console.log('\n🚗 Création des modèles de véhicules...');
    
    const modelsData = {
      'Toyota': ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Land Cruiser', 'Prado', 'Yaris', 'Avensis', 'Auris', 'Highlander'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Fit', 'City', 'Jazz', 'Odyssey', 'Ridgeline'],
      'Nissan': ['Altima', 'Sentra', 'Maxima', 'Patrol', 'X-Trail', 'Qashqai', 'Juke', 'Murano', 'Pathfinder', 'Navara'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Accent', 'i10', 'i20', 'i30', 'Palisade'],
      'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Soul', 'Picanto', 'Rio', 'Seltos', 'Telluride', 'Stinger'],
      'Peugeot': ['208', '308', '3008', '5008', '2008', '508', 'Partner', 'Expert', 'Rifter', 'Traveller'],
      'Renault': ['Clio', 'Mégane', 'Captur', 'Kadjar', 'Talisman', 'Duster', 'Kwid', 'Logan', 'Sandero', 'Koleos'],
      'Citroën': ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'Jumpy', 'C-Elysée', 'C3 Aircross', 'Grand C4 Picasso'],
      'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'GLS', 'CLA', 'CLS'],
      'BMW': ['Série 1', 'Série 3', 'Série 5', 'Série 7', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8'],
      'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
      'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Jetta', 'Arteon', 'T-Roc', 'Amarok'],
      'Ford': ['Focus', 'Fiesta', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Ranger', 'F-150', 'Expedition', 'Fusion'],
      'Chevrolet': ['Spark', 'Cruze', 'Malibu', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Colorado', 'Camaro'],
      'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5', 'CX-30', 'Mazda2'],
      'Mitsubishi': ['Lancer', 'Outlander', 'Pajero', 'ASX', 'Eclipse Cross', 'L200', 'Mirage', 'Montero'],
      'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Baleno', 'Celerio', 'Ignis', 'S-Cross', 'Ertiga'],
      'Isuzu': ['D-Max', 'MU-X', 'Trooper', 'Rodeo', 'KB'],
      'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'BRZ', 'WRX'],
      'Lexus': ['IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'UX', 'LC'],
      'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Evoque'],
      'Range Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'],
      'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
      'BYD': ['Tang', 'Song', 'Qin', 'Han', 'Yuan', 'Dolphin', 'Seal', 'Atto 3'],
      'Haval': ['H6', 'H9', 'F7', 'Jolion', 'M6'],
      'Chery': ['Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'QQ'],
      'Geely': ['Coolray', 'Azkarra', 'Emgrand', 'Atlas'],
      'Great Wall': ['Wingle', 'Haval H5', 'Poer'],
      'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster']
    };

    let totalModels = 0;
    for (const [brandName, models] of Object.entries(modelsData)) {
      const brand = await prisma.brand.findUnique({ where: { name: brandName } });
      if (brand) {
        for (const modelName of models) {
          await prisma.model.upsert({
            where: { 
              brandId_name: { 
                brandId: brand.id,
                name: modelName
              } 
            },
            update: {},
            create: {
              name: modelName,
              slug: modelName.toLowerCase().replace(/\s+/g, '-'),
              brandId: brand.id,
            },
          });
          totalModels++;
        }
      }
    }

    console.log(`✅ ${totalModels} modèles créés pour toutes les marques`);

    // ============ PRODUITS DE BOOST ============
    console.log('\n🚀 Création des produits de boost...');
    
    const boostProducts = [
      {
        name: 'Boost 7 jours',
        description: 'Mettez votre annonce en avant pendant 7 jours',
        durationDays: 7,
        price: 2000,
        credits: 10,
        isActive: true,
      },
      {
        name: 'Boost 15 jours',
        description: 'Mettez votre annonce en avant pendant 15 jours',
        durationDays: 15,
        price: 3500,
        credits: 18,
        isActive: true,
      },
      {
        name: 'Boost 30 jours',
        description: 'Mettez votre annonce en avant pendant 30 jours',
        durationDays: 30,
        price: 6000,
        credits: 30,
        isActive: true,
      },
    ];

    for (const product of boostProducts) {
      await prisma.boostProduct.upsert({
        where: { name: product.name },
        update: {},
        create: product,
      });
    }

    console.log('✅ 3 produits de boost créés');

    console.log('\n🎉 Seed terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

