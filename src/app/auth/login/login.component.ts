import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  correo:string = "";
  clave:string = "";
  cargando:boolean;
  subscription: Subscription = new Subscription();


  constructor(private auth: AuthService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select("ui").subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit = data => {
    this.auth.login(data.email, data.password);
  }

}
