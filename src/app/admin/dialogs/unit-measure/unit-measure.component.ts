import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-unit-measure',
  templateUrl: './unit-measure.component.html',
  styleUrls: []
})
export class UnitMeasureComponent implements OnInit {
  @ViewChildren('unit_name', { read: ElementRef }) unit_name: QueryList<ElementRef>;
  public unitOfMeasure_list: any;
  public userData: any;
  enableButton=[{index:-1,value:true}];


  constructor(private dialog: MatDialog,
              private api: ApiFuntions,
              private authService: AuthService,
              private toastr: ToastrService,
              private renderer: Renderer2,
              public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getUOM()
  }
  getUOM(){
    this.enableButton = [];
    this.api.getUnitOfMeasure().subscribe((res) => {
      if (res.isExecuted) {
        this.unitOfMeasure_list = res.data;

        for(let i=0;i<this.unitOfMeasure_list.length;i++)
      {
        this.unitOfMeasure_list.fromDB = true;
        this.enableButton.push({index:i,value:true});
      }
      setTimeout(() => {
        const inputElements = this.unit_name.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
      }, 100)
      }
    });
  }
  addUMRow(row : any){
    this.unitOfMeasure_list.unshift("");
    this.enableButton.push({index:-1,value:true}) 

    const lastIndex = this.unitOfMeasure_list.length - 1;
    setTimeout(() => {
      const inputElements = this.unit_name.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  saveUnitMeasure(um : any, oldUM : any) {

    let cond = true;
    if(um){
    this.unitOfMeasure_list.forEach(element => {
      if(element.toLowerCase() == um.toLowerCase() && cond) {
        cond = false;
       this.toastr.error('Already Exists', 'Error!', {
         positionClass: 'toast-bottom-right',
         timeOut: 2000
       });
       
      }   
    });
  }
    if(um && cond){
    let paylaod = {      
      "newValue": um,
      "oldValue": oldUM.toString(),
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    
    this.api.saveUnitOfMeasure(paylaod).subscribe((res) => {
      if(res.isExecuted){
        this.getUOM();
        this.toastr.success( oldUM.toString()==''?labels.alert.success:labels.alert.update, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
  
    });
  }
  }

  enableDisableButton(i:any)
  {
  this.enableButton[i].value=false;
  }

  dltUnitMeasure(um : any,fromDB:any) {
 
    
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
     if(result === 'Yes'){
      if(um){  //&& fromDB==true
        let paylaod = {
          "newValue": um,
          "username": this.userData.userName,
          "wsid": this.userData.wsid,
        }
        
        this.api.dltUnitOfMeasure(paylaod).subscribe((res) => {
          
          if(res.isExecuted){
            this.getUOM();
          this.toastr.success(labels.alert.delete, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
        });
      } else {
        this.unitOfMeasure_list.shift();
      }
     }
    })








  
  }

  selectUnitMeasure(selectedUM: any){
    this.dialogRef.close(selectedUM);
  }

  clearUnitMeasure(){
    this.dialogRef.close('');
  }

}
