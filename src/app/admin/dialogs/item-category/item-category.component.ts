import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { DialogConstants, Mode, StringConditions, ToasterTitle, ToasterType ,Style} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})
export class  ItemCategoryComponent implements OnInit {
  @ViewChildren('category_category', { read: ElementRef }) categoryCategory: QueryList<ElementRef>;
  public categoryList: any;
  public userData: any;
  enableButton = [{ index : -1, value : true }];
  public category:string;
  public subCategory:string;
  public iCommonAPI : ICommonApi;
  @Output() selectionCleared = new EventEmitter<void>();

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    private authService: AuthService,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router
    ) { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
   this.category =  this.data.category;
    this.subCategory = this.data.subCategory;
    this.getCategoryList();
  }

  enableDisableButton(i:any)
  {
    if(this.enableButton[i]) {
      this.enableButton[i].value = false;
    }
  }

 getCategoryList(){
    this.iCommonAPI.getCategory().subscribe((res) => {
      this.categoryList = res.data;
      this.enableButton = [];
      let categoryFound = false;
      
      for(let i = 0; i < this.categoryList.length; i++) {
        this.categoryList[i].fromDB = true;
        if(this.categoryList[i].category == this.category && this.categoryList[i].subCategory == this.subCategory) {
          this.categoryList[i].IsSelected = true;
          categoryFound = true;
        }
        this.enableButton.push({index : i, value : true});
      }
      
      // If the currently selected category is not found in the updated list, clear the selection
      if(!categoryFound && (this.category || this.subCategory)) {
        this.category = '';
        this.subCategory = '';
        // Close the dialog with empty category to notify parent that selection was cleared
        this.dialogRef.close({category: '', subCategory: ''});
      }
      
      
      setTimeout(() => {
        const inputElements = this.categoryCategory.toArray();
        if (inputElements.length > 0) {
          const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
        }
      }, 100);
     });
  }

  addCatRow(){
    this.categoryList.unshift({
      category : "",
      subCategory: "",
      fromDB:false
    });
    this.enableButton.unshift({index:-1,value:true});
    
    setTimeout(() => {
      const inputElements = this.categoryCategory.toArray();
      if (inputElements.length > 0) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  saveCategory(category : any, oldCat : any, subCategory : any, oldSubCat : any) {
    let cond = true;
    if(category){
      this.categoryList.forEach(element => {
        if(element.category?.toLowerCase() == category?.toLowerCase() && element.subCategory?.toLowerCase() == subCategory?.toLowerCase()) {
          cond = false;
          this.global.ShowToastr(ToasterType.Error, 'Category cannot be saved. Category matches another entry. Save any pending changes before attempting to save this entry.', ToasterTitle.Error);
        }
      });
    }

    if(cond) {
      if(category || subCategory) {
        let paylaod = {
          "category": category,
          "oldCategory": oldCat.toString(),
          "subCategory": subCategory,
          "oldSubCategory": oldSubCat.toString()
        };
        this.iCommonAPI.saveCategory(paylaod).subscribe((res) => {
          if(res.isExecuted) {
            this.getCategoryList();
            this.global.ShowToastr(ToasterType.Success, oldCat.toString() == '' ? labels.alert.success : labels.alert.update, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("saveCategory", res.responseMessage);
          }
        });
      }
    }
  }

  dltCategory(category: string, subCategory: string) {
    const dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: { mode: Mode.DeleteCategory, category, subCategory }
    }) as MatDialogRef<DeleteConfirmationComponent>;

    dialogRef.afterClosed().subscribe(result => {
      if (result === StringConditions.Yes || (result && result.isExecuted === true)) {
        // If the deleted category is the currently selected one
        if (this.category === category && this.subCategory === subCategory) {
          // Emit event to notify parent to clear selection, but do not close the dialog
          this.selectionCleared.emit();
          // Also clear the selection in the dialog
          this.category = '';
          this.subCategory = '';
        }
        this.getCategoryList();
      }
    });
  }

  selectCategory(selectedCat: any){
    if(selectedCat.category != '' || selectedCat.subCategory != '')  this.dialogRef.close(selectedCat);
  }

  clearCategory(){
    this.dialogRef.close(DialogConstants.close);
  }
  ClearSelection(){
    this.dialogRef.close({category:'',subCategory:''});
  }

  openPrintRangeDialog(){
    this.global.Print(`FileName:printCategoriesReport`)
  }
}
