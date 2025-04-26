import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiErrorResponse } from "../utils/testUtils";
import { researchAPI } from "@/lib/api";
import PaperForm from "@/components/research/PaperForm";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock the research API
jest.mock("@/lib/api", () => ({
  researchAPI: {
    createPaper: jest.fn(),
    updatePaper: jest.fn(),
    fetchKeywords: jest.fn(),
    fetchKeywordCategories: jest.fn(),
    fetchAuthors: jest.fn(),
    fetchPapers: jest.fn(),
    deletePaper: jest.fn(),
  },
}));

describe("API Error Handling Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default API responses for loading form dependencies
    (researchAPI.fetchKeywords as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        { id: "kw1", name: "Test Keyword 1" },
        { id: "kw2", name: "Test Keyword 2" },
      ],
    });

    (researchAPI.fetchKeywordCategories as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    (researchAPI.fetchAuthors as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });
  });

  test("should handle form validation errors", async () => {
    render(<PaperForm />);

    // Submit with incomplete data
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify client-side validation errors
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/abstract is required/i)).toBeInTheDocument();
      expect(screen.getByText(/journal name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/publication date is required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/at least one keyword is required/i)
      ).toBeInTheDocument();
    });

    // Verify API was not called
    expect(researchAPI.createPaper).not.toHaveBeenCalled();
  });

  test("should handle invalid URL format errors", async () => {
    render(<PaperForm />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    await userEvent.type(screen.getByLabelText(/abstract/i), "Test abstract");
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Enter invalid URL
    await userEvent.type(screen.getByLabelText(/download url/i), "invalid-url");

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });

    // Verify API was not called
    expect(researchAPI.createPaper).not.toHaveBeenCalled();
  });

  test("should handle invalid DOI format errors", async () => {
    render(<PaperForm />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    await userEvent.type(screen.getByLabelText(/abstract/i), "Test abstract");
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Enter invalid DOI
    await userEvent.type(screen.getByLabelText(/doi/i), "invalid-doi");

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid doi/i)).toBeInTheDocument();
    });

    // Verify API was not called
    expect(researchAPI.createPaper).not.toHaveBeenCalled();
  });

  test("should handle server-side validation errors", async () => {
    // Setup API to return validation errors
    (researchAPI.createPaper as jest.Mock).mockResolvedValue(
      mockApiErrorResponse("Validation failed", {
        title: ["A paper with this title already exists"],
        abstract: ["Abstract is too short (minimum 100 characters)"],
        authors: ["At least one author must have an affiliation"],
      })
    );

    render(<PaperForm />);

    // Fill in form data
    await userEvent.type(screen.getByLabelText(/title/i), "Duplicate Paper");
    await userEvent.type(screen.getByLabelText(/abstract/i), "Short abstract");
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add author
    await userEvent.type(
      screen.getByLabelText(/author 1.*name/i),
      "Test Author"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify API was called
    await waitFor(() => {
      expect(researchAPI.createPaper).toHaveBeenCalledTimes(1);
    });

    // Verify server validation errors are displayed
    await waitFor(() => {
      expect(
        screen.getByText(/a paper with this title already exists/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/abstract is too short/i)).toBeInTheDocument();
      expect(
        screen.getByText(/at least one author must have an affiliation/i)
      ).toBeInTheDocument();
    });
  });

  test("should handle network errors during form submission", async () => {
    // Mock a network error
    (researchAPI.createPaper as jest.Mock).mockRejectedValue(
      new Error("Network Error")
    );

    render(<PaperForm />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    await userEvent.type(
      screen.getByLabelText(/abstract/i),
      "Test abstract for network error test"
    );
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify API was called
    await waitFor(() => {
      expect(researchAPI.createPaper).toHaveBeenCalledTimes(1);
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });

  test("should handle API error response with generic message", async () => {
    // Mock an API error with a generic message
    (researchAPI.createPaper as jest.Mock).mockResolvedValue({
      success: false,
      message: "Server error: Unable to process request at this time",
    });

    render(<PaperForm />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    await userEvent.type(
      screen.getByLabelText(/abstract/i),
      "Test abstract for API error test"
    );
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          /server error: unable to process request at this time/i
        )
      ).toBeInTheDocument();
    });
  });

  test("should handle error in loading keywords", async () => {
    // Mock API error for fetching keywords
    (researchAPI.fetchKeywords as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch keywords")
    );

    render(<PaperForm />);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to load keywords/i)).toBeInTheDocument();
    });
  });

  test("should handle negative citation count validation", async () => {
    render(<PaperForm />);

    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    await userEvent.type(screen.getByLabelText(/abstract/i), "Test abstract");
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-01"
    );

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Enter negative citation count
    await userEvent.clear(screen.getByLabelText(/citation count/i));
    await userEvent.type(screen.getByLabelText(/citation count/i), "-5");

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify validation error
    await waitFor(() => {
      expect(
        screen.getByText(/citation count cannot be negative/i)
      ).toBeInTheDocument();
    });

    // Verify API was not called
    expect(researchAPI.createPaper).not.toHaveBeenCalled();
  });

  test("should display specific field errors in the correct locations", async () => {
    // Mock API to return field-specific errors
    (researchAPI.createPaper as jest.Mock).mockResolvedValue(
      mockApiErrorResponse("Multiple validation errors", {
        title: ["Title must be between 5 and 200 characters"],
        abstract: ["Abstract cannot contain special characters like [<>]"],
        journal: ["Journal name is not recognized"],
        publication_date: ["Publication date cannot be in the future"],
        doi: ["This DOI is already registered in the system"],
      })
    );

    render(<PaperForm />);

    // Fill form with minimum data
    await userEvent.type(screen.getByLabelText(/title/i), "Test");
    await userEvent.type(
      screen.getByLabelText(/abstract/i),
      "Test abstract with <special> characters"
    );
    await userEvent.type(screen.getByLabelText(/journal/i), "Unknown Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2030-01-01"
    );
    await userEvent.type(screen.getByLabelText(/doi/i), "10.1234/duplicate");

    // Add keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Submit form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify field-specific errors are displayed in the correct locations
    await waitFor(() => {
      // Title error
      expect(
        screen.getByText(/title must be between 5 and 200 characters/i)
      ).toBeInTheDocument();
      const titleInput = screen.getByLabelText(/title/i);
      expect(
        titleInput.parentElement?.querySelector(".text-red-600")
      ).toHaveTextContent(/title must be between 5 and 200 characters/i);

      // Abstract error
      expect(
        screen.getByText(/abstract cannot contain special characters/i)
      ).toBeInTheDocument();
      const abstractInput = screen.getByLabelText(/abstract/i);
      expect(
        abstractInput.parentElement?.querySelector(".text-red-600")
      ).toHaveTextContent(/abstract cannot contain special characters/i);

      // Journal error
      expect(
        screen.getByText(/journal name is not recognized/i)
      ).toBeInTheDocument();

      // Publication date error
      expect(
        screen.getByText(/publication date cannot be in the future/i)
      ).toBeInTheDocument();

      // DOI error
      expect(
        screen.getByText(/this doi is already registered in the system/i)
      ).toBeInTheDocument();
    });
  });

  test("should clear field errors when fixing the field value", async () => {
    render(<PaperForm />);

    // Submit empty form to trigger validation errors
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify errors are shown
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    // Fix the title field
    await userEvent.type(screen.getByLabelText(/title/i), "Fixed Title");

    // Check that the error is cleared for title
    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });

    // But other errors should still be present
    expect(screen.getByText(/abstract is required/i)).toBeInTheDocument();
    expect(screen.getByText(/journal name is required/i)).toBeInTheDocument();
  });
});
