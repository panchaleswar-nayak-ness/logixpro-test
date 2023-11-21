import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-assigned-functions',
  templateUrl: './assigned-functions.component.html',
  styleUrls: ['./assigned-functions.components.scss']
})
export class AssignedFunctionsComponent  {
  @Input() assignedFunctions: [];
  @Input() isGroupLookUp: boolean;
  @Output() removeFunction = new EventEmitter();
  @Input() spliceValue:[]=[];
  filterName:any
  spliceArray:any;
  selectedRowIndex = -1;
  filterValue:string;

  myControl = new FormControl('');
  filteredOptions: string[];
  employee_fetched_zones: string[] = [];
  group_fetched_unassigned_function:string[] = [];
  userName:any;
  constructor( private employeeService: ApiFuntions) { }


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
    if(permData){
  
      let data = {
          target: 'unassigned',
          function: permData
        }
        this.removeFunction.emit(data);
    }
    }
    }
