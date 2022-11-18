const mongoose = require('mongoose');
const user = require('./user');

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        
    }

});
const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    questions:[questionSchema],
    created_date:{
        type:Date,
        default:Date.now()
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
      },
    deactivated_date:{
        type:Date,
    },

    // evaluationType:{
    //     type: String,
    //     enum: [user.roleType]
    // }

});
mongoose.model(process.env.DB_NAME_TEMPLATE, templateSchema, process.env.DB_COLLECTION_NAME_TEMPLATE);
module.exports = {
    questionSchema,
    templateSchema
}