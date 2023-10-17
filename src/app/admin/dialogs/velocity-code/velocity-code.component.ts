import { Component, OnInit , Inject, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs'; 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-velocity-code',
  templateUrl: './velocity-code.component.html',
  styleUrls: []
})

export class VelocityCodeComponent implements OnInit {
  @ViewChildren('vl_name', { read: ElementRef }) vl_name: QueryList<ElementRef>;
  public velocity_code_list: any;
  public velocity_code_list_Res: any;
  public currentVelocity="";
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  @ViewChild('btnSave') button;
  disableEnable=[{index:-1,value:false}];
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    private renderer: Renderer2,
    ) { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.currentVelocity = this.data.vc
    this.getVelocity();
    
  }

  getVelocity(){
    this.iCommonAPI.getVelocityCode().subscribe((res) => {
      this.velocity_code_list_Res = [...res.data];
      this.velocity_code_list = res.data;
      this.disableEnable.shift();
      for(let i=0;i<this.velocity_code_list.length;i++)
      {
      this.disableEnable.push({index:i,value:true});
      }
      setTimeout(() => {
        const inputElements = this.vl_name.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
      }, 100)
     });

  }

  changeDisable(index:any)
  {
    this.disableEnable[index].value=false;
  }

  addVLRow(row:any){
    this.velocity_code_list.unshift([]);
    
    const lastIndex = this.velocity_code_list.length - 1;
    setTimeout(() => {
      const inputElements = this.vl_name.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }
  saveVlCode(vlcode:any, oldVC:any){ 
    if(vlcode){
    let cond = true;
    this.velocity_code_list_Res.forEach(element => {
      if(element == vlcode && cond) { 
        cond = false;
       this.global.ShowToastr('error','Velocity cannot be saved! Another velocity code matches the current. Please save any pending changes before attempting to save this entry.', 'Error!');
       
      }   
    });

    if(cond){

    let paylaod = {
      "oldVelocity": oldVC.toString(),
      "velocity": vlcode
    } 
    this.iCommonAPI.saveVelocityCode(paylaod).subscribe((res) => {
      this.global.ShowToastr('success',labels.alert.success, 'Success!');
      this.getVelocity()
    });
    } 
  } else {
    this.global.ShowToastr('error','Velocity cannot be empty!.', 'Error!');
    console.log("saveVelocityCode");
  }
  }
  dltVlCode(vlCode:any){
    if(vlCode){
      const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
          if(result === 'Yes'){
            let paylaod = {
              "velocity": vlCode
            }
            this.iCommonAPI.dltVelocityCode(paylaod).subscribe((res) => {
              this.global.ShowToastr('success',labels.alert.delete, 'Success!');
        
              this.getVelocity();
              
            });
          }
          else {
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("dltVelocityCode");

          }
      })
    
  }  else {
    this.velocity_code_list.shift();
  }
  }

  deleteVC(event: any){
    
    
    if(event != ''){
      let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-velocity',
          velocity: event
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      this.getVelocity();
      })
    }
    else{
      this.velocity_code_list.shift();
      this.getVelocity();
    }
    
  }

  valueEntered()
  {
    alert("TRIGGERED");
    this.button.nativeElement.disabled = true;
  }

  selectVlCode(selectedVL: any){
    this.dialogRef.close(selectedVL.value);
  }
  clearVlCode(){
    this.dialogRef.close('');
  }

}
