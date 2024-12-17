import { AfterViewInit, Directive, ElementRef, Input, OnInit , Renderer2} from '@angular/core';
import { StringReplacementService } from '../../services/string-replacement/string-replacement.service';
import { Observable } from 'rxjs';
import { FieldMappingModel } from '../../types/CommonTypes';

@Directive({
  selector: '[replacePlaceholder]',
})

export class ReplacePlaceholderDirective implements AfterViewInit {
  @Input() replacePlaceHolder: string = '';
  @Input() fallbackPlaceHolder: string = '';

  fieldMapping$: Observable<FieldMappingModel | null>;

  constructor(
    private element: ElementRef,
    private stringReplacementService: StringReplacementService,private renderer: Renderer2
  ) {}
  // ngOnInit(): void {
  //     const replaceContent = this.stringReplacementService.replaceOrFallback(
  //       this.replacePlaceHolder,
  //       this.fallbackPlaceHolder
  //     );
  //     this.element.nativeElement.innerHTML = replaceContent;
  //   }
    ngAfterViewInit(): void {
      this.modifyColDef();
    }


    private modifyColDef() {
      // Fetching the mappings from localStorage
      const modificationsRaw = localStorage.getItem('fieldMappingsSelect');
      
      const modifications = modificationsRaw ? JSON.parse(modificationsRaw) : {};
      
      // Ensure the element's tagName is MAT-OPTION before proceeding
      if (this.element.nativeElement.tagName === 'MAT-OPTION' || this.element.nativeElement.id === 'grid-listing') {
          // Fetch the current text, trim any whitespace
          let currentText = this.element.nativeElement.innerText;

          let modifiedCurrentText = currentText.split(' ').join('').toLowerCase();


          // Check if there's a modification entry for the current text

          const newText = modifications[modifiedCurrentText] ? modifications[modifiedCurrentText] : currentText;

          // Set the modified text, or the original text if no modification is found
          this.renderer.setProperty(this.element.nativeElement, 'innerText', newText);
      }
  }
  
}
