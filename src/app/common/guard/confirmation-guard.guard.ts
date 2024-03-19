import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from '../services/global.service';
import { DialogConstants, ResponseStrings, Style } from '../constants/strings.constants';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationGuard implements CanDeactivate<any> {
  constructor( 
    private global:GlobalService,
    private router: Router, 
    // public quarantineDialogRef: MatDialogRef<'quarantineAction'>,
  ) { }
  async  canDeactivate(component: any,route:ActivatedRouteSnapshot):Promise<boolean> { 
    if(component.ifAllowed){ 
      debugger
      if(route.data['title'].indexOf('Bulk') > -1){
        return   this.backButton(route.data['title'])
      }else{
        return this.OpenConfirmationDialog(route.data['title']);
      }
    } 
    return true;
  }
  async OpenConfirmationDialog(title:string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        data: {
          message: 'Changes you made may not be saved.',
          heading: title
        },
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'Yes') {
          this.global.changesConfirmation = false;
          resolve(true);
        } else {
          this.global.changesConfirmation = true;
          resolve(false);
        }
      });
    });
  }
  async   backButton(title:any): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
    const dialogRef1: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: `Transaction verification is currently underway.
        Leaving will remove transactions, otherwise continue with transaction verification`,
        heading: 'Verify '+ title,
        buttonFields: true,
        customButtonText: true,
        btn1Text: 'Continue Verification',
        btn2Text: 'Leave Anyway'
      },
    });
    dialogRef1.afterClosed().subscribe(async (resp: any) => {
      if (resp != ResponseStrings.Yes) {
        resolve(true);
      }else{
        resolve(false);
      }
    });
  });
  }
}
