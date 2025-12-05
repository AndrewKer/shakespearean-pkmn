import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PkmnDescription from "./PkmnDescription";

// Mock child components
vi.mock("./PkmnSprite", () => {
  return {
    default: ({ name }: { name?: string }) => (
      <div data-testid="pkmn-sprite">Sprite: {name}</div>
    ),
  };
});

vi.mock("./ShakespeareTranslator", () => {
  return {
    default: ({ text }: { text: string }) => (
      <div data-testid="shakespeare-translator">Translated: {text}</div>
    ),
  };
});


describe("PkmnDescription", () => {
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
    const { container } = renderWithQueryClient(<PkmnDescription />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when name prop is an empty string", () => {
    const { container } = renderWithQueryClient(
      <PkmnDescription name="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state while fetching data", () => {
    renderWithQueryClient(<PkmnDescription name="pikachu" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Network error"))));

    renderWithQueryClient(<PkmnDescription name="invalid-pokemon" />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it("displays pokemon name in uppercase when data is loaded", async () => {
    const mockData = {
      name: "pikachu",
      flavor_text_entries: [
        {
          flavor_text: "Electric mouse pokemon",
          language: { name: "en" },
        },
      ],
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnDescription name="pikachu" />);

    await waitFor(() => {
      expect(screen.getByText("PIKACHU")).toBeInTheDocument();
    });
  });

  it("renders PkmnSprite and ShakespeareTranslator components", async () => {
    const mockData = {
      name: "charizard",
      flavor_text_entries: [
        {
          flavor_text: "Fire breathing dragon",
          language: { name: "en" },
        },
      ],
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnDescription name="charizard" />);

    await waitFor(() => {
      expect(screen.getByTestId("pkmn-sprite")).toBeInTheDocument();
      expect(screen.getByTestId("shakespeare-translator")).toBeInTheDocument();
    });
  });

  it("replaces form feed characters with spaces in description", async () => {
    const mockData = {
      name: "bulbasaur",
      flavor_text_entries: [
        {
          flavor_text: "Grass seed\fpokemon",
          language: { name: "en" },
        },
      ],
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnDescription name="bulbasaur" />);

    await waitFor(() => {
      expect(screen.getByText(/Translated: Grass seed pokemon/)).toBeInTheDocument();
    });
  });

  it("displays default message when no english description is available", async () => {
    const mockData = {
      name: "mewtwo",
      flavor_text_entries: [
        {
          flavor_text: "Some japanese text",
          language: { name: "jp" },
        },
      ],
    };

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    ));

    renderWithQueryClient(<PkmnDescription name="mewtwo" />);

    await waitFor(() => {
      expect(screen.getByText(/Translated: No english description available/)).toBeInTheDocument();
    });
  });
});