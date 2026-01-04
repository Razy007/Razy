/**
 * ✅ TEST FINAL CONNEXION MONGODB ATLAS
 * URI COMPLÈTE avec database name et appName
 */

const mongoose = require('mongoose');

// URI COMPLÈTE ET CORRECTE
const MONGODB_URI = 'mongodb+srv://abdoulrazaktanko06_db_user:yFOUjGLrsBc7d00f@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Test de connexion MongoDB Atlas (FINAL)...\n');
console.log('📍 Cluster: cluster0.y87z9is.mongodb.net');
console.log('📚 Database: pi_academy');
console.log('👤 User: abdoulrazaktanko06_db_user');
console.log('🔐 Password: yFOUjGLrsBc7d00f\n');

// Options optimisées
const options = {
    serverSelectionTimeoutMS: 15000, // 15 secondes
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4
};

async function testConnection() {
    try {
        console.log('⏳ Connexion en cours...\n');
        
        await mongoose.connect(MONGODB_URI, options);
        
        console.log('═'.repeat(60));
        console.log('✅ ✅ ✅ CONNEXION RÉUSSIE ! ✅ ✅ ✅');
        console.log('═'.repeat(60));
        console.log('\n📊 État de la connexion:');
        console.log(`   ✓ ReadyState: ${mongoose.connection.readyState} (1 = connected)`);
        console.log(`   ✓ Host: ${mongoose.connection.host}`);
        console.log(`   ✓ Database: ${mongoose.connection.name}`);
        console.log(`   ✓ Port: ${mongoose.connection.port}`);
        
        // Test ping
        console.log('\n🏓 Test ping MongoDB...');
        const pingResult = await mongoose.connection.db.admin().ping();
        console.log(`   ✓ Ping result: ${JSON.stringify(pingResult)}`);
        
        // Test création collection
        console.log('\n📝 Test création collection...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   ✓ Collections existantes: ${collections.length}`);
        if (collections.length > 0) {
            console.log(`   ✓ Noms: ${collections.map(c => c.name).join(', ')}`);
        }
        
        // Fermer proprement
        console.log('\n📴 Fermeture de la connexion...');
        await mongoose.connection.close();
        console.log('   ✓ Connexion fermée proprement\n');
        
        console.log('═'.repeat(60));
        console.log('🎉 TOUT FONCTIONNE PARFAITEMENT ! 🎉');
        console.log('═'.repeat(60));
        console.log('\n✨ Prochaine étape : Lancer le backend complet (server.js)\n');
        
        process.exit(0);
        
    } catch (error) {
        console.log('═'.repeat(60));
        console.error('❌ ERREUR DE CONNEXION');
        console.log('═'.repeat(60));
        console.error(`\n📛 Message: ${error.message}`);
        console.error(`📛 Code: ${error.code || 'N/A'}`);
        console.error(`📛 Name: ${error.name}\n`);
        
        console.log('💡 VÉRIFICATIONS CRITIQUES:');
        console.log('─'.repeat(60));
        console.log('1️⃣  IP WHITELISTÉE dans MongoDB Atlas ?');
        console.log('   → Va sur: Network Access');
        console.log('   → Ajoute: 0.0.0.0/0 (ALLOW ACCESS FROM ANYWHERE)');
        console.log('');
        console.log('2️⃣  CLUSTER ACTIF (pas en pause) ?');
        console.log('   → Va sur: Database');
        console.log('   → Status doit être: Active (vert)');
        console.log('');
        console.log('3️⃣  USER ET PASSWORD corrects ?');
        console.log('   → Va sur: Database Access');
        console.log('   → User: abdoulrazaktanko06_db_user');
        console.log('   → Role: Read and write to any database');
        console.log('');
        console.log('4️⃣  Pas de VPN/Proxy actif ?');
        console.log('   → Désactive temporairement VPN/antivirus');
        console.log('─'.repeat(60));
        
        process.exit(1);
    }
}

// Lancer le test
testConnection();
