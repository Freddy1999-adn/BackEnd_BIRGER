const router = require('express').Router()
const contrat = require('../controllers/contratMaintenanceController')

router.get('/', contrat.getAll)
router.get('/:id', contrat.getById)
router.post('/', contrat.create)
router.put('/:id', contrat.update)
router.delete('/:id', contrat.deleteContrat)
router.delete('/delete_many/contrat_detail',contrat.deleteCheckedContrat)
router.post('/filter',contrat.filterContrat)
// router.get('/filter/:date_debut/:date_fin',contrat.filterContrat)
// router.post('/renew_contrat/:id', contrat.renewContrat)

//getManyContratMaintenance
router.post('/export/get_many_contrat_maintenance', contrat.getManyContratMaintenance)

module.exports = router