import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { pluck } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { mostrarAlerta } from '../../alertas';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[] = [];
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.subscription = this.store.select("ingresoEgreso").pipe(
      pluck("items")
    ).subscribe((data: IngresoEgreso[]) => this.items = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  borrarItem = (item: IngresoEgreso) => {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
        .then(()=>{
          mostrarAlerta("success",`${item.descripcion} se ha borrado`);
        })
        .catch((error)=>{
          mostrarAlerta("error",error.message);
        })
  }

}
