import React, { useState } from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FavContext } from "../App";
import { PkmnFavourite, useFavourites } from "./useFavourites";

const STORAGE_KEY = "favourite-pokemons";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("useFavourites (integration via context)", () => {
  const sample: PkmnFavourite = {
    name: "Pikachu",
    description: "Electric mouse",
    shakespeareanDescription: "Electric mouse, I prithee",
    spriteUrl: "https://example.com/pikachu.png",
  };

  function renderWithProvider(initialFavourites: PkmnFavourite[] = []) {
    function Wrapper() {
      const [favourites, setFavourites] =
        useState<PkmnFavourite[]>(initialFavourites);
      return (
        <FavContext.Provider value={{ favourites, setFavourites }}>
          <TestConsumer />
        </FavContext.Provider>
      );
    }

    function TestConsumer() {
      const { favourites, addFavourite, removeFavourite, clearAll, isLoading } =
        useFavourites();

      return (
        <div>
          <div data-testid="is-loading">{String(isLoading)}</div>
          <div data-testid="favourites">{JSON.stringify(favourites)}</div>

          <button
            data-testid="add"
            onClick={() =>
              addFavourite({
                ...sample,
              })
            }
          >
            add
          </button>

          <button
            data-testid="add-duplicate"
            onClick={() => addFavourite(sample)}
          >
            add-duplicate
          </button>

          <button
            data-testid="remove"
            onClick={() => removeFavourite("Pikachu")}
          >
            remove
          </button>

          <button data-testid="clear" onClick={() => clearAll()}>
            clear
          </button>
        </div>
      );
    }

    return render(<Wrapper />);
  }

  it("loads favourites from localStorage on mount", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sample]));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId("is-loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("favourites").textContent).toContain("Pikachu");
  });

  it("addFavourite adds item and persists to localStorage", async () => {
    renderWithProvider();

    const user = userEvent.setup();
    await user.click(screen.getByTestId("add"));

    await waitFor(() => {
      expect(screen.getByTestId("favourites").textContent).toContain("Pikachu");
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0].name).toBe("Pikachu");
  });

  it("does not add duplicates", async () => {
    renderWithProvider();

    const user = userEvent.setup();
    await user.click(screen.getByTestId("add"));
    await user.click(screen.getByTestId("add-duplicate"));

    await waitFor(() => {
      const favs = JSON.parse(
        screen.getByTestId("favourites").textContent || "[]"
      );
      expect(favs.filter((f: any) => f.name === "Pikachu").length).toBe(1);
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored.filter((f: any) => f.name === "Pikachu").length).toBe(1);
  });

  it("removeFavourite removes item and updates localStorage", async () => {
    renderWithProvider([sample]);

    await waitFor(() => {
      expect(screen.getByTestId("favourites").textContent).toContain("Pikachu");
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove"));

    await waitFor(() => {
      expect(screen.getByTestId("favourites").textContent).not.toContain(
        "Pikachu"
      );
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored.find((f: any) => f.name === "Pikachu")).toBeUndefined();
  });

  it("clearAll empties favourites and persists", async () => {
    renderWithProvider([sample]);

    await waitFor(() => {
      expect(screen.getByTestId("favourites").textContent).toContain("Pikachu");
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId("clear"));

    await waitFor(() => {
      expect(screen.getByTestId("favourites").textContent).toBe("[]");
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(Array.isArray(stored) && stored.length).toBe(0);
  });
});
