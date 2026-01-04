# 🔑 MÉTHODE A : RESCUE MODE AVEC SSH KEYS HETZNER

# Guide Complet - Repartir à Zéro

## 🎯 OBJECTIF

Configurer SSH proprement pour accéder au VPS Pioneer Academy sans confusion ni conflit.

---

## ⏱️ TEMPS TOTAL : 20 MINUTES

```
1. Nettoyage (2 min)
2. Nouvelle clé SSH (1 min)
3. Configuration Hetzner (3 min)
4. Connexion Rescue SSH (1 min)
5. Installation sur serveur (8 min)
6. Test final (2 min)
```

---

## 📋 ÉTAPE 1 : NETTOYAGE COMPLET (2 min)

### Sur Windows (PowerShell) :

```powershell
# 1. Supprimer l'ancienne entrée known_hosts
ssh-keygen -R 77.42.75.58

# 2. Vérifier que c'est bien supprimé
type $env:USERPROFILE\.ssh\known_hosts | Select-String "77.42.75.58"
```

**Résultat attendu :** Aucune ligne ne devrait s'afficher

### Sur Hetzner (Optionnel) :

1. Allez sur : https://console.hetzner.cloud/
2. Votre projet → **SSH Keys** (menu gauche)
3. Supprimez les anciennes clés si vous en avez (optionnel)

**✅ RÉSULTAT : Configuration propre**

---

## 📋 ÉTAPE 2 : CRÉER UNE NOUVELLE CLÉ SSH (1 min)

### Sur Windows (PowerShell) :

```powershell
# Créer une nouvelle clé ED25519 SANS passphrase
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\hetzner_rescue" -C "hetzner-rescue-pioneer" -N ""
```

### Vérification :

```powershell
# Vérifier que les fichiers sont créés
dir $env:USERPROFILE\.ssh\hetzner_rescue*
```

**Résultat attendu :**

```
hetzner_rescue       (clé PRIVÉE - reste sur votre PC)
hetzner_rescue.pub   (clé PUBLIQUE - à envoyer à Hetzner)
```

### Afficher la clé publique :

```powershell
# Copier cette clé !
Get-Content "$env:USERPROFILE\.ssh\hetzner_rescue.pub"
```

**📋 COPIEZ TOUTE LA CLÉ PUBLIQUE** (commence par `ssh-ed25519`)

**✅ RÉSULTAT : Nouvelle paire de clés créée**

---

## 📋 ÉTAPE 3 : AJOUTER LA CLÉ DANS HETZNER (3 min)

### Interface Web Hetzner :

#### Option 3A : SSH Keys Global (RECOMMANDÉ)

1. **Hetzner Console** : https://console.hetzner.cloud/
2. Menu gauche → **SSH Keys**
3. Bouton **Add SSH Key** (en haut à droite)
4. Dans "SSH key" → **Coller la clé publique complète**
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... hetzner-rescue-pioneer
   ```
5. Dans "Name" → `hetzner-rescue-pioneer`
6. Cliquer **Add SSH Key**

**✅ La clé est maintenant enregistrée dans Hetzner**

#### Option 3B : Ajouter dans Rescue Mode

1. **Hetzner Console** : https://console.hetzner.cloud/
2. **Servers** → Votre serveur (77.42.75.58)
3. Onglet **Rescue**
4. Si le Rescue est déjà activé : **Disable rescue**
5. Cliquez **Enable rescue & power cycle**
6. **SSH Keys** → Sélectionnez `hetzner-rescue-pioneer`
   - OU cliquez "Add SSH Key" pour la coller directement
7. Cliquez **Enable rescue & power cycle**

**⚠️ PAS DE MOT DE PASSE AFFICHÉ** - C'est normal ! Vous utilisez la clé SSH.

8. **Attendez 1-2 minutes** (redémarrage du serveur)

**✅ RÉSULTAT : Rescue Mode activé avec votre clé SSH**

---

## 📋 ÉTAPE 4 : CONNEXION RESCUE AVEC CLÉ SSH (1 min)

### Sur Windows (PowerShell) :

```powershell
# Connexion en Rescue Mode avec votre clé privée
ssh -i "$env:USERPROFILE\.ssh\hetzner_rescue" root@77.42.75.58
```

### ⚠️ Première connexion :

```
The authenticity of host '77.42.75.58' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```

**Tapez : `yes`**

### ✅ Résultat attendu :

```
Welcome to the Hetzner Rescue System.

