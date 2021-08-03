import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpmnComponent } from './bpmn/bpmn.component';
import { DiagramComponent } from './bpmn/diagram/diagram.component';

const routes: Routes = [
  { path: 'bpmn', component: BpmnComponent },
  { path: 'diagram', component: DiagramComponent },
  { path: '', redirectTo: '/bpmn', pathMatch: 'full' },
  { path: '**', redirectTo: '/bpmn', pathMatch: 'full' },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
