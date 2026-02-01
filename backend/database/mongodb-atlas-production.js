const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * 🚀 CONFIGURATION MONGODB ATLAS - PRODUCTION READY
 * ===================================================
 * ✅ Sécurité maximale (SSL/TLS, encryption at rest)
 * ✅ Scalabilité automatique (connection pooling, sharding-ready)
 * ✅ Haute disponibilité (retry logic, failover automatique)
 * ✅ Performance optimisée (indexes, compression, caching)
 * ✅ Monitoring & alerting
 */

// ============================================================================
// CONFIGURATION SÉCURITÉ
// ============================================================================

const SECURITY_OPTIONS = {
    // SSL/TLS obligatoire
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    
    // Authentification sécurisée
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-256',
    
    // Chiffrement des données
    readPreference: 'secondaryPreferred', // Load balancing sur replicas
};

// ============================================================================
// CONFIGURATION PERFORMANCE & SCALABILITÉ
// ============================================================================

const PERFORMANCE_OPTIONS = {
    // === CONNECTION POOLING ===
    maxPoolSize: 100,              // Max 100 connexions simultanées
    minPoolSize: 20,               // Garde 20 connexions warm
    maxIdleTimeMS: 60000,          // Ferme connexions inactives après 60s
    waitQueueTimeoutMS: 10000,     // Timeout file d'attente 10s
    
    // === TIMEOUTS ===
    serverSelectionTimeoutMS: 30000,  // 30s pour trouver un serveur
    connectTimeoutMS: 30000,          // 30s pour connexion initiale
    socketTimeoutMS: 45000,           // 45s pour opérations socket
    
    // === RETRY LOGIC ===
    retryWrites: true,             // Retry automatique écritures
    retryReads: true,              // Retry automatique lectures
    
    // === COMPRESSION ===
    compressors: ['snappy', 'zlib'], // Compresse les données
    zlibCompressionLevel: 6,       // Niveau compression optimal
    
    // === MONITORING ===
    heartbeatFrequencyMS: 10000,   // Check santé serveur chaque 10s
    serverMonitoringMode: 'auto',  // Monitoring automatique
    
    // === AUTRES ===
    autoIndex: false,              // Pas d'auto-indexation (performance)
    family: 4,                     // Force IPv4 (évite problèmes IPv6)
    directConnection: false,       // Utilise load balancing Atlas
};

// ============================================================================
// WRITE CONCERN & READ CONCERN (ACID Compliance)
// ============================================================================

const ACID_OPTIONS = {
    // Write Concern: Garantit durabilité des écritures
    w: 'majority',                 // Écrit sur majorité des replicas
    wtimeoutMS: 5000,             // Timeout write concern 5s
    journal: true,                // Force écriture dans journal
    
    // Read Concern: Garantit cohérence des lectures
    readConcern: { level: 'majority' }, // Lit données confirmées par majorité
};

// ============================================================================
// CONSTRUCTION URI SÉCURISÉE
// ============================================================================

/**
 * Construit l'URI MongoDB Atlas avec toutes les options de sécurité
 */
const buildSecureAtlasURI = () => {
    // Récupère credentials depuis env
    const username = encodeURIComponent(process.env.MONGODB_USERNAME || '');
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
    const cluster = process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net';
    const database = process.env.MONGODB_DATABASE || 'pi_academy';
    
    // Validation
    if (!username || !password) {
        throw new Error('❌ MONGODB_USERNAME et MONGODB_PASSWORD requis dans .env');
    }
    
    // Construction URI avec paramètres de sécurité
    const baseURI = `mongodb+srv://${username}:${password}@${cluster}/${database}`;
    const params = new URLSearchParams({
        retryWrites: 'true',
        w: 'majority',
        readPreference: 'secondaryPreferred',
        maxPoolSize: '100',
        minPoolSize: '20',
        ssl: 'true',
        authSource: 'admin',
    });
    
    return `${baseURI}?${params.toString()}`;
};

// ============================================================================
// GESTION CONNEXION AVEC RETRY AUTOMATIQUE
// ============================================================================

let connectionState = {
    isConnected: false,
    reconnectAttempts: 0,
    lastError: null,
    connectionStartTime: null,
    totalReconnects: 0,
};

const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RETRY_DELAY = 1000; // 1s
const MAX_RETRY_DELAY = 60000;    // 60s

/**
 * Connexion à MongoDB Atlas avec retry exponentiel
 */
