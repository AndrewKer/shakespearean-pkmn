import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PkmnSprite from "./PkmnSprite";

describe("PkmnSprite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("returns null when name prop is not provided", () => {
    const { container } = renderWithQueryClient(<PkmnSprite />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when name prop is an empty string", () => {
    const { container } = renderWithQueryClient(<PkmnSprite name="" />);
    expect(container.firstChild).toBeNull();
  });

  it("returns empty fragment while loading", () => {
    renderWithQueryClient(<PkmnSprite name="pikachu" />);
    const img = screen.queryByAltText("pkmn sprite");
    expect(img).not.toBeInTheDocument();
  });

  it("returns empty fragment on error", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Network error"))));

    renderWithQueryClient(<PkmnSprite name="invalid-pokemon" />);

    await waitFor(() => {
      const img = screen.queryByAltText("pkmn sprite");
      expect(img).not.toBeInTheDocument();
    });
  });

  it("displays sprite image with correct src when data is loaded", async () => {
    const mockData = {
      sprites: {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/25.png",
      },
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnSprite name="pikachu" />);

    await waitFor(() => {
      const img = screen.getByAltText("pkmn sprite") as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(mockData.sprites.front_default);
    });
  });

  it("uses fallback image when front_default is null", async () => {
    const mockData = {
      sprites: {
        front_default: null,
      },
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnSprite name="unknown-pokemon" />);

    await waitFor(() => {
      const img = screen.getByAltText("pkmn sprite") as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain("react.svg");
    });
  });

  it("has correct width styling", async () => {
    const mockData = {
      sprites: {
        front_default: "https://example.com/sprite.png",
      },
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnSprite name="charizard" />);

    await waitFor(() => {
      const img = screen.getByAltText("pkmn sprite");
      expect(img).toHaveStyle({ width: "151px" });
    });
  });

  it("fetches from correct API endpoint", async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprites: { front_default: "url" } }),
      } as Response)
    );

    vi.stubGlobal("fetch", fetchSpy);

    renderWithQueryClient(<PkmnSprite name="bulbasaur" />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon-form/bulbasaur"
      );
    });
  });
});