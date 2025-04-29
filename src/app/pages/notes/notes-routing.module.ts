import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllNotesComponent} from './all-notes/all-notes.component';
import {AddNotesComponent} from './add-notes/add-notes.component';



const routes: Routes = [
  {path: '', redirectTo: 'notes-list', pathMatch: 'full'},
  {path: 'notes-list', component: AllNotesComponent},
  {path: 'add-note', component: AddNotesComponent},
  {path: 'edit-note/:id', component: AddNotesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
