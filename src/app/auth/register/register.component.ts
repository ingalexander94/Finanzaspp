import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  cargando : boolean;

  constructor(private auth: AuthService, private store:Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  onSubmit = data => {
    this.auth.crearUsuario(data.nombre, data.email, data.password);
  };

}
