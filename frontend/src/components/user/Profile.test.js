
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "./Profile";
import { useAuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";

// Mock the useAuthContext hook
jest.mock("../../contexts/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

// Mock the MessageContext
const mockSetError = jest.fn();
const mockClearError = jest.fn();
const mockSetSuccess = jest.fn();
const mockClearSuccess = jest.fn();
const mockSetInfo = jest.fn();
const mockClearInfo = jest.fn();

const mockMessageContextValue = {
  setError: mockSetError,
  clearError: mockClearError,
  setSuccess: mockSetSuccess,
  clearSuccess: mockClearSuccess,
  setInfo: mockSetInfo,
  clearInfo: mockClearInfo,
};

const renderWithRouter = (ui) => {
  return render(
    <MessageContext.Provider value={mockMessageContextValue}>
      <BrowserRouter>{ui}</BrowserRouter>
    </MessageContext.Provider>
  );
};

describe("Profile Component", () => {
  const mockUpdateUser = jest.fn();
  const mockNavigate = jest.fn();
  const mockCurrentUser = {
    username: "testuser",
    email: "testuser@example.com",
  };

  beforeEach(() => {
    useAuthContext.mockReturnValue({
      currentUser: mockCurrentUser,
      updateUser: mockUpdateUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render Profile component with user details", () => {
    renderWithRouter(<Profile />);

    expect(screen.getByLabelText("Username")).toHaveValue(mockCurrentUser.username);
    expect(screen.getByLabelText("Email")).toHaveValue(mockCurrentUser.email);
  });

  test("should display error if passwords do not match", async () => {
    renderWithRouter(<Profile />);

    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "newpassword" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "differentpassword" } });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(["Passwords do not match"]);
    });
  });

  test("should call updateUser with changed email", async () => {
    mockUpdateUser.mockResolvedValue({ success: true });
    
    renderWithRouter(<Profile />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "newemail@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "" } });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(mockCurrentUser.username, {
        email: "newemail@example.com",
      });
      expect(mockSetSuccess).toHaveBeenCalledWith("Profile updated successfully");
    });
  });

  test("should display info message if no changes are made", async () => {
    renderWithRouter(<Profile />);

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockSetInfo).toHaveBeenCalledWith("No changes were made to the profile.");
    });
  });
});