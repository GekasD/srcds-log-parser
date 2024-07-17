import { ok } from "assert";
import { parse } from "../src";
import { getEventString } from "./helpers/getEventString";

describe("blinded", (): void => {
  it("should correctly parse", () => {
    const log = getEventString(
      'Game Over: competitive mg_de_mirage de_mirage score 0:13 after 129 min',
    );

    const result = parse(log);    

    ok(result !== undefined, `Failed parse log: ${log}`);

    expect(result.type).toBe("game_over");
    expect(result.payload).toMatchObject({
      
      gamemode: 'competitive',
      mapgroup: 'mg_de_mirage',
      mapname: 'de_mirage',
      score1: 0,
      score2: 13,
      durationMinutes: 129

    });
  });
});
