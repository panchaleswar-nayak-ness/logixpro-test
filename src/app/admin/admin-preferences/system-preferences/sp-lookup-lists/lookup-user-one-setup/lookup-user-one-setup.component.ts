import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-lookup-user-one-setup',
  templateUrl: './lookup-user-one-setup.component.html',
  styleUrls: []
})
export class LookupUserOneSetupComponent implements OnInit {
  userF1List :any = new MatTableDataSource([]);
  AddBtn;
  fieldNames:any;
  public iAdminApiService: IAdminApiService;
  constructor(private Api:ApiFuntions,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private adminApiService: AdminApiService,
    public authService: AuthService,private sharedService:SharedService) {
      this.iAdminApiService = adminApiService;
     }
    
  ngOnInit(): void {
    this.getUserFeild1()
    this.sharedService.fieldNameObserver.subscribe(item => {
      this.fieldNames=item;
     });
    
  }
  

  getUserFeild1(){
    let payload = {
      "userField":1
    }
    this.iAdminApiService.userfieldlookup(payload).subscribe(res=>{
      
      if(res.isExecuted){
        this.userF1List = res.data
        let tempuserF1:any = [];
        res.data.forEach((element:any) => {
          let obj = {
            oldVal:element,
            currentVal:element
          };
          tempuserF1.push(obj)
        });
        this.userF1List = new MatTableDataSource(tempuserF1);
    
      }
    })
  }





  saveUserF1(ele){
    let payload = {
      "oldValue": ele.oldVal,
      "newValue": ele.currentVal,
      "userField": 1
    }
    this.iAdminApiService.updateuserfieldlookup(payload).pipe(
    
      catchError((error) => {
        return of({ isExecuted: false });

      })

    ).subscribe((res=>{
      if(res.isExecuted){
        this.AddBtn = false
        ele.oldVal = ele.currentVal
        this.toastr.success(` Saved Successfully`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
      else{
        this.toastr.error(`Field is a duplicate. Save other edited fields and ensure it is not a duplicate before saving.`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    }))
  }





  deleteUserF1(ele){
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'delete',
        actionMessage:` ${ele.currentVal} from the Adjustment Reason lookup list. `
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes'){

        let payload = {
          "value":  ele.currentVal,
          "userField": 1
        }
        this.iAdminApiService.deleteUserfieldLookUp(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getUserFeild1()
          }
        }))
      }
    })
  }


  addNewUserField1(){
    this.AddBtn = true
    
    let newOBj = {
      oldVal:'',
      currentVal:''
    }
    let temA:any = []
    temA.push(newOBj)
    this.userF1List  =  new MatTableDataSource(this.userF1List.data.concat(temA));
    
  }

}
