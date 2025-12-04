import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PkmnDescription from "./PkmnDescription";

describe('PkmnDescription', () => {
  it('renders the name and description text', () => {
    render(<PkmnDescription />);
    expect(screen.getByText('PKMN NAME')).toBeInTheDocument();
    expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
  });

  it('renders the sprite image with correct alt and src', () => {
    render(<PkmnDescription />);
    const img = screen.getByAltText(/pkmn sprite/i) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/static/images/cards/live-from-space.jpg');
  });
});
