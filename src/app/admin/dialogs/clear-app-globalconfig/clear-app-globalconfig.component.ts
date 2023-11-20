import { Component, OnInit,Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { GlobalService } from 'src/app/common/services/global.service';

import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';


@Component({
  selector: 'app-clear-app-globalconfig',
  templateUrl: './clear-app-globalconfig.component.html',
  styleUrls: []
})
export class ClearAppGlobalconfigComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private global:GlobalService,  private Api:ApiFuntions,private authService:AuthService) { }
 
  userData;
  ngOnInit(): void {
    this.userData = this.authService.userData();
  }
  isChecked = true;
  checkOptions(event: MatCheckboxChange): void {
    if(event.checked){
     this.isChecked = false;
    }
    else{
     this.isChecked = true;
    }
   }

   
  

}
