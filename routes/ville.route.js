const router = require('express').Router()
const ville = require('../controllers/villeController')

router.get('/', ville.getAll)
router.get('/:id', ville.getById)
router.post('/', ville.create)
router.put('/:id', ville.update)
router.delete('/:id', ville.delete)
router.delete('/',ville.deleteChecked)

module.exports = router