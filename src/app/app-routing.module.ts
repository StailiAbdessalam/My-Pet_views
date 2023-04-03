import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EditComponent } from './components/profile/edit/edit.component';
import { HistoryComponent } from './components/profile/history/history.component';
import { AnimalComponent } from './components/create/animal/animal.component';
import { PostComponent } from './components/create/post/post.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: EditComponent},
  { path: 'profile/edit', component: EditComponent},
  { path: 'profile/history', component: HistoryComponent},
  { path: 'myanimals', component: AnimalComponent},
  { path: 'myposts', component: PostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
