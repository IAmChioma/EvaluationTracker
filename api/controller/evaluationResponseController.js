const mongoose = require('mongoose');

const Evaluation = mongoose.model(process.env.DB_NAME);

const STATUS_OK = parseInt(process.env.STATUS_OK);
const STATUS_BAD_REQUEST = parseInt(process.env.STATUS_BAD_REQUEST);
const STATUS_CREATED = parseInt(process.env.STATUS_CREATED);
const STATUS_NO_CONTENT = parseInt(process.env.STATUS_NO_CONTENT);
const STATUS_NOT_FOUND = parseInt(process.env.STATUS_NOT_FOUND);
const STATUS_SERVER_ERROR = parseInt(process.env.STATUS_SERVER_ERROR);
const MAX_STATUS_299 = parseInt(process.env.MAX_STATUS_299);

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}
const _fillResponse = function (response, status, message) {
    response.status = status;
    response.message = message;
}

const _fillErrorResponse = function (response, status, message) {
    if (response.status >= STATUS_OK && response.status <= MAX_STATUS_299) {
        response.status = status;
        response.message = message;
    }
}
const _checkIfEvaluationFound = function (evaluation, response) {
    return new Promise((resolve, reject) => {
        if (evaluation) {
            resolve(evaluation);
        } else {
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_EVALUATION_WITH_ID_FOUND);
            reject();
        }
    })

}
const _checkIfEvaluationResponseFound = function (evaluation, evaluationResponseId, response) {
    return new Promise((resolve, reject) => {
        if (evaluation.evaluationResponses.id(evaluationResponseId)) {
            resolve(evaluation.evaluationResponses.id(evaluationResponseId));
        } else {
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_EVALUATION_RESPONSE_WITH_ID_FOUND);
            reject();
        }
    })

}
const createEvaluationResponse = function (req, res) {
    const response = { status: process.env.STATUS_CREATED, message: process.env.INITIAL_MSG };
    if (req.body && req.body.current_evaluator_email) {

        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
            _sendResponse(res, response);
            return;

        }
        Evaluation.findById(id)
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evaluationFound) => _createEvaluationResponse(req, res, evaluationFound))
            .then((createdEvaluation) => _fillResponse(response, STATUS_CREATED, createdEvaluation))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    } else {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_REQUIRED_FIELDS);
        _sendResponse(res, response);
    }


};
const deleteEvaluationResponse = function (req, res) {
    const id = req.params.id;
    const evaluationResponseId = req.params.evaluationResponseId;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(evaluationResponseId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);

    }

    else {
        Evaluation.findById(id).select('evaluationResponses')
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evaluationFound) => _deleteEvaluationResponse(req, evaluationFound, response))
            .then((deletedResponse) => _fillResponse(response, STATUS_OK, process.env.EVALUATION_RESPONSE_DELETED_SUCCESSFULLY))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }
};
const getAllEvaluationResponse = function (req, res) {
    const id = req.params.id;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);

    }

    else {
        Evaluation.findById(id).select('evaluationResponses')
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evaluationResponses) => _fillResponse(response, STATUS_OK, evaluationResponses))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const getEvaluationResponse = function (req, res) {
    const id = req.params.id;
    const evaluationResponseId = req.params.evaluationResponseId;
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(evaluationResponseId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }

    else {
        Evaluation.findById(id).select('evaluationResponses')
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evaluationFound) => _checkIfEvaluationResponseFound(evaluationFound, evaluationResponseId, response))
            .then((foundResponse) => _fillResponse(response, STATUS_OK, foundResponse))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const fullUpdate = function (req, res) {
const response = { status: process.env.STATUS_CREATED, message: process.env.INITIAL_MSG };
if (req.body && req.body.current_evaluator_email) {
    _updateOne(req,res,_fullUpdate);
} else {
    _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_REQUIRED_FIELDS);
    _sendResponse(res, response);
}

};
const _updateOne = function (req, res, callbackFunction) {
    const id = req.params.id;
    const evaluationResponseId = req.params.evaluationResponseId;
    const response = { message: process.env.INITIAL_MSG, status: process.env.STATUS_OK };
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(evaluationResponseId)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }

    else {
        Evaluation.findById(id).select('evaluationResponses')
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evalFound) => callbackFunction(req, response, evalFound))
            .then((updatedResponse) => _fillResponse(response, STATUS_OK, updatedResponse))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));
    }
};
const partiallyUpdate = function (req, res) {
    _updateOne(req,res,_partiallyUpdateEvaluationResponse);

};
const _createEvaluationResponse = function (req, res, evaluation) {
    const resp = {};
    resp.current_evaluator_email = req.body.current_evaluator_email;
    resp.created_date = req.body.created_date;
    resp.questions = req.body.questions ? req.body.questions : [];
    evaluation.evaluationResponses.push(resp);
    return evaluation.save();

};
const _deleteEvaluationResponse = function (req, evaluation, response) {
    const evaluationResponseId = req.params.evaluationResponseId;
    return new Promise((resolve, reject) => {
        if (!evaluation.evaluationResponses.id(evaluationResponseId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.INVALID_OBJECT_ID_FOR_RESPONSE);
            reject()
        } else {
            evaluation.evaluationResponses.id(evaluationResponseId).remove();
            resolve(evaluation.save());
        }
    })

}

const _fullUpdate = function (req, response, evaluation) {
    const evaluationResponseId = req.params.evaluationResponseId;
    return new Promise((resolve, reject) => {
        if (!evaluation.evaluationResponses.id(evaluationResponseId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.NO_EVALUATION_RESPONSE_WITH_ID_FOUND);
            reject()
        } else {
            const resp = evaluation.evaluationResponses.id(evaluationResponseId);
            resp.current_evaluator_email = req.body.current_evaluator_email;
            resp.last_edited_date = req.body.last_edited_date;
            resp.questions = req.body.questions;
            resolve(evaluation.save());
        }
    })

};
const _partiallyUpdateEvaluationResponse = function (req, response, evaluation) {
    const evaluationResponseId = req.params.evaluationResponseId;
    return new Promise((resolve, reject) => {
        if (!evaluation.evaluationResponses.id(evaluationResponseId)) {
            _fillResponse(response, process.env.STATUS_NOT_FOUND, process.env.NO_EVALUATION_RESPONSE_WITH_ID_FOUND);
            reject();
        } else {
            const resp = team.players.id(playerId);
            if (req.body.current_evaluator_email) {
                resp.current_evaluator_email = req.body.current_evaluator_email;
            }
            if (req.body.created_date) {
                resp.created_date = req.body.created_date;
            }
            resolve(evaluation.save());
        }
    })

};

const getTotalEvaluationResponses = function (req, res) {
    const id = req.params.id;
    const response = {
        status: STATUS_OK,
        message: process.env.INITIAL_MSG
    };
    Evaluation.findById(id).select('evaluationResponses')
    .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
    .then((evaluation)=> _fillResponse(response, STATUS_OK, evaluation.evaluationResponses.length))
    .catch((err)=> _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
    .finally(()=> _sendResponse(res,response));
}

module.exports = {
    createEvaluationResponse,
    deleteEvaluationResponse,
    getEvaluationResponse,
    getAllEvaluationResponse,
    fullUpdate,
    partiallyUpdate,
    getTotalEvaluationResponses
}