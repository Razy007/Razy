# ✅ CHECKLIST ANTI-RÉGRESSION (À NE JAMAIS VIOLER)

## 🔒 ARCHITECTURE

- [x] Un seul point d'hydratation (App.tsx ligne 203-287)
- [x] `isHydrated` flag obligatoire (bloque tout avant hydratation)
- [x] Aucun calcul métier avant hydratation (Loading screen ligne 1612)
- [x] Cleanup avec `cancelled` flag (unmount safety)

## 💾 DONNÉES

- [x] localStorage toujours chargé AVANT Firebase (ligne 214-225)
- [x] Firebase JAMAIS en parallèle (séquentiel strict)
- [x] Merge explicite via `mergeUserProgress()` (ligne 240)
- [x] MAX_PROGRESS_WINS strategy (HydrationManager.ts)
- [x] mergeQuizzes() anti-régression (meilleur score gagne)

## 🧪 UX

- [ ] F5 → aucune perte (TEST REQUIS)
- [ ] Navigation rapide → stable (TEST REQUIS)
- [ ] Offline → progression locale intacte (TEST REQUIS)
- [ ] Reconnexion → progression max conservée (TEST REQUIS)

## 🔥 INTERDICTIONS ABSOLUES

### ❌ JAMAIS FAIRE

```typescript
// ❌ INTERDIT
setUserProgress({ ...prev, ...remote }) // Overwrite brutal
```

```typescript
// ❌ INTERDIT
useEffect(() => {
  loadLocal();
  loadRemote(); // Parallèle = race condition
}, [user]);
```

```typescript
// ❌ INTERDIT
if (!isHydrated) {
  calculateXP(); // Calcul avant hydratation
}
```

```typescript
// ❌ INTERDIT
sessionStorage.setItem('userProgress', ...) // SessionStorage != source de vérité
```

### ✅ TOUJOURS FAIRE

```typescript
// ✅ CORRECT
const merged = mergeUserProgress(local, remote, 'MAX_PROGRESS_WINS');
setUserProgress(merged);
```

```typescript
// ✅ CORRECT
async function hydrate() {
  const local = await loadLocal();
  setUserProgress(local);
  
  const remote = await loadRemote(); // APRÈS
  const merged = merge(local, remote);
  setUserProgress(merged);
}
```

```typescript
// ✅ CORRECT
if (!isHydrated) {
  return <Loading />;
}
// Seulement ici: calculs métier
```

```typescript
// ✅ CORRECT
localStorage.setItem(`user_progress_${uid}`, JSON.stringify(progress));
```

## 📊 TESTS DE VALIDATION

### Test 1: Hydratation console logs
```
[HYDRATION] START - Production mode
[HYDRATION] ✅ Local loaded
[HYDRATION] ✅ Remote loaded
[MERGE] MAX_PROGRESS_WINS strategy
[MERGE] Local XP: 1200 | Remote XP: 800
[MERGE] ✅ Final XP: 1200 | Final Pi: 4.0
[HYDRATION] ✅ completed safely
```

### Test 2: Pas de perte XP
1. Gagner XP (quiz)
2. F5
3. Reconnexion
4. XP = MAX(local, remote) ✅

### Test 3: Navigation stable
1. Cours → Social → Profile
2. Pas de déconnexion
3. XP intact

### Test 4: Offline resilience
1. Mode avion
2. Faire quiz
3. Regagner connexion
4. Sync automatique
5. XP max conservé

## 🛡️ GARANTIES

- **Zero data loss** : Math.max() sur numeric
- **Zero regression** : UNION sur arrays  
- **Zero race conditions** : Séquentiel strict
- **Zero premature renders** : isHydrated lock

## 📝 COMMIT CHECKLIST

Avant chaque commit touchant `userProgress` :

- [ ] Code utilise `mergeUserProgress()` ?
- [ ] Pas d'overwrite `{...prev, ...remote}` ?
- [ ] Logs console détaillés ?
- [ ] Test manuel (F5 + navigation) ?
- [ ] `isHydrated` vérifié avant calculs ?

## 🚨 RED FLAGS

Si vous voyez ça dans un PR, **REJECT** :

```typescript
setUserProgress(remote.userProgress) // Overwrite total
sessionStorage.getItem('userProgress') // SessionStorage as source
const xp = calculateXP(!isHydrated) // Calcul avant hydration
Promise.all([loadLocal(), loadRemote()]) // Parallel = race
```

---

**Last updated**: 2026-01-09  
**Status**: ✅ PRODUCTION READY  
**Version**: 1.0 (Hydration Manager v1)
