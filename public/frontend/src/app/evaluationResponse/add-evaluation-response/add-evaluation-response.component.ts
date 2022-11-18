import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { Evaluation, EvaluationResponse } from 'src/app/evaluation/evaluation';
import { Question } from 'src/app/template/template';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-add-evaluation-response',
  templateUrl: './add-evaluation-response.component.html',
  styleUrls: ['./add-evaluation-response.component.css']
})
export class AddEvaluationResponseComponent implements OnInit {
  
  @ViewChild('evaluationResponseForm') evaluationResponseForm!: NgForm;
  evaluation!: Evaluation;
  evaluationResponse = new EvaluationResponse();
  evaluationResponses : EvaluationResponse[] = [];

  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;

  evaluationResponse_email_required = environment.email_required;
 
  questions: Question[] = []; 
  id!:string;
  constructor(
    private _evaluationService:EvaluationDataService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _location:Location) { }

  ngOnInit(): void {
   
    this.id = this._route.snapshot.params["id"];
    this.getEvaluation(this.id);
  }

  getEvaluation(id:string) {
    this._evaluationService.getEvaluation(this.id).subscribe(evaluation=> {
        this.evaluation= evaluation;
        this.questions = [...this.evaluation.questions];
      });
  }
  checkValidForm(){
    if(!this.evaluationResponseForm.value.email){
      this.setErrorMessage(environment.email_required);
      return false;
    }else{
      return true;
    }
  }
  
  addDays(str:string, days:number) {
    const myDate = new Date(str);
    myDate.setDate(myDate.getDate() + days);
    console.log(myDate);
    return myDate;
  }
  
  createEvaluationResponse(){
    if(!this.checkValidForm()){
      return;
    }

    this.evaluationResponse.created_date = new Date();
    this.evaluationResponse.questions = [...this.questions];
    this.evaluationResponse.current_evaluator_email =this.evaluationResponseForm.value.email; 
    this._evaluationService.createEvaluationResponse(this.evaluation._id,this.evaluationResponse).subscribe({
      next: (newEvaluationResponse)=>{ 
      this.setSuccessMessage(newEvaluationResponse);
      this._router.navigate(['/evaluation/'+this.id]);
        },
      error: (err)=>{
        this.setErrorMessage(err);
      }
    })
  }

  setErrorMessage(err:string){
    this.errorMessage=err;
    this.hasError=true; 
  }
  setSuccessMessage(newEvaluation:EvaluationResponse){
    this.successMessage=environment.response_received;
    this.hasSuccess=true; 
  }
  goBack(){
    this._location.back();
  }
}
