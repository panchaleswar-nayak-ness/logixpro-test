import { Component, HostListener} from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/common/services/global.service';
import { DeleteRangeComponent } from 'src/app/dialogs/delete-range/delete-range.component';
import { PrintReplenLabelsComponent } from 'src/app/dialogs/print-replen-labels/print-replen-labels.component';
import { SrDeleteOrderComponent } from 'src/app/dialogs/sr-delete-order/sr-delete-order.component';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-system-replenishment',
  templateUrl: './system-replenishment.component.html',
  styleUrls: ['./system-replenishment.component.scss']
})
export class SystemReplenishmentComponent {
  tabIndex:any = 0;

  refreshCurrentOrders:Subject<any> = new Subject();
  replenishmentsProcessed:boolean = false;
  refreshNewOrders:Subject<any> = new Subject();
  replenishmentsDeleted:boolean = false;

  constructor(private global:GlobalService) { }
 
  deleteRange(): void {
    const dialogRef:any = this.global.OpenDialog(DeleteRangeComponent, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  printLabels(): void {
    const dialogRef:any = this.global.OpenDialog(PrintReplenLabelsComponent, {
      width: '1132px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  deleteSelectedOrder(): void {
    const dialogRef:any = this.global.OpenDialog(SrDeleteOrderComponent, {
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  activeTabIndex:number = 0;
  onTabChanged(event:any){
    this.activeTabIndex = event.index;
    if(this.activeTabIndex == 0 && this.replenishmentsDeleted){
      this.refreshNewOrders.next(1);
      this.replenishmentsDeleted = false;
    }
    if(this.activeTabIndex == 1 && this.replenishmentsProcessed){
      this.refreshCurrentOrders.next(1);
      this.replenishmentsProcessed = false;
    }
  }
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent) {
  const selection = window.getSelection()?.toString().trim(); // Trim copied text
  if (selection) {
    event.clipboardData?.setData('text/plain', selection);
    event.preventDefault(); // Prevent default copy behavior
  }
}
}

