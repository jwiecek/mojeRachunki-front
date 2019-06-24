import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {}

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const user: User = { email: form.value.email, password: form.value.password };
    this.authService.registerUser(user).subscribe(res => {
      console.log(res);
      if (res) {
        this.authService.login(user).subscribe(userData => {
          if (userData.token) {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }
}
