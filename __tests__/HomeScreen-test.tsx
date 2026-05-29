import React from "react";

import "jest-styled-components";
import "jest-styled-components/native";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import HomeScreen from "@/app/(tabs)/index";

import { createAccount, login, logout, removeUser } from "@/firebase";
import { router } from "expo-router";

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<HomeScreen />);
  });

  /* ------------------------------------------------ */
  /* INPUT TEST                                       */
  /* ------------------------------------------------ */

  test("updates email and password inputs", () => {
    const emailInput = screen.getByPlaceholderText("Email");

    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "hello@test.com");

    fireEvent.changeText(passwordInput, "mypassword");

    expect(emailInput.props.value).toBe("hello@test.com");

    expect(passwordInput.props.value).toBe("mypassword");
  });

  /* ------------------------------------------------ */
  /* LOGIN TEST                                       */
  /* ------------------------------------------------ */

  test("logs user in successfully", async () => {
    (login as jest.Mock).mockResolvedValue({
      user: {
        email: "tester@mail.com",
      },
    });

    fireEvent.changeText(screen.getByTestId("email"), "tester@mail.com");

    fireEvent.changeText(screen.getByTestId("password"), "passpass");

    fireEvent.press(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("tester@mail.com", "passpass");
      expect(router.push).toHaveBeenCalledWith("/menu");
    });
  });

  /* ------------------------------------------------ */
  /* CREATE ACCOUNT TEST                              */
  /* ------------------------------------------------ */

  test("creates account successfully", async () => {
    (createAccount as jest.Mock).mockResolvedValue({
      user: {
        email: "new@test.com",
      },
    });

    fireEvent.changeText(screen.getByTestId("email"), "new@test.com");

    fireEvent.changeText(screen.getByTestId("password"), "password123");

    fireEvent.press(screen.getByTestId("createButton"));

    await waitFor(() => {
      expect(createAccount).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* LOGOUT TEST                                      */
  /* ------------------------------------------------ */

  test("logs user out successfully", async () => {
    (logout as jest.Mock).mockResolvedValue(undefined);

    fireEvent.press(screen.getByText("Logout"));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* DELETE USER TEST                                 */
  /* ------------------------------------------------ */

  test("deletes user successfully", async () => {
    (removeUser as jest.Mock).mockResolvedValue(undefined);

    fireEvent.press(screen.getByText("Delete"));

    await waitFor(() => {
      expect(removeUser).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* SNAPSHOT TEST                                    */
  /* ------------------------------------------------ */

  test("matches snapshot", () => {
    const tree = render(<HomeScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
