import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';

import { SharedService } from 'src/app/common/services/shared.service';
import { catchError, of } from 'rxjs';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,ResponseStrings,DialogConstants,Style,TableConstant,UniqueConstants, ToasterMessages, alertMessage, ConfirmationMessages} from 'src/app/common/constants/strings.constants';
import { DevicePreferenceRequest, DevicePreferenceResponse } from 'src/app/common/interface/admin/device-preferences';
import { DevicePreferencesControllerType, DevicePreferencesDeviceModel, DevicePreferencesDeviceType, DevicePreferencesShownType } from 'src/app/common/enums/admin/device-preferences-enums';
import { MatSelectChange } from '@angular/material/select';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { DevicePreferencesFormFieldKey } from 'src/app/common/constants/admin/device-preferences-constants';

@Component({
  selector: 'app-add-new-device',
  templateUrl: './add-new-device.component.html',
  styleUrls: ['./add-new-device.component.scss'],
})
export class AddNewDeviceComponent implements OnInit {
  @ViewChild('first_address') first_address: ElementRef;
  newDeviceForm: FormGroup;
  newDeviceID:number = 0;
  isEdit: boolean = false;
  public iAdminApiService: IAdminApiService;
  item: any;
  interfaceType = DevicePreferencesShownType.OTHER;
  zoneList:string[] = [];
  controllerTypeList:string[] = [];
  deviceModelList:string[] = [];
  wmiControllers:string[] = [
    'SISHorizontalCarousel',
    'WMIC3000',
    'Sapient',
    'SapientShuttleNR',
    'SapientShuttle',
    'KardexTIC',
    'SISLightMaster',
    'SISLightMasterTB',
    'SISCartSB',
    'SISMultiSB',
    'JMIFShuttle',
  ];
  public userData: any;
  devicePreferencesShownType = DevicePreferencesShownType;
  lightTreeNumberOptions: number[] = Array.from({ length: 9 }, (_, i) => i);
  constructor(
    public dialogRef: MatDialogRef<AddNewDeviceComponent>,
    private global: GlobalService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public authService: AuthService,
    private adminApiService: AdminApiService,

    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data?.isEdit;
    this.iAdminApiService = adminApiService;
    this.item = data?.item;
  }

  ngOnInit(): void {
    this.initializeDataSet();
    this.userData = this.authService.userData();
    this.getDeviceInformation();
  }

  changeType(event: MatSelectChange): void {
    const controllerValue = event?.value;
    if (controllerValue && this.wmiControllers?.includes(controllerValue)) {
      this.interfaceType = DevicePreferencesShownType.WMI;
    } else {
      this.interfaceType = DevicePreferencesShownType.OTHER;
    }
  }

  dialogClose() {
    this.dialogRef.close('close');
  }

  private validateFormInputs(form: FormGroup): boolean {
    const fieldsToValidate = [
      { key: DevicePreferencesFormFieldKey.zone, message: alertMessage.ZoneCannotBeLeftBlank },
      { key: DevicePreferencesFormFieldKey.deviceType, message: alertMessage.DeviceTypeCannotBeLeftBlank },
      { key: DevicePreferencesFormFieldKey.deviceNumber, message: alertMessage.DeviceNumberCannotBeLeftBlank }
    ];

    for (const field of fieldsToValidate) {
      const value = form.get(field.key)?.value;
      if (typeof value !== 'string' || !value.trim()) {
        this.global.ShowToastr(ToasterType.Error, field.message, ToasterTitle.Error);
        return false;
      }
    }

    return true;
  }

