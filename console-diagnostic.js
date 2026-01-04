/**
 * Script de Diagnostic Pioneer Academy
 * 
 * Ce script peut être copié-collé dans la console du navigateur
 * pour diagnostiquer les problèmes de déverrouillage de cours et XP
 * 
 * UTILISATION:
 * 1. Ouvrez http://localhost:5173/
 * 2. Appuyez sur F12 pour ouvrir la console
 * 3. Copiez-collez ce script complet
 * 4. Appuyez sur Entrée
 */

(function() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 DIAGNOSTIC PIONEER ACADEMY - CONSOLE VERSION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Récupérer les données utilisateur
    const userProgressStr = localStorage.getItem('userProgress');
    if (!userProgressStr) {
        console.error('❌ Aucune donnée utilisateur trouvée dans localStorage');
        console.log('💡 Connectez-vous d\'abord à l\'application');
        return;
    }
    
    const userProgress = JSON.parse(userProgressStr);
    
    // Calculer le niveau basé sur les XP
    const calculateLevel = (xp) => Math.floor(xp / 100) + 1;
    const calculatedLevel = calculateLevel(userProgress.xp || 0);
    
    console.log('\n📊 ÉTAT UTILISATEUR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.table({
        'XP Total': userProgress.xp || 0,
        'Total Points': userProgress.totalPoints || 0,
        'Niveau Stocké': userProgress.level,
        'Niveau Calculé': calculatedLevel,
        'Niveau Cohérent?': userProgress.level === calculatedLevel ? '✅ OUI' : '❌ NON',
        'Cours Complétés': userProgress.completedCourses.length,
        'Énergie': `${userProgress.energy?.current || 0} / ${userProgress.energy?.max || 100}`
    });
    
    // Vérifier la cohérence
    if (userProgress.level !== calculatedLevel) {
        console.warn('⚠️  INCOHÉRENCE DÉTECTÉE!');
        console.warn(`   Niveau stocké: ${userProgress.level}`);
        console.warn(`   Niveau calculé: ${calculatedLevel}`);
        console.warn(`   Basé sur: ${userProgress.xp} XP`);
        console.log('\n💡 SOLUTION: Exécutez fixLevel() pour corriger');
    }
    
    // Définition des cours
    const COURSES = [
        {
            id: 'pi-intro-101',
            title: 'Introduction à Pi Network',
            requiredLevel: 1,
            requiredXP: 0,
            requiredCourses: []
        },
        {
            id: 'pi-wallet-101',
            title: 'Pi Wallet Mastery',
            requiredLevel: 2,
            requiredXP: 300,
            requiredCourses: ['pi-intro-101']
        },
        {
            id: 'safety-101',
            title: 'Anti-Scam Defense',
            requiredLevel: 3,
            requiredXP: 500,
            requiredCourses: ['pi-wallet-101']
        },
        {
            id: 'kyc-101',
            title: 'KYC Process Explained',
            requiredLevel: 4,
            requiredXP: 800,
            requiredCourses: ['safety-101']
        },
        {
            id: 'blockchain-fundamentals',
            title: 'Blockchain Fundamentals',
            requiredLevel: 5,
            requiredXP: 1000,
            requiredCourses: ['pi-intro-101', 'pi-wallet-101']
        },
        {
            id: 'defi-intro',
            title: 'Introduction au DeFi',
            requiredLevel: 7,
            requiredXP: 1500,
            requiredCourses: ['blockchain-fundamentals']
        }
    ];
    
    console.log('\n🎓 ÉTAT DES COURS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const courseStatus = [];
    COURSES.forEach(course => {
        const hasRequiredLevel = userProgress.level >= course.requiredLevel;
        const hasRequiredXP = (userProgress.xp || 0) >= course.requiredXP;
        const hasPrerequisites = course.requiredCourses.every(reqId => 
            userProgress.completedCourses.includes(reqId)
        );
        const isUnlocked = hasRequiredLevel && hasRequiredXP && hasPrerequisites;
        
        courseStatus.push({
            'Cours': course.title,
            'ID': course.id,
            'Statut': isUnlocked ? '🔓 Débloqué' : '🔒 Verrouillé',
            'Niveau': hasRequiredLevel ? `✅ ${course.requiredLevel}` : `❌ ${course.requiredLevel} (actuel: ${userProgress.level})`,
            'XP': hasRequiredXP ? `✅ ${course.requiredXP}` : `❌ ${course.requiredXP} (actuel: ${userProgress.xp})`,
            'Prérequis': hasPrerequisites ? '✅ OK' : '❌ Manquants'
        });
    });
    
    console.table(courseStatus);
    
    // Cours complétés
    console.log('\n✅ COURS COMPLÉTÉS:');
    if (userProgress.completedCourses.length === 0) {
        console.log('   Aucun cours complété');
    } else {
        userProgress.completedCourses.forEach(courseId => {
            const course = COURSES.find(c => c.id === courseId);
            console.log(`   ✓ ${course ? course.title : courseId}`);
        });
    }
    
    // Définir les fonctions de correction
    window.fixLevel = function() {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        const calculatedLevel = Math.floor(userProgress.xp / 100) + 1;
        userProgress.level = calculatedLevel;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        console.log(`✅ Niveau corrigé! Nouveau niveau: ${calculatedLevel}`);
        console.log('🔄 Rechargez la page pour voir les changements');
    };
    
    window.unlockAllCourses = function() {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        const allCourseIds = ['pi-intro-101', 'pi-wallet-101', 'safety-101', 'kyc-101', 'blockchain-fundamentals', 'defi-intro'];
        userProgress.completedCourses = allCourseIds;
        userProgress.level = 10;
        userProgress.xp = 2000;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        console.log('✅ Tous les cours débloqués!');
        console.log('🔄 Rechargez la page pour voir les changements');
    };
    
    window.addXP = function(amount) {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        userProgress.xp = (userProgress.xp || 0) + amount;
        userProgress.totalPoints = (userProgress.totalPoints || 0) + amount;
        userProgress.level = Math.floor(userProgress.xp / 100) + 1;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        console.log(`✅ ${amount} XP ajoutés! Total: ${userProgress.xp} XP, Niveau: ${userProgress.level}`);
        console.log('🔄 Rechargez la page pour voir les changements');
    };
    
    window.completeCourse = function(courseId) {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        if (!userProgress.completedCourses.includes(courseId)) {
            userProgress.completedCourses.push(courseId);
            localStorage.setItem('userProgress', JSON.stringify(userProgress));
            console.log(`✅ Cours "${courseId}" marqué comme complété!`);
            console.log('🔄 Rechargez la page pour voir les changements');
        } else {
            console.log(`⚠️  Le cours "${courseId}" est déjà complété`);
        }
    };
    
    window.resetProgress = function() {
        if (confirm('⚠️ ATTENTION: Cette action va réinitialiser TOUTE votre progression!\n\nÊtes-vous sûr?')) {
            localStorage.removeItem('userProgress');
            console.log('✅ Progression réinitialisée!');
            console.log('🔄 Rechargez la page pour recommencer');
        }
    };
    
    console.log('\n🛠️  FONCTIONS DISPONIBLES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('fixLevel()                    - Corriger le niveau basé sur les XP');
    console.log('addXP(amount)                 - Ajouter des XP (ex: addXP(500))');
    console.log('completeCourse("course-id")   - Marquer un cours comme complété');
    console.log('unlockAllCourses()            - Débloquer tous les cours (pour test)');
    console.log('resetProgress()               - Réinitialiser toute la progression');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n💡 EXEMPLES D\'UTILISATION:');
    console.log('   fixLevel()                              // Corriger le niveau');
    console.log('   addXP(500)                              // Ajouter 500 XP');
    console.log('   completeCourse("pi-intro-101")          // Compléter le cours intro');
    console.log('   unlockAllCourses()                      // Tout débloquer (DEBUG)');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Diagnostic terminé!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})();
