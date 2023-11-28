import { Component, OnInit} from '@angular/core'; 
import { AuthService } from 'src/app/common/init/auth.service';

import {MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { StringConditions, ToasterTitle, ToasterType ,DialogConstants,UniqueConstants,Style} from 'src/app/common/constants/strings.constants';

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
  constructor(
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
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("LocationNames",res.responseMessage);

      }
    }))
  }



 delLocation(ele){
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        action: UniqueConstants.delete,
        actionMessage:`location name ${ele.currentVal}`
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === StringConditions.Yes){

        let payload = { 
          "name": ele.currentVal,
        }
        this.iAdminApiService.DeleteLocationNames(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getLocation()
          }
          else
          {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("DeleteLocationNames:", res.responseMessage);

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
        this.global.ShowToastr(ToasterType.Success,"Location Name Updated Succesfully", ToasterTitle.Success);
          
        ele.oldVal = ele.currentVal
      }
      else{
        this.global.ShowToastr(ToasterType.Error,`Location Name Not Updated`, ToasterType.Error);
        console.log("LocationNamesSave",res.responseMessage);
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
