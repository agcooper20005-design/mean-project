function createCustomerRecord(data) {
  // Capture one timestamp so created/updated fields match for this operation.
  const now = new Date().toISOString();

  return {
    customer: {
      // Basic customer contact information.
      // String(...).trim() prevents null/undefined issues and removes extra spacing.
      firstName: String(data.firstName || "").trim(),
      lastName: String(data.lastName || "").trim(),
      phone: String(data.phone || "").trim(),
      email: String(data.email || "").trim(),

      // Customer billing/contact address.
      // These fields can remain empty if the customer has not provided an address yet.
      address: {
        street: String(data.street || "").trim(),
        city: String(data.city || "").trim(),
        state: String(data.state || "").trim(),
        zipCode: String(data.zipCode || "").trim()
      }
    },

    loginCredentials: {
      // Username defaults to the customer email.
      // This keeps login identity tied to the customer's primary contact email.
      username: String(data.email || "").trim(),

      // Never store a raw password in MongoDB.
      // In a MEAN app, Angular sends the password to the Express/Node backend over HTTPS.
      // The backend hashes the password with bcrypt/argon2, then stores only the hash.
      passwordHash: data.passwordHash || null,

      // Only set this timestamp if a password hash was actually provided.
      passwordLastUpdatedAt: data.passwordHash ? now : null,

      // This starts as null because the user has not logged in yet.
      lastLoginAt: null,

      // Default status for a newly created customer account.
      // Later, this could support values like active, disabled, pending, or locked.
      accountStatus: "active",

      googleSSO: {
        // Future Google Single Sign-On configuration.
        // This stays disabled until the customer links or creates an account with Google.
        enabled: false,

        // Identifies the authentication provider.
        provider: "google",

        // Google's unique user identifier, usually the "sub" claim from the Google ID token.
        // This is more reliable than email alone because emails can change.
        googleUserId: null,

        // Email returned by Google during the SSO process.
        // This can be used to match or link an existing customer account.
        googleEmail: null,

        // Whether Google confirmed that the returned email address is verified.
        emailVerified: false,

        // Optional customer profile image returned by Google.
        profilePhotoUrl: null,

        // Tracks the most recent successful Google SSO login.
        lastLoginAt: null
      }
    },

    cars: [
      {
        // Vehicle information.
        // carYear is parsed as a number because years should be numeric.
        year: parseInt(data.carYear, 10) || 0,

        make: String(data.carMake || "").trim(),
        model: String(data.carModel || "").trim(),
        trim: String(data.carTrim || "").trim(),

        // VIN should be stored as a string, not a number.
        // VINs can contain letters, leading characters, and should not be mathematically parsed.
        vin: String(data.vin || "").trim(),

        licensePlate: String(data.licensePlate || "").trim(),

        // Mileage is numeric because it may be used for sorting, reporting, and maintenance intervals.
        mileage: parseInt(data.mileage, 10) || 0,

        color: String(data.color || "").trim(),

        serviceHistory: [
          {
            // Mongoose can automatically generate an _id for this nested service record
            // when this object is saved through a Mongoose schema.
            // No manual _id is needed here unless you have a specific reason to provide one.

            // Defaults to now if no service date is provided.
            date: data.serviceDate || now,

            serviceType: String(data.serviceType || "").trim(),
            description: String(data.serviceDescription || "").trim(),

            // Prefer the mileage entered specifically for this service.
            // If unavailable, fall back to the vehicle's current mileage.
            mileageAtService:
              parseInt(data.mileageAtService, 10) ||
              parseInt(data.mileage, 10) ||
              0,

            // Cost is parsed as a decimal number to support cents.
            cost: parseFloat(data.cost) || 0,

            // References the _id of the employee user assigned to this service record.
            // This should point to a user document in the employees/users collection,
            // instead of storing a technician name directly.
            technicianUserId: data.technicianUserId || null
          }
        ]
      }
    ],

    // createdAt should only be set when the record is first created.
    createdAt: data.createdAt || now,

    // updatedAt should change whenever this customer record is modified.
    updatedAt: now
  };
}

module.exports = createCustomerRecord;