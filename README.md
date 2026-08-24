# GlobalNews CMS Backend

Node.js + Express + SQLite starter for a real news CMS. Includes JWT login, roles, posts CRUD, categories, users, image upload API, public posts API, and an editable admin dashboard.

## Local setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Change `JWT_SECRET` and `ADMIN_PASSWORD`.
4. Run `npm install` then `npm start`.
5. Open `http://localhost:3000/admin/`.

## API
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- GET/POST/PUT/DELETE `/api/posts`
- GET/POST/DELETE `/api/categories`
- GET/POST `/api/users`
- POST `/api/media/upload`
- GET `/api/public/posts`

For a large publication, use PostgreSQL and object storage instead of SQLite/local uploads.
