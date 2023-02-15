import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlModule } from '../../pipes/safe-html.module';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, SafeHtmlModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title = '';
  @Input() body = '';
  @Input() price: number = 0;
}
