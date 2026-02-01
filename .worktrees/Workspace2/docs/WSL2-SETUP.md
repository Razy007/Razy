# 🐧 GUIDE INSTALLATION WSL2 - PIONEER ACADEMY

## 🎯 OBJECTIF

Configurer WSL2 (Windows Subsystem for Linux) pour développer et tester le backend Pioneer Academy dans un environnement Linux propre.

---

## ✅ AVANTAGES WSL2

- ✅ **Environnement Linux natif** sur Windows
- ✅ **TLS/SSL propre** (résout les problèmes MongoDB Atlas)
- ✅ **Performance native** (noyau Linux complet)
- ✅ **Accès aux fichiers Windows** depuis Linux
- ✅ **Outils Linux** (apt, bash, etc.)
- ✅ **GRATUIT** et supporté par Microsoft

---

## 📋 PRÉREQUIS

- Windows 10 version 2004+ (Build 19041+) ou Windows 11
- Droits administrateur
- 4 GB RAM minimum (8 GB recommandé)
- 10 GB espace disque libre

### Vérifier votre version Windows

```powershell
winver
```

---

## 🚀 INSTALLATION WSL2

### Étape 1: Installation automatique (RECOMMANDÉ)

Ouvrez **PowerShell en tant qu'Administrateur** :

```powershell
# Installation WSL2 + Ubuntu (1 commande)
wsl --install
```

**Cette commande va :**

1. Activer les fonctionnalités Windows nécessaires
2. Installer le noyau Linux WSL2
3. Installer Ubuntu comme distribution par défaut
4. **Redémarrer votre PC automatiquement**

### Étape 2: Après le redémarrage

