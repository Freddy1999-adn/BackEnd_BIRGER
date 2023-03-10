const router = require('express').Router()
const contratGab = require('../controllers/contratGarantieGabController')

router.get('/', contratGab.getAll)
router.get('/:id', contratGab.getById)
router.post('/', contratGab.create)
router.put('/:id', contratGab.update)
router.delete('/:id', contratGab.delete)
router.delete('/',contratGab.deleteChecked)

module.exports = router