import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromIEModel from './ingreso-egreso.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { AppState } from '../app.reducers';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { mostrarAlerta } from '../alertas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  tipo: fromIEModel.tiposPermitidos = "Ingreso";
  forma: FormGroup;
  cargando: boolean;
  loadingSubscribe: Subscription = new Subscription();

  constructor(private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit(): void {

    this.loadingSubscribe = this.store.select("ui").subscribe(ui => this.cargando = ui.isLoading);

    this.forma = new FormGroup({
      "descripcion": new FormControl("", Validators.required),
      "monto": new FormControl(1, Validators.min(1))
    })

  }

  ngOnDestroy(): void {
    this.loadingSubscribe.unsubscribe();
  }

  crearIngreso() {
    this.store.dispatch(new ActivarLoadingAction());
    const valores = this.forma.value;
    const ingresoEgreso = new IngresoEgreso(valores.descripcion, valores.monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.forma.reset({
          monto: 1
        });
        mostrarAlerta("success", `${this.tipo} registrado con exito`);
      })
      .catch((error) => {
        this.store.dispatch(new DesactivarLoadingAction());
        mostrarAlerta("success", error.message);
      })
  }

}
