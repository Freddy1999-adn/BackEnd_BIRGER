const router = require('express').Router()
const service = require('../controllers/serviceController')

router.get('/', service.getAll)
router.get('/:id', service.getById)
router.post('/', service.create)
router.put('/:id', service.update)
router.delete('/:id', service.delete)
router.delete('/',service.deleteChecked)

module.exports = router