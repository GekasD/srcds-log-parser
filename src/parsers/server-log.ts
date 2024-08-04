import { IBaseEvent, defineParser } from "./parser";
import { concatPattern } from "../helpers";

export interface IServerLogFileStartedEvent {
  kind: "log_file";
  state: "started";
  filePath: string;
  gamePath: string;
  version: string;
}

export interface IServerLogFileClosedEvent {
  kind: "log_file";
  state: "closed";
}

export type ServerLogFileEvent = IServerLogFileStartedEvent | IServerLogFileClosedEvent;

export interface IServerLogMapLoadingEvent {
  kind: "map";
  state: "loading";
  map: string;
}

export interface IServerLogMapStartedEvent {
  kind: "map";
  state: "started";
  map: string;
  crc: string;
}

export type ServerLogMapEvent = IServerLogMapLoadingEvent | IServerLogMapStartedEvent;

export interface IServerLogMessagEvent {
  kind: "message";
  message: string;
}

export interface IServerLogStartedEvent {
  kind: "started";
  value: string;
}

export type ServerLogEventPayload = ServerLogFileEvent | ServerLogMapEvent | IServerLogMessagEvent | IServerLogStartedEvent;

export type ServerLogEvent = IBaseEvent<"server_log", ServerLogEventPayload>;

// eslint-disable-next-line max-len
// Log file started (file "logs\L172_028_192_001_27015_202009211728_000.log") (game "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo") (version "7929")
// Log file closed

// Loading map "de_inferno"
// Started map "de_inferno" (CRC "-896074606")
// (I don't think the 'Started map' log above exists anymore on CS2, from testing it seems like the server just prints this log below) (yes that is 2 spaces)
// L 08/04/2024 - 10:10:44: Started:  ""

// server_message: "quit"
// server_message: "restart"
export const ServerLogParser = defineParser<ServerLogEvent>({
  type: "server_log",

  patterns: [
    concatPattern`^Log file (?<logState>started|closed)(?: \\(file "(?<filePath>.+)"\\) \\(game "(?<gamePath>.+)"\\) \\(version "(?<version>.+)"\\))?$`,
    concatPattern`^(?<mapState>Loading|Started) map "(?<map>.+)"(?: \\(CRC "(?<crc>.+)"\\))?$`,
    concatPattern`^Started:  "(?<startedValue>.*)"$`, // The value of this always seems to be an empty string (""), so we use .*
    concatPattern`^server_message: "(?<message>.+)"$`,
  ],

  parse({
    logState,
    filePath,
    gamePath,
    version,

    mapState,
    map,
    crc,

    startedValue,

    message,
  }) {
    if (logState !== undefined) {
      return {
        kind: "log_file",
        state: logState as ServerLogFileEvent["state"],
        filePath,
        gamePath,
        version,
      };
    }

    if (mapState !== undefined) {
      return {
        kind: "map",
        state: mapState.toLowerCase() as ServerLogMapEvent["state"],
        map,
        crc,
      };
    }

    console.log('startedValue:', startedValue);
    

    if (startedValue !== undefined) {
      return {
        kind: 'started',
        value: startedValue
      }
    }

    return {
      kind: "message",
      message,
    };
  },
});
