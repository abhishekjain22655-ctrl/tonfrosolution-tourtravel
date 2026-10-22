/**
 * MongoDB Atlas Initialization & Schema Definition Script
 *
 * This script documents the MongoDB collections, indexes, and validator schemas
 * for the Travel Agency platform. It is fully compatible with MongoDB Atlas M0 (Free Tier)
 * and local MongoDB instances (mongosh).
 *
 * To run in mongosh:
 *   mongosh "your-mongodb-atlas-uri" mongodb-init.js
 */

const DB_NAME = 'travel_agency';

// Switch database (in mongosh)
if (typeof db !== 'undefined') {
  const currentDb = db.getSiblingDB(DB_NAME);

  // 1. PACKAGES COLLECTION & INDEXES
  currentDb.createCollection('packages');
  currentDb.packages.createIndex({ slug: 1 }, { unique: true });
  currentDb.packages.createIndex({ destinationType: 1, status: 1 });
  currentDb.packages.createIndex({ startingPriceINR: 1 });
  currentDb.packages.createIndex({ featured: 1 });
  currentDb.packages.createIndex({ destinationName: 1 });
  currentDb.packages.createIndex({ categories: 1 });

  // 2. DESTINATIONS COLLECTION & INDEXES
  currentDb.createCollection('destinations');
  currentDb.destinations.createIndex({ slug: 1 }, { unique: true });
  currentDb.destinations.createIndex({ type: 1, featured: 1 });
  currentDb.destinations.createIndex({ startingPriceINR: 1 });

  // 3. ENQUIRIES COLLECTION & INDEXES
  currentDb.createCollection('enquiries');
  currentDb.enquiries.createIndex({ phone: 1 });
  currentDb.enquiries.createIndex({ status: 1 });
  currentDb.enquiries.createIndex({ createdAt: -1 });

  // 4. ADMIN SETTINGS COLLECTION & INDEXES
  currentDb.createCollection('adminsettings');
  currentDb.adminsettings.createIndex({ key: 1 }, { unique: true });

  print('MongoDB collections and indexes initialized successfully for: ' + DB_NAME);
}
