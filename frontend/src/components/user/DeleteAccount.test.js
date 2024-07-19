
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import { useAuthContext } from "../../contexts/AuthContext";
import EventSpotterApi from "../../services/api";

jest.mock("../../contexts/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../services/api");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockSetCurrentUser = jest.fn();
const mockNavigate = jest.fn();

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>{ui}</BrowserRouter>
  );
};

describe("DeleteAccount Component", () => {
    const mockCurrentUser = {
        username: "testuser",
    };

    beforeEach(() => {
        useAuthContext.mockReturnValue({
            currentUser: mockCurrentUser,
            setCurrentUser: mockSetCurrentUser,
        });
        useNavigate.mockReturnValue(mockNavigate);
    });

    test("should render DeleteAccount component", () => {
        renderWithRouter(<DeleteAccount />);
        expect(screen.getByText("Delete Account")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete My Account" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
    });

    test("should call deleteUser API and navigate to thank-you page on successful delete", async () => {
        EventSpotterApi.deleteUser.mockResolvedValue({ success: true });

        renderWithRouter(<DeleteAccount />);
    
        fireEvent.click(screen.getByRole("button", { name: "Delete My Account" }));

        await waitFor(() => {
            expect(EventSpotterApi.deleteUser).toHaveBeenCalledWith(mockCurrentUser.username);
            expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
            expect(mockNavigate).toHaveBeenCalledWith("/thank-you");
        });
    });

    test("should display error message if delete fails", async () => {
        EventSpotterApi.deleteUser.mockRejectedValue(new Error("Failed to delete account"));

        renderWithRouter(<DeleteAccount />);
    
        fireEvent.click(screen.getByRole("button", { name: "Delete My Account" }));

        await waitFor(() => {
            expect(EventSpotterApi.deleteUser).toHaveBeenCalledWith(mockCurrentUser.username);
            expect(mockSetCurrentUser).not.toHaveBeenCalled();
        });
    });
});