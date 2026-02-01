# 🚀 DÉPLOYER EN 1 COMMANDE

## PRÉREQUIS

1. Remplacer dans `deploy.ps1` :
   - `votre_user` par votre username SSH
   - `/var/www/pi-academy` par votre chemin serveur si différent

## EXÉCUTION

```powershell
cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app

# Déploiement complet
.\deploy.ps1 -ServerUser "votre_user" -ServerHost "pioneeracademy.academy"

# Ou si déjà modifié dans le fichier:
.\deploy.ps1
```

Le script va automatiquement :
1. ✅ Appliquer migration SQL `completed_layers`
2. ✅ Build frontend avec nouveaux prix
3. ✅ Build backend avec nouveau code
4. ✅ Upload vers serveur (avec backup auto)
5. ✅ Redémarrer PM2
6. ✅ Vérifier santé API

**Durée** : ~5 minutes

---

## EN CAS D'ERREUR

Le script affichera les commandes de rollback :

```powershell
ssh votre_user@pioneeracademy.academy "mv /var/www/pi-academy/frontend/dist.backup_* /var/www/pi-academy/frontend/dist"
ssh votre_user@pioneeracademy.academy "pm2 restart pi-academy-api"
```

---

## TESTS APRÈS DÉPLOIEMENT

1. **Boutique** : https://pioneeracademy.academy/shop
   - Vérifier : Recharge Rapide = **0.0005 π** (was 0.0001 π)
   
2. **Skills** : Compléter 1 module Discovery
   - Vérifier : Toast "+50 XP"
   - Vérifier : Page "Analyse" accessible
   
3. **Console** : F12
   - Vérifier : Pas d'erreur 404

---

## SUPPORT

Consultez `DEPLOIEMENT_EXPRESS.md` pour guide détaillé étape par étape.
