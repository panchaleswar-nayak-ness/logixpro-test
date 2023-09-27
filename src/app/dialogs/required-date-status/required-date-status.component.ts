import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-required-date-status',
  templateUrl: './required-date-status.component.html',
  styleUrls: ['./required-date-status.component.scss']
})
export class RequiredDateStatusComponent implements OnInit {
  displayedColumns = ['reqDate', 'zone', 'countToInduct'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ELEMENT_DATA: any[] = [
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },    
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2023", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "10" },
    { countToInduct: "1", reqDate: "12/14/2022", zone: "12" }
  ];

  constructor(private Api:ApiFuntions) { }

  ngOnInit(): void {
    this.getReqDateDataSelect();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getReqDateDataSelect(){
    this.Api.ReqDateDataSelect().subscribe(res => {
      if(res.data.length > 0) {
        this.dataSource = new MatTableDataSource(res.data);
      }
      else {
       this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
    });
  }

}
