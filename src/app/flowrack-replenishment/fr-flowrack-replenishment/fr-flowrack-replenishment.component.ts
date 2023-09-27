import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FrNumpadComponent } from '../../dialogs/fr-numpad/fr-numpad.component'; 
import { AuthService } from '../../init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; 
import { SharedService } from '../../services/shared.service';
import { ApiFuntions } from '../../services/ApiFuntions';

@Component({
  selector: 'app-fr-flowrack-replenishment',
  templateUrl: './fr-flowrack-replenishment.component.html',
  styleUrls: ['./fr-flowrack-replenishment.component.scss']
})

export class FrFlowrackReplenishmentComponent implements OnInit {
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


  constructor(private dialog: MatDialog, 
    private authservice: AuthService,
    private sharedService: SharedService,
    private Api:ApiFuntions,
    private toastr: ToastrService) { }

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
    let payload = {
      "WSID": this.userData.wsid,
    }
    this.Api.wslocation(payload).subscribe((res) => {
      this.zone = res.data == 'No'||res.data == ''||res.data == null ? 'This workstation is not assigned to a zone' : res.data
      
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
      this.Api.CFData(payload).subscribe((res => {
        if (res.data != '') {
          this.itemnumscan = res.data
          let payload = {
            "itemNumber": this.itemnumscan,
            "wsid": this.userData.wsid
          }
          this.Api.ItemLocation(payload).subscribe((res => {
            if (res.data.length < 1) {
              this.locationSuggestions = [];
              let payload = {
                "wsid": this.userData.wsid
              }
              this.Api.openlocation(payload).subscribe((res => {
                if (res.data.length < 1) {
                  this.toastr.error("There are no open locations.", 'Error!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000
                  });
                  this.LocationRow = true;
                  this.itemLocation = ''
                }
                else {
                  this.toastr.error("No Locations found for Item Number, Scan or Select an open Location.", 'Error!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000
                  });
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
          this.toastr.error("This item does not exist in Inventory Master for this carton flow zone.", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
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
      "Input": this.itemLocation,
      "wsid": this.userData.wsid,
    }
    this.Api.verifyitemlocation( payload).subscribe((res => {
      if (res.data) {
        this.itemQtyRow = false;
        this.calculator = false
        this.openCal()
      }
      else if (!res.data) {
        this.autocompleteTrigger.closePanel()
        this.clearLocationField()
        this.LocationRow = true;
        this.toastr.error("Location Unavailable.", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    }))
  }
  
  openCal() { 
    const dialogRef = this.dialog.open(FrNumpadComponent, {
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
      this.toastr.error("Quantity must be greater than zero.", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }

    else if (this.itemQty == '') { 
      this.toastr.error("Please enter a quantity.", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }

    else {

      let payload = {
        "itemNumber": this.itemnumscan,
        "Input": this.itemLocation,
        "Quantity": this.itemQty,
        "wsid": this.userData.wsid,
      }
      this.Api.verifyitemquantity(payload).subscribe((res => {
        if (res.data) {
          let payload = {
            "itemNumber": this.itemnumscan,
            "Input": this.itemLocation,
            "Quantity": this.itemQty,
            "wsid": this.userData.wsid,
          }

          this.Api.itemquantity(payload).subscribe((res => {
            if (res.isExecuted) {
              this.toastr.success('Item Quantity Added', 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
              this.resetForm()
            }
          }))
        }
        else {
          this.itemQty = '';
          this.itemQtyFocus.nativeElement.select()
          this.toastr.error("The quantity was not entered due to an error in the Inventory Map", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }

      }))
    }
  }

  getAppLicense() {
    let payload = {
      workstationid: this.userData.wsid,
    };
    this.Api
      .AppNameByWorkstation(payload)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.convertToObj(res.data);
            localStorage.setItem('availableApps',JSON.stringify(this.applicationData)) 
            this.sharedService.setMenuData(this.applicationData)
          }
        },
        (error) => {}
      );
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
