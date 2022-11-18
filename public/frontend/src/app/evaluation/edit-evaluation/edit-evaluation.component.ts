import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { User } from 'src/app/register/user';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment.dev';
import { Evaluation } from '../evaluation';

@Component({
  selector: 'app-edit-evaluation',
  templateUrl: './edit-evaluation.component.html',
  styleUrls: ['./edit-evaluation.component.css']
})
export class EditEvaluationComponent implements OnInit {
  evaluation:Evaluation = new Evaluation();
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  name_required=environment.template_name_required;
  question_required=environment.question_required;
  users : User[] = [];
  id!:string;
  constructor(
    private _evaluationService:EvaluationDataService,
    private _userService:UserService,
    private _router:Router,
    private _route: ActivatedRoute,
    private _location:Location) { }

  ngOnInit(): void {
    this.getUsers();
    this.id = this._route.snapshot.params["id"];
    this.getEvaluation(this.id);
  }
  getEvaluation(id:string) {
    this._evaluationService.getEvaluation(id).subscribe(evaluation=> {
        this.evaluation= evaluation;
      });
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
    this._evaluationService.editEvaluation(this.id,this.evaluation).subscribe({
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
  
}
