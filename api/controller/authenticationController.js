const jwt = require('jsonwebtoken');


const STATUS_UNAUTHORIZED = parseInt(process.env.STATUS_UNAUTHORIZED);

const sendResponse= function(res,response){
    res.status(response.status).json(response.message);
}
const fillResponse = function(response,status, message){
    response.status = status;
    response.message = message;
}
const _verifyToken=function(token){
  return  jwt.verify(token, process.env.SECRET_KEY);
}
const authenticate = function(req,res,next){
    const response = {status: process.env.STATUS_FORBIDDEN, message: process.env.NO_TOKEN_EXIST}
    const headerExists = req.headers.authorization;
    if(headerExists){
        const token = headerExists.split(" ")[1];
        if(_verifyToken(token)){
            next();
        }else{
            fillResponse(response, STATUS_UNAUTHORIZED, process.env.UNAUTHORIZED_MSG);
            sendResponse(res,response);
        }
    }
    else{
        sendResponse(res, response)
    }
    
}

module.exports = {
    authenticate:authenticate
}