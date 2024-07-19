import { render, screen } from "@testing-library/react";
import QuickTips from "./QuickTips";

test("renders QuickTips component with correct content", () => {
    render(<QuickTips />);

    // Check if the heading text is present
    expect(screen.getByText("A Few Things Worth Mentioning...")).toBeInTheDocument();

    // Check if the disclaimer section is present
    expect(screen.getByText("Disclaimer:")).toBeInTheDocument();

    // Check if the quick tips section is present
    expect(screen.getByText("Quick Tips:")).toBeInTheDocument();

    // Check if the other pro tips section is present
    expect(screen.getByText("Other Pro Tips:")).toBeInTheDocument();

});
