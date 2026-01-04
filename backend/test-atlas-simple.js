/**
 * ✅ TEST SIMPLE CONNEXION MONGODB ATLAS
 * Script minimal pour tester la connexion
 */

const mongoose = require('mongoose');

// URI MongoDB Atlas DIRECT (SANS .env pour ce test)
const MONGODB_URI = 'mongodb+srv://abdoulrazaktanko06_db_user:yFOUjGLrsBc7d00f@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority';

console.log('🔄 Test de connexion MongoDB Atlas...\n');
console.log('📍 Cluster: cluster0.y87z9is.mongodb.net');
console.log('📚 Database: pi_academy\n');

// Options simples
const options = {
    serverSelectionTimeoutMS: 10000, // 10 secondes
    socketTimeoutMS: 45000,
};

async function testConnection() {
    try {
        console.log('⏳ Connexion en cours...');
        
        await mongoose.connect(MONGODB_URI, options);
        
        console.log('\n✅ ✅ ✅ CONNEXION RÉUSSIE ! ✅ ✅ ✅\n');
        console.log('📊 État de la connexion:');
        console.log(`   - ReadyState: ${mongoose.connection.readyState}`);
        console.log(`   - Host: ${mongoose.connection.host}`);
        console.log(`   - Database: ${mongoose.connection.name}`);
        
        // Test ping
        console.log('\n🏓 Test ping...');
        await mongoose.connection.db.admin().ping();
        console.log('✅ Ping réussi !\n');
        
        // Fermer proprement
        await mongoose.connection.close();
        console.log('📴 Connexion fermée proprement\n');
        console.log('🎉 TOUT FONCTIONNE PARFAITEMENT ! 🎉\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ ERREUR DE CONNEXION:\n');
        console.error(`   Message: ${error.message}`);
        console.error(`   Code: ${error.code || 'N/A'}`);
        
        console.error('\n💡 VÉRIFICATIONS À FAIRE:');
        console.error('   1. IP whitelistée dans MongoDB Atlas (190.2.155.230 ou 0.0.0.0/0)');
        console.error('   2. Cluster MongoDB actif (pas en pause)');
        console.error('   3. Username/Password corrects');
        console.error('   4. Aucun VPN/Proxy actif');
        console.error('   5. Port 27017 ouvert (déjà fait ✅)\n');
        
        process.exit(1);
    }
}

// Lancer le test
testConnection();
