import "jest-styled-components";
import "jest-styled-components/native";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import Test1 from "@/app/(tabs)/test1";
import { saveScore } from "@/firebase";
import { impactAsync } from "expo-haptics";
import { router } from "expo-router";

// ---------------- TESTS ----------------

describe("<Test1 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    render(<Test1 />);
  });

  test("uploads score after successful reaction", async () => {
    (saveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });

    await waitFor(() => {
      expect(saveScore).toHaveBeenCalled();
    });
    expect(saveScore).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "test",
        email: "test@test.com",
      }),
      expect.objectContaining({
        testType: "test1",
        userId: "test",
        email: "test@test.com",
        score: expect.any(Number),
        timestamp: expect.any(Number),
      }),
    );
  });

  test("navigates to test2", async () => {
    (saveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });
    const nextTestButton = await screen.findByTestId("nextTest");
    fireEvent.press(nextTestButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/test2");
    });
  });

  test("haptics on reaction", async () => {
    (saveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });
    await waitFor(() => {
      expect(impactAsync).toHaveBeenCalledWith("Medium");
    });
  });

  test("matches snapshot", () => {
    const tree = render(<Test1 />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
