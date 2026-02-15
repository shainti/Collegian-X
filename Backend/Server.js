require('dotenv').config();
const app = require("./src/app");
const connectdb = require("./src/db/db");

console.log('\n=== ENVIRONMENT VARIABLES CHECK ===');
console.log('Collegian_Email:', process.env.Collegian_Email);
console.log('Collegian_pass:', process.env.Collegian_pass ? '✅ EXISTS' : '❌ MISSING');
console.log('===================================\n');

connectdb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
