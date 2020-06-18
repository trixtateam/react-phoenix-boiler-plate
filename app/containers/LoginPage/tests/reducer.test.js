import loginPageReducer, { initialState } from '../reducer';

describe('loginPageReducer', () => {
  it('returns the initial state', () => {
    expect(loginPageReducer(undefined, {})).toEqual(initialState);
  });
});
