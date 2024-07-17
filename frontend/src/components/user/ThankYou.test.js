
import React from "react";
import { render, screen } from "@testing-library/react";
import ThankYou from "./ThankYou";

describe("ThankYou component", () => {
    test("renders account deletion confirmation text", () => {
        render(<ThankYou />);

        // Assert that the heading text and confirmation message are rendered
        expect(screen.getByText("Account Deleted")).toBeInTheDocument();
        expect(screen.getByText("Your account has been successfully deleted.")).toBeInTheDocument();
        expect(screen.getByText(/Thank you for using our services!/i)).toBeInTheDocument();
    });
});