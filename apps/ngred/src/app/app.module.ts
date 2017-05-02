import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { BitcoreComponent } from './bitcore/bitcore.component';
import { EthwalletComponent } from './ethwallet/ethwallet.component';

@NgModule({
  declarations: [
    AppComponent,
    BitcoreComponent,
    EthwalletComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([
     {
       path: 'bitcore',
       component: BitcoreComponent
   },
   {
     path: 'ethwallet',
     component: EthwalletComponent
   }
 ]),
    HttpModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
