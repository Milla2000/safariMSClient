import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css'],
})
export class TourCardComponent {
  @Input() image?: string;
  @Input() location?: string;
  @Input() title?: string;
  @Input() rating?: number;
  @Input() reviews?: number;
  @Input() price?: number;
  @Input() discount?: number;

  get stars(): number[] {
    const rating = this.rating || 0;
    return Array(Math.round(rating)).fill(0);
  }
}
