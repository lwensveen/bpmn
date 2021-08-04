import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BpmnService } from './common/bpmn.service';
import { DiagramComponent } from './diagram/diagram.component';

@NgModule({
  declarations: [AppComponent, DiagramComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [BpmnService],
  bootstrap: [AppComponent],
})
export class AppModule {}
