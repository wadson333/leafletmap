import { Directive,ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSearch]'
})
export class SearchDirective {
  constructor(public viewContainerRef:ViewContainerRef) { }
}
