import {Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { AddPickuplevelsComponent } from '../../dialogs/add-pickuplevels/add-pickuplevels.component';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { LiveAnnouncerMessage, StringConditions ,DialogConstants,Style} from 'src/app/common/constants/strings.constants';


export interface PickupLevelDetails {
  pick_level: string;
  start_shelf: string;
  end_shelf: string;
  edit: string;
  delete: string;
}

@Component({
  selector: 'app-employee-pickup-level',
  templateUrl: './employee-pickup-level.component.html',
  styleUrls: ['./employee-pickup-level.component.scss']
})
export class EmployeePickupLevelComponent{
  @Input() pickUplevels: any;
  @Input() grp_data: any;
  @Input() resetField: any;
  @Input() isAdd: boolean;
  @Output() relaodPickUpLvl = new EventEmitter<any>();
  pickUpLevelData: any = [];
  pickupLevelDataSource: any;
  searchPickLvl='';
  isLookup: boolean=false;
  constructor(private _liveAnnouncer: LiveAnnouncer, private global:GlobalService) {}

  @ViewChild(MatSort) sort: MatSort;
  public nextPickLvl:any;

   displayedColumns: string[] = ['pickLevel', 'startShelf', 'endShelf', 'edit'];

  ngOnChanges(changes: SimpleChanges): void { 
    if(this.pickUplevels){
      let max: number = Math.max(0,...this.pickUplevels.map(o => o.pickLevel));
      this.nextPickLvl = max+1;
    }
   if(changes[StringConditions.ResetField]?.currentValue){
    this.searchPickLvl='';
    this.pickupLevelDataSource.filter='';
    this.pickupLevelDataSource.length=0;
   }
       
    this.pickUpLevelData = this.pickUplevels;
    this.pickupLevelDataSource = new MatTableDataSource(this.pickUpLevelData);

    if(changes[StringConditions.isAdd]?.currentValue){
  
      this.isLookup=changes[StringConditions.isAdd][StringConditions.currentValue];
     }else if(changes[StringConditions.isAdd] && !changes[StringConditions.isAdd].currentValue){
      if(this.pickUpLevelData?.length){
        this.pickUpLevelData.length=0;
      }
      this.searchPickLvl='';
        this.pickupLevelDataSource.filter='';
      this.pickupLevelDataSource=[];
      this.isLookup=changes[StringConditions.isAdd][StringConditions.currentValue];
   
     }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pickupLevelDataSource.filter = filterValue.trim().toLowerCase();
  }
  clear(){
    this.searchPickLvl='';
    this.pickupLevelDataSource.filter="";
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.pickupLevelDataSource.sort = this.sort;
  }

  pickUpLevelDialog(){
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddPickuplevelsComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
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
    dialogRef = this.global.OpenDialog(AddPickuplevelsComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
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
    dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
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
