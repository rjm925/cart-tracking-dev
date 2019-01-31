import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProcessorsComponent } from './components/processors/processors.component';
import { ProcessorCartsComponent } from './components/processor-carts/processor-carts.component';
import { TestPageComponent } from './components/test-page/test-page.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'login', component: LoginComponent},
  {path: 'settings', component: SettingsComponent, canActivate:[AuthGuard]},
  {path: 'processors', component: ProcessorsComponent, canActivate:[AuthGuard]},
  {path: 'processor', component: ProcessorCartsComponent},
  {path: 'test-page', component: TestPageComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
