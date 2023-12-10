import '@testing-library/jest-dom';

jest.spyOn(global.console, 'warn').mockImplementation((message) => {
  throw new Error(message);
});
