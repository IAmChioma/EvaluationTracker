import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Evaluation, EvaluationResponse, EvaluationResponseList } from './evaluation/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationDataService {
  baseUrl = "http://localhost:3000/api"
  constructor(private _http:HttpClient, private _authService: AuthenticationService) { }

  getEvaluations():Observable<Evaluation[]>{
    return this._http.get<Evaluation[]>(`${this.baseUrl}/evaluations`);
  }

  getEvaluation(id:string):Observable<Evaluation>{
    return this._http.get<Evaluation>(`${this.baseUrl}/evaluations/${id}`, {headers: {"authorization":"Bearer "+ this._authService.token}});
    
  }

  deleteEvaluation(id:string):Observable<any>{
    return this._http.delete<any>(`${this.baseUrl}/evaluations/${id}`,  {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

  createEvaluation(evaluation:Evaluation):Observable<Evaluation>{
    return this._http.post<Evaluation>(`${this.baseUrl}/evaluations`, evaluation);
  }
  editEvaluation(id:string,evaluation:Evaluation):Observable<Evaluation>{
    return this._http.put<Evaluation>(`${this.baseUrl}/evaluations/${id}`, evaluation);
  };
  getTotalEvaluation():Observable<number>{
    return this._http.get<number>(`${this.baseUrl}/evaluations/totalCount`);
  }
  getEvaluationsByCountAndOffset(count:number, offset:number): Observable<Evaluation[]> {
    return this._http.get<Evaluation[]>(`${this.baseUrl}/evaluations?count=${count}&offset=${offset}`);
  }

  getEvaluationsByTemplateId(id:string): Observable<Evaluation[]> {
    return this._http.get<Evaluation[]>(`${this.baseUrl}/evaluations?search=${id}`);
  }

  createEvaluationResponse(id:string, evaluationResponse:EvaluationResponse):Observable<EvaluationResponse>{
    return this._http.post<EvaluationResponse>(`${this.baseUrl}/evaluations/${id}/evaluationResponses`, evaluationResponse);
  }
  getEvaluationResponses(id:string):Observable<EvaluationResponseList>{
    return this._http.get<EvaluationResponseList>(`${this.baseUrl}/evaluations/${id}/evaluationResponses`);
  }
  getTotalEvaluationResponse(id:string):Observable<number>{
    return this._http.get<number>(`${this.baseUrl}/evaluations/${id}/evaluationResponses/totalCount`);
  }
  getEvaluationResponse(id:string, evaluationResponseId:string):Observable<EvaluationResponse>{
    return this._http.get<EvaluationResponse>(`${this.baseUrl}/evaluations/${id}/evaluationResponses/${evaluationResponseId}`);
  }
  editEvaluationResponse(id:string,evaluationResponseId:string, evaluationResponse:EvaluationResponse):Observable<EvaluationResponse>{
    return this._http.put<EvaluationResponse>(`${this.baseUrl}/evaluations/${id}/evaluationResponses/${evaluationResponseId}`, evaluationResponse);
  }
  deleteEvaluationResponse(id:string, evaluationResponseId:string):Observable<EvaluationResponse>{
    return this._http.delete<EvaluationResponse>(`${this.baseUrl}/evaluations/${id}/evaluationResponses/${evaluationResponseId}`)//,  {headers: {"authorization":"Bearer "+ this._authService.token}});
  }
  lockEvaluation(id:string):Observable<Evaluation>{
    return this._http.put<Evaluation>(`${this.baseUrl}/evaluations/${id}/lock`,{});
  };

}
