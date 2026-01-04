/**
 * ============================================================================
 * MONGODB ATLAS - CONFIGURATION OPTIMISÉE POUR PRODUCTION
 * ============================================================================
 * 
 * Fonctionnalités :
 * ✅ Scalabilité maximale (connection pooling)
 * ✅ Sécurité renforcée (SSL/TLS, chiffrement)
 * ✅ Retry logic intelligent
 * ✅ Monitoring et health checks
 * ✅ Performance optimisée (compression, indexes)
 * ✅ Gestion automatique des erreurs
 */

const mongoose = require('mongoose');
const { auditLog } = require('./security-config');

// ============================================================================
// CONFIGURATION DE CONNEXION OPTIMISÉE
// ============================================================================

const getConnectionOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
        // === PERFORMANCE & SCALABILITÉ ===
        maxPoolSize: isProduction ? 100 : 50,  // Plus de connexions en production
        minPoolSize: isProduction ? 20 : 10,   // Minimum élevé pour éviter cold starts
        socketTimeoutMS: 45000,                // 45 secondes
        serverSelectionTimeoutMS: 30000,       // 30 secondes
        
        // === RETRY LOGIC AUTOMATIQUE ===
        retryWrites: true,                     // Retry automatique des écritures
        retryReads: true,                      // Retry automatique des lectures
        
        // === SÉCURITÉ ===
        ssl: true,                             // SSL/TLS obligatoire
        tls: true,                             // TLS activé
        tlsAllowInvalidCertificates: false,    // Vérifier les certificats
        authSource: 'admin',                   // Source d'authentification
        
        // === COMPRESSION ===
        compressors: ['snappy', 'zlib'],       // Compression pour réduire la bande passante
        zlibCompressionLevel: 6,               // Niveau de compression
        
        // === TIMEOUTS & HEARTBEAT ===
        heartbeatFrequencyMS: 10000,           // Vérification toutes les 10s
        connectTimeoutMS: 30000,               // Timeout connexion initiale
        
        // === OPTIONS AVANCÉES ===
        autoIndex: !isProduction,              // Pas d'auto-index en prod (créer manuellement)
        family: 4,                             // Force IPv4 (évite problèmes DNS IPv6)
        
        // === MONITORING ===
        monitorCommands: !isProduction,        // Log des commandes en dev
        
        // === WRITE CONCERN (Garantie d'écriture) ===
        w: 'majority',                         // Attendre confirmation de la majorité des réplicas
        wtimeoutMS: 10000,                     // Timeout pour write concern
        
        // === READ PREFERENCE ===
        readPreference: isProduction ? 'secondaryPreferred' : 'primary', // Répartir la charge en prod
    };
};

// ============================================================================
// CONSTRUCTION URI SÉCURISÉE
// ============================================================================

/**
 * Construire l'URI MongoDB Atlas avec toutes les options de sécurité
 */
const buildSecureURI = () => {
    // Récupérer les variables d'environnement
    const username = encodeURIComponent(process.env.MONGODB_USERNAME || '');
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
    const cluster = process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net';
    const database = process.env.MONGODB_DATABASE || 'pi_academy';
    
    // Paramètres de sécurité supplémentaires dans l'URI
    const securityParams = [
        'retryWrites=true',
        'w=majority',
        'ssl=true',
        'authSource=admin'
    ].join('&');
    
    // Format: mongodb+srv://username:password@cluster/database?params
    return `mongodb+srv://${username}:${password}@${cluster}/${database}?${securityParams}`;
};

// ============================================================================
// GESTION DE LA CONNEXION
// ============================================================================

let connectionState = {
    isConnected: false,
    reconnectAttempts: 0,
    lastError: null,
    connectedAt: null,
    reconnections: 0
};

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RETRY_DELAY = 1000; // 1 seconde

/**
 * Connexion à MongoDB Atlas avec retry intelligent
 */
