import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppState } from '../app.reducers';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { Subscription } from 'rxjs';
import { SetUserAction } from './auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener = () => {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      if (user) {
        this.userSubscription = this.afDB.doc(`${user.uid}/usuario`).valueChanges()
          .subscribe(({ nombre, email, uid }) => {
            const user = new User(nombre, uid, email);
            this.store.dispatch(new SetUserAction(user));
          });
      } else {
        this.userSubscription.unsubscribe();
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
        this.mostrarAlerta("error", "La dirección de correo electrónico ya está en uso por otra cuenta.");
      })
  }

  login = (email: string, password: string) => {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.mostrarAlerta("error", "La contraseña no es válida o el usuario no tiene una contraseña.");
      })
  }

  logout = () => {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
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


  private mostrarAlerta = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon,
      title
    })
  }

}