This Rescue System is based on Debian 12 (bookworm) with a custom
kernel. You can install software as in a normal system.

[...]

root@rescue ~ #
```

**🎉 AUCUN MOT DE PASSE DEMANDÉ ! Connexion directe avec SSH !**

**✅ RÉSULTAT : Vous êtes en mode Rescue !**

---

## 📋 ÉTAPE 5 : INSTALLER SSH SUR LE SERVEUR (8 min)

### 5.1 - Identifier le disque

```bash
lsblk
```

**Résultat attendu :**

```
NAME   TYPE   SIZE
sda    disk   40G
├─sda1 part   39G    ← Votre partition principale
└─sda15 part  1M
```

**📝 Notez le nom** (généralement `sda1` ou `nvme0n1p1`)

---

### 5.2 - Monter le disque

```bash
# Remplacez sda1 par VOTRE partition si différent
mount /dev/sda1 /mnt
```

**Vérifier :**

```bash
ls /mnt
```

**Résultat attendu :** `bin boot dev etc home lib ...`

---

### 5.3 - Créer le dossier SSH

```bash
mkdir -p /mnt/home/pioneer/.ssh
```

---

### 5.4 - Ajouter QUELLE clé SSH ?

**Ici, vous avez 2 OPTIONS :**

#### OPTION 1 : Utiliser la MÊME clé (hetzner_rescue) ✅ RECOMMANDÉ

**Avantage :** Une seule clé pour tout !

Sur Windows (PowerShell), afficher la clé publique :

```powershell
Get-Content "$env:USERPROFILE\.ssh\hetzner_rescue.pub"
```

**Copiez le résultat** puis dans le terminal Rescue :

```bash
# Remplacez VOTRE_CLÉ_PUBLIQUE par la clé copiée
echo "VOTRE_CLÉ_PUBLIQUE" > /mnt/home/pioneer/.ssh/authorized_keys
```

**Exemple complet :**

```bash
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAbc123... hetzner-rescue-pioneer" > /mnt/home/pioneer/.ssh/authorized_keys
```

#### OPTION 2 : Utiliser la clé existante

```bash
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com" > /mnt/home/pioneer/.ssh/authorized_keys
```

**💡 Je recommande OPTION 1** (même clé partout)

---

### 5.5 - Permissions

```bash
chmod 700 /mnt/home/pioneer/.ssh
chmod 600 /mnt/home/pioneer/.ssh/authorized_keys
chown -R 1000:1000 /mnt/home/pioneer/.ssh
```

---

### 5.6 - Vérifier

```bash
cat /mnt/home/pioneer/.ssh/authorized_keys
```

**Résultat attendu :** Votre clé SSH s'affiche

---

### 5.7 - DIAGNOSTIC (IMPORTANT !)

```bash
# Frontend
ls -la /mnt/var/www/pioneer-academy/frontend/

