import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SafeUrl} from '@angular/platform-browser';
import {BrChooseReportTypeComponent} from 'src/app/dialogs/br-choose-report-type/br-choose-report-type.component';
import {AuthService} from 'src/app/common/init/auth.service';
import {OrderManagerApiService} from 'src/app/common/services/orderManager-api/order-manager-api.service';
import {IOrderManagerAPIService} from 'src/app/common/services/orderManager-api/order-manager-api-interface';
import {IAdminApiService} from 'src/app/common/services/admin-api/admin-api-interface';
import {AdminApiService} from 'src/app/common/services/admin-api/admin-api.service';
import {
  IInductionManagerApiService
} from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import {InductionManagerApiService} from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {ToastrService} from 'ngx-toastr';
import {DialogConstants, ToasterTitle, ToasterType} from '../constants/strings.constants';
import {BaseService} from 'src/app/common/services/base-service.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  safeUrl: SafeUrl;
  userData:any;
  sqlLimits : any = {
    numerics: {
        bigint: {
            min : -9223372036854775808,
            max: 9223372036854775807n
        },
        int: {
            min: -2147483648,
            max: 2147483647
        },
        smallint: {
            min: -32768,
            max: 32767
        },
        tinyint: {
            min: 0,
            max: 255
        },
        // float & real: unrealistic it could ever go this high, will truncate if necessary, more likely to see an overflow in vb than sql server
    },
    text: {
        large: {
            min: 0,
            max: 255
        },
        standard: {
            min: 0,
            max: 50
        }
    }
  };
  changesConfirmation = false;

  public iinductionManagerApi:IInductionManagerApiService;
  public iOrderManagerApi :  IOrderManagerAPIService;
  public iAdminApiService: IAdminApiService;

  constructor(
    private apiBase: BaseService,
    public orderManagerApi: OrderManagerApiService,
    private dialog : MatDialog,
    private toastr : ToastrService,
    public inductionManagerApi : InductionManagerApiService,
    public adminApiService: AdminApiService,
    private authService : AuthService
  ) {
    this.userData = this.authService.userData();
    this.iOrderManagerApi = orderManagerApi;
    this.iAdminApiService = adminApiService;
    this.iinductionManagerApi = inductionManagerApi;
  }
  private lastMessage: string | null = null;
  ShowToastr(type? : any, msg? : any, title? : any, timeOut? : any, positionClass? : any){
    if (this.lastMessage === msg) {
      return; // Do nothing if the message is the same
    }
    if (!timeOut) timeOut = type == ToasterType.Success ? 2000 : 5000;
    this.toastr[type](msg, title || 'Success!',
      {
        positionClass: positionClass || 'toast-bottom-right',
        timeOut: timeOut,
      }
    );
     // Update the lastMessage with the current message
     this.lastMessage = msg;

     // Reset lastMessage when the toast disappears
     setTimeout(() => {
      this.resetLastMessage();
    }, timeOut);
  }
  private resetLastMessage() {
    this.lastMessage = null;
  }
  globalErrorMsg() {
    return "Error Response from Server";
  }

  // returns the date from JS in format: mm/dd/yyyy hh:mm
  getCurrentDateTime() {
    let date = new Date();
    // JS month is 0 indexed
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours > 12) hours = date.getHours() - 12;
    if (hours < 10) hours = parseInt('0' + hours);
    if (minutes < 10 && minutes != 0) minutes = parseInt(`0` + minutes);
    else if (minutes == 0) minutes = parseInt('00');

    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
  }

  // returns the date from JS as mm/dd/yyyy
  getCurrentDate() {
    let date = new Date();
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }

  capitalizeAndRemoveSpaces(inputString: string): string {
    const words: string[] = inputString.split(' ');
    const capitalizedWords: string[] = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    const resultString: string = capitalizedWords.join('');

    return resultString;
  }

  setToToday() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = parseInt("0" + month);
    if (day < 10) day = parseInt("0" + day);
    let today = month + "/" + day + "/" + year;
    return today;
  }

  //Allows only numeric strings in an input box
  setNumeric(value : any) {
    let decimalVal = "";
    if (value.indexOf(".") == 0) {
        decimalVal = ".";
        value.substring(1, value.length - 1);
    };
    while (isNaN(Number(value)) && value.length > 0) value = value.substring(0, value.length - 1);
    return decimalVal + value;
  }

  /*
  Allows only numeric strings within a specified range inside of an input box
  Parameters:
      Optional 1:
          Usage: setNumericInRange(15, 0, 10);

          value: value of input tag to set
          low: numeric, low value of the input
          high: numeric, high value of the input
      Optional 2:
          Usage: setNumericInRange(15, {low: 0, high: 10});
              (or: setNumericInRange(15, SqlLimits.numerics.int);)

          value: value of input tag to set
          low: object containing a low and high property.  Should resemble something like this: low = {low: 1, high: 10};
          high: excluded from this call, you do not need to specify this value at all.
  */
  setNumericInRange(value : any, low : any, high : any, allowEmpty : any = false) {
    if (!low.hasOwnProperty('min')) {
      while ((isNaN(Number(value)) && value.length > 0) || (parseInt(value) > high && high != null)) value = value.substring(0, value.length - 1);
      if (low != null && value < low && value.trim() != '') value = low;
      return value;
    } else {
      let h = low.max;
      let l = low.min;
      while ((isNaN(Number(value)) && value.length > 0) || (parseInt(value) > h && h != null)) value = value.substring(0, value.length - 1);
      if (l != null && value < l && value.trim() != '' && !allowEmpty) value = l;
      return value;
    };
  }

  /*
  Allows only numeric, comma seperated values in input box provided by element
  */
  setNumericCommaSeparated(value : any) {
    let allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ','], index = 0;
    while (index < value.length) {
      if (allowed.indexOf(value[index]) == -1) return value.substring(0, index).trim();
      else index++;
    };
  }

  /*
  Removes the Extension from a string typed into an input box
  (Disallows the use of the "." character.)
  */
  setNoExtension(value : any) {
    let extensionIndex = value.indexOf('.');
    if (extensionIndex != -1) return value.substring(0, extensionIndex);
  }

  /*
      Prevents the space character from being contained within the "element"
  */
  setNoSpaces(value : any) {
    let spaceIndex = value.indexOf(' ');
    if (spaceIndex != -1) return value.substring(0, spaceIndex);
  };

  /*
  Prevents the string "null" or "nothing" from being inserted into a particular element.  (Only come across this when server returns Nothing as an object type.)
  */
  setNullEmptyStr(value : any) {
    if (value == null) return ''
    else return String(value);
  };

  checkDecimal(n) {
    let result = (n - Math.floor(n)) !== 0;
    if (result) return false;
    else return true;
  }

  async Print(ChooseReport, type = "lst") {
      let paylaod:any = {
        ClientCustomData:ChooseReport,
        repositoryIdOfProject:"BCAEC8B2-9D16-4ACD-94EC-74932157BF82",
        PrinterReportName:localStorage.getItem("SelectedReportPrinter"),
        PrinterLabelName:localStorage.getItem("SelectedLabelPrinter"),
      }
    let res: any = await this.iAdminApiService.CommonPrint(paylaod);
      if(res.isExecuted) {
        this.ShowToastr(ToasterType.Success, "print successfully completed", ToasterTitle.Success);
        return true;
      } else {
        this.ShowToastr(ToasterType.Error, "print unsuccessfully complete", ToasterTitle.Error);
        return false;
      }
  }

  OpenDialog(component:any, item:any) {
    return  this.dialog.open(component, {
      height: item.height ? item.height : DialogConstants.auto,
      width: item.width ? item.width : '600px',
      disableClose: item.disableClose ?? true,
      autoFocus: item.autoFocus || DialogConstants.autoFocus,
      data: item.data,
    });
  }

  OpenExportModal(name:any, reportName) {
    reportName = reportName.replace(".lst","-lst").replace(".lbl","-lbl");
    name = name.replace(".lst","").replace(".lbl","");

    const dialogRef:any = this.OpenDialog(BrChooseReportTypeComponent, {
      height: DialogConstants.auto,
      width: '560px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data:{ ReportName:reportName, Name:name }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.FileName != null) this.Export(reportName, result.Type, result.FileName);
    });
  }

  Export(ChooseReport:any,Type:any,filename:any){
    let paylaod:any={
      ClientCustomData:`${this.capitalizeAndRemoveSpaces(ChooseReport)}`,
      repositoryIdOfProject:"BCAEC8B2-9D16-4ACD-94EC-74932157BF82",
      type:Type,
      FileName:`${this.capitalizeAndRemoveSpaces(filename)}`
    }
    this.iAdminApiService.CommonExport(paylaod).subscribe((res:any)=>{
      if(res.isExecuted){
        this.ShowToastr(ToasterType.Success, "Export successfully completed", ToasterTitle.Success);
          if(res.data.fileName.indexOf("txt") > -1 || res.data.fileName.indexOf("csv") > -1) this.downloadTextFile(res.data.fileName, res.data.fileContent);
          else {
            this.apiBase.DownloadFile(res.data.url).subscribe((response) => {
              if (response.body) {
                const blobUrl = URL.createObjectURL(response.body);
                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                let headers = response.headers;
                let disposition = headers.get('content-disposition');
                let dispositions = disposition.split(';');
                let filename = dispositions.find((d) => d.includes('filename'));
                filename = filename.split('=')[1];
                anchor.download = filename;

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(blobUrl);

              }
              else {
                this.ShowToastr(ToasterType.Error, "Export unsuccessfully complete", ToasterTitle.Error);
              }

              },
            (error) => {
              this.ShowToastr(ToasterType.Error, "Export unsuccessfully complete", ToasterTitle.Error);
            }
            );


          }
      } else this.ShowToastr(ToasterType.Error, "Export unsuccessfully complete", ToasterTitle.Error);
    })
  }

  downloadTextFile(filename, textContent) {
    // Create a Blob from the text content
    const blob = new Blob([textContent], { type: 'text/plain' });
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // Set the download attribute and the file name
    link.download = filename;
    // Simulate a click to trigger the download
    link.click();
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }

  getOmPreferences(): any{
    const preferencesString = localStorage.getItem('OmPreference');
    if(preferencesString) return JSON.parse(preferencesString)
    else {
      this.iOrderManagerApi.OrderManagerPreferenceIndex().subscribe((response: any) => {
        if (response.isExecuted) {
          localStorage.setItem('OmPreference', JSON.stringify(response.data.preferences[0]));
          const getOm:any = localStorage.getItem('OmPreference');
          return JSON.parse(getOm)
        }
      });
    }
  }

  updateOmPref(){
    this.iOrderManagerApi.OrderManagerPreferenceIndex().subscribe((response: any) => {
      if (response.isExecuted) localStorage.setItem('OmPreference', JSON.stringify(response.data.preferences[0]));
    });
  }

  getImPreferences() {
    return JSON.parse(localStorage.getItem('InductionPreference') ?? '{}');
  }

  updateImPreferences(){
    this.iinductionManagerApi.PickToteSetupIndex({}).subscribe(res => {
      localStorage.setItem('InductionPreference', JSON.stringify(res.data.imPreference));
    });
  }

  setImPreferences(response){
    const imPref = localStorage.getItem('InductionPreference');
    if (imPref) {
      const data = JSON.parse(imPref); // Assuming storedData is the object a
      // Loop through properties of b and update values in a if they exist
      for (const prop in response) {
        if (response.hasOwnProperty(prop) && data.hasOwnProperty(prop)) data[prop] = response[prop];
      }
      // Store the updated object a back in localStorage
      localStorage.setItem('inductionPreference', JSON.stringify(data));
    }
  }

  getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i of ca) {
      let c = i;
      while (c.startsWith(' ')) c = c.substring(1);
      if (c.startsWith(name)) return c.substring(name.length, c.length);
    }
    return "";
  }

  setCookie(cname: string, cvalue: string, expMin: any) {
    let d = new Date();
    d.setTime(d.getTime() + (expMin * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  deleteAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i of cookies) {
      const cookie = i;
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
      if(!name.endsWith('-Theme')) document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}
