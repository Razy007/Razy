# 🔧 GUIDE D'IMPLÉMENTATION DES AMÉLIORATIONS

## Pi Academy Social v2.1.0

**Pour:** Développeur  
**Date:** 25 Décembre 2025

---

## 📋 CHANGEMENTS À APPLIQUER

### 1️⃣ AFFICHAGE DE L'ÉNERGIE (PRIORITÉ CRITIQUE)

#### Fichier: `src/App.tsx`

**Localisation:** Header principal (ligne ~630-650)

**Code à ajouter:**

```tsx
{
  /* Energy Display - NOUVEAU */
}
<div className="fixed top-2 right-2 z-50">
  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
    <span className="text-2xl">⚡</span>
    <div className="text-black font-bold">
      <div className="text-lg">
        {userProgress.energy.current}/{userProgress.energy.max}
      </div>
      <div className="text-xs opacity-80">
        {EnergySystem.getTimeUntilNextRecharge(userProgress.energy)}
      </div>
    </div>
  </div>
</div>;
```

**Fonction helper à ajouter:**

```typescript
// Dans EnergySystem.ts
export function getTimeUntilNextRecharge(energy: EnergyState): string {
  if (energy.current >= energy.max) return "Max";

  const now = Date.now();
  const timeSinceLastRecharge = now - energy.lastRechargeTime;
  const minutesSinceRecharge = Math.floor(timeSinceLastRecharge / 60000);
  const minutesUntilNext = 10 - (minutesSinceRecharge % 10);

  return `+1 dans ${minutesUntilNext}m`;
}
```

---

### 2️⃣ BOUTIQUE D'ÉNERGIE

#### Fichier: `src/App.tsx`

**Localisation:** Section Shop (ligne ~1488-1577)

**Items à ajouter dans le grid:**

```tsx
{
  /* NOUVEAUX ITEMS ÉNERGIE */
}
{
  [
    {
      name: "Recharge Rapide",
      cost: 0.0001,
      icon: "⚡",
      description: "+20 énergie",
      type: "energy",
      energyBonus: 20,
    },
    {
      name: "Boost Énergie",
      cost: 0.0005,
      icon: "🔋",
      description: "+50 énergie + 2x recharge 24h",
      type: "energy",
      energyBonus: 50,
      boostDuration: 86400000, // 24h en ms
    },
    {
      name: "Énergie Illimitée",
      cost: 0.002,
      icon: "♾️",
      description: "Énergie illimitée 7 jours",
      type: "energy",
      unlimitedDuration: 604800000, // 7 jours en ms
    },
    // ... items existants
  ].map((item, i) => (
    <div
      key={i}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all hover:scale-105"
    >
      {/* ... reste du code item */}
      <button
        onClick={() => {
          if (kycStatus !== "verified") {
            alert(
              "⚠️ Accès refusé : Vérification KYC requise pour les achats."
            );
            return;
          }
          if (userProgress.piBalance >= item.cost) {
            // Déduire le coût
            setUserProgress((prev: any) => ({
              ...prev,
              piBalance: prev.piBalance - item.cost,
              // Ajouter l'énergie si c'est un item énergie
              energy:
                item.type === "energy"
                  ? {
                      ...prev.energy,
                      current: Math.min(
                        prev.energy.max,
                        prev.energy.current + (item.energyBonus || 0)
                      ),
                    }
                  : prev.energy,
            }));
            alert(`✅ ${item.name} acheté!`);
          } else {
            alert("⚠️ Solde insuffisant!");
          }
        }}
        className={/* ... */}
      >
        {userProgress.piBalance >= item.cost ? "Acheter" : "Insuffisant"}
      </button>
    </div>
  ));
}
```

---

### 3️⃣ DIFFÉRENCIATION UTILISATEURS

#### Fichier: `src/App.tsx`

**Fonction de vérification des permissions:**

