import { Component, OnInit , Inject, ViewChild, ElementRef} from '@angular/core';  
import { AuthService } from 'src/app/common/init/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';  
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-om-change-priority',
  templateUrl: './om-change-priority.component.html',
  styleUrls: ['./om-change-priority.component.scss']
})
export class OmChangePriorityComponent implements OnInit {
  @ViewChild('newPri') newPri: ElementRef;
  public orderNumber: any;
  public oldpriority:number;
  public iAdminApiService: IAdminApiService;
  public newpriority:number;
  userData: any;
  constructor(
    private adminApiService: AdminApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<OmChangePriorityComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
   ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.orderNumber = this.data.orderNo;
    this.oldpriority = this.data.priorityTable;
  }

  updatepriority(){

    let payload = {
      "orderNumber": this.orderNumber, 
      "priority": this.newpriority
    }

    this.iAdminApiService.UpdateOSPriority(payload).subscribe((res: any) => {
      if(res.isExecuted){
        this.dialogRef.close(res);
      }
      else{
        this.global.ShowToastr('error',res.responseMessage, 'Error!'); 
      }
    })
   
  }
 
  ngAfterViewInit(): void {
    this.newPri.nativeElement.focus();
  }
}
