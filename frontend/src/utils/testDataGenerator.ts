import { 
  ResearchPaper, 
  Author, 
  Keyword, 
  KeywordCategory, 
  MethodologyType, 
  CitationTrend 
} from "@/types/paper.types";
import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

// Sample university affiliations
const universities = [
  { name: "Stanford University", country: "USA" },
  { name: "MIT", country: "USA" },
  { name: "Harvard University", country: "USA" },
  { name: "University of California, Berkeley", country: "USA" },
  { name: "University of Cambridge", country: "UK" },
  { name: "University of Oxford", country: "UK" },
  { name: "ETH Zurich", country: "Switzerland" },
  { name: "Tsinghua University", country: "China" },
  { name: "University of Tokyo", country: "Japan" },
  { name: "National University of Singapore", country: "Singapore" },
  { name: "Indian Institute of Technology, Delhi", country: "India" },
  { name: "University of Cape Town", country: "South Africa" },
  { name: "University of São Paulo", country: "Brazil" },
  { name: "University of Melbourne", country: "Australia" },
];

// Sample author first and last names
const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Wei", "Li", "Rajesh", "Priya", "Mohammed",
  "Fatima", "Juan", "Maria", "Hiroshi", "Yuki", "Oluwaseun", "Amara"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
  "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
  "Walker", "Hall", "Allen", "Young", "Wang", "Liu", "Singh", "Patel", "Kim", "Suzuki",
  "Okafor", "Mensah", "Santos", "Gonzalez"
];

// Sample journals
const journals = [
  "Agricultural Systems",
  "Journal of Sustainable Agriculture",
  "Food Policy",
  "Nature Sustainability",
  "Sustainability Science",
  "Journal of Cleaner Production",
  "Agriculture, Ecosystems & Environment",
  "Food Security",
  "Renewable Agriculture and Food Systems",
  "Global Food Security",
  "Agroecology and Sustainable Food Systems",
  "Journal of Rural Studies",
  "Environmental Science & Technology",
  "Ecological Economics",
  "Journal of Environmental Management",
];

// Keyword categories with associated keywords
const keywordCategories: KeywordCategory[] = [
  {
    id: "1",
    name: "Sustainable Farming Methods",
    keywords: [
      { id: "101", name: "Organic Farming" },
      { id: "102", name: "Agroforestry" },
      { id: "103", name: "Permaculture" },
      { id: "104", name: "Conservation Agriculture" },
      { id: "105", name: "Regenerative Agriculture" },
      { id: "106", name: "No-Till Farming" },
      { id: "107", name: "Crop Rotation" },
      { id: "108", name: "Cover Crops" },
    ],
  },
  {
    id: "2",
    name: "Food Security",
    keywords: [
      { id: "201", name: "Food Access" },
      { id: "202", name: "Food Availability" },
      { id: "203", name: "Food Utilization" },
      { id: "204", name: "Food Stability" },
      { id: "205", name: "Food Sovereignty" },
      { id: "206", name: "Hunger Reduction" },
      { id: "207", name: "Malnutrition" },
      { id: "208", name: "Food Waste" },
    ],
  },
  {
    id: "3",
    name: "Climate Change",
    keywords: [
      { id: "301", name: "Carbon Sequestration" },
      { id: "302", name: "Greenhouse Gas Emissions" },
      { id: "303", name: "Climate Resilience" },
      { id: "304", name: "Climate Adaptation" },
      { id: "305", name: "Climate Mitigation" },
      { id: "306", name: "Drought Resistance" },
      { id: "307", name: "Extreme Weather Events" },
    ],
  },
  {
    id: "4",
    name: "Water Management",
    keywords: [
      { id: "401", name: "Irrigation Efficiency" },
      { id: "402", name: "Water Conservation" },
      { id: "403", name: "Rainwater Harvesting" },
      { id: "404", name: "Groundwater Management" },
      { id: "405", name: "Water Quality" },
      { id: "406", name: "Drought Management" },
      { id: "407", name: "Water Rights" },
    ],
  },
  {
    id: "5",
    name: "Social Impact",
    keywords: [
      { id: "501", name: "Farmer Livelihoods" },
      { id: "502", name: "Rural Development" },
      { id: "503", name: "Gender Equality" },
      { id: "504", name: "Fair Trade" },
      { id: "505", name: "Indigenous Knowledge" },
      { id: "506", name: "Community Resilience" },
      { id: "507", name: "Land Rights" },
    ],
  },
  {
    id: "6",
    name: "Technology",
    keywords: [
      { id: "601", name: "Precision Agriculture" },
      { id: "602", name: "Remote Sensing" },
      { id: "603", name: "IoT in Agriculture" },
      { id: "604", name: "AI in Agriculture" },
      { id: "605", name: "Mobile Technologies" },
      { id: "606", name: "Blockchain in Supply Chain" },
      { id: "607", name: "Farm Management Software" },
    ],
  },
];

