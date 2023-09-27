import { Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {} from 'jquery';

@Component({
  selector: 'app-kanban-zone-allocation-conflict',
  templateUrl: './kanban-zone-allocation-conflict.component.html',
  styleUrls: []
})
export class KanbanZoneAllocationConflictComponent{
allocation;
kanban;
both;

  constructor( public dialogRef: MatDialogRef<any>,) { }


  changeValue(val,type){ 
    if(type == 'allocation'){
      this.allocation = true;
      this.kanban = false;
    }
    else if(type == 'kanban'){
      this.allocation = false;
      this.kanban = true;
    }
    else if(type == 'both'){
      this.allocation = false;
      this.kanban = false;
    }

let data = {
  allocation :this.allocation,
  kanban:this.kanban
}

    this.dialogRef.close(data)
  }


}
