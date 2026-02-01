# 🆘 GUIDE ULTRA-SIMPLE : RESCUE MODE HETZNER

## 📌 SITUATION ACTUELLE

Vous ne pouvez PAS vous connecter en SSH car :

- ❌ Le mot de passe root ne fonctionne pas
- ❌ Les clés SSH ne sont pas configurées
- ❌ Le serveur bloque les connexions

**✅ SOLUTION : MODE RESCUE (Redémarrage spécial avec accès root garanti)**

---

## 🎯 RÉSUMÉ EN 3 ÉTAPES

```
1️⃣  HETZNER WEB → Activer Rescue Mode → Copier mot de passe
2️⃣  POWERSHELL → ssh root@77.42.75.58 → Coller mot de passe Rescue
3️⃣  COPIER/COLLER → Les commandes du fichier rescue-commands.txt
```

**⏱️ Temps total : 10 minutes**

---

## 📋 ÉTAPE 1 : ACTIVER RESCUE MODE (Interface Web Hetzner)

### ⚠️ CETTE ÉTAPE EST OBLIGATOIRE ! Je ne peux pas la faire pour vous.

### Actions à faire :

1. **Ouvrez votre navigateur**
   - URL : https://console.hetzner.cloud/
2. **Connectez-vous** à votre compte Hetzner

3. **Naviguez vers votre serveur :**

   ```
   Menu gauche → "Servers"
   → Cliquez sur le serveur avec IP 77.42.75.58
   ```

4. **Allez dans l'onglet Rescue :**

   ```
   En haut de la page : Graphs | Console | Rescue | ...
   → Cliquez sur "Rescue"
   ```

5. **Activez le Rescue Mode :**

   ```
   Bouton rouge : "Enable rescue & power cycle"
   → Cliquez dessus
   ```

6. **⚠️ UNE FENÊTRE POP-UP S'OUVRE IMMÉDIATEMENT**

   ```
   Titre : "Rescue Mode enabled"
   Contenu :

   Root password for rescue system:
   [mot de passe aléatoire - ex: XyZ123AbC!]

   📋 COPIEZ CE MOT DE PASSE !
   ```

7. **ATTENDEZ 1 MINUTE**
   - Le serveur redémarre automatiquement en mode Rescue
   - Status : "Running" → "Rebooting" → "Running"

### ✅ Résultat attendu :

- Vous avez un mot de passe Rescue (copié dans le presse-papiers)
- Le serveur est marqué avec un badge "Rescue" dans Hetzner Console

---

## 📋 ÉTAPE 2 : CONNEXION SSH EN MODE RESCUE

### Dans PowerShell (Windows) :

```powershell
ssh root@77.42.75.58
```

### Réponse attendue :

```
The authenticity of host '77.42.75.58 (77.42.75.58)' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

**Tapez : `yes`** puis **Entrée**

### Ensuite :

```
root@77.42.75.58's password:
```

**Collez le MOT DE PASSE RESCUE** (Ctrl+V ou clic droit) puis **Entrée**

⚠️ **IMPORTANT : Le mot de passe ne s'affiche PAS à l'écran - c'est NORMAL !**

### ✅ Résultat attendu :

```
Welcome to the Hetzner Rescue System.

This Rescue System is based on Debian 12 (bookworm) with a custom
kernel. You can install software as in a normal system.

[...]

