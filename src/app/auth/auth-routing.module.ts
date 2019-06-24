import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const authRouting: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Logowanie' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Rejestracja' } }
];

@NgModule({
  imports: [RouterModule.forChild(authRouting)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AuthRoutingModule {}
