const router = require('express').Router()
const livraison = require('../controllers/livraisonController')

router.get('/', livraison.getAll)
router.get('/:id', livraison.getById)
router.post('/', livraison.create)
router.put('/:id', livraison.update)
router.delete('/:id', livraison.delete)
router.delete('/',livraison.deleteChecked)

//getManyLivraison
router.post('/export/get_many_livraison', livraison.getManyLivraison)

module.exports = router