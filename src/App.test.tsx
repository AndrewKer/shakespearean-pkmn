import React, { useContext } from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock children so App can be tested in isolation
vi.mock("./components/PkmnNameInput", () => {
  const React = require("react");
  return {
    default: () => React.createElement("div", { "data-testid": "pkmn-name-input-mock" }),
  };
});
vi.mock("./components/FavouritePkmn", () => {
  const React = require("react");
  return {
    default: () => React.createElement("div", { "data-testid": "favourite-pkmn-mock" }),
  };
});

import App, { FavContext } from "./App";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("renders child components (PkmnNameInput and FavouritePkmn)", () => {
    render(<App />);
    expect(screen.getByTestId("pkmn-name-input-mock")).toBeInTheDocument();
    expect(screen.getByTestId("favourite-pkmn-mock")).toBeInTheDocument();
  });

  it("provides FavContext default value to consumers when no Provider is used", () => {
    function TestConsumer() {
      const ctx = useContext(FavContext);
      return (
        <div>
          <div data-testid="favourites-length">{Array.isArray(ctx.favourites) ? ctx.favourites.length : "no"}</div>
          <div data-testid="set-is-fn">{typeof ctx.setFavourites === "function" ? "fn" : "nope"}</div>
        </div>
      );
    }

    render(<TestConsumer />);

    expect(screen.getByTestId("favourites-length")).toHaveTextContent("0");
    expect(screen.getByTestId("set-is-fn")).toHaveTextContent("fn");
  });
});