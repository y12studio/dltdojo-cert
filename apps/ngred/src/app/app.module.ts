import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MdButtonModule, MdCheckboxModule, MdToolbarModule, MdCardModule} from '@angular/material';

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
    MdButtonModule, MdCheckboxModule, MdToolbarModule,MdCardModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
