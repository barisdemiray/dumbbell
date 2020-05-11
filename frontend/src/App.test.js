import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import App from './App';

import * as PackageTools from './tools/package';

/**
 * Verifications of utility methods
 */
describe('Utility methods are functioning', () => {
  test('We can verify an NPM package name', () => {
    // Non-string values are handled correctly
    const result1 = PackageTools.isPackageNameValid({ iamnotstring: true });
    expect(result1.valid).toBe(false);

    // Strings with spaces are rejected
    const result2 = PackageTools.isPackageNameValid('i have spaces');
    expect(result2.valid).toBe(false);

    // Empty strings are rejected
    const result3 = PackageTools.isPackageNameValid('');
    expect(result3.valid).toBe(false);

    // Strings beginning with . or _ are rejected
    const result4 = PackageTools.isPackageNameValid('.ishouldnotstartwithdot');
    expect(result4.valid).toBe(false);
    const result5 = PackageTools.isPackageNameValid('.ishouldnotstartwithunderscore');
    expect(result5.valid).toBe(false);
  });
});

/**
 * Verifications of rendering of components
 */
describe('Basic tests of rendering', () => {
  test('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('Renders the search box', () => {
    const { container } = render(<App />);
    const element = container.querySelector('#SearchBox');
    expect(element).toBeInTheDocument();
  });

  test('Renders the magnifier icon', () => {
    const { container } = render(<App />);
    const element = container.querySelector('#SearchBoxIcon');
    expect(element).toBeInTheDocument();
  });

  test('Renders the result box', () => {
    const { container } = render(<App />);
    const element = container.querySelector('.ResultContainer');
    expect(element).toBeInTheDocument();
  });
});

/**
 * Verifications of submitting a query
 */
describe('Submitting a package query', () => {
  test('It is possible to enter a query', () => {
    const { container } = render(<App />);
    const element = container.querySelector('#SearchBox');
    fireEvent.change(element, { target: { value: 'react' } });
    expect(element.value).toBe('react');
  });

  test('Invalid package name shows an error', () => {
    const { container, getByText } = render(<App />);
    const element = container.querySelector('#SearchBox');
    fireEvent.change(element, { target: { value: '.react' } });
    expect(element.value).toBe('.react');

    // TODO Ideally these error message come from a common place where
    // production code and test code share the value.
    expect(getByText('Package names cannot start with a dot or an underscore')).toBeDefined();
  });

  test('Valid package name starts the process and displays a spinner', () => {
    const { container, getByText } = render(<App />);
    const element = container.querySelector('#SearchBox');
    // First set the value to a valid package name
    fireEvent.change(element, { target: { value: 'select' } });
    // Then fire an 'Enter' event
    fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });

    const elementLoadingFeedback = container.querySelector('.LoadingFeedback');
    expect(elementLoadingFeedback).toBeInTheDocument();
  });

  test('Valid package is queried and bundle info is shown', async () => {
    const { container, getByText } = render(<App />);
    const element = container.querySelector('#SearchBox');
    // First set the value to a valid package name
    fireEvent.change(element, { target: { value: 'select' } });
    // Then fire an 'Enter' event
    fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });

    // Wait for bundle info to appear for 10 seconds
    const _element = await waitForElement(() => getByText('Bundle size'), { timeout: 30000 });

    // Be sure we're showing last bundle's size info
    const elementOverallSize = container.querySelector('.OverallSizeContainer');
    expect(elementOverallSize).toBeInTheDocument();

    // Be sure we're showing historical data
    const elementHistoricalData = container.querySelector('.BarChartContainer');
    expect(elementHistoricalData).toBeInTheDocument();
  });
});
