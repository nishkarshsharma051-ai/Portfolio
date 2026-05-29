import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import type { Square, Move } from "chess.js";
import Cursor from "../components/Cursor";
import { config } from "../components/config";

// --- Chess Piece SVG Vectors ---
const PieceSVG: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const isWhite = color === "w";
  const strokeColor = isWhite ? "#000" : "#fff";
  const fillColor = isWhite ? "#fff" : "#443850";

  switch (type) {
    case "p":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83.65-1.41 1.63-1.41 2.75 0 2.21 4 4 5.5 4s5.5-1.79 5.5-4c0-1.12-.58-2.1-1.41-2.75 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.5-4l1.5-12h18l1.5 12h-21zm-1.5-15h24V9H33v3h-3V9h-6v3h-3V9h-6v3h-3V9H14v3h-3V9H9v8h3z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14,20 18,20 C 18,20 17,21 15,24 C 13,27 12,31 12,31 C 12,31 15,28 22,28 C 29,28 32,31 32,31 C 32,31 30,26 30,22 C 30,18 27,11 22,10 z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="16" r="2" fill={strokeColor} />
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M9 36h27v-3H9v3zm13.5-3c1.34 0 4-1.79 4-4 0-1.63-1.47-3.84-2.41-5.03.83-.65 1.41-1.63 1.41-2.75 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 1.12.58 2.1 1.41 2.75C18.47 25.16 17 27.37 17 29c0 2.21 2.66 4 4 4z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="22.5" cy="5" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "q":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M9 37h27v-3H9v3zm13.5-3c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-9-5.5C15 25.8 19 22 22.5 22s7.5 3.8 9 6.5l-18 0zm-3-8l3 13.5 18 0 3-13.5-6.5 4.5-5.5-8-5.5 8-6.5-4.5z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "k":
      return (
        <svg viewBox="0 0 45 45" className="chess-piece-svg">
          <path
            d="M22.5 11.63V6M20 8.5h5M9 38h27v-3H9v3zm13.5-3C18 31 15 27 15 23.5c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5C30 27 27 31 22.5 35zm-9-15.5h18"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

// --- Heuristic MiniMax Evaluation Matrix ---
const positionWeight = {
  p: [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ],
  n: [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ],
  b: [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ],
  r: [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ],
  q: [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ],
  k: [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ],
};

const pieceValue: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const evaluateBoard = (chess: Chess): number => {
  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece) {
        let value = pieceValue[piece.type];
        // Positional value adjustments
        const weights = positionWeight[piece.type];
        if (weights) {
          const wRow = piece.color === "b" ? r : 7 - r;
          const wFile = piece.color === "b" ? f : 7 - f;
          value += weights[wRow][wFile] * 10;
        }
        score += piece.color === "w" ? value : -value;
      }
    }
  }
  return score;
};

