import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {UiService} from "../../../../services/core/ui.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public dialogRef: MatDialogRef<NoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {note?: string }
  ) {
  }

  ngOnInit(): void {
// Init Form
    this.initDataForm();
    this.setFormValue();
  }

  private setFormValue() {
    this.dataForm.patchValue({note: this.data})
  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      note: [null],
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {

      this.uiService.warn('Please filed all the required field');
      return;
    }

    this.dialogRef.close(this.dataForm.value)
  }
}
