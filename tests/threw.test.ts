import { ok } from "assert";
import { parse } from "../src";
import { getEventString } from "./helpers/getEventString";
import { counterTerroristTeam, terroristTeam } from "./helpers/teams";

describe("threw", (): void => {
  it("should correctly parse", () => {

    const events: [string, Record<string, unknown>][] = [
      [
        '"PlayerName<93><[U:1:230970467]><CT>" threw molotov [-2035 1521 35]',
        {
          player: {
            kind: "player",
            entityId: 93,
            steamId: "76561198191236195",
            name: "PlayerName",
            position: [-2035, 1521, 35],
            team: counterTerroristTeam,
          },
    
          item: "molotov",
        }
      ],

      [
        '"dimi<0><[U:1:221567857]><TERRORIST>" threw flashbang [-472 -336 11778] flashbang entindex 775)',
        {
          player: {
            kind: "player",
            entityId: 0,
            steamId: "76561198181833585",
            name: "dimi",
            position: [-472, -336, 11778],
            team: terroristTeam
          }
        }
      ]
    ];

    for (const [log, event] of events) {
      const result = parse(getEventString(log));

      ok(result !== undefined, `Failed parse log: ${log}`);

      expect(result.type).toBe("threw");
      expect(result.payload).toMatchObject(event);
    }

  });
});
