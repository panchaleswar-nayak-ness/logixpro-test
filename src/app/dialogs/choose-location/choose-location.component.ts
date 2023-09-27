import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: []
})
export class ChooseLocationComponent implements OnInit {
  @ViewChild('loc_focus') loc_focus: ElementRef;
  public userData: any;
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  location : any;
  selectedLocation : any;

  constructor(private toastr: ToastrService,
              private Api:ApiFuntions,
              private authService: AuthService,
              public dialogRef                  : MatDialogRef<ChooseLocationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog                    : MatDialog,) { }

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
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };

      this.Api.BatchLocationTypeAhead(searchPayload).subscribe(
        (res: any) => {
          if (res.data) {
            this.searchAutocompleteItemNum = res.data;
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
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
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api.ReserveLocation(payLoad).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            this.dialogRef.close({responseMessage : res.responseMessage, ...this.selectedLocation});
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => {}
      );      
    } catch (error) { 
    }
  }

}
