import '@testing-library/jest-dom';

vi.spyOn(global.console, 'warn').mockImplementation((message) => {
  throw new Error(message);
});