// Paper title templates
const titleTemplates = [
  "Sustainable [Method] for [Crop] Production in [Region]: A [Methodology] Study",
  "Effects of [Practice] on [Outcome] in Smallholder Farming Systems",
  "Improving [Aspect] through [Approach]: Case Studies from [Region]",
  "Analysis of [Factor] Impact on [System] Sustainability in [Context]",
  "[Technology] Applications for Enhancing [Goal] in Agricultural Systems",
  "Comparative Study of [Method1] and [Method2] for [Purpose]",
  "The Role of [Factor] in [Process]: Implications for [Stakeholder]",
  "Assessing [Metric] Changes After Implementation of [Practice]",
  "[Resource] Management Strategies for [Challenge] Mitigation",
  "Long-term Effects of [Practice] on [Ecosystem] Health and [Outcome]"
];

// Title components for substitution
const titleComponents = {
  Method: ["Agroecological", "Regenerative", "Organic", "Conservation", "Precision", "Climate-Smart"],
  Crop: ["Rice", "Maize", "Wheat", "Vegetable", "Coffee", "Cacao", "Multi-crop"],
  Region: ["Sub-Saharan Africa", "Southeast Asia", "Latin America", "Mediterranean", "Arid Regions", "Tropical Zones"],
  Methodology: ["Longitudinal", "Comparative", "Mixed-Methods", "Participatory", "Quantitative", "Qualitative"],
  Practice: ["Intercropping", "Water Conservation", "Soil Management", "Agroforestry", "Organic Fertilization", "Integrated Pest Management"],
  Outcome: ["Yield", "Soil Health", "Biodiversity", "Water Use Efficiency", "Carbon Sequestration", "Farmer Income"],
  Aspect: ["Food Security", "Resilience", "Productivity", "Resource Efficiency", "Ecosystem Services", "Rural Livelihoods"],
  Approach: ["Farmer Field Schools", "Technology Integration", "Indigenous Knowledge", "Policy Reform", "Market Access", "Cooperative Models"],
  Factor: ["Climate Variability", "Policy", "Market Access", "Knowledge Transfer", "Social Capital", "Gender Dynamics"],
  System: ["Agroecosystem", "Food System", "Farming System", "Value Chain", "Market System", "Social-Ecological System"],
  Context: ["Smallholder Settings", "Post-Conflict Regions", "Climate Change", "Economic Transition", "Urban Peripheries"],
  Technology: ["Remote Sensing", "Mobile Apps", "IoT Systems", "Blockchain", "Artificial Intelligence", "GIS Mapping"],
  Goal: ["Resource Conservation", "Climate Adaptation", "Market Integration", "Food Sovereignty", "Nutritional Security"],
  Method1: ["Traditional Practices", "Conventional Methods", "Low-Input Systems", "Indigenous Techniques", "Modern Technologies"],
  Method2: ["Innovative Approaches", "High-Tech Solutions", "Agroecological Methods", "Participatory Approaches", "Scientific Methods"],
  Purpose: ["Sustainable Intensification", "Climate Resilience", "Biodiversity Conservation", "Food Security Enhancement", "Livelihood Improvement"],
  Process: ["Knowledge Transfer", "Innovation Adoption", "Market Development", "Community Organizing", "Resource Governance"],
  Stakeholder: ["Smallholder Farmers", "Rural Communities", "Policy Makers", "Value Chain Actors", "Future Generations"],
  Metric: ["Soil Carbon", "Biodiversity", "Yield Stability", "Household Income", "Nutritional Diversity", "Water Quality"],
  Resource: ["Water", "Soil", "Genetic", "Labor", "Knowledge", "Financial"],
  Challenge: ["Drought", "Pest Outbreaks", "Market Volatility", "Land Degradation", "Climate Variability", "Food Insecurity"],
  Ecosystem: ["Soil", "Watershed", "Farmland", "Forest-Agricultural Interface", "Rural", "Agricultural Landscape"],
};

