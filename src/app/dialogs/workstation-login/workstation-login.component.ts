import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-workstation-login',
  templateUrl: './workstation-login.component.html',
  styleUrls: ['./workstation-login.component.scss']
})
export class WorkstationLoginComponent{

  wsName:string;
  showError:boolean = false;
  constructor(public dialogRef: MatDialogRef<WorkstationLoginComponent>) { }

  submit(){
    this.dialogRef.close(this.wsName);
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
