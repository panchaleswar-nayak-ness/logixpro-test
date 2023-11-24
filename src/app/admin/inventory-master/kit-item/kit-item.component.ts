import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
 
import labels from 'src/app/common/labels/labels.json';
import { AuthService } from 'src/app/common/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import {  ToasterTitle ,ResponseStrings,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-kit-item',
  templateUrl: './kit-item.component.html',
  styleUrls: ['./kit-item.component.scss']
})
export class KitItemComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['ItemNumber', 'Description', 'SpecialFeatures', 'KitQuantity','Actions'];

  @Input() kitItem: FormGroup;
  public userData: any;
  kitItemsList: any = [];
  dialogItemNumber: any = '';
  dialogDescription: any = '';
  dialogItemNumberDisplay: any = '';
  isFormFilled:any;
  Ikey:any;
  oldNumber="";
  @ViewChild('namebutton', { read: ElementRef, static:false }) nameButton: ElementRef;

 public iAdminApiService: IAdminApiService;

  searchValue: any = '';
  searchList: any;
  isValidForm: boolean = false;

  @ViewChild('additemNumber') addItemNumber: TemplateRef<any>;
  @ViewChild('description') description: TemplateRef<any>;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendNotification(e?) {
    this.notifyParent.emit(e);
  }

  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private adminApiService: AdminApiService,
    
    private authService: AuthService,
    private global:GlobalService,
    private el: ElementRef, 
    private sharedService:SharedService,
    private dialog:MatDialog,
    private Api:ApiFuntions
    ) { this.iCommonAPI = commonAPI; 
      this.iAdminApiService = adminApiService;
    }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.kitItem.controls['kitInventories'].value) {
      this.kitItemsList = [...this.kitItem.controls['kitInventories'].value];
      this.kitItemsList.map(item => {
        item.isSaved = true;
      });
      
    }
  }

  openPrintRangeDialog() {
    this.global.Print(`FileName:printKitReport|ItemNumber:${this.kitItem.value.itemNumber}`)

  }

  addCatRow(e: any) {
    this.kitItemsList.unshift({
      itemNumber: '',
      description: '',
      specialFeatures: '',
      kitQuantity: 0,
      isSaved: false,
      
    });
    this.kitItemsList = [...this.kitItemsList]; 
    
  }

  onRowUpdate(oldVal :any , event: Event, i){
    this.sharedService.updateInvMasterState(event,true)
    if(oldVal !== event){
      this.kitItemsList[i].isSaved = false;
    }
  }

  dltCategory(e: any) {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
     if(result === ResponseStrings.Yes){
      if (e?.itemNumber) {
        let payLoad = {
          "itemNumber": this.kitItem.controls['itemNumber'].value,
          "kitItem": e.itemNumber,
          "kitQuantity": e.kitQuantity,
          "specialFeatures": e.specialFeatures
        }
        this.iAdminApiService.DeleteKit(payLoad).subscribe((res: any) => {
  
          if (res.isExecuted) {
            this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
            this.sendNotification();
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("DeleteKit", res.responseMessage);


          }
  
        })
      } else {
        this.kitItemsList.shift()
      }
     }
    })

    

    

  }


  saveKit(newItem: any, e: any) {

    if (parseInt(e.kitQuantity) <= 0) {
      this.global.ShowToastr(ToasterType.Error,"Kit Quantity should be greater than 0", ToasterTitle.Error);
      return;        
    }

    if (!e.itemNumber || !e.kitQuantity) {            
      this.global.ShowToastr(ToasterType.Error,"Please fill required fields", ToasterTitle.Error);
      return;
    }

    let newRecord = true;
    this.kitItem.controls['kitInventories'].value.forEach(element => {
      if (element.itemNumber == newItem) {
        newRecord = false;
       
      }
    });
    if (e.itemNumber && newRecord && e.kitQuantity) {
      let payLoad = {
        "itemNumber": this.kitItem.controls['itemNumber'].value,
        "kitItem": newItem,
        "kitQuantity": e.kitQuantity,
        "specialFeatures": e.specialFeatures
      }
      this.iAdminApiService.InsertKit(payLoad).subscribe((res: any) => {

        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          this.sendNotification();
        } else {
          this.global.ShowToastr(ToasterType.Error,"Invalid Input", ToasterTitle.Error);
          console.log("InsertKit",res.responseMessage);
        }

      })
    } else if (e.itemNumber && !newRecord && e.kitQuantity) {

      let payLoad = {
        "itemNumber": this.kitItem.controls['itemNumber'].value,
        "oldKitItem": this.oldNumber!=""?this.oldNumber:newItem,
        "newKitItem": newItem,
        "kitQuantity": e.kitQuantity,
        "specialFeatures": e.specialFeatures
      }
      
      this.iAdminApiService.UpdateKit(payLoad).subscribe((res: any) => {

        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          this.sendNotification();
        } else {
          this.global.ShowToastr(ToasterType.Error,"Invalid Input", ToasterTitle.Error);
          console.log("UpdateKit",res.responseMessage);
        }

      })
    }

  }


  
  closeDialog()
  {
    this.dialog.closeAll();
  }

  openAddItemNumDialog(e): void {
    const dialogRef:any = this.global.OpenDialog(this.addItemNumber, {
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((x) => {
      e.isSaved = false;
      if (x) {
        this.oldNumber = e.itemNumber;
        e.itemNumber =  this.dialogItemNumber!=""?this.dialogItemNumber:e.itemNumber;
        e.description = this.dialogDescription!=""?this.dialogDescription:e.description;
        this.isFormFilled = true;
        this.sharedService.updateInvMasterState(x,true)
      }
    })
  }

  openDescriptionDialog(e): void {
    const dialogRef:any = this.global.OpenDialog(this.description, {
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((x) => {

      if (x) {
        e.description =  this.dialogDescription!=""?this.dialogDescription:e.description 
        this.sharedService.updateInvMasterState(x,true)

      }
    })
  }


  getSearchList(e: any) {

    this.searchValue = e.currentTarget.value; 
    let payLoad = {
      "itemNumber": e.currentTarget.value,
      "beginItem": "---",
      "isEqual": false
    }
    this.iCommonAPI.SearchItem(payLoad).subscribe((res: any) => {
      if (res.data) {
        this.searchList = res.data
        if (this.searchList.length > 0) {
          this.isValidForm = false;
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("SearchItem", res.responseMessage);


        }
      }
    });
  }

  onSearchSelect(e: any) {

    if (this.kitItem.controls['itemNumber'].value == e.option.value.itemNumber) {
      this.dialogItemNumber = '';
      this.dialogDescription = '';
      this.global.ShowToastr(ToasterType.Error,"Item " + e.option.value.itemNumber + " cannot belong to itself in a kit.", ToasterTitle.Error);
      this.isValidForm = false
      return;
    } else {

      let alreadyExits = false;
      this.kitItem.controls['kitInventories'].value.forEach(element => {
        if (element.itemNumber == e.option.value.itemNumber) {
          alreadyExits = true;
          
        }
      });
      if (!alreadyExits) {
        this.dialogItemNumber = e.option.value.itemNumber;
        this.dialogDescription = e.option.value.description;
      } else {
        this.isValidForm = false
        this.global.ShowToastr(ToasterType.Error,"Item " + this.dialogItemNumber + " already exists in kit.", ToasterTitle.Error);
        this.dialogItemNumber = '';
        this.dialogDescription = '';
        return;
      }
    }

    if (e.option.value.itemNumber.trim() !== '') {
      this.isValidForm = true
    }
    else {
      this.isValidForm = false;
    }
  }

  displayFn(e) {
    return e?.itemNumber
  }

  submitFunc(){
    this.dialogItemNumberDisplay = '';
  }
  checkIfFilled(val: any, input?: any, index?:any){
    //Work need to be continue from here 
    
    if(this.nameButton.nativeElement.classList.contains('kit_'+index)){
      this.nameButton.nativeElement.disabled = false;
      this.nameButton.nativeElement.classList.remove('mat-button-disabled')
    }
    if(this.nameButton.nativeElement.classList.contains('kit_push_'+index)){ 
      
      this.nameButton.nativeElement.disabled = false;
      this.nameButton.nativeElement.classList.remove('mat-button-disabled')
    }

    if(input === 'kitQuantity'){
      if(val > 0){ 
        this.isFormFilled = true;
      }
    }
     if(input === 'specialFeatures'){
        this.isFormFilled = true;
    }

    if(val.toString().trim() !== ''){
      this.isFormFilled = true;
    } 
    else{
      this.isFormFilled = false;
    }  
  }
  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
