import { ActionCard, NumberCard, SpecialActionCard, type Card } from './cards';

export class UnoSort {
  private handDivElement: HTMLElement;
  private stackSizeElement: HTMLElement;
  private handSizeElement: HTMLElement;

  constructor(
    handDivElement: HTMLElement,
    stackSizeElement: HTMLElement,
    handSizeElement: HTMLElement
  ) {
    this.handDivElement = handDivElement;
    this.stackSizeElement = stackSizeElement;
    this.handSizeElement = handSizeElement;
  }

  // Hand des Spielers
  private hand: Array<Card> = [];
  // Deck erstellen
  private stack: Array<Card> = [];

  public start(cardAmount: number) {
    // Stapel erzeugen und mischen
    this.generateStack();
    console.log(
      '-Anzahl-------------------------------------------------------------'
    );
    console.log(this.stack.length);
    console.log(
      '-Gemischt-----------------------------------------------------------'
    );
    console.log(this.stack);
    // Anzahl Karten ziehen
    this.pickCards(cardAmount);
    console.log(
      '-Spielerhand-unsortiert---------------------------------------------'
    );
    console.log(this.hand);
    // Hand sortieren
    this.sortHand();
    console.log(
      '-Spielerhand-sortiert-----------------------------------------------'
    );
    console.log(this.hand);
    // Visualisieren
    this.printHand();
    this.printStackSize();
  }

  private generateStack() {
    // Stapelkonfiguration
    const config = {
      numberCards: [
        {
          amount: 1,
          number: 0,
          color: 'red',
        },
        {
          amount: 2,
          number: 1,
          color: 'red',
        },
        {
          amount: 2,
          number: 2,
          color: 'red',
        },
        {
          amount: 2,
          number: 3,
          color: 'red',
        },
        {
          amount: 2,
          number: 4,
          color: 'red',
        },
        {
          amount: 2,
          number: 5,
          color: 'red',
        },
        {
          amount: 2,
          number: 6,
          color: 'red',
        },
        {
          amount: 2,
          number: 7,
          color: 'red',
        },
        {
          amount: 2,
          number: 8,
          color: 'red',
        },
        {
          amount: 2,
          number: 9,
          color: 'red',
        },
        {
          amount: 1,
          number: 0,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 1,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 2,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 3,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 4,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 5,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 6,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 7,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 8,
          color: 'yellow',
        },
        {
          amount: 2,
          number: 9,
          color: 'yellow',
        },
        {
          amount: 1,
          number: 0,
          color: 'green',
        },
        {
          amount: 2,
          number: 1,
          color: 'green',
        },
        {
          amount: 2,
          number: 2,
          color: 'green',
        },
        {
          amount: 2,
          number: 3,
          color: 'green',
        },
        {
          amount: 2,
          number: 4,
          color: 'green',
        },
        {
          amount: 2,
          number: 5,
          color: 'green',
        },
        {
          amount: 2,
          number: 6,
          color: 'green',
        },
        {
          amount: 2,
          number: 7,
          color: 'green',
        },
        {
          amount: 2,
          number: 8,
          color: 'green',
        },
        {
          amount: 2,
          number: 9,
          color: 'green',
        },
        {
          amount: 1,
          number: 0,
          color: 'blue',
        },
        {
          amount: 2,
          number: 1,
          color: 'blue',
        },
        {
          amount: 2,
          number: 2,
          color: 'blue',
        },
        {
          amount: 2,
          number: 3,
          color: 'blue',
        },
        {
          amount: 2,
          number: 4,
          color: 'blue',
        },
        {
          amount: 2,
          number: 5,
          color: 'blue',
        },
        {
          amount: 2,
          number: 6,
          color: 'blue',
        },
        {
          amount: 2,
          number: 7,
          color: 'blue',
        },
        {
          amount: 2,
          number: 8,
          color: 'blue',
        },
        {
          amount: 2,
          number: 9,
          color: 'blue',
        },
      ],
      actionCards: [
        {
          amount: 2,
          action: 'skip',
          color: 'red',
        },
        {
          amount: 2,
          action: 'reverse',
          color: 'red',
        },
        {
          amount: 2,
          action: 'double',
          color: 'red',
        },
        {
          amount: 2,
          action: 'skip',
          color: 'yellow',
        },
        {
          amount: 2,
          action: 'reverse',
          color: 'yellow',
        },
        {
          amount: 2,
          action: 'double',
          color: 'yellow',
        },
        {
          amount: 2,
          action: 'skip',
          color: 'green',
        },
        {
          amount: 2,
          action: 'reverse',
          color: 'green',
        },
        {
          amount: 2,
          action: 'double',
          color: 'green',
        },
        {
          amount: 2,
          action: 'skip',
          color: 'blue',
        },
        {
          amount: 2,
          action: 'reverse',
          color: 'blue',
        },
        {
          amount: 2,
          action: 'double',
          color: 'blue',
        },
      ],
      specialActionCards: [
        {
          amount: 4,
          action: 'quad',
        },
        {
          amount: 4,
          action: 'choose',
        },
      ],
    };
    // Nummerkarten erzeugen
    config.numberCards.forEach((numberCard) => {
      for (let i = 1; i <= numberCard.amount; i++) {
        this.stack.push(
          new NumberCard(
            numberCard.color,
            numberCard.number,
            this.handDivElement
          )
        );
      }
    });
    // Aktionskarten erzeugen
    config.actionCards.forEach((actionCard) => {
      for (let i = 1; i <= actionCard.amount; i++) {
        this.stack.push(
          new ActionCard(
            actionCard.color,
            actionCard.action,
            this.handDivElement
          )
        );
      }
    });
    // Spezial Aktionskarten erzeugen
    config.specialActionCards.forEach((specialActionCard) => {
      for (let i = 1; i <= specialActionCard.amount; i++) {
        this.stack.push(
          new SpecialActionCard(specialActionCard.action, this.handDivElement)
        );
      }
    });
    // Stapel mischen
    this.stack.sort(() => {
      return 0.5 - Math.random();
    });
  }

