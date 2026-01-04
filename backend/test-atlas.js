const { connectAtlas, healthCheck, disconnectAtlas, createIndexes } = require('./database/mongodb-atlas-config');

/**
 * Script de test complet MongoDB Atlas
 * Teste la connexion, les performances et la sécurité
 */

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = (color, ...args) => console.log(color, ...args, colors.reset);

async function runTests() {
    console.log('\n' + '='.repeat(60));
    log(colors.cyan, '🧪 Tests MongoDB Atlas - Pi Academy Backend');
    console.log('='.repeat(60) + '\n');

    const results = {
        passed: 0,
        failed: 0,
        warnings: 0
    };

    try {
        // Test 1: Connexion
        log(colors.blue, '\n[1/7] 🔄 Test de connexion...');
        try {
            await connectAtlas();
            log(colors.green, '✅ Connexion établie avec succès');
            results.passed++;
        } catch (error) {
            log(colors.red, '❌ Échec de connexion:', error.message);
            results.failed++;
            throw error;
        }

        // Test 2: Health Check
        log(colors.blue, '\n[2/7] 🏥 Health Check...');
        try {
            const health = await healthCheck();
            if (health.status === 'healthy') {
                log(colors.green, '✅ MongoDB Atlas opérationnel');
                console.log(`   - Database: ${health.name}`);
                console.log(`   - Host: ${health.host}`);
                results.passed++;
            } else {
                log(colors.yellow, '⚠️  Health check warning:', health.message);
                results.warnings++;
            }
        } catch (error) {
            log(colors.red, '❌ Health check failed:', error.message);
            results.failed++;
        }

        // Test 3: Création d'Indexes
        log(colors.blue, '\n[3/7] 📊 Création des indexes...');
        try {
            await createIndexes();
            log(colors.green, '✅ Indexes créés avec succès');
            results.passed++;
        } catch (error) {
            log(colors.yellow, '⚠️  Indexes:', error.message);
            results.warnings++;
        }

        // Test 4: Test CRUD Basique
        log(colors.blue, '\n[4/7] 💾 Test CRUD...');
        try {
            const mongoose = require('mongoose');
            const db = mongoose.connection.db;
            const testCollection = db.collection('_test_connection');

            // Create
            const testDoc = {
                _id: 'test_' + Date.now(),
                test: true,
                timestamp: new Date(),
                message: 'Test de connexion MongoDB Atlas'
            };
            await testCollection.insertOne(testDoc);

            // Read
            const found = await testCollection.findOne({ _id: testDoc._id });
            if (!found) throw new Error('Document non trouvé');

            // Update
            await testCollection.updateOne(
                { _id: testDoc._id },
                { $set: { updated: true } }
            );

            // Delete
            await testCollection.deleteOne({ _id: testDoc._id });

            log(colors.green, '✅ Opérations CRUD fonctionnelles');
            results.passed++;
        } catch (error) {
            log(colors.red, '❌ Test CRUD failed:', error.message);
            results.failed++;
        }

        // Test 5: Performance
        log(colors.blue, '\n[5/7] ⚡ Test de performance...');
        try {
            const start = Date.now();
            const mongoose = require('mongoose');
            const db = mongoose.connection.db;
            
            await db.admin().ping();
            const latency = Date.now() - start;

            if (latency < 100) {
                log(colors.green, `✅ Excellente performance (${latency}ms)`);
            } else if (latency < 300) {
                log(colors.green, `✅ Bonne performance (${latency}ms)`);
            } else {
                log(colors.yellow, `⚠️  Performance acceptable (${latency}ms)`);
                results.warnings++;
            }
            results.passed++;
        } catch (error) {
            log(colors.red, '❌ Test performance failed:', error.message);
            results.failed++;
        }

        // Test 6: Sécurité
        log(colors.blue, '\n[6/7] 🔒 Vérification sécurité...');
        try {
            const mongoose = require('mongoose');
            const uri = process.env.MONGODB_URI || '';

            const checks = [];
            
            // Check SSL/TLS
            if (uri.includes('ssl=true') || uri.includes('mongodb+srv://')) {
                checks.push('✓ SSL/TLS activé');
            } else {
                checks.push('⚠ SSL/TLS désactivé');
                results.warnings++;
            }

            // Check authentication
            if (uri.includes('@')) {
                checks.push('✓ Authentification configurée');
            } else {
                checks.push('⚠ Authentification manquante');
                results.warnings++;
            }

            // Check retry writes
            if (uri.includes('retryWrites=true')) {
                checks.push('✓ Retry writes activé');
            }

            checks.forEach(check => console.log('   ' + check));
            log(colors.green, '✅ Vérifications de sécurité terminées');
            results.passed++;
        } catch (error) {
            log(colors.red, '❌ Security check failed:', error.message);
            results.failed++;
        }

        // Test 7: Collections
        log(colors.blue, '\n[7/7] 📚 Vérification des collections...');
        try {
            const mongoose = require('mongoose');
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();

            console.log(`   Collections trouvées: ${collections.length}`);
            collections.slice(0, 5).forEach(col => {
                console.log(`   - ${col.name}`);
            });

            log(colors.green, '✅ Collections accessibles');
            results.passed++;
        } catch (error) {
            log(colors.yellow, '⚠️  Collections:', error.message);
            results.warnings++;
        }

    } catch (error) {
        log(colors.red, '\n💥 Erreur fatale:', error.message);
    } finally {
        await disconnectAtlas();
    }

    // Résumé
    console.log('\n' + '='.repeat(60));
    log(colors.cyan, '📊 Résumé des Tests');
    console.log('='.repeat(60));
    log(colors.green, `✅ Tests réussis: ${results.passed}`);
    if (results.warnings > 0) {
        log(colors.yellow, `⚠️  Avertissements: ${results.warnings}`);
    }
    if (results.failed > 0) {
        log(colors.red, `❌ Tests échoués: ${results.failed}`);
    }

    const total = results.passed + results.failed;
    const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
    
    console.log(`\nScore: ${percentage}%`);

    if (results.failed === 0) {
        log(colors.green, '\n🎉 Tous les tests critiques sont passés !');
        log(colors.green, '\n✨ MongoDB Atlas est prêt pour production !');
        console.log('\nProchaines étapes:');
        console.log('  1. Lancez le backend: npm run dev');
        console.log('  2. Testez les endpoints: http://localhost:3001/health');
        console.log('  3. Vérifiez les logs MongoDB Atlas');
    } else {
        log(colors.red, '\n❌ Certains tests ont échoué');
        console.log('\nActions recommandées:');
        console.log('  1. Vérifiez votre IP dans MongoDB Atlas Network Access');
        console.log('  2. Vérifiez les identifiants dans .env');
        console.log('  3. Consultez le guide: MONGODB_ATLAS_GUIDE.md');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Exit code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Gestion des erreurs non catchées
process.on('unhandledRejection', (error) => {
    log(colors.red, '\n💥 Erreur non gérée:', error.message);
    process.exit(1);
});

// Exécution
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
