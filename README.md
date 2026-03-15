# RoyalNest

RoyalNest is a Node.js + Express web application for hotel discovery and room booking.  
It provides server-rendered pages with EJS, user authentication with sessions, booking management with MongoDB, and availability checks for different room types.

## Features

- Server-rendered hotel website using EJS templates
- User registration and login with hashed passwords (`bcryptjs`)
- Session-based authentication (`express-session`)
- Protected booking flow (`/book` requires login)
- Booking conflict prevention using overlap date logic
- Dynamic room availability API per hotel and room type
- Automatic cleanup of expired bookings

## Tech Stack

- Runtime: Node.js
- Backend: Express
- Database: MongoDB with Mongoose
- Templating: EJS
- Auth/session: `bcryptjs`, `express-session`
- Logging: `morgan` + custom request logger
- Dev tooling: `nodemon`

## Project Structure

```text
RoyalNest/
	server.js
	api/                # API endpoints (auth + availability)
	config/             # DB connection
	constants/          # Shared constants (room types)
	controllers/        # Route handlers
	middlewares/        # Auth, logging, error handling
	models/             # Mongoose models + hotels seed json
	routes/             # Page routes
	services/           # Booking business logic
	public/             # Static assets (CSS/JS/images)
	views/              # EJS templates
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB instance (local or cloud)

## Setup

1. Clone and enter the project directory.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/royalnest
secret=your_session_secret_here
```

Notes:
- `MONGO_URI` is required by `config/db.js`.
- `secret` is required by `express-session` in `server.js`.

4. Run the app:

```bash
npm run dev
```

or

```bash
npm start
```

5. Open:

```text
http://localhost:8080
```

## Available Scripts

- `npm start` - run server with Node
- `npm run dev` - run server with Nodemon (auto-reload)

## Routes Overview

### Page Routes

- `GET /` - Home page
- `GET /register` - Register page
- `GET /login` - Login page
- `GET /logout` - Logout current user
- `GET /book` - Booking page (protected)
- `POST /book` - Submit booking (protected)

Additional info/content pages include:
- `/about`
- `/christmas`
- `/contact`
- `/terms`
- `/Beachfront`
- `/UrbanOasis`
- `/MountainEscape`
- `/TheRitzLondon`
- `/TheRitzBali`

### API Routes

- `POST /api/login` - Login user
- `POST /api/register` - Register user
- `GET /api/availability?hotel=<name>&checkIn=<YYYY-MM-DD>&checkOut=<YYYY-MM-DD>`
	- Returns available room counts for the selected hotel and date range

## Booking Logic

The booking system prevents overbooking by:

1. Cleaning expired bookings before checks.
2. Counting overlapping bookings using date interval logic:
	 - Existing booking overlaps when:
	 - `existing.checkInDate < requested.checkOutDate`
	 - `existing.checkOutDate > requested.checkInDate`
3. Comparing overlap count against hotel room capacity from `models/hotels.json`.

If capacity is reached, booking is rejected and user receives an error message.

## Data Models

### User

- `username` (unique)
- `password` (hashed before save)

### Booking

- `userId`
- `hotelName`
- `checkInDate`
- `checkOutDate`
- `roomType`
- `fullName`
- `email`
- `phone`
- `guests`
- `specialRequests`


## License

ISC