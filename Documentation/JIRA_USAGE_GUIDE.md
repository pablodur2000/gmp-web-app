# Jira Usage Guide - GMP Project

## Overview
This guide provides comprehensive instructions for using Jira to manage the GMP web application project. It covers setup, issue types, API usage, and best practices for creating and managing tickets.

## Version
**v1.0.0** - Initial Guide

---

## Table of Contents
1. [Project Information](#project-information)
2. [Setup and Configuration](#setup-and-configuration)
3. [Issue Types](#issue-types)
4. [Creating Issues via API](#creating-issues-via-api)
5. [Common Commands](#common-commands)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Project Information

### Jira Instance
- **URL**: `https://pablo-durandev.atlassian.net`
- **Project Key**: `GMP`
- **Project Name**: GMP Code
- **Project ID**: `10000`

### Available Issue Types
- **Epic** (ID: `10004`) - Large features or collections of work
- **Story** (ID: `10003`) - User-facing features
- **Task** (ID: `10001`) - General work items
- **Bug** (ID: `10002`) - Problems or errors
- **Subtask** (ID: `10005`) - Small pieces of work within a parent issue

---

## Setup and Configuration

### Authentication
Jira uses Basic Authentication with API tokens:
- **Email**: `pablod082000@gmail.com`
- **API Token**: Stored securely (not in this document)
- **Base64 Encoding**: Required for Basic Auth

### API Endpoints
- **Base URL**: `https://pablo-durandev.atlassian.net/rest/api/3`
- **Create Issue**: `POST /issue`
- **Get Issue**: `GET /issue/{issueIdOrKey}`
- **Search Issues**: `GET /search?jql={jql}`

### Environment Variables
```bash
JIRA_INSTANCE_URL=https://pablo-durandev.atlassian.net
JIRA_USER_EMAIL=pablod082000@gmail.com
JIRA_API_KEY=<your-api-token>
```

---

## Issue Types

### Epic
**Purpose**: Large features or collections of related work
- Groups multiple Stories and Tasks
- Represents major functionality areas
- Example: "HomePage - Landing Page Epic"

### Story
**Purpose**: User-facing features from a user perspective
- Describes what the user wants to achieve
- Written in user story format: "As a [user], I want [feature] so that [benefit]"
- Example: "As a visitor, I want to see featured products on the homepage"

### Task
**Purpose**: General work items that don't fit Story or Bug
- Technical implementation tasks
- Refactoring work
- Setup and configuration
- Example: "Implement auto-sliding carousel in Hero Section"

### Bug
**Purpose**: Problems, errors, or unexpected behavior
- Something that's broken
- Needs to be fixed
- Example: "Hero carousel not auto-sliding on mobile devices"

### Subtask
**Purpose**: Small pieces of work within a parent issue
- Breaks down larger issues into manageable pieces
- Must have a parent issue (Epic, Story, or Task)
- Example: "Add parallax mouse movement effect" (subtask of Hero Section Story)

---

## Creating Issues via API

### Authentication Format
All API requests require Basic Authentication:
```bash
Authorization: Basic <base64(email:api_token)>
```

### Request Format
All requests use JSON with Atlassian Document Format (ADF) for descriptions.

### Atlassian Document Format (ADF)
Jira requires descriptions in ADF format, not plain text. Example structure:

```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Your text here"
        }
      ]
    }
  ]
}
```

### Creating an Epic

**JSON Structure:**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Epic Name",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Epic description"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10004"
    }
  }
}
```

**cURL Command:**
```bash
curl.exe -u "email:api_token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "@epic.json" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue
```

### Creating a Story

**JSON Structure:**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Story Title",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "As a [user], I want [feature] so that [benefit]"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10003"
    },
    "customfield_10011": "GMP-4"
  }
}
```

**Note**: `customfield_10011` is the Epic Link field. Replace `GMP-4` with your Epic key.

### Creating a Task

**JSON Structure:**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Task Title",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Task description"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10001"
    },
    "customfield_10011": "GMP-4"
  }
}
```

### Creating a Bug

**JSON Structure:**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Bug Title",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Bug description and steps to reproduce"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10002"
    }
  }
}
```

### Creating a Subtask