root@rescue ~ #
```

**🎉 FÉLICITATIONS ! Vous êtes en mode Rescue !**

---

## 📋 ÉTAPE 3 : CONFIGURATION SSH (Copier/Coller)

### ⚠️ ATTENTION : Exécutez ces commandes UNE PAR UNE

Ouvrez le fichier `rescue-commands.txt` et copiez/collez chaque commande :

### 3.1 - Identifier votre disque :

```bash
lsblk
```

**Résultat attendu :**

```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   40G  0 disk
├─sda1   8:1    0   39G  0 part          ← VOTRE DISQUE
└─sda15  8:15   0    1M  0 part
```

**📝 Notez le nom de la partition principale** (généralement `sda1` ou `nvme0n1p1`)

---

### 3.2 - Monter le disque :

```bash
# REMPLACEZ sda1 par VOTRE disque si différent !
mount /dev/sda1 /mnt
```

**Vérifiez :**

```bash
ls /mnt
```

**Résultat attendu :** `bin  boot  dev  etc  home  lib  ...`

---

### 3.3 - Créer le dossier SSH :

```bash
mkdir -p /mnt/home/pioneer/.ssh
```

---

### 3.4 - Ajouter votre clé SSH :

```bash
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com" > /mnt/home/pioneer/.ssh/authorized_keys
```

---

### 3.5 - Configurer les permissions :

```bash
chmod 700 /mnt/home/pioneer/.ssh
chmod 600 /mnt/home/pioneer/.ssh/authorized_keys
chown -R 1000:1000 /mnt/home/pioneer/.ssh
```

---

### 3.6 - Vérifier la clé SSH :

```bash
cat /mnt/home/pioneer/.ssh/authorized_keys
```

**Résultat attendu :** Votre clé SSH s'affiche

---

### 3.7 - 🔍 DIAGNOSTIC FRONTEND (IMPORTANT !) :

```bash
ls -la /mnt/var/www/pioneer-academy/frontend/
```

**📋 COPIEZ LE RÉSULTAT** et envoyez-le moi !

---

### 3.8 - 🔍 DIAGNOSTIC NGINX (IMPORTANT !) :

```bash
cat /mnt/etc/nginx/sites-available/pioneer-academy
```

**📋 COPIEZ LE RÉSULTAT** et envoyez-le moi !

---

### 3.9 - Quitter le mode Rescue :

```bash
exit
```

---

## 📋 ÉTAPE 4 : DÉSACTIVER RESCUE MODE

### Retournez dans Hetzner Cloud Console :

1. **Servers** → Votre serveur (77.42.75.58)
2. **Onglet "Rescue"**
3. **Bouton "Disable rescue & reboot"**
4. **Attendez 1 minute** (le serveur redémarre normalement)

---

## 📋 ÉTAPE 5 : TEST SSH NORMAL

### Dans PowerShell :

```powershell
ssh pioneer@77.42.75.58
```

### ✅ Résultat attendu :

**Connexion automatique SANS mot de passe !**

```
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)
[...]
pioneer@pioneer-academy:~$
```

**🎉 SUCCÈS ! Vous êtes connecté !**

---

## 📊 CHECKLIST COMPLÈTE

- [ ] 1. Ouvrir https://console.hetzner.cloud/
- [ ] 2. Servers → Mon serveur → Rescue → Enable rescue & power cycle
- [ ] 3. Copier le mot de passe Rescue
- [ ] 4. Attendre 1 minute (redémarrage)
- [ ] 5. PowerShell : `ssh root@77.42.75.58`
- [ ] 6. Coller le mot de passe Rescue
- [ ] 7. Commande : `lsblk`
- [ ] 8. Commande : `mount /dev/sda1 /mnt`
- [ ] 9. Commande : `mkdir -p /mnt/home/pioneer/.ssh`
- [ ] 10. Commande : Ajouter clé SSH (echo)
- [ ] 11. Commande : `chmod 700 /mnt/home/pioneer/.ssh`
- [ ] 12. Commande : `chmod 600 /mnt/home/pioneer/.ssh/authorized_keys`
- [ ] 13. Commande : `chown -R 1000:1000 /mnt/home/pioneer/.ssh`
- [ ] 14. Commande : `cat /mnt/home/pioneer/.ssh/authorized_keys`
- [ ] 15. **DIAGNOSTIC : `ls -la /mnt/var/www/pioneer-academy/frontend/`**
- [ ] 16. **DIAGNOSTIC : `cat /mnt/etc/nginx/sites-available/pioneer-academy`**
- [ ] 17. **ENVOYER LES 2 DIAGNOSTICS À L'ASSISTANT**
- [ ] 18. Commande : `exit`
- [ ] 19. Hetzner Console → Disable rescue & reboot
- [ ] 20. Attendre 1 minute
- [ ] 21. PowerShell : `ssh pioneer@77.42.75.58`
- [ ] 22. **CONNEXION AUTO !**

---

## 🆘 AIDE RAPIDE

### ❓ "Je ne trouve pas l'onglet Rescue"

→ Hetzner Cloud Console → Servers → Cliquez sur le NOM du serveur (pas juste la checkbox) → Onglets en haut

### ❓ "Le mot de passe Rescue ne fonctionne pas"

→ Vérifiez que le serveur a bien redémarré (status "Running" avec badge "Rescue")
→ Réessayez la connexion SSH après 1 minute

### ❓ "Permission denied après exit"

→ Avez-vous désactivé le Rescue Mode dans Hetzner Console ?
→ Avez-vous attendu 1 minute après le reboot ?

### ❓ "Je n'arrive pas à coller les commandes"

→ Clic droit dans PowerShell = Coller
→ Ou Ctrl+Shift+V

---

## 📞 PROCHAINES ÉTAPES

Après la connexion SSH réussie :

1. ✅ **Envoyez-moi les résultats des diagnostics** (frontend + nginx)
2. 🔧 Je corrigerai la configuration Nginx
3. 🌐 Le site sera accessible !

---

## ⏱️ TEMPS TOTAL ESTIMÉ

| Étape                | Durée      |
| -------------------- | ---------- |
| Activer Rescue Mode  | 2 min      |
| Connexion SSH Rescue | 1 min      |
| Configuration SSH    | 3 min      |
| Diagnostic           | 2 min      |
| Désactiver Rescue    | 1 min      |
| Test final           | 1 min      |
| **TOTAL**            | **10 min** |

---

## 🚀 DÉMARREZ MAINTENANT !

**👉 Commencez par l'ÉTAPE 1 : Activez le Rescue Mode dans Hetzner**

Une fois que vous avez le mot de passe Rescue, revenez dans PowerShell et continuez ! 💪
