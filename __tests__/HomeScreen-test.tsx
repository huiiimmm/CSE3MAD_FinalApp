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

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

import { router } from "expo-router";

const mockPush = jest.mocked(router.push);

/* ---------------- FIREBASE WRAPPER MOCK ---------------- */

const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockCreateAccount = jest.fn();
const mockRemoveUser = jest.fn();
const mockAddDebugDoc = jest.fn();

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
      email: "test@test.com",
    },
  },

  db: {},

  login: (...args: any[]) => mockLogin(...args),

  logout: (...args: any[]) => mockLogout(...args),

  createAccount: (...args: any[]) => mockCreateAccount(...args),

  removeUser: (...args: any[]) => mockRemoveUser(...args),

  addDebugDoc: (...args: any[]) => mockAddDebugDoc(...args),
}));

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    mockLogin.mockResolvedValue({
      user: {
        email: "tester@mail.com",
      },
    });

    render(<HomeScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "tester@mail.com",
    );

    fireEvent.changeText(screen.getByPlaceholderText("Password"), "passpass");

    fireEvent.press(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("tester@mail.com", "passpass");
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/menu");
    });
  });

  /* ------------------------------------------------ */
  /* CREATE ACCOUNT TEST                              */
  /* ------------------------------------------------ */

  test("creates account successfully", async () => {
    mockCreateAccount.mockResolvedValue({
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
      expect(mockCreateAccount).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* LOGOUT TEST                                      */
  /* ------------------------------------------------ */

  test("logs user out successfully", async () => {
    mockLogout.mockResolvedValue(undefined);

    render(<HomeScreen />);

    fireEvent.press(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------ */
  /* DELETE USER TEST                                 */
  /* ------------------------------------------------ */

  test("deletes user successfully", async () => {
    mockRemoveUser.mockResolvedValue(undefined);

    render(<HomeScreen />);

    fireEvent.press(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockRemoveUser).toHaveBeenCalled();
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
