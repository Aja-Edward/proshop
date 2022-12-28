import express from 'express'
const router = express.Router()
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile
}
    from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)





// res.status(404)
// throw new Error("Edward always be careful here. There is error in your code.")
export default router