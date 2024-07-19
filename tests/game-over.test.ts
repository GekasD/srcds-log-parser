import { ok } from "assert";
import { parse } from "../src";
import { getEventString } from "./helpers/getEventString";

describe("blinded", (): void => {
  it("should correctly parse", () => {

    const events: [string, Record<string, unknown>][] = [
      [
        'Game Over: competitive mg_de_mirage de_mirage score 0:13 after 129 min',
        {
          gamemode: 'competitive',
          mapgroup: 'mg_de_mirage',
          mapname: 'de_mirage',
          score1: 0,
          score2: 13,
          durationMinutes: 129
        },
      ],
      [
        'Game Over: competitive  cs_office score 2:13 after 28 min',
        {
          gamemode: 'competitive',
          mapgroup: undefined,
          mapname: 'cs_office',
          score1: 2,
          score2: 13,
          durationMinutes: 28
        }
      ],
    ]

    for (const [log, event] of events) {
      const result = parse(getEventString(log));

      ok(result !== undefined, `Failed parse log: ${log}`);

      expect(result.type).toBe("game_over");
      expect(result.payload).toMatchObject(event);
    }
    
  });
});