const connectAtlasProduction = async () => {
    try {
        if (connectionState.isConnected && mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB Atlas déjà connecté (production mode)');
            return true;
        }

        connectionState.connectionStartTime = Date.now();
        const uri = process.env.MONGODB_URI || buildSecureAtlasURI();
        
        console.log('\n' + '='.repeat(70));
        console.log('🚀 CONNEXION MONGODB ATLAS - PRODUCTION MODE');
        console.log('='.repeat(70));
        console.log(`📍 Cluster: ${process.env.MONGODB_CLUSTER || 'cluster0.y87z9is.mongodb.net'}`);
        console.log(`📚 Database: ${process.env.MONGODB_DATABASE || 'pi_academy'}`);
        console.log(`🔒 Security: SSL/TLS + SCRAM-SHA-256`);
        console.log(`⚡ Pool Size: ${PERFORMANCE_OPTIONS.minPoolSize}-${PERFORMANCE_OPTIONS.maxPoolSize}`);
        console.log(`🔄 Retry Logic: Enabled (${MAX_RECONNECT_ATTEMPTS} attempts)`);
        console.log(`💾 Write Concern: majority + journal`);
        console.log(`📖 Read Concern: majority`);
        console.log('='.repeat(70) + '\n');

        // Merge toutes les options
        const options = {
            ...SECURITY_OPTIONS,
            ...PERFORMANCE_OPTIONS,
            ...ACID_OPTIONS,
        };

        // Connexion avec timeout
        await Promise.race([
            mongoose.connect(uri, options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout connexion (30s)')), 30000)
            )
        ]);

        connectionState.isConnected = true;
        connectionState.reconnectAttempts = 0;
        connectionState.lastError = null;

        const connectTime = Date.now() - connectionState.connectionStartTime;
        
        console.log('\n' + '✅'.repeat(35));
        console.log('🎉 MONGODB ATLAS CONNECTÉ AVEC SUCCÈS !');
        console.log('✅'.repeat(35));
        console.log(`⏱️  Temps connexion: ${connectTime}ms`);
        console.log(`🌐 Mode: ${process.env.NODE_ENV || 'production'}`);
        console.log(`🔐 Encryption: at rest + in transit`);
        console.log(`📡 Host: ${mongoose.connection.host}`);
        console.log(`🏷️  Database: ${mongoose.connection.name}`);
        console.log('✅'.repeat(35) + '\n');

        // Setup event handlers
        setupProductionEventHandlers();
        
        // Start monitoring
        startConnectionMonitoring();

        return true;

    } catch (error) {
        connectionState.isConnected = false;
        connectionState.lastError = error.message;
        connectionState.reconnectAttempts++;

        console.error('\n❌ ERREUR CONNEXION MONGODB ATLAS');
        console.error('━'.repeat(70));
        console.error(`📛 Message: ${error.message}`);
        console.error(`🔄 Tentative: ${connectionState.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
        
        if (connectionState.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            // Calcul délai exponentiel avec jitter
            const baseDelay = Math.min(
                INITIAL_RETRY_DELAY * Math.pow(2, connectionState.reconnectAttempts - 1),
                MAX_RETRY_DELAY
            );
            const jitter = Math.random() * 1000; // Random 0-1s
            const delay = baseDelay + jitter;
            
            console.log(`⏳ Nouvelle tentative dans ${(delay/1000).toFixed(1)}s...`);
            console.error('━'.repeat(70) + '\n');
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return connectAtlasProduction(); // Recursive retry
            
        } else {
            console.error('\n💥 NOMBRE MAXIMUM DE TENTATIVES ATTEINT');
            console.error('━'.repeat(70));
            console.error('📋 CHECKLIST DE DÉPANNAGE:');
            console.error('');
            console.error('1️⃣  NETWORK ACCESS (MongoDB Atlas)');
            console.error('   → Ajoutez votre IP: 190.2.155.230');
            console.error('   → URL: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList');
            console.error('');
            console.error('2️⃣  DATABASE ACCESS (MongoDB Atlas)');
            console.error('   → Vérifiez username/password dans .env');
            console.error('   → User doit avoir rôle "atlasAdmin" ou "readWriteAnyDatabase"');
            console.error('');
            console.error('3️⃣  FIREWALL/ANTIVIRUS LOCAL');
            console.error('   → Autorisez port 27017 (sortant)');
            console.error('   → Désactivez temporairement VPN');
            console.error('   → Vérifiez Windows Firewall');
            console.error('');
            console.error('4️⃣  CLUSTER STATUS');
            console.error('   → Cluster doit être "Active" et "Healthy"');
            console.error('   → Vérifiez sur Atlas Dashboard');
            console.error('');
            console.error('5️⃣  VARIABLES ENVIRONNEMENT');
            console.error('   → MONGODB_URI ou (MONGODB_USERNAME + MONGODB_PASSWORD)');
            console.error('   → MONGODB_CLUSTER');
            console.error('   → MONGODB_DATABASE');
            console.error('━'.repeat(70) + '\n');
            
            throw error;
        }
    }
};

// ============================================================================
// EVENT HANDLERS PRODUCTION
// ============================================================================

const setupProductionEventHandlers = () => {
    const db = mongoose.connection;

    db.on('connected', () => {
        console.log('🟢 [EVENT] MongoDB Atlas: Connected');
        connectionState.isConnected = true;
    });

    db.on('disconnected', () => {
        console.log('🔴 [EVENT] MongoDB Atlas: Disconnected');
        connectionState.isConnected = false;
        
        // Auto-reconnect
        console.log('🔄 [EVENT] Tentative de reconnexion...');
        connectAtlasProduction().catch(err => {
            console.error('❌ [EVENT] Échec reconnexion:', err.message);
        });
    });

    db.on('reconnected', () => {
        console.log('🟢 [EVENT] MongoDB Atlas: Reconnected');
        connectionState.isConnected = true;
        connectionState.reconnectAttempts = 0;
        connectionState.totalReconnects++;
    });

    db.on('error', (error) => {
        console.error('⚠️  [EVENT] MongoDB Atlas Error:', error.message);
        connectionState.lastError = error.message;
    });

    db.on('close', () => {
        console.log('📴 [EVENT] MongoDB Atlas: Connection closed');
        connectionState.isConnected = false;
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
        console.log(`\n🛑 [${signal}] Arrêt gracieux MongoDB Atlas...`);
        await disconnectAtlasProduction();
        process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Nodemon
};

// ============================================================================
// MONITORING & HEALTH CHECK
// ============================================================================

let monitoringInterval = null;

/**
 * Démarre le monitoring de connexion
 */
const startConnectionMonitoring = () => {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }

    // Check santé toutes les 30s
    monitoringInterval = setInterval(async () => {
        const health = await healthCheckProduction();
        
        if (health.status !== 'healthy') {
            console.warn('⚠️  [MONITOR] MongoDB Atlas santé dégradée:', health);
        }
    }, 30000);
};

/**
 * Health check complet
 */
const healthCheckProduction = async () => {
    try {
        const db = mongoose.connection;

        // Check 1: Connection state
        if (!connectionState.isConnected || db.readyState !== 1) {
            return {
                status: 'disconnected',
                message: 'MongoDB Atlas non connecté',
                readyState: db.readyState,
                uptime: null
            };
        }

        // Check 2: Ping test
        const pingStart = Date.now();
        await db.db.admin().ping();
        const pingTime = Date.now() - pingStart;

        // Check 3: Server status
        const serverStatus = await db.db.admin().serverStatus();
        
        return {
            status: 'healthy',
            message: 'MongoDB Atlas opérationnel',
            readyState: db.readyState,
            host: db.host,
            name: db.name,
            ping: `${pingTime}ms`,
            uptime: serverStatus.uptime,
            connections: {
                current: serverStatus.connections.current,
                available: serverStatus.connections.available,
            },
            network: {
                bytesIn: serverStatus.network.bytesIn,
                bytesOut: serverStatus.network.bytesOut,
            },
            stats: {
                reconnects: connectionState.totalReconnects,
                lastError: connectionState.lastError,
            }
        };

    } catch (error) {
        return {
            status: 'error',
            message: error.message,
            readyState: mongoose.connection.readyState
        };
    }
};

/**
 * Déconnexion propre
 */
const disconnectAtlasProduction = async () => {
    try {
        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            monitoringInterval = null;
        }

        await mongoose.connection.close();
        connectionState.isConnected = false;
        
        console.log('✅ MongoDB Atlas: Déconnexion propre effectuée');
        return true;

    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error.message);
        return false;
    }
};

/**
 * Vérifie si connecté
 */
const isAtlasConnectedProduction = () => {
    return connectionState.isConnected && mongoose.connection.readyState === 1;
};

// ============================================================================
// INDEXES OPTIMISÉS POUR PERFORMANCE
// ============================================================================

/**
 * Crée tous les indexes nécessaires
 */
const createProductionIndexes = async () => {
    try {
        console.log('\n📊 Création des indexes de production...');
        const db = mongoose.connection.db;
        
        // Users collection
        await db.collection('users').createIndex(
            { uid: 1 }, 
            { unique: true, background: true, name: 'idx_users_uid' }
        );
        await db.collection('users').createIndex(
            { username: 1 }, 
            { background: true, name: 'idx_users_username' }
        );
        await db.collection('users').createIndex(
            { email: 1 }, 
            { sparse: true, background: true, name: 'idx_users_email' }
        );
        await db.collection('users').createIndex(
            { createdAt: -1 }, 
            { background: true, name: 'idx_users_created' }
        );

        // Transactions collection
        await db.collection('transactions').createIndex(
            { userId: 1, timestamp: -1 }, 
            { background: true, name: 'idx_transactions_user_time' }
        );
        await db.collection('transactions').createIndex(
            { type: 1, timestamp: -1 }, 
            { background: true, name: 'idx_transactions_type_time' }
        );
        await db.collection('transactions').createIndex(
            { status: 1 }, 
            { background: true, name: 'idx_transactions_status' }
        );

        // Progress collection
        await db.collection('progress').createIndex(
            { userId: 1 }, 
            { unique: true, background: true, name: 'idx_progress_user' }
        );
        await db.collection('progress').createIndex(
            { 'completedCourses.courseId': 1 }, 
            { background: true, name: 'idx_progress_courses' }
        );

        // Staking collection
        await db.collection('staking').createIndex(
            { userId: 1, active: 1 }, 
            { background: true, name: 'idx_staking_user_active' }
        );
        await db.collection('staking').createIndex(
            { endDate: 1 }, 
            { background: true, name: 'idx_staking_enddate' }
        );

        // Posts collection (social)
        await db.collection('posts').createIndex(
            { userId: 1, timestamp: -1 }, 
            { background: true, name: 'idx_posts_user_time' }
        );
        await db.collection('posts').createIndex(
            { likes: -1, timestamp: -1 }, 
            { background: true, name: 'idx_posts_trending' }
        );
        await db.collection('posts').createIndex(
            { timestamp: -1 }, 
            { background: true, name: 'idx_posts_recent' }
        );

        // Leaderboard indexes
        await db.collection('users').createIndex(
            { 'stats.totalPiEarned': -1 }, 
            { background: true, name: 'idx_leaderboard_earnings' }
        );
        await db.collection('users').createIndex(
            { 'stats.level': -1 }, 
            { background: true, name: 'idx_leaderboard_level' }
        );

        console.log('✅ Tous les indexes créés avec succès\n');
        return true;

    } catch (error) {
        console.error('⚠️  Erreur création indexes:', error.message);
        return false;
    }
};

// ============================================================================
// UTILITAIRES DE DEBUG
// ============================================================================

/**
 * Obtenir statistiques de connexion
 */
const getConnectionStats = () => {
    return {
        ...connectionState,
        readyState: mongoose.connection.readyState,
        readyStateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
    };
};

/**
 * Test complet de la connexion
 */
const testAtlasConnection = async () => {
    console.log('\n🧪 TEST CONNEXION MONGODB ATLAS');
    console.log('━'.repeat(70));

    try {
        // Test 1: Connection state
        console.log('1️⃣  État connexion...');
        const stats = getConnectionStats();
        console.log(`   ✅ Ready State: ${stats.readyStateLabel}`);

        // Test 2: Ping
        console.log('2️⃣  Test ping...');
        const pingStart = Date.now();
        await mongoose.connection.db.admin().ping();
        console.log(`   ✅ Ping: ${Date.now() - pingStart}ms`);

        // Test 3: Write test
        console.log('3️⃣  Test écriture...');
        const testDoc = { _id: new mongoose.Types.ObjectId(), test: true, timestamp: new Date() };
        await mongoose.connection.db.collection('_test').insertOne(testDoc);
        console.log('   ✅ Écriture réussie');

        // Test 4: Read test
        console.log('4️⃣  Test lecture...');
        const found = await mongoose.connection.db.collection('_test').findOne({ _id: testDoc._id });
        console.log('   ✅ Lecture réussie');

        // Test 5: Delete test
        console.log('5️⃣  Test suppression...');
        await mongoose.connection.db.collection('_test').deleteOne({ _id: testDoc._id });
        console.log('   ✅ Suppression réussie');

        console.log('━'.repeat(70));
        console.log('🎉 TOUS LES TESTS RÉUSSIS !\n');
        return true;

    } catch (error) {
        console.log('━'.repeat(70));
        console.error('❌ ÉCHEC DES TESTS:', error.message);
        return false;
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Connexion
    connectAtlasProduction,
    disconnectAtlasProduction,
    isAtlasConnectedProduction,
    
    // Monitoring
    healthCheckProduction,
    getConnectionStats,
    testAtlasConnection,
    
    // Indexes
    createProductionIndexes,
    
    // Mongoose instance
    mongoose,
};
