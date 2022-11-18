export class User {
    #_id!:string;
    #name!:string;
    #username!:string;
    #password!:string;
    constructor(){

    }

    get _id(){
        return this.#_id;
    }
    get name(){
        return this.#name;
    }
    get username(){
        return this.#username;
    }
    get password(){
        return this.#password;
    }


    set name(value){
         this.#name=value;
    }
    set username(value){
         this.#username= value;
    }
    set password(value){
         this.#password=value;
    }

}
