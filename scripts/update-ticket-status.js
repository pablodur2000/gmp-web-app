#!/usr/bin/env node
/**
 * Update GMP Jira ticket status
 * 
 * Usage:
 *   node scripts/update-ticket-status.js GMP-40
 *   node scripts/update-ticket-status.js GMP-40 GMP-41 GMP-42
 */

import 'dotenv/config';
import fetch from 'node-fetch';

// Jira configuration from environment variables
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://pablo-durandev.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'pablod082000@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Validate required environment variables
if (!JIRA_API_TOKEN) {
  console.error('❌ Error: JIRA_API_TOKEN environment variable is required');
  console.error('Set it in .env file in project root: JIRA_API_TOKEN=your_token');
  process.exit(1);
}

const JIRA_API_BASE_URL = `${JIRA_BASE_URL}/rest/api/3`;
const JIRA_AUTH = `Basic ${Buffer.from(JIRA_EMAIL + ':' + JIRA_API_TOKEN).toString('base64')}`;

// Parse command line arguments
const ticketKeys = process.argv.slice(2);

if (ticketKeys.length === 0) {
  console.error('❌ Error: At least one ticket key is required');
  console.error('\nUsage:');
  console.error('  node scripts/update-ticket-status.js <TICKET-KEY> [TICKET-KEY...]');
  console.error('\nExample:');
  console.error('  node scripts/update-ticket-status.js GMP-40');
  console.error('  node scripts/update-ticket-status.js GMP-40 GMP-41 GMP-42');
  process.exit(1);
}

/**
 * Get available transitions for a ticket
 */
async function getTransitions(issueKey) {
  const url = `${JIRA_API_BASE_URL}/issue/${issueKey}/transitions`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': JIRA_AUTH,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get transitions: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.transitions || [];
  } catch (error) {
    console.error(`Error getting transitions for ${issueKey}:`, error.message);
    return [];
  }
}

/**
 * Find transition by target status name
 */
function findTransition(transitions, targetStatus) {
  // Try exact match (case-insensitive)
  const exactMatch = transitions.find(t => 
    t.to.name.toLowerCase() === targetStatus.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch.id;
  }

  // Try common variations
  const variations = {
    'done': ['done', 'closed', 'resolved', 'complete'],
    'in progress': ['in progress', 'in development', 'in work'],
    'to do': ['to do', 'open', 'backlog']
  };

  for (const [key, values] of Object.entries(variations)) {
    if (values.includes(targetStatus.toLowerCase())) {
      const match = transitions.find(t => 
        values.some(v => t.to.name.toLowerCase() === v)
      );
      if (match) return match.id;
    }
  }

  // Return first available transition if no match found
  if (transitions.length > 0) {
    console.warn(`⚠️  No "${targetStatus}" transition found, using: ${transitions[0].to.name}`);
    return transitions[0].id;
  }

  return null;
}

/**
 * Update ticket status
 */
async function updateStatus(issueKey, transitionId) {
  const url = `${JIRA_API_BASE_URL}/issue/${issueKey}/transitions`;
  
  const payload = {
    transition: {
      id: transitionId,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': JIRA_AUTH,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update status: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error updating status for ${issueKey}:`, error.message);
    return false;
  }
}

/**
 * Update a single ticket status
 */
async function updateTicket(issueKey, targetStatus = 'Done') {
  console.log(`\n📋 Processing ${issueKey}...`);

  // Step 1: Get available transitions
  console.log(`   Getting available transitions...`);
  const transitions = await getTransitions(issueKey);
  
  if (transitions.length === 0) {
    console.error(`   ❌ No transitions available for ${issueKey}`);
    return false;
  }

  // Step 2: Find target transition
  const transitionId = findTransition(transitions, targetStatus);
  if (!transitionId) {
    console.error(`   ❌ No valid transition found for ${issueKey}`);
    return false;
  }

  // Step 3: Update status
  console.log(`   Updating status to "${targetStatus}"...`);
  const statusUpdated = await updateStatus(issueKey, transitionId);
  if (!statusUpdated) {
    console.error(`   ❌ Failed to update status for ${issueKey}`);
    return false;
  }
  console.log(`   ✅ Status updated to "${targetStatus}"`);

  return true;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Updating GMP Jira Ticket Status');
  console.log('==================================\n');
  console.log(`Tickets to update: ${ticketKeys.join(', ')}\n`);

  const results = {
    success: [],
    failed: [],
  };

  for (const ticketKey of ticketKeys) {
    const success = await updateTicket(ticketKey);
    if (success) {
      results.success.push(ticketKey);
    } else {
      results.failed.push(ticketKey);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully updated: ${results.success.length} tickets`);
  if (results.success.length > 0) {
    console.log(`   ${results.success.join(', ')}`);
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed to update: ${results.failed.length} tickets`);
    console.log(`   ${results.failed.join(', ')}`);
  }

  console.log(`\n🔗 View tickets at: ${JIRA_BASE_URL}/browse/GMP`);
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
