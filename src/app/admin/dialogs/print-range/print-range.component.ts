import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-print-range',
  templateUrl: './print-range.component.html',
  styleUrls: []
})
export class PrintRangeComponent implements OnInit {
  @ViewChild('begin_loc') begin_loc: ElementRef;
  userData: any;
  beginLoc: string = "";
  endLoc: string = "";
  groupLikeLoc: boolean = false;
  quantitySelected: number = 0;
  constructor(
    private route: Router,
    public dialogRef: MatDialogRef<any>,
    private authService: AuthService,
    private Api: ApiFuntions,
    private global:GlobalService
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.begin_loc.nativeElement.focus();
  }

  @ViewChild("begin", { static: false }) beginOpened: MatAutocomplete;
  @ViewChild("end", { static: false }) endOpened: MatAutocomplete;
  beginLocationSearchList: any = [];
  endLocationSearchList: any = [];

  onSearchSelectBeginLocation(e: any) {
    this.beginLoc = e.option.value;
  }
  onSearchSelectEndLocation(e: any) {
    this.endLoc = e.option.value;
  }

  selectBeginLocation(option: any, event: any) {
    this.beginLoc = option;
  }
  selectEndLocation(option: any, event: any) {
    this.endLoc = option;
  }

  searchBeginLocation(loader: boolean = false) {
    let payload = {
      "query": this.beginLoc,
      "unique": true
    }
    this.Api.LocationBegin(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.beginLocationSearchList = res.data;
        this.getQtySelected();
      }
      else {
        this.beginLocationSearchList = [];
      }
    });
  }
  searchEndLocation(loader: boolean = false) {
    let payload = {
      "query": this.endLoc,
      "beginLocation": this.beginLoc,
      "unique": true
    }
    this.Api.LocationEnd(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.endLocationSearchList = res.data;
        this.getQtySelected();
      }
      else {
        this.endLocationSearchList = [];
      }
    });
  }

  getQtySelected() {
    let payload = {
      "beginLocation": this.beginLoc ? this.beginLoc : 0,
      "endLocation": this.endLoc ? this.endLoc : 0,
      "unique": this.groupLikeLoc
    }
    this.Api.QuantitySelected(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        if (res.data == -1) {
          this.quantitySelected = 0;
        }
        else {
          this.quantitySelected = res.data;
        }
      }
      else {
        this.quantitySelected = 0;
      }
    });
  }

  printRange() {
    this.global.Print(`FileName:printIMReport|invMapID:0|groupLikeLoc:${this.groupLikeLoc}|beginLoc:${this.beginLoc}|endLoc:${this.endLoc}|User:${this.userData.userName}`)
  }
}
