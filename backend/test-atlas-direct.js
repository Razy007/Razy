/**
 * 🔧 TEST CONNEXION DIRECTE MONGODB (sans Mongoose)
 * Utilise le driver MongoDB natif pour plus de détails
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://abdoulrazaktanko06_db_user:yFOUjGLrsBc7d00f@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Test de connexion DIRECTE MongoDB Atlas...\n');
console.log('📍 Cluster: cluster0.y87z9is.mongodb.net');
console.log('📚 Database: pi_academy');
console.log('👤 User: abdoulrazaktanko06_db_user\n');

const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4,
    tls: true,
    tlsAllowInvalidCertificates: false,
    directConnection: false,
});

async function testConnection() {
    try {
        console.log('⏳ Connexion en cours...\n');
        
        // Connexion
        await client.connect();
        
        console.log('═'.repeat(60));
        console.log('✅ ✅ ✅ CONNEXION RÉUSSIE ! ✅ ✅ ✅');
        console.log('═'.repeat(60));
        
        // Accès à la database
        const db = client.db('pi_academy');
        console.log(`\n📊 Database: ${db.databaseName}`);
        
        // Test admin ping
        console.log('\n🏓 Test ping...');
        const adminDb = client.db('admin');
        const pingResult = await adminDb.command({ ping: 1 });
        console.log(`   ✓ Ping: ${JSON.stringify(pingResult)}`);
        
        // Liste des collections
        console.log('\n📝 Collections existantes:');
        const collections = await db.listCollections().toArray();
        console.log(`   ✓ Nombre: ${collections.length}`);
        if (collections.length > 0) {
            collections.forEach(col => console.log(`     - ${col.name}`));
        }
        
        // Test write (optionnel)
        console.log('\n✍️  Test d\'écriture...');
        const testCol = db.collection('test_connection');
        const writeResult = await testCol.insertOne({
            test: true,
            timestamp: new Date(),
            message: 'Test de connexion réussi !'
        });
        console.log(`   ✓ Document inséré, ID: ${writeResult.insertedId}`);
        
        // Nettoyage
        await testCol.deleteOne({ _id: writeResult.insertedId });
        console.log(`   ✓ Document de test supprimé`);
        
        // Fermeture
        console.log('\n📴 Fermeture de la connexion...');
        await client.close();
        console.log('   ✓ Connexion fermée\n');
        
        console.log('═'.repeat(60));
        console.log('🎉 TOUT FONCTIONNE PARFAITEMENT ! 🎉');
        console.log('═'.repeat(60));
        console.log('\n✨ MongoDB Atlas est OPÉRATIONNEL !\n');
        
        process.exit(0);
        
    } catch (error) {
        console.log('═'.repeat(60));
        console.error('❌ ERREUR DE CONNEXION');
        console.log('═'.repeat(60));
        console.error(`\n📛 Message: ${error.message}`);
        console.error(`📛 Code: ${error.code || 'N/A'}`);
        console.error(`📛 CodeName: ${error.codeName || 'N/A'}`);
        console.error(`📛 Name: ${error.name}`);
        
        if (error.stack) {
            console.error(`\n📚 Stack trace:\n${error.stack}`);
        }
        
        console.log('\n💡 DIAGNOSTICS SUPPLÉMENTAIRES:');
        console.log('─'.repeat(60));
        
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('❌ Problème d\'IP:');
            console.log('   → Ton IP actuelle: 190.2.155.230');
            console.log('   → Vérifie que cette IP est bien dans Network Access');
            console.log('   → Ou ajoute 0.0.0.0/0 temporairement pour tester');
        }
        
        if (error.message.includes('authentication') || error.message.includes('credentials')) {
            console.log('❌ Problème d\'authentification:');
            console.log('   → Vérifie le username: abdoulrazaktanko06_db_user');
            console.log('   → Vérifie le password: yFOUjGLrsBc7d00f');
            console.log('   → Vérifie les permissions dans Database Access');
        }
        
        if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.log('❌ Problème de connexion réseau:');
            console.log('   → Le cluster est-il actif (pas en pause) ?');
            console.log('   → ProtonVPN pourrait bloquer certains ports');
            console.log('   → Essaye de désactiver le VPN temporairement');
        }
        
        console.log('─'.repeat(60));
        
        await client.close().catch(() => {});
        process.exit(1);
    }
}

// Lancer le test
testConnection();
