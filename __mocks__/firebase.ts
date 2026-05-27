// __mocks__/firebase.ts

export const auth = {
  currentUser: {
    uid: "test-user",
    email: "test@email.com",
  },
};

export const addDebugDoc = jest.fn();

export const login = jest.fn(() => Promise.resolve({ user: auth.currentUser }));

export const createAccount = jest.fn(() =>
  Promise.resolve({ user: auth.currentUser }),
);

export const logout = jest.fn(() => Promise.resolve());

export const removeUser = jest.fn(() => Promise.resolve());

export const saveScore = jest.fn(() => Promise.resolve());

export const getLeaderboardDocs = jest.fn();
