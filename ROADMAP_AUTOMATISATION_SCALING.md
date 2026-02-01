# 🗺️ ROADMAP STRATÉGIQUE : AUTOMATISATION & SCALING

> **Academy of Pi - Document de Vision Technique (2026)**

Ce document trace la route pour faire passer l'application du stade "Lancement (V1)" au stade "Licorne (V3)" avec des millions d'utilisateurs, sans sacrifier la santé mentale de l'administrateur.

---

## PARTIE 1 : AUTOMATISATION DES PAIEMENTS (Sortir de l'Esclavage)

Actuellement, vous payez "à la main" sur Discord. C'est invivable au-delà de 100 utilisateurs.

### 🟡 ÉTAPE 2 : LA FILE D'ATTENTE (Objectif : V1.1)

*À lancer dès que vous atteignez 500 utilisateurs.*

**Le Principe :** L'utilisateur clique sur "Retrait" dans l'appli. Il ne vous envoie PAS de message. L'appli enregistre sa demande dans une liste d'attente.

1. **Technique :** Création d'une table SQL `withdrawal_requests`.
2. **Expérience Admin :**
    * Vous ne recevez plus de notifications h24.
    * **Une fois par semaine** (ex: Vendredi), vous lancez une commande : `node scripts/pay_requests.js --preview`.
    * Le script vous sort la liste des 500 paiements en attente.
    * Il génère un fichier "CSV" ou une liste que vous validez.
3. **Gain de vie :** Vous passez de "H24" à "1h par semaine".

### 🟢 ÉTAPE 3 : LE ROBOT BANQUIER (Objectif : V2.0)

*À lancer dès que vous avez les revenus pour sécuriser un serveur dédié.*

**Le Principe :** Zéro intervention humaine.

1. **Technique :** Un serveur sécurisé isolé (Hot Wallet) héberge une clé Pi dédiée aux paiements (avec un petit budget dessus, ex: 1000 Pi).
2. **Flux :**
    * L'utilisateur demande un retrait.
    * Le Serveur vérifie (Anti-Cheat, Cooldown, Solde).
    * Si OK -> Le Serveur signe et envoie la transaction sur la Blockchain Pi.
    * Si Échec -> Alerte Admin.
3. **Sécurité :** On met un plafond (ex: max 100 Pi sortants par heure) pour qu'en cas de hack, le robot s'arrête tout seul.

---

## PARTIE 2 : SCALING INFRASTRUCTURE (Accueillir les Millions)

Votre serveur actuel est un "Starter". Voici quand et comment changer.

### 🚀 NIVEAU 1 : "LE GARAGE" (Actuel)

* **Infra :** 1 VPS (2 vCPU, 4GB RAM).
* **Capacité :** ~2 000 utilisateurs simultanés (20k / jour).
* **Coût :** Faible.
* **Action :** Optimiser le code, mettre du cache.

### 🚀 NIVEAU 2 : "L'ENTREPÔT" (Croissance)

*Quand le site commence à ramer le soir.*

* **Infra :** Upgrade vers un VPS Dédié (8 vCPU, 32GB RAM).
* **Capacité :** ~50 000 utilisateurs simultanés.
* **Coût :** Moyen.
* **Technique :** Utiliser PM2 en mode "Cluster" pour utiliser tous les coeurs du processeur.

### 🚀 NIVEAU 3 : "L'USINE" (Masse Critique)

*Quand vous avez des millions de Pioneers.*

* **Infra :** Cloud Horizontal (AWS / Google Cloud / Kubernetes).
  * 1 Load Balancer (l'aiguilleur du ciel).
  * 10 à 50 petits serveurs API (Node.js) qui s'allument et s'éteignent selon la demande.
  * 1 Cluster Base de Données (Plusieurs bases synchronisées).
* **Capacité :** INFINIE (tant que vous payez les serveurs).
* **Action :** Embaucher un ingénieur DevOps (à ce stade, vous en aurez les moyens !).

---

## CONCLUSION POUR L'ADMINISTRATEUR

1. **Ne paniquez pas pour le nombre d'utilisateurs.** Votre code est prêt. C'est juste une question de changer de "voiture" (serveur) quand la route deviendra une autoroute.
2. **Votre priorité absolue (V1.1) :** Coder la **File d'Attente (Étape 2)** dès que vous sentez que gérer les emails devient pénible. C'est un code simple (1 journée de dev) qui vous sauvera la vie.

*Gamifiez votre succès : Plus vous avez de problèmes de charge, plus vous avez réussi !*
