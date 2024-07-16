# srcds-log-parser

A log parsing tool, that can be used for parsing logs sent from CS2 game server via an HTTP endpoint, or a log file.

This is a fork of a fork, the first fork was made by [BLAST](https://github.com/blastorg) (available [here](https://github.com/blastorg/srcds-log-parser)), and the original library was made by [negezor](https://github.com/negezor) (available [here](https://github.com/negezor/srcds)).

This fork was made to add support for the HTTP log date format, and to add / update some more parsers.

## Requirements

In order to install and use this package, you need to have Node.js installed (at least `v18`).

Because this library is using regex for all of it's parsing, it does not need any other dependencies.

# Installation

```bash
$ npm install https://github.com/GekasD/srcds-log-parser
```

## Example usage

```ts
import { parse } from 'srcds-log-parser';

// Log coming from CS2 game server
const log = '10/20/2020 - 10:30:50: "AttackerName<93><[U:1:230970467]><CT>" [698 2222 -69] killed "VictimName<94><[U:1:230970467]><TERRORIST>" [1303 2143 64] with "hkp2000" (throughsmoke headshot)'

const parsedLog = parse(log);

console.log(parsedLog);
{
  type: "killed",
  receivedAt: Date("10/20/2020 10:30:50");
  payload: {
    attacker: {
      kind: "player",
      entityId: 93,
      steamId: "76561198191236195", // Steam ID 64 (BigInt)
      name: "AttackerName",
      position: [698, 2222, -69],
      team: {
        id: 3,
        name: "COUNTER_TERRORISTS",
      },
    },
    victim: {
      kind: "player",
      entityId: 94,
      steamId: "76561198191236195", // Steam ID 64 (BigInt)
      name: "VictimName",
      position: [1303, 2143, 64],
      team: {
        id: 2,
        name: "TERRORISTS",
      },
    },
    weaponName: "hkp2000",
    modifiers: ["throughsmoke", "headshot"],
  },
}
```
