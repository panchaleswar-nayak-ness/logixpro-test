import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fr-numpad',
  templateUrl: './fr-numpad.component.html',
  styleUrls: ['./fr-numpad.component.scss']
})
export class FrNumpadComponent implements OnInit {
  @ViewChild('calc_focus') calc_focus: ElementRef;
public itemQuantity :string = ''
check:boolean = false
check1:boolean = false
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
   this.itemQuantity = this.data.itemQuantity.toString() 
  }

  ngAfterViewInit(): void {
    this.calc_focus.nativeElement.focus();
  }

  pressNum(number){
    if(number == '-'){
     if(this.itemQuantity.includes('-'))  {
      let test = this.itemQuantity.split('')
      test.shift()
      this.itemQuantity =  test.join("")
     } 
     else{
      let test = this.itemQuantity.split('')
      test.unshift('-') 
      this.itemQuantity =  test.join("") 
     }   
    } 
    else if(number == ','){
      if(this.itemQuantity.includes(',')){
      let test = this.itemQuantity.split('')
      test.pop()
      this.itemQuantity =  test.join("")
      }
      else{
      let test = this.itemQuantity.split('')
      test.push(',')
      this.itemQuantity =  test.join("")
      }
    }
    else{
      if(this.itemQuantity.includes(',')){
        this.itemQuantity = ''
        this.itemQuantity =  this.itemQuantity + number
      }
      else{
        this.itemQuantity =  this.itemQuantity + number
      }
     
    }

  }

  clearLast(){
    
    let last = this.itemQuantity.split('')
    last.pop()
    this.itemQuantity =  last.join("") 

  }

  getItemQuantity(){ 
    if(this.itemQuantity.includes(',')){
      this.dialogRef.close('0')
    }
    else{
      this.dialogRef.close(this.itemQuantity)
    }
  }

  clearAll(){
    this.itemQuantity = ''
    this.check = false;
    this.check1 =false;
  }

}
