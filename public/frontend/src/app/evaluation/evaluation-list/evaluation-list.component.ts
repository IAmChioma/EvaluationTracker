import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { environment } from 'src/environments/environment.dev';
import { Evaluation } from '../evaluation';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.css']
})
export class EvaluationListComponent implements OnInit {
  get isLoggedIn(){return this._authService.isLoggedIn};
  
  evaluations!: Evaluation[];
  successMessage!: string;
  hasSuccess = false;
  addFormVisible = false;
  totalCount = 0;
  offset = 0;
  count = 5;
  constructor(private _evaluationService: EvaluationDataService,  private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getEvaluations();
    this.getTotalEvaluationCount();
  }


  getEvaluations(){
    return this._evaluationService.getEvaluations().subscribe(evaluations=> {this.evaluations = evaluations; console.log(evaluations)});
 
  }
  getTotalEvaluationCount(){
    return this._evaluationService.getTotalEvaluation().subscribe(totalCount=> {this.totalCount = totalCount;});
 
  }

  resetoffset(){
    this.offset=0;
  }

  getPrev(): void {
    this.offset-=this.count;
    if(this.offset < 0){
      this.offset=0;
    }
    
    this._evaluationService.getEvaluationsByCountAndOffset(this.count, this.offset).subscribe(evaluations=> {this.evaluations = evaluations;});
  }
  getNext(): void {
    this.offset+=this.count;
    this._evaluationService.getEvaluationsByCountAndOffset(this.count, this.offset).subscribe(evaluations=> {this.evaluations = evaluations;});
  }
  getEvaluationsBySelectingCount($event:any){
    console.log($event.target.value);
    this.count=parseInt($event.target.value);
    this._evaluationService.getEvaluationsByCountAndOffset(this.count, this.offset).subscribe(evaluations=>
      {
        this.evaluations=evaluations;
        console.log(evaluations);
        console.log(this.offset);
      });
  }
  lock(id:string){
    return this._evaluationService.lockEvaluation(id).subscribe(evaluation=> {

    this.getEvaluations();
    this.getTotalEvaluationCount();
    this.setSuccessMessage(evaluation);
      setTimeout(()=>{
        this.clearSuccessMessage();
      },1000);
    });
 
  }

  setSuccessMessage(evaluation:Evaluation){
    this.successMessage=evaluation.name + environment.success_message_update;
    this.hasSuccess=true; 
  }
  clearSuccessMessage(){
    this.successMessage="";
    this.hasSuccess=false; 
  }  
}
