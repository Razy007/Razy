$env:MONGO_URI = 'mongodb+srv://abdoulrazaktanko06_db_user:yFOUjGLrsBc7d00f@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority'
$env:DB_HOST = 'localhost'
$env:DB_PORT = '5432'
$env:DB_NAME = 'razy_pi_network'
$env:DB_USER = 'postgres'
$env:DB_PASSWORD = 'postgres'
$env:NODE_OPTIONS = '--dns-result-order=ipv4first'

Write-Host "🚀 Starting migration from Atlas..."
./backend/node_modules/.bin/ts-node ./backend/src/migrate.ts
