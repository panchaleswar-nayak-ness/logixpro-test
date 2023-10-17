import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { LocationNameComponent } from 'src/app/admin/dialogs/location-name/location-name.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

import { KanbanZoneAllocationConflictComponent } from 'src/app/admin/dialogs/kanban-zone-allocation-conflict/kanban-zone-allocation-conflict.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-sp-location-zones',
  templateUrl: './sp-location-zones.component.html',
  styleUrls: []
})
export class SpLocationZonesComponent implements OnInit {
    toggleSwitches = [
    { label: 'Carousel', name: 'carousel', property: 'carousel' },
    { label: 'Staging Zone', name: 'stagingZone', property: 'stagingZone' },
    { label: 'CCS Auto Induct', name: 'includeInTransactions', property: 'includeInTransactions' },
    { label: 'Kanban Zone', name: 'kanbanZone', property: 'kanbanZone' },
    { label: 'Carton Flow', name: 'cartonFlow', property: 'cartonFlow' },
    { label: 'Include Zone in Auto Batch', name: 'includeInAutoBatch', property: 'includeInAutoBatch' },
    { label: 'Dynamic Warehouse', name: 'dynamicWarehouse', property: 'dynamicWarehouse' },
    { label: 'Kanban Replenishment Zone ', name: 'kanbanReplenishmentZone', property: 'kanbanReplenishmentZone' },
    { label: 'Include CF Carousel Pick', name: 'includeCFCarouselPick', property: 'includeCFCarouselPick' },
    { label: 'Allow Pick Allocation', name: 'allocable', property: 'allocable' }
  ];
  formFields = [
    { label: 'Label1', ngModel: 'i.label1' },
    { label: 'Label2', ngModel: 'i.label2' },
    { label: 'Label3', ngModel: 'i.label3' },
    { label: 'Label4', ngModel: 'i.label4' },
  ]
  public userData: any;
  // arbash = true
  public zone: any;
  public newLocationVal = ''
  public newLocation = false;
  public locationSaveBtn = true
  public iAdminApiService: IAdminApiService;
  includeCf:false

  locationzone: any = [];
  duplicatelocationzone: any = [];
  constructor(private Api:ApiFuntions,
    public authService: AuthService,
    private global:GlobalService,
    private adminApiService: AdminApiService,
    ) { 
      this.iAdminApiService = adminApiService;
    }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocationZones()
  }
  
  test(zone:any){
    if(zone.allocable  && zone.kanbanZone ){
      let dialogRef:any = this.global.OpenDialog(KanbanZoneAllocationConflictComponent, {
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
      this.global.ShowToastr('error','Zone may not be left blank.  Zone will not be saved until this is fixed.', 'Error!');
      zone.zone = oldZone
      return
      
    }
    else if (seq < 0 || seq == '') {
      if (seq < 0) {
        this.global.ShowToastr('error','Sequence must be an integer greater than or equal to 0.  Zone will not be saved until this is fixed.', 'Error!');
        return
      }
    }



    let check = oldZone.toLowerCase() != newZone.toLowerCase();
    if(check){
      let test = this.duplicatelocationzone.find((x:any)=>x.zone == newZone) 
      if(test){
        this.global.ShowToastr('error',`Zone is currently set to be a duplicate. Zone will not be saved until this is fixed.`, 'Error!');
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
        };
         
        
        this.iAdminApiService.LocationZoneSave(payload).subscribe((res=>{
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

    
    this.iAdminApiService.LocationZone().subscribe((res => {
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
    let dialogRef:any = this.global.OpenDialog(LocationNameComponent, {
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
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
          "zone": zone
        }
        this.iAdminApiService.LocationZoneDelete(payload).subscribe((res => {
          
          if (res.isExecuted) {
            this.getLocationZones()
            this.global.ShowToastr('success',"Deleted successfully", 'Success!');
          }
          else{
            this.global.ShowToastr('error',`Location Zone ${zone} cannot be deleted because there are allocated quantities in an Inventory Map location matching the zone`, 'Error!');
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
        this.global.ShowToastr('error','Zone would be a duplicate and cannot be added.', 'Error!');
      }
    }
    else{
      this.locationSaveBtn = true
    }


  }

  saveNewLocation() {
    let payload = {
      "zone": this.newLocationVal
    }
    this.iAdminApiService.LocationZoneNewSave(payload).subscribe((res => {
      if (res.isExecuted) {
        this.global.ShowToastr('success',`Location Zone: ${this.newLocationVal} added succesfully`, 'Success!');
        this.getLocationZones()
      }
      else {
        this.global.ShowToastr('error','Cannot insert duplicate Zone', 'Error!');
      }
    }))
  }

  closeNewLocation() {
    this.newLocation = false;
  }
}