  private pickCards(cardAmount: number) {
    // Ziehe Anzahl der Karten vom Stapel und lege sie in die Hand des Spielers
    for (let i = 1; i <= cardAmount; i++) {
      // Unnötig, da man bei Uni die Karten auch nicht zufällig aus der Mitte nimmt!
      // const randomNumber = Math.floor(Math.random() * this.stack.length);
      // this.hand.push(this.stack.splice(randomNumber, 1)[0]);
      this.hand.push(this.stack.pop());
    }
  }

  // Helper function to count the number of cards of each color
  countColor = (arr, color) =>
    arr.filter((card) => card.color === color).length;

  // Helper function to calculate the sum of values of each color
  sumColorValue = (arr, color) =>
    arr
      .filter((card) => card.color === color)
      .reduce((sum, card) => sum + card.value, 0);

  sortHand() {
    const sortedHand = [...this.hand];

    sortedHand.sort((a, b) => {
      if (a.getColor() === 'black' || b.getColor() === 'black') {
        return a.getColor() === 'black' ? 1 : -1;
      }

      if (a.getColor() === b.getColor()) {
        return a.getValue() - b.getValue();
      }

      const countA = this.countColor(sortedHand, a.getColor());
      const countB = this.countColor(sortedHand, b.getColor());

      if (countA === countB) {
        const sumA = this.sumColorValue(sortedHand, a.getColor());
        const sumB = this.sumColorValue(sortedHand, b.getColor());
        return sumA - sumB;
      }

      return countA - countB;
    });

    this.hand = sortedHand;
  }

  printHand() {
    this.handSizeElement.innerText = `(${this.hand.length.toString()})`;
    this.handDivElement.innerHTML = '';
    this.hand.forEach((card) => card.showInHand());
  }

  printStackSize() {
    this.stackSizeElement.innerText = `(${this.stack.length.toString()})`;
  }

  getStackSize() {
    return this.stack.length;
  }
}
