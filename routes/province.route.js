const router = require('express').Router()
const province = require('../controllers/provinceController')

router.get('/', province.getAll)
router.get('/:id', province.getById)
router.post('/', province.create)
router.put('/:id', province.update)
router.delete('/:id', province.delete)
router.delete('/',province.deleteChecked)

module.exports = router