const template = require('./template');
const user = require('./user');
const mongoose = require('mongoose');

const evaluationResponseSchema = new mongoose.Schema({

    questions:[template.questionSchema],
    created_date:{
        type:Date,
        default:Date.now()
    },

    user_id:  {
        type: String
    },
        
    last_edited_date:{
        type:Date
    },

    current_evaluator_email: {
        type: String,
        required: true
      },

    

});
const evaluationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    questions:[template.questionSchema],
    created_date:{
        type:Date,
        default:Date.now()
    },
    locked:{
        type: Boolean,
        default: false
    },
    evaluationType:{
        type: String,
        enum: [user.roleType]
    },
    user_id:  {
        type: String},

    last_edited_date:{
        type:Date
    },
    // evaluator:{
    //     type:String,
    //     required: true
    // },
    // current_evaluator_email: {
    //     type: String,
    //     required: true
    //   },
    template: template.templateSchema,
    // template_id:{
    //     type: String
    // }
    evaluationResponses:[evaluationResponseSchema]

});
mongoose.model(process.env.DB_NAME, evaluationSchema, process.env.DB_COLLECTION_NAME);