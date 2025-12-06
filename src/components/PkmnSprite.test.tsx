import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import PkmnSprite from "./PkmnSprite";

describe("PkmnSprite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when sprite prop is not provided", () => {
    const { container } = render(<PkmnSprite />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when sprite prop is an empty string", () => {
    const { container } = render(<PkmnSprite sprite="" />);
    expect(container.firstChild).toBeNull();
  });

  it("displays sprite image with correct src when sprite prop is provided", () => {
    const spriteUrl =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/25.png";

    render(<PkmnSprite sprite={spriteUrl} />);

    const img = screen.getByAltText("pkmn sprite") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(spriteUrl);
  });

  it("has correct width and height styling", () => {
    const spriteUrl = "https://example.com/sprite.png";

    render(<PkmnSprite sprite={spriteUrl} />);

    const img = screen.getByAltText("pkmn sprite");
    expect(img).toHaveStyle({ width: "151px", height: "151px" });
  });

  it("renders CardMedia component with correct alt text", () => {
    const spriteUrl = "https://example.com/sprite.png";

    render(<PkmnSprite sprite={spriteUrl} />);

    const img = screen.getByAltText("pkmn sprite");
    expect(img).toBeInTheDocument();
  });

  it("handles whitespace-only sprite prop as falsy", () => {
    const { container } = render(<PkmnSprite sprite="   " />);
    expect(container.firstChild).toBeNull();
  });
});
