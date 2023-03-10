const router = require('express').Router()
const contrat = require('../controllers/checkContratController')
const histogramme_contrat = require('../controllers/histogrammeController')

//Tous à excecuté depuis le serveur chaque jour
//traitement
router.get('/', contrat.getContratToNotify) //liste de tous les contrats à notifier : GARANTIE ALL && MAINTENANCE ALL (with gab)
router.get('/contrat_expired_in_45_days', contrat.getContratExpiredIn45Days)

// router.get('/contrat_expired/maintenance', contrat.contrat_maintenance_expired) //return liste d contrat de maintenance expiré || et update auto
// router.get('/contrat_expired/garantie', contrat.contrat_garantie_expired)
// router.get('/contrat_expired/maintenance_gab', contrat.contrat_maintenance_gab_expired)
// router.get('/contrat_expired/garantie_gab', contrat.contrat_garantie_gab_expired)

router.get('/contrat_for_this_year', contrat.getContratForThisYear)
router.post('/all_contrat_count_between_2_date', histogramme_contrat.getAllContratCountBetween2Date)

module.exports = router