const connectAtlas = async () => {
    try {
        if (connectionState.isConnected && mongoose.connection.readyState === 1) {
            console.log('📊 MongoDB Atlas déjà connecté');
            return { success: true, message: 'Déjà connecté' };
        }

        // Récupérer l'URI (personnalisé ou construit)
        const uri = process.env.MONGODB_URI || buildSecureURI();
        const options = getConnectionOptions();
        
        console.log('\n' + '='.repeat(70));
        console.log('🔄 CONNEXION MONGODB ATLAS');
        console.log('='.repeat(70));
        console.log(`📍 Cluster: ${process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net'}`);
        console.log(`📚 Database: ${process.env.MONGODB_DATABASE || 'pi_academy'}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔒 SSL/TLS: Activé`);
        console.log(`⚡ Pool: ${options.minPoolSize}-${options.maxPoolSize} connexions`);
        console.log('='.repeat(70));

        // Tenter la connexion
        await mongoose.connect(uri, options);

        // Connexion réussie
        connectionState.isConnected = true;
        connectionState.reconnectAttempts = 0;
        connectionState.connectedAt = new Date();
        connectionState.lastError = null;

        console.log('✅ MONGODB ATLAS CONNECTÉ AVEC SUCCÈS !');
        console.log(`🕒 Connecté à: ${connectionState.connectedAt.toISOString()}`);
        console.log('='.repeat(70) + '\n');

        // Setup des événements de connexion
        setupConnectionEvents();
        
        // Audit log
        auditLog('SYSTEM', 'mongodb_connected', {
            cluster: process.env.MONGODB_CLUSTER,
            database: process.env.MONGODB_DATABASE
        });

        return { 
            success: true, 
            message: 'Connexion établie',
            connectedAt: connectionState.connectedAt
        };

    } catch (error) {
        connectionState.isConnected = false;
        connectionState.reconnectAttempts++;
        connectionState.lastError = error.message;

        console.error('\n' + '⚠'.repeat(70));
        console.error('❌ ERREUR CONNEXION MONGODB ATLAS');
        console.error('⚠'.repeat(70));
        console.error(`Message: ${error.message}`);
        console.error(`Tentative: ${connectionState.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
        
        // Retry logic avec backoff exponentiel
        if (connectionState.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(
                BASE_RETRY_DELAY * Math.pow(2, connectionState.reconnectAttempts),
                30000 // Max 30 secondes
            );
            
            console.error(`🔄 Nouvelle tentative dans ${delay/1000}s...`);
            console.error('⚠'.repeat(70) + '\n');
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return connectAtlas(); // Recursive retry
        } else {
            // Maximum de tentatives atteint
            console.error('\n💥 NOMBRE MAXIMUM DE TENTATIVES ATTEINT');
            console.error('\nVÉRIFICATIONS NÉCESSAIRES:');
            console.error('1. ✓ Votre IP est whitelistée dans MongoDB Atlas Network Access');
            console.error('2. ✓ Les identifiants MongoDB (username/password) sont corrects');
            console.error('3. ✓ Le cluster MongoDB Atlas est actif et accessible');
            console.error('4. ✓ Aucun firewall/VPN ne bloque le port 27017');
            console.error('5. ✓ Le fichier .env contient les bonnes variables');
            console.error('\n📖 Consultez: MONGODB_ATLAS_GUIDE.md pour plus d\'aide');
            console.error('⚠'.repeat(70) + '\n');
            
            auditLog('SYSTEM', 'mongodb_connection_failed', {
                error: error.message,
                attempts: connectionState.reconnectAttempts
            });
            
            throw new Error(`Impossible de se connecter à MongoDB Atlas après ${MAX_RECONNECT_ATTEMPTS} tentatives`);
        }
    }
};

/**
 * Configuration des événements de connexion
 */
const setupConnectionEvents = () => {
    const connection = mongoose.connection;
    
    // Événement: Connexion établie
    connection.on('connected', () => {
        console.log('🟢 MongoDB Atlas: Connexion établie');
        connectionState.isConnected = true;
        auditLog('SYSTEM', 'mongodb_event_connected');
    });
    
    // Événement: Déconnecté
    connection.on('disconnected', () => {
        console.log('🔴 MongoDB Atlas: Déconnecté');
        connectionState.isConnected = false;
        auditLog('SYSTEM', 'mongodb_event_disconnected');
    });
    
    // Événement: Reconnecté
    connection.on('reconnected', () => {
        console.log('🟢 MongoDB Atlas: Reconnecté');
        connectionState.isConnected = true;
        connectionState.reconnections++;
        connectionState.reconnectAttempts = 0;
        auditLog('SYSTEM', 'mongodb_event_reconnected', {
            totalReconnections: connectionState.reconnections
        });
    });
    
    // Événement: Erreur
    connection.on('error', (error) => {
        console.error('⚠️  MongoDB Atlas: Erreur ->', error.message);
        connectionState.isConnected = false;
        connectionState.lastError = error.message;
        auditLog('SYSTEM', 'mongodb_event_error', {
            error: error.message,
            success: false
        });
    });
    
    // Événement: Close
    connection.on('close', () => {
        console.log('📴 MongoDB Atlas: Connexion fermée');
        connectionState.isConnected = false;
    });
};

// ============================================================================
// DÉCONNEXION GRACEFUL
// ============================================================================

/**
 * Déconnexion propre de MongoDB
 */
const disconnectAtlas = async () => {
    try {
        if (!connectionState.isConnected) {
            console.log('📴 MongoDB Atlas: Déjà déconnecté');
            return;
        }
        
        console.log('🔄 Fermeture de la connexion MongoDB Atlas...');
        await mongoose.connection.close();
        
        connectionState.isConnected = false;
        console.log('✅ MongoDB Atlas: Connexion fermée proprement');
        
        auditLog('SYSTEM', 'mongodb_disconnected');
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error.message);
        throw error;
    }
};

// ============================================================================
// HEALTH CHECK AVANCÉ
// ============================================================================

/**
 * Vérifier l'état de santé de MongoDB Atlas
 */
const healthCheck = async () => {
    try {
        // Vérifier l'état de connexion
        if (!connectionState.isConnected || mongoose.connection.readyState !== 1) {
            return {
                status: 'disconnected',
                message: 'MongoDB Atlas non connecté',
                readyState: mongoose.connection.readyState,
                lastError: connectionState.lastError,
                reconnectAttempts: connectionState.reconnectAttempts
            };
        }

        // Test ping pour vérifier la latence
        const startTime = Date.now();
        await mongoose.connection.db.admin().ping();
        const latency = Date.now() - startTime;

        // Récupérer des statistiques
        const stats = await mongoose.connection.db.stats();

        return {
            status: 'healthy',
            message: 'MongoDB Atlas opérationnel',
            readyState: mongoose.connection.readyState,
            latency: `${latency}ms`,
            host: mongoose.connection.host,
            database: mongoose.connection.name,
            connectedAt: connectionState.connectedAt,
            reconnections: connectionState.reconnections,
            stats: {
                collections: stats.collections,
                dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
                indexes: stats.indexes,
                indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
            }
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message,
            readyState: mongoose.connection.readyState,
            lastError: connectionState.lastError
        };
    }
};

// ============================================================================
// CRÉATION DES INDEXES POUR PERFORMANCE
// ============================================================================

/**
 * Créer tous les indexes pour optimiser les performances
 */
const createIndexes = async () => {
    try {
        console.log('📊 Création des indexes MongoDB...');
        const db = mongoose.connection.db;
        
        // Users Collection
        await db.collection('users').createIndex(
            { uid: 1 }, 
            { unique: true, background: true, name: 'idx_uid' }
        );
        await db.collection('users').createIndex(
            { username: 1 }, 
            { background: true, name: 'idx_username' }
        );
        await db.collection('users').createIndex(
            { email: 1 }, 
            { sparse: true, background: true, name: 'idx_email' }
        );
        await db.collection('users').createIndex(
            { createdAt: -1 }, 
            { background: true, name: 'idx_created' }
        );
        
        // Transactions Collection
        await db.collection('transactions').createIndex(
            { userId: 1, timestamp: -1 }, 
            { background: true, name: 'idx_user_transactions' }
        );
        await db.collection('transactions').createIndex(
            { type: 1, timestamp: -1 }, 
            { background: true, name: 'idx_type_transactions' }
        );
        
        // Progress Collection
        await db.collection('progress').createIndex(
            { userId: 1 }, 
            { unique: true, background: true, name: 'idx_user_progress' }
        );
        
        // Staking Collection
        await db.collection('staking').createIndex(
            { userId: 1, active: 1 }, 
            { background: true, name: 'idx_user_staking' }
        );
        await db.collection('staking').createIndex(
            { endDate: 1, active: 1 }, 
            { background: true, name: 'idx_staking_end' }
        );
        
        // Posts Collection (Social)
        await db.collection('posts').createIndex(
            { userId: 1, timestamp: -1 }, 
            { background: true, name: 'idx_user_posts' }
        );
        await db.collection('posts').createIndex(
            { likes: -1 }, 
            { background: true, name: 'idx_post_likes' }
        );
        await db.collection('posts').createIndex(
            { timestamp: -1 }, 
            { background: true, name: 'idx_post_timestamp' }
        );
        
        // Leaderboard (pour queries rapides)
        await db.collection('users').createIndex(
            { 'stats.totalPi': -1 }, 
            { background: true, name: 'idx_leaderboard_pi' }
        );
        await db.collection('users').createIndex(
            { 'stats.level': -1 }, 
            { background: true, name: 'idx_leaderboard_level' }
        );
        
        console.log('✅ Indexes créés avec succès');
        auditLog('SYSTEM', 'indexes_created');
        
    } catch (error) {
        console.error('⚠️  Erreur création indexes:', error.message);
        auditLog('SYSTEM', 'indexes_creation_failed', {
            error: error.message,
            success: false
        });
    }
};

// ============================================================================
// STATISTIQUES DE CONNEXION
// ============================================================================

/**
 * Obtenir les statistiques de connexion
 */
const getConnectionStats = () => {
    return {
        ...connectionState,
        readyState: mongoose.connection.readyState,
        readyStateString: getReadyStateString(mongoose.connection.readyState)
    };
};

const getReadyStateString = (state) => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    return states[state] || 'unknown';
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    connectAtlas,
    disconnectAtlas,
    healthCheck,
    createIndexes,
    getConnectionStats,
    mongoose
};
