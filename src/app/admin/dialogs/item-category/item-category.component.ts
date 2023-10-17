import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: []
})
export class  ItemCategoryComponent implements OnInit {
  @ViewChildren('category_category', { read: ElementRef }) category_category: QueryList<ElementRef>;
  public category_list: any;
  public userData: any;
  enableButton=[{index:-1,value:true}];

  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    private authService: AuthService,
    
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<any>, 
    public route: Router
    ) { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getCategoryList();
  }

  enableDisableButton(i:any)
  {
  this.enableButton[i].value=false;
  }

 getCategoryList(){ 
    this.iCommonAPI.getCategory().subscribe((res) => {
      this.category_list = res.data;
      this.enableButton=[];
      for(let i=0;i<this.category_list.length;i++)
      {
        this.category_list.fromDB = true;
        this.enableButton.push({index:i,value:true});
      }

      setTimeout(() => {
        const inputElements = this.category_category.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
      }, 100);
     });
  }

  addCatRow(row : any){
    this.category_list.unshift({
      category : "",
      subCategory: "",
      fromDB:false
  });
  this.enableButton.push({index:-1,value:true})
  const lastIndex = this.category_list.length - 1;
    setTimeout(() => {
      const inputElements = this.category_category.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });

  }

  saveCategory(category : any, oldCat : any, subCategory : any, oldSubCat : any) {
    
    let cond = true;
    if(category){ 
    this.category_list.forEach(element => {
      if(element.category?.toLowerCase() == category?.toLowerCase() && element.subCategory?.toLowerCase() == subCategory?.toLowerCase() ) {
        cond = false;
       this.global.ShowToastr('error','Category cannot be saved. Category matches another entry. Save any pending changes before attempting to save this entry.', 'Error!');
   
      }  

    });

  } 
  if(cond){
  
    if(category || subCategory){
      let paylaod = {      
        "category": category,
        "oldCategory": oldCat.toString(),
        "subCategory": subCategory,
        "oldSubCategory": oldSubCat.toString()
      } 
      
      this.iCommonAPI.saveCategory(paylaod).subscribe((res) => {
        if(res.isExecuted){
          this.getCategoryList();
        this.global.ShowToastr('success',oldCat.toString()==''?labels.alert.success:labels.alert.update, 'Success!');
      }
      else{
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("saveCategory",res.responseMessage);

      }
      });
    }
  }
  }

  dltCategory(category : any, subCategory : any){

    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{mode:"delete-category",category,subCategory}
    })
    dialogRef.afterClosed().subscribe(result => { 
     if(result === 'Yes'){
      if(category && subCategory){
        this.getCategoryList();
      } else {
        this.enableButton.shift();
        this.category_list.shift();
      }
     }
    })











    
  }

  selectCategory(selectedCat: any){
    if(selectedCat.category!='' || selectedCat.subCategory!='')
    {

      this.dialogRef.close(selectedCat);
    }
  }

  clearCategory(){
    this.dialogRef.close('');
  }

  openPrintRangeDialog(){
    this.global.Print(`FileName:printCategoriesReport`)
  }
}
