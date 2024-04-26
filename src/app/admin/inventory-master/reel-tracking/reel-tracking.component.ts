import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms'; 
import { AuthService } from 'src/app/common/init/auth.service';

import { MinReelQtyComponent } from 'src/app/dialogs/min-reel-qty/min-reel-qty.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ToasterType,DialogConstants,Style, UniqueConstants} from 'src/app/common/constants/strings.constants';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';


@Component({
  selector: 'app-reel-tracking',
  templateUrl: './reel-tracking.component.html',
  styleUrls: ['./reel-tracking.component.scss']
})
export class ReelTrackingComponent implements OnInit {
  isChecked = false;
  btnDisabled : boolean = false;
  public iAdminApiService: IAdminApiService;
  @Output() notifyContextMenu: EventEmitter<any> = new EventEmitter(); 
  filterString : string = UniqueConstants.OneEqualsOne;
  @Input() isActiveTrigger:boolean =false;
  constructor(private global:GlobalService,
    private authService: AuthService,
    private sharedService:SharedService,
    private adminApiService: AdminApiService,
    private contextMenuService : TableContextMenuService,
    private filterService:ContextMenuFiltersService
    ) { 
      this.iAdminApiService = adminApiService;
    }
  
    
  @ViewChild('addItemAction') addItemTemp: TemplateRef<any>;
  @Input() reelTracking: FormGroup;
  public userData: any;
  @Input() events: Observable<string>;
  private eventsSubscription: Subscription;
  ngOnInit(): void {
    this.userData = this.authService.userData(); 
    this.eventsSubscription = this.events.subscribe((val) => {
      if(val){
        this.updateReelQty();
      }
 
    })
    this.filterService.filterString="";
  }

  onFocusOutEvent(event: any){
    if (event.target.value == null || event.target.value == '')
     this.reelTracking.patchValue({
      'minimumRTSReelQuantity' : 0
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
 onChangeRTSUpdate(event: any){
  this.btnDisabled = true;
  
  let payload = {
    "itemNumber": this.reelTracking.controls['itemNumber'].value,
    "minimumRTS": this.reelTracking.controls['minimumRTSReelQuantity'].value,
    "includeAutoRTS": event.checked, 
 }
  this.iAdminApiService.UpdateReelQuantity(payload).subscribe((res:any)=>{
    if(res.isExecuted){
      this.sharedService.updateInvMasterState(event,true)
       
      if(event.checked){
        this.global.ShowToastr(ToasterType.Success,res.responseMessage, ToasterTitle.Success);
        
      }
      this.btnDisabled = false;
  }
  else if (res.responseMessage != 'Update Successful'){
    
    this.global.ShowToastr(ToasterType.Error,"Changes not saved!  Please reenter the information.", ToasterTitle.Error);
    console.log("UpdateReelQuantity",res.responseMessage);
  }
  })

  
 }
 updateReelQty(): void {
    const dialogRef:any = this.global.OpenDialog(MinReelQtyComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        minDollarRTS:0,
        thresholdQty:0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
         

        let payload = {
          rtsAmount: result.minDollarRTS,
          rtsQuantity: result.thresholdQty, 
        }
        this.iAdminApiService.UpdateReelAll(payload).subscribe((res:any)=>{

          if(res.isExecuted){

            let payload2 = {
              "itemNumber": this.reelTracking.controls['itemNumber'].value, 
           }

            this.iAdminApiService.RefreshRTS(payload2).subscribe((res:any)=>{
              if (res.isExecuted) {
                this.reelTracking.patchValue({
                  'minimumRTSReelQuantity' : res.data[0]
                });
              } else {
                this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
                console.log("RefreshRTS",res.responseMessage);
              }              
            });            
            
          } else {
            this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
            console.log("UpdateReelAll",res.responseMessage);
          }

          
        });        
      }
    });
  }
  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
