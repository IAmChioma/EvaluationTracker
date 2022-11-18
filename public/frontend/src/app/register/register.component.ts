import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment.dev';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  #registrationForm!: FormGroup;
  get registrationForm() { return this.#registrationForm; }
  set registrationForm(registrationForm) { this.#registrationForm = registrationForm; }
  successMessage:string=environment.initial_mesage;
  failMessage:string=environment.initial_mesage;
  hasSuccess: boolean =false;
  hasFail: boolean =false;
  infoMessage = environment.registration_info_message;
  username_required = environment.username_required;
  password_required = environment.password_required;
  enter_password = environment.enter_password;
  no_password_match = environment.password_does_not_match;
  password_does_not_match:boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,) {

  }

  ngOnInit(): void {
  this.initializeForm();
  }

  initializeForm(){
    this.registrationForm = this._formBuilder.group({
      name: new FormControl(),
      username: new FormControl('', Validators.required),
      role: new FormControl('USER'),
      password: new FormControl('',  Validators.required),
      repeatPassword: new FormControl('', Validators.required)},
       {validators:this.passwordValidator} )
    ;
  }
  passwordValidator(group: FormGroup) {

    if (group.get('password')?.value !== group.get('repeatPassword')?.value) {
      return {'mismatch': true};
    
    }
    return null;
    
    }


  onSubmit() {

    if(this.registrationForm.errors?.['mismatch']){
      this.setErrorMessage(environment.password_does_not_match);
      return;
    }
    if(!this.registrationForm.valid){
      this.setErrorMessage(environment.registration_required_fields);
      return;
    }


    this._userService.addUser(this.registrationForm.value).subscribe(
      {
        next: ()=>{
          this.setSuccessMessage();
          this.initializeForm();
        },
        error:(err)=>{
          this.setErrorMessage(environment.registration_failed_message);
          console.log(err);
        }
      }
   
      );
  }

  setSuccessMessage(){
    this.hasSuccess = true;
    this.successMessage=environment.registration_success_message;
    this.hasFail=false;
  }

  setErrorMessage(message:string){
    this.hasFail=true;
    this.failMessage= message;
    this.hasSuccess = false;
  }

}

