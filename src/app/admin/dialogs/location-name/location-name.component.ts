import { Component, OnInit} from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-location-name',
  templateUrl: './location-name.component.html',
  styleUrls: ['./location-name.component.scss']
})
export class LocationNameComponent implements OnInit {
  displayedColumns: string[] = ['check','locationName','actions'];
  userData;
  LocationName;
  public iAdminApiService: IAdminApiService;
    locationNames :any = new MatTableDataSource([]);
  save
  constructor(private Api: ApiFuntions,
            public authService: AuthService,
            private adminApiService: AdminApiService,
            
            public dialogRef: MatDialogRef<any>,
            private global:GlobalService) {
              this.iAdminApiService = adminApiService;
             }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocation()
  }

  getLocation(){ 
    this.iAdminApiService.LocationNames().subscribe((res=>{
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
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
          "name": ele.currentVal,
        }
        this.iAdminApiService.DeleteLocationNames(payload).subscribe((res=>{ 
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
      "oldName":ele.oldVal,
      "newName":ele.currentVal
    }
    this.iAdminApiService.LocationNamesSave(payload).subscribe((res=>{
      if(res.isExecuted){
        this.global.ShowToastr('success',"Location Name Updated Succesfully", 'Success!');
          
        ele.oldVal = ele.currentVal
      }
      else{
        this.global.ShowToastr('error',`Location Name Not Updated`, 'Error!');
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
