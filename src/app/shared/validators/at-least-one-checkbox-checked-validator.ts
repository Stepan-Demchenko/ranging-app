import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export function atLeastOneCheckboxCheckedValidator(minRequired = 1): ValidatorFn {
  const validator: ValidatorFn = (formArray: AbstractControl) => {
    if (formArray instanceof FormArray) {
      const totalSelected = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return totalSelected >= minRequired ? null : {required: true};
    }

    throw new Error('formArray is not an instance of FormArray');
  }

  return validator;
}
