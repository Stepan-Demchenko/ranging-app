import { Component, OnInit } from '@angular/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Card, Question } from './shared/models/card';
import { RANGING } from './ranging';
import { SpreadSheetsService } from './shared/services/spread-sheets.service';
import { STORAGE_KEY } from './shared/constants/storage-key';
import { tap } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ELECTRO_EPILATION,
  ELOS_EPILATION,
  LASERE_EPILATION,
  PHOTO_EPILATION, SUGARING, WAX_EPILATION
} from './shared/constants/multiple-answers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        width: '100%',
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({width: '25%', transform: 'translateX(25%)', opacity: 0}),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: '50%'
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
      transition('* => void', [
        group([
          animate('0.3s ease', style({
            transform: 'translateX(50px)',
            width: '75%'
          })),
          animate('0.3s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ],
})
export class AppComponent implements OnInit {
  private original = RANGING.slice(4);
  readonly RANGING = RANGING;
  cards = RANGING.slice(0, 4);
  selectedCards: number[] = [];
  isCompleteBefore!: string | null;
  form!: FormGroup;
  LASERE_PILATION = LASERE_EPILATION;
  ELOS_EPILATION = ELOS_EPILATION;
  PHOTO_EPILATION = PHOTO_EPILATION;
  ELECTRO_EPILATION = ELECTRO_EPILATION;
  SUGARING = SUGARING;
  WAX_EPILATION = WAX_EPILATION;
  trackById = (index: number, entity: Card) => entity.id;

  constructor(private readonly spreadSheet: SpreadSheetsService,
              private readonly fb: FormBuilder) {
  }

  ngOnInit() {
    this.checkIfCompleteBefore();
    this.initializeForm();
  }

  private normalizeMultipleQuestionForm(formControlKey: string, questions: Question[]): string[] {
    return this.form.get(formControlKey)!.value
      .map((selected: boolean, index: number) => {
        return {
          selected: selected,
          value: questions[index].value
        }
      })
      .filter((val: any) => val.selected)
      .map((val: any) => val.value)
  }

  select(index: number, entity: Card): void {
    if (this.cards.length > 2) {
      this.selectedCards.push(entity.id);
      this.cards = [...this.cards.slice(0, index), ...this.cards.slice(index + 1)];
      setTimeout(() => {
        const nextItem = this.original.shift();
        if (nextItem) {
          this.cards = [...this.cards, nextItem];
        }
      }, 600);
      return;
    }
    const lastItems = this.cards.filter((card: Card) => card.id !== entity.id);
    this.selectedCards = [...this.selectedCards, entity.id, lastItems[0].id];
    this.cards = [];
  }

  get laserEpilation(): FormArray {
    return this.form.get('laserEpilation') as FormArray;
  };

  get elosEpilation(): FormArray {
    return this.form.get('elosEpilation') as FormArray;
  };

  get photoEpilation(): FormArray {
    return this.form.get('photoEpilation') as FormArray;
  };

  get electroEpilation(): FormArray {
    return this.form.get('electroEpilation') as FormArray;
  };

  get sugaring(): FormArray {
    return this.form.get('sugaring') as FormArray;
  };

  get waxEpilation(): FormArray {
    return this.form.get('waxEpilation') as FormArray;
  };

  initializeForm(): void {
    this.form = this.fb.group({
      age: [null, Validators.required],
      problemOfUnwantedHair: [null, Validators.required],
      contactedToСosmetology: [null, Validators.required],
      isHelpMethods: [null, Validators.required],
      isExistMethodsToResolveThisProblems: [null, Validators.required],
      isExpensiveServiceToResolveProblem: [null, Validators.required],
      laserEpilation: this.buildMultipleAnswers(LASERE_EPILATION),
      elosEpilation: this.buildMultipleAnswers(ELOS_EPILATION),
      photoEpilation: this.buildMultipleAnswers(PHOTO_EPILATION),
      electroEpilation: this.buildMultipleAnswers(ELECTRO_EPILATION),
      sugaring: this.buildMultipleAnswers(SUGARING),
      waxEpilation: this.buildMultipleAnswers(WAX_EPILATION)
    });
  }

  private buildMultipleAnswers(questions: Question[]): FormArray {
    const arr = questions.map((question: Question) => {
      return this.fb.control(question.selected);
    });
    return this.fb.array(arr);
  }

  submit(): void {
    const formValue = Object.assign({}, this.form.value, {
      laserEpilation: this.normalizeMultipleQuestionForm('laserEpilation', LASERE_EPILATION).toString(),
      elosEpilation: this.normalizeMultipleQuestionForm('elosEpilation', ELOS_EPILATION).toString(),
      photoEpilation: this.normalizeMultipleQuestionForm('photoEpilation', PHOTO_EPILATION).toString(),
      electroEpilation: this.normalizeMultipleQuestionForm('electroEpilation', ELECTRO_EPILATION).toString(),
      sugaring: this.normalizeMultipleQuestionForm('sugaring', SUGARING).toString(),
      waxEpilation: this.normalizeMultipleQuestionForm('waxEpilation', WAX_EPILATION).toString()
    });
    this.spreadSheet.createSheet(this.selectedCards, formValue)
      .pipe(tap(() => this.checkIfCompleteBefore()))
      .subscribe();
  }

  private checkIfCompleteBefore() {
    this.isCompleteBefore = localStorage.getItem(STORAGE_KEY);
  }
}
