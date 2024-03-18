import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { BaseService } from 'src/app/common/services/base-service.service';

type ValidWorkstation = {pcName: string, wsid: string};
interface LinkedResource<T> {
  resource: T;
  _links: {rel: string, href: string}[];
}


@Component({
  selector: 'app-workstation-login',
  templateUrl: './workstation-login.component.html',
  styleUrls: ['./workstation-login.component.scss']
})
export class WorkstationLoginComponent{

  cookieLink: string;
  acknowledgeRisks: boolean = false;
  existingWorkstations: LinkedResource<ValidWorkstation>[] = [];
  selectedWorkstation: LinkedResource<ValidWorkstation>;
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
        this.apiBase.Get<[LinkedResource<ValidWorkstation>]>(this.workstationsEndpoint).subscribe((res: [LinkedResource<ValidWorkstation>]) => {
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
    // let endpoint = this.selectedWorkstation._links.self;
    // actually we need to find the cookie link from the list
    let cookieLink = this.selectedWorkstation._links.find((link) => link.rel == "cookie")!;
    this.apiBase.Get(cookieLink.href).subscribe((res: any) => {
      this.dialogRef.close(this.selectedWorkstation.resource.pcName);
    },
    (err) => {
      console.log(err);
      this.errorMessage = err.error;
      this.showError = true;
    });
  }

  createWorkstation(endpoint: string){
    this.apiBase.Put(endpoint, {PcName: this.wsName}).subscribe((res: any) => {
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