// Abstract templates
const abstractTemplates = [
  "This study examines the impacts of [practice] on [outcome] in [region]. Using [methodology] methods, we analyzed data from [sample_size] farms over [time_period]. Results indicate that [practice] significantly [effect] [outcome] by [percentage]% compared to conventional approaches. [additional_finding]. These findings suggest that [practice] could be an effective strategy for addressing [challenge] while promoting [benefit] in similar contexts.",
  
  "The research investigates how [factor] influences [process] among [population] in [region]. Through [data_collection], we assessed [variables] across [sample_size] sites. Our findings reveal that [factor] plays a critical role in [process], with [relationship] observed between [variable1] and [variable2]. Furthermore, [secondary_finding]. This research contributes to understanding [broader_topic] and has implications for [application].",
  
  "This paper presents a comparative analysis of [method1] and [method2] for [purpose] in [system]. We employed [methodology] to evaluate [criteria] across [sample_size] cases in [region]. Analysis shows that [method1] outperformed [method2] in terms of [criterion1] but underperformed regarding [criterion2]. [context_factor] was found to significantly moderate these effects. These results highlight the importance of [principle] when implementing [approach] in diverse agricultural contexts.",
  
  "We assessed the effectiveness of [technology] for addressing [challenge] facing [stakeholder] in [region]. Using [methodology], we measured [indicators] before and after [intervention] in [sample_size] communities. The results demonstrate a [effect_size] improvement in [primary_outcome] and [secondary_outcome]. However, [limitation] remains a significant constraint. This study provides evidence for [recommendation] and suggests [future_direction] for research and practice.",
  
  "This research examines the relationship between [practice] and [ecosystem_service] provision in [agroecosystem]. Through [methodology] over [time_period], we quantified [metrics] across [gradient]. Our analysis reveals that [practice] enhances [ecosystem_service1] while maintaining [ecosystem_service2], particularly when [condition]. These findings contribute to understanding the multifunctional role of [practice] in supporting both agricultural production and ecosystem health."
];

