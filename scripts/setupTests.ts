import '@testing-library/jest-dom';

jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());
