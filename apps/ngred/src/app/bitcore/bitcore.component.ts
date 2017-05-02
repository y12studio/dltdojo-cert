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
  raddress = '0x0006';
  key = '0x0002';
  revokeKey = '0x0002';
  ran = 10;
  seed= '';
  certificateAdminJson = {};
  constructor() { }

  ngOnInit() {
    var pkey = new PrivateKey();
    var rkey = new PrivateKey();
    this.address = pkey.toAddress().toString();
    this.raddress = rkey.toAddress().toString();
    this.key = pkey.toWIF();
    this.revokeKey = rkey.toWIF();
    this.ran = _.random(12, 86);
    this.seed = lightwallet.keystore.generateRandomSeed();
    this.certificateAdminJson = {seed:this.seed, issueKey: this.key, issueAddress:this.address, revokeAddress: this.raddress,revokeKey: this.revokeKey}
  }

  ckDownload(event) {
    this.download("certificate-admin.json", JSON.stringify(this.certificateAdminJson, null, ' '), "application/json")
  }

  download(fileName: string, content: string, mimeType: string) {
    // for Excel, we need \ufeff at the start
    // http://stackoverflow.com/questions/17879198/adding-utf-8-bom-to-string-blob
    var blobObject = new Blob(["\ufeff", content], {
      type: mimeType
    });
    // Internet Explorer
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blobObject, fileName);
    } else {
      // Chrome
      var downloadLink = document.createElement("a");
      downloadLink.href = (<any>window).URL.createObjectURL(blobObject);
      (<any>downloadLink).download = fileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
}
