/**
 * 🔍 TEST DEBUG COMPLET MONGODB ATLAS
 * Teste plusieurs formats d'URI et options TLS
 */

const { MongoClient } = require('mongodb');

// Configuration
const config = {
    username: 'abdoulrazaktanko06_db_user',
    password: 'yFOUjGLrsBc7d00f',
    cluster: 'cluster0.y87z9is.mongodb.net',
    database: 'pi_academy',
    appName: 'Cluster0'
};

// URIs à tester
const uris = [
    {
        name: 'SRV avec TLS standard',
        uri: `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.database}?retryWrites=true&w=majority&appName=${config.appName}`,
        options: {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            family: 4,
            tls: true,
        }
    },
    {
        name: 'SRV avec TLS permissif',
        uri: `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.database}?retryWrites=true&w=majority&appName=${config.appName}`,
        options: {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            family: 4,
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
        }
    },
    {
        name: 'URI standard (non-SRV) - Nœud 1',
        uri: `mongodb://${config.username}:${config.password}@ac-sh9juwq-shard-00-00.y87z9is.mongodb.net:27017,ac-sh9juwq-shard-00-01.y87z9is.mongodb.net:27017,ac-sh9juwq-shard-00-02.y87z9is.mongodb.net:27017/${config.database}?replicaSet=atlas-bjlkjl-shard-0&ssl=true&authSource=admin`,
        options: {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            family: 4,
            tls: true,
        }
    },
    {
        name: 'URI standard avec TLS permissif',
        uri: `mongodb://${config.username}:${config.password}@ac-sh9juwq-shard-00-00.y87z9is.mongodb.net:27017,ac-sh9juwq-shard-00-01.y87z9is.mongodb.net:27017,ac-sh9juwq-shard-00-02.y87z9is.mongodb.net:27017/${config.database}?replicaSet=atlas-bjlkjl-shard-0&ssl=true&authSource=admin`,
        options: {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            family: 4,
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
        }
    }
];

async function testUri(uriConfig, index) {
    console.log('\n' + '═'.repeat(70));
    console.log(`TEST ${index + 1}/${uris.length}: ${uriConfig.name}`);
    console.log('═'.repeat(70));
    
    const client = new MongoClient(uriConfig.uri, uriConfig.options);
    
    try {
        console.log('⏳ Tentative de connexion...');
        
        const startTime = Date.now();
        await client.connect();
        const duration = Date.now() - startTime;
        
        console.log(`✅ CONNEXION RÉUSSIE en ${duration}ms !`);
        
        // Test ping
        const db = client.db('admin');
        const pingResult = await db.command({ ping: 1 });
        console.log(`✅ Ping: ${JSON.stringify(pingResult)}`);
        
        // Test database
        const appDb = client.db(config.database);
        const collections = await appDb.listCollections().toArray();
        console.log(`✅ Database "${config.database}" accessible`);
        console.log(`✅ Collections: ${collections.length}`);
        
        await client.close();
        
        console.log('\n🎉 CE FORMAT FONCTIONNE ! Utilise cette configuration.\n');
        
        return true;
        
    } catch (error) {
        console.log(`❌ ÉCHEC: ${error.name}`);
        console.log(`   Message: ${error.message}`);
        
        if (error.cause) {
            console.log(`   Cause: ${error.cause.message}`);
        }
        
        // Détails supplémentaires
        if (error.message.includes('ECONNREFUSED')) {
            console.log('   💡 Port refusé - Le serveur n\'accepte pas la connexion');
        } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timed out')) {
            console.log('   💡 Timeout - Problème réseau/firewall/VPN probable');
        } else if (error.message.includes('authentication') || error.message.includes('auth')) {
            console.log('   💡 Problème d\'authentification - Vérifie user/password');
        } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.log('   💡 Problème TLS/SSL - Certificats/VPN');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('   💡 DNS non résolu');
        }
        
        await client.close().catch(() => {});
        
        return false;
    }
}

async function runAllTests() {
    console.log('\n🔍 TEST DEBUG MONGODB ATLAS');
    console.log('=' + '='.repeat(69));
    console.log(`📍 Cluster: ${config.cluster}`);
    console.log(`📚 Database: ${config.database}`);
    console.log(`👤 User: ${config.username}`);
    console.log(`🔐 Password: ${config.password.substring(0, 3)}***`);
    console.log('=' + '='.repeat(69));
    
    let successCount = 0;
    
    for (let i = 0; i < uris.length; i++) {
        const success = await testUri(uris[i], i);
        if (success) {
            successCount++;
        }
        
        // Pause entre les tests
        if (i < uris.length - 1) {
            console.log('\n⏸️  Pause 2 secondes avant le prochain test...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log('📊 RÉSUMÉ FINAL');
    console.log('═'.repeat(70));
    console.log(`✅ Tests réussis: ${successCount}/${uris.length}`);
    console.log(`❌ Tests échoués: ${uris.length - successCount}/${uris.length}`);
    
    if (successCount === 0) {
        console.log('\n🚨 AUCUN FORMAT NE FONCTIONNE');
        console.log('\n💡 ACTIONS RECOMMANDÉES:');
        console.log('─'.repeat(70));
        console.log('1️⃣  DÉSACTIVE ProtonVPN temporairement et relance ce test');
        console.log('2️⃣  Va sur MongoDB Atlas Network Access et ajoute 0.0.0.0/0');
        console.log('3️⃣  Vérifie que le cluster est ACTIF (pas en pause)');
        console.log('4️⃣  Vérifie les credentials dans Database Access');
        console.log('─'.repeat(70));
    }
    
    console.log('\n');
    process.exit(successCount > 0 ? 0 : 1);
}

// Lancer tous les tests
runAllTests();