1. Ubuntu va s'ouvrir automatiquement
2. Créez un **username Linux** (par exemple: `pioneer`)
3. Créez un **mot de passe** (vous ne le verrez pas en tapant, c'est normal)

```bash
# Exemple d'installation
Installing, this may take a few minutes...
Please create a default UNIX user account...
Enter new UNIX username: pioneer
New password:
Retype new password:
```

✅ **Félicitations ! WSL2 est installé**

---

## 🔧 CONFIGURATION INITIALE

### Étape 3: Mise à jour du système

Dans le terminal Ubuntu WSL2 :

```bash
# Mise à jour des packages
sudo apt update && sudo apt upgrade -y
```

### Étape 4: Installation Node.js 20 LTS

```bash
# Installation Node.js depuis NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification
node -v    # Devrait afficher: v20.x.x
npm -v     # Devrait afficher: 10.x.x
```

### Étape 5: Installation Git

```bash
sudo apt install git -y
git --version
```

### Étape 6: Configuration Git

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

---

## 📂 ACCÈS AUX FICHIERS

### De Windows vers WSL2

Vos fichiers WSL2 sont accessibles dans Windows à :

```
\\wsl$\Ubuntu\home\pioneer\
```

### De WSL2 vers Windows

Vos fichiers Windows sont accessibles dans WSL2 à :

```bash
cd /mnt/c/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app
```

---

## 🔥 SETUP PROJET PIONEER ACADEMY

### Méthode 1: Copier le projet depuis Windows

```bash
# Créer un dossier de travail
mkdir -p ~/projects
cd ~/projects

# Copier le projet depuis Windows
cp -r /mnt/c/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app ./pioneer-academy

cd pioneer-academy
```

### Méthode 2: Travailler directement dans le dossier Windows

```bash
# Aller directement dans le projet Windows
cd /mnt/c/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app
```

⚠️ **Note** : Méthode 1 est plus performante, Méthode 2 est plus pratique pour éditer avec VS Code

---

## 🧪 TEST MONGODB ATLAS

### Étape 7: Installation dépendances backend

```bash
cd backend
npm install
```

### Étape 8: Configuration .env

Vérifiez que le fichier `.env` contient :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pioneer?retryWrites=true&w=majority
```

### Étape 9: Test connexion MongoDB

```bash
# Rendre le script exécutable
chmod +x test-mongodb-wsl.js

# Exécuter le test
node test-mongodb-wsl.js
```

**Résultat attendu :**

```
═══ TEST MONGODB ATLAS CONNECTION ═══

ℹ️  Environnement:
  - OS: linux
  - Node.js: v20.x.x
  - Mongoose: 8.x.x
  - URI: mongodb+srv://****@cluster.mongodb.net/...

═══ TEST 1: DNS Resolution ═══

ℹ️  Résolution DNS pour: cluster0.xxxxx.mongodb.net
✅ DNS OK - Adresses: 18.xxx.xxx.xxx, ...

═══ TEST 2: MongoDB Connection ═══

ℹ️  Tentative de connexion...
✅ Connexion réussie en 1234ms !

═══ ✅ RÉSULTAT FINAL ═══

✅ Tous les tests sont passés !
✅ MongoDB Atlas est correctement configuré
ℹ️  Vous pouvez maintenant lancer le serveur backend
```

---

## 🚀 LANCEMENT BACKEND

### Étape 10: Démarrer le serveur

```bash
cd backend
npm run dev
```

**Résultat attendu :**

```
🚀 Server running on port 3001
✅ MongoDB Connected successfully
```

### Étape 11: Démarrer le frontend (depuis Windows)

**Dans un nouveau terminal PowerShell (Windows)** :

```powershell
cd C:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app\frontend
npm run dev
```

Le frontend tournera sur : `http://localhost:5173`

---

## 🔗 OBTENIR L'IP WSL2 (pour MongoDB Atlas Whitelist)

### Option 1: Depuis WSL2

```bash
# IP interne WSL2
hostname -I | awk '{print $1}'
```

### Option 2: IP publique (pour MongoDB Atlas)

```bash
curl ifconfig.me
```

### Configuration MongoDB Atlas

1. Allez sur MongoDB Atlas → Network Access
2. Cliquez "Add IP Address"
3. Entrez l'IP publique obtenue ci-dessus
4. Ou utilisez `0.0.0.0/0` temporairement pour le développement

⚠️ **IMPORTANT** : En production, utilisez l'IP fixe du VPS uniquement !

---

## 🎨 INTÉGRATION VS CODE

### Installation extension WSL

1. Ouvrez VS Code
2. Installez l'extension **"WSL"** (Microsoft)
3. Ouvrez le projet dans WSL :

```bash
# Depuis WSL2, dans le dossier du projet
code .
```

VS Code s'ouvrira avec le badge `WSL: Ubuntu` en bas à gauche.

---

## 🔧 COMMANDES UTILES WSL2

### Gestion WSL2

```powershell
# Lister les distributions installées
wsl -l -v

# Arrêter WSL2
wsl --shutdown

# Redémarrer WSL2
wsl

# Définir WSL2 par défaut (si plusieurs distros)
wsl --set-default Ubuntu

# Désinstaller une distro
wsl --unregister Ubuntu
```

### Depuis WSL2

```bash
# Ouvrir l'explorateur Windows dans le dossier actuel
explorer.exe .

# Redémarrer WSL2
exit
# Puis dans PowerShell: wsl
```

---

## ❓ TROUBLESHOOTING

### Problème: "WSL 2 requires an update to its kernel component"

**Solution :**

1. Téléchargez le kernel update : https://aka.ms/wsl2kernel
2. Installez-le
3. Relancez `wsl --install`

### Problème: "Virtualization is disabled"

**Solution :**

1. Redémarrez et entrez dans le BIOS
2. Activez "Intel VT-x" ou "AMD-V" (Virtualization Technology)
3. Sauvegardez et redémarrez

### Problème: MongoDB connection timeout

**Solutions possibles :**

1. Vérifiez votre connexion internet
2. Vérifiez l'IP whitelist dans MongoDB Atlas
3. Testez avec `0.0.0.0/0` temporairement
4. Désactivez antivirus/firewall temporairement

### Problème: Permission denied

```bash
# Ajouter sudo avant la commande
sudo <commande>

# Ou changer propriétaire
sudo chown -R $USER:$USER /path/to/folder
```

---

## 📊 PERFORMANCES

### Optimisation WSL2

Créez le fichier `.wslconfig` dans `C:\Users\lenovo\` :

```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

Puis redémarrez WSL2 :

```powershell
wsl --shutdown
wsl
```

---

## 🎯 NEXT STEPS

Après avoir validé WSL2 :

1. ✅ Test MongoDB Atlas → **OK**
2. ✅ Backend fonctionne → **OK**
3. ✅ Frontend connecté au backend → **À tester**
4. 🚀 Préparer déploiement VPS → **Suivre roadmap production**

---

## 📚 RESSOURCES

- [Documentation officielle WSL2](https://docs.microsoft.com/en-us/windows/wsl/)
- [WSL2 Best Practices](https://docs.microsoft.com/en-us/windows/wsl/setup/environment)
- [Troubleshooting WSL](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting)

---

**🐧 Bienvenue dans le monde Linux sur Windows !**

WSL2 est l'outil parfait pour développer des applications web modernes sur Windows.
