import { getAllLocations, getUserBestScores } from "@/firebase";

export async function loadMapData() {
  const locations = await getAllLocations();

  const scores = await Promise.all(
    locations.map(async (loc) => [loc.uid, await getUserBestScores(loc.uid)]),
  );

  return {
    locations,
    scores: Object.fromEntries(scores),
  };
}
jest.mock("@/firebase");

it("loads map data", async () => {
  (getAllLocations as jest.Mock).mockResolvedValue([{ uid: "user1" }]);

  (getUserBestScores as jest.Mock).mockResolvedValue({
    test1: 100,
  });

  const result = await loadMapData();

  expect(result.locations.length).toBe(1);
  expect(result.scores.user1.test1).toBe(100);
});
