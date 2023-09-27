import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-lookup-adjustment-lookup-setup',
  templateUrl: './lookup-adjustment-lookup-setup.component.html',
  styleUrls: []
})
export class LookupAdjustmentLookupSetupComponent implements OnInit {
  userData
adjustmentLookUp :any = new MatTableDataSource([]);
AdjustLookupInput
AddBtn = false
  constructor(private Api:ApiFuntions,
              private dialog: MatDialog,
              private toastr: ToastrService,
              public authService: AuthService,) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getadjustmentlookup()
  }

  getadjustmentlookup(){
    this.Api.adjustmentlookup().subscribe(res=>{
      
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
    this.Api.updateAdjustlookup(payload).pipe(
    
      catchError((error) => {
        return of({ isExecuted: false });

      })

    ).subscribe((res=>{
      if(res.isExecuted){
        this.AddBtn = false
        ele.oldVal = ele.currentVal
        this.toastr.success(`Saved Successfully`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
      else{
        this.toastr.error(`Adjustment Reason is a duplicate. Save other edited fields and ensure it is not a duplicate before saving.`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
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
          "reason": ele.currentVal
        }
        this.Api.deleteAdjustmentLookup(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getadjustmentlookup()
          }
        }))
      }
    })
  }



}
