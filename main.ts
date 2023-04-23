import { hanoiTowers } from "./hanoi-towers";
import type { Move, Tower, Towers } from "./hanoi-towers";

const towerLabels = ["A", "B", "C"];

function printTower(tower: Tower, index: number) {
  console.log(towerLabels[index], tower.join(" "));
}

function printTowers(towers: Towers) {
  towers.forEach(printTower);
}

function printMove(count: number, towers: Towers, { from, to }: Move) {
  if (from === to) {
    console.log("(0) Initial state");
    return;
  }
  const { length } = towers[to];
  if (length <= 0) {
    throw new Error("Invalid move: target column is empty");
  }
  const disc = towers[to][length - 1];
  console.log(`(${count}) Move disc ${disc} from tower ${towerLabels[from]} to ${towerLabels[to]}`);
}

function size(): number {
  const sizeArg = process.argv[2].trim();
  if (!/^\d{1,2}$/.test(sizeArg)) {
    throw new Error("Invalid size argument");
  }
  return parseInt(sizeArg, 10);
}

try {
  let count = 0;
  for (const [towers, move] of hanoiTowers(size())) {
    printMove(count++, towers, move);
    printTowers(towers);
    console.log();
  }
} catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : error instanceof String
      ? error
      : "Invalid size argument";
  console.error(message);
}
