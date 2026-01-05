const mongoose = require('mongoose');
const path = require('path');
// Env is in parent
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔍 MongoDB DIAGNOSTIC');
if(!process.env.MONGO_URI) { console.error('NO URI'); process.exit(1); }

// Mask pass
console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
.then(() => { console.log('✅ CONNECTED'); process.exit(0); })
.catch(err => {
    console.error('❌ ERROR:', err.name);
    console.error('MSG:', err.message);
    if(err.codeName) console.error('CodeName:', err.codeName);
    if(err.code) console.error('Code:', err.code);
    process.exit(1);
});