# Nginx
cat /mnt/etc/nginx/sites-available/pioneer-academy
```

**📤 COPIEZ LES 2 RÉSULTATS ET ENVOYEZ-LES MOI !**

---

### 5.8 - Quitter

```bash
exit
```

**✅ RÉSULTAT : Clé SSH installée + Diagnostic effectué**

---

## 📋 ÉTAPE 6 : DÉSACTIVER RESCUE ET TESTER (2 min)

### Sur Hetzner Console :

1. Servers → Votre serveur (77.42.75.58)
2. Onglet **Rescue**
3. Cliquez **Disable rescue & reboot**
4. **Attendez 1-2 minutes**

---

### Test SSH Normal :

#### Si vous avez utilisé la clé hetzner_rescue :

```powershell
ssh -i "$env:USERPROFILE\.ssh\hetzner_rescue" pioneer@77.42.75.58
```

#### Si vous avez utilisé la clé existante :

```powershell
ssh pioneer@77.42.75.58
```

### ✅ Résultat attendu :

```
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux ...)
[...]
pioneer@pioneer-academy:~$
```

**🎉 CONNEXION AUTO SANS MOT DE PASSE !**

**✅ RÉSULTAT : SSH FONCTIONNEL !**

---

## 📊 RÉCAPITULATIF

```
✅ Anciennes configurations nettoyées
✅ Nouvelle clé SSH créée (hetzner_rescue)
✅ Clé ajoutée dans Hetzner SSH Keys
✅ Connexion Rescue SANS mot de passe
✅ Clé SSH installée pour l'utilisateur pioneer
✅ Diagnostic effectué
✅ Connexion normale fonctionnelle
```

---

## 🎯 AVANTAGES DE CETTE MÉTHODE

✅ **Pas de mot de passe** à copier/coller  
✅ **Configuration réutilisable** (la clé reste dans Hetzner)  
✅ **Plus sécurisée** (authentification par clé uniquement)  
✅ **Plus rapide** pour les prochaines fois

---

## 🆘 PROBLÈMES POSSIBLES

### ❓ "ssh: Permission denied (publickey)"

**Cause :** La clé SSH n'est pas ajoutée dans Hetzner  
**Solution :**

1. Vérifiez dans Hetzner Console → SSH Keys
2. Vérifiez que la clé est bien sélectionnée dans Rescue Mode

---

### ❓ "ssh: Password:"

**Cause :** La clé SSH n'a pas été reconnue  
**Solutions :**

1. Vérifiez que vous utilisez la bonne clé : `-i "$env:USERPROFILE\.ssh\hetzner_rescue"`
2. Vérifiez les permissions de la clé privée (ne devrait pas être un problème sur Windows)

---

### ❓ "Host key verification failed"

**Cause :** Conflit avec une ancienne clé  
**Solution :**

```powershell
ssh-keygen -R 77.42.75.58
```

---

## 📞 APRÈS LE DIAGNOSTIC

Une fois SSH fonctionnel et les diagnostics envoyés :

1. ✅ J'analyserai le problème frontend/Nginx
2. ✅ Je vous donnerai les commandes de correction
3. ✅ Nous configurerons HTTPS avec Certbot
4. ✅ Le site sera en ligne : https://pioneeracademy.academy

---

## 🚀 TABLEAU DE BORD FINAL

| Étape            | Statut     | Temps      |
| ---------------- | ---------- | ---------- |
| Nettoyage        | ⏳ À faire | 2 min      |
| Nouvelle clé SSH | ⏳ À faire | 1 min      |
| Config Hetzner   | ⏳ À faire | 3 min      |
| Connexion Rescue | ⏳ À faire | 1 min      |
| Installation SSH | ⏳ À faire | 8 min      |
| Test final       | ⏳ À faire | 2 min      |
| **TOTAL**        |            | **17 min** |

---

## ✅ CHECKLIST

- [ ] ssh-keygen -R 77.42.75.58
- [ ] Nouvelle clé créée : hetzner_rescue
- [ ] Clé publique copiée
- [ ] Clé ajoutée dans Hetzner SSH Keys
- [ ] Rescue Mode activé avec la clé
- [ ] Connexion Rescue réussie (sans mot de passe)
- [ ] Disque monté : mount /dev/sda1 /mnt
- [ ] Clé SSH installée dans authorized_keys
- [ ] Permissions configurées
- [ ] Diagnostic frontend copié
- [ ] Diagnostic Nginx copié
- [ ] Rescue Mode désactivé
- [ ] Test SSH normal : ssh pioneer@... ✅
- [ ] Diagnostics envoyés à l'assistant

---

**🎉 C'EST PARTI ! Cette méthode est PROPRE et SANS RISQUE !**

**Commencez par l'ÉTAPE 1 maintenant ! 💪**
