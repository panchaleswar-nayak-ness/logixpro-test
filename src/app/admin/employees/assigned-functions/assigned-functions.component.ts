import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssignService } from 'src/app/assign.service'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-assigned-functions',
  templateUrl: './assigned-functions.component.html',
  styleUrls: []
})
export class AssignedFunctionsComponent  {
  // @Input('isAssignedLookUp') isAssignedLookUp: boolean;
  // @Output() updateAssignedLookUp  = new EventEmitter();
  @Input() assignedFunctions: [];
  @Input() isGroupLookUp: boolean;
  @Output() removeFunction = new EventEmitter();
  @Input() spliceValue:[]=[];
  filterName:any


  spliceArray:any;

  selectedRowIndex = -1;

  // highlight(row){
  //     this.selectedRowIndex = row.id;
  // }
  filterValue:string;

  myControl = new FormControl('');
  filteredOptions: string[];
  employee_fetched_zones: string[] = [];
  group_fetched_unassigned_function:string[] = [];
  userName:any;
  constructor( private employeeService: ApiFuntions, private assignService:AssignService,private dialog: MatDialog) { }


  clearFields(){
      this.filterName='';
  
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    
    this.filterValue = filterValue
    const filteredArray = this.assignedFunctions.filter((option: string) => option.toLowerCase().includes(filterValue))
    
    this.filteredOptions = filterValue ? filteredArray : this.assignedFunctions

  }
  
  
  unassignFunction(permData: any){ 
    // if(permData){
    //   let dialogRef = this.dialog.open(FunctionAllocationComponent, {
    //     height: 'auto',
    //     width: '560px',
    //     autoFocus: '__non_existing_element__',
    
    //     data: {
    //       target: 'unassigned',
    //       function: permData
    //     }
    //   })
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.removeFunction.emit(result);
    //   })
    // }

    if(permData){
  
      let data = {
          target: 'unassigned',
          function: permData
        }
        this.removeFunction.emit(data);
    }
    }
    }
