import { ok } from "assert";
import { parse } from "../src";
import { getEventString } from "./helpers/getEventString";
import { counterTerroristTeam, terroristTeam } from "./helpers/teams";

describe("blinded", (): void => {
  it("should correctly parse", () => {
    const log = getEventString(
      '"BlindedName<93><[U:1:230970467]><CT>" blinded for 5.10 by "AttackerName<94><[U:1:230970467]><TERRORIST>" from flashbang entindex 205',
    );

    const result = parse(log);    

    ok(result !== undefined, `Failed parse log: ${log}`);

    expect(result.type).toBe("blinded");
    expect(result.payload).toMatchObject({
      attacker: {
        kind: "player",
        entityId: 94,
        steamId: "76561198191236195",
        name: "AttackerName",
        team: terroristTeam
      },

      victim: {
        kind: "player",
        entityId: 93,
        steamId: "76561198191236195",
        name: "BlindedName",
        team: counterTerroristTeam
      },

      weaponName: "flashbang",

      blindDuration: 5.10,

      entIndex: 205
    });
  });
});
