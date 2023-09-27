import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { ItemCategoryComponent } from '../../dialogs/item-category/item-category.component';
import { ItemNumberComponent } from '../../dialogs/item-number/item-number.component';
import { UnitMeasureComponent } from '../../dialogs/unit-measure/unit-measure.component';
import { UpdateDescriptionComponent } from '../../dialogs/update-description/update-description.component'; 
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { CurrentTabDataService } from '../current-tab-data-service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<string>;
  @Input() fieldNameDetails: any;
  @Input() details: FormGroup;  
  public userData: any;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendNotification(e) {
      this.notifyParent.emit(e);
  }

  public setVal: boolean = false;
  spliUrl;
  

  constructor(   
    private Api: ApiFuntions, 
    private router: Router,
    private sharedService:SharedService,
    private authService: AuthService, 
    private dialog: MatDialog,    
    private currentTabDataService: CurrentTabDataService,
    private toastr: ToastrService,) { }
  
    ngOnChanges(changes: SimpleChanges) {
      if(changes['fieldNameDetails']){
        this.fieldNameDetails=changes['fieldNameDetails']
        
      }

      
      }
  ngOnInit(): void {
     
    this.userData = this.authService.userData();
    this.setVal = localStorage.getItem('routeFromOrderStatus') == 'true' ? true : false;
   
    this.spliUrl=this.router.url.split('/');
   
    this.eventsSubscription = this.events.subscribe((val) => {
      if(val==='h' && this.details.controls['histCount'].value!=0){
        this.RedirectInv('TransactionHistory')
      }
      if(val==='v' && this.details.controls['openCount'].value!=0){
        this.RedirectInv('OpenTransaction')
      }
      if(val==='r' && this.details.controls['procCount'].value!=0){
        this.RedirectInv('ReprocessTransaction')
      }
    
    });
  }



  handleInputChange(event: Event) {
    this.sharedService.updateInvMasterState(event,true)
  }
  public openItemNumDialog() {

    let dialogRef = this.dialog.open(ItemNumberComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        itemNumber: this.details.controls['itemNumber'].value,
        newItemNumber : '',
        addItem : false
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        let paylaod = {
          "oldItemNumber": this.details.controls['itemNumber'].value,
          "newItemNumber": result,
          "username": this.userData.userName,
          "wsid": this.userData.wsid
        }
        this.Api.UpdateItemNumber(paylaod).subscribe((res: any) => {
          this.currentTabDataService.savedItem[this.currentTabDataService.INVENTORY] = result;

          if (res.isExecuted) {
            this.details.patchValue({
              'itemNumber' : res.data.newItemNumber
            }); 
            this.sendNotification({newItemNumber: res.data.newItemNumber});
          } else {
            this.toastr.error("Item Number Already Exists.", 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        })
      }

    })
  }

  public openDescriptionDialog() {
    let dialogRef = this.dialog.open(UpdateDescriptionComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        description: this.details.controls['description'].value,
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sharedService.updateInvMasterState(result,true)
        this.details.patchValue({
          'description' : result.description
        });

      }
    })
  }

  public opencategoryDialog() {
    let dialogRef = this.dialog.open(ItemCategoryComponent, {
      height: 'auto',
      width: '860px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result.category!='' && result)
      { 
        this.details.patchValue({        
          'category': result.category      
        });
      }
      if(result.subCategory!='' && result)
      {
        this.details.patchValue({            
          'subCategory': result.subCategory,        
        });
      }
      
      this.sharedService.updateInvMasterState(result,true)
    })
  }
  public openUmDialog() { 
    let dialogRef = this.dialog.open(UnitMeasureComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      ;
      if(result !== '' && result !== true)
      { 
        this.details.patchValue({
          'unitOfMeasure' : result
        });
  
      }
    })
  }


 RedirectInv(type){
  if(this.setVal){
    this.router.navigate([]).then((result) => {
      let url = '/#/OrderManager/OrderStatus?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
      window.open(url, '_blank');
    });
  }
  else if(this.spliUrl[1] == 'InductionManager'){
    this.router.navigate([]).then((result) => {
      let url = '/#/InductionManager/Admin/TransactionJournal?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
      window.open(url, '_blank');
    });
  }
  else{
    this.router.navigate([]).then((result) => {
      let url = '/#/admin/transaction?itemNumber=' + this.details.controls['itemNumber'].value + '&type='+ type.toString().replace(/\+/gi, '%2B');
      window.open(url, '_blank');
    });
  }

  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
