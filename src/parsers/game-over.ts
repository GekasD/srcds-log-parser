import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";

export type GameOverEventPayload = {
  gamemode: string;

  mapgroup: string;

  mapname: string;

  score1: number;

  score2: number;

  durationMinutes: number;
};

export type GameOverEvent = IBaseEvent<"game_over", GameOverEventPayload>;

// Game Over: competitive mg_de_mirage de_mirage score 0:13 after 129 min
// Game Over: gungameprogressive mg_ar_pool_day ar_pool_day score 0:0 after 1 min
export const gameOverParser = defineParser<GameOverEvent>({
  type: "game_over",

  patterns: [
    concatPattern`^Game Over: (?<gamemode>[^"]+) (?<mapgroup>[^"]+) (?<mapname>[^"]+) score (?<score1>[^"]+):(?<score2>[^"]+) after (?<duration>[^"]+) min$`
  ],

  parse({
    gamemode,
    mapgroup,
    mapname,
    score1,
    score2,
    duration
  }) {
    return {
      gamemode,
      mapgroup,
      mapname,
      score1: Number(score1),
      score2: Number(score2),
      durationMinutes: Number(duration)
    };
  },
});
