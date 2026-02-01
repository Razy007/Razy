# 🔍 FIREBASE CONFIG - GUIDE VISUEL ULTRA-DÉTAILLÉ

## 📍 **MÉTHODE 1 : VIA APERÇU DU PROJET** (PLUS SIMPLE)

### **Étape 1 : Page d'Accueil Firebase**

Après avoir créé le projet "Academy of Pi", vous devriez voir :

```
┌─────────────────────────────────────────────────────┐
│  🔥 Academy of Pi                            ⚙️ 🔔  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  👋 Commencer par ajouter Firebase à votre app      │
│                                                      │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐               │
│  │ IOS │  │ AND │  │ WEB │  │Unity│               │
│  │ 🍎  │  │ 🤖  │  │ </>│  │ 🎮  │               │
│  └─────┘  └─────┘  └─────┘  └─────┘               │
│                                                      │
│           👆 CLIQUEZ ICI (WEB / </> )               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Étape 2 : Formulaire d'Enregistrement**

Après avoir cliqué sur `</>` (Web), vous voyez :

```
┌─────────────────────────────────────────────────────┐
│  Ajouter Firebase à votre application Web           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Pseudo de l'application                            │
│  ┌──────────────────────────────────────┐          │
│  │ Academy of Pi Web                    │          │
│  └──────────────────────────────────────┘          │
│                                                      │
│  ☑️ Configurer aussi Firebase Hosting                │
│      👆 DÉCOCHEZ CETTE CASE !                       │
│                                                      │
│  [ Enregistrer l'application ]   [Annuler]         │
│         👆 CLIQUEZ ICI                              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Étape 3 : Configuration Affichée**

Après "Enregistrer", vous voyez **LA CONFIG** :

```javascript
// Ajouter le SDK Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC...",               ← COPIER
  authDomain: "academy-of-pi-abc.firebaseapp.com",  ← COPIER
  projectId: "academy-of-pi-abc",     ← COPIER
  storageBucket: "academy-of-pi-abc.appspot.com",   ← COPIER
  messagingSenderId: "123456789",     ← COPIER
  appId: "1:123456789:web:abc..."     ← COPIER
};

[ Continuer vers la console ]
```

**📋 COPIER CES 6 VALEURS !**

---

## 📍 **MÉTHODE 2 : VIA PARAMÈTRES** (Si Méthode 1 pas visible)

### **Étape 1 : Trouver l'Icône Paramètres**

```
┌──────────────────────────────────────────────┐
│  🔥 Academy of Pi              ⚙️ 🔔 👤     │  ← CHERCHEZ ICI
│                                 👆                │
│                          CLIQUEZ SUR ⚙️          │
└──────────────────────────────────────────────┘
```

**Emplacement** : En haut à droite, à côté de la cloche 🔔

### **Étape 2 : Menu Déroulant**

Après avoir cliqué sur ⚙️, menu apparaît :

```
┌──────────────────────────────┐
│ ⚙️ Paramètres du projet      │ ← CLIQUEZ ICI
│ 👥 Utilisateurs et autoris.  │
│ 📊 Utilisation et facturat.  │
└──────────────────────────────┘
```

### **Étape 3 : Page Paramètres**

Vous êtes maintenant sur :

```
┌─────────────────────────────────────────────────────┐
│  Paramètres › Paramètres du projet                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Général] [Comptes de service] [Intégrations]     │
│                                                      │
│  📱 Vos applications                                 │
│                                                      │
│  Il n'y a aucune application dans votre projet      │
│                                                      │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐               │
│  │ IOS │  │ AND │  │ WEB │  │Unity│               │
│  │ 🍎  │  │ 🤖  │  │ </>│  │ 🎮  │               │
│  └─────┘  └─────┘  └─────┘  └─────┘               │
│                       👆                             │
│                  CLIQUEZ ICI                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Étape 4 : Suite identique Méthode 1**

Formulaire → Config → Copier les 6 valeurs

---

## 📍 **MÉTHODE 3 : SI VOUS AVEZ DÉJÀ UNE APP WEB CRÉÉE**

### **Étape 1 : Paramètres → Général**

```
┌─────────────────────────────────────────────────────┐
│  Paramètres › Paramètres du projet                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📱 Vos applications                                 │
│                                                      │
│  SDK Web                                            │
│  ┌──────────────────────────────────────────────┐  │
│  │ Academy of Pi Web                            │  │
│  │ ID de l'application: 1:123...                │  │
│  │                                               │  │
│  │ const firebaseConfig = {                     │  │
│  │   apiKey: "AIza...",                         │  │
│  │   authDomain: "...",                         │  │
│  │   ...                                         │  │
│  │ };                                            │  │
│  │                                               │  │
│  │ [📋 Copier]                                   │  │ ← CLIQUEZ
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Scroll vers le bas** jusqu'à voir le `firebaseConfig`

---

## 🎯 **VERSION SUPER SIMPLIFIÉE**

### **Si vous êtes perdu** :

1. **Regardez en BAS de la page** (scroll down)
2. **Cherchez** : "const firebaseConfig = {"
3. **Si c'est là** : Copier les valeurs
4. **Si ce n'est PAS là** : Cherchez icône `</>` (Web)
5. **Cliquez** dessus
6. **Pseudo** : Academy of Pi Web
7. **Décocher** Hosting
8. **Enregistrer**
9. **COPIER** la config qui apparaît

---

## 📸 **REPÈRES VISUELS À CHERCHER**

### **1. L'icône Web `</>`**
- Ressemble à : deux chevrons avec une barre oblique
- Couleur : généralement gris ou bleu
- Texte en dessous : "Web"

### **2. Le code JavaScript**
```javascript
const firebaseConfig = {  ← CHERCHEZ CETTE LIGNE
```

### **3. Les 6 valeurs à copier**
Tous commencent par :
- `apiKey: "AIza..."`
- `authDomain: "...firebaseapp.com"`
- `projectId: "academy-of-pi-..."`
- `storageBucket: "...appspot.com"`
- `messagingSenderId: "123..."`
- `appId: "1:123..."`

---

## 🆘 **SI TOUJOURS PERDU**

### **Option Alternative : Firebase CLI**

Si vous n'arrivez vraiment pas à trouver dans l'interface :

```powershell
# Installer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Obtenir config
firebase apps:sdkconfig web

# Copier la sortie
```

---

## 📞 **BESOIN D'AIDE ?**

**Dites-moi** :
1. Êtes-vous sur la page d'accueil du projet ?
2. Voyez-vous des icônes 🍎 🤖 </> 🎮 quelque part ?
3. Ou êtes-vous sur une autre page ?

**Je peux** :
- Vous donner des commandes CLI à la place
- Créer un guide avec images annotées
- Simplifier encore plus

---

**Où êtes-vous bloqué exactement ?** 🤔
