import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { BpFullToteComponent } from 'src/app/dialogs/bp-full-tote/bp-full-tote.component';

@Component({
  selector: 'app-bp-verify-bulk-pick',
  templateUrl: './bp-verify-bulk-pick.component.html',
  styleUrls: ['./bp-verify-bulk-pick.component.scss']
})
export class BpVerifyBulkPickComponent implements OnInit {
  @Output() back = new EventEmitter<any>();

  constructor(
    private global:GlobalService
  ) { }

  ngOnInit(): void {
  }

  backButton(){
    this.back.emit();
  }
  openDialog(){
    this.global.OpenDialog(BpFullToteComponent, {
      height: 'auto',
      width: '800px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }

}
