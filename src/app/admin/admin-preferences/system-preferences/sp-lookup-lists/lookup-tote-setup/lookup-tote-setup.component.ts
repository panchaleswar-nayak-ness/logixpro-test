import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-lookup-tote-setup',
  templateUrl: './lookup-tote-setup.component.html',
  styleUrls: []
})
export class LookupToteSetupComponent implements OnInit {


  ELEMENT_DATA: any[] =[
    {tote_id: '125874', cells: '120' },
  ];
  public iAdminApiService: IAdminApiService;
  displayedColumns: string[] = ['tote_id', 'cells', 'actions'];
  tableData : any = [];
  OldtableData : any = [];
  
  dataSourceList:any
  AddBtn = false
  saveCheck = false

  constructor(private Api:ApiFuntions,
    private global:GlobalService,
    private adminApiService: AdminApiService,
    
    public authService: AuthService,) { 
      this.iAdminApiService = adminApiService;
    }

  ngOnInit(): void {
    this.getToteTable()
  }

  getToteTable(){

    this.iAdminApiService.getToteCell().subscribe(res => {
      if (res.isExecuted) {
        this.OldtableData =res.data;   
        this.tableData = JSON.parse(JSON.stringify(res.data));   
      }
    });
  }


  addEmptyRow() {
    this.AddBtn = true
    
    let newOBj = {
      toteID:'',
      cells:''
    }
    let temA:any = []
    temA.push(newOBj)
    this.tableData =  this.tableData.concat(temA);
  }

  check(toteID,ind){
    for(let i = 0; i < this.OldtableData.length; i++) {
      if(this.OldtableData[i].toteID == toteID) {
        this.tableData[ind].IsDisabled = true;
        this.global.ShowToastr('error',`Tote must be unique. Another entry matches it. Please save any pending totes and try again.`, 'Error!');
        break;
      }else  this.tableData[ind].IsDisabled = false;
       
    }
  
  }

  saveTotes(ele,i){
    let payload = {
      "oldToteID": "",
      "toteID": ele.toteID,
      "cells": ele.cells.toString()
    }
    this.iAdminApiService.totesetup(payload).pipe(
    
      catchError((error) => {
        return of({ isExecuted: false });

      })

    ).subscribe((res=>{
      if(res.isExecuted){
        console.log(res)
        this.AddBtn = false
        ele.IsDisabled = true
        this.global.ShowToastr('success',`Saved Successfully`, 'Error!');
      }
    }))

  }

  deleteTote(ele){
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'delete',
        actionMessage:` ${ele.toteID} from the Tote list.. `
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes'){

        let payload = {
          "toteID": ele.toteID
        }
        this.iAdminApiService.deleteTote(payload).subscribe((res=>{ 
          if(res.isExecuted){
            this.getToteTable()
          }

          else {
            
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("LocationZone", res.responseMessage);

          }
        }))
      }
    })
  }

  clearAllTotes(){

    const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
      height: 'auto',
      width: '786px',
      data: {
        message: 'Click OK to clear ALL tote information for incomplete transactions.',
        heading: 'Clear Tote',
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result){
        this.iAdminApiService.cleartote({}).subscribe((res=>{
          console.log(res)
          if(res.isExecuted){
            this.global.ShowToastr('success',`Tote Clear Successfully`, 'Error!');
          }

          else {
            
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("LocationZone", res.responseMessage);
          }
        }))
      }
    });
    
  
  }



  

}
