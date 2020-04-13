import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(private auth: AuthService) { }

  canActivate(){
    return this.auth.estaAutenticado();
  }

  canLoad(){
    return this.auth.estaAutenticado().pipe(
      take(1)
    );
  }
}
