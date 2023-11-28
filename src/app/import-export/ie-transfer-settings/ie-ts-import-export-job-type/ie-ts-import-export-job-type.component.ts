import { Component } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-ie-ts-import-export-job-type',
  templateUrl: './ie-ts-import-export-job-type.component.html',
  styleUrls: ['./ie-ts-import-export-job-type.component.scss']
})
export class IeTsImportExportJobTypeComponent {

  constructor(private global:GlobalService) { }

  IeImportAllDialog(){
    this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: '550px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

  }

}
