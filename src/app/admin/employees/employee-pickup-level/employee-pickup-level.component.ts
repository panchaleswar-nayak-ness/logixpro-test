import {Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AddPickuplevelsComponent } from '../../dialogs/add-pickuplevels/add-pickuplevels.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';


export interface PickupLevelDetails {
  pick_level: string;
  start_shelf: string;
  end_shelf: string;
  edit: string;
  delete: string;
}

// employee_details table data


@Component({
  selector: 'app-employee-pickup-level',
  templateUrl: './employee-pickup-level.component.html',
  styleUrls: []
})
export class EmployeePickupLevelComponent{
  @Input() pickUplevels: any;
  @Input() grp_data: any;
  @Input() resetField: any;
  @Input() isAdd: boolean;
  @Output() relaodPickUpLvl = new EventEmitter<any>();
  pickup_level_data: any = [];
  pickup_level_data_source: any;
  searchPickLvl='';
  isLookup: boolean=false;
  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort;
  public nextPickLvl:any;

   displayedColumns: string[] = ['pickLevel', 'startShelf', 'endShelf', 'edit'];



  ngOnChanges(changes: SimpleChanges): void { 
    if(this.pickUplevels){
      let max: number = Math.max(0,...this.pickUplevels.map(o => o.pickLevel));
      this.nextPickLvl = max+1;
    }
   if(changes['resetField']?.currentValue){
    this.searchPickLvl='';
    this.pickup_level_data_source.filter='';
    this.pickup_level_data_source.length=0;
   }
   
    
    this.pickup_level_data = this.pickUplevels;
    this.pickup_level_data_source = new MatTableDataSource(this.pickup_level_data);

    if(changes['isAdd']?.currentValue){
  
      this.isLookup=changes['isAdd']['currentValue'];
     }else if(changes['isAdd'] && !changes['isAdd'].currentValue){
      if(this.pickup_level_data?.length){
        this.pickup_level_data.length=0;
      }
      this.searchPickLvl='';
        this.pickup_level_data_source.filter='';
      this.pickup_level_data_source=[];
      this.isLookup=changes['isAdd']['currentValue'];
   
     }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pickup_level_data_source.filter = filterValue.trim().toLowerCase();
  }
  clear(){
    this.searchPickLvl='';
    this.pickup_level_data_source.filter="";
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.pickup_level_data_source.sort = this.sort;
  }

  pickUpLevelDialog(){
    let dialogRef;
    dialogRef = this.dialog.open(AddPickuplevelsComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{
        nextPickLvl:this.nextPickLvl,
        userName:this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
        this.relaodPickUpLvl.emit(result);
    })
  }
  editPickLevel(pickLevelData){
    let dialogRef;
    dialogRef = this.dialog.open(AddPickuplevelsComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{
        mode: 'edit',
        pickLevelData:pickLevelData,
        userName:this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
        this.relaodPickUpLvl.emit(result);
    })
  }

  deletePickLevel(picklevel){
    let dialogRef;
    dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-picklevel',
        picklevel: picklevel,
        userName:this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.relaodPickUpLvl.emit(result);
     })
    
  }


}
