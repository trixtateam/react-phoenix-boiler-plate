import { makeSelectLocation } from 'containers/App/selectors';

describe('makeSelectLocation', () => {
  const locationStateSelector = makeSelectLocation();
  it('should select the location', () => {
    const mockedState = {
      router: { location: { pathname: '/foo' } },
    };
    expect(locationStateSelector(mockedState)).toEqual(
      mockedState.router.location,
    );
  });
});
