import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {  UniqueConstants ,ColumnDef,TableConstant} from 'src/app/common/constants/strings.constants'; 

export interface CarouselZone {
  carousel: string;
  zone: string;
  locationName: string;
  totalLines: string;
  open: string;
  completed: string;
}

@Component({
  selector: 'app-tran-off-carousel-lzone',
  templateUrl: './tran-off-carousel-lzone.component.html',
  styleUrls: [],
})
export class TranOffCarouselLzoneComponent implements OnInit, AfterViewInit {
  public columnValues: any = [];
  dataSource = new MatTableDataSource<CarouselZone>([]);
  displayedColumns: string[] = [TableConstant.Carousel, ColumnDef.Zone, 'Location Name', 'Total Lines','Open','Completed'];
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
    sortOrder: UniqueConstants.Asc,
  };

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue]) {
      this.columnSearch.searchValue = this.router.getCurrentNavigation()?.extras?.state?.[UniqueConstants.searchValue];
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.['colDef'],
        colHeader: this.router.getCurrentNavigation()?.extras?.state?.['colHeader'],
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
