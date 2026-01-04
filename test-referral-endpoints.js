/**
 * Test Script for Pi Academy Referral System
 * Tests all referral endpoints without authentication
 */

const BASE_URL = 'http://localhost:3001';

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(70));
    log(title, 'cyan');
    console.log('='.repeat(70));
}

function logTest(testName) {
    log(`\n🧪 Test: ${testName}`, 'bright');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// Helper pour les requêtes HTTP
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            data
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            error: error.message
        };
    }
}

// Test 1: Health Check
async function testHealthCheck() {
    logTest('Health Check');
    
    const result = await request('/health');
    
    if (result.ok && result.data.success) {
        logSuccess('Backend is running');
        logInfo(`Version: ${result.data.version}`);
        logInfo(`Database: ${result.data.database.status}`);
        return true;
    } else {
        logError('Health check failed');
        return false;
    }
}

// Test 2: Validate Referral Code (public endpoint)
async function testValidateReferralCode() {
    logTest('Validate Referral Code (Public Endpoint)');
    
    const result = await request('/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({
            referralCode: 'TEST123'
        })
    });
    
    logInfo(`Status: ${result.status}`);
    logInfo(`Response: ${JSON.stringify(result.data, null, 2)}`);
    
    if (result.status === 404 && result.data.error === 'Code de parrainage invalide') {
        logSuccess('Endpoint fonctionne correctement (code invalide attendu)');
        return true;
    } else if (result.ok && result.data.success) {
        logSuccess('Code de parrainage valide trouvé!');
        logInfo(`Referrer: ${result.data.data.referrerUsername}`);
        return true;
    } else {
        logError('Endpoint non accessible ou erreur inattendue');
        return false;
    }
}

// Test 3: Get Leaderboard (public endpoint)
async function testGetLeaderboard() {
    logTest('Get Referral Leaderboard (Public Endpoint)');
    
    const result = await request('/api/referral/leaderboard?limit=5');
    
    logInfo(`Status: ${result.status}`);
    
    if (result.ok && result.data.success) {
        logSuccess('Leaderboard récupéré avec succès');
        logInfo(`Nombre de top referrers: ${result.data.data.leaderboard.length}`);
        
        if (result.data.data.leaderboard.length > 0) {
            console.log('\n📊 Top Referrers:');
            result.data.data.leaderboard.forEach(user => {
                console.log(`   ${user.rank}. ${user.username} - ${user.activeReferrals} filleuls actifs`);
            });
        } else {
            logInfo('Aucun parrain dans le leaderboard pour le moment');
        }
        return true;
    } else {
        logError('Erreur lors de la récupération du leaderboard');
        logInfo(JSON.stringify(result.data, null, 2));
        return false;
    }
}

// Test 4: Pi Network Stats (public endpoint)
async function testPiNetworkStats() {
    logTest('Get Pi Network Statistics (Public Endpoint)');
    
    const result = await request('/api/referral/pi-network-stats');
    
    logInfo(`Status: ${result.status}`);
    
    if (result.ok && result.data.success) {
        logSuccess('Statistiques Pi Network récupérées avec succès');
        
        const stats = result.data.data.globalStats;
        console.log('\n📊 Statistiques Globales:');
        console.log(`   Total Referrals: ${stats.totalReferrals}`);
        console.log(`   Pi Network Users: ${stats.piNetworkUsers}`);
        console.log(`   Pi Adoption Rate: ${stats.piAdoptionRate}`);
        console.log(`   Total Pi Ecosystem Bonus: ${stats.totalPiEcosystemBonus}`);
        
        if (result.data.data.topPiAdvocates && result.data.data.topPiAdvocates.length > 0) {
            console.log('\n🏆 Top Pi Advocates:');
            result.data.data.topPiAdvocates.forEach(user => {
                console.log(`   ${user.rank}. ${user.username} - ${user.piNetworkReferrals} Pi users`);
            });
        }
        
        return true;
    } else {
        logError('Erreur lors de la récupération des stats Pi Network');
        logInfo(JSON.stringify(result.data, null, 2));
        return false;
    }
}

// Test 5: Protected Endpoints (should fail without auth)
async function testProtectedEndpoints() {
    logTest('Protected Endpoints (Sans Authentification)');
    
    const endpoints = [
        { path: '/api/referral/code', method: 'GET', name: 'Get Referral Code' },
        { path: '/api/referral/stats', method: 'GET', name: 'Get Referral Stats' },
        { path: '/api/referral/claim-rewards', method: 'POST', name: 'Claim Rewards' }
    ];
    
    let allFailed = true;
    
    for (const endpoint of endpoints) {
        const result = await request(endpoint.path, { method: endpoint.method });
        
        if (result.status === 401 || result.status === 500) {
            logSuccess(`${endpoint.name}: Correctement protégé (${result.status})`);
        } else {
            logError(`${endpoint.name}: Devrait être protégé mais retourne ${result.status}`);
            allFailed = false;
        }
    }
    
    return allFailed;
}

// Fonction principale de test
async function runAllTests() {
    logSection('🧪 PI ACADEMY - TEST DU SYSTÈME DE PARRAINAGE 🧪');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    const tests = [
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'Validate Referral Code', fn: testValidateReferralCode },
        { name: 'Leaderboard', fn: testGetLeaderboard },
        { name: 'Pi Network Stats', fn: testPiNetworkStats },
        { name: 'Protected Endpoints', fn: testProtectedEndpoints }
    ];
    
    for (const test of tests) {
        results.total++;
        try {
            const passed = await test.fn();
            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        } catch (error) {
            results.failed++;
            logError(`Exception dans ${test.name}: ${error.message}`);
        }
        
        // Pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Résumé
    logSection('📊 RÉSUMÉ DES TESTS');
    log(`Total de tests: ${results.total}`, 'bright');
    log(`Tests réussis: ${results.passed}`, 'green');
    log(`Tests échoués: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
    
    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    console.log('\n');
    log(`Taux de réussite: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
    
    if (results.failed === 0) {
        log('\n🎉 Tous les tests sont passés! Le backend du système de parrainage fonctionne correctement!', 'green');
    } else {
        log('\n⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.', 'yellow');
    }
    
    console.log('\n');
}

// Lancer les tests
runAllTests().catch(error => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
});