// Abstract components for substitution
const abstractComponents = {
  practice: ["agroforestry practices", "conservation agriculture", "organic farming methods", "precision agriculture technologies", "integrated pest management", "crop diversification strategies"],
  outcome: ["crop yield", "soil fertility", "water use efficiency", "biodiversity conservation", "farmer income", "climate resilience", "food security"],
  region: ["semi-arid regions of East Africa", "humid tropics of Southeast Asia", "Mediterranean agricultural landscapes", "smallholder systems in the Andean highlands", "coastal farming communities in South Asia"],
  methodology: ["mixed-methods", "participatory", "longitudinal", "cross-sectional", "remote sensing", "multi-scale modeling", "comparative case study"],
  sample_size: ["150", "273", "85", "420", "32", "1,250", "68"],
  time_period: ["three growing seasons", "a five-year period", "two consecutive years", "an 18-month period", "multiple cropping cycles"],
  effect: ["increased", "enhanced", "improved", "stabilized", "maintained", "reduced variability in"],
  percentage: ["27", "42", "18", "65", "33", "51"],
  additional_finding: ["Socioeconomic factors such as market access and gender were significant moderators of these effects", "These benefits were particularly pronounced during periods of climatic stress", "Knowledge sharing among farmers amplified positive outcomes across the community", "Cost-benefit analysis indicated positive returns on investment within two years", "Environmental co-benefits including improved water quality were also documented"],
  challenge: ["climate variability", "declining soil fertility", "limited market access", "increasing pest pressure", "water scarcity", "rural outmigration"],
  benefit: ["ecosystem services", "dietary diversity", "resilience to market shocks", "community knowledge systems", "adaptive capacity", "sustainable intensification"],
  factor: ["social capital", "policy incentives", "market access", "traditional knowledge", "gender dynamics", "technological literacy", "land tenure security"],
  process: ["technology adoption", "climate adaptation", "sustainable intensification", "value chain participation", "knowledge sharing", "resource governance"],
  population: ["smallholder farmers", "women agriculturalists", "indigenous communities", "farmer cooperatives", "peri-urban producers", "pastoralist communities"],
  data_collection: ["household surveys", "field experiments", "participatory mapping", "remote sensing analysis", "focus group discussions", "soil and water sampling"],
  variables: ["productivity indicators", "social network metrics", "ecosystem service indicators", "economic returns", "land use patterns", "knowledge levels"],
  relationship: ["a positive correlation", "an inverse relationship", "a threshold effect", "a seasonal dependence", "a non-linear association"],
  variable1: ["adoption intensity", "social connectivity", "ecological knowledge", "asset ownership", "market orientation"],
  variable2: ["resilience outcomes", "yield stability", "biodiversity levels", "household food security", "income diversification"],
  secondary_finding: ["institutional factors emerged as critical enabling conditions", "spatial clustering of outcomes suggests important neighborhood effects", "seasonal variations indicate the need for adaptive management approaches", "disaggregation by wealth status revealed important equity implications"],
  broader_topic: ["social-ecological resilience", "agricultural innovation systems", "food sovereignty", "climate-smart agriculture", "sustainable rural livelihoods"],
  application: ["development program design", "agricultural extension approaches", "policy formulation", "farmer organization strategies", "climate adaptation planning"],
  method1: ["participatory learning approaches", "digital advisory services", "agroecological methods", "mechanized techniques", "traditional farming practices"],
  method2: ["conventional extension systems", "satellite-based monitoring", "input-intensive practices", "manual methods", "novel farming systems"],
  purpose: ["improving resource efficiency", "building climate resilience", "enhancing market participation", "conserving agrobiodiversity", "strengthening food security"],
  system: ["smallholder farming systems", "irrigated rice production", "mixed crop-livestock systems", "agroforestry landscapes", "home garden systems"],
  criteria: ["productivity", "resource use efficiency", "labor requirements", "profitability", "resilience indicators", "environmental impacts"],
  criterion1: ["yield stability", "return on investment", "adaptation potential", "scalability", "resource efficiency"],
  criterion2: ["initial resource requirements", "technical complexity", "gender inclusivity", "cultural compatibility", "long-term sustainability"],
  context_factor: ["farm size", "market connectivity", "agroecological zone", "wealth status", "previous exposure to innovation"],
  principle: ["context-specific adaptation", "participatory design", "integrated approaches", "building on local knowledge", "addressing equity considerations"],
  approach: ["sustainable intensification strategies", "climate-smart practices", "agroecological methods", "digital agriculture", "value chain interventions"],
  technology: ["mobile-based advisory services", "solar-powered irrigation systems", "participatory early warning systems", "digital marketplace platforms", "community-based monitoring tools"],
  indicators: ["household food security", "agricultural productivity", "ecosystem service provision", "income stability", "climate vulnerability", "social learning"],
  intervention: ["a two-year participatory program", "technology deployment", "farmer-to-farmer training", "policy implementation", "market connection initiative"],
  effect_size: ["significant", "modest but consistent", "context-dependent", "transformative", "incremental"],
  primary_outcome: ["livelihood security", "agricultural sustainability", "climate resilience", "nutritional status", "market participation"],
  secondary_outcome: ["social cohesion", "women's empowerment", "ecosystem regeneration", "youth engagement in agriculture", "institutional strengthening"],
  limitation: ["uneven access to complementary resources", "climatic variability", "market fluctuations", "policy inconsistency", "power imbalances"],
  recommendation: ["targeted investment in capacity building", "policies that address structural constraints", "integrated programming across sectors", "attention to equity dimensions", "long-term monitoring and adaptation"],
  future_direction: ["scaling successful approaches", "addressing equity gaps", "strengthening methodological approaches", "exploring synergies with other innovations", "quantifying long-term impacts"],
  ecosystem_service: ["pollination", "water purification", "soil formation", "carbon sequestration", "pest regulation", "cultural values"],
  agroecosystem: ["coffee agroforestry systems", "rice paddies", "mixed smallholder landscapes", "grazing systems", "vegetable production areas"],
  metrics: ["soil organic carbon", "water infiltration rates", "species richness", "agricultural productivity", "input use efficiency"],
  gradient: ["a management intensity gradient", "different landscape configurations", "varying socioeconomic conditions", "diverse agroecological zones", "a climate vulnerability spectrum"],
  condition: ["combined with local knowledge systems", "supported by appropriate policies", "adapted to local conditions", "integrated within community governance structures", "matched with market opportunities"],
  ecosystem_service1: ["biodiversity conservation", "carbon sequestration", "watershed protection", "pest regulation", "soil fertility maintenance"],
  ecosystem_service2: ["agricultural productivity", "livelihood security", "cultural heritage", "resilience to shocks", "food production"]
};

