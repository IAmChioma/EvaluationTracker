const express  = require('express');
const evaluationController = require('../controller/evaluationController');
const evaluationReponseController = require('../controller/evaluationResponseController');
const authController = require('../controller/authenticationController');
const evaluationRouter = express.Router();

evaluationRouter.route('')
            .get(evaluationController.getAllEvaluations)
            .post(evaluationController.createEvaluation);

evaluationRouter.route('/totalCount')
            .get(evaluationController.getTotalEvaluations)

evaluationRouter.route('/:id')
            .get(authController.authenticate,evaluationController.getOne)
          //  .get(evaluationController.getOne)
            .delete(authController.authenticate,evaluationController.deleteOne)
           // .delete(evaluationController.deleteOne)
            .put(evaluationController.fullyUpdate)
            .patch(evaluationController.partiallyUpdate);

evaluationRouter.route('/:id/lock')
            .put(evaluationController.updateLock)

evaluationRouter.route('/:id/evaluationResponses')
            .get(evaluationReponseController.getAllEvaluationResponse)
            .post(evaluationReponseController.createEvaluationResponse);
evaluationRouter.route('/:id/evaluationResponses/totalCount')
            .get(evaluationReponseController.getTotalEvaluationResponses)

evaluationRouter.route('/:id/evaluationResponses/:evaluationResponseId')
            .get(evaluationReponseController.getEvaluationResponse)
            .delete(evaluationReponseController.deleteEvaluationResponse)
            .put(evaluationReponseController.fullUpdate)
            .patch(evaluationReponseController.partiallyUpdate);

module.exports = evaluationRouter;

