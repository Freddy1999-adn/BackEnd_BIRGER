const router = require('express').Router()
const equipement = require('../controllers/equipementController')

router.get('/', equipement.getAll)
// router.get('/add_to_contrat_maintenance', equipement.getEquipementToAddInContratMaintenance)
router.get('/add_to_contrat_garantie_gab', equipement.getEquipementToAddInContratGarantieGab)
router.get('/add_to_contrat_maintenance_gab', equipement.getEquipementToAddInContratMaintenanceGab)
router.get('/edit_to_contrat_maintenance_gab/:equipement_id', equipement.getEquipementToEditInContratMaintenanceGab)
router.get('/edit_to_contrat_garantie_gab/:equipement_id', equipement.getEquipementToEditInContratGarantieGab)
router.get('/add_to_contrat_maintenance', equipement.getEquipementToAddInContratMaintenance)
router.post('/renew_add_to_contrat_maintenance', equipement.getEquipementToRenewOrEditInContratMaintenance)
router.post('/edit_to_livraison', equipement.getEquipementToEditInLivraison)
router.get('/:id', equipement.getById)
router.post('/', equipement.create)
router.put('/:id', equipement.update)
router.delete('/:id', equipement.delete)
router.delete('/',equipement.deleteChecked)

module.exports = router