import { BrowserModule } from '@angular/platform-browser';
// https://github.com/PillowPillow/ng2-webstorage
import {Ng2Webstorage} from 'ngx-webstorage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { BitcoreComponent } from './bitcore/bitcore.component';
import { EthwalletComponent } from './ethwallet/ethwallet.component';

const appRoutes: Routes = [
  {
    path: 'bitcore',
    component: BitcoreComponent
  },
  {
    path: 'ethwallet',
    component: EthwalletComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    BitcoreComponent,
    EthwalletComponent
  ],
  imports: [
    BrowserModule,
    Ng2Webstorage,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
