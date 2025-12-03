import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PkmnNameInput from "./PkmnNameInput";

describe("PkmnNameInput", () => {
  it("renders the input field", () => {
    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("updates input value when user types", async () => {
    const user = userEvent.setup();
    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Pikachu");
    expect(input).toHaveValue("Pikachu");
  });

  it("shows alert when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Charizard");
    await user.keyboard("{Enter}");

    expect(alertSpy).toHaveBeenCalledWith("Charizard");
    alertSpy.mockRestore();
  });

  it("does not trigger alert on other keys", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<PkmnNameInput />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Venusaur");
    await user.keyboard("{Shift}");

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
