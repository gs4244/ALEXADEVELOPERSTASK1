const UniversitySystem = require('../src/UniversitySystem');
const path = require('path');
const fs = require('fs').promises;

// Test configuration
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'university.json');

// Setup function to ensure directories exist
async function setup() {
    try {
        // Ensure data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Create empty data file if it doesn't exist
        try {
            await fs.access(DATA_FILE);
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify({
                departments: {},
                professors: {},
                students: {}
            }, null, 2));
        }
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

// Main test function
async function runTests() {
    try {
        // Initialize manager
        console.log('Initializing manager...');
        const manager = new UniversitySystem(DATA_FILE);
        await manager.initialize();

        // Test 1: Add Department
        console.log('\nTest 1: Adding department...');
        const departmentData = {
            id: 'css103',
            name: 'Computer Science',
            building: 'Tech Park',
            budget: 1000000
        };
        await manager.add('department', departmentData);
        console.log('Department added successfully');

        // Test 2: Add Professor
        console.log('\nTest 2: Adding professor...');
        const professorData = {
            id: 'prof12345',
            name: 'Dr. JJ Jayakanth',
            email: 'jjjayakanth@srmist.edu.in',
            department: 'css103',
            specialization: 'AI'
        };
        await manager.add('professor', professorData);
        console.log('Professor added successfully');

        // Test 3: Search
        console.log('\nTest 3: Searching for CS department...');
        const searchResult = await manager.search('department', { name: 'Computer Science' });
        console.log('Search result:', searchResult);

        console.log('\nAll tests completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run setup and tests
setup().then(runTests);