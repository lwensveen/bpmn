import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import {FormsModule} from "@angular/forms";
import {BpmnService} from "./common/bpmn.service";

@NgModule({
  declarations: [AppComponent, DiagramComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [BpmnService],
  bootstrap: [AppComponent],
})
export class AppModule {}
