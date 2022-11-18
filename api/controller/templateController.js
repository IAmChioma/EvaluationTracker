const mongoose = require('mongoose');

const Template = mongoose.model(process.env.DB_NAME_TEMPLATE);

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

const _checkIfTemplateFound = function(template, response){
    return new Promise((resolve, reject)=>{
        if(template){
            resolve(template);
        }else{
            _fillResponse(response, STATUS_NOT_FOUND, process.env.NO_TEMPLATE_WITH_ID_FOUND);
            reject();
        }
    })

}

const _returnNotFound = function (res, response, status, message) {
    _fillResponse(response, status, message);
    _sendResponse(res, response);
    return;
}

const getAllTemplates= function (req, res) {
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


    const response = { status: process.env.STATUS_OK, message: process.env.INITIAL_MSG };
    Template.find().skip(offset).limit(count)
        .then((templates) => _fillResponse(response, STATUS_OK, templates))
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
        Template.findById(id)
            .then((template) => _checkIfTemplateFound(template, response))
            .then((template) => _fillResponse(response, STATUS_OK, template))
            .catch((err) => _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
            .finally(() => _sendResponse(res, response));

    }


}

const createTemplate = function (req, res) {
    console.log(req.body)
    const response = { status: STATUS_CREATED, message: process.env.INITIAL_MSG }
    if (req.body && req.body.name) {

        const questions = req.body.questions ? req.body.questions : [];
        const template = { name: req.body.name, questions: questions,
            evaluationType: req.body.evaluationType };
        Template.create(template)
            .then((newTemplate) => _fillResponse(response, STATUS_CREATED, newTemplate))
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
        Template.findByIdAndDelete(id)
            .then((template) => _checkIfTemplateFound(template, response))
            .then((deletedTemplate) => _fillResponse(response, STATUS_OK, process.env.TEMPLATE_DELETED_SUCCESSFULLY))
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
        Template.findById(id)
            .then((template) =>_checkIfTemplateFound(template, response))
            .then((template) => callbackFunction(req, template))
            .then((updatedTemplate) =>_fillResponse(response, STATUS_OK, updatedTemplate))
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
const updateStatus = function (req, res) {
    updateOne(req, res, _statusUpdateDeactivate);
}

const fullyUpdate = function (req, res) {
    if (req.body && req.body.name) {
        updateOne(req, res, _fullUpdate);
    } else {
        res.status(STATUS_BAD_REQUEST).json(process.env.API_REQUIRED_FIELDS);

    }
}

const _fullUpdate = function (req, template) {
    template.name = req.body.name;
    template.questions = req.body.questions;
    if (req.body && req.body.status) {
        template.status = req.body.status;
    };
    if (req.body && req.body.deactivated_date) {
        template.deactivated_date = req.body.deactivated_date;
    }
    return template.save();

}
const _partiallyUpdate = function (req, template) {

    if (req.body && req.body.name) {
        template.name = req.body.name;
    };
    if (req.body && req.body.status) {
        template.status = req.body.status;
    }
    if (req.body && req.body.deactivated_date) {
        template.deactivated_date = req.body.deactivated_date;
    };


    return template.save();

}
const _statusUpdateDeactivate = function (req, template) {
    template.status = "inactive";
    // template.status = req.body.status;
    return template.save();

}

const getTotalTemplates = function (req, res) {
    const response = {
        status: STATUS_OK,
        message: process.env.INITIAL_MSG
    };
    Template.countDocuments()
    .then((totalTemplates)=> _fillResponse(response, STATUS_OK, totalTemplates))
    .catch((err)=> _fillErrorResponse(response, STATUS_SERVER_ERROR, err))
    .finally(()=> _sendResponse(res,response));

}

module.exports = {
    getAllTemplates,
    getOne,
    createTemplate,
    deleteOne,
    partiallyUpdate,
    fullyUpdate,
    getTotalTemplates,
    updateStatus
}