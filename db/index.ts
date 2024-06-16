import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const db = redis;

export default db;
