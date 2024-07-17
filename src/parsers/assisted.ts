import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";
import { Entity, entityRe, parseEntity } from "../entities";

export type AssistedEventPayload = {
  assistant: Entity;
  victim: Entity;
  flashAssist: boolean;
};

export type AssistedEvent = IBaseEvent<"assisted", AssistedEventPayload>;

// eslint-disable-next-line max-len
// "AssitantName<93><STEAM_1:0:12345><CT>" assisted killing "VictimName<92><STEAM_1:0:12345><TERRORIST>"
// "AssitantName<93><STEAM_1:0:12345><CT>" flash-assisted killing "VictimName<92><STEAM_1:0:12345><TERRORIST>"
export const assistedParser = defineParser<AssistedEvent>({
  type: "assisted",

  patterns: [
    concatPattern`^(?<assistant>${entityRe}) (?<assistType>assisted|flash-assisted) killing (?<victim>${entityRe})$`
  ],

  parse({
    assistant,
    victim,
    assistType
  }) {
    return {
      assistant: parseEntity(assistant),
      victim: parseEntity(victim),
      flashAssist: assistType === 'flash-assisted'
    };
  },
});
