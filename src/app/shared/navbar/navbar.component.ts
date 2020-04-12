import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';
import { pluck, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  subscription:Subscription = new Subscription();
  nombreUsuario:string = "Cargando...";


  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select("auth").pipe(
      pluck("user"),
      filter(user => user != null),
      pluck("nombre")
    ).subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
