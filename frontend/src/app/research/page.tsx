"use client";
import { useState, useEffect } from "react";
import { PaperGrid } from "../../components/research/PaperGrid";
import PaperFilter from "../../components/research/PaperFilter";
import {
  Paper,
  Keyword,
  MethodologyType,
  KeywordCategory,
} from "../../types/paper.types";

export default function ResearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [keywordCategories, setKeywordCategories] = useState<KeywordCategory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);

  // Load sample data
  useEffect(() => {
    // Categorized keywords
    const categorizedKeywords: KeywordCategory[] = [
      {
        id: "cat1",
        name: "Institutional & Policy",
        keywords: [
          { id: "k1", name: "Institution" },
          { id: "k2", name: "Incentives" },
          { id: "k3", name: "Organizing" },
          { id: "k4", name: "Policy making" },
          { id: "k5", name: "Standards" },
        ],
      },
      {
        id: "cat2",
        name: "Society & Economics",
        keywords: [{ id: "k6", name: "Access to Market" }],
      },
      {
        id: "cat3",
        name: "Health & Global Issues",
        keywords: [
          { id: "k7", name: "Covid" },
          { id: "k8", name: "Ethics" },
          { id: "k9", name: "Global South" },
        ],
      },
      {
        id: "cat4",
        name: "Economic Themes",
        keywords: [
          { id: "k10", name: "Economic growth" },
          { id: "k11", name: "Smallholder" },
          { id: "k12", name: "Social network" },
        ],
      },
      {
        id: "cat5",
        name: "Technology",
        keywords: [
          { id: "k13", name: "Technology" },
          { id: "k14", name: "Agrochemical" },
          { id: "k15", name: "Biotechnology" },
          { id: "k16", name: "Carbon sequestration" },
          { id: "k17", name: "Digitalization" },
          { id: "k18", name: "New Energy" },
          { id: "k19", name: "Power and mechanization" },
          { id: "k20", name: "Technology diffusion" },
        ],
      },
      {
        id: "cat6",
        name: "Agriculture",
        keywords: [
          { id: "k21", name: "Agriculture" },
          { id: "k22", name: "Agroecology" },
          { id: "k23", name: "Food quality" },
          { id: "k24", name: "Organic farming" },
          { id: "k25", name: "Productivity" },
        ],
      },
      {
        id: "cat7",
        name: "Business & Market",
        keywords: [
          { id: "k26", name: "Business" },
          { id: "k27", name: "Entrepreneurship" },
          { id: "k28", name: "Farmer behavior" },
          { id: "k29", name: "Finance" },
          { id: "k30", name: "Investment" },
          { id: "k31", name: "Marketing" },
          { id: "k32", name: "Supply Chain" },
        ],
      },
      {
        id: "cat8",
        name: "Environment",
        keywords: [
          { id: "k33", name: "Environment" }, // Fixed typo from "Envrionment"
          { id: "k34", name: "Carbon Emission" },
          { id: "k35", name: "Climate change adaptation" },
          { id: "k36", name: "Natural Resource Conservation" },
          { id: "k37", name: "Pollution" },
        ],
      },
      {
        id: "cat9",
        name: "Collaboration & Partnerships",
        keywords: [
          { id: "k38", name: "Cross regional cooperation" },
          { id: "k39", name: "Cross-sector partnership" },
        ],
      },
    ];

    // Flatten the keywords for use in papers
    const allKeywords = categorizedKeywords.flatMap(
      (category) => category.keywords
    );

    // Sample papers with realistic URLs and unique abstracts
    const samplePapers: Paper[] = Array(12)
      .fill(null)
      .map((_, idx) => {
        // Create more varied paper titles
        const titles = [
          "Impact of Urban Farming on Local Food Security",
          "Sustainable Agricultural Practices in Developing Nations",
          "Reducing Food Waste Through Community Programs",
          "Nutritional Analysis of Community Garden Produce",
          "Climate Change Effects on Regional Agriculture",
          "Technology Innovations in Sustainable Farming",
        ];

        // Create more varied abstracts/summaries
        const abstracts = [
          "This research examines how urban farming initiatives contribute to local food security and community resilience. The study presents data from 15 metropolitan areas and analyzes economic and social impacts.",
          "An analysis of sustainable farming practices across developing regions, demonstrating significant improvements in yield and environmental protection when implemented correctly.",
          "This paper presents findings from a 3-year study on community-based food waste reduction programs, showing up to 30% reduction in participating neighborhoods.",
          "Comparative nutritional analysis of produce from community gardens versus commercial farms, with significant findings on micronutrient content and environmental contaminants.",
          "A comprehensive study on the projected effects of climate change on agricultural yields across different regions, with adaptation recommendations.",
          "Review of recent technological innovations in sustainable agriculture, including smart irrigation, precision farming, and AI-based crop management systems.",
        ];

        // Domain names for realistic external links
        const domains = [
          "academic.edu",
          "researchgate.net",
          "sciencedirect.com",
          "nature.com/articles",
          "mdpi.com/journal",
          "journals.sustainability.org",
        ];

        // Create a more realistic URL for each paper
        const titleSlug = titles[idx % titles.length]
          .toLowerCase()
          .replace(/\s+/g, "-");
        const externalUrl = `https://www.${
          domains[idx % domains.length]
        }/paper/${titleSlug}-${1000 + idx}`;

        // Assign 3-5 random keywords from our large set to each paper
        const randomKeywordCount = 3 + Math.floor(Math.random() * 3); // 3-5 keywords
        const paperKeywords: Keyword[] = [];

        // Ensure we don't add duplicate keywords
        const selectedKeywordIds = new Set<string>();

        while (paperKeywords.length < randomKeywordCount) {
          const randomIndex = Math.floor(Math.random() * allKeywords.length);
          const keyword = allKeywords[randomIndex];

          if (!selectedKeywordIds.has(keyword.id)) {
            selectedKeywordIds.add(keyword.id);
            paperKeywords.push(keyword);
          }
        }

        return {
          id: `paper-${idx + 1}`,
          title: titles[idx % titles.length],
          abstract: abstracts[idx % abstracts.length],
          authors: [
            {
              id: `author-${idx}-1`,
              name: `Dr. ${
                [
                  "John Smith",
                  "Sarah Johnson",
                  "Michael Wong",
                  "Emily Chen",
                  "David Rodriguez",
                  "Rachel Kim",
                ][idx % 6]
              }`,
              affiliation: `${
                [
                  "University of Agriculture",
                  "Institute of Sustainable Research",
                  "Food Policy Center",
                  "Environmental Studies Department",
                  "Urban Planning Institute",
                ][idx % 5]
              }`,
            },
            {
              id: `author-${idx}-2`,
              name: `Prof. ${
                [
                  "Jane Doe",
                  "Robert Lee",
                  "Maria Garcia",
                  "Thomas Wilson",
                  "Lisa Brown",
                  "James Park",
                ][idx % 6]
              }`,
              affiliation: `${
                [
                  "Food Security Alliance",
                  "Climate Research Institute",
                  "Agricultural Technology Lab",
                  "Community Development Center",
                  "Nutrition Sciences Department",
                ][idx % 5]
              }`,
            },
          ],
          publicationDate: new Date(2020 + (idx % 4), idx % 12, 1),
          journal: `${
            [
              "Journal of Sustainable Agriculture",
              "Food Security Review",
              "Environmental Sustainability",
              "Urban Farming Quarterly",
              "Agricultural Science & Technology",
              "Nutrition and Food Research",
            ][idx % 6]
          }`,
          methodologyType: ["qualitative", "quantitative", "mixed"][
            idx % 3
          ] as MethodologyType,
          citationCount: 10 + idx * 15,
          citationTrend: ["increasing", "stable", "decreasing"][idx % 3] as
            | "increasing"
            | "stable"
            | "decreasing",
          keywords: paperKeywords,
          downloadUrl: externalUrl,
        };
      });

    setPapers(samplePapers);
    setKeywordCategories(categorizedKeywords);
    setIsLoading(false);
  }, []);

  const handleSavePaper = (paperId: string, isSaving: boolean) => {
    setSavedPaperIds((prev) =>
      isSaving ? [...prev, paperId] : prev.filter((id) => id !== paperId)
    );
  };

  const handleFilterChange = (filters: unknown) => {
    console.log("Filters applied:", filters);
    // In a real implementation, you would filter the papers based on these criteria
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero section with enhanced styling and decorative elements */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg border border-emerald-100 transition-all duration-300 hover:shadow-xl">
            {/* Enhanced decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/3 z-0 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3 z-0 animate-pulse" style={{ animationDuration: '4s' }}></div>
            
            {/* Decorative plant SVG */}
            <div className="absolute right-10 bottom-0 opacity-20 w-32 h-32 md:w-48 md:h-48 z-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-700">
                <path d="M15.75 1.5a.75.75 0 00-1.22-.53l-3.53 3a.75.75 0 00-.28.59v3.19l-3.88-3.56a.75.75 0 00-1.28.53v6.5a.75.75 0 001.28.53l3.88-3.56v3.19c0 .23.09.44.25.61l3.56 3.56a.75.75 0 001.22-.59v-13.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM5.22 4.72a.75.75 0 011.06 0l.72.72a.75.75 0 01-1.06 1.06l-.72-.72a.75.75 0 010-1.06zM5.22 19.28a.75.75 0 010-1.06l.72-.72a.75.75 0 111.06 1.06l-.72.72a.75.75 0 01-1.06 0zM18.78 4.72a.75.75 0 010 1.06l-.72.72a.75.75 0 11-1.06-1.06l.72-.72a.75.75 0 011.06 0zM18.78 19.28a.75.75 0 01-1.06 0l-.72-.72a.75.75 0 011.06-1.06l.72.72a.75.75 0 010 1.06z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 mb-4 animate-fadeIn">
                Agricultural Research Repository
              </h1>
              <p className="text-gray-700 max-w-3xl text-lg leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                Explore our comprehensive collection of research papers, case
                studies, and articles on sustainable agriculture practices,
                innovations, and impact assessments from around the world.
              </p>
              
              {/* Added search bar */}
              <div className="mt-6 relative max-w-xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <input 
                  type="text" 
                  placeholder="Search for research papers..." 
                  className="w-full px-4 py-3 pl-10 rounded-full border border-emerald-200 shadow-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content with enhanced styling */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with improved filter styling */}
          <div className="lg:w-1/4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5 sticky top-24 border border-emerald-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  Filter Research
                </h2>
              </div>
              <PaperFilter
                keywordCategories={keywordCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main content area with enhanced card styling */}
          <div className="lg:w-3/4">
            <div className="rounded-xl p-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-50 to-blue-50 p-5 rounded-lg shadow-md border border-emerald-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    Research Papers
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                    <span className="text-gray-600 text-sm font-medium">
                      {papers.length} papers found
                    </span>
                  </div>
                  <div className="relative group">
                    <button className="flex items-center bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-sm transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                      </svg>
                      <span>Sort</span>
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                      <div className="py-1">
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                          <span className="mr-2">Date (Newest)</span>
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                          <span className="mr-2">Date (Oldest)</span>
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                          <span className="mr-2">Most Cited</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors" title="Grid view">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition-colors" title="List view">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-100">
                <style jsx global>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  
                  .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                  }
                  
                  .animate-pulse {
                    animation: pulse 3s infinite;
                  }
                  
                  @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                  }
                  
                  .hover-card-rise {
                    transition: all 0.3s ease;
                  }
                  
                  .hover-card-rise:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                  }
                `}</style>
                <PaperGrid
                  papers={papers}
                  availableKeywords={keywordCategories.flatMap(
                    (cat) => cat.keywords
                  )}
                  isLoading={isLoading}
                  savedPaperIds={savedPaperIds}
                  onSavePaper={handleSavePaper}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
