const router = require('express').Router()
const contrat = require('../controllers/contratGarantieController')

router.get('/', contrat.getAll)
router.get('/:id', contrat.getById)
router.post('/', contrat.create)
router.put('/:id', contrat.update)
router.delete('/:id', contrat.delete)
router.delete('/',contrat.deleteChecked)

//getManyContratGarantie
router.post('/export/get_many_contrat_garantie', contrat.getManyContratGarantie)

module.exports = router