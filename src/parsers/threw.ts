import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";
import { Entity, entityRe, vectorRe, parseEntity, parseVector } from "../entities";

export type ThrewEventPayload = {
  player: Entity;

  item: string;

  flashbangEntIndex?: number;
};

export type ThrewEvent = IBaseEvent<"threw", ThrewEventPayload>;

// There is no typo in the flashbang entindex, there is just a random closing parenthesis for some reason

// eslint-disable-next-line max-len
// "PlayerName<93><STEAM_1:0:12345><CT>" threw molotov [-2035 1521 35]
// "dimi<0><[U:1:221567857]><TERRORIST>" threw flashbang [-472 -336 11778] flashbang entindex 775)
export const threwParser = defineParser<ThrewEvent>({
  type: "threw",

  patterns: [
    concatPattern`^(?<player>${entityRe}) threw (?<item>.+) \\[(?<playerPosition>${vectorRe})\\]$`,
    concatPattern`^(?<player>${entityRe}) threw (?<item>.+) \\[(?<playerPosition>${vectorRe})\\] flashbang entindex (?<flashbangEntIndex>.+)\\)$`
  ],

  parse({
    player,
    playerPosition,
    item,
    flashbangEntIndex
  }) {
    return {
      player: {
        ...parseEntity(player),

        position: parseVector(playerPosition),
      },

      item,

      flashbangEntIndex: Number(flashbangEntIndex) || undefined
    };
  },
});
