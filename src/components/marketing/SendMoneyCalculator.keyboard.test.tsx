import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrencySelect } from "./SendMoneyCalculator";
import { SEND_CURRENCY_CODES, RECEIVE_CURRENCY_CODES } from "@/lib/currencies";

function renderPicker(options: readonly string[], initial = options[0]) {
  const onChange = vi.fn();
  const utils = render(
    <CurrencySelect
      value={initial}
      onChange={onChange}
      options={options}
      ariaLabel="Test currency"
    />,
  );
  return { onChange, ...utils };
}

async function openPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /test currency/i }));
  const input = await waitFor(() =>
    screen.getByPlaceholderText(/search currency or country/i),
  );
  return input as HTMLInputElement;
}

describe("CurrencySelect keyboard flow", () => {
  it("opens on click and shows every option", async () => {
    const user = userEvent.setup();
    renderPicker(SEND_CURRENCY_CODES);
    await openPicker(user);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(SEND_CURRENCY_CODES.length);
    const text = options.map((o) => o.textContent ?? "").join("|");
    for (const code of SEND_CURRENCY_CODES) {
      expect(text).toContain(code);
    }
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderPicker(SEND_CURRENCY_CODES);
    const input = await openPicker(user);
    await act(async () => {
      await user.type(input, "{Escape}");
    });
    await waitFor(() =>
      expect(screen.queryByPlaceholderText(/search currency or country/i)).not.toBeInTheDocument(),
    );
  });

  it("navigates with ArrowDown and selects with Enter", async () => {
    const user = userEvent.setup();
    const { onChange } = renderPicker(SEND_CURRENCY_CODES, SEND_CURRENCY_CODES[0]);
    const input = await openPicker(user);
    await user.type(input, "{ArrowDown}{Enter}");
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const picked = onChange.mock.calls[0][0] as string;
    expect(SEND_CURRENCY_CODES).toContain(picked);
  });

  it("filters by code and Enter selects the highlighted match for every currency", async () => {
    // Cover the full Nium set: type each code, press Enter, verify onChange fires with it.
    for (const code of RECEIVE_CURRENCY_CODES) {
      const user = userEvent.setup();
      const { onChange, unmount } = renderPicker(RECEIVE_CURRENCY_CODES, "USD");
      const input = await openPicker(user);
      await user.type(input, code);
      // cmdk auto-highlights the first (and here only) match; Enter selects it.
      await user.type(input, "{Enter}");
      await waitFor(() => expect(onChange).toHaveBeenCalledWith(code));
      unmount();
    }
  }, 30_000);

  it("filters by country name and selects with Enter", async () => {
    const user = userEvent.setup();
    const { onChange } = renderPicker(RECEIVE_CURRENCY_CODES, "USD");
    const input = await openPicker(user);
    // "Japan" should uniquely match JPY.
    await user.type(input, "japan{Enter}");
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("JPY"));
  });
});
