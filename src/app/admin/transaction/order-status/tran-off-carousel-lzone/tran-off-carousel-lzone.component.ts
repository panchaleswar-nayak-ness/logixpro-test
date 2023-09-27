import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; 
export interface CarouselZone {
  carousel: string;
  zone: string;
  locationName: string;
  totalLines: string;
  open: string;
  completed: string;
}
let dummyData=[
  {
      "carousel":'off',
      "zone": "02",
      "locationName": "POD 2",
      "totalLines": "13",
      "open": "13",
      "completed": "0"
  },
  {
    "carousel":'off',
      "zone": "03",
      "locationName": "POD 3",
      "totalLines": "33",
      "open": "33",
      "completed": "0"
  },
  {
    "carousel":'on',
      "zone": "04",
      "locationName": "POD 5",
      "totalLines": "21",
      "open": "12",
      "completed": "1"
  }
]
const ELEMENT_DATA: CarouselZone[] = [
  { carousel: "off", zone: '02', locationName: "POD 2", totalLines: '13',open: '33',completed: '0' },
  { carousel: "off", zone: '04', locationName: "POD 65", totalLines: '1',open: '2',completed: '1' },
  { carousel: "on", zone: '21', locationName: "POD 3", totalLines: '12',open: '52',completed: '0' },


];
@Component({
  selector: 'app-tran-off-carousel-lzone',
  templateUrl: './tran-off-carousel-lzone.component.html',
  styleUrls: [],
})
export class TranOffCarouselLzoneComponent implements OnInit, AfterViewInit {
  public columnValues: any = [];
  dataSource = new MatTableDataSource<CarouselZone>(ELEMENT_DATA);
  
  displayedColumns: string[] = ['Carousel', 'Zone', 'Location Name', 'Total Lines','Open','Completed'];
  selection = new SelectionModel<CarouselZone>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('viewAllLocation') customTemplate: TemplateRef<any>;
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
  constructor(private router: Router) {
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
