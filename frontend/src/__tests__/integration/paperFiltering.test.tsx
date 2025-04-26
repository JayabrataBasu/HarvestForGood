import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getTestPapers, mockApiResponse } from "../utils/testUtils";
import { researchAPI } from "@/lib/api";

// Mock components for testing
const MockPaperFilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    keywords: [],
    authors: [],
    dateRange: { from: "", to: "" },
    methodologyTypes: [],
    citationRange: { min: "", max: "" },
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleKeywordChange = (e, keyword) => {
    const isChecked = e.target.checked;
    let updatedKeywords = [...filters.keywords];

    if (isChecked) {
      updatedKeywords.push(keyword);
    } else {
      updatedKeywords = updatedKeywords.filter((k) => k !== keyword);
    }

    handleFilterChange("keywords", updatedKeywords);
  };

  const handleAuthorChange = (e, author) => {
    const isChecked = e.target.checked;
    let updatedAuthors = [...filters.authors];

    if (isChecked) {
      updatedAuthors.push(author);
    } else {
      updatedAuthors = updatedAuthors.filter((a) => a !== author);
    }

    handleFilterChange("authors", updatedAuthors);
  };

  const handleMethodologyChange = (e, type) => {
    const isChecked = e.target.checked;
    let updatedTypes = [...filters.methodologyTypes];

    if (isChecked) {
      updatedTypes.push(type);
    } else {
      updatedTypes = updatedTypes.filter((t) => t !== type);
    }

    handleFilterChange("methodologyTypes", updatedTypes);
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...filters.dateRange, [field]: value };
    handleFilterChange("dateRange", newDateRange);
  };

  const handleCitationChange = (field, value) => {
    const newCitationRange = { ...filters.citationRange, [field]: value };
    handleFilterChange("citationRange", newCitationRange);
  };

  return (
    <div>
      <h2>Filter Papers</h2>

      <div>
        <h3>Keywords</h3>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleKeywordChange(e, "Organic Farming")}
            />
            Organic Farming
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleKeywordChange(e, "Climate Change")}
            />
            Climate Change
          </label>
        </div>
      </div>

      <div>
        <h3>Authors</h3>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleAuthorChange(e, "John Smith")}
            />
            John Smith
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleAuthorChange(e, "Maria Garcia")}
            />
            Maria Garcia
          </label>
        </div>
      </div>

      <div>
        <h3>Methodology</h3>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleMethodologyChange(e, "qualitative")}
            />
            Qualitative
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleMethodologyChange(e, "quantitative")}
            />
            Quantitative
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleMethodologyChange(e, "mixed")}
            />
            Mixed Methods
          </label>
        </div>
      </div>

      <div>
        <h3>Publication Date</h3>
        <div>
          <label>
            From:
            <input
              type="date"
              onChange={(e) => handleDateChange("from", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            To:
            <input
              type="date"
              onChange={(e) => handleDateChange("to", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div>
        <h3>Citation Count</h3>
        <div>
          <label>
            Min:
            <input
              type="number"
              onChange={(e) => handleCitationChange("min", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Max:
            <input
              type="number"
              onChange={(e) => handleCitationChange("max", e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const MockPaperListingComponent = ({ papers }) => (
  <div>
    <h2>Research Papers</h2>
    <div data-testid="paper-count">Found {papers.length} papers</div>
    <ul>
      {papers.map((paper) => (
        <li key={paper.id}>
          <h3>{paper.title}</h3>
          <p>{paper.abstract.substring(0, 100)}...</p>
          <p>Authors: {paper.authors.map((a) => a.name).join(", ")}</p>
          <p>
            Published: {new Date(paper.publicationDate).toLocaleDateString()}
          </p>
          <p>Keywords: {paper.keywords.map((k) => k.name).join(", ")}</p>
        </li>
      ))}
    </ul>
  </div>
);

// The parent component that combines filter and listing
const MockPaperExplorerComponent = () => {
  const [papers, setPapers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [appliedFilters, setAppliedFilters] = React.useState(null);

  // Initial load
  React.useEffect(() => {
    const loadPapers = async () => {
      try {
        const result = await researchAPI.fetchPapers();
        if (result.success) {
          setPapers(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPapers();
  }, []);

  // Apply filters
  const handleFilterChange = async (filters) => {
    setLoading(true);
    setAppliedFilters(filters);

    try {
      const result = await researchAPI.fetchPapers(filters);
      if (result.success) {
        setPapers(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MockPaperFilterComponent onFilterChange={handleFilterChange} />
      <MockPaperListingComponent papers={papers} />
    </div>
  );
};

// Mock the research API
jest.mock("@/lib/api", () => ({
  researchAPI: {
    fetchPapers: jest.fn(),
  },
}));

describe("Paper Filtering Integration Tests", () => {
  const testPapers = getTestPapers(50);

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial API response with all papers
    (researchAPI.fetchPapers as jest.Mock).mockResolvedValueOnce(
      mockApiResponse(testPapers)
    );
  });

  test("should filter papers by keywords", async () => {
    // Prepare filtered papers
    const organicFarmingPapers = testPapers.filter((paper) =>
      paper.keywords.some((k) => k.name === "Organic Farming")
    );

    // Setup API mock for keyword filter
    (researchAPI.fetchPapers as jest.Mock).mockImplementation((filters) => {
      if (filters?.keywords?.includes("Organic Farming")) {
        return Promise.resolve(mockApiResponse(organicFarmingPapers));
      }
      return Promise.resolve(mockApiResponse(testPapers));
    });

    render(<MockPaperExplorerComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${testPapers.length} papers`
      );
    });

    // Apply keyword filter
    const organicFarmingCheckbox = screen.getByLabelText("Organic Farming");
    fireEvent.click(organicFarmingCheckbox);

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${organicFarmingPapers.length} papers`
      );
    });

    // Verify API was called with correct filters
    expect(researchAPI.fetchPapers).toHaveBeenCalledWith(
      expect.objectContaining({
        keywords: ["Organic Farming"],
      })
    );
  });

  test("should filter papers by methodology type", async () => {
    // Prepare filtered papers
    const qualitativePapers = testPapers.filter(
      (paper) => paper.methodologyType === "qualitative"
    );

    // Setup API mock for methodology filter
    (researchAPI.fetchPapers as jest.Mock).mockImplementation((filters) => {
      if (filters?.methodologyTypes?.includes("qualitative")) {
        return Promise.resolve(mockApiResponse(qualitativePapers));
      }
      return Promise.resolve(mockApiResponse(testPapers));
    });

    render(<MockPaperExplorerComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${testPapers.length} papers`
      );
    });

    // Apply methodology filter
    const qualitativeCheckbox = screen.getByLabelText("Qualitative");
    fireEvent.click(qualitativeCheckbox);

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${qualitativePapers.length} papers`
      );
    });

    // Verify API was called with correct filters
    expect(researchAPI.fetchPapers).toHaveBeenCalledWith(
      expect.objectContaining({
        methodologyTypes: ["qualitative"],
      })
    );
  });

  test("should filter papers by date range", async () => {
    // Date for filtering
    const fromDate = "2020-01-01";
    const toDate = "2022-12-31";

    // Prepare filtered papers
    const dateFilteredPapers = testPapers.filter((paper) => {
      const pubDate = new Date(paper.publicationDate);
      return pubDate >= new Date(fromDate) && pubDate <= new Date(toDate);
    });

    // Setup API mock for date filter
    (researchAPI.fetchPapers as jest.Mock).mockImplementation((filters) => {
      if (
        filters?.dateRange?.from === fromDate &&
        filters?.dateRange?.to === toDate
      ) {
        return Promise.resolve(mockApiResponse(dateFilteredPapers));
      }
      return Promise.resolve(mockApiResponse(testPapers));
    });

    render(<MockPaperExplorerComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${testPapers.length} papers`
      );
    });

    // Apply date filters
    const fromDateInput = screen.getByLabelText("From:");
    const toDateInput = screen.getByLabelText("To:");

    fireEvent.change(fromDateInput, { target: { value: fromDate } });
    fireEvent.change(toDateInput, { target: { value: toDate } });

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${dateFilteredPapers.length} papers`
      );
    });

    // Verify API was called with correct filters
    expect(researchAPI.fetchPapers).toHaveBeenCalledWith(
      expect.objectContaining({
        dateRange: {
          from: fromDate,
          to: toDate,
        },
      })
    );
  });

  test("should filter papers by citation count range", async () => {
    // Citation range for filtering
    const minCitations = 10;
    const maxCitations = 50;

    // Prepare filtered papers
    const citationFilteredPapers = testPapers.filter(
      (paper) =>
        paper.citationCount >= minCitations &&
        paper.citationCount <= maxCitations
    );

    // Setup API mock for citation filter
    (researchAPI.fetchPapers as jest.Mock).mockImplementation((filters) => {
      if (
        parseInt(filters?.citationRange?.min) === minCitations &&
        parseInt(filters?.citationRange?.max) === maxCitations
      ) {
        return Promise.resolve(mockApiResponse(citationFilteredPapers));
      }
      return Promise.resolve(mockApiResponse(testPapers));
    });

    render(<MockPaperExplorerComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${testPapers.length} papers`
      );
    });

    // Apply citation filters
    const minCitationInput = screen.getByLabelText("Min:");
    const maxCitationInput = screen.getByLabelText("Max:");

    fireEvent.change(minCitationInput, {
      target: { value: minCitations.toString() },
    });
    fireEvent.change(maxCitationInput, {
      target: { value: maxCitations.toString() },
    });

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${citationFilteredPapers.length} papers`
      );
    });

    // Verify API was called with correct filters
    expect(researchAPI.fetchPapers).toHaveBeenCalledWith(
      expect.objectContaining({
        citationRange: {
          min: minCitations.toString(),
          max: maxCitations.toString(),
        },
      })
    );
  });

  test("should combine multiple filter criteria", async () => {
    // Prepare complex filter
    const combinedFilters = {
      keywords: ["Climate Change"],
      methodologyTypes: ["mixed"],
      dateRange: { from: "2018-01-01", to: "2023-12-31" },
      citationRange: { min: "5", max: "100" },
    };

    // Filtered papers based on combined criteria
    const filteredPapers = testPapers.filter((paper) => {
      const hasKeyword = paper.keywords.some(
        (k) => k.name === "Climate Change"
      );
      const hasMethodology = paper.methodologyType === "mixed";
      const pubDate = new Date(paper.publicationDate);
      const dateInRange =
        pubDate >= new Date("2018-01-01") && pubDate <= new Date("2023-12-31");
      const citationInRange =
        paper.citationCount >= 5 && paper.citationCount <= 100;

      return hasKeyword && hasMethodology && dateInRange && citationInRange;
    });

    // Setup API mock for combined filters
    (researchAPI.fetchPapers as jest.Mock).mockImplementation((filters) => {
      if (
        filters?.keywords?.includes("Climate Change") &&
        filters?.methodologyTypes?.includes("mixed") &&
        filters?.dateRange?.from === "2018-01-01" &&
        filters?.dateRange?.to === "2023-12-31" &&
        filters?.citationRange?.min === "5" &&
        filters?.citationRange?.max === "100"
      ) {
        return Promise.resolve(mockApiResponse(filteredPapers));
      }
      return Promise.resolve(mockApiResponse(testPapers));
    });

    render(<MockPaperExplorerComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${testPapers.length} papers`
      );
    });

    // Apply all filters
    fireEvent.click(screen.getByLabelText("Climate Change"));
    fireEvent.click(screen.getByLabelText("Mixed Methods"));
    fireEvent.change(screen.getByLabelText("From:"), {
      target: { value: "2018-01-01" },
    });
    fireEvent.change(screen.getByLabelText("To:"), {
      target: { value: "2023-12-31" },
    });
    fireEvent.change(screen.getByLabelText("Min:"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Max:"), {
      target: { value: "100" },
    });

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByTestId("paper-count")).toHaveTextContent(
        `Found ${filteredPapers.length} papers`
      );
    });
  });
});
