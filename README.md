# University Data Management System

A robust Node.js module for managing university data through JSON operations. This system handles departments, professors, and students with full CRUD capabilities, data validation, and automatic backups.

## Features

- ✅ Full CRUD operations for departments, professors, and students
- 🔍 Advanced search functionality
- 🛡️ Comprehensive data validation
- 💾 Automatic backups before modifications
- 🔗 Relationship integrity checking
- ⚠️ Detailed error handling

## Usage

### Basic Setup

```javascript
const UniversityDataManager = require('./src/UniversityDataManager');
const manager = new UniversityDataManager('university.json');

// Initialize the data structure
await manager.initialize();
```

### Adding Data

```javascript
// Add a department
await manager.add('department', {
    id: 'cs101',
    name: 'Computer Science',
    building: 'Tech Park',
    budget: 1000000
});

// Add a professor
await manager.add('professor', {
    id: 'prof123',
    name: 'Dr. JJ Jayakanth',
    email: 'jayakanth@srmist.edu.in',
    department: 'cs101',
    specialization: 'AI'
});

// Add a student
await manager.add('student', {
    id: 'std101',
    name: 'John Doe',
    email: 'john@srmist.edu.in',
    enrollmentYear: 2024,
    major: 'Computer Science'
});
```

### Updating Data

```javascript
// Update department budget
await manager.update('department', 'cs101', {
    budget: 1200000
});

// Update professor email
await manager.update('professor', 'prof123', {
    email: 'doe.new@srmist.edu.in'
});
```

### Searching Data

```javascript
// Search for CS professors
const csProfessors = await manager.search('professor', {
    department: 'cs101'
});

// Search for students by major
const csStudents = await manager.search('student', {
    major: 'Computer Science'
});
```

### Deleting Data

```javascript
// Delete a student
await manager.delete('student', 'std101');

// Delete a department (will fail if professors are assigned)
await manager.delete('department', 'cs101');
```

## API Documentation

### Class: UniversityDataManager

#### Constructor

- `constructor(filename)`: Creates a new instance of UniversityDataManager
  - `filename`: Path to the JSON file to store university data

#### Methods

- `async initialize()`: Initializes the data structure and backup directory
- `async add(type, data)`: Adds a new entry
  - `type`: 'department', 'professor', or 'student'
  - `data`: Object containing entity data
- `async update(type, id, updates)`: Updates an existing entry
  - `type`: Entity type
  - `id`: Entity ID
  - `updates`: Object containing updates
- `async delete(type, id)`: Deletes an entry
  - `type`: Entity type
  - `id`: Entity ID
- `async search(type, criteria)`: Searches for entries
  - `type`: Entity type
  - `criteria`: Search criteria object

## Data Validation

### Department Schema
```javascript
{
    id: string,
    name: string,
    building: string,
    budget: number
}
```

### Professor Schema
```javascript
{
    id: string,
    name: string,
    email: string,
    department: string,
    specialization: string
}
```

### Student Schema
```javascript
{
    id: string,
    name: string,
    email: string,
    enrollmentYear: number,
    course: string
}
```

## Error Handling

The system includes comprehensive error handling for:
- File operations
- Data validation
- Relationship integrity
- Duplicate entries
- Missing required fields
- Invalid data types

All operations return detailed error messages when they fail.

## Backup System

- Automatic backups are created before any modification
- Backups are stored in a `backups` directory
- Backup files are timestamped for easy reference





