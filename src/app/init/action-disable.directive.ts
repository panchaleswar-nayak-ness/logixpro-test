import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[actionDisable]'
})
export class ActionDisableDirective implements OnInit{

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, "disabled", "true");
    this.elementRef.nativeElement.disabled = true;
  }
}
