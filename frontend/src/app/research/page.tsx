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
    // This function would apply filters to the papers
    console.log("Filters applied:", filters);
    // In a real implementation, you would filter the papers based on these criteria
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Research Papers</h1>
      <p className="text-gray-600 mb-8">
        Explore our collection of research papers on sustainable agriculture,
        food security, and related topics. Click on any paper title to access
        the full document at its original source.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PaperFilter
            keywordCategories={keywordCategories}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="lg:col-span-3">
          <PaperGrid
            papers={papers}
            availableKeywords={keywordCategories.flatMap((cat) => cat.keywords)}
            isLoading={isLoading}
            savedPaperIds={savedPaperIds}
            onSavePaper={handleSavePaper}
          />
        </div>
      </div>
    </div>
  );
}
