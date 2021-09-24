import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GridAllModule} from '@syncfusion/ej2-angular-grids';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import {DropDownListAllModule} from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridAllModule,
    TreeGridAllModule,
    DropDownListAllModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
