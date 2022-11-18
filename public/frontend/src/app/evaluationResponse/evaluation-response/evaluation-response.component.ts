import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { EvaluationResponse } from 'src/app/evaluation/evaluation';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-evaluation-response',
  templateUrl: './evaluation-response.component.html',
  styleUrls: ['./evaluation-response.component.css']
})
export class EvaluationResponseComponent implements OnInit {

 
  id!: string;
  evaluationResponseId!: string;
  evaluationResponse:EvaluationResponse = new EvaluationResponse();
  edit=false;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  constructor(
    private _evaluationService:EvaluationDataService, 
    private _route:ActivatedRoute,
    private _location: Location,
    private _router: Router

    ) { }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    this.evaluationResponseId = this._route.snapshot.params["evaluationResponseid"];
   this.getEvaluationResponse();
  }
  getEvaluationResponse(){
    this._evaluationService.getEvaluationResponse(this.id, this.evaluationResponseId).subscribe(evaluationResponse=>{this.evaluationResponse=evaluationResponse;console.log(evaluationResponse) })
  }
  goBack(){
    return this._location.back();
  }
  deleteEvaluationResponse(){
    return this._evaluationService.deleteEvaluationResponse(this.id, this.evaluationResponseId).subscribe(evaluations=> {
      this._router.navigate([`evaluation/${this.id}`]);
    })
  }
  showEdit(){
    this.edit= !this.edit;
 }
 reloadEvaluationResponseAndHideForm($event:EvaluationResponse){
  this.setSuccessMessage()
  this.edit  = false;
  this.getEvaluationResponse();
}

setSuccessMessage(){
  this.successMessage=environment.success_message_update;
  this.hasSuccess=true; 
}
setErrorMessage(err:string){
  this.errorMessage=err;
  this.hasError=true; 
}
}
