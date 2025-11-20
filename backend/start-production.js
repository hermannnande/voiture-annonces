const { execSync } = require('child_process');

console.log('🚀 Démarrage de la production...\n');

try {
  console.log('📦 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🔄 Synchronisation de la base de données...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('\n🌱 Exécution du seed...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('\n✅ Configuration terminée, démarrage du serveur...');
  execSync('npm run start:prod', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erreur lors du démarrage:', error.message);
  process.exit(1);
}

