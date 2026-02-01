#!/usr/bin/env node

/**
 * SCRIPT DE CONFIGURATION ET TEST MONGODB
 * Teste automatiquement la connexion à MongoDB Atlas
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

console.log(`\n${colors.cyan}=== CONFIGURATION MONGODB ATLAS ===${colors.reset}\n`);

// Configuration
const config = {
    username: 'abdoulrazaktanko06_db_user',
    password: '', // À remplir
    cluster: 'cluster0.y87z9is.mongodb.net',
    dbName: 'pioneracademy',
    appName: 'Cluster0'
};

// Vérifier si mongoose est installé
let mongoose;
try {
    mongoose = require('mongoose');
    console.log(`${colors.green}✅ Mongoose trouvé${colors.reset}`);
} catch (error) {
    console.log(`${colors.yellow}⚠️  Mongoose non installé${colors.reset}`);
    console.log(`${colors.cyan}   Installation: npm install mongoose${colors.reset}`);
    process.exit(1);
}

// Fonction pour créer l'URI de connexion
function createMongoURI(useSRV = true) {
    const encodedPassword = encodeURIComponent(config.password);
    
    if (useSRV) {
        return `mongodb+srv://${config.username}:${encodedPassword}@${config.cluster}/${config.dbName}?retryWrites=true&w=majority&appName=${config.appName}`;
    } else {
        // Format standard (sans SRV) - comme solution de secours
        return `mongodb://${config.username}:${encodedPassword}@cluster0-shard-00-00.y87z9is.mongodb.net:27017,cluster0-shard-00-01.y87z9is.mongodb.net:27017,cluster0-shard-00-02.y87z9is.mongodb.net:27017/${config.dbName}?ssl=true&replicaSet=atlas-xxxxx&authSource=admin`;
    }
}

// Fonction pour tester la connexion
async function testConnection(uri, label) {
    console.log(`\n${colors.yellow}[TEST] ${label}...${colors.reset}`);
    
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`${colors.green}✅ Connexion réussie!${colors.reset}`);
        console.log(`${colors.cyan}   Base de données: ${mongoose.connection.name}${colors.reset}`);
        console.log(`${colors.cyan}   État: ${mongoose.connection.readyState === 1 ? 'Connecté' : 'Non connecté'}${colors.reset}`);
        
        // Test d'écriture simple
        const TestModel = mongoose.model('Test', new mongoose.Schema({ 
            message: String, 
            timestamp: Date 
        }));
        
        const testDoc = await TestModel.create({ 
            message: 'Test de connexion', 
            timestamp: new Date() 
        });
        
        console.log(`${colors.green}✅ Écriture dans la base réussie${colors.reset}`);
        console.log(`${colors.cyan}   Document ID: ${testDoc._id}${colors.reset}`);
        
        // Nettoyer
        await TestModel.deleteOne({ _id: testDoc._id });
        
        await mongoose.disconnect();
        console.log(`${colors.green}✅ Déconnexion réussie${colors.reset}`);
        
        return true;
    } catch (error) {
        console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
        
        if (error.message.includes('ECONNRESET')) {
            console.log(`\n${colors.magenta}Causes possibles:${colors.reset}`);
            console.log(`   1. IP non autorisée dans Network Access`);
            console.log(`   2. Firewall/VPN bloque la connexion`);
            console.log(`   3. Cluster en pause`);
            console.log(`   4. Problème DNS (si mongodb+srv://)`);
        } else if (error.message.includes('Authentication failed')) {
            console.log(`\n${colors.magenta}Cause: Identifiants incorrects${colors.reset}`);
            console.log(`   Vérifiez le nom d'utilisateur et le mot de passe`);
        }
        
        try {
            await mongoose.disconnect();
        } catch (e) {
            // Ignorer les erreurs de déconnexion
        }
        
        return false;
    }
}

// Fonction pour créer le fichier .env
function createEnvFile(uri) {
    const envPath = path.join(__dirname, '.env');
    const envContent = `# Configuration MongoDB Atlas
MONGODB_URI=${uri}
MONGODB_DB_NAME=${config.dbName}

# Autres configurations
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
`;

    fs.writeFileSync(envPath, envContent);
    console.log(`\n${colors.green}✅ Fichier .env créé${colors.reset}`);
    console.log(`${colors.cyan}   Emplacement: ${envPath}${colors.reset}`);
}

// Fonction principale
async function main() {
    // Lire le mot de passe depuis les arguments ou demander
    if (process.argv.length > 2) {
        config.password = process.argv[2];
    } else {
        console.log(`${colors.red}❌ Mot de passe manquant${colors.reset}`);
        console.log(`\n${colors.yellow}Usage:${colors.reset}`);
        console.log(`   node setup-mongodb.js <votre_mot_de_passe>`);
        console.log(`\n${colors.yellow}Exemple:${colors.reset}`);
        console.log(`   node setup-mongodb.js MonMotDePasse123!`);
        process.exit(1);
    }

    console.log(`${colors.cyan}Configuration:${colors.reset}`);
    console.log(`   Utilisateur: ${config.username}`);
    console.log(`   Cluster: ${config.cluster}`);
    console.log(`   Base de données: ${config.dbName}`);
    console.log(`   Mot de passe: ${'*'.repeat(config.password.length)}`);

    // Test avec SRV
    const uriSRV = createMongoURI(true);
    const success = await testConnection(uriSRV, 'Connexion avec mongodb+srv://');

    if (success) {
        createEnvFile(uriSRV);
        console.log(`\n${colors.green}🎉 Configuration terminée avec succès!${colors.reset}`);
        console.log(`\n${colors.cyan}Prochaines étapes:${colors.reset}`);
        console.log(`   1. Utilisez le fichier .env dans votre application`);
        console.log(`   2. Importez la configuration: require('dotenv').config()`);
        console.log(`   3. Connectez-vous: mongoose.connect(process.env.MONGODB_URI)`);
    } else {
        console.log(`\n${colors.yellow}⚠️  La connexion a échoué${colors.reset}`);
        console.log(`\n${colors.cyan}Actions recommandées:${colors.reset}`);
        console.log(`   1. Exécutez le diagnostic: .\\mongodb-diagnostic.ps1`);
        console.log(`   2. Vérifiez Network Access dans Atlas`);
        console.log(`   3. Vérifiez que le cluster est actif`);
        console.log(`   4. Vérifiez les identifiants`);
        
        process.exit(1);
    }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
    console.error(`${colors.red}Erreur non gérée: ${error.message}${colors.reset}`);
    process.exit(1);
});

// Exécuter
main().catch(error => {
    console.error(`${colors.red}Erreur: ${error.message}${colors.reset}`);
    process.exit(1);
});
