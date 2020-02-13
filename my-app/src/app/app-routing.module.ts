import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticleComponent } from './article/article.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
  path:'',
  component:DashboardComponent
  },
  {
    path:'articles',
    component:ArticleComponent
  },
  {
    path:'login',
    component:LoginComponent
  }
];

@NgModule({
 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
