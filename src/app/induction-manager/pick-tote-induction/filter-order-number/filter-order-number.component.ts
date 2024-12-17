import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-filter-order-number',
  templateUrl: './filter-order-number.component.html',
  styleUrls: ['./filter-order-number.component.scss'],
})
export class FilterOrderNumberComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public dialogRef: MatDialogRef<FilterOrderNumberComponent>
  ) {}

  @ViewChild('myText', { static: true }) myText: ElementRef;
  orderNumberFilter: string[] = [];
  subscription: Subscription[];
  isFilterByOrderNumbers: boolean = true; // Default selection
  orderRange: { lowerBound: string; upperBound: string } = { lowerBound: '', upperBound: '' };

  ngOnInit(): void {
    
    this.orderNumberFilter = this.data.OrderNumberFilter;
    
    // if (this.myText) {
    //   this.myText.nativeElement.value = this.orderNumberFilter.join('\n');
    // }
  }

  ngOnDestroy(): void {
   
  }

  onPaste(event: ClipboardEvent) {
    if (event && event.clipboardData) {
      const pastedText = event.clipboardData.getData('text');
      this.orderNumberFilter = pastedText.split('\n');
    }
  }

  onInput(content: string) {
    if (content && content !== '') {
      this.orderNumberFilter = content.split('\n');
    } else {
      this.orderNumberFilter = [];
    }
  }

  close() {
    this.dialogRef.close();
  }

  applyFilter() {
    const isRangeValid = this.orderRange.lowerBound && this.orderRange.upperBound;
    const isRangeOrdered = this.orderRange.lowerBound <= this.orderRange.upperBound;
  
    if (this.isFilterByOrderNumbers) {
      // Reset order range and return selected order number filters
   
      this.dialogRef.close({ orderNumberFilter: this.orderNumberFilter });
      return;
    }
  
    if (!isRangeValid) {
      this.global.ShowToastr(
        'info',
        'Both Lower Bound and Upper Bound must be filled before applying the filter.',
        'Info'
      );
      return;
    }
  
    if (!isRangeOrdered) {
      this.global.ShowToastr(
        'info',
        'Lower Bound cannot be greater than Upper Bound. Please adjust the range.',
        'Info'
      );
      return;
    }
  
   
    this.dialogRef.close({ orderRange: this.orderRange });
  }

  clearFilters() {
    if (this.isFilterByOrderNumbers) {
      // Clear the Order Numbers filter
      if (this.myText) {
        this.myText.nativeElement.value = '';
      }
  
      this.dialogRef.close({orderNumberFilter: null,isFilterByOrderNumbers:this.isFilterByOrderNumbers});

    } else {
      // Clear the Order Range filter
      this.dialogRef.close({ orderRange:null,isFilterByOrderNumbers:this.isFilterByOrderNumbers  });
    }
   


    
  }
}
