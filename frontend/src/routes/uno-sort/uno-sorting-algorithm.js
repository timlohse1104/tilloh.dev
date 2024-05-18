const unsortedHand = [
  {
    color: 'yellow',
    type: 'reverse',
    value: 20,
  },
  {
    color: 'red',
    type: 'one',
    value: 1,
  },
  {
    color: 'black',
    type: 'decider',
    value: 50,
  },
  {
    color: 'green',
    type: 'five',
    value: 5,
  },
  {
    color: 'red',
    type: 'skip',
    value: 20,
  },
  {
    color: 'red',
    type: 'eight',
    value: 8,
  },
  {
    color: 'yellow',
    type: 'three',
    value: 3,
  },
  {
    color: 'green',
    type: 'skip',
    value: 20,
  },
];

console.log('Starting with unsorted hand:');
unsortedHand.forEach((card, i) =>
  console.log(`#${i + 1}: ${card.color}, ${card.type} (${card.value})`)
);

console.log('------------------------------------');

/* Uno sorting algorithm
 * rules:
 * 1. cards with same color getting clustered
 * 2. cards in color cluster getting sorted ascended by value
 * 3. card color clusters will firstly get sorted ascended by amount of cards in cluster
 * 4. only black color cluster always be at the end
 * 5. if two card color clusters have the same amount of cards, clusters will be sorted ascending by sum of values
 */

const sortedHand = [...unsortedHand];

// Helper function to count the number of cards of each color
const countColor = (arr, color) =>
  arr.filter((card) => card.color === color).length;

// Helper function to calculate the sum of values of each color
const sumColorValue = (arr, color) =>
  arr
    .filter((card) => card.color === color)
    .reduce((sum, card) => sum + card.value, 0);

sortedHand.sort((a, b) => {
  if (a.color === 'black' || b.color === 'black') {
    return a.color === 'black' ? 1 : -1;
  }

  if (a.color === b.color) {
    return a.value - b.value;
  }

  const countA = countColor(sortedHand, a.color);
  const countB = countColor(sortedHand, b.color);

  if (countA === countB) {
    const sumA = sumColorValue(sortedHand, a.color);
    const sumB = sumColorValue(sortedHand, b.color);
    return sumA - sumB;
  }

  return countA - countB;
});

console.log('After sorting:');
sortedHand.forEach((card, i) =>
  console.log(`#${i + 1}: ${card.color}, ${card.type} (${card.value})`)
);
