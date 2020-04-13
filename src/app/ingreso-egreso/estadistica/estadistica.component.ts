import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { pluck } from 'rxjs/operators';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number = 0;
  egresos: number = 0;
  cuantosIngresos: number = 0;
  cuantosEgresos: number = 0;

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];
  public chartColors: any[] = [{ backgroundColor: ["#28a745", "#dc3545"] }];

  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select("ingresoEgreso").pipe(
      pluck("items")
    ).subscribe((items: IngresoEgreso[]) => {
      for (const item of items) {
        if (item.tipo === "Ingreso") {
          this.cuantosIngresos++;
          this.ingresos += item.monto;
        } else if (item.tipo === "Egreso") {
          this.cuantosEgresos++;
          this.egresos += item.monto;
        }
      }
      this.doughnutChartData = [this.ingresos, this.egresos];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
