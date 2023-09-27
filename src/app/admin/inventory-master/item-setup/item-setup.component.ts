import { Component, Input, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CellSizeComponent } from '../../dialogs/cell-size/cell-size.component';
import { VelocityCodeComponent } from '../../dialogs/velocity-code/velocity-code.component';
import { SharedService } from 'src/app/services/shared.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-item-setup',
  templateUrl: './item-setup.component.html',
  styleUrls: []
})
export class ItemSetupComponent {

  disableSecondaryZone=true;
  @Input() itemSetup: FormGroup;
  
  public userData: any;
  
  constructor(private dialog: MatDialog, private sharedService:SharedService,    private fb: FormBuilder) {
    
   }



  ngOnChanges(changes: SimpleChanges) {
    this.itemSetup.controls['secondaryPickZone'].disable();
    if (changes['itemSetup']) {
    
      if(changes['itemSetup'].currentValue.value.primaryPickZone===''){
        this.itemSetup.controls['secondaryPickZone'].disable();
        
      }else{
        this.itemSetup.controls['secondaryPickZone'].enable();

      }
    }
    
  }

  getSelected(event){
  
    if(event.value===''){
      this.itemSetup.controls['secondaryPickZone'].disable();
      this.itemSetup.controls['secondaryPickZone'].setValue('')
     
    }else{
      this.itemSetup.controls['secondaryPickZone'].enable();
    }
  }
  public openCellSizeDialog(param) {
    let currentValue="";
    if(param == 'cellSize'){
      currentValue  = this.itemSetup.controls['cellSize'].value
    } else if(param == 'bulkCellSize'){
      currentValue  = this.itemSetup.controls['bulkCellSize'].value
    } else if(param == 'cfCellSize'){
      currentValue  = this.itemSetup.controls['cfCellSize'].value
    }
    let dialogRef = this.dialog.open(CellSizeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
        cs:currentValue
      }
    })
    dialogRef.afterClosed().subscribe(result => {
     
      if(result){
      if(param == 'cellSize'){
        this.itemSetup.patchValue({
          'cellSize' : result
        });
      } else if(param == 'bulkCellSize'){
        this.itemSetup.patchValue({
          'bulkCellSize' : result
        });
      } else if(param == 'cfCellSize'){
        this.itemSetup.patchValue({
          'cfCellSize' : result
        });
      }
      this.sharedService.updateInvMasterState(result,true)
    }


    })
  } 
  public openVelocityCodeDialog(param) {
    let currentValue="";
    if(param == 'goldenZone'){
      currentValue  = this.itemSetup.controls['goldenZone'].value
    } else if(param == 'bulkVelocity'){
      currentValue  = this.itemSetup.controls['bulkVelocity'].value
    } else if(param == 'cfVelocity'){
      currentValue  = this.itemSetup.controls['cfVelocity'].value
    }
    
    let dialogRef = this.dialog.open(VelocityCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
        vc: currentValue
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      if(param == 'goldenZone'){
        this.itemSetup.patchValue({
          'goldenZone' : result
        });
      } else if(param == 'bulkVelocity'){
        this.itemSetup.patchValue({
          'bulkVelocity' : result
        });
      } else if(param == 'cfVelocity'){
        this.itemSetup.patchValue({
          'cfVelocity' : result
        });
      }
      this.sharedService.updateInvMasterState(result,true)
    }
    })

    
  }


  cellQuantityChange(){
    if(this.itemSetup.controls['maximumQuantity'].value < this.itemSetup.controls['minimumQuantity'].value){
      this.itemSetup.controls['minimumQuantity'].setValue(this.itemSetup.controls['maximumQuantity'].value);
    } else if(this.itemSetup.controls['bulkMaximumQuantity'].value < this.itemSetup.controls['bulkMinimumQuantity'].value){
      this.itemSetup.controls['bulkMinimumQuantity'].setValue(this.itemSetup.controls['bulkMaximumQuantity'].value)
    }  else    if(this.itemSetup.controls['cfMaximumQuantity'].value < this.itemSetup.controls['cfMinimumQuantity'].value){
      this.itemSetup.controls['cfMinimumQuantity'].setValue(this.itemSetup.controls['cfMaximumQuantity'].value)
    } 
  }
  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
  handleInputChangeCheckbox(event: MatCheckboxChange) {
    this.sharedService.updateInvMasterState(event,true)
  }
  defaultVal(event,type){
   
    if(event.target.value==='' || event.target.value===undefined){
      this.itemSetup.controls[`${type}`].setValue(0)    
    }
    
  }
  limitInputLength(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 9) {
      event.target.value = inputValue.slice(0, 9);
    }
  }
}
