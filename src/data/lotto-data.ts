export interface LottoGame {
  id: string;
  name: string;
  numbers: number;
  range: number;
}

export interface WinningDraw {
  gameId: string;
  date: string;
  numbers: number[];
  jackpot: string;
}

export interface ScanResult {
  id: string;
  gameId: string;
  scannedNumbers: number[];
  winningNumbers: number[];
  matchCount: number;
  prize: string;
  date: string;
  isWinner: boolean;
}

export const LOTTO_GAMES: LottoGame[] = [
  { id: "6-42", name: "6/42", numbers: 6, range: 42 },
  { id: "6-45", name: "6/45", numbers: 6, range: 45 },
  { id: "6-49", name: "6/49", numbers: 6, range: 49 },
  { id: "6-55", name: "6/55", numbers: 6, range: 55 },
  { id: "6-58", name: "6/58", numbers: 6, range: 58 },
];

export const MOCK_WINNING_DRAWS: WinningDraw[] = [
  {
    gameId: "6-42",
    date: "2025-09-29",
    numbers: [5, 12, 18, 23, 31, 38],
    jackpot: "₱15,840,000.00",
  },
  {
    gameId: "6-45",
    date: "2025-09-29",
    numbers: [8, 15, 22, 29, 36, 42],
    jackpot: "₱28,500,000.00",
  },
  {
    gameId: "6-49",
    date: "2025-09-28",
    numbers: [3, 11, 19, 27, 35, 44],
    jackpot: "₱45,200,000.00",
  },
  {
    gameId: "6-55",
    date: "2025-09-28",
    numbers: [7, 14, 21, 28, 42, 49],
    jackpot: "₱62,800,000.00",
  },
  {
    gameId: "6-58",
    date: "2025-09-27",
    numbers: [9, 16, 24, 32, 41, 55],
    jackpot: "₱89,400,000.00",
  },
];

export function getPrizeInfo(matchCount: number): {
  prize: string;
  isWinner: boolean;
} {
  switch (matchCount) {
    case 6:
      return { prize: "JACKPOT WINNER!", isWinner: true };
    case 5:
      return { prize: "₱50,000.00", isWinner: true };
    case 4:
      return { prize: "₱2,000.00", isWinner: true };
    case 3:
      return { prize: "₱150.00", isWinner: true };
    default:
      return { prize: "No Prize", isWinner: false };
  }
}

export function mockOCR(gameId: string): number[] {
  const game = LOTTO_GAMES.find((g) => g.id === gameId);
  if (!game) return [];

  const numbers: number[] = [];
  while (numbers.length < game.numbers) {
    const num = Math.floor(Math.random() * game.range) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

export function compareNumbers(scanned: number[], winning: number[]): number {
  return scanned.filter((num) => winning.includes(num)).length;
}
