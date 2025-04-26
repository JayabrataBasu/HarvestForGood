import { generateAndExportTestData } from './testDataGenerator';

// Configuration
const PAPER_COUNT = 100;
const OUTPUT_DIR = './data/test-data';

// Generate test data with specified parameters
console.log(`Generating ${PAPER_COUNT} research papers for testing...`);
generateAndExportTestData(PAPER_COUNT, OUTPUT_DIR);
console.log('Test data generation complete!');
