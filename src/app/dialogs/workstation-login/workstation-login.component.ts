import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { BaseService } from 'src/app/common/services/base-service.service';

type ValidWorkstation = {pcName: string, wsid: string};

@Component({
  selector: 'app-workstation-login',
  templateUrl: './workstation-login.component.html',
  styleUrls: ['./workstation-login.component.scss']
})
export class WorkstationLoginComponent{

  acknowledgeRisks: boolean = false;
  existingWorkstations: ValidWorkstation[] = [];
  selectedWorkstation: ValidWorkstation;
  advanced: boolean = false;
  wizardIndex: number = 0;
  wsName:string;
  invalidWorkstationName:string
  showError:boolean = false;
  endpointObservable: Observable<string>;
  workstationsEndpoint: string;
  errorMessage: string;
  constructor(
    public dialogRef: MatDialogRef<WorkstationLoginComponent>,
    private api: ApiFuntions,
    private apiBase: BaseService
    ) 
    {
      this.endpointObservable = this.api.GetApiEndpoint("validworkstations");
      this.endpointObservable.subscribe((res: string) => {
        this.workstationsEndpoint = res;
        this.apiBase.Get<[ValidWorkstation]>(this.workstationsEndpoint).subscribe((res: [ValidWorkstation]) => {
          this.existingWorkstations = res;
        });
      });
    }

  submit(){
    if(this.wsName.length == 0){
      this.errorMessage = "Please enter a Workstation Name to continue.";
      this.showError = true;
      return;
    }

    if(this.workstationsEndpoint){
      this.createWorkstation(this.workstationsEndpoint);
    }
    else {
      this.endpointObservable.subscribe((res: string) => {
        this.workstationsEndpoint = res;
        this.createWorkstation(this.workstationsEndpoint);
      });
    }

  }

  submitExisting(){
    // actually we are not submitting anything here, just setting the WorksationId cookie to the wsid and closing the dialog
    document.cookie = `WorkstationId=${this.selectedWorkstation.wsid}; path=/`;
    this.dialogRef.close(this.selectedWorkstation.pcName);
  }

  createWorkstation(endpoint: string){
    this.apiBase.Put(endpoint, {PcName: this.wsName}).subscribe((res: any) => {
      console.log(res); 
      let cookiesString = document.cookie;
      let cookiesArray = cookiesString.split(';');
      let workstationID = cookiesArray.find((cookie) => {
        return cookie.includes("WorkstationId");
      })?.split('=')[1];
      if(workstationID == undefined){
        this.showError = true;
        return;
      }
      this.dialogRef.close(this.wsName);
    },
    (err) => {
      console.log(err);
      this.errorMessage = err.error;
      this.invalidWorkstationName = this.wsName;
      this.showError = true;
    });
  }

  shouldShowError(){
    return this.errorMessage || this.wsName == this.invalidWorkstationName && this.wsName && this.wsName.length > 0;
  }

  close(){
    this.showError = true;
  }

  inputChange(){
    if(this.showError = true){
      this.showError = this.wsName.length == 0;
    }
  }
  
}
