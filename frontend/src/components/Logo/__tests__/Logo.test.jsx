import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from '../Logo';

describe('Logo Component', () => {
  const renderLogo = () => {
    return render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
  };

  it('should render logo link', () => {
    renderLogo();
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render SVG icon', () => {
    const { container } = renderLogo();
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct SVG icon reference', () => {
    const { container } = renderLogo();
    const use = container.querySelector('use');
    expect(use).toBeInTheDocument();
    expect(use.getAttribute('href')).toContain('#icon-logo');
  });
});