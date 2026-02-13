import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // ✅ SET TEST ENV VARIABLES
  process.env.JWT_SECRET = "testsecret";
  process.env.NODE_ENV = "test";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

// ❌ REMOVE afterEach (DO NOT CLEAR AFTER EVERY TEST)

// ✅ Clean everything only once at end
afterAll(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
