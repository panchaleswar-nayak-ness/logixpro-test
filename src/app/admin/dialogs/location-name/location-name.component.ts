import { Component, OnInit} from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-location-name',
  templateUrl: './location-name.component.html',
  styleUrls: ['./location-name.component.scss']
})
export class LocationNameComponent implements OnInit {
  displayedColumns: string[] = ['check','locationName','actions'];
  userData;
  LocationName;
    locationNames :any = new MatTableDataSource([]);
  save
  constructor(private Api: ApiFuntions,
            public authService: AuthService,
            private toastr: ToastrService,
            public dialogRef: MatDialogRef<any>,
            private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocation()
  }

  getLocation(){ 
    this.Api.LocationNames().subscribe((res=>{
      if(res?.isExecuted){
        
        let tempLocationNames:any = [];
        res.data.forEach((element:any) => {
          let obj = {
            oldVal:element,
            currentVal:element
          };
          tempLocationNames.push(obj)
        });
        this.locationNames = new MatTableDataSource(tempLocationNames);
        
      }
    }))
  }



 delLocation(ele){
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'delete',
        actionMessage:`location name ${ele.currentVal}`
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes'){

        let payload = {
          'username': this.userData.userName,
          "wsid": this.userData.wsid,
          "name": ele.currentVal,
        }
        this.Api.DeleteLocationNames(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getLocation()
          }
        }))
      }
    })
  }

  selectLocation(ele){
      this.dialogRef.close(ele.currentVal)
  }

  clearLocationName(){
    this.dialogRef.close(null)
  }

  saveLocation(ele){
    let payload = {
      'username': this.userData.userName,
      "wsid": this.userData.wsid,
      "oldName":ele.oldVal,
      "newName":ele.currentVal
    }
    this.Api.LocationNamesSave(payload).subscribe((res=>{
      if(res.isExecuted){
        this.toastr.success("Location Name Updated Succesfully", 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
          
        ele.oldVal = ele.currentVal
      }
      else{
        this.toastr.error(`Location Name Not Updated`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    }))
  }

  addNewName(){
    
    let newOBj = {
      oldVal:'',
      currentVal:''
    }
    let temL:any = []
    temL.push(newOBj)
    this.locationNames =  new MatTableDataSource(this.locationNames.data.concat(temL));
    
  }

}
