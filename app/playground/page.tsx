"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calculator,
  Download,
  ExternalLink,
  Gamepad2,
  Pause,
  Play,
  RefreshCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

type Card = {
  suit: string;
  rank: string;
  value: number;
};

type GameResult = "win" | "loss" | "push";
type GameStatus = "ready" | "playing" | "done";

type HandRecord = {
  handNumber: number;
  timestamp: string;
  result: GameResult;
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

type SnakeRecord = {
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

type DemoKey = "snake" | "blackjack" | "scoring";

type ScenarioRecord = {
  scenarioNumber: number;
  timestamp: string;
  userValue: number;
  businessImpact: number;
  buildConfidence: number;
  complexityRisk: number;
  score: number;
  decision: string;
};

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

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const demoCards = [
  {
    key: "snake" as const,
    title: "Snake Game",
    label: "Touch + Keyboard",
    text: "A game loop with keyboard controls, swipe controls, visible buttons, high score storage, movement analytics, and CSV export.",
    button: "Open Snake",
    icon: Gamepad2,
  },
  {
    key: "blackjack" as const,
    title: "Blackjack Logic",
    label: "Game Rules",
    text: "A card simulation with real hand values, ace adjustment, dealer behavior, result tracking, live dashboards, and session export.",
    button: "Open Blackjack",
    icon: Trophy,
  },
  {
    key: "scoring" as const,
    title: "Project Readiness",
    label: "Interactive Sliders",
    text: "A project scoring model that explains whether an idea is ready to build, needs review, or should be reworked first.",
    button: "Open Scoring",
    icon: Calculator,
  },
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
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[randomIndex]!;
    shuffled[randomIndex] = temp;
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

function PageButton({ href, children }: { href: string; children: ReactNode }) {
  const isInternal = href.startsWith("/");

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function DemoButton({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.28)]"
          : "border border-cyan-300/25 bg-black/25 text-cyan-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
      }`}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function StatBox({
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
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={
          accent
            ? "mt-2 text-3xl font-black text-cyan-200"
            : "mt-2 text-2xl font-black text-white"
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
      <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-950/40 text-2xl font-black text-cyan-300 shadow-lg">
        ?
      </div>
    );
  }

  if (!card) return null;

  const isRed = card.suit === "♥" || card.suit === "♦";

  return (
    <div
      className={`flex h-28 w-20 flex-col justify-between rounded-xl border border-white/40 bg-white p-3 text-lg font-black shadow-lg ${
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
  const [activeDemo, setActiveDemo] = useState<DemoKey>("snake");

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
  const [snakeGameHistory, setSnakeGameHistory] = useState<SnakeRecord[]>([]);

  const [userValue, setUserValue] = useState(82);
  const [businessImpact, setBusinessImpact] = useState(78);
  const [buildConfidence, setBuildConfidence] = useState(70);
  const [complexityRisk, setComplexityRisk] = useState(35);
  const [scenarioHistory, setScenarioHistory] = useState<ScenarioRecord[]>([]);

  const snakeScoreRef = useRef(0);
  const snakeHighScoreRef = useRef(0);
  const snakeMovesRef = useRef(0);
  const snakeTurnsRef = useRef(0);
  const snakeStartedAtRef = useRef<number | null>(null);
  const snakeGameRecordedRef = useRef(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
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

  const lowRiskBonus = 100 - complexityRisk;

  const decisionScore = useMemo(() => {
    return Math.round(
      clamp(
        userValue * 0.35 +
          businessImpact * 0.3 +
          buildConfidence * 0.25 +
          lowRiskBonus * 0.1
      )
    );
  }, [userValue, businessImpact, buildConfidence, lowRiskBonus]);

  const decisionLabel = useMemo(() => {
    if (decisionScore >= 80) return "Build Now";
    if (decisionScore >= 65) return "Good Candidate";
    if (decisionScore >= 50) return "Needs Review";
    return "Rework First";
  }, [decisionScore]);

  const decisionRecommendation = useMemo(() => {
    if (decisionScore >= 80) {
      return "This is a strong project candidate. The value, impact, and confidence are high enough to justify building it now.";
    }

    if (decisionScore >= 65) {
      return "This is worth pursuing, but it should be scoped carefully before becoming a major build.";
    }

    if (decisionScore >= 50) {
      return "This idea has potential, but the risk, value, or confidence needs to improve before it becomes a priority.";
    }

    return "This should be reworked first. The current score suggests the idea is either too risky, too unclear, or not valuable enough yet.";
  }, [decisionScore]);

  const scenarioAnalytics = useMemo(() => {
    const total = scenarioHistory.length;

    if (total === 0) {
      return {
        total,
        averageScore: "--",
        strongestScore: "--",
        strongestDecision: "--",
      };
    }

    const averageScore = Math.round(
      scenarioHistory.reduce((sum, scenario) => sum + scenario.score, 0) / total
    );

    const strongest = scenarioHistory.reduce((best, scenario) =>
      scenario.score > best.score ? scenario : best
    );

    return {
      total,
      averageScore,
      strongestScore: strongest.score,
      strongestDecision: strongest.decision,
    };
  }, [scenarioHistory]);

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
      changeSnakeDirection(newDirection);
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
        const head = previousSnake[0];

        if (!head) return startingSnake;

        const activeDirection = nextDirection;

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
    result: GameResult,
    finalPlayerHand: Card[],
    finalDealerHand: Card[],
    playerHits: number
  ) {
    const playerScoreNow = getHandValue(finalPlayerHand);
    const dealerScoreNow = getHandValue(finalDealerHand);

    setHandHistory((previous) => [
      ...previous,
      {
        handNumber: previous.length + 1,
        timestamp: new Date().toLocaleString(),
        result,
        playerScore: playerScoreNow,
        dealerScore: dealerScoreNow,
        playerCards: formatCards(finalPlayerHand),
        dealerCards: formatCards(finalDealerHand),
        playerBlackjack: isBlackjack(finalPlayerHand),
        dealerBlackjack: isBlackjack(finalDealerHand),
        playerBust: playerScoreNow > 21,
        dealerBust: dealerScoreNow > 21,
        playerHits,
      },
    ]);
  }

  function settleGame(
    result: GameResult,
    finalMessage: string,
    finalPlayerHand: Card[],
    finalDealerHand: Card[],
    playerHits: number
  ) {
    setStatus("done");
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
    const playerScoreNow = getHandValue(updatedPlayerHand);

    setCurrentHandHits(updatedHits);
    setDeck(updatedDeck);
    setPlayerHand(updatedPlayerHand);

    if (playerScoreNow > 21) {
      settleGame(
        "loss",
        `You busted with ${playerScoreNow}. Dealer wins.`,
        updatedPlayerHand,
        dealerHand,
        updatedHits
      );
      return;
    }

    if (playerScoreNow === 21) {
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

    const playerScoreNow = getHandValue(playerHand);
    const dealerScoreNow = getHandValue(updatedDealerHand);

    setDeck(updatedDeck);
    setDealerHand(updatedDealerHand);

    if (dealerScoreNow > 21) {
      settleGame(
        "win",
        `Dealer busted with ${dealerScoreNow}. Player wins with ${playerScoreNow}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    if (playerScoreNow > dealerScoreNow) {
      settleGame(
        "win",
        `Player wins ${playerScoreNow} to ${dealerScoreNow}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    if (dealerScoreNow > playerScoreNow) {
      settleGame(
        "loss",
        `Dealer wins ${dealerScoreNow} to ${playerScoreNow}.`,
        playerHand,
        updatedDealerHand,
        currentHandHits
      );
      return;
    }

    settleGame(
      "push",
      `Push. Both sides ended with ${playerScoreNow}.`,
      playerHand,
      updatedDealerHand,
      currentHandHits
    );
  }

  function simulateOneHand(): GameResult {
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

    const playerScoreNow = getHandValue(player);
    const dealerScoreNow = getHandValue(dealer);

    if (dealerScoreNow > 21) return "win";
    if (playerScoreNow > dealerScoreNow) return "win";
    if (dealerScoreNow > playerScoreNow) return "loss";

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

  function changeSnakeDirection(newDirection: Direction) {
    if (snakeGameOver) return;

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

    if (!snakeStartedAtRef.current) {
      const startTime = Date.now();
      snakeStartedAtRef.current = startTime;
      setSnakeStartedAt(startTime);
    }

    setSnakeRunning(true);
  }

  function handleSnakeTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }

  function handleSnakeTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];

    if (
      !touch ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null
    ) {
      return;
    }

    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    const minSwipeDistance = 30;

    if (
      Math.abs(deltaX) < minSwipeDistance &&
      Math.abs(deltaY) < minSwipeDistance
    ) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      changeSnakeDirection(deltaX > 0 ? "right" : "left");
    } else {
      changeSnakeDirection(deltaY > 0 ? "down" : "up");
    }
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
    touchStartXRef.current = null;
    touchStartYRef.current = null;
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

  function saveScenario() {
    setScenarioHistory((previous) => [
      ...previous,
      {
        scenarioNumber: previous.length + 1,
        timestamp: new Date().toLocaleString(),
        userValue,
        businessImpact,
        buildConfidence,
        complexityRisk,
        score: decisionScore,
        decision: decisionLabel,
      },
    ]);
  }

  function exportScenarioCsv() {
    if (scenarioHistory.length === 0) {
      window.alert("Save at least one scoring test before exporting a CSV.");
      return;
    }

    downloadCsv(
      "project-readiness-scenarios.csv",
      [
        "Scenario Number",
        "Timestamp",
        "User Value",
        "Business Impact",
        "Build Confidence",
        "Complexity Risk",
        "Score",
        "Decision",
      ],
      scenarioHistory.map((scenario) => [
        scenario.scenarioNumber,
        scenario.timestamp,
        scenario.userValue,
        scenario.businessImpact,
        scenario.buildConfidence,
        scenario.complexityRisk,
        scenario.score,
        scenario.decision,
      ])
    );
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
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <Gamepad2 size={15} />
            Playground
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Browser experiments for games, logic, and analytics
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Interactive demos using React state, TypeScript, keyboard input,
            mobile touch controls, local storage, session analytics, scoring
            models, and CSV export workflows.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PageButton href="/projects">
              View Projects <ExternalLink size={15} />
            </PageButton>

            <PageButton href="/data-lab">
              Open Data Lab <ExternalLink size={15} />
            </PageButton>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {demoCards.map((demo) => {
            const Icon = demo.icon;

            return (
              <div key={demo.key} className={`${glassCard} p-6`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                  <Icon size={22} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  {demo.label}
                </p>

                <h2 className="mt-4 text-2xl font-black text-white">
                  {demo.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {demo.text}
                </p>

                <div className="mt-6">
                  <DemoButton
                    active={activeDemo === demo.key}
                    onClick={() => setActiveDemo(demo.key)}
                  >
                    {demo.button} <ExternalLink size={14} />
                  </DemoButton>
                </div>
              </div>
            );
          })}
        </section>

        {activeDemo === "blackjack" && (
          <section className="mt-12 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_420px]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                    Blackjack
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                    Game logic simulator
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                    The dealer draws to 17, aces adjust between 1 and 11,
                    results are tracked, and session data can export to CSV.
                  </p>
                </div>

                <GhostButton onClick={startGame}>
                  <Play size={16} />
                  New Hand
                </GhostButton>
              </div>

              <div className="mt-8 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  Status
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {message}
                </p>
              </div>

              <div className="mt-8 grid gap-8">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-white">Dealer</h3>
                    <p className="text-sm font-bold text-zinc-400">
                      Score: {dealerScore}
                    </p>
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
                    <h3 className="text-xl font-black text-white">Player</h3>
                    <p className="text-sm font-bold text-zinc-400">
                      Score: {playerScore}
                    </p>
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

              <div className="mt-8 flex flex-wrap gap-3">
                <GhostButton onClick={hit} disabled={status !== "playing"}>
                  Hit <Gamepad2 size={15} />
                </GhostButton>

                <GhostButton onClick={stand} disabled={status !== "playing"}>
                  Stand <Trophy size={15} />
                </GhostButton>

                <GhostButton onClick={runSimulation}>
                  <Sparkles size={15} />
                  Run 1,000 Hands
                </GhostButton>

                <GhostButton onClick={exportSessionCsv}>
                  <Download size={15} />
                  Export CSV
                </GhostButton>
              </div>
            </div>

            <aside className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Live Dashboard
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <StatBox label="Hands" value={sessionStats.hands} />
                <StatBox label="Win Rate" value={sessionStats.winRate} accent />
                <StatBox label="Wins" value={sessionStats.wins} />
                <StatBox label="Losses" value={sessionStats.losses} />
                <StatBox label="Pushes" value={sessionStats.pushes} />
                <StatBox label="Best Streak" value={sessionStats.bestWinStreak} />
              </div>
            </aside>

            <div className={`${glassPanel} p-6 md:p-8 xl:col-span-2`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Session Analytics
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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
                  label="Avg Player"
                  value={sessionStats.averagePlayerScore}
                />
                <StatBox
                  label="Avg Dealer"
                  value={sessionStats.averageDealerScore}
                />
                <StatBox label="Loss Rate" value={sessionStats.lossRate} />
                <StatBox label="Push Rate" value={sessionStats.pushRate} />
                <StatBox
                  label="Sim Win Rate"
                  value={simulatedWinRate}
                  accent={simulationStats.hands > 0}
                />
                <StatBox
                  label="Export Ready"
                  value={handHistory.length === 0 ? "No" : "Yes"}
                />
              </div>
            </div>
          </section>
        )}

        {activeDemo === "snake" && (
          <section className="mt-12 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_420px]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                    Snake
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                    Touch-friendly game controls
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                    Play with WASD, arrow keys, swipe, or the visible control
                    buttons. The game tracks high score, survival time, moves,
                    turns, and CSV export.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <GhostButton
                    onClick={toggleSnakeRunning}
                    disabled={snakeGameOver}
                  >
                    {snakeRunning ? <Pause size={16} /> : <Play size={16} />}
                    {snakeRunning ? "Pause" : "Start"}
                  </GhostButton>

                  <GhostButton onClick={restartSnake}>
                    <RefreshCcw size={16} />
                    Restart
                  </GhostButton>

                  <GhostButton onClick={exportSnakeCsv}>
                    <Download size={16} />
                    Export CSV
                  </GhostButton>
                </div>
              </div>

              <div
                onTouchStart={handleSnakeTouchStart}
                onTouchEnd={handleSnakeTouchEnd}
                className="mt-8 touch-none select-none rounded-3xl border border-cyan-300/15 bg-black/25 p-3 md:p-4"
              >
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  }}
                >
                  {snakeCells.map((cell) => {
                    const isHead = isSameCell(
                      cell,
                      snake[0] ?? startingSnake[0]!
                    );
                    const isSnake = snake.some((snakeCell) =>
                      isSameCell(snakeCell, cell)
                    );
                    const isFood = isSameCell(cell, food);

                    return (
                      <div
                        key={`${cell.x}-${cell.y}`}
                        className={`aspect-square rounded-sm border ${
                          isHead
                            ? "border-cyan-200 bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
                            : isSnake
                              ? "border-cyan-300/30 bg-cyan-400/80"
                              : isFood
                                ? "border-fuchsia-300/50 bg-fuchsia-400 shadow-[0_0_14px_rgba(217,70,239,0.55)]"
                                : "border-cyan-300/10 bg-cyan-950/20"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mx-auto mt-6 grid max-w-[280px] grid-cols-3 gap-3">
                <div />
                <button
                  type="button"
                  onClick={() => changeSnakeDirection("up")}
                  disabled={snakeGameOver}
                  className="flex h-14 items-center justify-center rounded-2xl bg-cyan-400 text-black shadow-[0_0_18px_rgba(34,211,238,0.25)] disabled:opacity-40"
                >
                  <ArrowUp size={24} />
                </button>
                <div />

                <button
                  type="button"
                  onClick={() => changeSnakeDirection("left")}
                  disabled={snakeGameOver}
                  className="flex h-14 items-center justify-center rounded-2xl bg-cyan-400 text-black shadow-[0_0_18px_rgba(34,211,238,0.25)] disabled:opacity-40"
                >
                  <ArrowLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={toggleSnakeRunning}
                  disabled={snakeGameOver}
                  className="flex h-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-black/25 text-cyan-200 disabled:opacity-40"
                >
                  {snakeRunning ? <Pause size={22} /> : <Play size={22} />}
                </button>

                <button
                  type="button"
                  onClick={() => changeSnakeDirection("right")}
                  disabled={snakeGameOver}
                  className="flex h-14 items-center justify-center rounded-2xl bg-cyan-400 text-black shadow-[0_0_18px_rgba(34,211,238,0.25)] disabled:opacity-40"
                >
                  <ArrowRight size={24} />
                </button>

                <div />
                <button
                  type="button"
                  onClick={() => changeSnakeDirection("down")}
                  disabled={snakeGameOver}
                  className="flex h-14 items-center justify-center rounded-2xl bg-cyan-400 text-black shadow-[0_0_18px_rgba(34,211,238,0.25)] disabled:opacity-40"
                >
                  <ArrowDown size={24} />
                </button>
                <div />
              </div>
            </div>

            <aside className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Snake Dashboard
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <StatBox label="Score" value={snakeScore} accent />
                <StatBox label="High Score" value={snakeHighScore} />
                <StatBox
                  label="Time"
                  value={`${snakeElapsedSeconds.toFixed(1)}s`}
                />
                <StatBox label="Moves" value={snakeMoves} />
                <StatBox label="Turns" value={snakeTurns} />
                <StatBox
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

            <div className={`${glassPanel} p-6 md:p-8 xl:col-span-2`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Snake Analytics
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                <StatBox label="Direction" value={direction.toUpperCase()} />
                <StatBox label="Games Played" value={snakeAnalytics.gamesPlayed} />
                <StatBox
                  label="Best Session"
                  value={snakeAnalytics.bestScore}
                  accent
                />
                <StatBox label="Best Time" value={snakeAnalytics.bestTime} />
                <StatBox label="Avg Time" value={snakeAnalytics.averageTime} />
                <StatBox label="Avg Turns" value={snakeAnalytics.averageTurns} />
                <StatBox label="Total Moves" value={snakeAnalytics.totalMoves} />
                <StatBox label="Total Turns" value={snakeAnalytics.totalTurns} />
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
                <StatBox label="Controls" value="Keys + Touch" />
              </div>
            </div>
          </section>
        )}

        {activeDemo === "scoring" && (
          <section className="mt-12 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Project Readiness
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Should this project be built?
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                This model scores whether an idea is ready to build. It rewards
                user value, business impact, and build confidence while
                penalizing complexity risk.
              </p>

              <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  Formula
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Score = User Value × 35% + Business Impact × 30% + Build
                  Confidence × 25% + Low Risk Bonus × 10%.
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Low Risk Bonus is calculated as 100 minus Complexity Risk, so
                  higher complexity lowers the final score.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatBox label="Readiness Score" value={decisionScore} accent />
                <StatBox label="Decision" value={decisionLabel} />
                <StatBox label="Saved Tests" value={scenarioAnalytics.total} />
                <StatBox label="Avg Saved" value={scenarioAnalytics.averageScore} />
              </div>

              <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  Recommendation
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {decisionRecommendation}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <GhostButton onClick={saveScenario}>
                  <BarChart3 size={15} />
                  Save Test
                </GhostButton>

                <GhostButton onClick={exportScenarioCsv}>
                  <Download size={15} />
                  Export CSV
                </GhostButton>
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Inputs
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                Move the sliders to test an idea
              </h3>

              <div className="mt-8 space-y-6">
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-zinc-300">
                    User Value: {userValue}
                  </span>
                  <p className="text-xs leading-5 text-zinc-500">
                    How useful or meaningful this would be to the person using
                    it.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userValue}
                    onChange={(event) => setUserValue(Number(event.target.value))}
                    className="w-full"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-zinc-300">
                    Business Impact: {businessImpact}
                  </span>
                  <p className="text-xs leading-5 text-zinc-500">
                    How much this could help the business, team, client, or
                    portfolio.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={businessImpact}
                    onChange={(event) =>
                      setBusinessImpact(Number(event.target.value))
                    }
                    className="w-full"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-zinc-300">
                    Build Confidence: {buildConfidence}
                  </span>
                  <p className="text-xs leading-5 text-zinc-500">
                    How confident you are that this can be built cleanly with
                    the time and tools available.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={buildConfidence}
                    onChange={(event) =>
                      setBuildConfidence(Number(event.target.value))
                    }
                    className="w-full"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-zinc-300">
                    Complexity Risk: {complexityRisk}
                  </span>
                  <p className="text-xs leading-5 text-zinc-500">
                    How likely this is to become confusing, expensive, buggy, or
                    too large in scope.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={complexityRisk}
                    onChange={(event) =>
                      setComplexityRisk(Number(event.target.value))
                    }
                    className="w-full"
                  />
                </label>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <StatBox label="Low Risk Bonus" value={lowRiskBonus} />
                <StatBox
                  label="Strongest Saved"
                  value={scenarioAnalytics.strongestScore}
                  accent={scenarioHistory.length > 0}
                />
                <StatBox
                  label="Best Decision"
                  value={scenarioAnalytics.strongestDecision}
                />
                <StatBox
                  label="Export Ready"
                  value={scenarioHistory.length > 0 ? "Yes" : "No"}
                />
              </div>

              {scenarioHistory.length > 0 && (
                <div className="mt-8 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    Recent Tests
                  </p>

                  <div className="mt-4 space-y-3">
                    {scenarioHistory.slice(-4).reverse().map((scenario) => (
                      <div
                        key={scenario.scenarioNumber}
                        className="grid gap-2 rounded-2xl border border-cyan-300/10 bg-black/25 p-4 sm:grid-cols-[90px_1fr_120px]"
                      >
                        <p className="text-sm font-black text-cyan-200">
                          #{scenario.scenarioNumber}
                        </p>

                        <p className="text-sm text-zinc-300">
                          Value {scenario.userValue}, Impact{" "}
                          {scenario.businessImpact}, Confidence{" "}
                          {scenario.buildConfidence}, Risk{" "}
                          {scenario.complexityRisk}
                        </p>

                        <p className="text-sm font-black text-white sm:text-right">
                          {scenario.score} / {scenario.decision}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera.
        </footer>
      </section>
    </main>
  );
}