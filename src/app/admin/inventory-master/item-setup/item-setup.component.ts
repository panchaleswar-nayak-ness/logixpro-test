import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CellSizeComponent } from '../../dialogs/cell-size/cell-size.component';
import { VelocityCodeComponent } from '../../dialogs/velocity-code/velocity-code.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GlobalService } from 'src/app/common/services/global.service';
import {  DialogConstants ,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
@Component({
  selector: 'app-item-setup',
  templateUrl: './item-setup.component.html',
  styleUrls: ['./item-setup.component.scss']
})
export class ItemSetupComponent implements OnInit {

  disableSecondaryZone=true;
  @Input() itemSetup: FormGroup;
  
  public userData: any;
  @Output() notifyContextMenu: EventEmitter<any> = new EventEmitter(); 
  filterString : string = UniqueConstants.OneEqualsOne;
  @Input() isActiveTrigger:boolean =false;
  constructor(
    private global: GlobalService, 
    private sharedService: SharedService,
    private filterService:ContextMenuFiltersService,
    private contextMenuService : TableContextMenuService) {}
    ngOnInit(){
      this.filterService.filterString="";
    }
  ngOnChanges(changes: SimpleChanges) {
    this.itemSetup.controls['secondaryPickZone'].disable();
    if (changes['itemSetup'])
      if(changes['itemSetup'].currentValue.value.primaryPickZone==='') this.itemSetup.controls['secondaryPickZone'].disable();  
      else this.itemSetup.controls['secondaryPickZone'].enable();
  }

  getSelected(event){
    if(event.value === ''){
      this.itemSetup.controls['secondaryPickZone'].disable();
      this.itemSetup.controls['secondaryPickZone'].setValue('')
    }
    else this.itemSetup.controls['secondaryPickZone'].enable();
  }

  public openCellSizeDialog(param) {
    let currentValue="";
    if(param == UniqueConstants.cellSize) currentValue  = this.itemSetup.controls[UniqueConstants.cellSize].value;
    else if(param == 'bulkCellSize') currentValue  = this.itemSetup.controls['bulkCellSize'].value;
    else if(param == 'cfCellSize') currentValue  = this.itemSetup.controls['cfCellSize'].value;

    let dialogRef:any = this.global.OpenDialog(CellSizeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
        cs:currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => { 
        if(result != DialogConstants.close){
        if(param == UniqueConstants.cellSize) this.itemSetup.patchValue({ "cellSize" : result });
        else if(param == 'bulkCellSize') this.itemSetup.patchValue({ 'bulkCellSize' : result });
        else if(param == 'cfCellSize') this.itemSetup.patchValue({ 'cfCellSize' : result });
        this.sharedService.updateInvMasterState(result,true)
       }
    });
  } 
  optionSelected(filter : string) {
    this.filterString = filter;
    this.notifyContextMenu.emit(this.filterString);  
    this.isActiveTrigger = false;
  }
  onContextMenu(event: any,   FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) { 
    event.preventDefault()
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, event.target.value ?event.target.value :event.target.textContent, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }
  public openVelocityCodeDialog(param) {
    let currentValue="";
    if(param == UniqueConstants.goldenZone) currentValue = this.itemSetup.controls[UniqueConstants.goldenZone].value;
    else if(param == 'bulkVelocity') currentValue = this.itemSetup.controls['bulkVelocity'].value;
    else if(param == 'cfVelocity') currentValue = this.itemSetup.controls['cfVelocity'].value;
    
    let dialogRef:any = this.global.OpenDialog(VelocityCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
        vc: currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != DialogConstants.close){
        if(param == UniqueConstants.goldenZone) this.itemSetup.patchValue({ 'goldenZone' : result });
        else if(param == 'bulkVelocity') this.itemSetup.patchValue({ 'bulkVelocity' : result });
        else if(param == 'cfVelocity') this.itemSetup.patchValue({ 'cfVelocity' : result });
        this.sharedService.updateInvMasterState(result,true)
      }
    });
  }

  cellQuantityChange() {
    if(parseInt(this.itemSetup.controls['maximumQuantity'].value) < parseInt(this.itemSetup.controls['minimumQuantity'].value)) this.itemSetup.controls['minimumQuantity'].setValue(this.itemSetup.controls['maximumQuantity'].value);
    else if(parseInt(this.itemSetup.controls['bulkMaximumQuantity'].value) < parseInt(this.itemSetup.controls['bulkMinimumQuantity'].value)) this.itemSetup.controls['bulkMinimumQuantity'].setValue(this.itemSetup.controls['bulkMaximumQuantity'].value);
    else if(parseInt(this.itemSetup.controls['cfMaximumQuantity'].value) < parseInt(this.itemSetup.controls['cfMinimumQuantity'].value)) this.itemSetup.controls['cfMinimumQuantity'].setValue(this.itemSetup.controls['cfMaximumQuantity'].value);
  }

  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
  
  handleInputChangeCheckbox(event: MatCheckboxChange) {
    this.sharedService.updateInvMasterState(event,true)
  }

  defaultVal(event, type){
    if(event.target.value === '' || event.target.value === undefined) this.itemSetup.controls[`${type}`].setValue(0);
  }

  limitInputLength(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 9) event.target.value = inputValue.slice(0, 9);
  }
}
