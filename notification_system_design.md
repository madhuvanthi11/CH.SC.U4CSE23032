# Stage 1

## Priority Inbox Design

### Approach
The Priority Inbox displays the top 'n' most important unread notifications using a combination of type weight and recency.

### Priority Score Formula
score = (typeWeight × 10^13) + timestamp_in_ms

### Type Weights
- Placement → 3 (highest)
- Result → 2
- Event → 1 (lowest)

### How it works
1. Fetch all notifications from the API (paginated, max 10 per page)
2. Assign a priority score to each notification based on type weight and timestamp
3. Sort by score in descending order
4. Return top N notifications (default: 10, user can select 5/10/15/20)

### Handling New Notifications
Since new notifications have a more recent timestamp, they naturally get a higher recency score. This means the top N list updates automatically as new notifications arrive — no manual intervention needed. The slider lets users control how many priority notifications to view.

# Stage 2

## Frontend Design

### Tech Stack
- Next.js (App Router) with TypeScript
- Material UI for styling
- API proxy routes to avoid CORS issues

### Pages
1. **All Notifications** (`/`) — Shows paginated notifications with filter by type (Placement/Result/Event). Click to mark as viewed.
2. **Priority Inbox** (`/priority`) — Shows top N priority notifications sorted by weight + recency. Slider to adjust N.

### Key Features
- New vs Viewed distinction (blue border = new, grey = viewed)
- Filter by notification type
- Pagination on all notifications page
- Logging middleware integrated on every API call and page load
- API proxy via Next.js route handlers to handle CORS
