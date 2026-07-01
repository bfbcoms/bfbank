import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CurrencyBadge, CurrencyFlag } from "@/components/CurrencyFlag";
import { NIUM_CURRENCIES } from "@/lib/currencies";

describe("<CurrencyBadge />", () => {
  it("renders a flag image and the uppercase code for every registry entry", () => {
    for (const c of NIUM_CURRENCIES) {
      const { container, getByText, unmount } = render(<CurrencyBadge code={c.code} />);
      const img = container.querySelector("img");
      expect(img, `img for ${c.code}`).not.toBeNull();
      expect(img!.getAttribute("src")).toContain(`/${c.country}.svg`);
      expect(getByText(c.code)).toBeInTheDocument();
      unmount();
    }
  });

  it("hides the code when showCode is false", () => {
    const { queryByText } = render(<CurrencyBadge code="USD" showCode={false} />);
    expect(queryByText("USD")).toBeNull();
  });

  it("returns null for an unknown currency", () => {
    const { container } = render(<CurrencyFlag code="ZZZ" />);
    expect(container.querySelector("img")).toBeNull();
  });
});
