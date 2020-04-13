import { Component, OnInit } from '@angular/core';
import { IngresoEgresoService } from '../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  ancho: number = 0;

  constructor( private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresoEgresoService.initIngresoEgresoListener();
    this.verificarResponsivo();
  }

  verificarResponsivo = ()=> {
    this.ancho = screen.width;
  }

}