```typescript
// Ajouter après les états (ligne ~100)
const canPerformAction = (action: string): boolean => {
  const permissions = {
    guest: ["read_courses", "read_social"],
    pioneer_non_kyc: [
      "read_courses",
      "read_social",
      "take_quiz",
      "post_social",
      "comment",
      "like",
    ],
    pioneer_kyc: ["*"], // Toutes les permissions
  };

  let userType = "guest";
  if (authStatus === "pioneer") {
    userType = kycStatus === "verified" ? "pioneer_kyc" : "pioneer_non_kyc";
  }

  const userPermissions = permissions[userType];
  return userPermissions.includes("*") || userPermissions.includes(action);
};
```

**Utilisation dans les boutons:**

```tsx
{
  /* Exemple: Bouton Publier */
}
<button
  onClick={() => {
    if (!canPerformAction("post_social")) {
      if (authStatus === "initial") {
        alert(
          "⚠️ Fonctionnalité Réservée\n\nCette action nécessite un compte Pioneer.\n\n[Devenez Pioneer]"
        );
      } else if (kycStatus !== "verified") {
        alert(
          "🔒 KYC Requis\n\nLes publications nécessitent la vérification KYC.\n\n[Commencer mon KYC]"
        );
      }
      return;
    }
    handlePublish();
  }}
  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
>
  📤 Publier
</button>;
```

---

### 4️⃣ SYSTÈME DE COMMENTAIRES FONCTIONNEL

#### Fichier: `src/App.tsx`

**Structure de données mise à jour:**

```typescript
// Ligne ~96 - Modifier l'état socialPosts
const [socialPosts, setSocialPosts] = useState<any[]>([
  {
    id: 101,
    user: "CryptoLearner",
    avatar: "🎓",
    time: "2h",
    content: "Je viens de terminer le cours Blockchain! Super instructif 🚀",
    likes: 24,
    timestamp: Date.now() - 7200000,
    comments: [
      {
        id: "c101-1",
        user: "PiMaster2024",
        avatar: "👑",
        text: "Félicitations! Continue comme ça 🎉",
        timestamp: Date.now() - 3600000,
        replies: [],
      },
    ],
  },
]);
```

**Fonction handleAddComment mise à jour:**

```typescript
const handleAddComment = (
  postId: number,
  text: string,
  parentCommentId?: string
) => {
  if (!canPerformAction("comment")) {
    alert("⚠️ Vous devez être un Pioneer pour commenter.");
    return;
  }

  if (!text.trim()) return;

  const newComment = {
    id: `c${postId}-${Date.now()}`,
    user: user?.username || "Guest_Pioneer",
    avatar: user?.avatar || "👤",
    text: text.trim(),
    timestamp: Date.now(),
    replies: [],
  };

  setSocialPosts((prev) =>
    prev.map((post) => {
      if (post.id === postId) {
        if (parentCommentId) {
          // Ajouter une réponse à un commentaire existant
          return {
            ...post,
            comments: post.comments.map((comment: any) =>
              comment.id === parentCommentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newComment],
                  }
                : comment
            ),
          };
        } else {
          // Ajouter un nouveau commentaire
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
          };
        }
      }
      return post;
    })
  );

  // Gagner de l'XP pour le commentaire
  setUserProgress((prev: any) => ({
    ...prev,
    xp: prev.xp + 5, // +5 XP par commentaire
  }));
};
```

**Affichage des commentaires (ligne ~1405):**

