import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

// Mock Safe Area Context
jest.mock("@/firebase", () => ({
  auth: {
    currentUser: { uid: "test", email: "test@test.com" },
  },
  addDebugDoc: jest.fn(),
  login: jest.fn(() =>
    Promise.resolve({ user: { uid: "test", email: "test@test.com" } }),
  ),
  createAccount: jest.fn(),
  logout: jest.fn(),
  removeUser: jest.fn(),
  saveScore: jest.fn(),
  getLeaderboardDocs: jest.fn(),
}));
