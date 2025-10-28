import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { 
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs'; 
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {  ResponseStrings, DialogConstants, Style, ToasterMessages ,ToasterTitle,ToasterType} from 'src/app/common/constants/strings.constants';
import { DialogCommunicationService } from 'src/app/common/services/dialog-communication.service';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: ['./choose-location.component.scss']
})
export class ChooseLocationComponent implements OnInit, OnDestroy {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  @ViewChild('locFocus') locFocus: ElementRef;
  public iInductionManagerApi:IInductionManagerApiService;

  public userData: any;
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  location : any;
  selectedLocation : any;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    public inductionManagerApi: InductionManagerApiService,
              private authService: AuthService,
              private global: GlobalService,
              public dialogRef                  : MatDialogRef<ChooseLocationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogCommunicationService: DialogCommunicationService) {
                this.iInductionManagerApi = inductionManagerApi;
               }

  ngOnInit(): void {    
    this.userData = this.authService.userData();
    this.autocompleteSearchColumnItem();
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autocompleteSearchColumnItem();
      });

    // Subscribe to batch and zone updates from dialog communication service
    this.subscriptions.push(
      this.dialogCommunicationService.zoneUpdate$.subscribe((newZones: string) => {
        if (newZones) {
          this.data.zones = newZones;
        }
      })
    );
  }
 
  ngAfterViewInit(): void {
    this.locFocus.nativeElement.focus();
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
        'item': this.data.itemNumber, 
      };

      this.iInductionManagerApi.BatchLocationTypeAhead(searchPayload).subscribe(
        (res: any) => {
          if (res.isExecuted && res.data) {
            this.searchAutocompleteItemNum = res.data;
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error); 
          }
        },
        () => {}
      );      
    } catch (error) { 
    }    
  }
  //Sumbit me pop pop
  submit() {
    try {      
      const validZone: boolean = this.data.zones.replace("Zones:","").includes(this.selectedLocation.zone);
      if (validZone) {
        this.reserveLocation();
      } else {
        this.zoneBatch(this.selectedLocation.zone);
      }
    } catch (error) { 
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
    }
  }

  reserveLocation() {
    let payLoad = {
      "invMapID": this.selectedLocation.invMapID,
      "previousZone": this.data.zones.replace("Zones:",""),
      "dedicated": this.data.dedicated, 
    };
    this.iInductionManagerApi.ReserveLocation(payLoad).subscribe(
      (res: ApiResponse<string>) => {
        if (res.isExecuted && res) {
          this.dialogRef.close({responseMessage : res.responseMessage, ...this.selectedLocation});
        } else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        }
      },
      () => {}
    );   
  }

  zoneBatch(zone: string) {
    const batchPayload = { zone: zone };
    this.iInductionManagerApi.BatchByZone(batchPayload).subscribe((batchRes: ApiResponse<string>) => {
      if (!batchRes.isExecuted) {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        return;
      }
      
      const zoneBatchId = batchRes.data;
      
      if(zoneBatchId) {
          // Zone belongs to different batch - broadcast update
          this.dialogCommunicationService.updateBatch(zoneBatchId);
          this.reserveLocation();
          return;
      }

      let dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        data: {
          message: ToasterMessages.NoBatchesWithZone.replace('{{zone}}', zone),
        },
      });

      dialogRef.afterClosed().subscribe((res) => {
        if(res == ResponseStrings.Yes) this.dialogRef.close("New Batch");
      });              
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
