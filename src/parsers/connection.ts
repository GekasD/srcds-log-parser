import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";
import { entityRe, IPlayerEntity, IBotEntity, parseEntity } from "../entities";

export interface IConnectionConnectedEvent {
  kind: "connected";
  client: IPlayerEntity | IBotEntity;
  address: string;
}

export interface IConnectionEnteredEvent {
  kind: "entered";
  client: IPlayerEntity | IBotEntity;
}

export interface IConnectionDisconnectedEvent {
  kind: "disconnected";
  client: IPlayerEntity | IBotEntity;
  reason: string;
}

// L 12/30/2024 - 17:27:19: "DemoRecorder<1><BOT><>" connected, address "none"

// L 12/30/2024 - 17:27:19: "DemoRecorder<1><BOT><>" entered the game

export type ConnectionEventPayload = IConnectionConnectedEvent | IConnectionEnteredEvent | IConnectionDisconnectedEvent;

export type ConnectionEvent = IBaseEvent<"connection", ConnectionEventPayload>;

const basePattern = concatPattern`^(?<client>${entityRe})`;

// "ConnectionPlayer<93><STEAM_1:0:12345><>" connected, address ""
// "Walt<96><BOT><>" connected, address ""
// "Albert<95><BOT><>" entered the game
// "Bert<122><BOT><>" disconnected (reason "Server shutting down")
// "ConnectionPlayer<113><STEAM_1:0:12345><>" disconnected (reason "Server shutting down")
export const connectionParser = defineParser<ConnectionEvent>({
  type: "connection",

  patterns: [
    concatPattern`${basePattern} (?<kind>entered) the game$`,
    concatPattern`${basePattern} (?<kind>connected), address "(?<address>[^"]*)"$`,
    concatPattern`${basePattern} (?<kind>disconnected) \\(reason "(?<reason>[^"]*)"\\)$`,
  ],

  parse({ client: rawClient, kind, address, reason }) {
    const client = parseEntity(rawClient) as IPlayerEntity;

    return {
      kind: kind as ConnectionEventPayload["kind"],
      client,
      address,
      reason,
    };
  },
});
