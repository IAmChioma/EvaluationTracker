import { User } from "../register/user";

export class Question {
    #_id!:string
    question:string="";
    answer:string="";
    get id(){
        return this.#_id;
    }
    set id(id){
         this.#_id=id;
    }

}

export class Template {
    _id:string="";
    name:string="";
    status:string="";
    created_date!:Date;
    deactivated_date!:Date;
    questions:Question[] = [];


}
export class Stat {
    status!:string;
}
// export class Evaluation {
//     _id:string="";
//     name:string="";
//     status:string="";
//     created_date!:Date;
//     deactivated_date!:Date;
//     questions:Question[] = [];
//     template_id:string="";
//     // template: Template = new Template();
//     user: User = new User();
//     evaluationType:string=""


// }
export enum RoleType{
    ADMIN,
    USER,
    STAFF

}
