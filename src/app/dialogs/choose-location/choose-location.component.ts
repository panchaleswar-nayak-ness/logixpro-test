import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: []
})
export class ChooseLocationComponent implements OnInit {
  @ViewChild('loc_focus') loc_focus: ElementRef;
  public iinductionManagerApi:IInductionManagerApiService;

  public userData: any;
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  location : any;
  selectedLocation : any;

  constructor(
              private Api:ApiFuntions,
              private inductionManagerApi: InductionManagerApiService,
              private authService: AuthService,
              private global: GlobalService,
              public dialogRef                  : MatDialogRef<ChooseLocationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog                    : MatDialog,) {
                this.iinductionManagerApi = inductionManagerApi;
               }

  ngOnInit(): void {    
    this.userData = this.authService.userData();
    this.autocompleteSearchColumnItem();
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem();
      });
  }
 
  ngAfterViewInit(): void {
    this.loc_focus.nativeElement.focus();
  }
  selectLoc(val : any) {
    this.location = val.locNum;
    this.selectedLocation = val;
  }

  async autocompleteSearchColumnItem() {
    try {
      let searchPayload = {
        "location": this.location?this.location:"",
        "warehouse": this.data.warehouse,
        "serial": this.data.serialNumber,
        "lot": this.data.lotNumber,
        "cCell": this.data.carouselCellSize,
        "cVel": this.data.carouselVelocity,
        "bCell": this.data.bulkCellSize,
        "bVel": this.data.bulkVelocity,
        "cfCell": this.data.cfCellSize,
        "cfVel": this.data.cfVelocity,
        "item": this.data.itemNumber, 
      };

      this.iinductionManagerApi.BatchLocationTypeAhead(searchPayload).subscribe(
        (res: any) => {
          if (res.data) {
            this.searchAutocompleteItemNum = res.data;
          } else {
            this.global.ShowToastr('error','Something went wrong', 'Error!');
          }
        },
        (error) => {}
      );      
    } catch (error) { 
    }    
  }

  submit() {
    try {
      let payLoad = {
        "invMapID": this.selectedLocation.invMapID,
        "previousZone": this.data.zones.replace("Zones:",""),
        "dedicated": this.data.dedicated, 
      };
      this.iinductionManagerApi.ReserveLocation(payLoad).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            this.dialogRef.close({responseMessage : res.responseMessage, ...this.selectedLocation});
          } else {
            this.global.ShowToastr('error',res.responseMessage, 'Error!');
          }
        },
        (error) => {}
      );      
    } catch (error) { 
    }
  }

}