// Helper function to randomize items from arrays
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to generate random integer within a range
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate random date within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to replace template placeholders with random content
const fillTemplate = (template: string, components: Record<string, string[]>): string => {
  return template.replace(/\[(.*?)\]/g, (match, key) => {
    return components[key] ? getRandomItem(components[key]) : match;
  });
};

// Generate a random author
const generateAuthor = (): Author => {
  const university = getRandomItem(universities);
  return {
    id: `author-${Math.random().toString(36).substr(2, 9)}`,
    name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
    affiliation: university.name,
    country: university.country,
    email: `${getRandomItem(firstNames).toLowerCase()}.${getRandomItem(lastNames).toLowerCase()}@${university.name.toLowerCase().replace(/\s/g, '')}.edu`.replace(/,/g, ''),
  };
};

// Generate random keywords for a paper
const generateKeywordsForPaper = (count: number): Keyword[] => {
  // Flatten all keywords from categories
  const allKeywords = keywordCategories.flatMap(category => category.keywords);
  
  // Shuffle and take a subset
  const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(kw => ({ 
    id: kw.id, 
    name: kw.name 
  }));
};

// Add a function to generate a random year within a reasonable range
const getRandomYear = (minYear = 1990, maxYear = new Date().getFullYear()) => {
  return Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
};

