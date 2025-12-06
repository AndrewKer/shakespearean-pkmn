import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as favouritesHook from "../hooks/useFavourites";
import { FavContext } from "../App";
import FavouritePkmn from "./FavouritePkmn";

const sampleFavourites = [
  {
    name: "Pikachu",
    description: "Electric mouse",
    shakespeareanDescription: "Electric mouse, I prithee",
    spriteUrl: "https://example.com/pikachu.png",
  },
  {
    name: "Bulbasaur",
    description: "Seed Pokemon",
    shakespeareanDescription: "A seed'd beast",
    spriteUrl: "https://example.com/bulbasaur.png",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FavouritePkmn", () => {
  it("shows loading state when hook reports isLoading", () => {
    vi.spyOn(favouritesHook, "useFavourites").mockReturnValue({
      favourites: [],
      addFavourite: vi.fn(),
      removeFavourite: vi.fn(),
      clearAll: vi.fn(),
      isLoading: true,
    } as any);

    render(
      <FavContext.Provider value={{ favourites: [], setFavourites: vi.fn() }}>
        <FavouritePkmn />
      </FavContext.Provider>
    );

    expect(screen.getByText("Loading favourites...")).toBeInTheDocument();
  });

  it("shows empty message when there are no favourites", () => {
    vi.spyOn(favouritesHook, "useFavourites").mockReturnValue({
      favourites: [],
      addFavourite: vi.fn(),
      removeFavourite: vi.fn(),
      clearAll: vi.fn(),
      isLoading: false,
    } as any);

    render(
      <FavContext.Provider value={{ favourites: [], setFavourites: vi.fn() }}>
        <FavouritePkmn />
      </FavContext.Provider>
    );

    expect(screen.getByText("No favourite pokemons yet")).toBeInTheDocument();
  });

  it("renders list of favourites, shows avatars and calls remove/clear handlers", async () => {
    const removeSpy = vi.fn();
    const clearSpy = vi.fn();

    vi.spyOn(favouritesHook, "useFavourites").mockReturnValue({
      favourites: sampleFavourites,
      addFavourite: vi.fn(),
      removeFavourite: removeSpy,
      clearAll: clearSpy,
      isLoading: false,
    } as any);

    render(
      <FavContext.Provider value={{ favourites: sampleFavourites, setFavourites: vi.fn() }}>
        <FavouritePkmn />
      </FavContext.Provider>
    );

    // list present
    const list = screen.getByTestId("favourites-list");
    expect(list).toBeInTheDocument();

    // items & names
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    // avatars rendered with correct src/alt
    const pikachuImg = screen.getByAltText("Pikachu") as HTMLImageElement;
    expect(pikachuImg).toBeInTheDocument();
    expect(pikachuImg.src).toBe("https://example.com/pikachu.png");

    // remove buttons present and clickable
    const removeBtn0 = screen.getByTestId("favourite-remove-0");
    const removeBtn1 = screen.getByTestId("favourite-remove-1");
    const user = userEvent.setup();
    await user.click(removeBtn0);
    expect(removeSpy).toHaveBeenCalledWith("Pikachu");

    await user.click(removeBtn1);
    expect(removeSpy).toHaveBeenCalledWith("Bulbasaur");

    // clear button works
    const clearBtn = screen.getByTestId("favourite-clear-button");
    await user.click(clearBtn);
    expect(clearSpy).toHaveBeenCalled();
  });
});