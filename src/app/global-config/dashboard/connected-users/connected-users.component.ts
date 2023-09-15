import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import {MatPaginator} from '@angular/material/paginator';
import { SignalrServiceService } from '../../../../app/services/signalr-service.service';
import { HttpClient } from '@angular/common/http';
import { ConnectedUsers } from '../../../Model/connected-users';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.scss'],
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
    let dummy_data = [
      { username: 'a', wsid: 'test pc', appname: 'Appname test' },
      { username: 'waleed', wsid: 'TESTWSID', appname: 'yuiui' },
      { username: 'ovais', wsid: 'TESTWSID', appname: 'ytt' },
      { username: 'Arif', wsid: 'Acc', appname: 't' },
      { username: 'Srfaraz', wsid: 'azxc', appname: 'rrr' },
      { username: 'Zohaib', wsid: 'hgfdg', appname: 'e' },
      { username: 'Dennis', wsid: 'xcvsq', appname: 'w' },
      { username: 'Loyal', wsid: 'cxv', appname: 'q' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
      { username: 'Jupiter', wsid: 'q', appname: 'asad' },
    ];
    this.Api.ConnectedUser().subscribe(
      (res: any) => {
        if (res.isExecuted) {
          res.data.map((obj) => ({
            ...obj,
            appname: obj && obj.appname ? obj.appname : 'no app',
          }));
          this.user_connected_datasource = new MatTableDataSource(res.data);
          this.user_connected_datasource.paginator = this.paginator;

        }
      },
      (error) => {}
    );
  }
  handlePageEvent(e: PageEvent) {

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
