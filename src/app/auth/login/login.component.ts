import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  correo:string = "alexanderpenaloza3@gmail.com";
  clave:string = "Realmadrid94";

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit = data => {
    this.auth.login(data.email, data.password);
  }

}
