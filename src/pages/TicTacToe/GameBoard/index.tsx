import React, { useEffect } from "react";
import GameBoard from "./GameBoard";
import "./styles.css";

const TicTacToePage: React.FC = () => {
  useEffect(() => {
    // Initialize Telegram Mini App
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return (
    <div className="tictactoe-container">
      <h1 className="game-title">4x4 Tic Tac Toe</h1>
      <GameBoard />
    </div>
  );
};

export default TicTacToePage;