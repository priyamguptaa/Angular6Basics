import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-task2',
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.css']
})
export class Task2Component implements OnInit {

  userForm: FormGroup;

  constructor(private _form: FormBuilder) { }
  ngOnInit() {
    this.userForm = this._form.group({
      task: this._form.array([
        this._form.group({
          text: ['', Validators.required],
          dropdown: ['', [Validators.required, this.dropdownValidator()]],
          value: ['', [Validators.required]]
        })
      ])
    })
  }

  dropdownValidator() {

    return (dropdownControl: FormControl): { [key: string]: any } => {
      //let dropdown: FormControl = group.controls[dropdownKey] as FormControl;
      //let value: FormControl = group.controls[valueKey] as FormControl;
      if (!dropdownControl.parent) return;
      dropdownControl.parent.controls['value'].clearValidators();

      switch (dropdownControl.value) {
        case 'date':
        case 'number':
          dropdownControl.parent.controls['value'].reset();
          dropdownControl.parent.controls['value'].disable();
          break;
        case 'email':
          dropdownControl.parent.controls['value'].reset();
          dropdownControl.parent.controls['value'].enable();
          dropdownControl.parent.controls['value'].setValidators(Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'));
          break;
        case 'phone':
          dropdownControl.parent.controls['value'].reset();
          dropdownControl.parent.controls['value'].enable();
          dropdownControl.parent.controls['value'].setValidators(Validators.pattern('^[1-9][0-9]{9}'));
          break;
      }
      (dropdownControl.parent.controls['value'] as FormControl).updateValueAndValidity();
      return null;
    }
  }

  addTask() {
    let tasks = <FormArray>this.userForm.get('task');
    tasks.push(this._form.group({
      // text: [''],
      // dropdown: [''],
      // value: ['']

      text: ['', Validators.required],
      dropdown: ['', [Validators.required, this.dropdownValidator()]],
      value: ['', [Validators.required]]
    }));
  }

  removeTask(i) {
    let task = <FormArray>this.userForm.get('task');
    task.removeAt(i);
  }
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
    else {
      this.validateAllFormFields(this.userForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
      else if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((element: FormGroup) => {
          this.validateAllFormFields(element);
        });
      }
    });
  }
}



