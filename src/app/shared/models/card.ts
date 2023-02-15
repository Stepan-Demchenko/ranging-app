export interface Card {
  id: number;
  title: string;
  body: string;
  price: number;
}

export interface Question {
  selected: boolean;
  value: string;
}
