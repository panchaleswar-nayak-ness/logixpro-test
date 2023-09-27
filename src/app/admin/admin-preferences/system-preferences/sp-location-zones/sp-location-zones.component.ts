import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { LocationNameComponent } from 'src/app/admin/dialogs/location-name/location-name.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { KanbanZoneAllocationConflictComponent } from 'src/app/admin/dialogs/kanban-zone-allocation-conflict/kanban-zone-allocation-conflict.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-sp-location-zones',
  templateUrl: './sp-location-zones.component.html',
  styleUrls: []
})
export class SpLocationZonesComponent implements OnInit {

  public userData: any;
  arbash = true
  public zone: any;
  public newLocationVal = ''
  public newLocation = false;
  public locationSaveBtn = true

  includeCf:false

  locationzone: any = [];
  duplicatelocationzone: any = [];
  constructor(private Api:ApiFuntions,
    public authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocationZones()
  }
  
  test(zone:any){
    if(zone.allocable  && zone.kanbanZone ){
      let dialogRef = this.dialog.open(KanbanZoneAllocationConflictComponent, {
        height: 'auto',
        width: '56vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => { 
        if (result) {
        zone.allocable = result.allocation
        zone.kanbanZone = result.kanban
          this.zoneChange(zone,false)
        }
      })
    }
  }



  zoneChange(zone: any,check,type?) {
  if(!check){
    if(type==='carousel'){
      if(zone.carousel){
        this.alterParentZones(true,zone.zone)
        if(zone.cartonFlow){
          zone.cartonFlow = false;
        } 
        if(zone.includeCFCarouselPick){
          zone.includeCFCarouselPick=false;
      }
      }else{
        this.alterParentZones(false,zone.zone)
        if(zone.cartonFlow){
          zone.cartonFlow=false;
        }
    
      }
    }
    if(type==='cartonFlow'){
      if(zone.cartonFlow){
        this.alterParentZones(false,zone.zone)
        if(zone.carousel){
          zone.carousel=false
        }
      }
     
    }
    if(type==='includePick'){
        if(zone.includeCFCarouselPick){
          if(!zone.cartonFlow){
            this.alterParentZones(false,zone.zone)
            zone.cartonFlow=true;
          }
          if(zone.carousel){
            zone.carousel=false
          }
         
        }

    }


    
    
    let oldZone: any = this.duplicatelocationzone.filter((x: any) => x.ID == zone.ID)[0].zone;
    let newZone:any = zone.zone;
    let seq = zone.sequence;
    if (newZone == '') {
      this.toastr.error('Zone may not be left blank.  Zone will not be saved until this is fixed.', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
      zone.zone = oldZone
      return
      
    }
    else if (seq < 0 || seq == '') {
      if (seq < 0) {
        this.toastr.error('Sequence must be an integer greater than or equal to 0.  Zone will not be saved until this is fixed.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        return
      }
    }



    let check = oldZone.toLowerCase() != newZone.toLowerCase();
    if(check){
      let test = this.duplicatelocationzone.find((x:any)=>x.zone == newZone) 
      if(test){
        this.toastr.error(`Zone is currently set to be a duplicate. Zone will not be saved until this is fixed.`, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    } 
    let locationzone = JSON.parse(JSON.stringify(zone));
    Object.keys(locationzone).forEach(k => {
      locationzone[k] = '' + locationzone[k];
    });
    const updatedObj = {};
    for (const key in locationzone) {
      const updatedKey = key.charAt(0).toUpperCase() + key.slice(1);
      updatedObj[updatedKey] = locationzone[key];
    }
    
        let payload: any = {
          "oldZone": oldZone,
          "locationZone": updatedObj,
          'username': this.userData.userName,
          "wsid": this.userData.wsid
        };
         
        
        this.Api.LocationZoneSave(payload).subscribe((res=>{
          if(res.isExecuted){
            
          }
        }))
  }
  else{
    return
  }

    
  }

  parentZones:any = [];
  getLocationZones() {

    
    this.Api.LocationZone().subscribe((res => {
      this.locationzone = [];
      res.data.forEach((zone: any, i) => {
        zone.ID = i + 1;
        if(zone.carousel && zone.zone!=''){
          this.parentZones.push(zone.zone);
        }
        this.locationzone.push(zone);
      });
      this.duplicatelocationzone = JSON.parse(JSON.stringify(this.locationzone));

    }));
  }

  LocationName(item:any) {
    let dialogRef = this.dialog.open(LocationNameComponent, {
      height: 'auto',
      width: '786px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        item.locationName = result;
        this.zoneChange(item,false);
      }
      else if(result == null){
        item.locationName = '';
        this.zoneChange(item,false);
      }
    })
  }


  DelLocationZone(zone){
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'delete',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes') {
        let payload = {
          'username': this.userData.userName,
          "wsid": this.userData.wsid,
          "zone": zone
        }
        this.Api.LocationZoneDelete(payload).subscribe((res => {
          
          if (res.isExecuted) {
            this.getLocationZones()
            this.toastr.success("Deleted successfully", 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else{
            this.toastr.error(`Location Zone ${zone} cannot be deleted because there are allocated quantities in an Inventory Map location matching the zone`, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        }))
      }
    });
  }

  alterParentZones(add,item){
    if(add && item != ''){
      let parentzone = this.parentZones
      const isNumberExist = (item, parentzone) => {
        return parentzone.some(element => element === item);
      }; 
      if (!isNumberExist(item, parentzone)){
 
        this.parentZones.push(item) 
      }
    }
    else{


  let newArray = this.parentZones.filter(number => number != item); 
  this.parentZones = newArray
      
    }
  }


  addNewLocation() {
    this.newLocation = true;
  }


  newLocationValue(){
    if(this.newLocationVal != ''){
      this.locationSaveBtn = false
      let test = this.duplicatelocationzone.find((x:any)=>x.zone == this.newLocationVal)
      if(test){
        this.toastr.error('Zone would be a duplicate and cannot be added.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    }
    else{
      this.locationSaveBtn = true
    }


  }

  saveNewLocation() {
    let payload = {
      "zone": this.newLocationVal,
      'username': this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.LocationZoneNewSave(payload).subscribe((res => {
      if (res.isExecuted) {
        this.toastr.success(`Location Zone: ${this.newLocationVal} added succesfully`, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.getLocationZones()
      }
      else {
        this.toastr.error('Cannot insert duplicate Zone', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    }))
  }

  closeNewLocation() {
    this.newLocation = false;
  }
}
