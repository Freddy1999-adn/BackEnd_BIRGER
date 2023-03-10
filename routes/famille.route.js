const router = require('express').Router()
const famille = require('../controllers/familleController')

router.get('/', famille.getAll)
router.get('/:id', famille.getById)
router.post('/', famille.create)
router.put('/:id', famille.update)
router.delete('/:id', famille.delete)
router.delete('/',famille.deleteChecked)

module.exports = router