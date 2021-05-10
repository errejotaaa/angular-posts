import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    FormsModule,
    AuthRoutingModule,
    CommonModule,
    AngularMaterialModule,
  ],
})
export class AuthModule {}
