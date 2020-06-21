import React from 'react';
import { render } from '@testing-library/react';

import A from '../index';

const href = 'http://mxstbr.com/';
const children = <h1>Test</h1>;
const renderComponent = (props = {}) => {
  const utils = render(
    <A href={href} {...props}>
      {children}
    </A>,
  );
  const link = utils.container.querySelector('a');
  return { ...utils, link };
};

describe('<A />', () => {
  test('should render an <a> tag', () => {
    const { link } = renderComponent();
    expect(link).toBeInTheDocument();
  });

  test('should have an href attribute', () => {
    const { link } = renderComponent();
    expect(link).toHaveAttribute('href', href);
  });

  test('should have children', () => {
    const { link } = renderComponent();
    expect(link.children).toHaveLength(1);
  });

  test('should have a class attribute', () => {
    const className = 'test';
    const { link } = renderComponent({ className });
    expect(link).toHaveClass(className);
  });

  test('should adopt a target attribute', () => {
    const target = '_blank';
    const { link } = renderComponent({ target });
    expect(link).toHaveAttribute('target', target);
  });

  test('should adopt a type attribute', () => {
    const type = 'text/html';
    const { link } = renderComponent({ type });
    expect(link).toHaveAttribute('type', type);
  });
});
