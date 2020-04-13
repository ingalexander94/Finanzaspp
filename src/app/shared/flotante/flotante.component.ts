import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-flotante',
  templateUrl: './flotante.component.html',
  styles: [
  ]
})
export class FlotanteComponent implements OnInit {

  mostrar: boolean = false;

  constructor(private auth: AuthService, private ingresoEgresoService:IngresoEgresoService) { }

  ngOnInit(): void {
  }

  logout = () => {
    this.auth.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  };

}