**JSON Structure:**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Subtask Title",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Subtask description"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10005"
    },
    "parent": {
      "key": "GMP-5"
    }
  }
}
```

**Note**: `parent.key` must reference an existing Epic, Story, or Task.

---

## Common Commands

### Create Issue from JSON File
```bash
curl.exe -u "email:api_token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "@issue.json" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue
```

### Get Issue Details
```bash
curl.exe -u "email:api_token" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue/GMP-4
```

### Search Issues (JQL)
```bash
curl.exe -u "email:api_token" \
  "https://pablo-durandev.atlassian.net/rest/api/3/search?jql=project=GMP%20ORDER%20BY%20created%20DESC&maxResults=10"
```

### List All Projects
```bash
curl.exe -u "email:api_token" \
  https://pablo-durandev.atlassian.net/rest/api/3/project
```

### Get Project Issue Types
```bash
curl.exe -u "email:api_token" \
  https://pablo-durandev.atlassian.net/rest/api/3/project/GMP
```

### PowerShell Helper Function
```powershell
function Create-JiraIssue {
    param(
        [string]$JsonFile,
        [string]$Email = "pablod082000@gmail.com",
        [string]$ApiToken = "your-token"
    )
    
    $cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Email}:${ApiToken}"))
    $body = Get-Content $JsonFile -Raw
    
    $response = Invoke-RestMethod `
        -Uri "https://pablo-durandev.atlassian.net/rest/api/3/issue" `
        -Method Post `
        -Headers @{
            Authorization = "Basic $cred"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    return $response
}
```

---

## Best Practices

### Epic Structure
1. **One Epic per Page/Feature Area**
   - Example: "HomePage - Landing Page Epic"
   - Example: "AdminDashboardPage - Admin Panel Epic"

2. **Epic Description Should Include:**
   - Overview of the feature area
   - List of major components/sections
   - Related pages or dependencies

### Story Structure
1. **User Story Format:**
   - "As a [user type], I want [feature] so that [benefit]"
   - Example: "As a visitor, I want to see featured products on the homepage so that I can discover popular items"

2. **Story Description Should Include:**
   - Acceptance criteria
   - Technical notes (if needed)
   - Dependencies

### Task Structure
1. **Clear, Actionable Titles:**
   - ✅ "Implement auto-sliding carousel in Hero Section"
   - ❌ "Carousel work"

2. **Task Description Should Include:**
   - Implementation details
   - Technical requirements
   - Testing notes

### Bug Structure
1. **Clear Title Describing the Issue:**
   - ✅ "Hero carousel not auto-sliding on mobile devices"
   - ❌ "Carousel broken"

2. **Bug Description Should Include:**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (browser, device, etc.)

### Subtask Structure
1. **Break Down Large Stories/Tasks:**
   - Each subtask should be completable in 1-4 hours
   - Clear, specific titles

2. **Link to Parent:**
   - Always specify parent issue key
   - Group related subtasks under same parent

### Naming Conventions
- **Epics**: `[Page/Feature] - [Description] Epic`
  - Example: `HomePage - Landing Page Epic`
  - Example: `AdminDashboardPage - Admin Panel Epic`

- **Stories**: `[User Story Description]`
  - Example: `As a visitor, I want to see featured products on the homepage`
  - Example: `As an admin, I want to manage products from the dashboard`

- **Tasks**: `[Action] [Component/Feature]`
  - Example: `Implement auto-sliding carousel in Hero Section`
  - Example: `Add map modal with Leaflet integration`

- **Bugs**: `[Component] [Issue Description]`
  - Example: `Hero carousel not auto-sliding on mobile devices`
  - Example: `Map modal not closing on outside click`

---

## Examples

### Example 1: Creating HomePage Epic

**File: `epic-homepage.json`**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "HomePage - Landing Page Epic",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Epic for managing all features and improvements related to the HomePage (Landing Page) of the GMP web application."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "This epic includes:"
            }
          ]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Hero Section with carousel and animations"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Location & Shipping Information"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10004"
    }
  }
}
```

**Command:**
```bash
curl.exe -u "email:api_token" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "@epic-homepage.json" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue
```

### Example 2: Creating Story Under Epic

**File: `story-hero-section.json`**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "As a visitor, I want to see an engaging hero section with carousel so that I am immediately interested in the products",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "As a visitor, I want to see an engaging hero section with carousel so that I am immediately interested in the products."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Acceptance Criteria:"
            }
          ]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Hero section displays auto-sliding carousel with 4 slides"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "First visit animation plays on initial page load"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10003"
    },
    "customfield_10011": "GMP-4"
  }
}
```

### Example 3: Creating Task Under Epic

