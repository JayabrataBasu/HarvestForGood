import { ResearchPapersPage } from "../pages/ResearchPapers";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Harvest For Good</h1>
        <p className="text-gray-600">Academic Research Repository</p>
      </header>
      
      <ResearchPapersPage />
    </div>
  );
}
