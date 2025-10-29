# Claude Development Guidelines for FP Realty

## Core Principles

### 1. Always Check Existing Code for Patterns
Before implementing any new feature or making changes:
- Search the codebase for similar implementations
- Follow existing architectural patterns and conventions
- Match the coding style, naming conventions, and file structure already in use
- Look for existing utilities, components, or functions that can be reused
- Ensure consistency with how similar problems are solved elsewhere in the project

### 2. Read Files Before Editing
- **ALWAYS** use the Read tool to examine a file's current contents before attempting to edit it
- Understand the context and structure of the code you're modifying
- Verify that the code you plan to change exists and is in the expected format
- Check for dependencies and related code that might be affected by your changes

### 3. Work One Change at a Time
- Complete one change fully before moving to the next
- Do NOT make multiple changes synchronously or in parallel
- Follow this workflow:
  1. Read and understand the code
  2. Make a single, focused change
  3. Verify the change is correct
  4. Move to the next change
- This approach prevents:
  - Conflicting edits
  - Lost context
  - Incomplete implementations
  - Difficulty tracking what was changed

### 4. Avoid setTimeout for State Management
- **NEVER** use `setTimeout` to wait for state changes or component initialization
- `setTimeout` is imprecise and creates race conditions
- Instead, use proper React patterns:
  - Event listeners for DOM events
  - `useEffect` dependencies for state changes
  - Callback refs for component mounting
  - MutationObserver for DOM changes
  - Promises/async-await for asynchronous operations
- Only use `setTimeout` for intentional delays (e.g., user-facing animations, debouncing user input)

### 5. Database Schema Changes and Saved Searches
- **IMPORTANT**: When changing search query parameters or filter fields, consider backward compatibility with existing saved searches
- Saved searches are stored in the database and contain serialized filter criteria (propertyTypes, bounds, price ranges, etc.)
- Before deploying schema changes:
  1. Check existing saved searches in the database
  2. Verify that old saved search data will work with new field names/structures
  3. If incompatible changes are needed, clean up old database records first
  4. Add fallback logic in the code to handle missing or invalid fields
- Examples of fields that affect saved searches:
  - `propertyTypes` array
  - `bounds` object structure
  - `statuses` array
  - Price/bed/bath filter fields
- When in doubt, add defensive checks: `search.propertyTypes || defaultPropertyTypes`

### 6. Checking Listing Data from the API
- When asked to check listing data, use curl to query the Bridge Data Output API directly
- **Default approach** (unless specific fields are requested):
  - Use a limit of 100 records
  - Do NOT apply filters (except limit)
  - Let the API return its default fields
- **Example command**:
  ```bash
  curl -s "https://api.bridgedataoutput.com/api/v2/iresds/listings?access_token=${NEXT_PUBLIC_BROWSER_TOKEN}&limit=100" | python3 -m json.tool
  ```
- When specific fields are needed, use the `fields` parameter:
  ```bash
  curl -s "https://api.bridgedataoutput.com/api/v2/iresds/listings?access_token=${NEXT_PUBLIC_BROWSER_TOKEN}&limit=100&fields=ListingKey,ListPrice,DaysOnMarket,UnparsedAddress" | python3 -m json.tool
  ```
- This helps verify available fields, data structures, and validate API responses
- API credentials are stored in `.env.local` file (NEXT_PUBLIC_BROWSER_TOKEN)

## Workflow Summary

1. **Research** - Search for existing patterns and similar code
2. **Read** - Always read files before editing them
3. **Focus** - Make one change at a time, sequentially
4. **Verify** - Check that each change is complete before proceeding
5. **Consistency** - Match existing patterns and conventions throughout
