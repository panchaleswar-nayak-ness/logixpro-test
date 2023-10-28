import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-manual-transaction',
  templateUrl: './post-manual-transaction.component.html',
  styleUrls: []
})
export class PostManualTransactionComponent implements OnInit {
  message;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.message=this.data.message;
  }

}
