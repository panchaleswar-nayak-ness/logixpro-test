import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FrNumpadComponent } from '../../dialogs/fr-numpad/fr-numpad.component'; 
import { AuthService } from '../../common/init/auth.service';
import { Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; 
import { IFlowRackReplenishApi } from 'src/app/common/services/flowrackreplenish-api/flowrackreplenish-api-interface';
import { FlowRackReplenishApiService } from 'src/app/common/services/flowrackreplenish-api/flowrackreplenish-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AppIcons, AppNames, AppPermissions, AppRoutes, ResponseStrings, RouteNames, RouteUpdateMenu, StringAssignments, ToasterMessages, ToasterTitle, ToasterType ,DialogConstants} from 'src/app/common/constants/strings.constants';
import { KeyboardCodes } from 'src/app/common/enums/CommonEnums';

@Component({
  selector: 'app-fr-flowrack-replenishment',
  templateUrl: './fr-flowrack-replenishment.component.html',
  styleUrls: ['./fr-flowrack-replenishment.component.scss']
})
export class FrFlowrackReplenishmentComponent implements OnInit {
  public iFlowRackReplenishApi : IFlowRackReplenishApi;
  public userData: any;
  public itemQtyRow: boolean = true;
  public locationRow: boolean = true;
  public submitBtnDisplay: boolean = true;
  public itemNumScan: any = '';
  public itemLocation: string;
  public itemQty: any;
  public locationSuggestions: any = [];
  public zone: any;
  public calculator: boolean = true;
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  @ViewChild('autoFocusField') autoFocusField: ElementRef;
  @ViewChild('itemQtyFocus') itemQtyFocus: ElementRef;
  @ViewChild('itemLocationFocus') itemLocationFocus: ElementRef;
  @ViewChild('scrollbar') scrollBar: ElementRef;
  applicationData: any = [];
  @ViewChild('auto') matAutocomplete: MatAutocompleteTrigger;
  @ViewChild('ord_focus') ordFocus: ElementRef;

  constructor(
    private global:GlobalService, 
    private authService: AuthService,
    public flowRackReplenishApi : FlowRackReplenishApiService) {
      this.iFlowRackReplenishApi = flowRackReplenishApi;
    }

  ngOnInit(): void {
    this.userData = this.authService.userData()
    this.cartonFlow()
  }

  ngAfterViewInit(): void {
    this.ordFocus.nativeElement.focus();
    this.getAppLicense(); 
  }

  values() {
    this.itemLocation = this.autoCompleteTrigger.activeOption?.value.location;
  }

  cartonFlow() {
    this.iFlowRackReplenishApi.wslocation({}).subscribe((res) => {
      if (res.isExecuted)
      {
        if (res.data == ResponseStrings.No || res.data == ResponseStrings.Empty || res.data == ResponseStrings.Null){
          this.zone = StringAssignments.WorkstationNotAssignedToZone;
        }
        else{
          this.zone = res.data;
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("wslocation",res.responseMessage);
      }
    })
  }

  updateQty(val) {
    if (val !== 0 && val !=null) {
      this.submitBtnDisplay = false;
      this.itemQtyFocus.nativeElement.focus()
      this.calculator = false
      this.itemQty = val.toString()
    }
    if (val == 0) {
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
    this.locationRow = true;
    this.autoFocusField.nativeElement.focus()
  }

  locationChange(e) {
    if (e.keyCode == KeyboardCodes.ENTER) {      
      this.onLocationSelected()
    }
    this.clearQtyField()
  }

  locationChangeClick(e) {
    this.itemLocation = e
    this.onLocationSelected()
  }

  locationChangeSelect(event: MatAutocompleteSelectedEvent): void {
    this.itemLocation = '';
    setTimeout(() => { 
      this.itemLocation = event.option.value.location; 
      this.onLocationSelected()
    }, 1);
  }

  findItemLocation(event) {
    this.itemNumScan = event.target.value;
    this.clearQtyField();
    if (event.keyCode == KeyboardCodes.ENTER) {
      this.locationRow = false;
      let payload = {
        "ItemNumber": this.itemNumScan,
      }
      this.iFlowRackReplenishApi.CFData(payload).subscribe((res => {
        if(res.isExecuted)
        {
          if (res.data != '') {
            this.itemNumScan = res.data
            let payload = {
              "itemNumber": this.itemNumScan
            }
            this.iFlowRackReplenishApi.ItemLocation(payload).subscribe((res => {
              if (res.data.length < 1) {
                this.locationSuggestions = [];
                this.iFlowRackReplenishApi.openlocation({}).subscribe((res => {
                  if (res.data.length < 1) {
                    this.global.ShowToastr(ToasterType.Error,ToasterMessages.NoOpenLocations, ToasterTitle.Error);
                    this.locationRow = true;
                    this.itemLocation = ''
                  }
                  else {
                    this.global.ShowToastr(ToasterType.Error,ToasterMessages.NoLocationForItem, ToasterTitle.Error);
                    console.log("findItemLocation",res.responseMessage);
                    this.locationSuggestions = res.data
                    this.locationRow = false;
                    setTimeout(() => {
                      this.itemLocationFocus.nativeElement.focus();
                      this.itemLocationFocus.nativeElement.select();
                    }, 0);
                  }
                }))
              }
              else {
                this.locationSuggestions = res.data;
              }
              this.locationRow = false;
              this.itemLocation = res.data[0].location;
              setTimeout(() => {
                this.itemLocationFocus.nativeElement.focus();
                this.itemLocationFocus.nativeElement.select();
              }, 0);
            }))
          }
          else {
            this.itemNumScan = '';
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ItemNotInInventory, ToasterTitle.Error);
            this.clearAllFields()
          }
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("CFData",res.responseMessage);
        }
      }))
    }
    if(event.keyCode == KeyboardCodes.BACKSPACE){
      if(!this.locationRow){
        this.itemNumScan = '';
      }
    }
  }

  onLocationSelected() {
    let payload = {
      "itemNumber": this.itemNumScan,
      "Input": this.itemLocation
    }
    this.iFlowRackReplenishApi.verifyitemlocation( payload).subscribe((res => {
      if(res.isExecuted)
      {
        if (res.data) {
          this.itemQtyRow = false;
          this.calculator = false
          this.openCal()
        }
        else if (!res.data) {
          this.autoCompleteTrigger.closePanel()
          this.clearLocationField()
          this.locationRow = true;
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.LocationUnavailable, ToasterTitle.Error);
          console.log("onLocationSelected",res.responseMessage);
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("verifyitemlocation",res.responseMessage);
      }
    }))
  }
  
  openCal() { 
    const dialogRef:any = this.global.OpenDialog(FrNumpadComponent, {
      width: '480px',
      minWidth: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data:{
        itemQuantity: this.itemQty
      }
    });
    dialogRef.afterClosed().subscribe((result) => { 
      this.itemQty = !result ? '' : result;
      this.submitBtnDisplay = !this.itemQty;
      this.autoCompleteTrigger.closePanel()
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
    this.locationRow = true;
    this.itemNumScan = ''
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
    this.locationRow = true;
    this.itemNumScan = '';
    this.autoFocusField.nativeElement.focus()
    this.calculator = true
  }

  updateItemQuantity() {
    if (this.itemQty <= 0) {
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.QuantityMustGreaterZero, ToasterTitle.Error);
    }
    else if (this.itemQty == '') { 
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.EnterQuantity, ToasterTitle.Error);
    }
    else {
      let payload = {
        "itemNumber": this.itemNumScan,
        "Input": this.itemLocation,
        "Quantity": this.itemQty
      }
      this.iFlowRackReplenishApi.verifyitemquantity(payload).subscribe((res => {
        if (res.data) {
          let payload = {
            "itemNumber": this.itemNumScan,
            "Input": this.itemLocation,
            "Quantity": this.itemQty
          }
          this.iFlowRackReplenishApi.itemquantity(payload).subscribe((res => {
            if (res.isExecuted) {
              this.global.ShowToastr(ToasterType.Success,ToasterMessages.ItemQuantityAdded, ToasterTitle.Success);
              this.resetForm()
            }
            else {
              this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              console.log("itemquantity",res.responseMessage);
            }
          }))
        }
        else {
          this.itemQty = '';
          this.itemQtyFocus.nativeElement.select()
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.QuantityErrorInventoryMap, ToasterTitle.Error);
          console.log("updateItemQuantity",res.responseMessage);
        }
      }))
    }
  }

  getAppLicense() {
    const wsidValue = this.userData.wsid; // Assigning to a variable
    console.log(wsidValue);
  }
  
  convertToObj(data) {
    data.wsAllAppPermission.forEach((item) => {
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
        appName: AppNames.ICSAdmin,
        route: AppRoutes.Admin,
        iconName: AppIcons.ManageAccounts,
        name: RouteNames.Admin,
        updateMenu: RouteUpdateMenu.Admin,
        permission: AppPermissions.AdminMenu,
      },
      {
        appName: AppNames.ConsolidationManager,
        route: AppRoutes.ConsolidationManager,
        iconName: AppIcons.InsertChart,
        name: RouteNames.ConsolidationManager,
        updateMenu: RouteUpdateMenu.Consolidation,
        permission: AppPermissions.ConsolidationManager,
      },
      {
        appName: AppNames.Induction,
        route: AppRoutes.InductionManager,
        iconName: AppIcons.CheckList,
        name: RouteNames.InductionManager,
        updateMenu: RouteUpdateMenu.Induction,
        permission: AppPermissions.InductionManager,
      },
      {
        appName: AppNames.FlowRackReplenish,
        route: AppRoutes.FlowrackReplenish,
        iconName: AppIcons.Schema,
        name: RouteNames.FlowRackReplenishment,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.FlowRackReplenish,
      },
      {
        appName: AppNames.ImportExport,
        route: AppRoutes.Hash,
        iconName: AppIcons.ElectricBolt,
        name: RouteNames.ImportExport,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.ImportExport,
      },
      {
        appName: AppNames.Markout,
        route: AppRoutes.Hash,
        iconName: AppIcons.ManageAccounts,
        name: RouteNames.Markout,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.Markout,
      },
      {
        appName: AppNames.OrderManager,
        route: AppRoutes.OrderManager,
        iconName: AppIcons.PendingActions,
        name: RouteNames.OrderManager,
        updateMenu: RouteUpdateMenu.OrderManager,
        permission: AppPermissions.OrderManager,
      },
      {
        appName: AppNames.WorkManager,
        route: AppRoutes.Hash,
        iconName: AppIcons.FactCheck,
        name: RouteNames.WorkManager,
        updateMenu: RouteUpdateMenu.Empty,
        permission: AppPermissions.WorkManager,
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
