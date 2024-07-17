import { ok } from "assert";
import { parse } from "../src";
import { getEventString } from "./helpers/getEventString";
import { counterTerroristTeam, terroristTeam } from "./helpers/teams";

describe("assisted", (): void => {
  it("should correctly parse", () => {

    const assistant = {
      kind: "player",
      entityId: 93,
      steamId: "76561198191236195",
      name: "AssistantName",
      team: counterTerroristTeam,
    };

    const victim = {
      kind: "player",
      entityId: 92,
      steamId: "76561198191236195",
      name: "VictimName",
      team: terroristTeam,
    };

    const events: [string, Record<string, unknown>][] = [
      [
        '"AssistantName<93><[U:1:230970467]><CT>" assisted killing "VictimName<92><[U:1:230970467]><TERRORIST>"',
        {
          assistant: assistant,
          victim: victim,
          flashAssist: false
        },
      ],
      [
        '"AssistantName<93><[U:1:230970467]><CT>" flash-assisted killing "VictimName<92><[U:1:230970467]><TERRORIST>"',
        {
          assistant: assistant,
          victim: victim,
          flashAssist: true
        }
      ],
    ]

    for (const [log, event] of events) {
      const result = parse(getEventString(log));

      ok(result !== undefined, `Failed parse log: ${log}`);

      expect(result.type).toBe("assisted");
      expect(result.payload).toMatchObject(event);
    }
  });
});
