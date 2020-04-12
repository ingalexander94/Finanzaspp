import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

import { map, filter, tap } from 'rxjs/operators';

import { User } from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppState } from '../app.reducers';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { Subscription } from 'rxjs';
import { SetUserAction, UnSetUserAction } from './auth.actions';
import { mostrarAlerta } from '../alertas';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private subscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener = () => {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      if (user) {
        this.subscription = this.afDB.doc(`${user.uid}/usuario`).valueChanges()
          .pipe(
            filter(user => user != null)
          )
          .subscribe(({ nombre, email, uid }) => {
            const user = new User(nombre, uid, email);
            this.usuario = user;
            this.store.dispatch(new SetUserAction(user));
          });
      } else {
        this.usuario = null;
        this.store.dispatch(new UnSetUserAction());
        this.subscription.unsubscribe();
      }
    });
  }

  crearUsuario = (nombre: string, email: string, password: string) => {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((resp) => {

        const user: User = {
          nombre,
          uid: resp.user.uid,
          email: resp.user.email
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.store.dispatch(new DesactivarLoadingAction());
            this.router.navigate(['/']);
          })
      })

      .catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        mostrarAlerta("error", error.message);
      })
  }

  login = (email: string, password: string) => {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.store.dispatch(new DesactivarLoadingAction());
        mostrarAlerta("success", "Bienvenido!");
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        mostrarAlerta("error", error.message);
      })
  }

  logout = () => {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch(new UnSetUserAction());
  }

  estaAutenticado = () => {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user == null) {
          this.router.navigate(['/login']);
        }
        return user != null;
      })
    );
  }

  getUsuario = () => {
    return { ...this.usuario };
  }

}


