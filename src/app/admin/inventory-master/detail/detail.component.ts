import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/common/init/auth.service';
import { ItemCategoryComponent } from '../../dialogs/item-category/item-category.component';
import { ItemNumberComponent } from '../../dialogs/item-number/item-number.component';
import { UnitMeasureComponent } from '../../dialogs/unit-measure/unit-measure.component';
import { UpdateDescriptionComponent } from '../../dialogs/update-description/update-description.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { CurrentTabDataService } from '../current-tab-data-service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, StringConditions, ToasterMessages, ToasterTitle, ToasterType, Style,UniqueConstants } from 'src/app/common/constants/strings.constants';
import { AppNames } from 'src/app/common/constants/menu.constants';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<string>;
  @Input() fieldNameDetails: any;
  public iAdminApiService: IAdminApiService;
  @Input() details: FormGroup;
  public userData: any;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter(); 
  @Output() notifyContextMenu: EventEmitter<any> = new EventEmitter(); 
  filterString : string = UniqueConstants.OneEqualsOne;
  @Input() isActiveTrigger:boolean =false;
  sendNotification(notification) {
    this.notifyParent.emit(notification);
  }

  public setVal: boolean = false;
  spliUrl;

  constructor(
    private router: Router,
    private sharedService:SharedService,
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private global:GlobalService,
    private contextMenuService : TableContextMenuService,
    private filterService:ContextMenuFiltersService,
    private currentTabDataService: CurrentTabDataService,
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['fieldNameDetails']) this.fieldNameDetails=changes['fieldNameDetails'];
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.filterService.filterString = "";
    this.setVal = localStorage.getItem('routeFromOrderStatus') === StringConditions.True;
    this.spliUrl=this.router.url.split('/');
    this.eventsSubscription = this.events.subscribe((val) => {
      if(val==='h' && this.details.controls['histCount'].value != 0) this.RedirectInv('TransactionHistory');
      if(val==='v' && this.details.controls['openCount'].value != 0) this.RedirectInv('OpenTransaction');
      if(val==='r' && this.details.controls['procCount'].value != 0) this.RedirectInv('ReprocessTransaction');
    });
  }

  handleInputChange(event: Event) {
    this.sharedService.updateInvMasterState(event,true)
  }

  public openItemNumDialog() {
    let dialogRef:any = this.global.OpenDialog(ItemNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        itemNumber: this.details.controls['itemNumber'].value,
        newItemNumber : '',
        addItem : false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let payLoad = {
          "oldItemNumber": this.details.controls['itemNumber'].value,
          "newItemNumber": result,
        }
        this.iAdminApiService.UpdateItemNumber(payLoad).subscribe((res: any) => {
          this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY] = result;
          if (res.isExecuted) {
            this.details.patchValue({ 'itemNumber' : res.data.newItemNumber });
            this.sendNotification({newItemNumber: res.data.newItemNumber});
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ItemNumberExists,  ToasterTitle.Error);
            console.log("UpdateItemNumber",res.responseMessage);
          }
        })
      }
    });
  }

  public openDescriptionDialog() {
    let dialogRef:any = this.global.OpenDialog(UpdateDescriptionComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        description: this.details.controls[UniqueConstants.Description].value,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sharedService.updateInvMasterState(result,true)
        this.details.patchValue({
          "description" : result.description
        });
      }
    });
  }

  public openCategoryDialog() {
    let dialogRef:any = this.global.OpenDialog(ItemCategoryComponent, {
      height: DialogConstants.auto,
      width: '860px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
        category:this.details.controls['category'].value,
        subCategory:this.details.controls['subCategory'].value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result != true) {
        this.details.patchValue({
          'category': result.category,
          'subCategory': result.subCategory
        });
      }
      this.sharedService.updateInvMasterState(result, true)
    })
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
      this.contextMenuService.updateContextMenuState(event, event.target.value, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }
  public openUmDialog() {
    let dialogRef:any = this.global.OpenDialog(UnitMeasureComponent, {
      height: DialogConstants.auto,
      width: '750px',
      autoFocus: false,
      disableClose:true,
      data: {
        mode: '',
        UOM:this.details.controls['unitOfMeasure'].value
      }
    })
    dialogRef.afterClosed().subscribe(result => {
    if(result != DialogConstants.close){
      this.details.patchValue({
        'unitOfMeasure' : result
      });
    }

       
      this.sharedService.updateInvMasterState(result, true)
    })
  }

  RedirectInv(type){
    if(this.setVal){
      this.router.navigate([]).then((result) => {
        let url = '/#/OrderManager/OrderStatus?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
        window.open(url, UniqueConstants._blank);
      });
    }
    else if(this.spliUrl[1] == AppNames.InductionManager){
      this.router.navigate([]).then(() => {
        let url = '/#/InductionManager/Admin/TransactionJournal?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
        window.open(url, UniqueConstants._blank);
      });
    }
    else{
      this.router.navigate([]).then(() => {
        let url = '/#/admin/transaction?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
        window.open(url, UniqueConstants._self);
      });
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
