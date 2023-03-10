const router = require('express').Router()
const client = require('../controllers/clientController')

router.get('/', client.getAll)
router.get('/:id', client.getById)
router.post('/', client.create)
router.put('/:id', client.update)
router.delete('/:id', client.delete)
router.delete('/',client.deleteChecked)

module.exports = router