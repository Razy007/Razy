# 🛡️ MANUEL D'ADMINISTRATION - ACADEMY OF PI (V1.0)

Ce document confidentiel regroupe toutes les commandes nécessaires à la gestion, la surveillance et la sécurité de l'application **Pioneer Academy** via l'interface ligne de commande (PowerShell).

---

## ⚠️ PRÉREQUIS DE SÉCURITÉ

1. **Emplacement :** Les commandes doivent TOUJOURS être lancées depuis le dossier racine du projet sur votre ordinateur :

    ```powershell
    cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app
    ```

2. **Clé SSH :** Le fichier `hetzner_key` doit être présent dans ce dossier. C'est votre "passe-partout". Ne le partagez jamais.

---

## 1. 📊 SURVEILLANCE & FINANCE (Le Radar)

Utilisez cette commande pour avoir une vue d'ensemble de l'économie de l'application.

**Commande :**

```powershell
ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/check_top_users.js"
```

**Ce que ça affiche :**

* **Total Users** : Nombre d'inscrits réels.
* **Pending Payouts** : La somme totale de Pi que vous devez théoriquement aux utilisateurs (Dette).
* **TOP 20** : La liste des utilisateurs les plus riches (votre priorité de paiement).
* **ALERTE FRAUDE** : Liste rouge automatique des utilisateurs suspects (Beaucoup de Pi mais peu d'XP).

---

## 2. ⚡ ACTIONS D'ADMINISTRATION (L'Épée)

Utilisez ces commandes pour agir sur un utilisateur spécifique (Bannir, Récompenser, Corriger).

**Format générique :**

```powershell
ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js <COMMANDE> <UTILISATEUR> <VALEUR>"
```

### A. 🔍 Voir les infos d'un utilisateur

Avant d'agir, vérifiez toujours qui vous ciblez.

* *Exemple : Voir le profil de l'utilisateur "PioneerToto"*

    ```powershell
    ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js --info PioneerToto"
    ```

### B. 🚫 Bannir un tricheur

Met son niveau à -1 et marque son nom comme BANNED. Il ne pourra plus se connecter.

* *Exemple : Bannir "Hacker123"*

    ```powershell
    ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js --ban Hacker123"
    ```

    *(Pour débannir, utilisez `--unban`)*

### C. 💰 Créditer des Pi (Remboursement / Bonus)

Ajoute des Pi au solde actuel. Utilisez un chiffre négatif pour en retirer.

* *Exemple : Donner 10 Pi à "PioneerToto"*

    ```powershell
    ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js --add-pi PioneerToto 10"
    ```

### D. ⭐ Ajuster l'XP (Niveau)

Définit l'XP à une valeur précise.

* *Exemple : Mettre "PioneerToto" à 5000 XP*

    ```powershell
    ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js --set-xp PioneerToto 5000"
    ```

---

## 3. 🚨 PROCÉDURE DE PAIEMENT (MANUEL)

Lorsque vous recevez une demande de retrait sur Discord/Email :

1. **Vérification :** Lancez la commande **Surveillance** (1).
2. **Validation :** Regardez si l'utilisateur est dans le TOP 20 ou faites un `--info` sur lui.
    * *Solde cohérent avec l'XP ?* -> OK.
    * *Activité suspecte ?* -> NE PAS PAYER.
3. **Paiement :** Ouvrez votre **Pi Browser (Wallet Developer)** sur votre téléphone.
    * Envoyez le montant exact à l'adresse du demandeur.
4. **Mise à jour (Important) :** Une fois payé, vous devez retirer ces Pi de son solde virtuel pour qu'il ne puisse pas demander deux fois !
    * *Exemple : S'il a retiré 10 Pi*

    ```powershell
    ssh -i hetzner_key -o StrictHostKeyChecking=no root@pioneeracademy.academy "cd /var/www/pioneer-academy/backend && node scripts/admin_actions.js --add-pi UserPaiement -10"
    ```

    *(Notez le signe **négatif** `-10` pour déduire le montant)*.

---

## 4. ⚖️ REFERENCE ÉCONOMIQUE (V2.0 - Anti-Inflation)

### A. Récompenses Quiz

* **Formule :** `(Score / TotalQuestions) * 0.0000001 * LevelMultiplier`
* **Gain Base :** **0.0000001 Pi** par quiz parfait.
* **Objectif :** Micro-récompense pour éviter l'inflation et décourager les fermes de bots.

### B. Seuils de détection (Script Surveillance)

* **Seuil Alerte Solde :** **0.001 Pi**
* **Raisonnement :** Avec un gain de 0.0000001 Pi, un utilisateur doit réussir **10 000 quiz** pour atteindre 0.001 Pi.
* **Action :** Tout utilisateur atteignant 0.001 Pi en moins de quelques mois est statistiquement suspect (Bot ou Exploitation de faille). -> **BANNIR**.

---

> Document généré le 18 Janvier 2026 - Confidentiel
