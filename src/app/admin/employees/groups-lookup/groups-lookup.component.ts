import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeObject } from 'src/app/common/interface/Iemployee';
import { AuthService } from '../../../common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { LiveAnnouncerMessage ,ToasterTitle} from 'src/app/common/constants/strings.constants';


export interface GroupsDetails {
  groupName: string;
}



@Component({
  selector: 'app-groups-lookup',
  templateUrl: './groups-lookup.component.html',
  styleUrls: ['./groups-lookup.component.scss']
})
export class GroupsLookupComponent implements OnInit {
  emp: any;
  searchGrp;
  employees_res: any;
  employees_details_data: any = [];
  @Input('childGroupLookUp') isGroupLookUp: boolean;
  @Input('updateGrpTable') updateGrpTable: any;
  @Output() updateGrpLookUp = new EventEmitter();
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  selectedRowIndex = -1;

  highlight(row) {
    this.selectedRowIndex = row.id;
  }
  clearFields() {
    this.searchGrp = '';
    this.group_data_source.filter = '';
  }

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  group_data_source: any = [];
  userData: any;

  // table initialization
  displayedColumns: string[] = ['groupName'];

  @Input() set tab(event: any) {
    if (event) {
      setTimeout(() => {
        this.searchBoxField?.nativeElement.focus();
      }, 500);
    }
  }
  public iAdminApiService: IAdminApiService;
  constructor(private _liveAnnouncer: LiveAnnouncer, private global: GlobalService, private adminApiService: AdminApiService, private authService: AuthService) {
    this.iAdminApiService = adminApiService;
  }

  @ViewChild(MatSort) sort: MatSort;
  groups_details_data: any = [];
  ngAfterViewInit() {
    this.group_data_source.sort = this.sort;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.loadEmpData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.group_data_source.filter = filterValue.trim().toLowerCase();
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }

    this.group_data_source.sort = this.sort;

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  getGrpDetails(grpData: any) {
    this.isGroupLookUp = true;
    this.updateGrpLookUp.emit({ groupData: grpData, isGroupLookUp: this.isGroupLookUp });

  }

  public loadEmpData() {
    this.emp = {
    };
    this.iAdminApiService.getEmployeeData(this.emp)
      .subscribe((response: EmployeeObject) => {
        if (response.isExecuted) {
          this.employees_res = response
          this.groups_details_data = this.employees_res.data.allGroups
          this.group_data_source = new MatTableDataSource(this.groups_details_data);
        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("getEmployeeData", response.responseMessage);
        }

      });

  }



}