// Generate a single research paper
const generateResearchPaper = (id: string): ResearchPaper => {
  // Generate base paper data
  const title = fillTemplate(getRandomItem(titleTemplates), titleComponents);
  const abstract = fillTemplate(getRandomItem(abstractTemplates), abstractComponents);
  
  // Random date within last 10 years
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 10);
  const publicationDate = getRandomDate(startDate, endDate);
  
  // Generate 1-5 authors
  const authorCount = getRandomInt(1, 5);
  const authors: Author[] = [];
  for (let i = 0; i < authorCount; i++) {
    authors.push(generateAuthor());
  }
  
  // Generate 3-8 keywords
  const keywords = generateKeywordsForPaper(getRandomInt(3, 8));
  
  // Pick random methodology type
  const methodologyTypes: MethodologyType[] = ["qualitative", "quantitative", "mixed"];
  const methodologyType = getRandomItem(methodologyTypes);
  
  // Pick random citation trend
  const citationTrends: CitationTrend[] = ["increasing", "stable", "decreasing"];
  const citationTrend = getRandomItem(citationTrends);
  
  // Generate DOI
  const doiPrefix = "10.1234";
  const doiSuffix = Math.random().toString(36).substring(2, 10);
  const doi = `${doiPrefix}/${doiSuffix}`;

  const publicationYear = getRandomYear();
  const publicationDateWithYear = new Date(publicationYear, 0, 1); // January 1st of the year
  
  return {
    id,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    title,
    abstract,
    publicationDate: publicationDateWithYear.toISOString(),
    publicationYear: publicationYear,
    authors,
    journal: getRandomItem(journals),
    keywords,
    methodologyType,
    citationCount: getRandomInt(0, 200),
    citationTrend,
    doi,
    downloadUrl: `https://example.org/papers/${doiSuffix}.pdf`,
    volume: String(getRandomInt(1, 50)),
    issue: String(getRandomInt(1, 12)),
    pages: `${getRandomInt(1, 200)}-${getRandomInt(201, 300)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Main generator function
export const generateTestData = (paperCount: number = 50) => {
  // Generate papers
  const papers: ResearchPaper[] = [];
  for (let i = 0; i < paperCount; i++) {
    papers.push(generateResearchPaper(`paper-${i + 1}`));
  }
  
  // Compile full data set
  const testData = {
    papers,
    keywordCategories,
    // Extract unique authors from all papers
    authors: Array.from(
      new Map(
        papers.flatMap(p => p.authors).map(a => [a.id, a])
      ).values()
    ),
  };
  
  return testData;
};

// Export data to JSON file
export const exportTestDataToJSON = (data: any, filePath: string): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Test data exported to JSON at: ${filePath}`);
  } catch (error) {
    console.error('Error exporting test data to JSON:', error);
  }
};

// Export data to CSV file (papers only)
export const exportPapersToCSV = (papers: ResearchPaper[], filePath: string): void => {
  try {
    // Flatten the papers for CSV format
    const flattenedPapers = papers.map(paper => ({
      id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      publicationDate: paper.publicationDate,
      journal: paper.journal,
      authors: paper.authors.map(a => a.name).join('; '),
      authorAffiliations: paper.authors.map(a => a.affiliation).join('; '),
      keywords: paper.keywords.map(k => k.name).join('; '),
      methodologyType: paper.methodologyType,
      citationCount: paper.citationCount,
      citationTrend: paper.citationTrend,
      doi: paper.doi,
      downloadUrl: paper.downloadUrl,
      volume: paper.volume,
      issue: paper.issue,
      pages: paper.pages,
    }));
    
    // Convert to CSV
    const csv = parse(flattenedPapers);
    fs.writeFileSync(filePath, csv);
    console.log(`Papers exported to CSV at: ${filePath}`);
  } catch (error) {
    console.error('Error exporting papers to CSV:', error);
  }
};

// Function to generate and export all test data
export const generateAndExportTestData = (
  paperCount: number = 50,
  baseOutputDir: string = './test-data'
): void => {
  try {
    // Generate the test data
    const testData = generateTestData(paperCount);
    
    // Ensure output directory exists
    if (!fs.existsSync(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, { recursive: true });
    }
    
    // Export JSON files
    exportTestDataToJSON(testData, path.join(baseOutputDir, 'all-test-data.json'));
    exportTestDataToJSON(testData.papers, path.join(baseOutputDir, 'papers.json'));
    exportTestDataToJSON(testData.keywordCategories, path.join(baseOutputDir, 'keyword-categories.json'));
    exportTestDataToJSON(testData.authors, path.join(baseOutputDir, 'authors.json'));
    
    // Export CSV files
    exportPapersToCSV(testData.papers, path.join(baseOutputDir, 'papers.csv'));
    
    console.log(`All test data exported to: ${baseOutputDir}`);
  } catch (error) {
    console.error('Error in generating and exporting test data:', error);
  }
};

// Generate browser-compatible version for client-side usage
export const generateBrowserTestData = (paperCount: number = 50) => {
  return generateTestData(paperCount);
};

// Allow direct execution from command line
if (typeof require !== 'undefined' && require.main === module) {
  const paperCount = process.argv[2] ? parseInt(process.argv[2]) : 50;
  const outputDir = process.argv[3] || './test-data';
  
  console.log(`Generating ${paperCount} test research papers...`);
  generateAndExportTestData(paperCount, outputDir);
}
