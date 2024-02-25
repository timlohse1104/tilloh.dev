type CardColors = 'red' | 'yellow' | 'green' | 'blue';
type SpecialCardColor = 'black';

export class Card {
  protected color: CardColors | SpecialCardColor;
  protected value: number;
  protected handDivElement: HTMLElement;
  protected title: string;

  constructor(color, handDiv) {
    this.color = color;
    this.handDivElement = handDiv;
  }

  getColor() {
    return this.color;
  }

  getValue() {
    return this.value;
  }

  showInHand() {}
}

type NumberRange<T extends number> = number extends T ? number : _Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T
  ? R['length']
  : R['length'] | _Range<T, [T, ...R]>;
type NumberCardRange = NumberRange<9>;
export class NumberCard extends Card {
  private number: NumberCardRange;

  constructor(color, number, handDiv) {
    super(color, handDiv);
    this.number = number;
    this.title = number.toString();
    this.value = number;
  }

  getNumber() {
    return this.number;
  }

  showInHand() {
    // let cardDiv = document.createElement('div');
    let cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'uno-card');
    cardDiv.innerHTML = `<p class="uno-cardTitle">${this.title}</p>`;
    cardDiv.setAttribute('style', `background: ${this.color};`);
    this.handDivElement.appendChild(cardDiv);
  }
}

type ActionCardRange = '⏩' | '↩️' | '➕2';
export class ActionCard extends Card {
  private action: ActionCardRange;

  constructor(color, action, handDiv) {
    super(color, handDiv);
    this.action = action;
    this.title = action === 'reverse' ? '↩️' : action === 'plus' ? '➕2' : '⏩';
    this.value = 20;
  }

  getAction() {
    return this.action;
  }

  showInHand() {
    let cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'uno-card');
    cardDiv.innerHTML = `<p class="uno-cardTitle">${this.title}</p>`;
    cardDiv.setAttribute('style', `background: ${this.color}`);
    this.handDivElement.appendChild(cardDiv);
  }
}

type SpecialActionCardRange = '➕4' | '🎨';
export class SpecialActionCard extends Card {
  private action: SpecialActionCardRange;

  constructor(action, handDiv) {
    super('black', handDiv);
    this.action = action;
    this.title = action === 'quad' ? '➕4' : '🎨';
    this.value = 50;
  }

  getAction() {
    return this.action;
  }

  showInHand() {
    let cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'uno-card');
    cardDiv.innerHTML = `<p class="uno-cardTitle">${this.title}</p>`;
    cardDiv.setAttribute('style', `background: ${this.color}; color: white`);
    this.handDivElement.appendChild(cardDiv);
  }
}
