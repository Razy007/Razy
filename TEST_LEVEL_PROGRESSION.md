# 🧪 GUIDE DE TEST - Progression de Niveau

## 🎯 Objectif

Vérifier que le niveau se met maintenant à jour automatiquement quand vous gagnez des XP, quelle que soit la source (quiz, publications, commentaires, etc.).

---

## ⚡ INSTRUCTIONS DE TEST (5 minutes)

### Étape 1: Vérifier votre niveau actuel

1. Rafraîchissez l'application (**F5**)
2. Connectez-vous
3. **Notez votre niveau et XP actuels**
   - Exemple: Niveau 3, 250 XP, "50 XP pour niveau suivant"

### Étape 2: Tester avec une Publication

1. Allez dans l'onglet **"Social"**
2. Écrivez un message (ex: "Test de progression !")
3. Cliquez sur **"Publier"**
4. **✅ VERIFICATION**: Vous recevez +10 XP
5. **✅ NOUVELLE VERIFICATION**: Le niveau a-t-il changé si vous avez atteint le quota?

**Exemple**:

- Avant: Niveau 3, 290 XP (10 XP restants)
- Après publication: Niveau 4, 300 XP ✅

### Étape 3: Tester avec un Commentaire

1. Restez dans l'onglet **"Social"**
2. Ajoutez un commentaire à votre publication
3. **✅ VERIFICATION**: Vous recevez +5 XP
4. **✅ NOUVELLE VERIFICATION**: Le niveau se met à jour si nécessaire

###Étape 4: Tester avec un Quiz

1. Allez dans l'onglet **"Cours"**
2. Faites un quiz complet (3 questions)
3. **✅ VERIFICATION**: Vous recevez des XP (ex: +60 XP pour 2/3)
4. **✅ NOUVELLE VERIFICATION**: Le niveau se met à jour automatiquement

### Étape 5: Tester avec une Discovery Layer

1. Sélectionnez un cours avec une layer "Découverte"
2. Lisez le contenu et cliquez sur **"Terminer"**
3. **✅ VERIFICATION**: Vous recevez des XP (ex: +50 XP)
4. **✅ NOUVELLE VERIFICATION**: Le niveau se met à jour

---

## 🎯 RÉSULTATS ATTENDUS

### ✅ Fonctionnement Correct

**Scénario 1 - Passage de niveau via Quiz**:

```
Niveau 3, 250 XP → Quiz (+60 XP) → Niveau 4, 310 XP ✅
```

**Scénario 2 - Passage de niveau via Publications**:

```
Niveau 3, 295 XP → Publication (+10 XP) → Niveau 4, 305 XP ✅
```

**Scénario 3 - Accumulation progressive**:

```
Niveau 3, 250 XP
→ Commentaire (+5 XP) → Niveau 3, 255 XP ✅
→ Commentaire (+5 XP) → Niveau 3, 260 XP ✅
→ Publication (+10 XP) → Niveau 3, 270 XP ✅
→ Quiz (+60 XP) → Niveau 4, 330 XP ✅
```

**Scénario 4 - Multi-niveaux**:

```
Niveau 3, 280 XP
→ Quiz parfait (+100 XP) → Niveau 4, 380 XP ✅
(saute directement au niveau 4, pas besoin de s'arrêter à chaque palier)
```

### ❌ Si ça ne fonctionne pas

Si le niveau reste bloqué :

1. **Ouvrez la console** (F12)
2. **Cherchez des erreurs** en rouge
3. **Partagez les erreurs** dans votre demande de support

---

## 📊 VÉRIFICATIONS VISUELLES

### Barre de progression XP

Avant le fix:

- ❌ La barre pouvait dépasser 100% sans changer de niveau

Après le fix:

- ✅ La barre se réinitialise automatiquement quand vous montez de niveau

### Badge de Niveau

Avant le fix:

- ❌ Le badge restait bloqué (ex: "Niveau 3" même avec 500 XP)

Après le fix:

- ✅ Le badge se met à jour instantanément (ex: "Niveau 5" avec 500 XP)

### Déblocage de Cours

Avant le fix:

- ❌ Les cours nécessitant un niveau supérieur restaient verrouillés

Après le fix:

- ✅ Les cours se débloquent automatiquement quand vous atteignez le niveau requis

---

## 🎓 DÉBLOCAGE DE COURS

### Test de déblocage

1. **Notez les cours verrouillés** (icône cadenas 🔒)
2. **Gagnez des XP jusqu'au niveau requis**
   - Cours "Pi Wallet Mastery" nécessite Niveau 2
   - Cours "Anti-Scam Defense" nécessite Niveau 3
   - Cours "KYC Process" nécessite Niveau 4
3. **✅ VERIFICATION**: Les cours se débloquent automatiquement !

**Exemple**:

```
Niveau 3 → "KYC Process" est verrouillé 🔒
Fait un quiz → Passe Niveau 4
→ "KYC Process" est maintenant accessible ! ✅
```

---

## ✅ CRITÈRES DE SUCCÈS

Le fix est validé si:

- [x] Le niveau augmente quand vous terminez un quiz
- [x] Le niveau augmente quand vous publiez un post
- [x] Le niveau augmente quand vous commentez
- [x] Le niveau augmente quand vous terminez une discovery layer
- [x] Le badge de niveau s'actualise instantanément
- [x] La barre XP se réinitialise à chaque niveau
- [x] Les cours se débloquent automatiquement
- [x] Vous pouvez progresser librement dans l'application

---

## 🐛 CAS PARTICULIER - XP Important

**Question**: Que se passe-t-il si je gagne beaucoup d'XP d'un coup ?

**Réponse**: Le système calcule automatiquement votre nouveau niveau !

**Exemple**:

```
Niveau 3, 250 XP (50 XP restants pour niveau 4)
→ Quiz difficile avec bonus premium → +200 XP
→ Nouveau total: 450 XP
→ Niveau calculé: Math.floor(450/100) + 1 = 5 ✅
→ Vous montez directement au Niveau 5 !
```

---

## 📝 FORMULE DE CALCUL

La formule utilisée est:

```typescript
Niveau = Math.floor(XP Total / 100) + 1
XP Restants = (Niveau * 100) - XP Total
```

**Exemples**:

- 0-99 XP → Niveau 1
- 100-199 XP → Niveau 2
- 200-299 XP → Niveau 3
- 300-399 XP → Niveau 4
- 1000-1099 XP → Niveau 11

---

## 🎉 RÉSULTAT FINAL

**AVANT le fix** ❌:

> "J'ai 400 XP mais je suis toujours bloqué au niveau 3, je ne peux pas débloquer les cours suivants, c'est frustrant !"

**APRÈS le fix** ✅:

> "Génial ! À chaque fois que je gagne des XP, mon niveau monte automatiquement et de nouveaux cours se débloquent. La progression est fluide !"

---

**Testez maintenant et profitez d'une progression sans limites !** 🚀🎓✨
