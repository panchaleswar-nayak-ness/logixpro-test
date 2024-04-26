import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UniqueConstants } from 'src/app/common/constants/strings.constants';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-weight-scale',
  templateUrl: './weight-scale.component.html',
  styleUrls: ['./weight-scale.scss']
})
export class WeightScaleComponent {

  @Input() weighScale:  FormGroup;
  public userData: any;
  @Output() notifyContextMenu: EventEmitter<any> = new EventEmitter(); 
  filterString : string = UniqueConstants.OneEqualsOne;
  @Input() isActiveTrigger:boolean =false;
  constructor(private sharedService:SharedService,    private contextMenuService : TableContextMenuService,  private filterService:ContextMenuFiltersService) {
    this.filterService.filterString= "";
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

  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
