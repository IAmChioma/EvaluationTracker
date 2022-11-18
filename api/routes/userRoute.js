const express = require('express');
const userController = require('../controller/userController');
const userRouter = express.Router();

userRouter.route('')
            .get(userController.getAllUsers)
            .post(userController.createUser);

userRouter.route('/login')
            .post(userController.login)

// userRouter.route('/:id')
//             .get(userController.getOne)
            
module.exports = userRouter;