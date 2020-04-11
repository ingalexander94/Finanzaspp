import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  correo:string = "alexanderpenaloza3@gmail.com";
  clave:string = "Realmadrid94";
  cargando:boolean;

  constructor(private auth: AuthService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select("ui").subscribe(ui => this.cargando = ui.isLoading);
  }

  onSubmit = data => {
    this.auth.login(data.email, data.password);
  }

}
