# 🚑 ACTION D'URGENCE - RÉCUPÉRATION DU SERVEUR

Ne vous découragez pas. Le problème est purement technique et nous allons le résoudre en repartant de zéro.

Ce guide remplace tous les précédents. Suivez-le étape par étape.

---

## ÉTAPE 1 : PRÉPARATION LOCALE (Sur votre PC)

Nous allons régénérer proprement vos clés SSH car vous avez supprimé le dossier `.ssh`.

1. **Exécutez le script d'urgence** que je viens de créer : `EMERGENCY_RESET.ps1`.
   _(Je vais vous donner la commande pour l'exécuter dans la fenêtre de chat)_

Ce script va :

- Recréer vos clés SSH.
- Nettoyer les erreurs de connexion précédentes.
- Vous préparer à vous connecter.

---

## ÉTAPE 2 : LE MOT DE PASSE RESCUE (Sur Hetzner)

C'est l'étape critique où ça bloquait. **Lisez attentivement.**

1. Allez sur **[Hetzner Console](https://console.hetzner.cloud/)**.
2. Sélectionnez votre serveur **77.42.75.58**.
3. Allez dans l'onglet **Rescue**.
4. **SI LE RESCUE EST DÉJÀ ACTIF (Icône d'ambulance allumée) :**
   - Cliquez sur **"Disable rescue"** (Désactiver).
   - Attendez quelques secondes.
5. **ACTIVEZ LE RESCUE MAINTENANT :**
   - Cliquez sur **"Enable rescue & power cycle"**.
   - Une fenêtre s'ouvre. Sélectionnez "linux64".
   - **⚠️ IMPORTANT :** Regardez bien la fenêtre confirmation. **Hetzner va vous afficher un MOT DE PASSE**.
   - **COPIEZ CE MOT DE PASSE**. (Notez-le dans un bloc-notes).
   - Sans ce mot de passe, vous ne pourrez pas entrer.

---

## ÉTAPE 3 : LA CONNEXION (Sur votre PC)

1. Revenez sur votre terminal (PowerShell).
2. Lancez la commande : `ssh root@77.42.75.58`
3. Il va vous demander `password:`.
4. **COLLEZ LE MOT DE PASSE HETZNER** (Clic droit pour coller dans PowerShell).
   _(Rien ne s'affiche quand vous tapez/collez le mot de passe, c'est normal, faites Entrée)_.

---

## ÉTAPE 4 : LA RÉPARATION (Une fois connecté)

Vous verrez le prompt : `root@rescue ~ #`.

Copiez et collez **TOUT CE BLOC** d'un coup dans le terminal Rescue :

```bash
# 1. Monter le disque du serveur
mount /dev/sda1 /mnt

# 2. Créer le dossier SSH s'il n'existe pas
mkdir -p /mnt/home/pioneer/.ssh

# 3. Mettre les bonnes permissions
chmod 700 /mnt/home/pioneer/.ssh

# 4. Ouvrir le fichier des clés pour y coller votre nouvelle clé
nano /mnt/home/pioneer/.ssh/authorized_keys
```

Une fois l'éditeur ouvert :

1. Collez votre **NOUVELLE CLÉ PUBLIQUE** (Le script de l'étape 1 vous l'aura affichée).
2. Faites `Ctrl+X`, puis `Y`, puis `Entrée`.

Ensuite, tapez ces dernières commandes :

```bash
# 5. Finaliser les permissions
chmod 600 /mnt/home/pioneer/.ssh/authorized_keys
chown -R 1000:1000 /mnt/home/pioneer/.ssh

# 6. Sortir et Redémarrer
exit
```

---

## ÉTAPE 5 : RETOUR À LA NORMALE

1. Retournez sur Hetzner.
2. Le mode Rescue devrait se désactiver tout seul au redémarrage, sinon désactivez-le.
3. Attendez 1 minute.
4. Connectez-vous normalement : `ssh pioneer@77.42.75.58`

**Ça va marcher.**
