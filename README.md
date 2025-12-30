# SpinWheel Backend (Category Spinner)

A small Node.js + Express backend for the "Spin Wheel / Category Spinner" app.
This service provides authentication (OTP + JWT), category CRUD with image upload,
and a public endpoint that returns categories suitable for a spinner UI.

## Features

- Authentication: register, login, verify OTP, resend OTP, forgot/reset password
- JWT-based protected routes for user and category operations
- Category management: create, read, update, delete
- Image upload for categories (stored in `uploads/category-images`)
- Public endpoint for spinner: `GET /categories/spinner/all`
- Email notifications via configurable SMTP settings

## Tech & Dependencies

- Node.js (>=14)
- Express
- MongoDB (mongoose)
- JWT for tokens
- Multer for file uploads
- Nodemailer for sending emails

## Repository structure (key files)

- `server.js` — app entry
- `config/db.js` — MongoDB connection
- `config/multer.js` — multer setup for uploads
- `controllers/` — Express route handlers
- `routes/` — `authRoutes.js`, `categoryRoutes.js`, `index.js`
- `services/` — business logic used by controllers
- `model/` — Mongoose models (`user.js`, `category.js`, `otp.js`)
- `uploads/category-images/` — stored category images
- `utils/emailService.js` — email helper
- `utils/fileCleanup.js` — helpers for cleaning up orphaned files

## Environment Variables

Create a `.env` file in the project root with the following variables (example values):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spinwheel
JWT_SECRET=your_jwt_secret_here
STATIC_OTP=123456            # optional: a static OTP used in certain flows
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Notes:
- `JWT_SECRET` is required for signing tokens.
- `MONGODB_URI` should point to your MongoDB server (Atlas or local).
- `EMAIL_*` settings are required for sending OTP/notification emails.

## Installation

1. Clone the repo and change into the project folder:

```bash
git clone <repo-url>
cd SpinWheel_Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` with the variables described above.

## Running

- Development (auto-restarts with `nodemon`):

```bash
npm run dev
```

- Production / simple start:

```bash
npm start
```

The server default port is `process.env.PORT` or `5000`.

## API Overview

Base API path: `/api` (if you mount the routes under `/api`; otherwise see `server.js`).

Auth routes (public):

- `POST /auth/register` — register a new user (body: name, email, password, phone, etc.)
- `POST /auth/login` — login with email and password (returns JWT)
- `POST /auth/verify-otp` — verify OTP during registration/login flows
- `POST /auth/resend-otp` — request a new OTP to be sent via email
- `POST /auth/forgot-password` — start password reset flow
- `POST /auth/reset-password` — complete password reset
- `GET /auth/me` — (protected) get current user profile (requires Authorization: Bearer <token>)

Category routes (protected except spinner):

- `POST /categories/` — create category (protected, multipart `image` field allowed)
- `GET /categories/` — list categories (protected)
- `GET /categories/:id` — get category by id (protected)
- `PUT /categories/:id` — update category (protected, multipart `image` allowed)
- `DELETE /categories/:id` — delete category (protected)
- `GET /categories/spinner/all` — public route returning categories formatted for spinner

Example: fetch spinner categories

```bash
curl http://localhost:5000/categories/spinner/all
```

Example: register (using `curl`)

```bash
curl -X POST http://localhost:5000/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Jane","email":"jane@example.com","password":"pass123"}'
```

Protected requests require header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Uploads

- Category images are stored in `uploads/category-images/`.
- `config/multer.js` handles storage and file naming.
- Use multipart/form-data with the `image` key when creating/updating categories.

## Validation & Error Handling

- Request validation is done using `joi` / custom validation in `validation/`.
- Responses use a centralized response handler in `middleware/responseHandler.js` and constants in `constants/responseConstants.js`.

## Tests & Linting

- This repo does not include tests at the moment. If you'd like, I can scaffold basic unit or integration tests (Jest + supertest) for key routes.

## Development Tips

- Keep `NODE_ENV=development` while working locally.
- If using MongoDB Atlas, set `MONGODB_URI` accordingly and allow your IP.
- If email isn't required during local dev, you can set dummy SMTP credentials or use services like Mailtrap for testing.

## Next steps / Optional additions

- Add a Postman collection or OpenAPI spec for the API
- Add unit and integration tests
- Add CI (GitHub Actions) and Dockerfile for containerized runs

## License & Contributing

Feel free to open issues or PRs. Add a license file if you want to make the project public.

