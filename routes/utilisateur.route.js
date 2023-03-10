const router = require('express').Router()
const utilisateur = require('../controllers/authController')

router.get('/', utilisateur.getAll)
router.get('/:id', utilisateur.getById)
// router.get('/get_user_by_email', utilisateur.getByEmail)
router.post('/', utilisateur.register)
router.put('/:id', utilisateur.update)
router.post('/logout', utilisateur.logout)
router.post('/login', utilisateur.login)
router.delete('/:id', utilisateur.delete)
//forgot password by email

module.exports = router