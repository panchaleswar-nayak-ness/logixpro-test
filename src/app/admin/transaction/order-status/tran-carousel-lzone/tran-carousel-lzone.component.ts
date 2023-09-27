import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

const ELEMENT_DATA: any[] = [];
@Component({
  selector: 'app-tran-carousel-lzone',
  templateUrl: './tran-carousel-lzone.component.html',
  styleUrls: ['./tran-carousel-lzone.component.scss'],
})
export class TranCarouselLzoneComponent implements OnInit, AfterViewInit {
  public columnValues: any = [];
  public locationZonesData: any = [];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  displayedColumns: string[] = [
    'carousel',
    'zone',
    'locationName',
    'totalLines',
    'open',
    'completed',
  ];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;
  @ViewChild('zoneSort') zoneSort = new MatSort();

  customPagination: any = {
    total: '',
    recordsPerPage: 20,
    startIndex: '',
    endIndex: '',
  };
  columnSearch: any = {
    searchColumn: {
      colHeader: '',
      colDef: '',
    },
    searchValue: '',
  };

  sortColumn: any = {
    columnName: 32,
    sortOrder: 'asc',
  };

  @Input() set locationZonesEvent(event: any) {
    if (event) {
      this.dataSource = new MatTableDataSource(event);
      this.locationZonesData = event;
    }
  }

  @Input()
  set clearEvent(event: Event) {
       if (event) {
     
          if (this.dataSource) {
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
          }
        }
  }


  constructor(private router: Router, private Api: ApiFuntions) {
    if (this.router.getCurrentNavigation()?.extras?.state?.['searchValue']) {
      this.columnSearch.searchValue =
        this.router.getCurrentNavigation()?.extras?.state?.['searchValue'];
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
        colHeader:
          this.router.getCurrentNavigation()?.extras?.state?.['colHeader'],
      };
    }
  }
  sortChange(event) {
    this.dataSource.sort = this.zoneSort;
  }
  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 20,
      startIndex: 0,
      endIndex: 20,
    };

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
}
