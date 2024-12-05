import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { StringReplacementService } from '../../services/string-replacement/string-replacement.service';
import { Observable } from 'rxjs';
import { FieldMappingModel } from '../../types/CommonTypes';

@Directive({
  selector: '[replacePlaceholder]',
})

export class ReplacePlaceholderDirective implements OnInit {
  @Input() replacePlaceHolder: string = '';
  @Input() fallbackPlaceHolder: string = '';

  fieldMapping$: Observable<FieldMappingModel | null>;

  constructor(
    private element: ElementRef,
    private stringReplacementService: StringReplacementService
  ) {}

  ngOnInit(): void {
      const replaceContent = this.stringReplacementService.replaceOrFallback(
        this.replacePlaceHolder,
        this.fallbackPlaceHolder
      );
      this.element.nativeElement.innerHTML = replaceContent;
  }
}
