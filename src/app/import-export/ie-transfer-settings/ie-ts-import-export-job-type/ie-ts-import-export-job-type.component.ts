import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-ie-ts-import-export-job-type',
  templateUrl: './ie-ts-import-export-job-type.component.html',
  styleUrls: ['./ie-ts-import-export-job-type.component.scss']
})
export class IeTsImportExportJobTypeComponent implements OnInit {

  constructor(private global:GlobalService,) { }

  ngOnInit(): void {
  }

  IeImportAllDialog(){
    this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '550px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

}
