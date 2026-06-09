"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

type Card = {
  suit: string;
  rank: string;
  value: number;
};

type GameStatus = "ready" | "playing" | "playerWin" | "dealerWin" | "push";
type Result = "win" | "loss" | "push";

type HandRecord = {
  handNumber: number;
  timestamp: string;
  result: Result;
  playerScore: number;
  dealerScore: number;
  playerCards: string;
  dealerCards: string;
  playerBlackjack: boolean;
  dealerBlackjack: boolean;
  playerBust: boolean;
  dealerBust: boolean;
  playerHits: number;
};

type Position = {
  x: number;
  y: number;
};

type Direction = "up" | "down" | "left" | "right";

type SnakeGameRecord = {
  gameNumber: number;
  timestamp: string;
  score: number;
  highScoreAtEnd: number;
  timeSurvivedSeconds: number;
  moves: number;
  turns: number;
  finalLength: number;
  cause: "wall" | "self";
};

type WeatherInputs = {
  city: string;
  tempF: number;
  rainChance: number;
  windMph: number;
  humidity: number;
  uvIndex: number;
  visibilityMiles: number;
};

type WeatherNumberField = Exclude<keyof WeatherInputs, "city">;

const suits = ["♠", "♥", "♦", "♣"];

const ranks = [
  { rank: "A", value: 11 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 },
];

const gridSize = 16;

const startingSnake: Position[] = [
  { x: 7, y: 8 },
  { x: 6, y: 8 },
  { x: 5, y: 8 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function makeDeck() {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const card of ranks) {
      deck.push({
        suit,
        rank: card.rank,
        value: card.value,
      });
    }
  }

  return deck;
}

