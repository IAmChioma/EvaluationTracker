import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { TemplateDataService } from 'src/app/template-data.service';
import { environment } from 'src/environments/environment.dev';
import { Template } from '../template';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  get isLoggedIn(){return this._authService.isLoggedIn};
 
  templates!: Template[];
  successMessage!: string;
  hasSuccess = false;
  addFormVisible = false;
  totalCount = 0;
  offset = 0;
  count = 5;
  constructor(
    private _templateService: TemplateDataService,
    private _authService: AuthenticationService
    ) { }

  ngOnInit(): void {
    this.getTemplates();
    this.getTotalTemplateCount();
  }


  getTemplates(){
    return this._templateService.getTemplates().subscribe(templates=> {this.templates = templates; console.log(templates)});
 
  }
  deactivateTemplate(id:string){
    const stat={status : "inactive"};
    return this._templateService.deactivateTemplate(id,stat).subscribe(template=> {

    this.getTemplates();
    this.getTotalTemplateCount();
    this.setSuccessMessage(template);
      setTimeout(()=>{
        this.clearSuccessMessage();
      },1000);
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
  getTotalTemplateCount(){
    return this._templateService.getTotalTemplate().subscribe(totalCount=> {this.totalCount = totalCount;});
 
  }
  showAddForm(){
    this.addFormVisible = !this.addFormVisible;
  }
  resetoffset(){
    this.offset=0;
  }

  getPrev(): void {
    this.offset-=this.count;
    if(this.offset < 0){
      this.offset=0;
    }
    
    this._templateService.getTemplatesByCountAndOffset(this.count, this.offset).subscribe(templates=> {this.templates = templates;});
  }
  getNext(): void {
    this.offset+=this.count;
    this._templateService.getTemplatesByCountAndOffset(this.count, this.offset).subscribe(templates=> {this.templates = templates;});
  }
  getTemplatesBySelectingCount($event:any){
    console.log($event.target.value);
    this.count=parseInt($event.target.value);
    this._templateService.getTemplatesByCountAndOffset(this.count, this.offset).subscribe(templates=>
      {
        this.templates=templates;
        console.log(templates);
        console.log(this.offset);
      });
  }  
}
