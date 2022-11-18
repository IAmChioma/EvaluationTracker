import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { EvaluationListComponent } from './evaluation/evaluation-list/evaluation-list.component';
import { AddEvaluationComponent } from './evaluation/add-evaluation/add-evaluation.component';
import { EditEvaluationComponent } from './evaluation/edit-evaluation/edit-evaluation.component';
import { EvaluationComponent } from './evaluation/evaluation/evaluation.component';
import { TemplateListComponent } from './template/template-list/template-list.component';
import { AddTemplateComponent } from './template/add-template/add-template.component';
import { EditTemplateComponent } from './template/edit-template/edit-template.component';
import { TemplateComponent } from './template/template/template.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { EvaluationResponseComponent } from './evaluationResponse/evaluation-response/evaluation-response.component';
import { AddEvaluationResponseComponent } from './evaluationResponse/add-evaluation-response/add-evaluation-response.component';
import { EditEvaluationResponseComponent } from './evaluationResponse/edit-evaluation-response/edit-evaluation-response.component';
import { ResponseListComponent } from './evaluationResponse/response-list/response-list.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    EvaluationListComponent,
    AddEvaluationComponent,
    EditEvaluationComponent,
    EvaluationComponent,
    TemplateListComponent,
    AddTemplateComponent,
    EditTemplateComponent,
    TemplateComponent,
    ErrorComponent,
    ProfileComponent,
    RegisterComponent,
    EvaluationResponseComponent,
    AddEvaluationResponseComponent,
    EditEvaluationResponseComponent,
    ResponseListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path:"",component:HomeComponent},
      {path:"dashboard",component:DashboardComponent},
      {path:"templates",component:TemplateListComponent},
      {path:"create-template",component:AddTemplateComponent},
      {path:"template/:id",component:TemplateComponent},
      {path:"template/:id/edit",component:EditTemplateComponent},
      {path:"evaluations",component:EvaluationListComponent},
      {path:"evaluation/:id",component:EvaluationComponent},
      {path:"evaluation/:id/edit",component:EditEvaluationComponent},
      {path:"create-evaluation",component:AddEvaluationComponent},
      {path:"evaluation/:id/evaluationResponses",component:ResponseListComponent},
      {path:"evaluation/:id/evaluationResponses/create-response",component:AddEvaluationResponseComponent},
      {path:"evaluation/:id/evaluationResponse/:evaluationResponseid",component:EvaluationResponseComponent},
      {path:"evaluation/:id/evaluationResponse/:evaluationResponseid/edit",component:EditEvaluationResponseComponent},
      {path:"register",component: RegisterComponent},
      {path:"profile",component: ProfileComponent},
      {path:'**', component:ErrorComponent}
    ])
  ],
  providers: [{
    provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
