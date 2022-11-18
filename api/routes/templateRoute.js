const express  = require('express');
const templateController = require('../controller/templateController');
const authController = require('../controller/authenticationController');
const templateRouter = express.Router();

templateRouter.route('')
            .get(templateController.getAllTemplates)
            .post(templateController.createTemplate);

templateRouter.route('/totalCount')
            .get(templateController.getTotalTemplates)


templateRouter.route('/:id')
            .get(authController.authenticate,templateController.getOne)
            .delete(authController.authenticate,templateController.deleteOne)
            .put(templateController.fullyUpdate)
            .patch(templateController.partiallyUpdate);

templateRouter.route('/:id/deactivate')
            .put(templateController.updateStatus)

module.exports = templateRouter;

