import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';
import { Subscription } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription:Subscription = new Subscription();
  nombreUsuario:string = "Cargando...";
  correoUsuario:string = "Cargando...";


  constructor(private auth: AuthService, private store: Store<AppState>, private ingresoEgresoService:IngresoEgresoService) { }

  ngOnInit(): void {
    this.subscription = this.store.select("auth").pipe(
      pluck("user"),
      filter(user => user != null)
    ).subscribe(user => {
      this.nombreUsuario = user.nombre;
      this.correoUsuario = user.email;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout = () => {
    this.auth.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  };

}
