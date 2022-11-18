import { User } from "../register/user";
import { Question, Template } from "../template/template";

export class Evaluation {
    _id:string="";
    name:string="";
    status:string="";
    created_date!:Date;
    deactivated_date!:Date;
    questions:Question[] = [];
    // template_id:string="";
    template: Template = new Template();
    // user!: User;
    user_id: String="";
    evaluationType:string="USER";
    locked!: boolean;


}
export class EvaluationResponse {
    _id:string="";
    current_evaluator_email:string="";
    created_date!:Date;
    last_edited_date!:Date;
    questions:Question[] = [];
    user_id: String="";


}
export class EvaluationResponseList {
    _id:string="";
    evaluationResponses: EvaluationResponse[]=[];


}