import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { SharedModule } from '../common/shared.module';

@NgModule({
  imports: [MaterialModule, SharedModule],
  declarations: [LoginComponent, RegisterComponent],
  providers: [AuthService]
})
export class AuthModule {}
