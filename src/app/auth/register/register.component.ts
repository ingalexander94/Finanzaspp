import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  cargando : boolean;
  subscription: Subscription = new Subscription();

  constructor(private auth: AuthService, private store:Store<AppState>) { }

  ngOnInit(): void {
     this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit = data => {
    this.auth.crearUsuario(data.nombre, data.email, data.password);
  };

}
