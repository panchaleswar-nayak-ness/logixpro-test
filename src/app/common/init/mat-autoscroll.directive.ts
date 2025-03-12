import { Directive, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[optionsScroll]'
})
export class MatAutocompleteScrollDirective implements AfterViewInit, OnDestroy {
  @Output() optionsScroll = new EventEmitter<void>();
  private destroy$ = new Subject<void>();
  private isAtBottom = false; // Prevents duplicate firings

  constructor(private autocomplete: MatAutocomplete) {}

  ngAfterViewInit() {
    this.autocomplete.opened.subscribe(() => {
      this.removeScrollListener();

      setTimeout(() => {
        if (this.autocomplete.panel) {
          fromEvent(this.autocomplete.panel.nativeElement, 'scroll')
            .pipe(
              throttleTime(150),
              takeUntil(this.destroy$)
            )
            .subscribe(() => this.checkScrollPosition());
        }
      }, 100);
    });

    this.autocomplete.closed.subscribe(() => {
      this.removeScrollListener();
    });
  }

  private checkScrollPosition() {
    if (!this.autocomplete.panel) return;

    const element = this.autocomplete.panel.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 10;

    if (atBottom && !this.isAtBottom) {
      this.isAtBottom = true;
      this.optionsScroll.emit();
    } else if (!atBottom) {
      this.isAtBottom = false; // Reset when scrolling up
    }
  }

  private removeScrollListener() {
    this.destroy$.next();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}