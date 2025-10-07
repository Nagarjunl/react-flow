import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'https://localhost:7013'; // Adjust to your backend URL

// API Service for rule management
export const apiService = {
    // Rule CRUD operations
    async getRules() {
        try {
            const response = await axios.get('/api/entities/rules');
            return response.data;
        } catch (error) {
            console.error('Error fetching rules:', error);
            throw error;
        }
    },

    async createRule(ruleData) {
        try {
            const response = await axios.post('/api/entities/rules', ruleData);
            return response.data;
        } catch (error) {
            console.error('Error creating rule:', error);
            throw error;
        }
    },

    async updateRule(id, ruleData) {
        try {
            const response = await axios.put(`/api/entities/rules/${id}`, { ...ruleData, id });
            return response.data;
        } catch (error) {
            console.error('Error updating rule:', error);
            throw error;
        }
    },

    async deleteRule(id) {
        try {
            await axios.delete(`/api/entities/rules/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting rule:', error);
            throw error;
        }
    },

    // Data fetching for dropdowns
    async getCountries() {
        try {
            const response = await axios.get('/api/entities/countries');
            return response.data;
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    },

    async getStores() {
        try {
            const response = await axios.get('/api/entities/stores');
            return response.data;
        } catch (error) {
            console.error('Error fetching stores:', error);
            return [];
        }
    },

    async getUsers() {
        try {
            const response = await axios.get('/api/entities/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    // Rule testing
    async testRule(ruleData, testData) {
        try {
            const response = await axios.post('/api/rules/test', {
                rule: ruleData,
                testData: testData
            });
            return response.data;
        } catch (error) {
            console.error('Error testing rule:', error);
            // Fallback to local testing if backend not available
            return this.testRuleLocally(ruleData, testData);
        }
    },

    // Local rule testing (fallback)
    testRuleLocally(ruleData, testData) {
        try {
            const rule = ruleData.Rules[0];
            const expression = rule.Expression.replace(/input\./g, 'testData.');
            const conditionResult = eval(`(function(testData) { return ${expression}; })(testData)`);

            if (conditionResult) {
                const outputExp = rule.Actions?.OnSuccess?.Context?.Expression?.replace(/input\./g, 'testData.') || '0';
                const output = eval(`(function(testData) { return ${outputExp}; })(testData)`);
                return { success: true, commission: output, ruleName: rule.RuleName };
            }
            return { success: false, commission: 0, ruleName: rule.RuleName };
        } catch (error) {
            return { error: error.message };
        }
    }
};

// Available fields configuration
export const availableFields = [
    { value: 'Sales', label: 'Sales Amount', type: 'number' },
    { value: 'Region', label: 'Region', type: 'select' },
    { value: 'Store', label: 'Store Name', type: 'select' },
    { value: 'UserType', label: 'User Type', type: 'select' },
    { value: 'TargetAchievement', label: 'Target Achievement', type: 'number' },
    { value: 'AttendancePercentage', label: 'Attendance Percentage', type: 'number' },
    { value: 'StoreKpiAchievement', label: 'Store KPI Achievement', type: 'number' },
    { value: 'PresentDays', label: 'Present Days', type: 'number' },
    { value: 'AbsentDays', label: 'Absent Days', type: 'number' },
    { value: 'ApprovedLeaveDays', label: 'Approved Leave Days', type: 'number' },
    { value: 'TotalWorkingDays', label: 'Total Working Days', type: 'number' },
    { value: 'NumberOfMcUplDays', label: 'Number of MC/UPL Days', type: 'number' },
    { value: 'StoreTargetAchievement', label: 'Store Target Achievement', type: 'number' },
    { value: 'Designation', label: 'Designation', type: 'select' },
    { value: 'Name', label: 'Name', type: 'text' },
    { value: 'Amount', label: 'Amount', type: 'number' },
    { value: 'Quantity', label: 'Quantity', type: 'number' },
    { value: 'Date', label: 'Date', type: 'date' }
];

// Operators configuration
export const operators = {
    number: [
        { value: '>', label: 'Greater than' },
        { value: '>=', label: 'Greater than or equal' },
        { value: '<', label: 'Less than' },
        { value: '<=', label: 'Less than or equal' },
        { value: '==', label: 'Equal to' },
        { value: '!=', label: 'Not equal to' }
    ],
    select: [
        { value: '==', label: 'Equal to' },
        { value: '!=', label: 'Not equal to' },
        { value: 'in', label: 'In list' },
        { value: 'not_in', label: 'Not in list' }
    ],
    text: [
        { value: '==', label: 'Equal to' },
        { value: '!=', label: 'Not equal to' },
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' }
    ],
    date: [
        { value: '>', label: 'After' },
        { value: '>=', label: 'On or after' },
        { value: '<', label: 'Before' },
        { value: '<=', label: 'On or before' },
        { value: '==', label: 'On' },
        { value: '!=', label: 'Not on' }
    ]
};
