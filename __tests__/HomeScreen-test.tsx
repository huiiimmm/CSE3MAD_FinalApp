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

/* ---------------- SAFE AREA MOCK ---------------- */

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

/* ---------------- ROUTER MOCK ---------------- */

const pushMock = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: pushMock,
  },
}));

/* ---------------- FIREBASE WRAPPER MOCK ---------------- */

const loginMock = jest.fn();
const logoutMock = jest.fn();
const createAccountMock = jest.fn();
const removeUserMock = jest.fn();
const addDebugDocMock = jest.fn();

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
      email: "test@test.com",
    },
  },

  db: {},

  login: (...args: any[]) => loginMock(...args),

  logout: (...args: any[]) => logoutMock(...args),

  createAccount: (...args: any[]) => createAccountMock(...args),

  removeUser: (...args: any[]) => removeUserMock(...args),

  addDebugDoc: (...args: any[]) => addDebugDocMock(...args),
}));

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ------------------------------------------------ */
  /* RENDER TEST                                      */
  /* ------------------------------------------------ */

  test("renders login screen correctly", () => {
    render(<HomeScreen />);

    expect(screen.getByText("Login")).toBeTruthy();

    expect(screen.getByText("Create")).toBeTruthy();

    expect(screen.getByPlaceholderText("Email")).toBeTruthy();

    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });

  /* ------------------------------------------------ */
  /* STYLE TEST                                       */
  /* ------------------------------------------------ */

  test("login text has correct style", () => {
    render(<HomeScreen />);

    const loginText = screen.getByText("Login");

    expect(loginText).toHaveStyle({
      color: "white",
      fontSize: 18,
    });
  });

  /* ------------------------------------------------ */
  /* INPUT TEST                                       */
  /* ------------------------------------------------ */

  test("updates email and password inputs", () => {
    render(<HomeScreen />);

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
    loginMock.mockResolvedValue({
      user: {
        email: "hello@test.com",
      },
    });

    render(<HomeScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "hello@test.com",
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123",
    );

    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("hello@test.com", "password123");
    });

    expect(pushMock).toHaveBeenCalledWith("/menu");
  });

  /* ------------------------------------------------ */
  /* CREATE ACCOUNT TEST                              */
  /* ------------------------------------------------ */

  test("creates account successfully", async () => {
    createAccountMock.mockResolvedValue({
      user: {
        email: "new@test.com",
      },
    });

    render(<HomeScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "new@test.com");

    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123",
    );

    fireEvent.press(screen.getByText("Create"));

    await waitFor(() => {
      expect(createAccountMock).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* LOGOUT TEST                                      */
  /* ------------------------------------------------ */

  test("logs user out successfully", async () => {
    logoutMock.mockResolvedValue(undefined);

    render(<HomeScreen />);

    fireEvent.press(screen.getByText("Logout"));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* DELETE USER TEST                                 */
  /* ------------------------------------------------ */

  test("deletes user successfully", async () => {
    removeUserMock.mockResolvedValue(undefined);

    render(<HomeScreen />);

    fireEvent.press(screen.getByText("Delete"));

    await waitFor(() => {
      expect(removeUserMock).toHaveBeenCalled();
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
