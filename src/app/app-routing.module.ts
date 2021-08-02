import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramComponent } from './diagram/diagram.component';

const routes: Routes = [
  { path: 'diagram', component: DiagramComponent },
  { path: '', redirectTo: '/diagram', pathMatch: 'full' },
  { path: '**', redirectTo: '/diagram', pathMatch: 'full' },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
