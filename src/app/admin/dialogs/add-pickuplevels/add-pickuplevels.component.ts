import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import labels from 'src/app/common/labels/labels.json';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,StringConditions } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-add-pickuplevels',
  templateUrl: './add-pickuplevels.component.html',
  styleUrls: ['./add-pickuplevels.component.scss']
})
export class AddPickuplevelsComponent implements OnInit {
  @ViewChild('start_shelf') start_shelf: ElementRef;
  form_heading: string = 'Add Pick Level';
  form_btn_label: string = StringConditions.AddCaps;
  levelId: any;
  startShelf: string;
  endShelf: string;
  picklvl: any;
  startCarousel: string;
  endCarousel: string;
  isValidForm: boolean = true;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private global: GlobalService,
    private adminApiService: AdminApiService
  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void { 
    if (this.data.mode === StringConditions.edit) {
      this.form_heading = 'Edit Pick Label';
      this.form_btn_label = 'Update';
      this.picklvl = this.data.pickLevelData.pickLevel?.toString();
      this.startShelf = this.data.pickLevelData.startShelf?.toString();
      this.endShelf = this.data.pickLevelData.endShelf?.toString();
      this.levelId = this.data.pickLevelData.levelID?.toString();
      this.startCarousel = this.data.pickLevelData.startCarousel?.toString();
      this.endCarousel = this.data.pickLevelData.endCarousel?.toString();
    } else {
      this.picklvl = this.data.nextPickLvl?.toString();
    }
  }

  checkIfValid(){
    if(this.startShelf.trim() === '' || this.endShelf.trim() === '') this.isValidForm = true;
    else this.isValidForm = false;
  }

  onSend(form: NgForm) { 
    if (this.data.mode === StringConditions.edit) {
      form.value.levelID = this.levelId;
      
      this.iAdminApiService.updatePickLevels({ userName : this.data.userName, ...form.value }).subscribe((res:any) =>{
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Update);
        } else this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
      });
    }
    else {  
      form.value.levelID = this.picklvl;
      this.iAdminApiService.insertPickLevels({ userName : this.data.userName, ...form.value }).subscribe((res: any) => {
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
        } else this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
      });
    }

  }
  ngAfterViewInit() {
    this.start_shelf.nativeElement.focus();
  }

}