**File: `task-carousel.json`**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Implement auto-sliding carousel in Hero Section",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Implement auto-sliding carousel functionality in the Hero Section component."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Requirements:"
            }
          ]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "4 slides with different images and text"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Auto-slide every 5 seconds"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Smooth transitions between slides"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10001"
    },
    "customfield_10011": "GMP-4"
  }
}
```

### Example 4: Creating Bug Report

**File: `bug-carousel-mobile.json`**
```json
{
  "fields": {
    "project": {
      "key": "GMP"
    },
    "summary": "Hero carousel not auto-sliding on mobile devices",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "The hero carousel does not auto-slide on mobile devices (iOS Safari, Chrome Mobile)."
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Steps to Reproduce:"
            }
          ]
        },
        {
          "type": "orderedList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Open homepage on mobile device"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Wait 5 seconds"
                    }
                  ]
                }
              ]
            },
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Observe that carousel does not slide"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Expected: Carousel should auto-slide every 5 seconds"
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Actual: Carousel remains on first slide"
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Environment: iOS Safari 16.0, Chrome Mobile 110"
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10002"
    }
  }
}
```

---

## Workflow Recommendations

### 1. Page-Based Epic Structure
Create one Epic per page/feature area:
- `HomePage - Landing Page Epic` (GMP-4)
- `AdminDashboardPage - Admin Panel Epic`
- `AdminLoginPage - Admin Authentication Epic`
- `ProductDetailPage - Product Details Epic`
- `CatalogPage - Product Catalog Epic`

### 2. Story Breakdown
Under each Epic, create Stories for major features:
- Hero Section Story
- Location Section Story
- Featured Products Story
- About GMP Story

### 3. Task Breakdown
Under each Story, create Tasks for implementation:
- Implement carousel
- Add animations
- Integrate map
- Fetch products from API

### 4. Bug Tracking
Create Bugs as needed, optionally linking to Epics:
- Link to Epic if bug is specific to that feature area
- Keep standalone if bug affects multiple areas

---

## Troubleshooting

### Common Errors

**Error: "Operation value must be an Atlassian Document"**
- **Cause**: Description is plain text instead of ADF format
- **Solution**: Convert description to ADF format (see examples above)

**Error: "No valid value found"**
- **Cause**: Invalid issue type ID or project key
- **Solution**: Verify issue type IDs and project key are correct

**Error: "Field 'customfield_10011' cannot be set"**
- **Cause**: Epic Link field ID might be different
- **Solution**: Check custom field ID for Epic Link in your Jira instance

**Error: "Parent issue is required"**
- **Cause**: Subtask created without parent
- **Solution**: Add `parent.key` field to subtask JSON

### Verifying Issue Creation
After creating an issue, verify it was created:
```bash
curl.exe -u "email:api_token" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue/GMP-4
```

### Finding Custom Field IDs
To find custom field IDs (like Epic Link):
```bash
curl.exe -u "email:api_token" \
  https://pablo-durandev.atlassian.net/rest/api/3/issue/GMP-4/editmeta
```

---

## Quick Reference

### Issue Type IDs
- Epic: `10004`
- Story: `10003`
- Task: `10001`
- Bug: `10002`
- Subtask: `10005`

### Project Information
- Project Key: `GMP`
- Project ID: `10000`
- Instance URL: `https://pablo-durandev.atlassian.net`

### API Endpoints
- Create Issue: `POST /rest/api/3/issue`
- Get Issue: `GET /rest/api/3/issue/{key}`
- Search: `GET /rest/api/3/search?jql={query}`
- Projects: `GET /rest/api/3/project`

### ADF Format Helper
For simple text descriptions, use this template:
```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Your description text here"
        }
      ]
    }
  ]
}
```

---

## Notes for AI Assistant

When creating Jira issues:
1. Always use ADF format for descriptions
2. Create JSON files first, then use curl to create issues
3. Delete JSON files after successful creation
4. Verify issue creation by fetching the issue
5. Use proper issue type IDs
6. Link Stories/Tasks to Epics using `customfield_10011`
7. Link Subtasks to parents using `parent.key`
8. Follow naming conventions for consistency

---

