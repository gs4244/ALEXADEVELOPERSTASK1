const fs = require('fs').promises;
const path = require('path');

class UniversitySystem {
    constructor(filename) {
        this.filename = filename;
        this.backupDir = path.join(path.dirname(filename), 'backups');
    }

    // Data structure validation schemas
    #schemas = {
        student: {
            required: ['id', 'name', 'email', 'enrollmentYear', 'major'],
            types: {
                id: 'string',
                name: 'string',
                email: 'string',
                enrollmentYear: 'number',
                course: 'string'
            }
        },
        professor: {
            required: ['id', 'name', 'email', 'department', 'specialization'],
            types: {
                id: 'string',
                name: 'string',
                email: 'string',
                department: 'string',
                specialization: 'string'
            }
        },
        department: {
            required: ['id', 'name', 'building', 'budget'],
            types: {
                id: 'string',
                name: 'string',
                building: 'string',
                budget: 'number'
            }
        }
    };

    // Initialize data structure if file doesn't exist
    async initialize() {
        try {
            await fs.access(this.filename);
        } catch {
            const initialData = {
                departments: {},
                professors: {},
                students: {}
            };
            await this.#writeFile(initialData);
            await fs.mkdir(this.backupDir, { recursive: true });
        }
    }

    // Create backup of current data
    async #createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `backup_${timestamp}.json`);
        const data = await this.#readFile();
        await fs.writeFile(backupFile, JSON.stringify(data, null, 2));
    }

    // File operations with error handling
    async #readFile() {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read data: ${error.message}`);
        }
    }

    async #writeFile(data) {
        try {
            await fs.writeFile(this.filename, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error(`Failed to write data: ${error.message}`);
        }
    }

    // Validate data 
    #validateData(data, type) {
        const schema = this.#schemas[type];
        if (!schema) throw new Error(`Invalid type: ${type}`);

        // Check required fields
        for (const field of schema.required) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate types
        for (const [field, expectedType] of Object.entries(schema.types)) {
            if (field in data && typeof data[field] !== expectedType) {
                throw new Error(`Invalid type for ${field}: expected ${expectedType}`);
            }
        }

        return true;
    }

    // CRUD Operations
    async add(type, data) {
        try {
            this.#validateData(data, type);
            await this.#createBackup();

            const universityData = await this.#readFile();
            
            if (universityData[`${type}s`][data.id]) {
                throw new Error(`${type} with ID ${data.id} already exists`);
            }

            universityData[`${type}s`][data.id] = data;
            await this.#writeFile(universityData);
            return data;
        } catch (error) {
            throw new Error(`Failed to add ${type}: ${error.message}`);
        }
    }

    async update(type, id, updates) {
        try {
            const universityData = await this.#readFile();
            const existing = universityData[`${type}s`][id];
            
            if (!existing) {
                throw new Error(`${type} with ID ${id} not found`);
            }

            const updated = { ...existing, ...updates };
            this.#validateData(updated, type);
            
            await this.#createBackup();
            universityData[`${type}s`][id] = updated;
            await this.#writeFile(universityData);
            return updated;
        } catch (error) {
            throw new Error(`Failed to update ${type}: ${error.message}`);
        }
    }

    async delete(type, id) {
        try {
            const universityData = await this.#readFile();
            
            if (!universityData[`${type}s`][id]) {
                throw new Error(`${type} with ID ${id} not found`);
            }

            // Check for dependencies before deletion
            if (type === 'department') {
                const hasProfessors = Object.values(universityData.professors)
                    .some(prof => prof.department === id);
                if (hasProfessors) {
                    throw new Error('Cannot delete department with assigned professors');
                }
            }

            await this.#createBackup();
            delete universityData[`${type}s`][id];
            await this.#writeFile(universityData);
            return true;
        } catch (error) {
            throw new Error(`Failed to delete ${type}: ${error.message}`);
        }
    }

    async search(type, criteria) {
        try {
            const universityData = await this.#readFile();
            const items = Object.values(universityData[`${type}s`]);
            
            return items.filter(item => {
                return Object.entries(criteria).every(([key, value]) => {
                    if (typeof value === 'string') {
                        return item[key]?.toLowerCase().includes(value.toLowerCase());
                    }
                    return item[key] === value;
                });
            });
        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }
}

module.exports = UniversitySystem;