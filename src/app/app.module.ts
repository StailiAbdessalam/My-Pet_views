import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import {MatIconModule} from '@angular/material/icon';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { EditComponent } from './components/profile/edit/edit.component';
import { HistoryComponent } from './components/profile/history/history.component';
import { PostComponent } from './components/create/post/post.component';
import { AnimalComponent } from './components/create/animal/animal.component';

import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import { CommentsComponent } from './shared/components/comments/comments.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    EditComponent,
    HistoryComponent,
    PostComponent,
    AnimalComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
