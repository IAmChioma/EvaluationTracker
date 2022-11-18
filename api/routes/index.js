const express = require('express');
const templateRoutes = require('./templateRoute');
const evaluationRoutes = require('./evaluationRoute');
const userRoutes = require('./userRoute');
const router = express.Router();


router.use('/users', userRoutes);
router.use('/templates', templateRoutes);
router.use('/evaluations', evaluationRoutes);


module.exports = router;