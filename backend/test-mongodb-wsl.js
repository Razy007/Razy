#!/usr/bin/env node

/**
 * 🧪 TEST MONGODB ATLAS CONNECTION
 * Script pour tester la connexion MongoDB Atlas depuis WSL2
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Colors pour console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  log.error('MONGODB_URI non défini dans .env');
  process.exit(1);
}

// Masquer le password dans les logs
const hiddenUri = MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@');

async function testConnection() {
  log.section('TEST MONGODB ATLAS CONNECTION');

  // Étape 1: Informations système
  log.info('Environnement:');
  console.log(`  - OS: ${process.platform}`);
  console.log(`  - Node.js: ${process.version}`);
  console.log(`  - Mongoose: ${mongoose.version}`);
  console.log(`  - URI: ${hiddenUri}`);

  // Étape 2: Test DNS
  log.section('TEST 1: DNS Resolution');
  try {
    const dns = require('dns').promises;
    const hostname = MONGODB_URI.match(/@([^/]+)/)[1];
    log.info(`Résolution DNS pour: ${hostname}`);
    
    const addresses = await dns.resolve4(hostname.split(':')[0]);
    log.success(`DNS OK - Adresses: ${addresses.join(', ')}`);
  } catch (error) {
    log.error(`Erreur DNS: ${error.message}`);
  }

  // Étape 3: Test connexion MongoDB
  log.section('TEST 2: MongoDB Connection');
  
  try {
    log.info('Tentative de connexion...');
    
    const startTime = Date.now();
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    const duration = Date.now() - startTime;
    log.success(`Connexion réussie en ${duration}ms !`);
    
    // Étape 4: Test database
    log.section('TEST 3: Database Operations');
    
    const db = mongoose.connection.db;
    log.info(`Database: ${db.databaseName}`);
    
    // Lister les collections
    const collections = await db.listCollections().toArray();
    log.success(`Collections trouvées: ${collections.length}`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Test ping
    const adminDb = db.admin();
    const pingResult = await adminDb.ping();
    log.success('Ping database OK');
    
    // Créer une collection de test
    log.section('TEST 4: Write/Read Test');
    
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
      timestamp: Date,
      message: String,
      environment: String
    }));
    
    const doc = await TestModel.create({
      timestamp: new Date(),
      message: 'Test connexion WSL2',
      environment: process.platform
    });
    
    log.success(`Document créé avec ID: ${doc._id}`);
    
    const found = await TestModel.findById(doc._id);
    log.success(`Document lu: ${found.message}`);
    
    // Cleanup
    await TestModel.deleteMany({});
    log.success('Document test supprimé');
    
    // Étape 5: Informations serveur
    log.section('TEST 5: Server Information');
    
    const serverStatus = await adminDb.serverStatus();
    console.log(`  - Version MongoDB: ${serverStatus.version}`);
    console.log(`  - Uptime: ${Math.floor(serverStatus.uptime / 3600)}h`);
    console.log(`  - Connexions: ${serverStatus.connections.current}/${serverStatus.connections.available}`);
    
    // Résumé final
    log.section('✅ RÉSULTAT FINAL');
    log.success('Tous les tests sont passés !');
    log.success('MongoDB Atlas est correctement configuré');
    log.info('Vous pouvez maintenant lancer le serveur backend');
    
  } catch (error) {
    log.section('❌ ERREUR DE CONNEXION');
    log.error(`Type: ${error.name}`);
    log.error(`Message: ${error.message}`);
    
    // Diagnostic de l'erreur
    if (error.message.includes('ENOTFOUND')) {
      log.warning('Problème DNS - Vérifiez votre connexion internet');
    } else if (error.message.includes('authentication failed')) {
      log.warning('Problème d\'authentification - Vérifiez username/password');
    } else if (error.message.includes('IP')) {
      log.warning('Problème IP - Vérifiez le whitelist dans MongoDB Atlas');
      log.info('Action: Ajoutez votre IP WSL2 dans Network Access');
    } else if (error.message.includes('tls') || error.message.includes('SSL')) {
      log.warning('Problème TLS/SSL');
      log.info('WSL2 devrait résoudre ce problème automatiquement');
    }
    
    console.log('\n📋 Stack trace:');
    console.log(error.stack);
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    log.info('Connexion fermée');
  }
}

// Exécuter le test
testConnection().catch(err => {
  log.error(`Erreur fatale: ${err.message}`);
  process.exit(1);
});
