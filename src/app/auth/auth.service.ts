import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { User } from './register/user.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener = () => {
    this.afAuth.authState.subscribe(console.log);
  }

  crearUsuario = (nombre: string, email: string, password: string) => {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((resp) => {

        const user: User = {
          nombre,
          uid: resp.user.uid,
          email: resp.user.email
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => this.router.navigate(['/']))
      })

      .catch(error => {
        this.mostrarAlerta("error", "La dirección de correo electrónico ya está en uso por otra cuenta.");
      })
  }

  login = (email: string, password: string) => {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log(resp);
        this.router.navigate(['/']);
      })
      .catch(error => {
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