**Note:** For current project status and ticket tracking, see [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## Changelog

### v1.0.0 (2025-12-01)
- Initial guide creation
- Documented Epic creation process
- Added examples for all issue types
- Included troubleshooting section

### v1.1.0 (2025-12-01)
- Removed project status section (moved to separate PROJECT_STATUS.md)
- Added reference to PROJECT_STATUS.md

---

## QA & Testing Ticket Organization

### ✅ QA Project Created

You have created a separate **QA project** in Jira:
- **Project Key:** `QA`
- **Project ID:** `10033`
- **Project Name:** "QA tests"
- **Board URL:** https://pablo-durandev.atlassian.net/jira/software/projects/QA/boards/34

**Status:** ✅ API access confirmed - Can create tickets via REST API

### Available Issue Types in QA Project:
- **Task** (ID: 10039)
- **Bug** (ID: 10040)
- **Story** (ID: 10041)
- **Epic** (ID: 10042)
- **Subtask** (ID: 10043)

### Recommended Approach: QA Epic (Within QA Project)

Create a dedicated Epic for all QA and testing work to keep testing tickets organized separately from feature development.

### Manual Setup in Jira UI

1. **Create QA Epic in QA Project:**
   - Go to your QA project: `https://pablo-durandev.atlassian.net/browse/QA`
   - Click "Create" button
   - Select "Epic" as issue type
   - **Summary:** `QA & Testing - Quality Assurance Epic`
   - **Description:** 
     ```
     Epic for managing all QA and testing activities, including:
     - Test case creation
     - Test execution
     - Bug reporting
     - Test automation
     - Quality assurance tasks
     ```
   - Click "Create"

2. **Create Test Cases as Stories:**
   - Create Stories under the QA Epic for test scenarios
   - Example: "Test Case: HomePage Hero Section Functionality"
   - Link to related feature Epic (e.g., GMP-4 for HomePage tests)

3. **Create Test Tasks:**
   - Create Tasks for specific test activities
   - Example: "Execute E2E tests for AdminLoginPage"
   - Link to QA Epic

4. **Report Bugs:**
   - Create Bugs in QA project and optionally link to:
     - QA Epic (QA-XX) - for tracking
     - Feature Epic in GMP project (e.g., GMP-4) - for context (use "Relates to" link)

### QA Ticket Structure Example

```
QA & Testing Epic (QA-XX) - In QA Project
├── Story: Test Case - HomePage Hero Section
│   ├── Task: Execute manual test for carousel
│   ├── Task: Execute E2E test for hero section
│   └── Bug: Carousel not auto-sliding on mobile
├── Story: Test Case - AdminLoginPage Authentication
│   ├── Task: Test login with valid credentials
│   ├── Task: Test login with invalid credentials
│   └── Bug: Error message not displaying correctly
└── Story: Test Case - CatalogPage Filtering
    ├── Task: Test category filtering
    └── Task: Test inventory status filtering
```

### Cross-Project Linking

Since QA is a separate project from GMP, you can link tickets:

1. **Link QA Test Cases to GMP Features:**
   - In QA project ticket, use "Relates to" link
   - Link to GMP project Epic (e.g., GMP-4)
   - This shows which features are being tested

2. **JQL to Find Related Tickets:**
   - `project = QA AND "Relates to" = GMP-4` - Find all QA tickets related to HomePage Epic
   - `project = GMP AND issueFunction in linkedIssuesOf("project = QA")` - Find GMP tickets with QA links

### QA Ticket Types (In QA Project)

- **Epic:** QA & Testing Epic (parent for all QA work) - Use ID: 10042
- **Story:** Test cases or test scenarios - Use ID: 10041
- **Task:** Specific test execution tasks - Use ID: 10039
- **Bug:** Issues found during testing - Use ID: 10040
- **Subtask:** Small test steps - Use ID: 10043

### Creating QA Tickets via API

**Project Key:** `QA` (not `GMP`)

Example JSON for QA Epic:
```json
{
  "fields": {
    "project": {
      "key": "QA"
    },
    "summary": "QA & Testing - Quality Assurance Epic",
    "issuetype": {
      "id": "10042"
    }
  }
}
```

### Best Practices

1. **Link Test Cases to Features:**
   - Link test Stories to both QA Epic and feature Epic
   - This shows what features are being tested

2. **Use Clear Naming:**
   - Test Case: `[Page/Feature] - [Test Scenario]`
   - Example: `Test Case: HomePage - Hero Section Carousel`

3. **Track Test Coverage:**
   - Create one test Story per feature Story
   - Link test Story to feature Story for traceability

4. **Bug Reporting:**
   - Always link bugs to QA Epic
   - Also link to the feature Epic where the bug was found

---

## Additional Resources

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Atlassian Document Format](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)
- [JQL (Jira Query Language) Reference](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/)

