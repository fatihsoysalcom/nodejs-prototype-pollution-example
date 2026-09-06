console.log("--- Node.js Prototype Pollution Example ---");
console.log("This example demonstrates how a vulnerable function can allow an attacker to modify Object.prototype.\n");

// --- Part 1: Demonstrating the Vulnerability ---

// A simple vulnerable function that sets a property on an object based on a dot-separated path.
// This pattern is common in libraries that parse user input (e.g., query strings, JSON bodies)
// and then use it to populate an object.
function vulnerableSetProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // If 'part' is '__proto__', it will traverse to Object.prototype
        if (!current[part] || typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
        }
        current = current[part];
    }
    // The final part is set. If 'current' is Object.prototype, it pollutes it.
    current[parts[parts.length - 1]] = value;
}

console.log("1. Initial state: A new plain object does not have 'isAdmin' property.");
const initialObject = {};
console.log("  initialObject.isAdmin:", initialObject.isAdmin); // Expected: undefined
console.log("  Object.prototype.isAdmin:", Object.prototype.isAdmin); // Expected: undefined

console.log("\n2. Simulating an attack: Using a vulnerable function to inject into Object.prototype.");
// An attacker provides input like "__proto__.isAdmin" as a path and "true" as a value.
const attackerPath = "__proto__.isAdmin";
const attackerValue = true;

console.log(`  Calling vulnerableSetProperty({}, "${attackerPath}", ${attackerValue})`);
vulnerableSetProperty({}, attackerPath, attackerValue); // The target object is an empty object,
                                                        // but the path targets its prototype.

console.log("\n3. After pollution: Any new plain object now inherits the injected property.");
const pollutedObject = {};
console.log("  pollutedObject.isAdmin:", pollutedObject.isAdmin); // Expected: true (due to pollution)
console.log("  Object.prototype.isAdmin:", Object.prototype.isAdmin); // Expected: true
console.log("  Even existing objects (if they don't have their own 'isAdmin') are affected:");
const existingConfig = { port: 3000 };
console.log("  existingConfig.isAdmin:", existingConfig.isAdmin); // Expected: true

// --- Part 2: Mitigation ---

console.log("\n--- Mitigation: Preventing Prototype Pollution ---");

// A safe function that explicitly checks for and blocks '__proto__' and 'constructor' keys.
function safeSetProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // Mitigation check: Prevent traversal through '__proto__' or 'constructor'
        if (part === '__proto__' || part === 'constructor') {
            console.warn(`  [WARNING] Attempted to modify restricted key: '${part}'. Operation blocked.`);
            return; // Abort the operation
        }
        if (!current[part] || typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
        }
        current = current[part];
    }

    const finalPart = parts[parts.length - 1];
    // Mitigation check: Prevent setting on '__proto__' or 'constructor' directly
    if (finalPart === '__proto__' || finalPart === 'constructor') {
        console.warn(`  [WARNING] Attempted to modify restricted key: '${finalPart}'. Operation blocked.`);
        return; // Abort the operation
    }

    current[finalPart] = value;
}

console.log("\n4. Demonstrating safe function: Attempting the same attack with mitigation.");
// Note: Object.prototype is still polluted from the previous step in this running process.
// The goal here is to show that `safeSetProperty` itself prevents *new* pollution.

const safeAttackerPath = "__proto__.isModerator";
const safeAttackerValue = true;

console.log(`  Calling safeSetProperty({}, "${safeAttackerPath}", ${safeAttackerValue})`);
safeSetProperty({}, safeAttackerPath, safeAttackerValue); // This call should be blocked by the checks.

console.log("\n5. After attempted safe pollution: New objects are NOT affected by this attempt.");
const safeObject = {};
console.log("  safeObject.isModerator:", safeObject.isModerator); // Expected: undefined
console.log("  Object.prototype.isModerator:", Object.prototype.isModerator); // Expected: undefined

console.log("\n--- End of Example ---");
console.log("Note: The 'isAdmin' property on Object.prototype remains polluted from the first part of the example.");
console.log("  Final check: ({}).isAdmin:", ({}).isAdmin); // Still true from the initial pollution.