function shuffleDeck(deck: Card[]) {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

function getHandValue(hand: Card[]) {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter((card) => card.rank === "A").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function isBlackjack(hand: Card[]) {
  return hand.length === 2 && getHandValue(hand) === 21;
}

function getSuitName(suit: string) {
  if (suit === "♠") return "Spades";
  if (suit === "♥") return "Hearts";
  if (suit === "♦") return "Diamonds";
  if (suit === "♣") return "Clubs";
  return suit;
}

function formatCards(hand: Card[]) {
  return hand
    .map((card) => `${card.rank} of ${getSuitName(card.suit)}`)
    .join(" | ");
}

function formatPercent(value: number, total: number) {
  if (total === 0) return "--";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function csvValue(value: string | number | boolean) {
  const stringValue = String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function downloadCsv(
  fileName: string,
  headers: string[],
  rows: Array<Array<string | number | boolean>>
) {
  const csv = [
    headers.map(csvValue).join(","),
    ...rows.map((row) => row.map(csvValue).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function parseCsvText(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

function isSameCell(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

function isOppositeDirection(a: Direction, b: Direction) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

function getRandomFood(snake: Position[]) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    if (!snake.some((cell) => isSameCell(cell, food))) {
      return food;
    }
  }
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function CompactStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-zinc-800 bg-black/40"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p
        className={
          accent
            ? "mt-2 text-3xl font-black text-cyan-300"
            : "mt-2 text-2xl font-bold text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function CardView({ card, hidden = false }: { card?: Card; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-cyan-300/40 bg-zinc-900 text-2xl font-bold text-cyan-300">
        ?
      </div>
    );
  }

  if (!card) return null;

  const isRed = card.suit === "♥" || card.suit === "♦";

  return (
    <div
      className={`flex h-28 w-20 flex-col justify-between rounded-xl border border-zinc-700 bg-white p-3 text-lg font-bold shadow-lg ${
        isRed ? "text-red-500" : "text-black"
      }`}
    >
      <span>{card.rank}</span>
      <span className="text-center text-3xl">{card.suit}</span>
      <span className="self-end">{card.rank}</span>
    </div>
  );
}

export default function PlaygroundPage() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [message, setMessage] = useState(
    "Start a new hand to test the blackjack logic."
  );
  const [currentHandHits, setCurrentHandHits] = useState(0);
  const [handHistory, setHandHistory] = useState<HandRecord[]>([]);

  const [simulationStats, setSimulationStats] = useState({
    hands: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
  });

  const [snake, setSnake] = useState<Position[]>(startingSnake);
  const [food, setFood] = useState<Position>({ x: 12, y: 8 });
  const [direction, setDirection] = useState<Direction>("right");
  const [nextDirection, setNextDirection] = useState<Direction>("right");
  const [snakeRunning, setSnakeRunning] = useState(false);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [snakeStartedAt, setSnakeStartedAt] = useState<number | null>(null);
  const [snakeElapsedSeconds, setSnakeElapsedSeconds] = useState(0);
  const [snakeMoves, setSnakeMoves] = useState(0);
  const [snakeTurns, setSnakeTurns] = useState(0);
  const [snakeGameHistory, setSnakeGameHistory] = useState<SnakeGameRecord[]>(
    []
  );

  const [csvFileName, setCsvFileName] = useState("No file uploaded");
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState("");

  const [weather, setWeather] = useState<WeatherInputs>({
    city: "San Jacinto, CA",
    tempF: 78,
    rainChance: 5,
    windMph: 8,
    humidity: 42,
    uvIndex: 6,
    visibilityMiles: 10,
  });

  const snakeScoreRef = useRef(0);
  const snakeHighScoreRef = useRef(0);
  const snakeMovesRef = useRef(0);
  const snakeTurnsRef = useRef(0);
  const snakeStartedAtRef = useRef<number | null>(null);
  const snakeGameRecordedRef = useRef(false);

  const sessionStats = useMemo(() => {
    const hands = handHistory.length;
    const wins = handHistory.filter((hand) => hand.result === "win").length;
    const losses = handHistory.filter((hand) => hand.result === "loss").length;
    const pushes = handHistory.filter((hand) => hand.result === "push").length;
    const playerBlackjacks = handHistory.filter(
      (hand) => hand.playerBlackjack
    ).length;
    const dealerBlackjacks = handHistory.filter(
      (hand) => hand.dealerBlackjack
    ).length;
    const playerBusts = handHistory.filter((hand) => hand.playerBust).length;
    const dealerBusts = handHistory.filter((hand) => hand.dealerBust).length;
    const totalHits = handHistory.reduce(
      (sum, hand) => sum + hand.playerHits,
      0
    );

    const averagePlayerScore =
      hands === 0
        ? "--"
        : (
            handHistory.reduce((sum, hand) => sum + hand.playerScore, 0) / hands
          ).toFixed(1);

    const averageDealerScore =
      hands === 0
        ? "--"
        : (
            handHistory.reduce((sum, hand) => sum + hand.dealerScore, 0) / hands
          ).toFixed(1);

    let currentWinStreak = 0;

    for (let i = handHistory.length - 1; i >= 0; i--) {
      const hand = handHistory[i];

      if (hand?.result === "win") {
        currentWinStreak += 1;
      } else {
        break;
      }
    }

    let bestWinStreak = 0;
    let runningWinStreak = 0;

    for (const hand of handHistory) {
      if (hand.result === "win") {
        runningWinStreak += 1;
        bestWinStreak = Math.max(bestWinStreak, runningWinStreak);
      } else {
        runningWinStreak = 0;
      }
    }

    return {
      hands,
      wins,
      losses,
      pushes,
      winRate: formatPercent(wins, hands),
      lossRate: formatPercent(losses, hands),
      pushRate: formatPercent(pushes, hands),
      playerBlackjacks,
      dealerBlackjacks,
      playerBusts,
      dealerBusts,
      totalHits,
      averagePlayerScore,
      averageDealerScore,
      currentWinStreak,
      bestWinStreak,
    };
  }, [handHistory]);

  const snakeAnalytics = useMemo(() => {
    const gamesPlayed = snakeGameHistory.length;

    const bestScore =
      gamesPlayed === 0
        ? 0
        : Math.max(...snakeGameHistory.map((game) => game.score));

    const bestTime =
      gamesPlayed === 0
        ? "--"
        : `${Math.max(
            ...snakeGameHistory.map((game) => game.timeSurvivedSeconds)
          ).toFixed(1)}s`;

    const averageTime =
      gamesPlayed === 0
        ? "--"
        : `${(
            snakeGameHistory.reduce(
              (sum, game) => sum + game.timeSurvivedSeconds,
              0
            ) / gamesPlayed
          ).toFixed(1)}s`;

    const averageTurns =
      gamesPlayed === 0
        ? "--"
        : (
            snakeGameHistory.reduce((sum, game) => sum + game.turns, 0) /
            gamesPlayed
          ).toFixed(1);

    const totalMoves = snakeGameHistory.reduce(
      (sum, game) => sum + game.moves,
      0
    );

    const totalTurns = snakeGameHistory.reduce(
      (sum, game) => sum + game.turns,
      0
    );

    return {
      gamesPlayed,
      bestScore,
      bestTime,
      averageTime,
      averageTurns,
      totalMoves,
      totalTurns,
    };
  }, [snakeGameHistory]);

  const csvAnalysis = useMemo(() => {
    if (csvRows.length === 0) {
      return {
        rowCount: 0,
        columnCount: 0,
        missingCells: 0,
        duplicateRows: 0,
        numericColumns: 0,
        qualityScore: "--",
      };
    }

    const headers = csvRows[0] ?? [];
    const dataRows = csvRows.slice(1);
    const columnCount = headers.length;

    let missingCells = 0;

    for (const row of dataRows) {
      for (let i = 0; i < columnCount; i++) {
        if (!row[i] || row[i].trim() === "") {
          missingCells += 1;
        }
      }
    }

    const seenRows = new Set<string>();
    let duplicateRows = 0;

    for (const row of dataRows) {
      const key = row.join("|").toLowerCase();

      if (seenRows.has(key)) {
        duplicateRows += 1;
      } else {
        seenRows.add(key);
      }
    }

    let numericColumns = 0;

    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      const values = dataRows
        .map((row) => row[colIndex])
        .filter((value) => value && value.trim() !== "");

      const numericValues = values.filter(
        (value) => !Number.isNaN(Number(value))
      );

      if (values.length > 0 && numericValues.length / values.length >= 0.8) {
        numericColumns += 1;
      }
    }

    const totalCells = Math.max(dataRows.length * columnCount, 1);
    const missingRate = missingCells / totalCells;
    const duplicateRate =
      dataRows.length === 0 ? 0 : duplicateRows / dataRows.length;

    const qualityScore = Math.round(
      clamp(100 - missingRate * 55 - duplicateRate * 35, 0, 100)
    );

    return {
      rowCount: dataRows.length,
      columnCount,
      missingCells,
      duplicateRows,
      numericColumns,
      qualityScore,
    };
  }, [csvRows]);

  const weatherScores = useMemo(() => {
    const tempComfort = clamp(100 - Math.abs(weather.tempF - 70) * 3);
    const humidityPenalty =
      weather.humidity > 55 ? (weather.humidity - 55) * 0.7 : 0;
    const rainPenalty = weather.rainChance * 0.55;
    const windPenalty = weather.windMph > 10 ? (weather.windMph - 10) * 2 : 0;
    const uvPenalty = weather.uvIndex > 6 ? (weather.uvIndex - 6) * 7 : 0;

    const comfortScore = Math.round(
      clamp(tempComfort - humidityPenalty - rainPenalty - windPenalty)
    );

    const runningScore = Math.round(
      clamp(
        100 -
          Math.abs(weather.tempF - 62) * 2.8 -
          weather.rainChance * 0.65 -
          Math.max(0, weather.windMph - 12) * 2.4 -
          Math.max(0, weather.humidity - 60) * 0.8 -
          uvPenalty
      )
    );

    const travelScore = Math.round(
      clamp(
        100 -
          weather.rainChance * 0.45 -
          Math.max(0, weather.windMph - 18) * 3 -
          Math.max(0, 7 - weather.visibilityMiles) * 8
      )
    );

    const outdoorScore = Math.round(
      clamp((comfortScore + runningScore + travelScore) / 3)
    );

    let recommendation = "Conditions look solid for general outdoor plans.";

    if (outdoorScore >= 80) {
      recommendation =
        "Great outdoor window. Conditions look comfortable and low-risk.";
    } else if (outdoorScore >= 60) {
      recommendation =
        "Usable outdoor conditions. A light run, walk, or errand trip should be fine.";
    } else if (outdoorScore >= 40) {
      recommendation =
        "Mixed conditions. Plan shorter activities and check rain, wind, or heat before going out.";
    } else {
      recommendation =
        "Rough outdoor conditions. Better for indoor plans unless you need to go out.";
    }

    return {
      comfortScore,
      runningScore,
      travelScore,
      outdoorScore,
      recommendation,
    };
  }, [weather]);

  useEffect(() => {
    const savedHighScore = window.localStorage.getItem("snakeHighScore");

    if (savedHighScore) {
      const parsedHighScore = Number(savedHighScore);
      setSnakeHighScore(parsedHighScore);
      snakeHighScoreRef.current = parsedHighScore;
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("snakeHighScore", String(snakeHighScore));
    snakeHighScoreRef.current = snakeHighScore;
  }, [snakeHighScore]);

  useEffect(() => {
    if (!snakeRunning || !snakeStartedAt || snakeGameOver) return;

    const timerId = window.setInterval(() => {
      setSnakeElapsedSeconds(
        Number(((Date.now() - snakeStartedAt) / 1000).toFixed(1))
      );
    }, 250);

    return () => {
      window.clearInterval(timerId);
    };
  }, [snakeRunning, snakeStartedAt, snakeGameOver]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTyping) return;

      const keyMap: Record<string, Direction | undefined> = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
      };

      const newDirection = keyMap[event.key];

      if (!newDirection) return;

      event.preventDefault();

      setNextDirection((previousDirection) => {
        if (
          isOppositeDirection(previousDirection, newDirection) ||
          previousDirection === newDirection
        ) {
          return previousDirection;
        }

        snakeTurnsRef.current += 1;
        setSnakeTurns(snakeTurnsRef.current);

        return newDirection;
      });

      if (!snakeStartedAtRef.current && !snakeGameOver) {
        const startTime = Date.now();
        snakeStartedAtRef.current = startTime;
        setSnakeStartedAt(startTime);
      }

      if (!snakeGameOver) {
        setSnakeRunning(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [snakeGameOver]);

  useEffect(() => {
    if (!snakeRunning || snakeGameOver) return;

    const intervalId = window.setInterval(() => {
      setSnake((previousSnake) => {
        const activeDirection = nextDirection;
        const head = previousSnake[0]!;

        setDirection(activeDirection);

        const newHead = {
          x:
            activeDirection === "left"
              ? head.x - 1
              : activeDirection === "right"
                ? head.x + 1
                : head.x,
          y:
            activeDirection === "up"
              ? head.y - 1
              : activeDirection === "down"
                ? head.y + 1
                : head.y,
        };

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= gridSize ||
          newHead.y < 0 ||
          newHead.y >= gridSize;

        const ateFood = isSameCell(newHead, food);
        const bodyToCheck = ateFood ? previousSnake : previousSnake.slice(0, -1);
        const hitSelf = bodyToCheck.some((cell) => isSameCell(cell, newHead));

        snakeMovesRef.current += 1;
        setSnakeMoves(snakeMovesRef.current);

        if (hitWall || hitSelf) {
          recordSnakeGame(hitWall ? "wall" : "self", previousSnake);
          setSnakeGameOver(true);
          setSnakeRunning(false);
          return previousSnake;
        }

        const newSnake = [newHead, ...previousSnake];

        if (ateFood) {
          const newScore = snakeScoreRef.current + 1;
          snakeScoreRef.current = newScore;

          setSnakeScore(newScore);

          const newHighScore = Math.max(snakeHighScoreRef.current, newScore);
          snakeHighScoreRef.current = newHighScore;
          setSnakeHighScore(newHighScore);

          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [snakeRunning, snakeGameOver, nextDirection, food]);

  function recordHand(
    result: Result,
    finalPlayerHand: Card[],
    finalDealerHand: Card[],
    playerHits: number
  ) {
    const playerScore = getHandValue(finalPlayerHand);
    const dealerScore = getHandValue(finalDealerHand);

    setHandHistory((previous) => [
      ...previous,
      {
        handNumber: previous.length + 1,
        timestamp: new Date().toLocaleString(),
        result,
        playerScore,
        dealerScore,
        playerCards: formatCards(finalPlayerHand),
        dealerCards: formatCards(finalDealerHand),
        playerBlackjack: isBlackjack(finalPlayerHand),
        dealerBlackjack: isBlackjack(finalDealerHand),
        playerBust: playerScore > 21,
        dealerBust: dealerScore > 21,
        playerHits,
      },
    ]);
  }

  function settleGame(
    result: Result,
    finalMessage: string,
    finalPlayerHand: Card[],
    finalDealerHand: Card[],
    playerHits: number
  ) {
    if (result === "win") {
      setStatus("playerWin");
    } else if (result === "loss") {
      setStatus("dealerWin");
    } else {
      setStatus("push");
    }

    setMessage(finalMessage);
    recordHand(result, finalPlayerHand, finalDealerHand, playerHits);
  }

  function startGame() {
    const newDeck = shuffleDeck(makeDeck());

    const player = [newDeck[0]!, newDeck[2]!];
    const dealer = [newDeck[1]!, newDeck[3]!];
    const remainingDeck = newDeck.slice(4);

    setDeck(remainingDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setCurrentHandHits(0);

    const playerBlackjack = isBlackjack(player);
    const dealerBlackjack = isBlackjack(dealer);

    if (playerBlackjack && dealerBlackjack) {
      settleGame("push", "Both sides hit blackjack. Push.", player, dealer, 0);
      return;
    }

    if (playerBlackjack) {
      settleGame("win", "Blackjack. Player wins.", player, dealer, 0);
      return;
    }

    if (dealerBlackjack) {
      settleGame("loss", "Dealer has blackjack. Dealer wins.", player, dealer, 0);
      return;
    }

    setStatus("playing");
    setMessage("Your move: hit or stand.");
  }

  function hit() {
    if (status !== "playing") return;

    const nextCard = deck[0];

    if (!nextCard) {
      setMessage("No cards left in the deck.");
      return;
    }

    const updatedHits = currentHandHits + 1;
    const updatedDeck = deck.slice(1);
    const updatedPlayerHand = [...playerHand, nextCard];
    const playerScore = getHandValue(updatedPlayerHand);

    setCurrentHandHits(updatedHits);
    setDeck(updatedDeck);
    setPlayerHand(updatedPlayerHand);

    if (playerScore > 21) {
      settleGame(
        "loss",
        `You busted with ${playerScore}. Dealer wins.`,
        updatedPlayerHand,
        dealerHand,
        updatedHits
      );
      return;
    }

    if (playerScore === 21) {
      setMessage("You hit 21. Stand to finish the hand.");
      return;
    }

    setMessage(`You drew ${nextCard.rank}${nextCard.suit}. Your move.`);
  }

  function stand() {
    if (status !== "playing") return;

    const updatedDeck = [...deck];
    const updatedDealerHand = [...dealerHand];

    while (getHandValue(updatedDealerHand) < 17) {
      const nextCard = updatedDeck.shift();

      if (!nextCard) break;

      updatedDealerHand.push(nextCard);
    }

    const playerScore = getHandValue(playerHand);
    const dealerScore = getHandValue(updatedDealerHand);

    setDeck(updatedDeck);
    setDealerHand(updatedDealerHand);

    if (dealerScore > 21) {
      settleGame(
        "win",
        `Dealer busted with ${dealerScore}. Player wins with ${playerScore}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    if (playerScore > dealerScore) {
      settleGame(
        "win",
        `Player wins ${playerScore} to ${dealerScore}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    if (dealerScore > playerScore) {
      settleGame(
        "loss",
        `Dealer wins ${dealerScore} to ${playerScore}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    settleGame(
      "push",
      `Push. Both sides ended with ${playerScore}.`,
      playerHand,
      updatedDealerHand,
      currentHandHits
    );
  }

  function simulateOneHand(): Result {
    const simDeck = shuffleDeck(makeDeck());

    const player = [simDeck[0]!, simDeck[2]!];
    const dealer = [simDeck[1]!, simDeck[3]!];

    let cursor = 4;

    if (isBlackjack(player) && isBlackjack(dealer)) return "push";
    if (isBlackjack(player)) return "win";
    if (isBlackjack(dealer)) return "loss";

    while (getHandValue(player) < 17) {
      player.push(simDeck[cursor]!);
      cursor += 1;

      if (getHandValue(player) > 21) return "loss";
    }

    while (getHandValue(dealer) < 17) {
      dealer.push(simDeck[cursor]!);
      cursor += 1;
    }

    const playerScore = getHandValue(player);
    const dealerScore = getHandValue(dealer);

    if (dealerScore > 21) return "win";
    if (playerScore > dealerScore) return "win";
    if (dealerScore > playerScore) return "loss";

    return "push";
  }

  function runSimulation() {
    let wins = 0;
    let losses = 0;
    let pushes = 0;

    for (let i = 0; i < 1000; i++) {
      const result = simulateOneHand();

      if (result === "win") wins += 1;
      if (result === "loss") losses += 1;
      if (result === "push") pushes += 1;
    }

    setSimulationStats({
      hands: 1000,
      wins,
      losses,
      pushes,
    });
  }

  function exportSessionCsv() {
    if (handHistory.length === 0) {
      setMessage("Play at least one hand before exporting a CSV.");
      return;
    }

    downloadCsv(
      "blackjack-session.csv",
      [
        "Hand Number",
        "Timestamp",
        "Result",
        "Player Score",
        "Dealer Score",
        "Player Cards",
        "Dealer Cards",
        "Player Blackjack",
        "Dealer Blackjack",
        "Player Bust",
        "Dealer Bust",
        "Player Hits",
      ],
      handHistory.map((hand) => [
        hand.handNumber,
        hand.timestamp,
        hand.result,
        hand.playerScore,
        hand.dealerScore,
        hand.playerCards,
        hand.dealerCards,
        hand.playerBlackjack,
        hand.dealerBlackjack,
        hand.playerBust,
        hand.dealerBust,
        hand.playerHits,
      ])
    );
  }

  function recordSnakeGame(cause: "wall" | "self", finalSnake: Position[]) {
    if (snakeGameRecordedRef.current) return;

    snakeGameRecordedRef.current = true;

    const timeSurvivedSeconds = snakeStartedAtRef.current
      ? Number(((Date.now() - snakeStartedAtRef.current) / 1000).toFixed(1))
      : snakeElapsedSeconds;

    const finalHighScore = Math.max(
      snakeHighScoreRef.current,
      snakeScoreRef.current
    );

    setSnakeGameHistory((previous) => [
      ...previous,
      {
        gameNumber: previous.length + 1,
        timestamp: new Date().toLocaleString(),
        score: snakeScoreRef.current,
        highScoreAtEnd: finalHighScore,
        timeSurvivedSeconds,
        moves: snakeMovesRef.current,
        turns: snakeTurnsRef.current,
        finalLength: finalSnake.length,
        cause,
      },
    ]);
  }

  function exportSnakeCsv() {
    if (snakeGameHistory.length === 0) {
      window.alert("Play at least one Snake game before exporting a CSV.");
      return;
    }

    downloadCsv(
      "snake-session.csv",
      [
        "Game Number",
        "Timestamp",
        "Score",
        "High Score At End",
        "Time Survived Seconds",
        "Moves",
        "Turns",
        "Final Length",
        "Death Cause",
      ],
      snakeGameHistory.map((game) => [
        game.gameNumber,
        game.timestamp,
        game.score,
        game.highScoreAtEnd,
        game.timeSurvivedSeconds,
        game.moves,
        game.turns,
        game.finalLength,
        game.cause,
      ])
    );
  }

  function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setCsvFileName(file.name);
    setCsvError("");

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const rows = parseCsvText(text);

        if (rows.length < 2) {
          setCsvError("This CSV needs at least one header row and one data row.");
          setCsvRows([]);
          return;
        }

        setCsvRows(rows);
      } catch {
        setCsvError("Could not parse this CSV file.");
        setCsvRows([]);
      }
    };

    reader.readAsText(file);
  }

  function exportCsvQualityReport() {
    if (csvRows.length === 0) {
      window.alert("Upload a CSV before exporting a quality report.");
      return;
    }

    downloadCsv(
      "csv-quality-report.csv",
      ["Metric", "Value"],
      [
        ["File Name", csvFileName],
        ["Rows", csvAnalysis.rowCount],
        ["Columns", csvAnalysis.columnCount],
        ["Missing Cells", csvAnalysis.missingCells],
        ["Duplicate Rows", csvAnalysis.duplicateRows],
        ["Numeric Columns", csvAnalysis.numericColumns],
        ["Quality Score", csvAnalysis.qualityScore],
      ]
    );
  }

  function updateWeatherNumber(field: WeatherNumberField, value: string) {
    setWeather((previous) => ({
      ...previous,
      [field]: value === "" ? 0 : Number(value),
    }));
  }

  function exportWeatherReport() {
    downloadCsv(
      "weather-activity-report.csv",
      ["Metric", "Value"],
      [
        ["City", weather.city],
        ["Temperature F", weather.tempF],
        ["Rain Chance Percent", weather.rainChance],
        ["Wind MPH", weather.windMph],
        ["Humidity Percent", weather.humidity],
        ["UV Index", weather.uvIndex],
        ["Visibility Miles", weather.visibilityMiles],
        ["Comfort Score", weatherScores.comfortScore],
        ["Running Score", weatherScores.runningScore],
        ["Travel Score", weatherScores.travelScore],
        ["Outdoor Score", weatherScores.outdoorScore],
        ["Recommendation", weatherScores.recommendation],
      ]
    );
  }

  function restartSnake() {
    setSnake(startingSnake);
    setFood(getRandomFood(startingSnake));
    setDirection("right");
    setNextDirection("right");
    setSnakeRunning(false);
    setSnakeGameOver(false);
    setSnakeScore(0);
    setSnakeStartedAt(null);
    setSnakeElapsedSeconds(0);
    setSnakeMoves(0);
    setSnakeTurns(0);

    snakeScoreRef.current = 0;
    snakeMovesRef.current = 0;
    snakeTurnsRef.current = 0;
    snakeStartedAtRef.current = null;
    snakeGameRecordedRef.current = false;
  }

  function toggleSnakeRunning() {
    if (!snakeRunning && !snakeStartedAtRef.current) {
      const startTime = Date.now();
      snakeStartedAtRef.current = startTime;
      setSnakeStartedAt(startTime);
    }

    if (!snakeGameOver) {
      setSnakeRunning((running) => !running);
    }
  }

  const playerScore = playerHand.length > 0 ? getHandValue(playerHand) : "--";

  const dealerScore =
    dealerHand.length === 0
      ? "--"
      : status === "playing"
        ? `${getHandValue([dealerHand[0]!])} showing`
        : getHandValue(dealerHand);

  const simulatedWinRate =
    simulationStats.hands > 0
      ? `${((simulationStats.wins / simulationStats.hands) * 100).toFixed(1)}%`
      : "--";

  const snakeCells = Array.from({ length: gridSize * gridSize }, (_, index) => ({
    x: index % gridSize,
    y: Math.floor(index / gridSize),
  }));

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)] md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian Dacell Cabrera<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="transition hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="transition hover:text-cyan-300" href="/projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="/#skills">
              Skills
            </a>
            <a className="transition hover:text-cyan-300" href="/travel">
              Travel
            </a>
            <a className="transition hover:text-cyan-300" href="/#contact">
              Contact
            </a>
          </div>
        </nav>

        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Interactive Playground
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Browser experiments for logic, games, stats, and real-world data.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            This playground tests game logic, CSV analytics, weather decision
            scoring, state management, simulations, keyboard input, local
            storage, and CSV export workflows.
          </p>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_420px]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  Game Logic Demo
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Blackjack Simulator
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Built with TypeScript and React state. The dealer draws to 17,
                  aces adjust between 1 and 11, results are tracked, and session
                  data can export to CSV.
                </p>
              </div>

              <button
                onClick={startGame}
                className="rounded-xl bg-cyan-300 px-6 py-4 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
              >
                New Hand
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <p className="text-sm font-semibold text-cyan-300">Status</p>
              <p className="mt-2 text-zinc-200">{message}</p>
            </div>

            <div className="mt-8 grid gap-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Dealer</h3>
                  <p className="text-sm text-zinc-400">Score: {dealerScore}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {dealerHand.length > 0 ? (
                    dealerHand.map((card, index) => (
                      <CardView
                        key={`${card.rank}${card.suit}${index}`}
                        card={card}
                        hidden={status === "playing" && index === 1}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Start a new hand to deal cards.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Player</h3>
                  <p className="text-sm text-zinc-400">Score: {playerScore}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {playerHand.length > 0 ? (
                    playerHand.map((card, index) => (
                      <CardView
                        key={`${card.rank}${card.suit}${index}`}
                        card={card}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Your cards will show here.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={hit}
                disabled={status !== "playing"}
                className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Hit
              </button>

              <button
                onClick={stand}
                disabled={status !== "playing"}
                className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Stand
              </button>

              <button
                onClick={runSimulation}
                className="rounded-xl border border-cyan-300/50 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
              >
                Run 1,000 Simulated Hands
              </button>

              <button
                onClick={exportSessionCsv}
                className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                Export Session CSV
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-cyan-400/20 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Live Session Dashboard
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <CompactStat label="Hands" value={sessionStats.hands} />
              <CompactStat
                label="Win Rate"
                value={sessionStats.winRate}
                accent
              />
              <CompactStat label="Wins" value={sessionStats.wins} />
              <CompactStat label="Losses" value={sessionStats.losses} />
              <CompactStat label="Pushes" value={sessionStats.pushes} />
              <CompactStat
                label="Best Streak"
                value={sessionStats.bestWinStreak}
              />
            </div>
          </aside>

          <div className="xl:col-span-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Session Analytics
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                <StatBox
                  label="Player Blackjacks"
                  value={sessionStats.playerBlackjacks}
                />
                <StatBox
                  label="Dealer Blackjacks"
                  value={sessionStats.dealerBlackjacks}
                />
                <StatBox label="Player Busts" value={sessionStats.playerBusts} />
                <StatBox label="Dealer Busts" value={sessionStats.dealerBusts} />
                <StatBox label="Total Hits" value={sessionStats.totalHits} />
                <StatBox
                  label="Current Streak"
                  value={sessionStats.currentWinStreak}
                />
                <StatBox
                  label="Avg Player Score"
                  value={sessionStats.averagePlayerScore}
                />
                <StatBox
                  label="Avg Dealer Score"
                  value={sessionStats.averageDealerScore}
                />
                <StatBox label="Loss Rate" value={sessionStats.lossRate} />
                <StatBox label="Push Rate" value={sessionStats.pushRate} />
                <StatBox
                  label="CSV Rows"
                  value={handHistory.length === 0 ? "--" : handHistory.length}
                />
                <StatBox
                  label="Export Ready"
                  value={handHistory.length === 0 ? "No" : "Yes"}
                />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Simulation Stats
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatBox label="Simulated Hands" value={simulationStats.hands} />
                <StatBox label="Player Wins" value={simulationStats.wins} />
                <StatBox label="Dealer Wins" value={simulationStats.losses} />
                <StatBox label="Pushes" value={simulationStats.pushes} />
                <StatBox label="Simulated Win Rate" value={simulatedWinRate} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Keyboard Input Demo
              </p>

              <h2 className="mt-3 text-3xl font-bold">Snake Game</h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                A browser game using keyboard input, timed movement, collision
                detection, scoring, persistent local high score, survival timer,
                movement analytics, and CSV export.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleSnakeRunning}
                disabled={snakeGameOver}
                className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {snakeRunning ? "Pause" : "Start"}
              </button>

              <button
                onClick={restartSnake}
                className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                Restart
              </button>

              <button
                onClick={exportSnakeCsv}
                className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                Export Snake CSV
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_420px]">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {snakeCells.map((cell) => {
                  const isHead = isSameCell(cell, snake[0]!);
                  const isSnake = snake.some((snakeCell) =>
                    isSameCell(snakeCell, cell)
                  );
                  const isFood = isSameCell(cell, food);

                  return (
                    <div
                      key={`${cell.x}-${cell.y}`}
                      className={`aspect-square rounded-sm border border-zinc-900 ${
                        isHead
                          ? "bg-cyan-200"
                          : isSnake
                            ? "bg-cyan-500"
                            : isFood
                              ? "bg-white"
                              : "bg-zinc-950"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <aside className="rounded-3xl border border-cyan-400/20 bg-black/30 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Snake Dashboard
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <CompactStat label="Score" value={snakeScore} accent />
                <CompactStat label="High Score" value={snakeHighScore} />
                <CompactStat
                  label="Time"
                  value={`${snakeElapsedSeconds.toFixed(1)}s`}
                />
                <CompactStat label="Moves" value={snakeMoves} />
                <CompactStat label="Turns" value={snakeTurns} />
                <CompactStat
                  label="Status"
                  value={
                    snakeGameOver
                      ? "Game Over"
                      : snakeRunning
                        ? "Running"
                        : "Paused"
                  }
                />
              </div>
            </aside>

            <div className="xl:col-span-2">
              <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  Snake Analytics
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                  <StatBox label="Direction" value={direction.toUpperCase()} />
                  <StatBox
                    label="Games Played"
                    value={snakeAnalytics.gamesPlayed}
                  />
                  <StatBox
                    label="Best Session Score"
                    value={snakeAnalytics.bestScore}
                  />
                  <StatBox
                    label="Best Survival Time"
                    value={snakeAnalytics.bestTime}
                  />
                  <StatBox
                    label="Avg Survival Time"
                    value={snakeAnalytics.averageTime}
                  />
                  <StatBox
                    label="Avg Turns/Game"
                    value={snakeAnalytics.averageTurns}
                  />
                  <StatBox
                    label="Total Session Moves"
                    value={snakeAnalytics.totalMoves}
                  />
                  <StatBox
                    label="Total Session Turns"
                    value={snakeAnalytics.totalTurns}
                  />
                  <StatBox label="Final Length" value={snake.length} />
                  <StatBox
                    label="CSV Games"
                    value={
                      snakeGameHistory.length === 0
                        ? "--"
                        : snakeGameHistory.length
                    }
                  />
                  <StatBox
                    label="Export Ready"
                    value={snakeGameHistory.length === 0 ? "No" : "Yes"}
                  />
                  <StatBox label="Storage" value="Local" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Real-World Data Demo
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              CSV Data Quality Analyzer
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Upload a CSV and the tool checks row count, column count, missing
              cells, duplicate rows, numeric columns, and a simple data quality
              score.
            </p>

            <label className="mt-6 block cursor-pointer rounded-2xl border border-dashed border-cyan-300/40 bg-black/30 p-6 text-center transition hover:bg-cyan-300/10">
              <span className="font-semibold text-cyan-300">Upload CSV</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
            </label>

            <p className="mt-4 text-sm text-zinc-400">{csvFileName}</p>

            {csvError && <p className="mt-3 text-sm text-red-300">{csvError}</p>}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatBox label="Rows" value={csvAnalysis.rowCount} />
              <StatBox label="Columns" value={csvAnalysis.columnCount} />
              <StatBox label="Missing Cells" value={csvAnalysis.missingCells} />
              <StatBox
                label="Duplicate Rows"
                value={csvAnalysis.duplicateRows}
              />
              <StatBox
                label="Numeric Columns"
                value={csvAnalysis.numericColumns}
              />
              <CompactStat
                label="Quality Score"
                value={csvAnalysis.qualityScore}
                accent
              />
            </div>

            <button
              onClick={exportCsvQualityReport}
              className="mt-6 rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Export Quality Report
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Decision Analytics Demo
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Weather Activity Analyzer
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Enter weather conditions and the tool converts raw conditions into
              comfort, running, travel, and outdoor scores.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-zinc-300">
                City
                <input
                  value={weather.city}
                  onChange={(event) =>
                    setWeather((previous) => ({
                      ...previous,
                      city: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                Temperature °F
                <input
                  type="number"
                  value={weather.tempF}
                  onChange={(event) =>
                    updateWeatherNumber("tempF", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                Rain Chance %
                <input
                  type="number"
                  value={weather.rainChance}
                  onChange={(event) =>
                    updateWeatherNumber("rainChance", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                Wind MPH
                <input
                  type="number"
                  value={weather.windMph}
                  onChange={(event) =>
                    updateWeatherNumber("windMph", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                Humidity %
                <input
                  type="number"
                  value={weather.humidity}
                  onChange={(event) =>
                    updateWeatherNumber("humidity", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                UV Index
                <input
                  type="number"
                  value={weather.uvIndex}
                  onChange={(event) =>
                    updateWeatherNumber("uvIndex", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="text-sm text-zinc-300">
                Visibility Miles
                <input
                  type="number"
                  value={weather.visibilityMiles}
                  onChange={(event) =>
                    updateWeatherNumber("visibilityMiles", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <CompactStat
                label="Outdoor Score"
                value={weatherScores.outdoorScore}
                accent
              />
              <StatBox
                label="Comfort Score"
                value={weatherScores.comfortScore}
              />
              <StatBox
                label="Running Score"
                value={weatherScores.runningScore}
              />
              <StatBox label="Travel Score" value={weatherScores.travelScore} />
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-black/40 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Recommendation
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {weatherScores.recommendation}
              </p>
            </div>

            <button
              onClick={exportWeatherReport}
              className="mt-6 rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Export Weather Report
            </button>
          </div>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera.
        </footer>
      </section>
    </main>
  );
}