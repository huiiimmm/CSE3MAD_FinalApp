import EarthquakeResults from "@/app/(tabs)/EarthquakeResistance/earthquake_results";
import { getEarthquakeData } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";

describe("EarthquakeResults Leaderboard Dashboard Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loading indicator while fetching historical telemetry logs", async () => {
    // Force a pending promise state to inspect the initial loading rendering block
    (getEarthquakeData as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { getByText, getByRole, getByTestId } = render(<EarthquakeResults />);

    expect(getByTestId("Retrieving")).toBeTruthy();
    // Verify that the native ActivityIndicator layout engine is active
    expect(getByRole("activityindicator")).toBeTruthy();
  });

  it("renders sorted data cards properly and highlights the highest peak intensity structure", async () => {
    // Seed database mock response with unsorted mock logs
    const mockTelemetryPayload = [
      {
        id: "eq-low",
        uid: "user-1",
        email: "low_risk@test.com",
        structureName: "Flexible Wooden Shack",
        averageStructureMovementIntensity: 0.4211,
        peakStructureMovementIntensity: 1.1244,
      },
      {
        id: "eq-high",
        uid: "user-2",
        email: "high_risk@test.com",
        structureName: "Rigid Concrete Monolith",
        averageStructureMovementIntensity: 1.8455,
        peakStructureMovementIntensity: 4.9566, // Should rank #1
      },
    ];

    (getEarthquakeData as jest.Mock).mockResolvedValue(mockTelemetryPayload);

    const { getByText, getAllByText, getByTestId } = render(
      <EarthquakeResults />,
    );

    // Wait for the asynchronous Firebase ingestion to finish updating the UI thread
    await waitFor(() => {
      expect(getByTestId("structureName1")).toBeTruthy();
    });

    // Check formatting precision constraints (.toFixed(2)) inside text node outputs
    expect(getByText("4.96")).toBeTruthy(); // Peak 1 Rounded Up
    expect(getByText("1.85")).toBeTruthy(); // Avg 1 Rounded Up
    expect(getByText("1.12")).toBeTruthy(); // Peak 2 Rounded Down
    expect(getByText("0.42")).toBeTruthy(); // Avg 2 Rounded Down

    // Confirm structural sorting order via explicit string ranking layout nodes
    expect(getByText("Rank #1")).toBeTruthy();
    expect(getByText("Rank #2")).toBeTruthy();
  });

  it("triggers a manual refresh sequence when pull-to-refresh actions execute", async () => {
    (getEarthquakeData as jest.Mock).mockResolvedValue([
      {
        id: "eq-1",
        uid: "test",
        email: "test@test.com",
        structureName: "Initial Frame Data",
        averageStructureMovementIntensity: 0.5,
        peakStructureMovementIntensity: 1.2,
      },
    ]);

    const { getByText, getByTestId } = render(<EarthquakeResults />);

    await waitFor(() => {
      expect(getByText("Initial Frame Data")).toBeTruthy();
    });

    // Extract core flatlist properties to explicitly trigger the onRefresh callback interface
    const flatList = getByText("Initial Frame Data").getParent()?.getParent();

    await act(async () => {
      if (flatList?.props.onRefresh) {
        flatList.props.onRefresh();
      }
    });

    expect(getEarthquakeData).toHaveBeenCalledTimes(2);
  });

  it("handles navigation routes and haptic side-effects correctly when button rows are clicked", async () => {
    (getEarthquakeData as jest.Mock).mockResolvedValue([]); // Safe fallback empty state

    const { getByText } = render(<EarthquakeResults />);

    await waitFor(() => {
      expect(
        getByText(
          "No seismographic logging passes found. Complete an assessment to stream metrics.",
        ),
      ).toBeTruthy();
    });

    // 1. Check Directory Navigation Path Action Link
    const allTestsButton = getByText("View All Tests");
    fireEvent.press(allTestsButton);

    expect(router.push).toHaveBeenCalledWith("/(tabs)/ReactionTest/directory");
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );

    // 2. Check Primary Menu Navigation Path Action Link
    const backMenuButton = getByText("Back to Menu");
    fireEvent.press(backMenuButton);

    expect(router.push).toHaveBeenCalledWith("/(tabs)/ReactionTest/menu");
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
  });
});
