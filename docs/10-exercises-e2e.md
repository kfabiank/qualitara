# 10 Exercises E2E Checklist (Staff Interview)

Use this as an execution checklist. Mark each item when completed.

## Global Pre-Check
- [ ] Backend runs: `cd /Users/fmoya/Documents/Staff Interview/backend && npm run dev`
- [ ] Frontend runs: `cd /Users/fmoya/Documents/Staff Interview/frontend && npm run dev`
- [ ] Backend health: `curl http://localhost:4000/health`
- [ ] Frontend page: open `http://localhost:3000/posts`

---

## 1) Add `GET /users/:id/posts`

### Files
- [ ] `backend/src/services/jsonplaceholder.ts` (add `fetchUserPosts`)
- [ ] `backend/src/routes/posts.ts` (add `GET /users/:id/posts`)
- [ ] `frontend/src/app/api/users/[id]/posts/route.ts` (new proxy route)
- [ ] `frontend/src/lib/api.ts` (add `getUserPosts`)
- [ ] `frontend/src/app/users/[id]/posts/page.tsx` (new UI page)

### Validation
- [ ] `curl http://localhost:4000/api/users/1/posts`
- [ ] Open `http://localhost:3000/users/1/posts`

---

## 2) Add pagination to `GET /posts`

### Files
- [ ] `backend/src/routes/posts.ts` (handle `page` + `limit`)
- [ ] `frontend/src/app/api/posts/route.ts` (forward query params)
- [ ] `frontend/src/lib/api.ts` (support query object)
- [ ] `frontend/src/app/posts/page.tsx` or `frontend/src/components/PostsList.tsx` (prev/next controls)

### Validation
- [ ] `curl "http://localhost:4000/api/posts?page=1&limit=10"`
- [ ] `curl "http://localhost:4000/api/posts?page=2&limit=10"`
- [ ] UI page changes page correctly

---

## 3) Add search filter by title

### Files
- [ ] `backend/src/routes/posts.ts` (`search` query)
- [ ] `frontend/src/app/api/posts/route.ts` (forward `search`)
- [ ] `frontend/src/lib/api.ts` (accept `search`)
- [ ] `frontend/src/components/PostsList.tsx` (search input)

### Validation
- [ ] `curl "http://localhost:4000/api/posts?search=qui"`
- [ ] UI filters by title

---

## 4) Add `DELETE /posts/:id`

### Files
- [ ] `backend/src/services/jsonplaceholder.ts` (add `deletePost`)
- [ ] `backend/src/routes/posts.ts` (add `DELETE /posts/:id`)
- [ ] `frontend/src/app/api/posts/[id]/route.ts` (add `DELETE`)
- [ ] `frontend/src/lib/api.ts` (add `deletePost`)
- [ ] `frontend/src/components/PostDetail.tsx` or list item (add delete action)

### Validation
- [ ] `curl -i -X DELETE http://localhost:4000/api/posts/1`
- [ ] UI removes post from current state

---

## 5) N+1 demo and batched fix

### Files
- [ ] `backend/src/services/jsonplaceholder.ts` (add `fetchAllComments`)
- [ ] `backend/src/routes/posts.ts` (add `/posts-n-plus-1`)
- [ ] `backend/src/routes/posts.ts` (add `/posts-with-comments`)
- [ ] `frontend/src/app/api/posts-n-plus-1/route.ts` (new)
- [ ] `frontend/src/app/api/posts-with-comments/route.ts` (new)
- [ ] `frontend/src/lib/api.ts` (add demo methods)
- [ ] Optional: `frontend/src/app/n-plus-1/page.tsx` (compare both)

### Validation
- [ ] `curl http://localhost:4000/api/posts-n-plus-1`
- [ ] `curl http://localhost:4000/api/posts-with-comments`
- [ ] Explain query/call-count difference clearly

---

## 6) Add `PUT /posts/:id` (full update)

### Files
- [ ] `backend/src/routes/posts.ts` (new `PutPostSchema` + route)
- [ ] `backend/src/services/jsonplaceholder.ts` (add `putPost`)
- [ ] `frontend/src/app/api/posts/[id]/route.ts` (add `PUT`)
- [ ] `frontend/src/lib/api.ts` (add `putPost`)
- [ ] UI form for full replacement (optional separate form)

### Validation
- [ ] `curl -X PUT http://localhost:4000/api/posts/1 -H "Content-Type: application/json" -d '{"title":"A","body":"B","userId":1}'`

---

## 7) UI loading/error/empty states

### Files
- [ ] `frontend/src/app/posts/page.tsx`
- [ ] `frontend/src/app/posts/[id]/page.tsx`
- [ ] Optional reusable component: `frontend/src/components/StateMessage.tsx`

### Validation
- [ ] Backend off => clear error message, no runtime crash
- [ ] Empty dataset => empty state shown
- [ ] Loading transition acceptable

---

## 8) Add logging middleware

### Files
- [ ] `backend/src/app.ts` (request timing middleware)

### Validation
- [ ] Request logs include method/path/status/duration
- [ ] `curl http://localhost:4000/api/posts` prints one log line

---

## 9) Refactor to Controller-Service pattern

### Files
- [ ] `backend/src/controllers/posts.controller.ts` (new)
- [ ] `backend/src/services/posts.service.ts` (new)
- [ ] `backend/src/routes/posts.ts` (wire controller handlers)

### Validation
- [ ] Existing endpoints still work
- [ ] No behavior regression on `/api/posts` and `/api/posts/:id`

---

## 10) Add auth guard (mock JWT)

### Files
- [ ] `backend/src/middleware/auth.ts` (new guard)
- [ ] `backend/src/routes/posts.ts` (protect POST/PATCH/DELETE)
- [ ] Optional: frontend API calls include bearer token

### Validation
- [ ] No token => `401`
- [ ] Invalid token => `401`
- [ ] Valid token with missing role => `403` (if role check added)
- [ ] Valid token => protected route works

---

## Final Interview Dry Run
- [ ] Explain architecture in 60 seconds
- [ ] Demo one backend-only endpoint via curl/Postman
- [ ] Demo one full flow in UI
- [ ] Explain one tradeoff (e.g., JSONPlaceholder non-persistence)
- [ ] Explain one performance topic (N+1)
- [ ] Explain one REST/status-code decision

## Notes
- JSONPlaceholder does not persist writes. Mention this proactively.
- Keep scope tight: finish one exercise end-to-end rather than many half-done.
