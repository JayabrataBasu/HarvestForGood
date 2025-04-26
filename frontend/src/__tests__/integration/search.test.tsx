import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getTestPapers, mockApiResponse } from "../utils/testUtils";
import { researchAPI } from "@/lib/api";

// Mock search component
const MockSearchComponent = () => {
  const [query, setQuery] = React.useState("");
  const [searchType, setSearchType] = React.useState("all");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await researchAPI.searchPapers(query, searchType);
      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.message || "Search failed");
      }
    } catch (err) {
      setError("An error occurred while searching");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers..."
            data-testid="search-input"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            data-testid="search-type"
          >
            <option value="all">All Fields</option>
            <option value="title">Title</option>
            <option value="abstract">Abstract</option>
            <option value="author">Author</option>
            <option value="keyword">Keyword</option>
          </select>

          <button type="submit" data-testid="search-button">
            Search
          </button>
        </div>
      </form>

      {error && <div data-testid="search-error">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>Search Results</h2>
          <div data-testid="result-count">Found {results.length} papers</div>
          <ul>
            {results.map((paper) => (
              <li key={paper.id} data-testid="search-result-item">
                <h3>{paper.title}</h3>
                <p>{paper.abstract.substring(0, 100)}...</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Mock the research API
jest.mock("@/lib/api", () => ({
  researchAPI: {
    searchPapers: jest.fn(),
  },
}));

describe("Paper Search Integration Tests", () => {
  const testPapers = getTestPapers(50);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should search papers by title", async () => {
    const titleQuery = "sustainable";

    // Filter papers by title
    const titleMatchPapers = testPapers.filter((paper) =>
      paper.title.toLowerCase().includes(titleQuery.toLowerCase())
    );

    // Setup mock
    (researchAPI.searchPapers as jest.Mock).mockResolvedValue(
      mockApiResponse(titleMatchPapers)
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), titleQuery);

    // Select title search
    await userEvent.selectOptions(screen.getByTestId("search-type"), "title");

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId("result-count")).toHaveTextContent(
        `Found ${titleMatchPapers.length} papers`
      );
      expect(researchAPI.searchPapers).toHaveBeenCalledWith(
        titleQuery,
        "title"
      );
    });
  });

  test("should search papers by author name", async () => {
    const authorQuery = "Smith";

    // Filter papers by author
    const authorMatchPapers = testPapers.filter((paper) =>
      paper.authors.some((author) =>
        author.name.toLowerCase().includes(authorQuery.toLowerCase())
      )
    );

    // Setup mock
    (researchAPI.searchPapers as jest.Mock).mockResolvedValue(
      mockApiResponse(authorMatchPapers)
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), authorQuery);

    // Select author search
    await userEvent.selectOptions(screen.getByTestId("search-type"), "author");

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId("result-count")).toHaveTextContent(
        `Found ${authorMatchPapers.length} papers`
      );
      expect(researchAPI.searchPapers).toHaveBeenCalledWith(
        authorQuery,
        "author"
      );
    });
  });

  test("should search papers by keyword", async () => {
    const keywordQuery = "agriculture";

    // Filter papers by keyword
    const keywordMatchPapers = testPapers.filter((paper) =>
      paper.keywords.some((keyword) =>
        keyword.name.toLowerCase().includes(keywordQuery.toLowerCase())
      )
    );

    // Setup mock
    (researchAPI.searchPapers as jest.Mock).mockResolvedValue(
      mockApiResponse(keywordMatchPapers)
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), keywordQuery);

    // Select keyword search
    await userEvent.selectOptions(screen.getByTestId("search-type"), "keyword");

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId("result-count")).toHaveTextContent(
        `Found ${keywordMatchPapers.length} papers`
      );
      expect(researchAPI.searchPapers).toHaveBeenCalledWith(
        keywordQuery,
        "keyword"
      );
    });
  });

  test("should search papers by abstract content", async () => {
    const abstractQuery = "climate";

    // Filter papers by abstract
    const abstractMatchPapers = testPapers.filter((paper) =>
      paper.abstract.toLowerCase().includes(abstractQuery.toLowerCase())
    );

    // Setup mock
    (researchAPI.searchPapers as jest.Mock).mockResolvedValue(
      mockApiResponse(abstractMatchPapers)
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), abstractQuery);

    // Select abstract search
    await userEvent.selectOptions(
      screen.getByTestId("search-type"),
      "abstract"
    );

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId("result-count")).toHaveTextContent(
        `Found ${abstractMatchPapers.length} papers`
      );
      expect(researchAPI.searchPapers).toHaveBeenCalledWith(
        abstractQuery,
        "abstract"
      );
    });
  });

  test("should search across all fields", async () => {
    const allFieldsQuery = "sustainable";

    // Filter papers by all fields
    const allFieldsMatchPapers = testPapers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(allFieldsQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(allFieldsQuery.toLowerCase()) ||
        paper.authors.some((author) =>
          author.name.toLowerCase().includes(allFieldsQuery.toLowerCase())
        ) ||
        paper.keywords.some((keyword) =>
          keyword.name.toLowerCase().includes(allFieldsQuery.toLowerCase())
        )
    );

    // Setup mock
    (researchAPI.searchPapers as jest.Mock).mockResolvedValue(
      mockApiResponse(allFieldsMatchPapers)
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), allFieldsQuery);

    // Keep "all" search type (default)

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify results
    await waitFor(() => {
      expect(screen.getByTestId("result-count")).toHaveTextContent(
        `Found ${allFieldsMatchPapers.length} papers`
      );
      expect(researchAPI.searchPapers).toHaveBeenCalledWith(
        allFieldsQuery,
        "all"
      );
    });
  });

  test("should handle search errors gracefully", async () => {
    // Setup mock to return error
    (researchAPI.searchPapers as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    render(<MockSearchComponent />);

    // Enter search query
    await userEvent.type(screen.getByTestId("search-input"), "test query");

    // Click search button
    fireEvent.click(screen.getByTestId("search-button"));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByTestId("search-error")).toHaveTextContent(
        "An error occurred while searching"
      );
    });
  });
});
