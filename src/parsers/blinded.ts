import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";
import { Entity, entityRe, parseEntity } from "../entities";

export type BlindedEventPayload = {
  attacker: Entity;

  victim: Entity;

  blindDuration: number;

  weaponName: string;

  entIndex: number;
};

export type BlindedEvent = IBaseEvent<"blinded", BlindedEventPayload>;

// eslint-disable-next-line max-len
// "blindedName"<93><STEAM_1:0:12345><CT>" blinded for 5.10 by "attackerName"<94><STEAM_1:0:12345><TERRORIST>" from flashbang entindex 205
export const blindedParser = defineParser<BlindedEvent>({
  type: "blinded",

  patterns: [
    concatPattern`^(?<victim>${entityRe}) blinded for (?<blindDuration>[^"]+) by (?<attacker>${entityRe}) from (?<weaponName>[^"]+) entindex (?<entIndex>[^"]+)$`
  ],

  parse({
    attacker,
    victim,
    blindDuration,
    weaponName,
    entIndex
  }) {
    return {
      attacker: parseEntity(attacker),
      victim: parseEntity(victim),
      blindDuration: Number(blindDuration),
      weaponName,
      entIndex: Number(entIndex)
    };
  },
});
