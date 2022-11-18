const mongoose = require('mongoose');
const { userSchema } = require('../model/user');

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
    if(response.status >=STATUS_OK && response.status <=MAX_STATUS_299){
        response.status = status;
        response.message = message;
    }
}

const _checkIfEvaluationFound = function(evaluation, response){
    return new Promise((resolve, reject)=>{
        if(evaluation){
            resolve(evaluation);
        }else{
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_EVALUATION_WITH_ID_FOUND);
            reject();
        }
    })

}

const _returnNotFound = function (res, response, status, message) {
    _fillResponse(response, status, message);
    _sendResponse(res, response);
    return;
}

const _searchByTemplateId = function (req, res, offset, count) {
    const searchQuery = {
        "template": {
           "_id": req.query.search }
        };

    console.log(searchQuery);
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Evaluation.find(searchQuery).skip(offset).limit(count)
        .then((evaluations) => _fillResponse(response, STATUS_OK, evaluations))
        .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
        .finally(() => _sendResponse(res, response));


}

const getAllEvaluations= function (req, res) {
    const MAX_COUNT = parseInt(process.env.MAX_COUNT, process.env.CONVERSION_BASE);
    let count = parseInt(process.env.COUNT, process.env.CONVERSION_BASE);
    let offset = parseInt(process.env.OFFSET, process.env.CONVERSION_BASE);

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, process.env.CONVERSION_BASE);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, process.env.CONVERSION_BASE)
    }
    if(isNaN(count) || isNaN(offset)){
        res.status(STATUS_BAD_REQUEST).json(process.env.INVALID_QUERY_COUNT);
        return;
    }
    if (count > MAX_COUNT) {
        res.status(STATUS_BAD_REQUEST).json({ message: process.env.MAX_COUNT_ERROR_MSG });
        return;
    };

    if (req.query && req.query.search) {
        _searchByTemplateId(req, res, offset, count);
        return;
    }
    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Evaluation.find().skip(offset).limit(count)
        .then((evaluations) => _fillResponse(response, STATUS_OK, evaluations))
        .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
        .finally(() => _sendResponse(res, response));

};

const getOne = function (req, res) {
    const id = req.params.id;
    const response = { status: STATUS_OK, message: process.env.INITIAL_MSG };
    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response)
    }
    else {
        Evaluation.findById(id)
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((evaluation) => _fillResponse(response, STATUS_OK, evaluation))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }


}

const createEvaluation = function (req, res) {
    console.log(req.body)
    const response = { status: STATUS_CREATED, message: process.env.INITIAL_MSG }
    if (req.body && req.body.name) {

        const questions = req.body.questions ? req.body.questions : [];
        const evaluationResponses = req.body.questions ? req.body.evaluationResponses : [];

        const evaluation = { name: req.body.name, questions: questions,evaluationResponses:evaluationResponses,
            evaluationType: req.body.evaluationType,template:req.body.template, user_id:req.body.user_id };
        Evaluation.create(evaluation)
            .then((newevaluation) => _fillResponse(response, STATUS_CREATED, newevaluation))
            .catch((err) => _fillResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }
    else {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.API_REQUIRED_FIELDS);
        _sendResponse(res,response);
    }
}


const deleteOne = function (req, res) {
    const id = req.params.id;
    const response = { status: STATUS_OK, message: process.env.INITIAL_MSG }

    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
        _sendResponse(res, response);
    }
    else {
        Evaluation.findByIdAndDelete(id)
            .then((evaluation) => _checkIfEvaluationFound(evaluation, response))
            .then((deletedevaluation) => _fillResponse(response, STATUS_OK, process.env.EVALUATION_DELETED_SUCCESSFULLY))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response))
    }



}

const updateOne = function (req, res, callbackFunction) {
    const id = req.params.id;
    const response = { message: process.env.INITIAL_MSG, status: STATUS_OK };

    if (!mongoose.isValidObjectId(id)) {
        _fillResponse(response, STATUS_BAD_REQUEST, process.env.INVALID_OBJECT_ID);
    } else {
        Evaluation.findById(id)
            .then((evaluation) =>_checkIfEvaluationFound(evaluation, response))
            .then((evaluation) => callbackFunction(req, evaluation))
            .then((updatedevaluation) =>_fillResponse(response, STATUS_OK, updatedevaluation))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response))

    }
    if (response.status != STATUS_OK) {
        _sendResponse(res, response);
    }
}

const partiallyUpdate = function (req, res) {
    updateOne(req, res, _partiallyUpdate);
}

const fullyUpdate = function (req, res) {
    if (req.body && req.body.name) {
        updateOne(req, res, _fullUpdate);
    } else {
        res.status(STATUS_BAD_REQUEST).json(process.env.API_REQUIRED_FIELDS);

    }
}

const _fullUpdate = function (req, evaluation) {
    evaluation.name = req.body.name;
    // evaluation.current_evaluator_email = req.body.current_evaluator_email;
    if (req.body && req.body.locked) {
        evaluation.locked = req.body.locked;
    };
    // if (req.body && req.body.current_evaluator_email) {
    //     evaluation.current_evaluator_email = req.body.current_evaluator_email;
    // };

    return evaluation.save();

}
const _partiallyUpdate = function (req, evaluation) {

    if (req.body && req.body.name) {
        evaluation.name = req.body.name;
    };
    if (req.body && req.body.locked) {
        evaluation.locked = req.body.locked;
    }
    // if (req.body && req.body.current_evaluator_email) {
    //     evaluation.current_evaluator_email = req.body.current_evaluator_email;
    // };


    return evaluation.save();

}
const updateLock = function (req, res) {
    updateOne(req, res, _lockEvaluation);
}
const _lockEvaluation = function (req, evaluation) {
    evaluation.locked = true;
    return evaluation.save();

}

const getTotalEvaluations = function (req, res) {
    const response = {
        status: STATUS_OK,
        message: process.env.INITIAL_MSG
    };
    Evaluation.countDocuments()
    .then((totalevaluations)=> _fillResponse(response, STATUS_OK, totalevaluations))
    .catch((err)=> _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
    .finally(()=> _sendResponse(res,response));

}

module.exports = {
    getAllEvaluations,
    getOne,
    createEvaluation,
    deleteOne,
    partiallyUpdate,
    fullyUpdate,
    getTotalEvaluations,
    updateLock
}