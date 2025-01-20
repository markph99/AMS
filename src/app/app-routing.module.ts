import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkSchedulingComponent } from './work-scheduling/work-scheduling.component';

const routes: Routes = [
  {
    path: '',
    component: WorkSchedulingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
