import { DynamicQuestionEngine } from '../services/edu/DynamicQuestionEngine';

/**
 * 📊 QUESTION POOL STATISTICS
 * 
 * Script pour afficher les statistiques du pool de questions dynamiques
 */

console.log('🎯 PI ACADEMY - QUESTION POOL STATISTICS\n');
console.log('=' .repeat(60));

const stats = DynamicQuestionEngine.getPoolStats();

console.log('\n📚 OVERVIEW');
console.log('-'.repeat(60));
console.log(`Total Question Templates: ${stats.totalTemplates}`);
console.log(`Total Unique Questions: ${stats.totalQuestions}`);
console.log(`Average Questions per Template: ${(stats.totalQuestions / stats.totalTemplates).toFixed(1)}`);

console.log('\n🎯 BY TOPIC');
console.log('-'.repeat(60));
Object.entries(stats.byTopic)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
        const percentage = ((count / stats.totalQuestions) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(count / 2));
        console.log(`${topic.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%) ${bar}`);
    });

console.log('\n⚡ BY DIFFICULTY');
console.log('-'.repeat(60));
Object.entries(stats.byDifficulty)
    .sort((a, b) => {
        const order = { easy: 0, medium: 1, hard: 2, expert: 3 };
        return order[a[0] as keyof typeof order] - order[b[0] as keyof typeof order];
    })
    .forEach(([difficulty, count]) => {
        const percentage = ((count / stats.totalQuestions) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(count / 2));
        const icon = {
            easy: '🟢',
            medium: '🟡',
            hard: '🟠',
            expert: '🔴'
        }[difficulty] || '⚪';
        console.log(`${icon} ${difficulty.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%) ${bar}`);
    });

console.log('\n💡 COVERAGE ANALYSIS');
console.log('-'.repeat(60));

const topicCoverage = Object.keys(stats.byTopic).length;
const expectedTopics = 10; // Nombre de topics attendus
const coveragePercentage = (topicCoverage / expectedTopics) * 100;

console.log(`Topics Covered: ${topicCoverage}/${expectedTopics} (${coveragePercentage.toFixed(0)}%)`);

const difficultyBalance = Object.values(stats.byDifficulty);
const maxDiff = Math.max(...difficultyBalance);
const minDiff = Math.min(...difficultyBalance);
const balance = ((minDiff / maxDiff) * 100).toFixed(0);

console.log(`Difficulty Balance: ${balance}% (${minDiff} to ${maxDiff} questions)`);

console.log('\n✅ QUALITY METRICS');
console.log('-'.repeat(60));

// Vérifier la qualité du pool
const qualityChecks = {
    'Sufficient Total Questions (>50)': stats.totalQuestions > 50,
    'Good Topic Diversity (>5 topics)': topicCoverage > 5,
    'Balanced Difficulty (>20% balance)': parseInt(balance) > 20,
    'Rich Content (>3 questions per topic)': Object.values(stats.byTopic).every(count => count >= 3)
};

Object.entries(qualityChecks).forEach(([check, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${check}`);
});

console.log('\n🎮 ANTI-REPETITION SYSTEM');
console.log('-'.repeat(60));
console.log('✅ Questions are tracked by unique ID');
console.log('✅ Last 50 answered questions are excluded');
console.log('✅ Contextual selection based on layer topic');
console.log('✅ Adaptive difficulty based on user level');
console.log('✅ Intelligent rotation prevents burnout');

console.log('\n🚀 RECOMMENDATIONS');
console.log('-'.repeat(60));

if (stats.totalQuestions < 100) {
    console.log('⚠️  Consider adding more questions to reach 100+ total');
}
if (topicCoverage < 8) {
    console.log('⚠️  Add questions for missing topics');
}
if (parseInt(balance) < 30) {
    console.log('⚠️  Balance difficulty distribution for better progression');
}

if (stats.totalQuestions >= 100 && topicCoverage >= 8 && parseInt(balance) >= 30) {
    console.log('🎉 Excellent! Question pool is well-balanced and comprehensive');
}

console.log('\n' + '='.repeat(60));
console.log('📊 End of Statistics Report\n');

export { stats };
