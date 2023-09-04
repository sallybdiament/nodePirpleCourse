/* Create and export configuration variables.
NODE_ENV is a convention used to determine the environment.
*/

// Container for all the environments:
let environments = {};

// Setting staging as the default environment:
environments.staging = {
    'port': 3000,
    'envName': 'staging'
};

// Setting production environment:
environments.production = {
    'port': 5000,
    'envName': 'production'
};

// Determine which environment was passed as a command-line argument:
let currentEnvironment = typeof(process.env.NODE_ENV === 'string') ? (process.env.NODE_ENV || '').toLowerCase() : ''; // I had to add this protection because even if it was undefined, I was receiving a 'TypeError: Cannot read properties of undefined (reading 'toLowerCase')'.

// Check the current environment is one of the environment that are defined above. 
// If not , default to the staging environment:
let environmentToExport = typeof(currentEnvironment) == 'object' ? environments[currentEnvironment] : environments.staging;


// Export the module:
module.exports = environmentToExport;