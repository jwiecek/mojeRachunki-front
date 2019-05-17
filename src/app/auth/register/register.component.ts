import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onRegister(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    const user: User = { email: form.value.email, password: form.value.password };
    this.authService.registerUser(user).subscribe(res => console.log(res));
  }
}
