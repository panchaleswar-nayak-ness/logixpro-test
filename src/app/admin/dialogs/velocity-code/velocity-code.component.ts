import { Component, OnInit , Inject, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs'; 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  constructor(
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private renderer: Renderer2,
    ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.currentVelocity = this.data.vc
    this.getVelocity();
    
  }

  getVelocity(){
    this.Api.getVelocityCode().subscribe((res) => {
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
       this.toastr.error('Velocity cannot be saved! Another velocity code matches the current. Please save any pending changes before attempting to save this entry.', 'Error!', {
         positionClass: 'toast-bottom-right',
         timeOut: 2000
       });
       
      }   
    });

    if(cond){

    let paylaod = {
      "oldVelocity": oldVC.toString(),
      "velocity": vlcode,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    } 
    this.Api.saveVelocityCode(paylaod).subscribe((res) => {
      this.toastr.success(labels.alert.success, 'Success!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      this.getVelocity()
    });
    } 
  } else {
    this.toastr.error('Velocity cannot be empty!.', 'Error!', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000
    });
  }
  }
  dltVlCode(vlCode:any){
    if(vlCode){
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
          if(result === 'Yes'){
            let paylaod = {
              "velocity": vlCode,
              "username": this.userData.userName,
              "wsid": this.userData.wsid,
            }
            this.Api.dltVelocityCode(paylaod).subscribe((res) => {
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
        
              this.getVelocity();
              
            });
          }
      })
    
  }  else {
    this.velocity_code_list.shift();
  }
  }

  deleteVC(event: any){
    
    
    if(event != ''){
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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
