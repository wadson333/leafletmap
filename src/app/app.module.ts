import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { MapComponent } from './map/map.component';
import { SearchBoxComponent } from './left-pane/search-box/search-box.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftPaneComponent,
    MapComponent,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
