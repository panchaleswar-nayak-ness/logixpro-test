import { Component, Input,  SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { IConnectionString } from 'src/app/interface/transaction'; 
import { GlobalConfigSetSqlComponent } from 'src/app/admin/dialogs/global-config-set-sql/global-config-set-sql.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-connection-strings',
  templateUrl: './connection-strings.component.html',
  styleUrls: [],
})
export class ConnectionStringsComponent {
  @Input() connectionStringData: IConnectionString[] = [];
  @Output() connectionUpdateEvent = new EventEmitter<string>();
  isAddedNewRow = false;
  isDuplicateAllow=false;
  duplicateIndex;
  constructor(
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

 
  ngOnChanges(changes: SimpleChanges) {
    if (
      
      changes['connectionStringData']['currentValue']['connectionString']
    )
      this.connectionStringData =
        changes['connectionStringData']['currentValue']['connectionString'];
  }

  createObjectNewConn() {
    const newConnString = {} as IConnectionString;
    newConnString.connectionName = '';
    newConnString.databaseName = '';
    newConnString.serverName = '';
    newConnString.isButtonDisable = true;
    newConnString.isSqlButtonDisable = true;
    newConnString.isNewConn = true;
    newConnString.isDuplicate = false;

    return newConnString;
  }
  addConnString() {
    this.isAddedNewRow = true;
    this.connectionStringData.push(this.createObjectNewConn());
  }

  onInputValueChange(event, item, index) {
    if (item.isNewConn) {
      if (
        item.connectionName == '' ||
        item.databaseName == '' ||
        item.serverName == ''
      ) {
        this.connectionStringData[index].isButtonDisable = true;
      } else {
        this.connectionStringData[index].isButtonDisable = false;
      }
    } else if(   item.connectionName == '' ||
    item.databaseName == '' ||
    item.serverName == '')  {
      this.connectionStringData[index].isButtonDisable = true;
    }else{
      this.connectionStringData[index].isButtonDisable = false;

    }
  }
  saveString(item,index?) {
    let indexesToShow:any = [];
    let indexesToHide:any = [];
    this.connectionStringData.forEach((el,i)=>{

        if(i!=index){
        if(el.connectionName===item.connectionName){
          this.duplicateIndex=true
        }else{
          this.duplicateIndex=false
      
        }
      }
    })

    
    if(!this.duplicateIndex){
    
    if (item.isNewConn) {
      this.isAddedNewRow = false;
    }
   
    let payload = {
      OldConnection: item.isNewConn ? 'New' : item.connectionName,
      ConnectionName: item.connectionName,
      DatabaseName: item.databaseName,
      ServerName: item.serverName,
    };
    this.Api
      .ConnectionSave(payload)
      .subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.toastr.success(res.responseMessage, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
        this.connectionStringData[index].isSqlButtonDisable = false;
        this.connectionStringData[index].isButtonDisable = true;

          }else{
            this.toastr.error('A connection by this name already exists', 'Error!!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => {
          this.toastr.error('something went wrong!', 'Error!!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      );
    }else{
      this.toastr.error('A connection by this name already exists', 'Error!!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
    }
  }
  deleteString(item) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      data: {
        mode: 'delete-connection-string',
        connectionName: item.connectionName,
        message: `Connection Name .${item.connectionName}`,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (item.isNewConn) {
        this.isAddedNewRow = false;
      }
      if (res.isExecuted) {
        this.connectionUpdateEvent.emit(res.isExecuted);
      }
    });
  }
  openSqlAuth(item) {

    let payload = {
      ConnectionName: item.connectionName,
    };
    this.Api
      .ConnectionUserPassword(payload)
      .subscribe(
        (res: any) => {
   
          
          if (res.isExecuted) {
         
            const dialogRef = this.dialog.open(GlobalConfigSetSqlComponent, {
              height: 'auto',
              width: '600px',
              autoFocus: '__non_existing_element__',
      disableClose:true,
              data: {
                mode: 'sql-auth-string',
                userName: res.data?.user,
                password: res.data?.password,
                ConnectionName: item.connectionName,
              },
            });
            dialogRef.afterClosed().subscribe((res) => {
              if (res?.isExecuted) {
                this.connectionUpdateEvent.emit(res.isExecuted);
              }
            });
          }
       
  }
)}
   
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
