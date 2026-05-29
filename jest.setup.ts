import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

// Mock Safe Area Context
jest.mock("@/firebase", () => ({
  auth: {
    currentUser: { uid: "test", email: "test@test.com" },
  },
  addDebugDoc: jest.fn(),
  login: jest.fn().mockResolvedValue({
    user: {
      uid: "test",
      email: "test@test.com",
    },
  }),
  createAccount: jest.fn(),
  logout: jest.fn(),
  removeUser: jest.fn(),
  saveScore: jest.fn(),
  getLeaderboardDocs: jest.fn(
    (testName: string, setState: (data: any[]) => void, fastest: boolean) => {
      const mockData = [
        {
          id: `${testName}-1`,
          userId: "123",
          email: "current@test.com",
          score: fastest ? 120 : 25,
        },
        {
          id: `${testName}-2`,
          userId: "456",
          email: "other@test.com",
          score: fastest ? 180 : 18,
        },
      ];

      setState(mockData);
    },
  ),
  getAllLocations: jest.fn(),
  getUserBestScores: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props, props.children),
    Marker: (props: any) => React.createElement(View, props, props.children),
    Callout: (props: any) => React.createElement(View, props, props.children),
  };
});

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),

  ImpactFeedbackStyle: {
    Light: "Light",
    Medium: "Medium",
  },
  NotificationFeedbackType: {
    Error: "Error",
  },
}));

jest.useFakeTimers();

jest.spyOn(Math, "random").mockReturnValue(0);

jest.mock("expo-av", () => {
  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() => ({
          sound: {
            playAsync: jest.fn(),
            createAsync: jest.fn(),
            unloadAsync: jest.fn(),
            setOnPlaybackStatusUpdate: jest.fn(),
          },
        })),
      },

      setAudioModeAsync: jest.fn(),
    },
  };
});

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
