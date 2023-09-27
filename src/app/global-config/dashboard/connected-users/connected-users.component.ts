import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import {MatPaginator} from '@angular/material/paginator';
import { SignalrServiceService } from '../../../../app/services/signalr-service.service';
import { HttpClient } from '@angular/common/http';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: [],
})
export class ConnectedUsersComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['username', 'wsid', 'appname'];
  user_connected_datasource: any = [];
  ConnectedUserSubscription : any;
  constructor(
    private Api:ApiFuntions,
    private _liveAnnouncer: LiveAnnouncer,
    public signalRService: SignalrServiceService, 
    private http: HttpClient
  ) {}
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getConnectedUsers();
  }
  ngAfterViewInit() {
    this.signalRService.connect();
    this.ConnectedUserSubscription = this.signalRService.
       ConnectedUsers.subscribe(loc => {
        this.user_connected_datasource = new MatTableDataSource(loc.data);
        this.user_connected_datasource.paginator = this.paginator;
      });
  }
  getConnectedUsers() {

    this.Api.ConnectedUser().subscribe(
      (res: any) => {
        if (res.isExecuted) {
          res.data.map((obj) => ({
            ...obj,
            appname: obj?.appname ? obj.appname : 'no app',
          }));
          this.user_connected_datasource = new MatTableDataSource(res.data);
          this.user_connected_datasource.paginator = this.paginator;

        }
      },
      (error) => {}
    );
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.user_connected_datasource.sort = this.sort;
  }
}
