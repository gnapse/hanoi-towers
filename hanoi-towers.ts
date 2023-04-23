/**
 * A tower in the game, listing the discs from bottom to top.
 *
 * Each disc is represented by a number, and the code driving the game must ensure that a larger
 * disc is never placed on top of a smaller one.
 */
type Tower = number[];

/**
 * Encodes the state of the game, consisting of three towers of discs.
 */
type Towers = [Tower, Tower, Tower];

/**
 * Valid indices of towers in the game.
 */
type Index = 0 | 1 | 2;

/**
 * A move of the game, containing the index of the tower from where a disc was moved, and the tower
 * to which it was moved.
 */
type Move = { from: Index; to: Index };

/**
 * The state of the game, and the move that lead to it.
 *
 * If the move consists of the same "from" and "to" values, it means that there was not previous
 * move, and that the game represents the initial game state.
 */
type Step = [Towers, Move];

/**
 * We need new instances for the generator to yield, and this function is used for that purpose.
 */
function cloneTowers(towers: Towers): Towers {
  return [[...towers[0]], [...towers[1]], [...towers[2]]];
}

/**
 * Moves the top disc in the "from" tower to be at the top of the "to" tower.
 * @param towers the current game configuration
 * @param options from and where to move the disc
 * @returns the new game configuration and info about the move that generated it
 */
function moveDisc(towers: Towers, { from, to }: Move): Step {
  const disc = towers[from].pop();
  if (disc == null) {
    throw new Error("Extracting from empty tower");
  }

  const top = towers[to].length > 0 ? towers[to][towers[to].length - 1] : null;
  if (top != null && top <= disc) {
    throw new Error("Attempt to put a smaller disc on top of a larger one");
  }

  towers[to].push(disc);
  return [cloneTowers(towers), { from, to }];
}

function* solve(
  towers: Towers,
  [count, from, to, swap]: [number, Index, Index, Index] = [towers[0].length, 0, 2, 1]
): Generator<Step, void, unknown> {
  if (from === to || from === swap || to === swap) {
    throw new Error(`Invalid indices ${JSON.stringify({ from, to, swap })}`);
  }
  if (count === 0) {
    return;
  }

  yield* solve(towers, [count - 1, from, swap, to]);
  yield moveDisc(towers, { from, to });
  yield* solve(towers, [count - 1, swap, to, from]);
}

function getInitialState(size: number): Towers {
  const tower: Tower = [];
  for (let i = 0; i < size; i++) {
    tower.push(size - i);
  }
  return [tower, [], []];
}

function* hanoiTowers(size: number): Generator<Step, void, unknown> {
  if (size > 12) {
    throw new Error("Size too large");
  }
  const towers = getInitialState(size);
  yield [cloneTowers(towers), { from: 1, to: 1 }];
  yield* solve(towers);
}

export { hanoiTowers };
export type { Tower, Towers, Move, Step };
