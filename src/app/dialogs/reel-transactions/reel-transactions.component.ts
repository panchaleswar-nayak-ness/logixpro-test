import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ReelDetailComponent } from '../reel-detail/reel-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import { take } from 'rxjs';
import { GlobalService } from 'src/app/common/services/global.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-reel-transactions',
  templateUrl: './reel-transactions.component.html',
  styleUrls: ['./reel-transactions.component.scss']
})
export class ReelTransactionsComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  ELEMENT_DATA: any[] =[
    {reel_serial_number: '1202122', reel_part_quantity: '36'},
    {reel_serial_number: '1202122', reel_part_quantity: '36'},
    {reel_serial_number: '1202122', reel_part_quantity: '36'},
  ];
    
  displayedColumns: string[] = ['reel_serial_number','button','reel_part_quantity','action'];
  generateReelAndSerial:MatTableDataSource<any> = new MatTableDataSource<any>([]);
fieldNames:any;
  itemNumber:any;
  description:any;
  partsInducted:any;
  partsNotAssigned:any;
  noOfReels:any
  AutoGenerateReel:any =false
  HiddenInputValue:any
  generatedReelQty:any
  imPreferences:any;
  createdReel:any
  checkSNS:any
  generatedReelQtyIndex:any
  fromReelCheck:any
  reel:any
  oldIncluded:any

  @ViewChild('noOfReeltemp') noOfReeltemp: ElementRef
  @ViewChild('serialTemp') serialTemp: ElementRef
  @ViewChildren('serialTemp') serialInputs: QueryList<any>;
  
  constructor(private dialog: MatDialog,public dialogRef: MatDialogRef<ReelTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private Api:ApiFuntions,private toastr: ToastrService,private global:GlobalService) { }

  ngOnInit(): void {
    // debugger
    this.itemNumber = this.data.itemObj.number
    this.description = this.data.itemObj.description
    this.partsInducted =this.data.itemObj.totalParts
    this.partsNotAssigned =this.oldIncluded?this.oldIncluded:''
    this.noOfReels = this.data.itemObj.numReels
    this.fieldNames=this.data?.fieldName
    setTimeout(() => {
      this.ReelDetailDialogue()
    }, 300);

    this.imPreferences=this.global.getImPreferences();
    
  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  updateRemaining(){
    // debugger
    let total = this.partsInducted;
    let counted = 0;
    this.generateReelAndSerial.data.forEach(element => {
      if( element.reel_part_quantity != ''){
        // element.reel_part_quantity = 0
        counted += parseInt(element.reel_part_quantity);
      }
    });
    this.partsNotAssigned = total - counted
  }


  ReelDetailDialogue() {
    
    const dialogRef = this.dialog.open(ReelDetailComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        hvObj: this.data.hvObj,
        itemObj:this.data.itemObj,
        gReelQty:this.generatedReelQty,
        fromtrans: this.fromReelCheck? this.generateReelAndSerial.data[this.generatedReelQtyIndex].details : this.HiddenInputValue,
        propFields:this.fieldNames
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result !="true" ){
        if(!this.generatedReelQty && this.generatedReelQty != ''){
          this.partsInducted  = result[0].reelQty
        this.partsNotAssigned =result[0].reelQty
        this.oldIncluded = result[0].reelQty
        this.HiddenInputValue = result[1]
        this.noOfReeltemp.nativeElement.select()
        }
        else{
          this.HiddenInputValue = result[1]
          this.noOfReeltemp.nativeElement.select()
          this.generateReelAndSerial.data[this.generatedReelQtyIndex].reel_part_quantity = result[0].reelQty
          this.generateReelAndSerial.data[this.generatedReelQtyIndex].details = result[1]
          this.updateRemaining()
        }

      }
      else{
        // debugger
        // this.partsInducted  =   this.partsInducted ?this.partsInducted:'' 
        // this.partsNotAssigned = this.partsNotAssigned ?this.partsInducted:'' 
        // this.partsNotAssigned = this.oldIncluded?this.oldIncluded:''
        // this.partsNotAssigned =result[0].reelQty
        // this.partsIncluded = this.oldIncluded?this.oldIncluded:0
        // this.partsNotAssigned =this.oldIncluded?this.oldIncluded:0
      }
    })
  }

  OpenReelSerial(){
    this.AutoGenerateReel = true
    let partsPerReel = Math.floor(this.partsInducted / this.noOfReels);

    let payload = {
      "numReels": this.noOfReels
    }
    this.Api.NextSerialNumber(payload).subscribe((res: any)=>{
      if (res.data && res.isExecuted){
        const dataArray: any[] = [];
        for (var x = 0; x < this.noOfReels; x++){
          dataArray.push({reel_serial_number: '', reel_part_quantity: partsPerReel,details:this.HiddenInputValue});
        }
        this.generateReelAndSerial.data = dataArray;
        this.updateRemaining()
       setTimeout(() => {
        this.serialTemp.nativeElement.focus()
       }, 100);


      }
      else {
        this.toastr.error('Something went wrong', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    },
    (error) => {}
    )
    

  }


  onChange(event:any,index){
    // debugger
    if(event.keyCode == 8){
      this.generateReelAndSerial.data[index].reel_part_quantity=event.target.value
      this.updateRemaining()
      return
    }
    else{
      console.log(event.target.value)
      this.generateReelAndSerial.data[index].reel_part_quantity=event.target.value
      this.updateRemaining()
    }
  }

  changeVal(event:any,index){
    
    if(event.keyCode == 8){
      return
    }
    else{
      this.generateReelAndSerial.data[index].reel_serial_number=event.target.value
    }
  }



  findDuplicateValue(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] === array[j]) {
          return array[i]; // Found the repeating value
        }
      }
    }
    return null; // No duplicates found
  }

  reeloverviewsubmit(){
    const dialogRef = this.dialog.open(AlertConfirmationComponent, {
      height: 'auto',
      width: '560px',
      data: {
        message: 'Click OK to create these reels.',
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        if(this.generateReelAndSerial.data.length == 0){
          this.toastr.error("You must provide at least one reel transaction in order to create reels.", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
        else{
          let numUnassigned =this.partsNotAssigned;
          if (numUnassigned != 0){
              this.ConfirmNoOFReel(numUnassigned)
          }  else{
            this.CreateReels();
          }
                
        }
      }
    })
  }
ConfirmNoOFReel(numUnassigned){
  const dialogRef = this.dialog.open(AlertConfirmationComponent, {
    height: 'auto',
    width: '560px',
    data: {
      message: `There are  ${(numUnassigned < 0 ? 'more' : 'fewer')}  parts assigned to these reels than total parts selected.  Click OK to continue or Cancel to edit the number of parts in each reel.`,
    },
    autoFocus: '__non_existing_element__',
      disableClose:true,
  });
  dialogRef.afterClosed().subscribe((result) => {
    if(!result){
      return
    }else{
    this.CreateReels();
    }

  
  })
}

validateInputs() {
  this.serialInputs.forEach(input => {
    input.nativeElement.focus(); // This will force Angular to validate each input
  });
}
CreateReels(){
  let reels:any = [];
                let rc$;
                let SNs:any[] = [];
                let sn = '';
                
                
                this.generateReelAndSerial.data.forEach((element)=>{
                 
                  // if(element.reel_serial_number !=''){
                  //   element.isEmpty = false
                  // }
                  sn =element.reel_serial_number
                  SNs.push(element.reel_serial_number)
                  // if(element.reel_serial_number==''){
                  //   this.toastr.error("You must provide a serial number for each reel transaction.", 'Error!', {
                  //     positionClass: 'toast-bottom-right',
                  //     timeOut: 2000
                  //   });
                  //   return
                  // }
            
                  reels.push({
                    "SerialNumber": element.reel_serial_number,
                    "Quantity":  parseInt(element.reel_part_quantity),
                    "OrderNumber": element.details.reelOrder,
                    "Lot": element.details.reelLot.toString(),
                    "UF1": element.details.reelUF1,
                    "UF2": element.details.reelUF2,
                    "Warehouse": element.details.reelWarehouse,
                    "ExpiryDate": element.details. reelExpDate,
                    "Notes":  element.details.reelNotes
                })
                })
                // console.log(this.generateReelAndSerial.data,'checj')
                this.validateInputs();
                if(SNs.includes('')){
                  this.validateInputs();
                  this.serialTemp.nativeElement.blur()
                  this.toastr.error("You must provide a serial number for each reel transaction.", 'Error!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000
                  });
                  return
                }
                


            
                   const hasDuplicatesFlag = this.findDuplicateValue( SNs);
                   if(hasDuplicatesFlag){
                    this.toastr.error('You must provide a unique serial number for each reel transaction.  Serial ' + hasDuplicatesFlag + ' is duplicated.', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000
                    });
                    return
                   }
                let payload = {
                  SerialNumbers:SNs
                }
                this.Api.ValidateSn(payload).subscribe((res:any)=>{
                  if (res.data && res.isExecuted){
                    let errs = '';
                    for (var x = 0; x < res.data.length; x++) {
                        if (!res.data[x].valid) {
                            errs += (SNs[x] + ' is invalid because it is already allocated ' + (res.data[x].reason == 'OT' ? 'to a Put Away in Open Transactions.' : 'in Inventory Map') );
                           

                            const dialogRef = this.dialog.open(AlertConfirmationComponent, {
                              height: 'auto',
                              width: '560px',
                              data: {
                                message: errs,
                              },
                              autoFocus: '__non_existing_element__',
      disableClose:true,
                            });
                            dialogRef.afterClosed().subscribe((result) => {
                              if(result){
                                return
                              }
                            })
                          };
                    };
                    if(errs != ''){
                      this.toastr.error('The following serial numbers have problems and could not be assigned' , 'Error!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });
                    }
                    else{
                     let payload = {
                      "item": this.itemNumber,
                      "reels":reels
                    }
                    console.log(payload)
                    
                      this.Api.ReelsCreate(payload).subscribe((res=>{
                        if(res.data && res.isExecuted){
                            if(res.data.lenghth<=0){
                              this.toastr.error('There was an error while attempting to save the new reels.  See the error log for details.', 'Error!', {
                                positionClass: 'toast-bottom-right',
                                timeOut: 2000,
                              });
                            }
                            else  {
                              this.createdReel = res.data
                              // print functionality will be implemented here
                              const dialogRef = this.dialog.open(AlertConfirmationComponent, {
                                height: 'auto',
                                width: '560px',
                                data: {
                                  message: "Click OK to print labels now.",
                                },
                                autoFocus: '__non_existing_element__',
                                 disableClose:true,
                              });
                              dialogRef.afterClosed().subscribe((result) => {
                                if(result){
                                  this.checkSNS = SNs[0]
                                  // this.global.Print(`FileName:PrintReelLabels|OTID:${this.createdReel.join(",",'lbl')}|SN:|Item:|Order:`);
                                  this.PrintCrossDock()
                                  
                                  return
                                }
                                else{
                                  this.dialogRef.close(SNs[0]);
                                }
                                
                              })
                              // this.dialogRef.close(SNs[0]);
                            }
                        }
                      })),
                      (error) => {this.toastr.error(error, 'Error!', {
                        positionClass: 'toast-bottom-right',
                        timeOut: 2000,
                      });}
                    }
            
                  }
                  else {
                    this.toastr.error('Something went wrong', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                  }
                }),
                (error) => {}

                
}

PrintCrossDock(){
var res:any =   this.global.Print(`FileName:PrintReelLabels|OTID:${this.createdReel.join(",",'lbl')}|SN:|Item:|Order:`);
 
   if(res){
  this.showConfirmationDialog('Click OK if the labels printed correctly.',(open)=>{
    if(!open){
    this.PrintCrossDock();
    }else{
      this.dialogRef.close(this.checkSNS);
      return
    }
  });
    } 
}

 async showConfirmationDialog(message,callback) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    height: 'auto',
    width: '560px',
    autoFocus: '__non_existing_element__',
    disableClose: true,
    data: {
      message: message,
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if(result=='Yes'){
      callback(true)
    }else{
      callback(false)
    }
  })
}
  GenerateSerialNumber(index){
    let payload = {
      "numReels": 1
    }
    this.Api.NextSerialNumber(payload).subscribe((res: any)=>{
      if (res.data && res.isExecuted){
        this.generateReelAndSerial.data[index].reel_serial_number=res.data+ '-RT';
      }
      else {
        this.toastr.error('Something went wrong', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    },
    (error) => {}
    )
  }

  
  OpenDetails(index,e){
    // debugger
this.generatedReelQty = e.reel_part_quantity
this.fromReelCheck = true
// console.log(index)
this.generatedReelQtyIndex = index

// this.reel

this.ReelDetailDialogue()
  }

  initiateReelGenrator(e){
    if(e.keyCode ==13){
      this.OpenReelSerial()
    }
  }


  limitNoOfReels() {
    const firstValue = parseInt(this.partsInducted);
    const secondValue = parseInt(this.noOfReels);
  
    if (secondValue > firstValue) {
      this.noOfReels = this.partsInducted; // Set noOfReels to partsInducted value
    }
  }

  print(index,e){
    if(this.imPreferences.printDirectly){
      this.global.Print(`FileName:PrintReelLabels|OTID:[]|SN:${e.reel_serial_number}|Order:${this.data.hvObj.order}|Item:${this.itemNumber}`)
    }else{
      window.open(`/#/report-view?file=FileName:PrintReelLabels|OTID:[]|SN:${e.reel_serial_number}|Order:${this.data.hvObj.order}|Item:${this.itemNumber}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
    }
  }

}