  private buildDevicePreferencePayload(form: FormGroup, shown: DevicePreferencesShownType): DevicePreferenceRequest {
    const item = form.value;

    const payload: DevicePreferenceRequest = {
      deviceId: this.data?.item?.deviceID ?? (this.newDeviceID > 0 ? this.newDeviceID : 0),
      zone: item.zone,
      type: item.deviceType,
      number: item.deviceNumber,
      model: item.deviceModel,
      controllerType: item.controllerType,
      controllerPort: item.controllerTerminalPort,
      arrowDirection: item.arrowDirection,
      lightDirection: item.lightDirection,
      laserPointer: item.laserPointer,
      lightTreeNumber: item.lightTreeNumber,
      beginAddress: item.firstAddress,
      displayPositions: item.displayPositions,
      displayCharacters: item.displayCharacters,
      pairKey: item.pairKey,
      shownType: shown
    };

    switch (shown) {
      case DevicePreferencesShownType.WMI_JMIF:
        Object.assign(payload, {
          hostIP: item.hostIP,
          hostPort: item.hostPort,
          workstationName: item.workstationName,
          baud: item.baud
        });
        break;

      case DevicePreferencesShownType.WMI:
      case DevicePreferencesShownType.WMI_SETUP:
        Object.assign(payload, {
          hostIP: item.hostIP,
          hostPort: item.hostPort,
          workstationName: item.workstationName
        });
        break;

      case DevicePreferencesShownType.OTHER:
        Object.assign(payload, {
          com: item.comPort,
          baud: item.baud,
          parity: item.parity,
          word: item.wordLength,
          stop: item.stopBit
        });
        break;
    }

    return payload;
  }

