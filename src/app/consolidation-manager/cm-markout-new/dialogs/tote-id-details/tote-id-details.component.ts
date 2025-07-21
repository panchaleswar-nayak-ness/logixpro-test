import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PickTotes } from '../../models/cm-markout-new-models';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-tote-id-details',
  templateUrl: './tote-id-details.component.html',
  styleUrls: ['./tote-id-details.component.scss']
})
export class ToteIdDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: PickTotes,public global : GlobalService,) { }

  ngOnInit(): void {
   
  }

}
