import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RoutesComponent } from './routes/routes.component';
import { StopsComponent } from './stops/stops.component';
import {AppRoutingModule} from './app-routing.module';
import {DropdownDirective} from './shared/dropdown.directive';
import {HttpClientModule} from '@angular/common/http';
import {StopsService} from './stops/stops.service';
import { StopDetailComponent } from './stops/stop-detail/stop-detail.component';
import {RoutesService} from './routes/routes.service';
import { ClockComponent } from './clock/clock.component';
import { UploadComponent } from './upload/upload.component';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RoutesComponent,
    StopsComponent,
    DropdownDirective,
    StopDetailComponent,
    ClockComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  providers: [StopsService, RoutesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
