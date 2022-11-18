import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationDataService } from 'src/app/evaluation-data.service';
import { EvaluationResponse, EvaluationResponseList } from 'src/app/evaluation/evaluation';

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.css']
})
export class ResponseListComponent implements OnInit {
 
  evaluationResponses: EvaluationResponse[]=[];
  evaluationResponsesCopy: EvaluationResponse[]=[];
  successMessage!: string;
  hasSuccess = false;
  addFormVisible = false;
  totalCount = 0;
  offset = 0;
  count = 5;
  @Input() id!:string;
  allresp!: EvaluationResponseList;// {evaluationResponses: EvaluationResponse[], _id:string};

  constructor(
    private _evaluationResponseService: EvaluationDataService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.id = this._route.snapshot.params["id"];
    console.log(this.id);
    this.getEvaluationResponses(this.id);
    this.getTotalEvaluationResponseCount(this.id);
  }


  getEvaluationResponses(id:string){
    return this._evaluationResponseService.getEvaluationResponses(id).subscribe(evaluationResponses=> {
      console.log(evaluationResponses);
      this.allresp = evaluationResponses;
      this.evaluationResponsesCopy = this.allresp.evaluationResponses;
      this.evaluationResponses = this.evaluationResponsesCopy.slice(this.offset).slice(0, this.count)

 
  })
}
  getTotalEvaluationResponseCount(id:string){
    return this._evaluationResponseService.getTotalEvaluationResponse(id).subscribe(totalCount=> {this.totalCount = totalCount;});
 
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
 
}
