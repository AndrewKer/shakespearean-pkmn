import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShakespeareTranslator from "./ShakespeareTranslator";

describe("ShakespeareTranslator", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("shows translating state while fetching translation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );

    renderWithQueryClient(<ShakespeareTranslator text="Hello world" />);

    await waitFor(() => {
      expect(screen.getByText("Translating...")).toBeInTheDocument();
    });
  });

  it("displays translated text when translation succeeds", async () => {
    const mockResponse = {
      contents: {
        translated: "Hark! A greeting to thee, world",
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      )
    );

    renderWithQueryClient(<ShakespeareTranslator text="Hello world" />);

    await waitFor(() => {
      expect(
        screen.getByText("Hark! A greeting to thee, world")
      ).toBeInTheDocument();
    });
  });

  it("displays error message when translation fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        } as Response)
      )
    );

    renderWithQueryClient(<ShakespeareTranslator text="Test text" />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it("displays original text when translation fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        } as Response)
      )
    );

    const originalText = "Electric mouse pokemon";

    renderWithQueryClient(<ShakespeareTranslator text={originalText} />);

    await waitFor(() => {
      expect(screen.getByText(originalText)).toBeInTheDocument();
    });
  });

  it("does not call mutation when text is empty or whitespace", async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: { translated: "Test" } }),
      } as Response)
    );

    vi.stubGlobal("fetch", fetchSpy);

    renderWithQueryClient(<ShakespeareTranslator text="   " />);

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  it("calls translation API with correct endpoint and body", async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ contents: { translated: "Translated" } }),
      } as Response)
    );

    vi.stubGlobal("fetch", fetchSpy);

    renderWithQueryClient(
      <ShakespeareTranslator text="Fire breathing dragon" />
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.funtranslations.com/translate/shakespeare.json",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "text=Fire%20breathing%20dragon",
        })
      );
    });
  });

  it("re-translates when text prop changes", async () => {
    const mockResponse = {
      contents: {
        translated: "First translation",
      },
    };

    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    vi.stubGlobal("fetch", fetchSpy);

    const { rerender } = renderWithQueryClient(
      <ShakespeareTranslator text="First text" />
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    mockResponse.contents.translated = "Second translation";

    rerender(
      <QueryClientProvider client={queryClient}>
        <ShakespeareTranslator text="Second text" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });
});
