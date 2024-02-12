import { Component, OnInit } from '@angular/core';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpNumberSelectionComponent } from '../bp-number-selection/bp-number-selection.component';

@Component({
  selector: 'app-bp-full-tote',
  templateUrl: './bp-full-tote.component.html',
  styleUrls: ['./bp-full-tote.component.scss']
})
export class BpFullToteComponent implements OnInit {

  constructor(
    private global:GlobalService
  ) { }

  ngOnInit(): void {
  }
  openNumberSelection(){
    this.global.OpenDialog(BpNumberSelectionComponent, {
      height: 'auto',
      width: '402px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }
}
