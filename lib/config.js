/* Create and export configuration variables.
NODE_ENV is a convention used to determine the environment.
*/

// Container for all the environments:
let environments = {};

// Setting staging as the default environment:
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001, // we create the https folder for this.
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret'
};

// Setting production environment:
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001, // we create the https folder for this.
    'envName': 'production',
    'hashingSecret': 'thisIsASecret'
};

// Determine which environment was passed as a command-line argument:
let currentEnvironment = typeof(process.env.NODE_ENV === 'string') ? (process.env.NODE_ENV || '').toLowerCase() : ''; // I had to add this protection because even if it was undefined, I was receiving a 'TypeError: Cannot read properties of undefined (reading 'toLowerCase')'.

// Check the current environment is one of the environment that are defined above. 
// If not , default to the staging environment:
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


// Export the module:
module.exports = environmentToExport;
