import '@testing-library/jest-dom';

let localStorageStore: Record<string, string> = {};

const localStorageMock: Storage = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    localStorageStore = {};
  },
  key: (index: number) => Object.keys(localStorageStore)[index] ?? null,
  get length() {
    return Object.keys(localStorageStore).length;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});