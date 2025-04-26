import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiResponse, mockApiErrorResponse } from "../utils/testUtils";
import { researchAPI } from "@/lib/api";

// Mock file reader
class MockFileReader {
  onload;
  readAsText(blob) {
    this.onload({ target: { result: blob } });
  }
}

// Mock bulk import component
const MockBulkImportComponent = () => {
  const [file, setFile] = React.useState(null);
  const [importType, setImportType] = React.useState("json");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState([]);
  const [importResult, setImportResult] = React.useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setValidationErrors([]);
    setSuccess(false);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("importType", importType);

      const result = await researchAPI.importPapers(formData);

      if (result.success) {
        setSuccess(true);
        setImportResult(result.data);
      } else {
        setError(result.message || "Import failed");
        if (result.error?.validationErrors) {
          setValidationErrors(result.error.validationErrors);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred during import");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Bulk Import Research Papers</h1>

      <div>
        <label htmlFor="import-type">Import Format</label>
        <select
          id="import-type"
          value={importType}
          onChange={(e) => setImportType(e.target.value)}
          data-testid="import-type"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="bibtex">BibTeX</option>
        </select>
      </div>

      <div>
        <label htmlFor="file-input">Select File</label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept={
            importType === "json"
              ? ".json"
              : importType === "csv"
              ? ".csv"
              : ".bib,.bibtex"
          }
          data-testid="file-input"
        />
      </div>

      <button
        onClick={handleImport}
        disabled={!file || loading}
        data-testid="import-button"
      >
        {loading ? "Importing..." : "Import Papers"}
      </button>

      {error && (
        <div data-testid="import-error" className="error">
          {error}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div data-testid="validation-errors">
          <h3>Validation Errors</h3>
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {success && (
        <div data-testid="import-success">
          <h3>Import Successful</h3>
          <p>Successfully imported {importResult?.imported} papers.</p>
          {importResult?.skipped > 0 && (
            <p>
              Skipped {importResult.skipped} papers due to errors or duplicates.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Mock the research API
jest.mock("@/lib/api", () => ({
  researchAPI: {
    importPapers: jest.fn(),
  },
}));

// Mock global FileReader
global.FileReader = MockFileReader;

describe("Bulk Import Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should import papers from JSON file successfully", async () => {
    // Mock successful import response
    (researchAPI.importPapers as jest.Mock).mockResolvedValue(
      mockApiResponse({
        imported: 10,
        skipped: 0,
        total: 10,
      })
    );

    render(<MockBulkImportComponent />);

    // Select JSON import type (default)

    // Upload file
    const file = new File(
      ['{"papers": [{"title": "Test Paper 1"}, {"title": "Test Paper 2"}]}'],
      "papers.json",
      { type: "application/json" }
    );

    const fileInput = screen.getByTestId("file-input");
    userEvent.upload(fileInput, file);

    // Click import button
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByTestId("import-success")).toHaveTextContent(
        "Successfully imported 10 papers"
      );
      expect(researchAPI.importPapers).toHaveBeenCalledTimes(1);
    });
  });

  test("should import papers from CSV file successfully", async () => {
    // Mock successful import response
    (researchAPI.importPapers as jest.Mock).mockResolvedValue(
      mockApiResponse({
        imported: 5,
        skipped: 2,
        total: 7,
      })
    );

    render(<MockBulkImportComponent />);

    // Select CSV import type
    await userEvent.selectOptions(screen.getByTestId("import-type"), "csv");

    // Upload file
    const csvContent = `title,abstract,journal,authors,publication_date
Test Paper 1,Abstract 1,Journal 1,"Author 1, Author 2",2023-01-01
Test Paper 2,Abstract 2,Journal 2,Author 3,2023-02-01`;

    const file = new File([csvContent], "papers.csv", { type: "text/csv" });
    const fileInput = screen.getByTestId("file-input");
    userEvent.upload(fileInput, file);

    // Click import button
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByTestId("import-success")).toHaveTextContent(
        "Successfully imported 5 papers"
      );
      expect(screen.getByTestId("import-success")).toHaveTextContent(
        "Skipped 2 papers"
      );
      expect(researchAPI.importPapers).toHaveBeenCalledTimes(1);
    });
  });

  test("should import papers from BibTeX file successfully", async () => {
    // Mock successful import response
    (researchAPI.importPapers as jest.Mock).mockResolvedValue(
      mockApiResponse({
        imported: 3,
        skipped: 0,
        total: 3,
      })
    );

    render(<MockBulkImportComponent />);

    // Select BibTeX import type
    await userEvent.selectOptions(screen.getByTestId("import-type"), "bibtex");

    // Upload file
    const bibtexContent = `
@article{smith2023sustainable,
  title={Sustainable Agriculture Practices},
  author={Smith, John and Doe, Jane},
  journal={Journal of Sustainability},
  volume={10},
  number={2},
  pages={123--145},
  year={2023},
  publisher={Example Publisher}
}`;

    const file = new File([bibtexContent], "papers.bib", {
      type: "application/x-bibtex",
    });
    const fileInput = screen.getByTestId("file-input");
    userEvent.upload(fileInput, file);

    // Click import button
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByTestId("import-success")).toHaveTextContent(
        "Successfully imported 3 papers"
      );
      expect(researchAPI.importPapers).toHaveBeenCalledTimes(1);
    });
  });

  test("should handle validation errors during import", async () => {
    // Mock validation error response
    (researchAPI.importPapers as jest.Mock).mockResolvedValue(
      mockApiErrorResponse("Import failed due to validation errors", {
        validationErrors: [
          'Row 2: Missing required field "title"',
          "Row 5: Invalid date format, expected YYYY-MM-DD",
          "Row 7: Author information is incomplete",
        ],
      })
    );

    render(<MockBulkImportComponent />);

    // Upload file
    const file = new File(["invalid data"], "papers.json", {
      type: "application/json",
    });
    const fileInput = screen.getByTestId("file-input");
    userEvent.upload(fileInput, file);

    // Click import button
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify error messages
    await waitFor(() => {
      expect(screen.getByTestId("import-error")).toHaveTextContent(
        "Import failed due to validation errors"
      );
      expect(screen.getByTestId("validation-errors")).toBeInTheDocument();
      expect(
        screen.getByText('Row 2: Missing required field "title"')
      ).toBeInTheDocument();
      expect(
        screen.getByText("Row 5: Invalid date format, expected YYYY-MM-DD")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Row 7: Author information is incomplete")
      ).toBeInTheDocument();
    });
  });

  test("should handle server errors during import", async () => {
    // Mock server error
    (researchAPI.importPapers as jest.Mock).mockRejectedValue(
      new Error("Internal Server Error")
    );

    render(<MockBulkImportComponent />);

    // Upload file
    const file = new File(["valid data"], "papers.json", {
      type: "application/json",
    });
    const fileInput = screen.getByTestId("file-input");
    userEvent.upload(fileInput, file);

    // Click import button
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByTestId("import-error")).toHaveTextContent(
        "An unexpected error occurred during import"
      );
    });
  });

  test("should prevent import if no file is selected", async () => {
    render(<MockBulkImportComponent />);

    // Try to import without selecting a file
    fireEvent.click(screen.getByTestId("import-button"));

    // Verify error message
    expect(screen.getByTestId("import-error")).toHaveTextContent(
      "Please select a file to import"
    );
    expect(researchAPI.importPapers).not.toHaveBeenCalled();
  });
});
