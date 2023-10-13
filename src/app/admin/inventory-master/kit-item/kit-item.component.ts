import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
 
import labels from '../../../labels/labels.json'
import { AuthService } from 'src/app/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';

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
  dialogitemNumber: any = '';
  dialogDescription: any = '';
  dialogitemNumberDisplay: any = '';
  isFormFilled:any;
  Ikey:any;
  oldNumber="";
  @ViewChild('namebutton', { read: ElementRef, static:false }) namebutton: ElementRef;

 public iAdminApiService: IAdminApiService;

  searchValue: any = '';
  searchList: any;
  isValidForm: boolean = false;

  @ViewChild('additemNumber') additemNumber: TemplateRef<any>;
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
     if(result === 'Yes'){
      if (e?.itemNumber) {
        let paylaod = {
          "itemNumber": this.kitItem.controls['itemNumber'].value,
          "kitItem": e.itemNumber,
          "kitQuantity": e.kitQuantity,
          "specialFeatures": e.specialFeatures
        }
        this.iAdminApiService.DeleteKit(paylaod).subscribe((res: any) => {
  
          if (res.isExecuted) {
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');
            this.sendNotification();
          }
  
        })
      } else {
        this.kitItemsList.shift()
      }
     }
    })

    

    

  }


  saveKit(newItem: any, e: any) {

    if (!e.itemNumber || !e.kitQuantity) {            
      this.global.ShowToastr('error',"Please fill required fields", 'Error!');
      return;
    }

    if (parseInt(e.kitQuantity) <= 0) {
      this.global.ShowToastr('error',"Qty must be greater than 0", 'Error!');
      return;        
    }

    let newRecord = true;
    this.kitItem.controls['kitInventories'].value.forEach(element => {
      if (element.itemNumber == newItem) {
        newRecord = false;
       
      }
    });
    if (e.itemNumber && newRecord && e.kitQuantity) {
      let paylaod = {
        "itemNumber": this.kitItem.controls['itemNumber'].value,
        "kitItem": newItem,
        "kitQuantity": e.kitQuantity,
        "specialFeatures": e.specialFeatures
      }
      this.iAdminApiService.InsertKit(paylaod).subscribe((res: any) => {

        if (res.isExecuted) {
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
          this.sendNotification();
        } else {
          this.global.ShowToastr('error',"Invalid Input", 'Error!');
        }

      })
    } else if (e.itemNumber && !newRecord && e.kitQuantity) {

      let paylaod = {
        "itemNumber": this.kitItem.controls['itemNumber'].value,
        "oldKitItem": this.oldNumber!=""?this.oldNumber:newItem,
        "newKitItem": newItem,
        "kitQuantity": e.kitQuantity,
        "specialFeatures": e.specialFeatures
      }
      
      this.iAdminApiService.UpdateKit(paylaod).subscribe((res: any) => {

        if (res.isExecuted) {
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
          this.sendNotification();
        } else {
          this.global.ShowToastr('error',"Invalid Input", 'Error!');
        }

      })
    }

  }


  
  closeDialog()
  {
    this.dialog.closeAll();
  }

  openAddItemNumDialog(e): void {
    const dialogRef:any = this.global.OpenDialog(this.additemNumber, {
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((x) => {
      e.isSaved = false;
      if (x) {
        this.oldNumber = e.itemNumber;
        e.itemNumber =  this.dialogitemNumber!=""?this.dialogitemNumber:e.itemNumber;
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
    let paylaod = {
      "itemNumber": e.currentTarget.value,
      "beginItem": "---",
      "isEqual": false
    }
    this.iCommonAPI.SearchItem(paylaod).subscribe((res: any) => {
      if (res.data) {
        this.searchList = res.data
        if (this.searchList.length > 0) {
          this.isValidForm = false;
        }
      }
    });
  }

  onSearchSelect(e: any) {

    if (this.kitItem.controls['itemNumber'].value == e.option.value.itemNumber) {
      this.dialogitemNumber = '';
      this.dialogDescription = '';
      this.global.ShowToastr('error',"Item " + e.option.value.itemNumber + " cannot belong to itself in a kit.", 'Error!');
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
        this.dialogitemNumber = e.option.value.itemNumber;
        this.dialogDescription = e.option.value.description;
      } else {
        this.isValidForm = false
        this.global.ShowToastr('error',"Item " + this.dialogitemNumber + " already exists in kit.", 'Error!');
        this.dialogitemNumber = '';
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
    this.dialogitemNumberDisplay = '';
  }
  checkIfFilled(val: any, input?: any, index?:any){
    //Work need to be continue from here 
    
    if(this.namebutton.nativeElement.classList.contains('kit_'+index)){
      this.namebutton.nativeElement.disabled = false;
      this.namebutton.nativeElement.classList.remove('mat-button-disabled')
    }
    if(this.namebutton.nativeElement.classList.contains('kit_push_'+index)){ 
      
      this.namebutton.nativeElement.disabled = false;
      this.namebutton.nativeElement.classList.remove('mat-button-disabled')
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
