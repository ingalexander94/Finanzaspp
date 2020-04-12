import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { filter, pluck, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SetItemAction, UnSetItemAction } from './ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})


export class IngresoEgresoService {

  ingresoEgresoListenerSubscrition: Subscription = new Subscription();
  ingresoEgresoItemSubscrition: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private afDB: AngularFirestore, private authService: AuthService) { }

  initIngresoEgresoListener = () => {
    this.ingresoEgresoListenerSubscrition = this.store.select("auth").pipe(
      filter(auth => auth.user != null),
      pluck("user")
    ).subscribe(user => this.ingresoEgresoItem(user.uid));
  }

  ingresoEgresoItem = (uid: string) => {
    this.ingresoEgresoItemSubscrition = this.afDB.collection(`${uid}/ingreso-egreso/item`)
      .snapshotChanges()
      .pipe(
        map(docData => {
          return docData.map((doc: any) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      ).subscribe( (data:any) => {
          this.store.dispatch(new SetItemAction(data));
      });
  }

  
  cancelarSubscriptions = () => {
    this.ingresoEgresoListenerSubscrition.unsubscribe();
    this.ingresoEgresoItemSubscrition.unsubscribe();
    this.store.dispatch(new UnSetItemAction());
  }
  
  crearIngresoEgreso = (ingresoEgreso: IngresoEgreso) => {
    const usuario = this.authService.getUsuario();
    return this.afDB.doc(`${usuario.uid}/ingreso-egreso`).collection("item").add({ ...ingresoEgreso });
  }
  
  borrarIngresoEgreso = (uid: string) => {
    const usuario = this.authService.getUsuario();
    return this.afDB.doc(`${usuario.uid}/ingreso-egreso/item/${uid}`).delete();
  }
  
}
