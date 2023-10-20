import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FrNumpadComponent } from '../../dialogs/fr-numpad/fr-numpad.component'; 
import { AuthService } from '../../init/auth.service';

import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; 
import { SharedService } from '../../services/shared.service';
import { ApiFuntions } from '../../services/ApiFuntions';
import { IFlowRackReplenishApi } from 'src/app/services/flowrackreplenish-api/flowrackreplenish-api-interface';
import { FlowRackReplenishApiService } from 'src/app/services/flowrackreplenish-api/flowrackreplenish-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-fr-flowrack-replenishment',
  templateUrl: './fr-flowrack-replenishment.component.html',
  styleUrls: ['./fr-flowrack-replenishment.component.scss']
})

export class FrFlowrackReplenishmentComponent implements OnInit {

  public iFlowRackReplenishApi : IFlowRackReplenishApi;

  public userData: any;
  public itemQtyRow: boolean = true;
  public LocationRow: boolean = true;
  public submitBtnDisplay: boolean = true;
  public itemnumscan: any = '';
  public itemLocation: string;
  public itemQty: any
  public locationSuggestions: any = [];
  public zone: any;
  public calculator: boolean = true;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];

  @ViewChild('autoFocusField') autoFocusField: ElementRef
  @ViewChild('itemQtyFocus') itemQtyFocus: ElementRef
  @ViewChild('itemLocationFocus') itemLocationFocus: ElementRef
  @ViewChild('scrollbar') scrollbar: ElementRef
  applicationData: any = [];
  @ViewChild('auto') matAutocomplete: MatAutocompleteTrigger;
  @ViewChild('ord_focus') ord_focus: ElementRef;


  constructor(private global:GlobalService, 
    private authservice: AuthService,
    private sharedService: SharedService,
    // private Api:ApiFuntions,
    
    public flowRackReplenishApi : FlowRackReplenishApiService) {
      this.iFlowRackReplenishApi = flowRackReplenishApi;
    }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.cartonFlow()
    
  }

  ngAfterViewInit(): void {
    this.ord_focus.nativeElement.focus();
    this.getAppLicense(); 
  }


  values(event) {
    this.itemLocation = this.autocompleteTrigger.activeOption?.value.location;
 
  }

  cartonFlow() {
    // let payload = {
    //   "WSID": this.userData.wsid,
    // }
    this.iFlowRackReplenishApi.wslocation({}).subscribe((res) => {
      if (res.data == 'No'||res.data == ''||res.data == null){
        this.zone='This workstation is not assigned to a zone';
      }
      else{
        this.zone=res.data;
      }
    })
  }

  updateQty(val) {
    if (val !== 0 &&val !=null) {
      this.submitBtnDisplay = false;
      this.itemQtyFocus.nativeElement.focus()
      this.calculator = false
      this.itemQty = val.toString()

    }
    if (val == 0 ) {
      this.submitBtnDisplay = false;
      this.calculator = false
    }
    if (val == null) {
      this.submitBtnDisplay = true;
      this.calculator = false
    }
  }

  clearItemNum() {
    this.clearAllFields();
  }

  scanItemChange() {
    this.submitBtnDisplay = true;
    this.itemQty = '';
    this.itemQtyRow = true;
    this.itemLocation = '';
    this.LocationRow = true;
    this.autoFocusField.nativeElement.focus()
  }


  locationchange(e) {
   
    if (e.keyCode == 13) {      
      this.onLocationSelected(this.itemLocation)
    }
    this.clearQtyField()
  }



  locationchangeClick(e) {
    this.itemLocation = e
    this.onLocationSelected(this.itemLocation)
  }

  locationchangeSelect(event: MatAutocompleteSelectedEvent): void {
    this.itemLocation = '';
    setTimeout(() => { 
      this.itemLocation = event.option.value.location; 
      this.onLocationSelected(this.itemLocation)
    }, 1);
  }


  findItemLocation(event) {
    this.itemnumscan = event.target.value;
    this.clearQtyField();
    if (event.keyCode == 13) {
      this.LocationRow = false;
      let payload = {
        "ItemNumber": this.itemnumscan,
      }
      this.iFlowRackReplenishApi.CFData(payload).subscribe((res => {
        if (res.data != '') {
          this.itemnumscan = res.data
          let payload = {
            "itemNumber": this.itemnumscan
          }
          this.iFlowRackReplenishApi.ItemLocation(payload).subscribe((res => {
            if (res.data.length < 1) {
              this.locationSuggestions = [];
              // let payload = {}
              this.iFlowRackReplenishApi.openlocation({}).subscribe((res => {
                if (res.data.length < 1) {
                  this.global.ShowToastr('error',"There are no open locations.", 'Error!');
                  this.LocationRow = true;
                  this.itemLocation = ''
                }
                else {
                  this.global.ShowToastr('error',"No Locations found for Item Number, Scan or Select an open Location.", 'Error!');
                  console.log("findItemLocation",res.responseMessage);
                  this.locationSuggestions = res.data
                  this.LocationRow = false;


                  setTimeout(() => {
                    this.itemLocationFocus.nativeElement.focus();
                    this.itemLocationFocus.nativeElement.select();
                  }, 0);
                }
              }))
            }
            else {
              this.locationSuggestions = res.data
              this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
              console.log("ItemLocation",res.responseMessage);
            }
            this.LocationRow = false;
            this.itemLocation = res.data[0].location;
            setTimeout(() => {
              this.itemLocationFocus.nativeElement.focus();
              this.itemLocationFocus.nativeElement.select();
            }, 0);
          }))

        }
        else {
          this.itemnumscan = '';
          this.global.ShowToastr('error',"This item does not exist in Inventory Master for this carton flow zone.", 'Error!');
          this.clearAllFields()
        }
      }))

    }
    if(event.keyCode == 8){
      if(!this.LocationRow){
        this.itemnumscan = '';
      }
    }
  }

  onLocationSelected(location) {
    let payload = {
      "itemNumber": this.itemnumscan,
      "Input": this.itemLocation
    }
    this.iFlowRackReplenishApi.verifyitemlocation( payload).subscribe((res => {
      if (res.data) {
        this.itemQtyRow = false;
        this.calculator = false
        this.openCal()
      }
      else if (!res.data) {
        this.autocompleteTrigger.closePanel()
        this.clearLocationField()
        this.LocationRow = true;
        this.global.ShowToastr('error',"Location Unavailable.", 'Error!');
        console.log("onLocationSelected",res.responseMessage);
      }
    }))
  }
  
  openCal() { 
    const dialogRef:any = this.global.OpenDialog(FrNumpadComponent, {
      width: '480px',
      minWidth: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{
        itemQuantity: this.itemQty
      }
   
    });
    dialogRef.afterClosed().subscribe((result) => { 
      this.itemQty = !result ? '' : result;
      this.submitBtnDisplay = !this.itemQty;
      this.autocompleteTrigger.closePanel()
      setTimeout(() => {
        this.itemQtyFocus.nativeElement.focus();
      }, 0);
     
    });
  }

  clearAllFields() {
    this.submitBtnDisplay = true;
    this.itemQty = '';
    this.itemQtyRow = true;
    this.itemLocation = '';
    this.LocationRow = true;
    this.itemnumscan = ''
    this.autoFocusField.nativeElement.focus()
    this.calculator = true
  }

  clearQtyField() {
    this.submitBtnDisplay = true;
    this.itemQty = '';
    this.itemQtyRow = true;
    this.calculator = true
  }

  clearLocationField() {
    this.submitBtnDisplay = true;
    this.itemQty = '';
    this.itemQtyRow = true;
    this.itemLocation = ''
  }

  resetForm() {
    this.submitBtnDisplay = true;
    this.itemQty = '';
    this.itemQtyRow = true;
    this.itemLocation = '';
    this.LocationRow = true;
    this.itemnumscan = '';
    this.autoFocusField.nativeElement.focus()
    this.calculator = true
  }

  updateItemQuantity() {
    if (this.itemQty <= 0) {
      this.global.ShowToastr('error',"Quantity must be greater than zero.", 'Error!');
    }

    else if (this.itemQty == '') { 
      this.global.ShowToastr('error',"Please enter a quantity.", 'Error!');
    }

    else {

      let payload = {
        "itemNumber": this.itemnumscan,
        "Input": this.itemLocation,
        "Quantity": this.itemQty
      }
      this.iFlowRackReplenishApi.verifyitemquantity(payload).subscribe((res => {
        if (res.data) {
          let payload = {
            "itemNumber": this.itemnumscan,
            "Input": this.itemLocation,
            "Quantity": this.itemQty
          }

          this.iFlowRackReplenishApi.itemquantity(payload).subscribe((res => {
            if (res.isExecuted) {
              this.global.ShowToastr('success','Item Quantity Added', 'Success!');
              this.resetForm()
            }
          }))
        }
        else {
          this.itemQty = '';
          this.itemQtyFocus.nativeElement.select()
          this.global.ShowToastr('error',"The quantity was not entered due to an error in the Inventory Map", 'Error!');
          console.log("updateItemQuantity",res.responseMessage);
        }

      }))
    }
  }

  getAppLicense() {
    let payload = {
      workstationid: this.userData.wsid,
    };

    // Manual 

    // this.Api
    //   .AppNameByWorkstation(payload)
    //   .subscribe(
    //     (res: any) => {
    //       if (res?.data) {
    //         this.convertToObj(res.data);
    //         localStorage.setItem('availableApps',JSON.stringify(this.applicationData)) 
    //         this.sharedService.setMenuData(this.applicationData)
    //       }
    //     },
    //     (error) => {}
    //   );
  }
  
  convertToObj(data) {
    data.wsAllAppPermission.forEach((item,i) => {
      for (const key of Object.keys(data.appLicenses)) {
        if (item.includes(key)  && data.appLicenses[key].isLicenseValid) {
          this.applicationData.push({
            appname: data.appLicenses[key].info.name,
            displayname: data.appLicenses[key].info.displayName,
            license: data.appLicenses[key].info.licenseString,
            numlicense: data.appLicenses[key].numLicenses,
            info: this.appNameDictionary(item),
            appurl: data.appLicenses[key].info.url,
            isButtonDisable: true,
          });
        }
      }
    });
    this.sortAppsData();
    
  }
  
  appNameDictionary(appName) {
    let routes = [
      {
        appName: 'ICSAdmin',
        route: '/admin',
        iconName: 'manage_accounts',
        name: 'Admin',
        updateMenu: 'admin',
        permission: 'Admin Menu',
      },
      {
        appName: 'Consolidation Manager',
        route: '/ConsolidationManager',
        iconName: 'insert_chart',
        name: 'Consolidation Manager',
        updateMenu: 'consolidation',
        permission: 'Consolidation Manager',
      },
      {
        appName: 'Induction',
        route: '/InductionManager',
        iconName: 'checklist',
        name: 'Induction Manager',
        updateMenu: 'induction',
        permission: 'Induction Manager',
      },
      {
        appName: 'FlowRackReplenish',
        route: '/FlowrackReplenishment',
        iconName: 'schema',
        name: 'FlowRack Replenishment',
        updateMenu: '',
        permission: 'FlowRack Replenish',
      },
      {
        appName: 'ImportExport',
        route: '#',
        iconName: 'electric_bolt',
        name: 'Import Export',
        updateMenu: '',
        permission: 'Import Export',
      },
      {
        appName: 'Markout',
        route: '#',
        iconName: 'manage_accounts',
        name: 'Markout',
        updateMenu: '',
        permission: 'Markout',
      },
      {
        appName: 'OrderManager',
        route: '/OrderManager',
        iconName: 'pending_actions',
        name: 'Order Manager',
        updateMenu: 'orderManager',
        permission: 'Order Manager',
      },
      {
        appName: 'WorkManager',
        route: '#',
        iconName: 'fact_check',
        name: 'Work Manager',
        updateMenu: '',
        permission: 'Work Manager',
      },
    ];

    let obj: any = routes.find((o) => o.appName === appName);
    return obj;
  }

  sortAppsData() {
    this.applicationData.sort(function (a, b) {
      let nameA = a.info.name.toLowerCase(),
        nameB = b.info.name.toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
  }
}
