import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { User } from 'src/app/register/user';
import { Question, Template, RoleType } from 'src/app/template/template';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment.dev';
import { Evaluation } from '../evaluation';

@Component({
  selector: 'app-add-evaluation',
  templateUrl: './add-evaluation.component.html',
  styleUrls: ['./add-evaluation.component.css']
})
export class AddEvaluationComponent implements OnInit {

  @Input() template!:Template;
  evaluation:Evaluation = new Evaluation();
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  name_required=environment.template_name_required;
  question_required=environment.question_required;
  users : User[] = [];
  roleType = RoleType;
  @Output() addEventEmmiter : EventEmitter<Evaluation> = new EventEmitter<Evaluation>();
  constructor(
    private _evaluationService:EvaluationDataService,
    private _userService:UserService,
    private _router:Router,
    private _location:Location) { }

  ngOnInit(): void {
    this.getUsers();
    console.log(this.template);
    this.evaluation.name = this.template.name;
    this.evaluation.template = this.template;
    this.evaluation.questions = [...this.template.questions];

  }



  getUsers(){
    return this._userService.getUsers().subscribe(users=> {this.users = users; console.log(users)});
 
  }

  checkValidName(form:NgForm){
    if(!form.value.name||form.value.name.trim().length <1){
      this.setErrorMessage(environment.template_name_required);
      return false;
    }else{
      return true;
    }
  }
  addEvaluation(form:NgForm){
    if(!this.checkValidName(form)){
      return;
    }

    console.log(this.evaluation);
    this._evaluationService.createEvaluation(this.evaluation).subscribe({
      next: (newEvaluation)=>{ 
      this.setSuccessMessage(newEvaluation);
      this._router.navigate(['/evaluations']);
      },
      error: (err)=>{
        this.setErrorMessage(err.message);
      }
    })
  }


  setSuccessMessage(newEvaluation:Evaluation){
    this.successMessage=newEvaluation.name + environment.success_message;
    this.hasSuccess=true; 
  }
  setErrorMessage(err:string){
    this.errorMessage=err;
    this.hasError=true; 
  }

  goBack(){
    this._location.back();
  }
  cancel(){
    // this._router.navigate(['template/'+this.template._id]);
    this.addEventEmmiter.emit(this.evaluation);
  }
}
