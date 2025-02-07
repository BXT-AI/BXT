import express from 'express';
import Database from 'better-sqlite3';
import { TwitterApi } from 'twitter-api-v2';
import schedule from 'node-schedule';

const db = new Database('agents.db');
const app = express();
app.use(express.json());

// Initialize database
db.prepare(`CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY,
  name TEXT,
  purpose TEXT,
  traits TEXT,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  access_secret TEXT,
  schedule TEXT
)`).run();

// API endpoints
app.post('/api/agents', (req, res) => {
  const { name, purpose, traits, keys } = req.body;
  const stmt = db.prepare(`INSERT INTO agents 
    (name, purpose, traits, api_key, api_secret, access_token, access_secret) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(name, purpose, traits, keys.apiKey, keys.apiSecret, keys.accessToken, keys.accessSecret);
  res.json({ id: info.lastInsertRowid });
});

app.post('/api/schedule', (req, res) => {
  const { agentId, cronSchedule } = req.body;
  const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET
  });
  
  schedule.scheduleJob(cronSchedule, async () => {
    const tweet = await generateTweet(agentId);
    await client.v2.tweet(tweet);
  });
  
  res.sendStatus(200);
});

async function generateTweet(agentId) {
  // Python integration for AI generation
  const { spawn } = await import('child_process');
  const python = spawn('python3', ['personality.py', agentId]);
  
  return new Promise((resolve, reject) => {
    python.stdout.on('data', (data) => resolve(data.toString()));
    python.stderr.on('data', (data) => reject(data.toString()));
  });
}

app.listen(3000, () => console.log('Server running on port 3000'));
