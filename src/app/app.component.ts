import { Component, OnInit } from '@angular/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Card } from './shared/models/card';
import { RANGING } from './ranging';
import { SpreadSheetsService } from './shared/services/spread-sheets.service';
import { STORAGE_KEY } from './shared/constants/storage-key';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        width: 200,
        transform: 'translateX(0)', opacity: 1
      })),
      transition('void => *', [
        style({width: 10, transform: 'translateX(50px)', opacity: 0}),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: 150
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
            width: 100
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
  title = 'ranging-app';
  trackById = (index: number, entity: Card) => entity.id;
  private original = RANGING.slice(4);
  cards = RANGING.slice(0, 4);
  selectedCards: number[] = [];
  isCompleteBefore!: string | null;

  constructor(private readonly spreadSheet: SpreadSheetsService) {
  }

  ngOnInit() {
    this.checkIfCompleteBefore();
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
      }, 400);
      return;
    }
    const lastItems = this.cards.filter((card: Card) => card.id !== entity.id);
    this.selectedCards = [...this.selectedCards, entity.id, lastItems[0].id];
    this.cards = [];
    // this.spreadSheet.createSheet(this.selectedCards)
    //   .pipe(tap(() => this.checkIfCompleteBefore()))
    //   .subscribe();
    this.spreadSheet.createSheet(this.selectedCards);
    this.checkIfCompleteBefore();
  }

  private checkIfCompleteBefore() {
    this.isCompleteBefore = localStorage.getItem(STORAGE_KEY);
  }
}
