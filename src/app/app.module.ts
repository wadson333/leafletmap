import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { MapComponent } from './map/map.component';
import { SearchBoxComponent } from './left-pane/search-box/search-box.component';
import { SearchDirective } from './left-pane/search.directive';

@NgModule({
  declarations: [
    AppComponent,
    LeftPaneComponent,
    MapComponent,
    SearchBoxComponent,
    SearchDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SearchBoxComponent]
})
export class AppModule { }
