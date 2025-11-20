const { execSync } = require('child_process');

console.log('🚀🚀🚀 DÉMARRAGE DE LA PRODUCTION 🚀🚀🚀\n');

function runCommand(command, description) {
  try {
    console.log(`\n>>> ${description}`);
    console.log(`>>> Commande: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`>>> ✅ ${description} - Succès!\n`);
  } catch (error) {
    console.error(`>>> ❌ ${description} - ÉCHEC!`);
    console.error(`>>> Erreur: ${error.message}`);
    throw error;
  }
}

try {
  runCommand('npx prisma generate', 'ÉTAPE 1: Génération du client Prisma');
  runCommand('npx prisma db push --accept-data-loss', 'ÉTAPE 2: Synchronisation de la base de données');
  runCommand('npx prisma db seed', 'ÉTAPE 3: Exécution du seed');
  runCommand('npm run start:prod', 'ÉTAPE 4: Démarrage du serveur');
} catch (error) {
  console.error('\n❌❌❌ ERREUR FATALE LORS DU DÉMARRAGE ❌❌❌');
  console.error(error);
  process.exit(1);
}

