#!/usr/bin/env node
/**
 * Update GMP Jira ticket description from markdown template
 * 
 * Usage:
 *   node scripts/update-jira-ticket.js GMP-40 Documentation/templates/gmp-40-category-management.md
 *   npm run update-ticket GMP-40 Documentation/templates/gmp-40-category-management.md
 */

import 'dotenv/config';
import { markdownToAdf } from 'marklassian';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Jira configuration from environment variables
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://pablo-durandev.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'pablod082000@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Parse command line arguments
const args = process.argv.slice(2);
const ticketKey = args[0];
const templateFile = args[1];

// Validate inputs
if (!ticketKey) {
  console.error('❌ Error: Ticket key is required');
  console.error('\nUsage:');
  console.error('  node scripts/update-jira-ticket.js <TICKET-KEY> <template-file>');
  console.error('\nExample:');
  console.error('  node scripts/update-jira-ticket.js GMP-40 Documentation/templates/gmp-40-category-management.md');
  process.exit(1);
}

if (!templateFile) {
  console.error('❌ Error: Template file is required');
  console.error('\nUsage:');
  console.error('  node scripts/update-jira-ticket.js <TICKET-KEY> <template-file>');
  process.exit(1);
}

if (!JIRA_API_TOKEN) {
  console.error('❌ Error: JIRA_API_TOKEN environment variable is required');
  console.error('Set it in .env file in project root: JIRA_API_TOKEN=your_token');
  console.error('Get token from: https://id.atlassian.com/manage-profile/security/api-tokens');
  process.exit(1);
}

/**
 * Parse markdown file to extract description (skip title)
 */
function parseMarkdownFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Template file not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Skip the first line (title with #)
  // Everything else is description
  const descriptionLines = [];
  let skipFirst = true;
  
  for (const line of lines) {
    if (skipFirst && line.trim().startsWith('#')) {
      skipFirst = false;
      continue;
    }
    descriptionLines.push(line);
  }
  
  return descriptionLines.join('\n').trim();
}

/**
 * Update Jira ticket description
 */
async function updateTicket(ticketKey, description) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  const url = `${JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}`;
  
  // Convert markdown to ADF
  const adf = markdownToAdf(description);
  
  const payload = {
    fields: {
      description: adf
    }
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update ticket: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Updating GMP Jira Ticket');
  console.log('============================\n');
  console.log(`Ticket: ${ticketKey}`);
  console.log(`Template: ${templateFile}\n`);

  // Parse markdown
  const description = parseMarkdownFile(templateFile);
  
  if (!description) {
    console.error('❌ Error: Description is empty');
    process.exit(1);
  }

  console.log('📝 Updating ticket description...');
  
  // Update ticket
  const result = await updateTicket(ticketKey, description);
  
  if (result.success) {
    console.log(`✅ Successfully updated ${ticketKey}`);
    console.log(`🔗 View ticket: ${JIRA_BASE_URL}/browse/${ticketKey}`);
  } else {
    console.error(`❌ Failed to update ${ticketKey}: ${result.error}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