  onSubmit(form: FormGroup, isClose:boolean = false): void {
    if (!this.validateFormInputs(form)) return;

    const shown = this.showDPTypeFields();
    const payload = this.buildDevicePreferencePayload(form, shown);

    this.iAdminApiService.DevicePreference(payload).subscribe((res: ApiResponse<number>) => {
      if (res.isExecuted) {
        this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);

        if (res.data != 0) {
          this.newDeviceID = res.data;
          this.isEdit = true;
          this.getDeviceInformation(res.data);
        }

        if (isClose) {
          this.dialogRef.close(ResponseStrings.Yes);
        }

        this.data?.onSave?.();
      } else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
      }
    });
  }

  initializeDataSet() {

    this.newDeviceForm = this.fb.group({
      zone: this.fb.control(this.item?.zone || ''),
      deviceType: this.fb.control(this.item?.deviceType || ''),
      deviceNumber: this.fb.control(this.item?.deviceNumber || ''),
      deviceModel: this.fb.control(this.item?.deviceModel || ''),
      controllerType: this.fb.control(this.item?.controllerType || ''),
      controllerTerminalPort: this.fb.control(this.item?.controllerTermPort || ''),
      arrowDirection: this.fb.control(this.item?.arrowDirection || ''),
      lightDirection: this.fb.control(this.item?.lightDirection || ''),
      lightTreeNumber: this.fb.control(this.item?.lightTreeNumber ?? 0),
      firstAddress: this.fb.control(this.item?.beginAddress || '0'),
      displayPositions: this.fb.control(this.item?.displayPositions || '0'),
      displayCharacters: this.fb.control(this.item?.displayCharacters || '0'),
      pairKey: this.fb.control(this.item?.pairKey || ''),
      laserPointer: this.fb.control(this.item?.laserPointer || false),

      // Communication settings
      hostIP: this.fb.control(''),
      hostPort: this.fb.control(''),
      workstationName: this.fb.control(''),
      comPort: this.fb.control(''),
      baud: this.fb.control(''),
      wordLength: this.fb.control(''),
      stopBit: this.fb.control(''),
      parity: this.fb.control(''),
    });

    const controllerType = this.item?.controllerType || '';
    this.interfaceType = this.wmiControllers.includes(controllerType)
      ? DevicePreferencesShownType.WMI
      : DevicePreferencesShownType.OTHER;

    this.showDPTypeFields();
  }

  deleteSelected() {
    if (!this.isEdit) {
      this.dialog.closeAll();
      return;
    }
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: Style.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        action: UniqueConstants.delete,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let deviceID;
        if (this.data?.item) {
          deviceID = this.data.item.deviceID;
        } else if (this.newDeviceID > 0) {
          deviceID = this.newDeviceID;
        } else {
          deviceID = 0;
        }
        let payload = {
          deviceID: deviceID
        };
        this.iAdminApiService
          .DevicePreferencesDelete(payload)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
              this.dialogRef.close(ResponseStrings.Yes);
            } else {

              this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
              console.log("DevicePreferencesDelete", res.responseMessage);
            }
          });
      }
    });
  }

  getDeviceInformation(deviceID?: number): void {
    const fallbackID = this.data?.item?.deviceID ?? 0;
    const payload = { deviceID: deviceID || fallbackID };

    this.iAdminApiService.DeviceInformation(payload).pipe(
      catchError(() => {
        return of({ isExecuted: false });
      })
    ).subscribe((res: ApiResponse<DevicePreferenceResponse>) => {
      if (res.isExecuted && res.data) {
        const data = res.data;

        this.zoneList = data.zoneList || [];
        this.controllerTypeList = data.controllerTypeList || [];
        this.deviceModelList = data.deviceModelList || [];

        this.newDeviceForm.patchValue({
          pairKey: data.pairKey,
          hostIP: data.hostIPAddress,
          hostPort: data.hostPort,
          workstationName: data.workstationName,
          comPort: data.hostPCComPort,
          baud: data.baudRate,
          stopBit: data.stopBit,
          parity: data.parity,
          wordLength: data.wordLength
        });

        this.showDPTypeFields();
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.ErrorWhileRetrievingData, ToasterTitle.Error);
      }
    });
  }

  getCompName() {
    this.newDeviceForm.controls[DevicePreferencesFormFieldKey.workstationName].setValue(this.userData.wsid);
  }

  showDPTypeFields(): DevicePreferencesShownType {
    const { deviceType, deviceModel, controllerType } = this.newDeviceForm.value;
    const controllerTypeLower = controllerType?.toLowerCase() ?? '';

    // Return IPTI interface if device type and model match
    if (
      deviceType === DevicePreferencesDeviceType.Light_Tree &&
      deviceModel === DevicePreferencesDeviceModel.IPTI
    ) {
      return this.setInterfaceType(DevicePreferencesShownType.IPTI);
    }

    // Check for WMI-related controller types, including JMIF and SapientShuttle
    if (controllerType && this.wmiControllers.includes(controllerType)) {
      if (controllerType === DevicePreferencesControllerType.JMIFShuttle) {
        return this.setInterfaceType(DevicePreferencesShownType.WMI_JMIF);
      }

      if (controllerTypeLower.includes('sapientshuttle')) {
        return this.setInterfaceType(DevicePreferencesShownType.WMI_SETUP);
      }

      return this.setInterfaceType(DevicePreferencesShownType.WMI);
    }

    // Fallback to OTHER interface
    return this.setInterfaceType(DevicePreferencesShownType.OTHER);
  }

  private setInterfaceType(type: DevicePreferencesShownType): DevicePreferencesShownType {
    this.interfaceType = type;
    return type;
  }

  updateAllDevices(isAll:boolean = false) {
    let payload = {
      zone: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.zone].value,
      hostport: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.comPort].value,
      baud: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.baud].value,
      parity: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.parity].value,
      word: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.wordLength].value,
      stopbit: this.newDeviceForm.controls[DevicePreferencesFormFieldKey.stopBit].value,
    };

    const comPort = this.newDeviceForm.controls[DevicePreferencesFormFieldKey.comPort].value;
    const zone = this.newDeviceForm.controls[DevicePreferencesFormFieldKey.zone].value;

    const message = isAll
      ? this.global.formatMessage(ConfirmationMessages.UpdateAllInterface, { comPort })
      : this.global.formatMessage(ConfirmationMessages.UpdateAllInterfaceWithZone, { comPort, zone });

    const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
      height: Style.auto,
      width: Style.w786px,
      data: {
        message: message,
        heading: '',
        disableCancel: false,
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.iAdminApiService
          .ZoneDevicePreferencesUpdateAll(payload)
          .subscribe((res: any) => {
            if (res.isExecuted) {

              this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
              this.sharedService.updateDevicePref({ response: true });
            } else {

              this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
              console.log("ZoneDevicePreferencesUpdateAll", res.responseMessage);
            }
          });
      }
    });
  }

  ngAfterViewInit() {
    this.first_address.nativeElement.focus();
  }
}
