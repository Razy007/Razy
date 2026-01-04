require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('--- TEST DE CONNEXION MONGODB SIMPLIFIÉ ---');

if (!uri) {
    console.error('ERREUR: Aucune URI trouvée dans .env (MONGODB_URI ou MONGO_URI)');
    console.log('Veuillez vérifier votre fichier backend/.env');
    process.exit(1);
}

// Masquer le mot de passe pour l'affichage
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Tentative de connexion à: ${maskedUri}`);

mongoose.set('strictQuery', false);

const start = Date.now();

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Échouer rapidement (5s) si le serveur est introuvable
    family: 4 // Force IPv4 pour éviter certains problèmes IPv6
})
.then(() => {
    const duration = Date.now() - start;
    console.log(`✅ SUCCÈS: Connexion Mongoose établie en ${duration}ms !`);
    console.log('La base de données est accessible.');
    return mongoose.connection.close();
})
.catch(err => {
    console.error('\n❌ ÉCHEC: Impossible de se connecter.');
    console.error(`   Nom de l'erreur: ${err.name}`);
    console.error(`   Message: ${err.message}`);
    
    console.log('\n--- ANALYSE DU PROBLÈME ---');
    if (err.message.includes('ECONNRESET') || err.message.includes('time out')) {
        console.log('🟠 BLOCAGE RÉSEAU DÉTECTÉ :');
        console.log('   Le port 27017 semble bloqué. C\'est la cause la plus fréquente.');
        console.log('   Actions recommandées :');
        console.log('   1. Désactivez temporairement votre Pare-feu ou Antivirus.');
        console.log('   2. Si vous êtes sur un réseau d\'entreprise/école, essayez en 4G/Partage de connexion.');
    } else if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
        console.log('🔴 ERREUR D\'AUTHENTIFICATION :');
        console.log('   Vérifiez le nom d\'utilisateur et le mot de passe dans backend/.env');
    } else if (err.message.includes('whitelist') || err.message.includes('unauthorized')) {
        console.log('🔵 IP NON AUTORISÉE :');
        console.log('   Votre IP actuelle n\'est pas dans la liste blanche (Network Access) de MongoDB Atlas.');
    } else {
        console.log('⚪ ERREUR INCONNUE :');
        console.log('   Vérifiez votre connexion internet et l\'état des services MongoDB Atlas.');
    }
})
.finally(() => {
    console.log('\nFin du test.');
    process.exit(0);
});
