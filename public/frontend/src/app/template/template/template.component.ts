import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { Evaluation } from 'src/app/evaluation/evaluation';
import { TemplateDataService } from 'src/app/template-data.service';
import { environment } from 'src/environments/environment.dev';
import {  Template } from '../template';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  template:Template = new Template();
  evaluations!: Evaluation[];
  id!: string;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  get isLoggedIn(){return this._authService.isLoggedIn};
  login_to_view= environment.login_to_view;
  showCreateEvaluation = false;
  constructor(
    private _templateService: TemplateDataService, 
    private _evaluationService: EvaluationDataService, 
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthenticationService,
    private _location:Location
    ) {
     }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    if(this.isLoggedIn){this.getTemplate(this.id);
    // this.getEvaluations(this.id);
  }
  }

  getEvaluations(id:string){
    return this._evaluationService.getEvaluationsByTemplateId(id).subscribe(evaluations=> {this.evaluations = evaluations; console.log(evaluations)});
 
  }
  deleteATemplate(id:string){
    return this._templateService.deleteTemplate(id).subscribe(templates=> {
      this._router.navigate(["templates"]);
    })
  }
  getTemplate(id:string) {
    this._templateService.getTemplate(this.id).subscribe(template=> {
        this.template= template;
        console.log(template);
      });
  }

  setSuccessMessage(newTemplate:Template){
    this.successMessage=newTemplate.name + environment.success_message_update;
    this.hasSuccess=true; 
  }
  clearSuccessMessage(){
    this.successMessage="";
    this.hasSuccess=false; 
  }

  setErrorMessage(err:string){
    this.errorMessage=err;
    this.hasError=true; 
  }
  goBack(){
    this._location.back();
  }
  createEvaluation($event:any){
    $event.preventDefault();
    this.showCreateEvaluation = true;
  }

  hideEvaluationForm($event:Evaluation){
    if(!$event){
    this.setSuccessMessage($event);
    setTimeout(()=>{
      this.clearSuccessMessage();
    },1000);
  };
    this.showCreateEvaluation  = false;
    this.getTemplate(this.id);
  }
  deactivateTemplate(id:string){
    const stat={status : "inactive"};
    return this._templateService.deactivateTemplate(id,stat).subscribe(template=> {
      console.log(template);
      this.setSuccessMessage(template);
      setTimeout(()=>{
        this.clearSuccessMessage();
      },1000);
    
      this.getTemplate(this.id);
    });
 
  }
}
