import { Component, OnInit } from '@angular/core';
declare var DltdojoCertLib: any;
// https://github.com/ConsenSys/eth-lightwallet
const lightwallet = DltdojoCertLib.lightwallet;

@Component({
  selector: 'app-ethwallet',
  templateUrl: './ethwallet.component.html',
  styleUrls: ['./ethwallet.component.css']
})
export class EthwalletComponent implements OnInit {

     seed= '';

  constructor() { }

  ngOnInit() {
      this.seed = lightwallet.keystore.generateRandomSeed();
  }

}
