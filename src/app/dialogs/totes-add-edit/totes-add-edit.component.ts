import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../../admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/common/services/global.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ToteElement {
  toteID:string,
  cells:string,
  position:number,
  oldToteID:string,
  isInserted:number
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}
];

@Component({
  selector: 'app-totes-add-edit',
  templateUrl: './totes-add-edit.component.html',
  styleUrls: ['./totes-add-edit.component.scss']
})
export class TotesAddEditComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;
  @ViewChildren('category_category', { read: ElementRef }) category_category: QueryList<ElementRef>;
  isRowAdded=false;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  ELEMENT_DATA_TOTE = [{toteID:"" , cells:"" , position: 1 ,oldToteID:"",isInserted:1,isDuplicate:false,isEdit:false}];
  displayedColumns: string[] = [ 'actions','zone', 'locationdesc'];
  alreadySavedTotesList:any;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourceManagedTotes = new MatTableDataSource<ToteElement>(this.ELEMENT_DATA_TOTE);
  selection = new SelectionModel<PeriodicElement>(true, []);
  position:any;
  isIMPath=false;
  toteID="";
  cellID="";
  fromTote;
  toTote;
  userData:any;
  searchAutocompleteList:any;
  hideRequiredControl = new FormControl(false);
  imPreferences:any;
  onDestroy$: Subject<boolean> = new Subject();
  @ViewChild(MatAutocompleteTrigger) autocompleteInventory: MatAutocompleteTrigger;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  addRow()
  {
    this.isRowAdded=true;
    this.ELEMENT_DATA_TOTE.unshift({toteID:"" , cells:"" , position: this.ELEMENT_DATA_TOTE.length-1 ,oldToteID:"",isInserted:0,isDuplicate:false,isEdit:false});
    this.dataSourceManagedTotes = new MatTableDataSource<any>(this.ELEMENT_DATA_TOTE);
    const lastIndex = this.ELEMENT_DATA_TOTE.length - 1;

    setTimeout(() => {
      const inputElements = this.category_category.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[lastIndex].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }
  printTote(type,element){
    let ident = 0;
    let sTote = '';
    let eTote = '';
    let batch = '';
    let ToteID = element?.toteID;
    if (type.toLowerCase() == "tote") {
      //print single tote id
      sTote = ' ';
      eTote = ' ';
      batch = ' ';
  } else if (type.toLowerCase() == 'batch') {
      // print batch
      ToteID = ' ';
      sTote = ' ';
      eTote = ' ';
  } else {
      //print range tote id
      ident = 1;
      ToteID = ' ';
      batch = ' ';
  }
 



    this.global.Print(`FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`,'lbl');

    }
  printRange(){
    let ident = 1;
   let ToteID = '';
    let batch = '';
    let sTote = this.fromTote;
    let eTote = this.toTote;

    if(this.imPreferences.printDirectly){
      this.global.Print(`FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`)

    }else{
      window.open(`/#/report-view?file=FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
    }

  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  autocompleteSearchColumn(){
    
    this.Api.GetFromToteTypeAhead().pipe(takeUntil(this.onDestroy$)).pipe(
      catchError((error) => {
        // Handle the error here
        this.toastr.error("An Error occured while retrieving data.", 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
        // Return a fallback value or trigger further error handling if needed
        return of({ isExecuted: false });
      })
    ).subscribe((res: any) => {
      if(res.isExecuted){
        if(res.data){
          this.searchAutocompleteList = res.data;
        }
      }
    

    });
  }
  
  saveTote(toteID:any,cells:any,oldToteID:any,isInserted:any,index:any)
  { 
      let oldTote = "";
      let updateMessage="Update Successful";
      if(isInserted=="1")
      {
        oldTote = oldToteID;
      }
      let searchPayload = {
        username: this.userData.userName,
        wsid: this.userData.wsid,
        oldToteID: oldTote,
        toteID: toteID,
        cells: cells
      }
      this.Api.ToteSetupInsert(searchPayload).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            this.toastr.success(isInserted=="1"?updateMessage:res.responseMessage, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.dataSourceManagedTotes.data[index]['isDuplicate']=false
            this.isRowAdded=false;
          this.getTotes();
          } else {
            this.dataSourceManagedTotes.data[index]['isDuplicate']=true
       
        
            this.toastr.error("Cannot set the selected tote because it is already set in the batch.", 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => { 
          this.dataSourceManagedTotes.data[index]['isDuplicate']=true
         
            this.toastr.error("Cannot set the selected tote because it is already set in the batch.", 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
       
          
          
        }
      );
    
    
  }

  deleteTote(toteID:any,index)
  {  //jhgjhgfhgfh
    const dialogRef =  this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
        action: 'delete',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result=='Yes')
      {

        const data = this.dataSourceManagedTotes.data;
        if(data[index]['isDuplicate'] || data[index]['isInserted']==0 ){
          data.splice(index,1)
          this.dataSourceManagedTotes.data=data
          console.log( this.dataSourceManagedTotes.data);
          this.isRowAdded=false
        }else{
          let deleteTote = {
            username: this.userData.userName,
            wsid: this.userData.wsid,
            toteID: toteID
          }
          this.Api.ToteSetupDelete(deleteTote).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.toastr.success("Deleted successfuly", 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });
                this.isRowAdded=false;
                let isUnsavedItem=false
                this.dataSourceManagedTotes.data.forEach(obj=>{
                  if(obj.isInserted===0){
                    isUnsavedItem=true
                  }else {
                    isUnsavedItem=false
                  }
                })
                if(isUnsavedItem){
                  this.getTotes(this.dataSourceManagedTotes.data);
                }else{
                  this.getTotes();
                }
               
        
              } else {
                this.toastr.error("Already exists", 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => { }
          );
        }
        
      


      }

    })
  }

  getTotes(item?)
  {
    let items:any;
    if(item){
      items=JSON.parse(JSON.stringify(item))
    }
    this.ELEMENT_DATA_TOTE.length=0;
    this.Api.ToteSetup().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.ELEMENT_DATA_TOTE = res.data;
          for(let i=0;i<this.ELEMENT_DATA_TOTE.length;i++)
          {
          this.ELEMENT_DATA_TOTE[i].isInserted = 1;
          this.ELEMENT_DATA_TOTE[i].isDuplicate = false;
          this.ELEMENT_DATA_TOTE[i].oldToteID   = this.ELEMENT_DATA_TOTE[i].toteID
          this.ELEMENT_DATA_TOTE[i].isEdit   = false
          }
          if(items){
            this.ELEMENT_DATA_TOTE.push(items[items.length-1])
            this.isRowAdded=true;
          }
          this.dataSourceManagedTotes = new MatTableDataSource<any>(this.ELEMENT_DATA_TOTE);
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  onToteChange($event,position,cells="")
  {
    this.ELEMENT_DATA_TOTE[(position)].isEdit =true;
  if(cells=="")
  {
    if(this.ELEMENT_DATA_TOTE[(position)].toteID!=$event.target.value)
    {
      this.ELEMENT_DATA_TOTE[(position)].toteID = $event.target.value;
    }

  }
  else if(this.ELEMENT_DATA_TOTE[(position)].cells!=$event.target.value) 
  {
    
    
    
    this.ELEMENT_DATA_TOTE[(position)].cells = $event.target.value;
    

  }
  
  }

  selectTote(toteIDs=null,cells=null,isManagedTote=false)
  {    
    if(!isManagedTote){
      if(this.toteID==='')return
    }
  
    let exists=false;
    for(let i=0; i < this.alreadySavedTotesList?.length; i++)
    {
      if(toteIDs==null)
      {
        if(this.alreadySavedTotesList[i].toteid==this.toteID)
        {
          exists=true;
          break;
        }
      }
      else if (this.alreadySavedTotesList[i].toteid==toteIDs)
      {                
        
        
          exists=true;
          break;
        
      }

    }

    if(exists)
    {
      this.toastr.error("Cannot set the selected tote because it is already set in the batch.", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
    }
    else 
    {
      let selectedTote;
      if(toteIDs == null && cells == null)
      {
        if (!this.cellID) {
          this.toastr.error("Cannot set the selected tote because it is cells is empty.", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          return;
        }
        selectedTote = { toteID : this.toteID, cellID : this.cellID, position : this.position };
        this.dialogRef.close(selectedTote);
      }
      else 
      {
        if (!cells) {
          this.toastr.error("Cannot set the selected tote because it is cells is empty.", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          return;
        }
        selectedTote = { toteID : toteIDs, cellID : cells, position : this.position }; 
        this.isRowAdded=false;
        this.dialogRef.close(selectedTote);
      }
    }

    
  }

  displayedColumns1: string[] = ['select', 'zone', 'locationdesc', 'options'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection1 = new SelectionModel<PeriodicElement>(true, []);

  constructor(public dialogRef: MatDialogRef<TotesAddEditComponent>,private route: ActivatedRoute,private location: Location,private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data : any,private authService: AuthService,private Api:ApiFuntions,private toastr: ToastrService,private dialog: MatDialog,private global:GlobalService) {

      let pathArr= this.location.path().split('/')
      this.isIMPath=pathArr[pathArr.length-1]==='ImToteManager'

    
      
      
     }

   

  ngOnInit(): void {
    this.ELEMENT_DATA_TOTE.length=0;
    this.position = this.data.position;
    this.userData = this.authService.userData();
    this.alreadySavedTotesList = this.data.alreadySavedTotes;
    this.cellID = this.data.defaultCells ? this.data.defaultCells : 0;
    this.getTotes();
    this.autocompleteSearchColumn();
    this.imPreferences=this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
}
