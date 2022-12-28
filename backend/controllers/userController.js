import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'



// @desc            Auth user & get token
// @routes          POST /api/users/login
// @access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('invalid email or password')
    }

})

// @desc           Register a new user
// @routes          POST /api/users
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new error("User already exist")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new error("Invalid user data")

    }
})

// @desc            Get user profile
// @routes          GET /api/users/profile
// @access          Private
const getUserProfile = asyncHandler(async (req, res) => {
    // res.send('Success')
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error('Invalid email  or password')
    }
})

// @desc            Update user profile
// @routes          PUT /api/users/profile
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // res.send('Success')
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })

    } else {
        res.status(401)
        throw new Error('Invalid email  or password')
    }


    // if (user && (await user.matchPassword(password))) {
    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         isAdmin: user.isAdmin,
    //         token: generateToken(user._id)
    //     })
    // } else {
    //     res.status(401)
    //     throw new Error('invalid email or password')
    // }

})


export { authUser, registerUser, getUserProfile, updateUserProfile }