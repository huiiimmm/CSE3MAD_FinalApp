import "jest-styled-components";
import "jest-styled-components/native";

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";

import MyResultsScreen from "@/app/(tabs)/myresults";
import { router } from "expo-router";

// ---------------- TESTS ----------------

describe("<MyResultsScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<MyResultsScreen />);
  });

  test("renders scores correctly", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("test1")).toBeTruthy();
      expect(screen.getByTestId("test2")).toBeTruthy();
      expect(screen.getByTestId("test3")).toBeTruthy();
      expect(screen.getByTestId("test4")).toBeTruthy();
    });
  });

  test("navigates back to menu", () => {
    const button = screen.getByTestId("menu");

    fireEvent.press(button);

    expect(router.push).toHaveBeenCalledWith("/menu");
  });

  test("matches snapshot", () => {
    const tree = render(<MyResultsScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
