import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ResponseStrings, ToasterType, ToasterTitle, DialogConstants, UniqueConstants, Style, ColumnDef } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';

@Component({
  selector: 'app-lookup-hot-move',
  templateUrl: './lookup-hot-move.component.html',
  styleUrls: ['./lookup-hot-move.component.scss']
})
export class LookupHotMoveComponent implements OnInit {

  ELEMENT_DATA: any[] = [
    { statuscode: 'Active', codeValue: 'HP001', displaySequence: '1' },
  ];
  public iAdminApiService: IAdminApiService;
  displayedColumns: string[] = ['statuscode', 'codeValue', 'displaySequence', ColumnDef.Actions];
  tableData: any[] = [
    { statuscode: 'Active', codeValue: 'HP001', displaySequence: 1 },
    { statuscode: 'Inactive', codeValue: 'HP002', displaySequence: 2 },
    { statuscode: 'Active', codeValue: 'HP003', displaySequence: 3 },
    { statuscode: 'Inactive', codeValue: 'HP004', displaySequence: 4 },
  ];
  // tableData: any = [];
  OldtableData: any = [];

  AddBtn = false;
  saveCheck = false;

  constructor(
    private global: GlobalService,
    public adminApiService: AdminApiService,
    public authService: AuthService) {
      this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.getHotMoveTable();
  }

  getHotMoveTable() {
    this.iAdminApiService.getLookupTableData("HotMove").subscribe(res => {
      if (res.isExecuted) {
        this.OldtableData = res.data;
        this.tableData = JSON.parse(JSON.stringify(res.data));
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getHotPickData", res.responseMessage);
      }
    });
  }

  addEmptyRow() {
    this.AddBtn = true;
    let newObj = {
      id: null,  // Indicating this is a new entry
      valueName: '',
      value: '',
      sequence: '',
    };
    let temA: any = [];
    temA.push(newObj);
    this.tableData = this.tableData.concat(temA);
  }


  // check(codeValue, ind) {
  //   for (const element of this.OldtableData) {
  //     if (element.codeValue === codeValue) {
  //       this.tableData[ind].IsDisabled = true;
  //       this.global.ShowToastr(ToasterType.Error, `Code value must be unique. Another entry matches it.`, ToasterTitle.Error);
  //       break;
  //     } else {
  //       this.tableData[ind].IsDisabled = false;
  //     }
  //   }
  // }

  saveHotMove(ele, i) {
    let payload = {
      "id": ele.id??0,  // If id is null, it will create a new record
      'ValueName': ele.valueName,
      'Value': ele.value,
      'Sequence': ele.sequence,
      'AppName':ele.appName??'Default',
      'ListName':'HotMove'
    };
  
    // Check if it's a new entry
    if (!ele.id) {
      // Call create API for new entries
      this.iAdminApiService.createLookupTableData(payload).pipe(
        catchError((error) => {
          return of({ isExecuted: false });
        })
      ).subscribe((res => {
        if (res.isExecuted) {
          this.getHotMoveTable() 
          console.log(res);

          this.AddBtn = false;
          ele.IsDisabled = true;
          ele.id = res.newRecordId; // Assuming the response includes the new ID
          this.global.ShowToastr(ToasterType.Success, `Created Successfully`, ToasterTitle.Success);
        }
      }));
    } else {
      // Call update API for existing entries
      this.iAdminApiService.updateLookupTableData(payload).pipe(
        catchError((error) => {
          return of({ isExecuted: false });
        })
      ).subscribe((res => {
        if (res.isExecuted) {
          this.getHotMoveTable() 
          console.log(res);
          this.AddBtn = false;
          ele.IsDisabled = true;
          this.global.ShowToastr(ToasterType.Success, `Updated Successfully`, ToasterTitle.Success);
        }
      }));
    }
  }
  

  deleteHotMove(ele) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        action: UniqueConstants.delete,
        actionMessage: ` ${ele.codeValue} from the Hot Pick list.. `
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === ResponseStrings.Yes) {
       
        this.iAdminApiService.deleteLookupTableData(ele.id).subscribe((res => {
          if (res.isExecuted) {
            this.getHotMoveTable();
          } else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("deleteHotPickData", res.responseMessage);
          }
        }));
      }
    });
  }

}
