const mongoose = require('mongoose');

/**
 * Configuration MongoDB Atlas Optimisée
 * - Retry Logic automatique
 * - Connection Pooling
 * - Sécurité renforcée
 * - Scalabilité maximale
 */

// Options de connexion optimisées pour MongoDB Atlas
const ATLAS_OPTIONS = {
    // === PERFORMANCE & SCALABILITÉ ===
    maxPoolSize: 50,              // Pool de connexions pour haute charge
    minPoolSize: 10,              // Minimum de connexions actives
    socketTimeoutMS: 45000,       // Timeout socket (45s)
    serverSelectionTimeoutMS: 30000, // Timeout sélection serveur (30s)
    
    // === RETRY LOGIC ===
    retryWrites: true,            // Retry automatique d'écritures
    retryReads: true,             // Retry automatique de lectures
    
    // === SÉCURITÉ ===
    ssl: true,                    // SSL/TLS obligatoire
    authSource: 'admin',          // Source d'authentification
    
    // === COMPRESSION ===
    compressors: ['snappy', 'zlib'], // Compression données
    
    // === TIMEOUT & HEARTBEAT ===
    heartbeatFrequencyMS: 10000,  // Vérification connexion (10s)
    connectTimeoutMS: 30000,      // Timeout initial (30s)
    
    // === OPTIONS AVANCÉES ===
    autoIndex: false,             // Pas d'auto-indexation en prod (performance)
    family: 4,                    // Force IPv4 (évite problèmes DNS)
};

/**
 * Construire l'URI MongoDB Atlas sécurisé
 */
const buildAtlasURI = () => {
    const username = encodeURIComponent(process.env.MONGODB_USERNAME || '');
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
    const cluster = process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net';
    const database = process.env.MONGODB_DATABASE || 'pi_academy';
    
    // Format: mongodb+srv://username:password@cluster/database
    return `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
};

/**
 * Connexion à MongoDB Atlas avec retry automatique
 */
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const connectAtlas = async () => {
    try {
        if (isConnected) {
            console.log('📊 MongoDB Atlas déjà connecté');
            return;
        }

        const uri = process.env.MONGODB_URI || buildAtlasURI();
        
        // Log masked URI for debugging
        const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
        console.log(`🔌 Tentative de connexion à: ${maskedUri}`);

        console.log('🔄 Connexion à MongoDB Atlas...');
        console.log(`📍 Cluster: ${process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net'}`);
        console.log(`📚 Database: ${process.env.MONGODB_DATABASE || 'pi_academy'}`);

        await mongoose.connect(uri, ATLAS_OPTIONS);

        isConnected = true;
        reconnectAttempts = 0;

        console.log('✅ MongoDB Atlas connecté avec succès !');
        console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⚡ Pool Size: ${ATLAS_OPTIONS.minPoolSize}-${ATLAS_OPTIONS.maxPoolSize}`);
        console.log(`🔒 SSL/TLS: Activé`);
        console.log(`🔄 Retry: Activé`);

        // Événements de connexion
        setupConnectionEvents();

    } catch (error) {
        isConnected = false;
        reconnectAttempts++;

        console.error('❌ Erreur connexion MongoDB Atlas:', error.message);
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`🔄 Nouvelle tentative dans ${delay/1000}s... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
            
            setTimeout(() => connectAtlas(), delay);
        } else {
            console.error('💥 Nombre maximum de tentatives atteint. Vérifiez :');
            console.error('   1. Votre IP est whitelistée dans MongoDB Atlas Network Access');
            console.error(`   2. IP actuelle détectée: ${await getPublicIP()}`);
            console.error('   3. Les identifiants MongoDB sont corrects');
            console.error('   4. Le cluster MongoDB est actif');
            console.error('   5. Aucun firewall/VPN ne bloque le port 27017');
            throw error;
        }
    }
};

/**
 * Configuration des événements de connexion
 */
const setupConnectionEvents = () => {
    mongoose.connection.on('connected', () => {
        console.log('🟢 MongoDB Atlas: Connexion établie');
        isConnected = true;
    });

    mongoose.connection.on('disconnected', () => {
        console.log('🔴 MongoDB Atlas: Déconnecté');
        isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🟢 MongoDB Atlas: Reconnecté');
        isConnected = true;
        reconnectAttempts = 0;
    });

    mongoose.connection.on('error', (error) => {
        console.error('⚠️  MongoDB Atlas: Erreur', error.message);
        isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await disconnectAtlas();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await disconnectAtlas();
        process.exit(0);
    });
};

/**
 * Déconnexion propre
 */
const disconnectAtlas = async () => {
    try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('📴 MongoDB Atlas: Connexion fermée');
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error.message);
    }
};

/**
 * Vérifier l'état de connexion
 */
const isAtlasConnected = () => {
    return isConnected && mongoose.connection.readyState === 1;
};

/**
 * Health Check MongoDB Atlas
 */
const healthCheck = async () => {
    try {
        if (!isAtlasConnected()) {
            return {
                status: 'disconnected',
                message: 'MongoDB Atlas non connecté'
            };
        }

        // Test ping
        await mongoose.connection.db.admin().ping();

        return {
            status: 'healthy',
            message: 'MongoDB Atlas opérationnel',
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
};

/**
 * Obtenir l'IP publique (pour debug)
 */
const getPublicIP = async () => {
    try {
        const https = require('https');
        return new Promise((resolve) => {
            https.get('https://api.ipify.org?format=json', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data).ip);
                    } catch {
                        resolve('Unknown');
                    }
                });
            }).on('error', () => resolve('Unknown'));
        });
    } catch {
        return 'Unknown';
    }
};

/**
 * Créer les indexes pour performance
 */
const createIndexes = async () => {
    try {
        const db = mongoose.connection.db;
        
        // Users indexes
        await db.collection('users').createIndex({ uid: 1 }, { unique: true, background: true });
        await db.collection('users').createIndex({ username: 1 }, { background: true });
        await db.collection('users').createIndex({ email: 1 }, { sparse: true, background: true });
        
        // Transactions indexes
        await db.collection('transactions').createIndex({ userId: 1, timestamp: -1 }, { background: true });
        await db.collection('transactions').createIndex({ type: 1 }, { background: true });
        
        // Progress indexes
        await db.collection('progress').createIndex({ userId: 1 }, { unique: true, background: true });
        
        // Staking indexes
        await db.collection('staking').createIndex({ userId: 1, active: 1 }, { background: true });
        
        // Posts indexes (social)
        await db.collection('posts').createIndex({ userId: 1, timestamp: -1 }, { background: true });
        await db.collection('posts').createIndex({ likes: -1 }, { background: true });
        
        console.log('✅ Indexes créés avec succès');
    } catch (error) {
        console.error('⚠️  Erreur création indexes:', error.message);
    }
};

module.exports = {
    connectAtlas,
    disconnectAtlas,
    isAtlasConnected,
    healthCheck,
    createIndexes,
    mongoose
};
