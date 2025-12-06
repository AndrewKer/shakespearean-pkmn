import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PkmnNameInput from "./PkmnNameInput";

// Mock PkmnDescription to avoid network/react-query and to expose the received prop type/value
vi.mock("./PkmnDescription", () => {
  return {
    default: ({ name }: { name?: string }) => {
      const React = require("react");
      return React.createElement("div", {
        "data-testid": "pkmn-description",
        "data-name-type": typeof name,
        "data-name-value": name ?? "",
      });
    },
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("PkmnNameInput", () => {
  it("renders the input field with the test id", () => {
    render(<PkmnNameInput />);
    const input = screen.getByTestId("pkmn-name-input");
    expect(input).toBeInTheDocument();
  });

  it("updates the input value when the user types", async () => {
    const user = userEvent.setup();
    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Pikachu");
    expect(input).toHaveValue("Pikachu");
  });

  it("does not show PkmnDescription before Enter is pressed, then shows it with the typed name and ensures the prop is a string", async () => {
    const user = userEvent.setup();
    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Charizard");
    expect(screen.queryByTestId("pkmn-description")).toBeNull();

    await user.keyboard("{Enter}");
    const desc = await screen.findByTestId("pkmn-description");
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveAttribute("data-name-value", "Charizard");
    expect(desc).toHaveAttribute("data-name-type", "string");
  });

  it("nothing is shown when Enter is pressed with no input", async () => {
    const user = userEvent.setup();
    render(<PkmnNameInput />);

    await user.keyboard("{Enter}");
    expect(screen.queryByTestId("pkmn-description")).toBeNull();
  });

  it("hides PkmnDescription when the input value changes after showing result", async () => {
    const user = userEvent.setup();
    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Bulbasaur");
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("pkmn-description")).toHaveAttribute(
      "data-name-value",
      "Bulbasaur"
    );

    // change the input -> description should be hidden
    await user.type(input, "a");
    expect(screen.queryByTestId("pkmn-description")).toBeNull();
  });
});
