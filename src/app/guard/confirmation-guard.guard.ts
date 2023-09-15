import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from '../common/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationGuard implements CanDeactivate<any> {
  constructor( 
    private dialog: MatDialog,
    private router: Router,
    private global:GlobalService,
    // public quarantineDialogRef: MatDialogRef<'quarantineAction'>,
  ) { }
  async  canDeactivate(component: any,route:ActivatedRouteSnapshot):Promise<boolean> { 
    if(component.ifAllowed){ 
   return     this.OpenConfirmationDialog(route.data['title']);
    } 
    return true;
  }
  async OpenConfirmationDialog(title:string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
}
