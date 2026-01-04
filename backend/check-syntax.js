try {
    console.log('Checking auth.js...');
    require('./routes/auth');
    console.log('Checking payments.js...');
    require('./routes/payments');
    console.log('Checking piNetworkService.js...');
    require('./services/piNetworkService');
    console.log('✅ Syntax Check Passed');
} catch (error) {
    console.error('❌ Syntax Error:', error.message);
    process.exit(1);
}
