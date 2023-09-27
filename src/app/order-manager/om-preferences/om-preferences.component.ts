import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { FormControl, FormGroup} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-om-preferences',
  templateUrl: './om-preferences.component.html',
  styleUrls: [],
})
export class OmPreferencesComponent implements OnInit {
  userData: any;
  filtersForm: FormGroup;
  @ViewChild('myInput') myInput: ElementRef<HTMLInputElement>;
  constructor(
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    private global:GlobalService
  ) {
    this.userData = this.authService.userData();

    this.filtersForm = new FormGroup({
      maxOrder: new FormControl(0),
      custReportsApp: new FormControl(''),
      custReportsMenuApp: new FormControl(''),
      custReportsMenuText: new FormControl(''),
      allowInProcOrders: new FormControl(false),
      allowIndivdOrders: new FormControl(false),
      defUserFields: new FormControl(false),
      printDirect: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.getPreferences();
    this.filtersForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(
        (newValues) => {
          this.setPreferences();
        },
        (oldValues) => {
          return;
        }
      );
  }
  restrictTo10Digits(event: KeyboardEvent): void {
    debugger
    const inputElement = this.myInput.nativeElement;
    let value = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters 
    if (parseInt(value) > 2147483647) {
      value = value.slice(0, 9); // Limit to maximum of 10 digits
    } else {
      value = value.slice(0, 10); // Limit to maximum of 10 digits
    }

    inputElement.value = value;
  }

  removeLastDigit(number) {
    if (typeof number !== 'number') {
      return number; // Return the input if it's not a number
    }

    const numberAsString = number.toString();
    const updatedNumberAsString = numberAsString.slice(0, -1); // Remove the last character

    return Number(updatedNumberAsString);
  }
  getPreferences() {
    
    this.Api
      .OrderManagerPreferenceIndex()
      .subscribe((response: any) => {
        if (response.isExecuted) {
          let pref = response.data.preferences[0];
          this.filtersForm.controls['maxOrder'].setValue(
            pref.maxOrders ? pref.maxOrders : ''
          );
          this.filtersForm.controls['allowInProcOrders'].setValue(
            pref.allowInProc ? pref.allowInProc : false
          );
          this.filtersForm.controls['allowIndivdOrders'].setValue(
            pref.allowPartRel ? pref.allowPartRel : false
          );
          this.filtersForm.controls['defUserFields'].setValue(
            pref.defUserFields ? pref.defUserFields : false
          );
          this.filtersForm.controls['printDirect'].setValue(
            pref.printDirectly ? pref.printDirectly : false
          );
          this.filtersForm.controls['custReportsApp'].setValue(
            response.data.customReport ? response.data.customReport : ''
          );
          this.filtersForm.controls['custReportsMenuApp'].setValue(
            response.data.customAdmin ? response.data.customAdmin : ''
          );
          this.filtersForm.controls['custReportsMenuText'].setValue(
            response.data.customAdminText ? response.data.customAdminText : ''
          );      
        }
        
      });
  }
  setPreferences() {
    let maxOrderRem = 0;
    if (this.filtersForm.controls['maxOrder'].value > 2147483647) {
      maxOrderRem = this.removeLastDigit(
        this.filtersForm.controls['maxOrder'].value
      );
    } else if (this.filtersForm.controls['maxOrder'].value < 0) {
      this.filtersForm.controls['maxOrder'].setValue(0);
    } else {
      maxOrderRem = this.filtersForm.controls['maxOrder'].value;
    }

    let payload = {
      maxOrders: maxOrderRem ?? 1,
      allowInProc: this.filtersForm.controls['allowInProcOrders'].value,
      allowPartRel: this.filtersForm.controls['allowIndivdOrders'].value,
      defUserFields: this.filtersForm.controls['defUserFields'].value,
      customReport: this.filtersForm.controls['custReportsApp'].value,
      customAdmin: this.filtersForm.controls['custReportsMenuApp']?.value,
      customAdminText: this.filtersForm.controls['custReportsMenuText'].value,
      printDirectly: this.filtersForm.controls['printDirect'].value,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .OrderManagerPreferenceUpdate(payload)
      .subscribe((response: any) => {
        if (response.isExecuted) {
          this.global.updateOmPref();
        } else {
          this.toastr.error(
            'Error',
            'An Error Occured while trying to update',
            {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            }
          );
        }
      });
  }
}
