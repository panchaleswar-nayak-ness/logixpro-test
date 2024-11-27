import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';

@Component({
  selector: 'app-filter-item-numbers',
  templateUrl: './filter-item-numbers_cycle_count.component.html',
  styleUrls: ['./filter-item-numbers_cycle_count.component.scss']
})
export class FilterItemNumbersComponentCycleCount implements OnInit {
  @ViewChild('filter_text') filterText: ElementRef;
  public userData: any;


  public iAdminApiService: IAdminApiService;
  importtype : string = '';

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    private authService: AuthService,
  ) {
    this.iAdminApiService = adminApiService;
   }

  ngOnInit(): void {
    this.importtype = this.data.selectedImporttType
    console.log("recieve value",this.data.selectedImporttType);
  
    this.userData = this.authService.userData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.filterText.nativeElement.focus();
  }

  filterItemNumbers() {
    let itemsStr = this.data.trim().replace(/[\n\r]/g, ',');
    let itemsArray = itemsStr.split(',');
    itemsArray = itemsArray.filter((item: any) => item != "");
    let commaSeparatedItems = itemsArray.join(',');
  
    let payload: any = { 
      "items": commaSeparatedItems,
      "importBy": this.importtype
    };
  
    this.iAdminApiService.GetImportBatchCount(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.dialogRef.close({ 
          filterItemNumbersText: this.data, 
          filterItemNumbersArray: itemsArray,
          responseData: res.data // Pass response data to the parent
        });
      } else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
        console.log("FiltersItemNumInsert", res.responseMessage);
      }
    });
  }
  

}