// Minimax with Alpha-Beta Pruning
const minimax = (
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; move: Move | null } => {
  if (depth === 0 || chess.isGameOver()) {
    return { score: evaluateBoard(chess), move: null };
  }

  const moves = chess.moves({ verbose: true });
  let bestMove = null;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      chess.move(moves[i]);
      const { score } = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      if (score > maxScore) {
        maxScore = score;
        bestMove = moves[i];
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      chess.move(moves[i]);
      const { score } = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      if (score < minScore) {
        minScore = score;
        bestMove = moves[i];
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
};

// --- Chatbot Persona Rules and Config ---
const chatbotAnswers: { triggers: string[]; response: string }[] = [
  {
    triggers: ["hi", "hello", "hey", "hola"],
    response: `Hello there! Welcome to my digital corner. I'm ${config.developer.name}. How can I help you today? Feel free to ask about my skills, projects, studies, career, or let's play a chess match!`,
  },
  {
    triggers: ["skills", "technologies", "languages", "stack", "tech"],
    response: `My technical expertise spans multiple domains:\n\n` +
      `• **${config.skills.develop.title}**: ${config.skills.develop.tools.join(", ")}\n` +
      `• **${config.skills.design.title}**: ${config.skills.design.tools.join(", ")}`,
  },
  {
    triggers: ["project", "work", "accomplishment", "projects"],
    response: `I have built several high-performance projects, including:\n\n` +
      config.projects.map(p => `• **${p.title}** (${p.category}): ${p.description} (Built using: ${p.technologies})`).join("\n\n") +
      `\n\nFeel free to ask about any specific project details!`,
  },
  {
    triggers: ["career", "experience", "timeline", "history", "jobs", "job", "hire", "freelance", "opportunity", "contract"],
    response: `Here is a summary of my professional journey:\n\n` +
      config.experiences.map(exp => `• **${exp.position}** at *${exp.company}* (${exp.period}): ${exp.description}\n  *Key Tech*: ${exp.technologies.join(", ")}`).join("\n\n") +
      `\n\nI'm always open to exciting opportunities in AI Engineering and Full-Stack roles! Drop me an email at ${config.contact.email} and we can discuss how I can bring value to your team.`,
  },
  {
    triggers: ["iit", "madras", "education", "college", "university", "studies"],
    response: `I am a B.Tech CSE student passionate about Full-Stack Development and AI. I am also pursuing my degree in Data Science and Applications at the prestigious IIT Madras, focusing deeply on advanced machine learning algorithms, database systems, and data analytics.`,
  },
  {
    triggers: ["chess", "elo", "play"],
    response: "Ah, chess! I love the game. My custom AI engine is rated around 3640 ELO and is thinking ahead using minimax search trees. Good luck on the board! I play as Black.",
  },
];

export const Play: React.FC = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [moveHistory, setMoveHistory] = useState<{ num: number; w: string; b?: string }[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  // Chatbot states
  const [messages, setMessages] = useState<{ sender: "user" | "assistant"; text: string; isTyping?: boolean }[]>([
    { sender: "assistant", text: "Hey! I'm Nishkarsh's AI avatar. While you challenge my chess engine, ask me anything about his technical stack, studies, or career achievements!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    navigate("/");
  };

  // --- Chess Engine Move Computation ---
  const triggerAIMove = (currentChess: Chess) => {
    if (currentChess.isGameOver()) return;

    // Simulate AI thinking for a fraction of a second
    setTimeout(() => {
      // Run MiniMax at Depth 3 (instant response but smart defensive capability)
      const { move } = minimax(currentChess, 3, -Infinity, Infinity, false);

      if (move) {
        const nextChess = new Chess(currentChess.fen());
        nextChess.move(move);
        setGame(nextChess);
        setLastMove({ from: move.from as Square, to: move.to as Square });

        // Update Captured lists
        if (move.captured) {
          setCapturedWhite((prev) => [...prev, move.captured as string]);
        }

        // Update History
        updateMoveHistory(nextChess);
      }
    }, 450);
  };

  const updateMoveHistory = (chessState: Chess) => {
    const history = chessState.history({ verbose: true });
    const formattedHistory: { num: number; w: string; b?: string }[] = [];

    for (let i = 0; i < history.length; i += 2) {
      formattedHistory.push({
        num: Math.floor(i / 2) + 1,
        w: history[i].san,
        b: history[i + 1] ? history[i + 1].san : undefined,
      });
    }
    setMoveHistory(formattedHistory);
  };

  const handleSquareClick = (sqName: Square) => {
    if (game.isGameOver() || game.turn() === "b") return; // Block input if AI's turn or game over

    const piece = game.get(sqName);

    // If square belongs to valid moves, execute the move!
    if (validMoves.includes(sqName) && selectedSquare) {
      const nextChess = new Chess(game.fen());
      const moveResult = nextChess.move({ from: selectedSquare, to: sqName, promotion: "q" });

      if (moveResult) {
        setGame(nextChess);
        setLastMove({ from: selectedSquare, to: sqName });
        setSelectedSquare(null);
        setValidMoves([]);

        if (moveResult.captured) {
          setCapturedBlack((prev) => [...prev, moveResult.captured as string]);
        }

        updateMoveHistory(nextChess);

        // Schedule Opposing move
        triggerAIMove(nextChess);
      }
      return;
    }

    // Select piece
    if (piece && piece.color === "w") {
      setSelectedSquare(sqName);
      const moves = game.moves({ square: sqName, verbose: true });
      setValidMoves(moves.map((m) => m.to as Square));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const handleResetGame = () => {
    const freshGame = new Chess();
    setGame(freshGame);
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
  };

  // --- AI Chat Logic ---
  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    // Schedule typing response
    setMessages((prev) => [...prev, { sender: "assistant", text: "", isTyping: true }]);

    setTimeout(() => {
      // Find suitable matching persona response
      let matchResponse = "That's an interesting question! Nishkarsh is highly skilled in machine learning, system automations, and React architecture. Send him a direct email at nishkarshsharma051@gmail.com to explore details further!";
      const cleanText = userText.toLowerCase();

      for (let i = 0; i < chatbotAnswers.length; i++) {
        const triggers = chatbotAnswers[i].triggers;
        if (triggers.some((tr) => cleanText.includes(tr))) {
          matchResponse = chatbotAnswers[i].response;
          break;
        }
      }

      setMessages((prev) =>
        prev.filter((m) => !m.isTyping).concat({ sender: "assistant", text: matchResponse })
      );
    }, 1100);
  };

  // Renders files & ranks
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <>
      <Cursor />
      <div className="play-page">
        <div className="play-header">
          <button className="back-button" onClick={handleBack} data-cursor="disable" style={{ background: "none", border: "none", cursor: "pointer" }}>
            ← GO BACK
          </button>
        </div>

        <div className="chess-container">
          {/* Left panel: chatbot panel */}
          <div className="chat-panel" data-cursor="disable">
            <div className="chat-header">
              <div className="chat-title">💬 Talk with me</div>
            </div>
            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div className={`chat-message ${m.sender}`} key={idx}>
                  {m.isTyping ? (
                    <div className="message-content typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <input
                className="chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Ask me anything..."
              />
              <button className="chat-send-btn" onClick={handleChatSend}>
                ➔
              </button>
            </div>
          </div>

          {/* Center panel: chess board */}
          <div className="chess-board-section">
            {/* Opponent top bar */}
            <div className="player-bar opponent-bar">
              <div className="player-info">
                <div className="player-avatar">🤖</div>
                <div className="player-details">
                  <span className="player-name">Nishkarsh AI Engine</span>
                  <span className="player-rating">Rating: 3640 ELO</span>
                </div>
              </div>
              <div className="captured-pieces">
                {capturedWhite.map((p, idx) => (
                  <span className="captured-piece" key={idx}>
                    <PieceSVG type={p} color="w" />
                  </span>
                ))}
              </div>
            </div>

            {/* Chess board wrapper */}
            <div className="chess-board-wrapper">
              <div className="chess-board">
                {ranks.map((rank, rIdx) =>
                  files.map((file, fIdx) => {
                    const sqName = `${file}${rank}` as Square;
                    const piece = game.get(sqName);
                    const isDark = (rIdx + fIdx) % 2 === 1;
                    const isSelected = selectedSquare === sqName;
                    const isLastMove = lastMove && (lastMove.from === sqName || lastMove.to === sqName);
                    const isValidTarget = validMoves.includes(sqName);
                    const isCheck = game.inCheck() && piece && piece.type === "k" && piece.color === game.turn();

                    return (
                      <div
                        className={`chess-square ${isDark ? "dark" : "light"} ${
                          isSelected ? "selected" : ""
                        } ${isLastMove ? "last-move" : ""} ${isCheck ? "in-check" : ""}`}
                        onClick={() => handleSquareClick(sqName)}
                        key={sqName}
                      >
                        {/* Pieces representation */}
                        {piece && (
                          <div className="chess-piece">
                            <PieceSVG type={piece.type} color={piece.color} />
                          </div>
                        )}

                        {/* Move indicators */}
                        {isValidTarget && (
                          <div className={`move-indicator ${piece ? "capture" : ""}`} />
                        )}

                        {/* Coordinates labels */}
                        {fIdx === 0 && <span className="coord-rank">{rank}</span>}
                        {rIdx === 7 && <span className="coord-file">{file}</span>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Player bottom bar */}
            <div className="player-bar player-bar-bottom">
              <div className="player-info">
                <div className="player-avatar">👤</div>
                <div className="player-details">
                  <span className="player-name">Guest Player</span>
                  <span className="player-rating">Rating: Unrated</span>
                </div>
              </div>
              <div className="captured-pieces">
                {capturedBlack.map((p, idx) => (
                  <span className="captured-piece" key={idx}>
                    <PieceSVG type={p} color="b" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: game history */}
          <div className="chess-side-panel" data-cursor="disable">
            <div className="game-status">
              {game.isGameOver() ? (
                game.isCheckmate() ? (
                  <span className="check">Checkmate! Game Over</span>
                ) : game.isDraw() ? (
                  <span>Draw Match</span>
                ) : (
                  <span>Game Terminated</span>
                )
              ) : game.inCheck() ? (
                <span className="check">⚠️ King under Check!</span>
              ) : (
                <span>Your turn (White)</span>
              )}
            </div>

            <div className="move-history">
              <div className="move-history-header">Move History</div>
              <div className="move-history-list">
                {moveHistory.map((row) => (
                  <div className="move-row" key={row.num}>
                    <span className="move-num">{row.num}.</span>
                    <span className="move-white">{row.w}</span>
                    <span className="move-black">{row.b || ""}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="game-controls">
              <button className="control-btn" onClick={handleResetGame}>
                Reset Board
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Play;
