import { Component, OnInit,ElementRef,ViewChildren,NgZone,QueryList  } from '@angular/core'; 
import { AuthService } from 'src/app/common/init/auth.service';

import {MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatTableDataSource } from '@angular/material/table';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { StringConditions, ToasterTitle,ToasterMessages, ToasterType ,DialogConstants,UniqueConstants,Style,ColumnDef} from 'src/app/common/constants/strings.constants';
import { take } from 'rxjs/operators';
import labels from 'src/app/common/labels/labels.json';
@Component({
  selector: 'app-location-name',
  templateUrl: './location-name.component.html',
  styleUrls: ['./location-name.component.scss']
})
export class LocationNameComponent implements OnInit {
  @ViewChildren('locationNameInput', { read: ElementRef }) locationNameInputs: QueryList<ElementRef>;
  displayedColumns: string[] = ['check','locationName',ColumnDef.Actions];
  userData;
  LocationName;
  public iAdminApiService: IAdminApiService;
    locationNames :any = new MatTableDataSource([]);
  save
  constructor(
            public authService: AuthService,
            private adminApiService: AdminApiService,
            
            public dialogRef: MatDialogRef<any>,
            private global:GlobalService,
            private ngZone: NgZone
         ) {
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
        actionMessage:` location name ${ele.currentVal}`
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === StringConditions.Yes){

        let payload = { 
          "Location": ele.currentVal,
          
        }
        this.iAdminApiService.DeleteLocationNames(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.global.ShowToastr(ToasterType.Success, ToasterMessages.LocationDeleted, ToasterTitle.Success);
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
    const newName = ele.currentVal.trim().toLowerCase();

    const isDuplicate = this.locationNames.data.some(item =>
      item !== ele && item.currentVal.trim().toLowerCase() === newName
    );
  
    if (isDuplicate) {
     this.global.ShowToastr(
                 ToasterType.Error,
                 ToasterMessages.DuplicateLocation,
                 ToasterTitle.Error
               );
      return;
    }

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

  addNewName() {
    const newId = Date.now().toString();
    const newObj = {
      id: newId,
      oldVal: '',
      currentVal: ''
    };
  
    // Update the data source with the new item
    this.locationNames.data = [newObj, ...this.locationNames.data];
  
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      const inputs = this.locationNameInputs.toArray();
    
      const newInputRef = inputs.find(input =>
        input.nativeElement.getAttribute('data-id') === newId
      );
    
      if (newInputRef) {
        const inputElement = newInputRef.nativeElement as HTMLInputElement;
        inputElement.focus();
        inputElement.select(); // Optional: select text
      }
    });
  }
  
  
  
}
