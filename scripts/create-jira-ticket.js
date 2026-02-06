#!/usr/bin/env node
/**
 * Create Jira ticket from markdown template
 * 
 * Usage:
 *   node scripts/create-jira-ticket.js Documentation/templates/gmp-40-category-management.md --epic GMP-17 --type Story
 *   npm run create-ticket Documentation/templates/gmp-40-category-management.md --epic GMP-17
 */

import 'dotenv/config';
import { markdownToAdf } from 'marklassian';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const templateFile = args[0];
const epicKey = args.find(arg => arg.startsWith('--epic='))?.split('=')[1] || 
                (args.includes('--epic') && args[args.indexOf('--epic') + 1]);
const issueType = args.find(arg => arg.startsWith('--type='))?.split('=')[1] || 
                  (args.includes('--type') && args[args.indexOf('--type') + 1]) || 
                  'Story';
const projectKey = args.find(arg => arg.startsWith('--project='))?.split('=')[1] || 
                   (args.includes('--project') && args[args.indexOf('--project') + 1]) || 
                   'GMP';

// Jira configuration from environment variables
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://pablo-durandev.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'pablod082000@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Issue Type IDs for GMP project
const ISSUE_TYPE_IDS = {
  'Epic': '10004',
  'Story': '10003',
  'Task': '10001',
  'Bug': '10002',
  'Subtask': '10005'
};

// Validate inputs
if (!templateFile) {
  console.error('❌ Error: Template file is required');
  console.error('\nUsage:');
  console.error('  node scripts/create-jira-ticket.js <template-file> [--epic=KEY] [--type=TYPE] [--project=KEY]');
  console.error('\nExamples:');
  console.error('  node scripts/create-jira-ticket.js Documentation/templates/gmp-40-category-management.md --epic GMP-17 --type Story');
  console.error('  npm run create-ticket Documentation/templates/my-template.md --epic GMP-17');
  process.exit(1);
}

if (!JIRA_API_TOKEN) {
  console.error('❌ Error: JIRA_API_TOKEN environment variable is required');
  console.error('Set it in .env file in project root: JIRA_API_TOKEN=your_token');
  console.error('Get token from: https://id.atlassian.com/manage-profile/security/api-tokens');
  process.exit(1);
}

if (!ISSUE_TYPE_IDS[issueType]) {
  console.error(`❌ Error: Invalid issue type "${issueType}"`);
  console.error(`Valid types: ${Object.keys(ISSUE_TYPE_IDS).join(', ')}`);
  process.exit(1);
}

/**
 * Parse markdown file to extract title and description
 */
function parseMarkdownFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Template file not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Extract title (first line, with or without #)
  let title = '';
  if (lines[0].startsWith('# ')) {
    title = lines[0].replace(/^#\s+/, '').trim();
  } else if (lines[0].startsWith('## ')) {
    title = lines[0].replace(/^##\s+/, '').trim();
  } else {
    title = lines[0].trim();
  }
  
  // Extract description (everything after title, skip empty lines)
  let descriptionStart = 1;
  while (descriptionStart < lines.length && lines[descriptionStart].trim() === '') {
    descriptionStart++;
  }
  
  const description = lines.slice(descriptionStart).join('\n').trim();
  
  return { title, description };
}

/**
 * Create ticket in Jira
 */
async function createTicket(title, description, issueType, projectKey, epicKey) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  const url = `${JIRA_BASE_URL}/rest/api/3/issue`;
  
  // Convert description to ADF
  const descriptionAdf = description 
    ? markdownToAdf(description)
    : {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: 'No description provided.' }]
        }]
      };
  
  // Build payload
  const payload = {
    fields: {
      project: {
        key: projectKey
      },
      summary: title,
      description: descriptionAdf,
      issuetype: {
        id: ISSUE_TYPE_IDS[issueType]
      }
    }
  };
  
  // Add Epic Link if provided
  if (epicKey) {
    payload.fields.customfield_10011 = epicKey;
  }
  
  try {
    console.log('📝 Creating ticket...');
    console.log(`   Title: ${title}`);
    console.log(`   Type: ${issueType}`);
    console.log(`   Project: ${projectKey}`);
    if (epicKey) {
      console.log(`   Epic: ${epicKey}`);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('\n✅ Ticket created successfully!');
    console.log(`   Ticket Key: ${result.key}`);
    console.log(`   Ticket ID: ${result.id}`);
    console.log(`   View: ${JIRA_BASE_URL}/browse/${result.key}\n`);
    
    return result;
  } catch (error) {
    console.error('\n❌ Error creating ticket:');
    console.error(`   ${error.message}`);
    if (error.response) {
      const errorBody = await error.response.text();
      console.error(`   Response: ${errorBody}`);
    }
    throw error;
  }
}

// Main execution
async function main() {
  try {
    // Resolve template file path (from project root)
    const projectRoot = path.join(__dirname, '..');
    const templatePath = path.isAbsolute(templateFile) 
      ? templateFile 
      : path.join(projectRoot, templateFile);
    
    // Parse markdown
    const { title, description } = parseMarkdownFile(templatePath);
    
    if (!title) {
      console.error('❌ Error: Could not extract title from template');
      process.exit(1);
    }
    
    // Create ticket
    await createTicket(title, description, issueType, projectKey, epicKey);
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
