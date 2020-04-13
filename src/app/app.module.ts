import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Modulos
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

// Reducers
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducersCombinados } from './app.reducers';

// Modulos personalizados
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'Finanzapp'),
    AngularFirestoreModule,
    StoreModule.forRoot(reducersCombinados),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
