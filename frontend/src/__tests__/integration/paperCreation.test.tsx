import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaperForm from "@/components/research/PaperForm";
import { researchAPI } from "@/lib/api";
import {
  createPaperFormData,
  mockApiResponse,
  mockApiErrorResponse,
} from "../utils/testUtils";

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
  },
}));

describe("Paper Creation Integration Tests", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default API responses
    (researchAPI.fetchKeywords as jest.Mock).mockResolvedValue(
      mockApiResponse([
        { id: "kw1", name: "Organic Farming" },
        { id: "kw2", name: "Food Security" },
        { id: "kw3", name: "Climate Change" },
        { id: "kw4", name: "Water Management" },
        { id: "kw5", name: "Sustainable Agriculture" },
      ])
    );

    (researchAPI.fetchKeywordCategories as jest.Mock).mockResolvedValue(
      mockApiResponse([
        {
          id: "cat1",
          name: "Sustainable Methods",
          keywords: [
            { id: "kw1", name: "Organic Farming" },
            { id: "kw5", name: "Sustainable Agriculture" },
          ],
        },
        {
          id: "cat2",
          name: "Environment",
          keywords: [
            { id: "kw3", name: "Climate Change" },
            { id: "kw4", name: "Water Management" },
          ],
        },
      ])
    );

    (researchAPI.fetchAuthors as jest.Mock).mockResolvedValue(
      mockApiResponse([
        {
          id: "auth1",
          name: "Jane Smith",
          affiliation: "University of Agriculture",
        },
        {
          id: "auth2",
          name: "John Doe",
          affiliation: "Climate Research Institute",
        },
      ])
    );

    (researchAPI.createPaper as jest.Mock).mockResolvedValue(
      mockApiResponse({ id: "new-paper-1", title: "Test Paper" })
    );
  });

  test("should create a paper with multiple authors and keywords successfully", async () => {
    render(<PaperForm />);

    // Fill in basic information
    await userEvent.type(
      screen.getByLabelText(/title/i),
      "Test Integration Paper"
    );
    await userEvent.type(
      screen.getByLabelText(/abstract/i),
      "This is a test paper abstract for integration testing."
    );
    await userEvent.type(
      screen.getByLabelText(/journal/i),
      "Journal of Integration Testing"
    );
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-15"
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/methodology type/i),
      "quantitative"
    );
    await userEvent.type(screen.getByLabelText(/citation count/i), "25");
    await userEvent.selectOptions(
      screen.getByLabelText(/citation trend/i),
      "increasing"
    );

    // Fill first author
    await userEvent.type(
      screen.getByLabelText(/author 1.*name/i),
      "Jane Smith"
    );
    await userEvent.type(
      screen.getAllByLabelText(/affiliation/i)[0],
      "University of Testing"
    );

    // Add second author
    fireEvent.click(screen.getByText("Add Author"));
    await userEvent.type(screen.getByLabelText(/author 2.*name/i), "John Doe");
    await userEvent.type(
      screen.getAllByLabelText(/affiliation/i)[1],
      "Research Institute"
    );

    // Select keywords
    // Assuming the keywords are already loaded and displayed
    const organicFarmingBtn = await screen.findByText("Organic Farming");
    const climateChangeBtn = await screen.findByText("Climate Change");

    fireEvent.click(organicFarmingBtn);
    fireEvent.click(climateChangeBtn);

    // Add a custom keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Integration Testing"
    );
    fireEvent.click(screen.getByText("Add"));

    // Fill additional details
    await userEvent.type(
      screen.getByLabelText(/doi/i),
      "10.1234/integration.test"
    );
    await userEvent.type(
      screen.getByLabelText(/download url/i),
      "https://example.com/integration-test.pdf"
    );
    await userEvent.type(screen.getByLabelText(/volume/i), "5");
    await userEvent.type(screen.getByLabelText(/issue/i), "2");
    await userEvent.type(screen.getByLabelText(/pages/i), "100-120");

    // Submit the form
    fireEvent.click(screen.getByText("Save Paper"));

    // Check if the API was called with the right data
    await waitFor(() => {
      expect(researchAPI.createPaper).toHaveBeenCalledTimes(1);

      // Verify the form data sent to the API
      const formData = (researchAPI.createPaper as jest.Mock).mock.calls[0][0];
      expect(formData.title).toBe("Test Integration Paper");
      expect(formData.authors.length).toBe(2);
      expect(formData.authors[0].name).toBe("Jane Smith");
      expect(formData.authors[1].name).toBe("John Doe");
      expect(formData.keywords.length).toBe(3);
      expect(formData.keywords.some((k) => k.name === "Organic Farming")).toBe(
        true
      );
      expect(formData.keywords.some((k) => k.name === "Climate Change")).toBe(
        true
      );
      expect(
        formData.keywords.some((k) => k.name === "Integration Testing")
      ).toBe(true);
      expect(formData.methodology_type).toBe("quantitative");
      expect(formData.citation_trend).toBe("increasing");
      expect(formData.doi).toBe("10.1234/integration.test");
    });
  });

  test("should show validation errors when form is incomplete", async () => {
    render(<PaperForm />);

    // Submit with minimal data (missing required fields)
    await userEvent.type(screen.getByLabelText(/title/i), "Test Paper");
    // Leave other required fields empty

    // Submit the form
    fireEvent.click(screen.getByText("Save Paper"));

    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/abstract is required/i)).toBeInTheDocument();
      expect(screen.getByText(/journal name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/publication date is required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/at least one keyword is required/i)
      ).toBeInTheDocument();
    });

    // API should not be called
    expect(researchAPI.createPaper).not.toHaveBeenCalled();
  });

  test("should handle API errors during paper creation", async () => {
    // Mock API to return an error
    (researchAPI.createPaper as jest.Mock).mockResolvedValue(
      mockApiErrorResponse("Failed to create paper", {
        title: ["Paper with this title already exists"],
        abstract: ["Abstract is too short, minimum 100 characters required"],
      })
    );

    render(<PaperForm />);

    // Fill in minimal required data
    await userEvent.type(
      screen.getByLabelText(/title/i),
      "Duplicate Paper Title"
    );
    await userEvent.type(screen.getByLabelText(/abstract/i), "Short abstract");
    await userEvent.type(screen.getByLabelText(/journal/i), "Test Journal");
    await userEvent.type(
      screen.getByLabelText(/publication date/i),
      "2023-01-15"
    );

    // Add a keyword
    await userEvent.type(
      screen.getByLabelText(/search or add keywords/i),
      "Test Keyword"
    );
    fireEvent.click(screen.getByText("Add"));

    // Submit the form
    fireEvent.click(screen.getByText("Save Paper"));

    // Verify API was called
    await waitFor(() => {
      expect(researchAPI.createPaper).toHaveBeenCalledTimes(1);
    });

    // Check error messages are displayed
    await waitFor(() => {
      expect(
        screen.getByText(/paper with this title already exists/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/abstract is too short/i)).toBeInTheDocument();
    });
  });

  test("should populate and update existing paper data in edit mode", async () => {
    // Prepare initial paper data
    const initialPaper = {
      id: "paper-123",
      slug: "existing-paper",
      title: "Existing Paper Title",
      abstract: "This is an existing paper abstract.",
      publicationDate: "2022-05-10T00:00:00.000Z",
      authors: [
        {
          id: "auth1",
          name: "Existing Author",
          affiliation: "Existing University",
          email: "author@example.com",
          country: "USA",
        },
      ],
      journal: "Existing Journal",
      keywords: [{ id: "kw1", name: "Existing Keyword" }],
      methodologyType: "qualitative" as const,
      citationCount: 15,
      citationTrend: "stable" as const,
      doi: "10.1234/existing",
      downloadUrl: "https://example.com/existing.pdf",
      volume: "3",
      issue: "4",
      pages: "45-60",
      createdAt: "2022-05-10T00:00:00.000Z",
      updatedAt: "2022-05-10T00:00:00.000Z",
    };

    // Mock update API
    (researchAPI.updatePaper as jest.Mock).mockResolvedValue(
      mockApiResponse({ ...initialPaper, title: "Updated Paper Title" })
    );

    render(<PaperForm initialData={initialPaper} isEditMode={true} />);

    // Check that form is populated with initial data
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue(
        "Existing Paper Title"
      );
      expect(screen.getByLabelText(/abstract/i)).toHaveValue(
        "This is an existing paper abstract."
      );
      expect(screen.getByLabelText(/publication date/i)).toHaveValue(
        "2022-05-10"
      );
      expect(screen.getByLabelText(/methodology type/i)).toHaveValue(
        "qualitative"
      );
    });

    // Update the title
    await userEvent.clear(screen.getByLabelText(/title/i));
    await userEvent.type(
      screen.getByLabelText(/title/i),
      "Updated Paper Title"
    );

    // Submit the form
    fireEvent.click(screen.getByText("Update Paper"));

    // Verify API was called with updated data
    await waitFor(() => {
      expect(researchAPI.updatePaper).toHaveBeenCalledTimes(1);
      const [slug, formData] = (researchAPI.updatePaper as jest.Mock).mock
        .calls[0];
      expect(slug).toBe("existing-paper");
      expect(formData.title).toBe("Updated Paper Title");
    });
  });
});
