import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    const userData: User = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.login(userData).subscribe(res => {
      if (res.token) {
        this.router.navigate(['/']);
      }
    });
  }
}
