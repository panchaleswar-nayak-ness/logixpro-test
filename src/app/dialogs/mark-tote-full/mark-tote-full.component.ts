import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mark-tote-full',
  templateUrl: './mark-tote-full.component.html',
  styleUrls: [],
})
export class MarkToteFullComponent implements OnInit {
  dialog_msg
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.dialog_msg=this.data.message;
  }
}
