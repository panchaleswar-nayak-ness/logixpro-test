import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { ViewOrdersComponent } from 'src/app/dialogs/view-orders/view-orders.component';
import {   takeUntil } from 'rxjs';
import { WorkstationZonesComponent } from 'src/app/dialogs/workstation-zones/workstation-zones.component';
import { AuthService } from 'src/app/init/auth.service';
@Component({
  selector: 'app-process-pick-batches',
  templateUrl: './process-pick-batches.component.html',
  styleUrls: ['./process-pick-batches.component.scss']
})
export class ProcessPickBatchesComponent   {
  orderInput: any;
  public userData: any;
@Input() pickBatchQuantity:any;
@Input() useInZonePickScreen:any;
@Input() onDestroy$:any;
@Input() filteredOptions:any;
@Input() allOrders:any;
@Input() TOTE_SETUP:any;
@Input() filteredOrderNum:any;
@Input() orderNumberList:any;
@Input() orderNumber:any;
@Input() allZones:any;
@Input() dataSource:any;
@Input() pickBatchesCrossbtn:any;
@Input() pickBatches:any;
@Input() imPreferences:any;


@Output() workstationzone = new EventEmitter<any>();
  constructor(private global:GlobalService,
    private authService: AuthService) { 
    this.userData = this.authService.userData();
  }

  openWorkstationZone() {
    let dialogRef:any = this.global.OpenDialog(WorkstationZonesComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose: true,

    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workstationzone.emit(true);
        // this.getAllZones();
      }
    })
  }
  async printExisting(type) {


    let positionList: any[] = [];
    let toteIds: any[] = [];
    let OrderNumList: any[] = [];
    this.dataSource?._data?._value.forEach(element => {
      if (element.position) positionList.push(element.position);
      if (element.toteID) toteIds.push(element.toteID);
      if (element.orderNumber) OrderNumList.push(element.orderNumber);
    });
    
    if (!this.pickBatchesCrossbtn) {
      this.global.ShowToastr('error','Please select a Batch ID to print', 'Error!')
    } else {

      if (type === 'PrintTote') {
        if (this.imPreferences.printDirectly) {
          await this.global.Print(`FileName:PrintPrevIMPickBatchToteLabel|BatchID:${this.pickBatches.value}`, 'lbl')

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickBatchToteLabel|BatchID:${this.pickBatches.value}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }
      }
      if (type === 'PrintPickLabel') {
        if (this.imPreferences.printDirectly) {
        await  this.global.Print(`FileName:PrintPrevIMPickBatchItemLabel|BatchID:${this.pickBatches.value}|WSID:${this.userData.wsid}`, 'lbl')
        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickBatchItemLabel|BatchID:${this.pickBatches.value}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }


      }
      if (type === 'PrintPickList') {


        if (this.imPreferences.printDirectly) {
          await   this.global.Print(`FileName:PrintPrevIMPickBatchList|BatchID:${this.pickBatches.value}`);

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickBatchList|BatchID:${this.pickBatches.value}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }


      }
      if (type === 'PrintCase') {


        if (this.imPreferences.printDirectly) {
          await  this.global.Print(`FileName:PrintPrevInZoneCaseLabel|BatchID:${this.pickBatches.value}`, 'lbl');

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevInZoneCaseLabel|BatchID:${this.pickBatches.value}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }


      }
      if (type === 'PrintBatch') {


        if (this.imPreferences.printDirectly) {
          await   this.global.Print(`FileName:PrintPrevPickBatchList|BatchID:${this.pickBatches.value}`);

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevPickBatchList|BatchID:${this.pickBatches.value}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }


      }
    }
  }
  openViewOrdersDialogue(viewType: any) {
    const dialogRef:any = this.global.OpenDialog(ViewOrdersComponent, {
      height: 'auto',
      width: '100vw',
      data: {
        viewType: viewType,
        pickBatchQuantity: this.pickBatchQuantity,
        allOrders: this.allOrders,
      },
      autoFocus: '__non_existing_element__'
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {


      if (result && result != true) {
        if (result.length > 0) {
          this.allOrders = result;
          this.TOTE_SETUP.forEach((element, key) => {
            element.orderNumber = result[key] ?? '';
          });
        }
        else {
          this.allOrders = []
          this.TOTE_SETUP.forEach((element) => {
            element.orderNumber = '';
          });
        }

      }

    })
  }
  ifOrderExits(orderNum: any) {
    let isBatchFull;
    this.TOTE_SETUP.map(obj => {
      isBatchFull = false;
      if (obj.orderNumber != '') {
        isBatchFull = true;
      }
    });
    if (isBatchFull) {
      this.global.ShowToastr('error','No open totes in batch', 'Batch is Filled.');
      this.orderNumber.setValue('');
      return;
    }
    if (orderNum != '') {
      const val = this.orderNumberList.includes(orderNum);
      if (!val) {
        let zone = '';
        this.allZones.map(i => {
          zone += i + ' ';
        })
        this.global.ShowToastr('error',`Order ${orderNum} does not have a line go to Zones: ${zone} `, 'Error!');
        this.orderNumber.setValue('');
        return;
      }
      else {
        const isOrderNumExists = this.TOTE_SETUP.filter(val => {
          return val.orderNumber == orderNum
        });
        if (isOrderNumExists.length > 0) {
          this.orderNumber.setValue('');
        } else {
          for (let element of this.TOTE_SETUP) {
            if (element.orderNumber === '') {
              element.orderNumber = orderNum;
              this.orderNumber.setValue('');
              break;
            }
          }

        }

      }

    }

  }
}
