import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
declare var DltdojoCertLib: any;
// https://github.com/bitpay/bitcore-lib
const bitcorelib = DltdojoCertLib.bitcorelib;
const PrivateKey = bitcorelib.PrivateKey;
// https://github.com/ConsenSys/eth-lightwallet
const lightwallet = DltdojoCertLib.lightwallet;

@Component({
  selector: 'app-bitcore',
  templateUrl: './bitcore.component.html',
  styleUrls: ['./bitcore.component.css']
})
export class BitcoreComponent implements OnInit {

  address = '0x0006';
  key = '0x0002';
  ran = 10;
  seed= '';
  constructor() { }

  ngOnInit() {
    var pkey = new PrivateKey();
    this.address = pkey.toAddress().toString();
    this.key = pkey.toString();
    this.ran = _.random(12, 86);
    this.seed = lightwallet.keystore.generateRandomSeed();
  }

}
