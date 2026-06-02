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
  notificationAsync: jest.fn(), // Added to prevent unmocked method errors
  ImpactFeedbackStyle: {
    Light: "Light",
    Medium: "Medium",
    Heavy: "Heavy",
  },
  // Fixes: TypeError: Cannot read properties of undefined (reading 'Success')
  NotificationFeedbackType: {
    Success: "Success",
    Warning: "Warning",
    Error: "Error",
  },
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

// Fixed Expo AV Framework Mock
jest.mock("expo-av", () => {
  const mockRecordingInstance = {
    getStatusAsync: jest.fn().mockResolvedValue({
      canRecord: true,
      isRecording: true,
      durationMillis: 1200,
      metering: -35,
    }),
    prepareToRecordAsync: jest.fn().mockResolvedValue({}), // Required by Test4
    startAsync: jest.fn().mockResolvedValue({}),
    pauseAsync: jest.fn().mockResolvedValue({}),
    stopAndUnloadAsync: jest.fn().mockResolvedValue({}),
    setOnPlaybackStatusUpdate: jest.fn(),
  };

  const mockSoundInstance = {
    playAsync: jest.fn().mockResolvedValue({}),
    replayAsync: jest.fn().mockResolvedValue({}), // Required by Test4
    pauseAsync: jest.fn().mockResolvedValue({}),
    stopAsync: jest.fn().mockResolvedValue({}),
    unloadAsync: jest.fn().mockResolvedValue({}),
    setStatusAsync: jest.fn().mockResolvedValue({}),
  };

  // Explicitly instantiate spy tracks before exporting them inside structural trees
  const mockCreateRecordingAsync = jest.fn().mockResolvedValue({
    recording: mockRecordingInstance,
    status: { canRecord: true, isRecording: true },
  });

  const mockCreateSoundAsync = jest.fn().mockResolvedValue({
    sound: mockSoundInstance,
    status: { isLoaded: true },
  });

  // --- CONSTRUCTOR FACTORIES TO BRIDGE THE 'NEW' KEYWORD GAP ---
  const MockRecordingConstructor = jest
    .fn()
    .mockImplementation(() => mockRecordingInstance);
  const MockSoundConstructor = jest
    .fn()
    .mockImplementation(() => mockSoundInstance);

  // Attach static utility method anchors directly onto the constructible functions
  (MockRecordingConstructor as any).createAsync = mockCreateRecordingAsync;
  (MockSoundConstructor as any).createAsync = mockCreateSoundAsync;

  return {
    __esModule: true,
    Audio: {
      requestPermissionsAsync: jest
        .fn()
        .mockResolvedValue({ status: "granted" }),
      getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
      setAudioModeAsync: jest.fn().mockResolvedValue({}),

      // Nested references now point directly to constructible functions supporting static methods
      Recording: MockRecordingConstructor,
      Sound: MockSoundConstructor,

      RecordingOptionsPresets: {
        LOW_QUALITY: { isMeteringEnabled: true, android: {}, ios: {} },
        HIGH_QUALITY: { isMeteringEnabled: true, android: {}, ios: {} }, // Match Test4 spreading requirements
      },
      AndroidOutputFormat: { MPEG_4: 2 },
      AndroidAudioEncoder: { AAC: 3 },
      IOSOutputFormat: { MPEG4AAC: "aac" },
      IOSAudioQuality: { MIN: 0, MAX: 127 },
    },
  };
});
// Correctly mock Vibration inside the react-native package wrapper
jest.mock("react-native", () => {
  const ReactNative = jest.requireActual("react-native");

  return {
    ...ReactNative,
    Vibration: {
      vibrate: jest.fn(),
      cancel: jest.fn(),
    },
  };
});

// Fix for Invariant Violation: 'DevMenu' could not be found
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => {
  const actualRegistry = jest.requireActual(
    "react-native/Libraries/TurboModule/TurboModuleRegistry",
  );
  return {
    ...actualRegistry,
    getEnforcing: (name: string) => {
      if (name === "DevMenu") {
        return {
          showAlert: jest.fn(),
          hideMenu: jest.fn(),
          showMenu: jest.fn(),
        };
      }
      return actualRegistry.getEnforcing(name);
    },
  };
});

// Unified TurboModule registry fallback mock
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => {
  const actualRegistry = jest.requireActual(
    "react-native/Libraries/TurboModule/TurboModuleRegistry",
  );
  return {
    ...actualRegistry,
    getEnforcing: (name: string) => {
      if (name === "DevMenu") {
        return {
          showAlert: jest.fn(),
          hideMenu: jest.fn(),
          showMenu: jest.fn(),
        };
      }
      if (name === "SettingsManager") {
        return {
          settings: {
            AppleLanguages: ["en"],
            AppleLocale: "en_US",
          },
          getConstants: () => ({
            settings: { AppleLanguages: ["en"], AppleLocale: "en_US" },
          }),
        };
      }
      return actualRegistry.getEnforcing(name);
    },
  };
});
