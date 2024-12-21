import type { BoardResult } from "~/results";

export const resultToHandHistory = (result: BoardResult): string => {
  let resultText = `Texas Hold'em No Limit (${result.table.sb}/${result.table.bb})\n`;

  return resultText;
};

/*

PokerStars Hand #123456789: Texas Hold'em No Limit (100/200 chips) - 2024/04/27 20:00:00 ET
Table 'Alpha' 6-max Seat #3 is the button
Seat 1: PlayerA (10000 in chips)
Seat 2: PlayerB (10000 in chips)
Seat 3: PlayerC (10000 in chips)
*** HOLE CARDS ***
PlayerA: [Ah][Kd]
PlayerB: [Qs][Js]
PlayerC: [9c][9d]
*** FLOP *** [2c][7s][Jh]
*** TURN *** [5d]
*** RIVER *** [9h]
*** SHOW DOWN ***
PlayerC: shows [9c][9d] (Three of a Kind)
PlayerA: shows [Ah][Kd] (One Pair)
PlayerB: shows [Qs][Js] (Two Pair)
PlayerC wins $150

*/
