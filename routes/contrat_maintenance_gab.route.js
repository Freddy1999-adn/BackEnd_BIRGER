const router = require('express').Router()
const contrat = require('../controllers/contratMaintenanceGabController')

router.get('/', contrat.getAll)
router.get('/:id', contrat.getById)
router.post('/', contrat.create)
router.put('/:id', contrat.update)
router.delete('/:id', contrat.deleteContrat)
router.delete('/delete_many/contrat_detail',contrat.deleteCheckedContrat)
// router.post('/renew_contrat/:id', contrat.renewContrat)

//getManyContratMaintenance
router.post('/export/get_redevance_contrat_maintenance_gab', contrat.getRedevanceContratMaintenanceGab)

module.exports = router