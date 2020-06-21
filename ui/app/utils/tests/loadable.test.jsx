import React from 'react';
import { render } from '@testing-library/react';
import loadable from 'utils/loadable';

const LoadingIndicator = () => <div>Loading</div>;

const LazyComponent = loadable(() => import('./loadable.index'));
const LazyComponentWithEmptyOptions = loadable(
  () => import('./loadable.index'),
  {},
);

const LazyComponentWithFallback = loadable(() => import('./loadable.index'), {
  fallback: <LoadingIndicator />,
});

describe('loadable', () => {
  test('should render null by default', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponent />);
    expect(firstChild).toMatchSnapshot();
  });

  test('should render null by default with empty options', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponentWithEmptyOptions />);
    expect(firstChild).toMatchSnapshot();
  });

  test('should render fallback if given one', () => {
    const {
      container: { firstChild },
    } = render(<LazyComponentWithFallback />);
    expect(firstChild).toMatchSnapshot();
  });

  test('should render LazyComponent after waiting for it to load', async () => {
    const {
      container: { firstChild },
    } = render(<LazyComponent />);
    await LazyComponent;
    expect(firstChild).toMatchSnapshot();
  });
});
