import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { Evaluation, EvaluationResponse } from 'src/app/evaluation/evaluation';
import { Question } from 'src/app/template/template';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-edit-evaluation-response',
  templateUrl: './edit-evaluation-response.component.html',
  styleUrls: ['./edit-evaluation-response.component.css']
})
export class EditEvaluationResponseComponent implements OnInit {
  @Input() evaluationResponse:EvaluationResponse = new EvaluationResponse();
  @Output() editEvaluationResponseEventEmmiter : EventEmitter<EvaluationResponse> = new EventEmitter<EvaluationResponse>();
  
  @ViewChild('evaluationResponseForm') evaluationResponseForm!: NgForm;
  id!:string;
  evaluationReponseid!:string;

  evaluation!: Evaluation;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;

  evaluationResponse_email_required = environment.email_required;
 
  questions: Question[] = []; 
  constructor(
    // private _evaluationResponseService: EvaluationDataService,
    private _route: ActivatedRoute,
    private _evaluationService:EvaluationDataService,
    private _router:Router,
    private _location:Location) { }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    this.evaluationReponseid = this._route.snapshot.params["evaluationResponseid"];
    this.getEvaluationResponse(this.id,this.evaluationReponseid)
  }
  getEvaluationResponse(id:string, respId:string) {
    this._evaluationService.getEvaluationResponse(id, respId).subscribe(evaluationReponse=> {
      console.log(evaluationReponse);
        this.evaluationResponse= evaluationReponse;
        this.questions = [...this.evaluationResponse.questions];
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

    this.evaluationResponse.last_edited_date = new Date();
    this.evaluationResponse.questions = [...this.questions];
    this.evaluationResponse.current_evaluator_email =this.evaluationResponseForm.value.email; 
    this._evaluationService.editEvaluationResponse(this.id,this.evaluationReponseid,this.evaluationResponse).subscribe({
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
