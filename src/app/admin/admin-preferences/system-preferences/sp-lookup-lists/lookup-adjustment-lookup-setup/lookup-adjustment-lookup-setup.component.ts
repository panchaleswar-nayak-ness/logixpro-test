import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-lookup-adjustment-lookup-setup',
  templateUrl: './lookup-adjustment-lookup-setup.component.html',
  styleUrls: []
})
export class LookupAdjustmentLookupSetupComponent implements OnInit {
  userData
adjustmentLookUp :any = new MatTableDataSource([]);
public iAdminApiService: IAdminApiService;
AdjustLookupInput
AddBtn = false
  constructor(private Api:ApiFuntions,
              private global:GlobalService,
              private adminApiService: AdminApiService,
              
              public authService: AuthService,) { 
                this.iAdminApiService = adminApiService;
              }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getadjustmentlookup()
  }

  getadjustmentlookup(){
    this.iAdminApiService.adjustmentlookup().subscribe(res=>{
      
      if(res.isExecuted){
        this.adjustmentLookUp = res.data
        // console.log(this.adjustmentLookUp)
        let tempAdjustLookUp:any = [];
        res.data.forEach((element:any) => {
          let obj = {
            oldVal:element,
            currentVal:element
          };
          tempAdjustLookUp.push(obj)
        });
        this.adjustmentLookUp = new MatTableDataSource(tempAdjustLookUp);
      }
    })
  }


  saveAdjustLookUp(ele){
    let payload = {
      "oldValue":ele.oldVal,
      "newValue":ele.currentVal
    }
    this.iAdminApiService.updateAdjustlookup(payload).pipe(
    
      catchError((error) => {
        return of({ isExecuted: false });

      })

    ).subscribe((res=>{
      if(res.isExecuted){
        this.AddBtn = false
        ele.oldVal = ele.currentVal
        this.global.ShowToastr('success',`Saved Successfully`, 'Error!');
      }
      else{
        this.global.ShowToastr('error',`Adjustment Reason is a duplicate. Save other edited fields and ensure it is not a duplicate before saving.`, 'Error!');
      }
    }))
  }


  addNewAdjust(){
    this.AddBtn = true
    
    let newOBj = {
      oldVal:'',
      currentVal:''
    }
    let temA:any = []
    temA.push(newOBj)
    this.adjustmentLookUp =  new MatTableDataSource(this.adjustmentLookUp.data.concat(temA));
    
  }




  deleteAdjust(ele){
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
          "reason": ele.currentVal
        }
        this.iAdminApiService.deleteAdjustmentLookup(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getadjustmentlookup()
          }
        }))
      }
    })
  }



}
