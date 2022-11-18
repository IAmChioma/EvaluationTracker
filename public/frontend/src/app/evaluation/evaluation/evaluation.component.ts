import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { environment } from 'src/environments/environment.dev';
import { Evaluation, EvaluationResponse, EvaluationResponseList } from '../evaluation';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit, AfterViewInit {

  evaluation:Evaluation = new Evaluation();
  id!: string;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  get isLoggedIn(){return this._authService.isLoggedIn};
  login_to_view= environment.login_to_view;
  showCreateEvaluationResp = false;
  showEvaluationResp=false;

  evaluationResponses!: EvaluationResponse[];
  evaluationResponsesCopy!: EvaluationResponse[];
  allresp!: EvaluationResponseList;// {evaluationResponses: EvaluationResponse[], _id:string};

  addFormVisible = false;
  totalCount = 0;
  offset = 0;
  count = 5;
  constructor(
    private _evaluationService: EvaluationDataService, 
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthenticationService,
    private _location:Location
    ) {
     }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.showEvaluationResp = true;
    },10)
    
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    if(this.isLoggedIn){
      this.getEvaluation(this.id);
      this.getEvaluationResponses(this.id);
      this.getTotalEvaluationResponseCount(this.id);
    }
  }

  // getEvaluations(id:string){
  //   return this._evaluationService.getEvaluationsByTemplateId(id).subscribe(evaluations=> {this.evaluations = evaluations;});
 
  // }
  deleteEvaluation(id:string){
    return this._evaluationService.deleteEvaluation(id).subscribe(evaluations=> {
      this._router.navigate(["evaluations"]);
    })
  }
  getEvaluation(id:string) {
    this._evaluationService.getEvaluation(this.id).subscribe(evaluation=> {
        this.evaluation= evaluation;
        // console.log(evaluation);
      });
  }

  setSuccessMessage(newEvaluation:Evaluation){
    this.successMessage=newEvaluation.name + environment.success_message_update;
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
  createEvaluationResp($event:any){
    $event.preventDefault();
    this.showCreateEvaluationResp = true;
  }

  hideEvaluationForm($event:Evaluation){
    if(!$event){
    this.setSuccessMessage($event);
    setTimeout(()=>{
      this.clearSuccessMessage();
    },1000);
  };
    this.showCreateEvaluationResp  = false;
    this.getEvaluation(this.id);
  }

  getEvaluationResponses(id:string){
    return this._evaluationService.getEvaluationResponses(id).subscribe(evaluationResponses=> {
      console.log(evaluationResponses);
      this.allresp = evaluationResponses;
      this.evaluationResponsesCopy = this.allresp.evaluationResponses;
      this.evaluationResponses = this.evaluationResponsesCopy.slice(this.offset).slice(0, this.count)
      
      });
 
  }
  getTotalEvaluationResponseCount(id:string){
    return this._evaluationService.getTotalEvaluationResponse(id).subscribe(totalCount=> {this.totalCount = totalCount;});
 
  }

  resetoffset(){
    this.offset=0;
  }

  getPrev(): void {
    this.offset-=this.count;
    if(this.offset < 0){
      this.offset=0;
    }
    
    this.evaluationResponses = this.evaluationResponsesCopy.slice(this.offset).slice(0, this.count)
      
  }
  getNext(): void {
    this.offset+=this.count;
    this.evaluationResponses = this.evaluationResponsesCopy.slice(this.offset).slice(0, this.count)
      
  }
  sortData(arr: EvaluationResponse[]) {
    return arr.sort((a, b) => {
      return <any>new Date(b.created_date) - <any>new Date(a.created_date);
    });
  }

  lock(id:string){
    return this._evaluationService.lockEvaluation(id).subscribe(evaluation=> {
      this.getEvaluation(this.id);
      this.getEvaluationResponses(this.id);
      this.getTotalEvaluationResponseCount(this.id);
    this.setSuccessMessage(evaluation);
      setTimeout(()=>{
        this.clearSuccessMessage();
      },1000);
    });
 
  }

}
