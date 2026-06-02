import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

// Mock Firebase Utility Engine Module
jest.mock("@/firebase", () => ({
  auth: {
    currentUser: { uid: "test", email: "test@test.com" },
  },
  db: {}, // Reference token pass-through

  // Wrapper Functions
  addDebugDoc: jest.fn(),
  login: jest.fn().mockResolvedValue({
    user: { uid: "test", email: "test@test.com" },
  }),
  createAccount: jest.fn(),
  logout: jest.fn(),
  removeUser: jest.fn(),

  // Reaction Metric Core Engine Mocking Rules
  saveReactionScore: jest.fn(),
  getReactionLeaderboardDocs: jest.fn(
    (
      testType: string,
      setFunction: (data: any[]) => void,
      ascending: boolean,
    ) => {
      const mockLeaderboard = [
        {
          id: `${testType}-1`,
          userId: "123",
          email: "current@test.com",
          reactionScore: ascending ? 120 : 25,
        },
        {
          id: `${testType}-2`,
          userId: "456",
          email: "other@test.com",
          reactionScore: ascending ? 180 : 18,
        },
      ];
      setFunction(mockLeaderboard);
    },
  ),
  getUserBestScores: jest.fn().mockResolvedValue({
    test1: 180,
    test2: 210,
    test3: 45, // Target tracking hit value
    test4: 195,
  }),

  // Telemetry Location Engineering Mocks
  uploadLocation: jest.fn(),
  uploadSoundLocation: jest.fn(),
  getSoundLocation: jest.fn().mockResolvedValue([
    {
      id: "s1",
      uid: "test",
      email: "test@test.com",
      latitude: -37.8136,
      longitude: 144.9631,
      noiseType: "Traffic",
      noiseLevel: 75,
    },
  ]),
  getAllLocations: jest.fn().mockResolvedValue([
    {
      id: "l1",
      uid: "test",
      email: "test@test.com",
      latitude: -37.8136,
      longitude: 144.9631,
    },
  ]),

  // Seismographic & Kinetic Engineering Telemetry Mocks
  uploadVibrationData: jest.fn(),
  getVibrationData: jest
    .fn()
    .mockResolvedValue([{ id: "v1", uid: "test", intensity: 4.2 }]),
  uploadEarthquakeData: jest.fn(),
  getEarthquakeData: jest.fn().mockResolvedValue([
    {
      id: "eq1",
      uid: "test",
      email: "test@test.com",
      structureName: "Standard Test Frame",
      averageStructureMovementIntensity: 1.25,
      peakStructureMovementIntensity: 2.84,
    },
  ]),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "Light" },
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: -37.8136, longitude: 144.9631 },
  }),
  Accuracy: { Balanced: 3 },
}));

// Mock Expo Sensors Framework
jest.mock("expo-sensors", () => {
  // Store active subscription listener blocks to trigger synthetic events manually
  let accelerometerListeners: Array<(data: any) => void> = [];
  let gyroscopeListeners: Array<(data: any) => void> = [];
  let magnetometerListeners: Array<(data: any) => void> = [];
  let pedometerListeners: Array<(data: any) => void> = [];

  return {
    __esModule: true,

    // --- Accelerometer ---
    Accelerometer: {
      addListener: jest.fn((callback) => {
        accelerometerListeners.push(callback);
        return {
          remove: jest.fn(() => {
            accelerometerListeners = accelerometerListeners.filter(
              (l) => l !== callback,
            );
          }),
        };
      }),
      removeAllListeners: jest.fn(() => {
        accelerometerListeners = [];
      }),
      setUpdateInterval: jest.fn(),
      // Test helper helper to emit mock g-force telemetry data
      mockEmit: (data = { x: 0, y: 0, z: 9.8 }) => {
        accelerometerListeners.forEach((listener) => listener(data));
      },
    },

    // --- Gyroscope ---
    Gyroscope: {
      addListener: jest.fn((callback) => {
        gyroscopeListeners.push(callback);
        return {
          remove: jest.fn(() => {
            gyroscopeListeners = gyroscopeListeners.filter(
              (l) => l !== callback,
            );
          }),
        };
      }),
      removeAllListeners: jest.fn(() => {
        gyroscopeListeners = [];
      }),
      setUpdateInterval: jest.fn(),
      // Test helper to emit mock angular velocity coordinates
      mockEmit: (data = { x: 0.01, y: -0.02, z: 0.05 }) => {
        gyroscopeListeners.forEach((listener) => listener(data));
      },
    },
  };
});

// Mock Expo AV Audio Framework
jest.mock("expo-av", () => {
  // Retain global hooks to simulate dynamic audio playback or recording updates
  let mockOnPlaybackStatusUpdate: ((status: any) => void) | null = null;

  // The mocked Recording instance engine
  const mockRecordingInstance = {
    getStatusAsync: jest.fn().mockResolvedValue({
      canRecord: true,
      isRecording: true,
      durationMillis: 1200,
      metering: -35, // Default hardware level decibel offset (-35 + 100 = 65 dB)
    }),
    startAsync: jest.fn().mockResolvedValue({}),
    pauseAsync: jest.fn().mockResolvedValue({}),
    stopAndUnloadAsync: jest.fn().mockResolvedValue({}),
    setOnPlaybackStatusUpdate: jest.fn((callback) => {
      mockOnPlaybackStatusUpdate = callback;
    }),
  };

  // The mocked Sound instance engine (for audio playback alerts)
  const mockSoundInstance = {
    playAsync: jest.fn().mockResolvedValue({}),
    pauseAsync: jest.fn().mockResolvedValue({}),
    stopAsync: jest.fn().mockResolvedValue({}),
    unloadAsync: jest.fn().mockResolvedValue({}),
    setStatusAsync: jest.fn().mockResolvedValue({}),
  };

  return {
    __esModule: true,
    Audio: {
      // Hardware Permissions Hooks
      requestPermissionsAsync: jest
        .fn()
        .mockResolvedValue({ status: "granted" }),
      getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),

      // Thread Layout Configuration
      setAudioModeAsync: jest.fn().mockResolvedValue({}),

      // Recording Engine Blueprint Constructors
      Recording: {
        createAsync: jest.fn(() =>
          Promise.resolve({
            recording: mockRecordingInstance,
            status: { canRecord: true, isRecording: true },
          }),
        ),
      },

      // Sound Playback Engine Blueprint Constructors
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({
            sound: mockSoundInstance,
            status: { isLoaded: true },
          }),
        ),
      },
    },
  };
});

jest.mock("Vibration", () => ({
  __esModule: true,
  default: {
    vibrate: jest.fn(),
    cancel: jest.fn(),
  },
}));