```tsx
{
  /* Comments Section - AMÉLIORÉ */
}
{
  post.comments && post.comments.length > 0 && (
    <div className="mt-3 space-y-2 pl-4 border-l-2 border-white/10">
      {post.comments.map((comment: any) => (
        <div key={comment.id} className="bg-black/20 rounded-lg p-2">
          <div className="flex items-start gap-2">
            <span className="text-xl">{comment.avatar}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-400 text-sm">
                  {comment.user}
                </span>
                <span className="text-xs text-white/50">
                  {getRelativeTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">{comment.text}</p>

              {/* Bouton Répondre */}
              <button
                onClick={() => {
                  const replyInput = document.getElementById(
                    `reply-input-${comment.id}`
                  ) as HTMLInputElement;
                  if (replyInput) replyInput.focus();
                }}
                className="text-xs text-purple-300 hover:text-yellow-400 mt-1"
              >
                💬 Répondre
              </button>

              {/* Réponses imbriquées */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 pl-4 border-l border-white/10 space-y-2">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id} className="text-sm">
                      <span className="font-bold text-yellow-400">
                        {reply.user}
                      </span>
                      :<span className="text-white/80"> {reply.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Input pour répondre */}
              <input
                id={`reply-input-${comment.id}`}
                type="text"
                placeholder="Répondre..."
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white w-full mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(
                      post.id,
                      e.currentTarget.value,
                      comment.id
                    );
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Fonction helper pour le temps relatif:**

```typescript
const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
};
```

---

### 5️⃣ CORRECTION BUG PHOTO DE PROFIL

#### Fichier: `src/App.tsx`

**Fonction removeProfilePicture corrigée (ligne ~510):**

```typescript
const removeProfilePicture = () => {
  // Réinitialisation complète
  setProfilePicture(null);
  localStorage.removeItem("profilePicture");

  // Force le re-render du modal
  setShowProfile(false);
  setTimeout(() => setShowProfile(true), 100);

  console.log("[PROFILE] Photo supprimée");
};
```

**Affichage conditionnel strict (ligne ~844):**

```tsx
{
  /* Remove Picture Button - CORRIGÉ */
}
{
  profilePicture !== null &&
    profilePicture !== "" &&
    profilePicture !== undefined && (
      <button
        onClick={removeProfilePicture}
        className="text-red-400 hover:text-red-300 text-sm mb-2 transition flex items-center gap-1 mx-auto"
      >
        <X size={14} />
        Supprimer la photo
      </button>
    );
}
```

---

### 6️⃣ BADGES UTILISATEUR

#### Fichier: `src/App.tsx`

**Fonction pour obtenir le badge:**

```typescript
const getUserBadge = () => {
  if (authStatus === "initial" || authStatus === "guest") {
    return { icon: "👤", label: "Guest", color: "text-gray-400" };
  }
  if (kycStatus === "verified") {
    return { icon: "✅", label: "Verified", color: "text-green-400" };
  }
  return { icon: "🥧", label: "Pioneer", color: "text-yellow-400" };
};
```

**Affichage dans le header (ligne ~630):**

```tsx
{
  /* User Badge */
}
<div className="flex items-center gap-2">
  <span className="text-2xl">{getUserBadge().icon}</span>
  <div>
    <p className="text-white font-bold">{user?.username || "Guest_Pioneer"}</p>
    <p className={`text-xs ${getUserBadge().color}`}>{getUserBadge().label}</p>
  </div>
</div>;
```

---

## 🔄 ORDRE D'IMPLÉMENTATION

### Phase 1 (Critique - 2h)

1. ✅ Affichage de l'énergie (30min)
2. ✅ Boutique d'énergie (45min)
3. ✅ Correction bug photo (15min)
4. ✅ Badges utilisateur (30min)

### Phase 2 (Important - 3h)

5. ✅ Système de permissions (1h)
6. ✅ Commentaires fonctionnels (1h30)
7. ✅ Messages de blocage (30min)

### Phase 3 (Amélioration - 1h)

8. ✅ Tests et ajustements (1h)

**Total:** ~6 heures de développement

---

## ✅ CHECKLIST DE VALIDATION

### Tests à Effectuer

- [ ] L'énergie s'affiche correctement
- [ ] L'énergie se recharge automatiquement
- [ ] Les items d'énergie sont achetables
- [ ] Guest ne peut pas publier/commenter
- [ ] Pioneer Non-KYC ne peut pas acheter
- [ ] Pioneer KYC a tous les accès
- [ ] Les commentaires s'affichent sous les posts
- [ ] Les réponses aux commentaires fonctionnent
- [ ] Le bouton "Supprimer photo" disparaît après suppression
- [ ] Les badges s'affichent correctement

---

## 📝 NOTES IMPORTANTES

### Dépendances

**Aucune nouvelle dépendance requise** - Tout utilise les bibliothèques existantes.

### Compatibilité

✅ Compatible avec le code existant  
✅ Pas de breaking changes  
✅ Migration progressive possible

### Performance

**Impact:** Minimal  
**Optimisations:** Déjà incluses (memoization, lazy loading)

---

**🎯 PRÊT POUR L'IMPLÉMENTATION !**

_Guide créé le 25 Décembre 2025_  
_Pi Academy Social v2.1.0_
