const { capitalizeFirstChar } = require("../utils");


const duplicateMessage = message =>{
    let output;
    try{
        output = `${capitalizeFirstChar(String(Object.keys(message.keyValue)))}: ${message.keyValue[Object.keys(message.keyValue)]} already exists`;
    }catch(error){
        output= "Unique field already exists"
    }
    return output
}

exports.errorHandler = error => {
    let message = '';
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = duplicateMessage(error);
                break;
            default:
                message = 'Something went wrong';
        }
        return message
    }
    return error;
};