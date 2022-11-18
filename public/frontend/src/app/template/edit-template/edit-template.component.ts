import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateDataService } from 'src/app/template-data.service';
import { environment } from 'src/environments/environment.dev';
import { Question, Template } from '../template';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
  template:Template = new Template();
  id!: string;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  name_required=environment.template_name_required;
  question_required=environment.question_required;
  questions: Question[] = []; 
  question = "";
  
  constructor(
    private _templateService:TemplateDataService,
     private _router:Router, private _location:Location,
     private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    this.template.questions = [];
    this.getTemplate(this.id);

  }
  getTemplate(id:string) {
    this._templateService.getTemplate(this.id).subscribe(template=> {
        this.template= template;
        this.questions = template.questions;
        console.log(template);
      });
  }
  checkValidQuestions(){
    for( let i=0;i<this.questions.length;i++){
      if(!this.questions[i].question || this.questions[i].question.trim().length < 1){
        this.setErrorMessage(environment.question_required);
        return false;
      }
    }
    return true;
  }

  checkValidName(form:NgForm){
    if(!form.value.name||form.value.name.trim().length <1){
      this.setErrorMessage(environment.template_name_required);
      return false;
    }else{
      return true;
    }
  }
  addTemplate(form:NgForm){
    if(!this.checkValidName(form)){
      return;
    }
    if(!this.checkValidQuestions()){
      return;
    }
    console.log(form.value);
    console.log(this.questions);
    this.template.questions = [...this.questions];
    this._templateService.editTemplate(this.id,this.template).subscribe({
      next: (newTemplate)=>{ 
     this.setSuccessMessage(newTemplate);
      this._router.navigate(['/templates']);
      },
      error: (err)=>{
        this.setErrorMessage(err.message);
      }
    })
  }


  setSuccessMessage(newTemplate:Template){
    this.successMessage=newTemplate.name + environment.success_message;
    this.hasSuccess=true; 
  }
  setErrorMessage(err:string){
    this.errorMessage=err;
    this.hasError=true; 
  }
  addQuestion($event:any){
    $event.preventDefault();
    const question = new Question();
    question.answer = "";
    question.question = this.question;
    this.questions.push(question);
    this.question="";
  }
  removeQuestion(ind:number){
    this.questions.splice(ind,1);
  }
  editQuestion($event:any, ind:number){
    $event.preventDefault();
    this.question =this.questions[ind].question;
    this.questions.splice(ind,1);
  }
  goBack(){
    this._location.back();
  }
}
