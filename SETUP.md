# Setup Guide - RAGE MP Server Starter

## Quick Start

### 1. Prerequisites

Make sure you have installed:
- **Node.js** 16 or higher - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **RAGE MP Server** - [Download](https://rage.mp/)

### 2. Installation

```bash
# Navigate to your server directory
cd path/to/your/server

# Clone or extract the starter kit
git clone https://github.com/20XMAS24/ragemp-server-starter.git packages/starter-kit
cd packages/starter-kit

# Install dependencies
npm install
```

### 3. Build & Start

```bash
# Build TypeScript to JavaScript
npm run build

# Start the server
npm start
```

You should see:
```
🚀 RAGE MP Server running on http://localhost:3000
📚 API Documentation:
   Auth: POST /api/auth/register, /api/auth/login
   Player: GET /api/player/info, /api/player/all
   Job: GET /api/job/list, POST /api/job/hire, /api/job/fire
   Police: POST /api/police/recruit, /api/police/duty/in
```

### 4. Configure Client

Update your client script to point to the server:

```typescript
// In your client startup code
const SERVER_URL = 'http://localhost:3000';

// Example: Login
mp.gui.openUrl(SERVER_URL + '/api/auth/login');
```

### 5. Test the Server

Using curl or Postman:

```bash
# Register a new player
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testplayer", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testplayer", "password": "password123"}'

# Get player info
curl http://localhost:3000/api/player/info?playerId=<player_id>

# Get all jobs
curl http://localhost:3000/api/job/list
```

## Development Workflow

### Watch Mode

During development, use watch mode to auto-compile TypeScript:

```bash
npm run watch
```

Then in another terminal:

```bash
npm run dev
```

### File Structure

When making changes:

1. **Add a new service?** → Create file in `src/services/`
2. **Add a new route?** → Create file in `src/routes/`, import in `index.ts`
3. **Add new types?** → Update `src/types/index.ts`
4. **Update UI?** → Edit `src/public/*.html` files

### Database Files

Data is stored in `database/` folder:

```
database/
├── data.json          # Player accounts and stats
└── jobs.json          # Job definitions (auto-created)
```

These are JSON files you can edit directly or through API calls.

## Common Tasks

### Add a New Job Type

1. Edit `database/jobs.json`:
```json
{
  "jobs": {
    "newjob": {
      "id": "newjob",
      "name": "New Job Name",
      "salary": 1000,
      "maxRank": 3,
      "description": "Job description"
    }
  }
}
```

2. Update `src/public/menu.html` Jobs tab to include the new job

### Add a New Police Feature

1. Add method to `src/services/policeService.ts`
2. Create route in `src/routes/police.ts`
3. Update CEF UI in `src/public/menu.html`

### Create a New Module

1. Create service: `src/services/myService.ts`
2. Create route: `src/routes/my.ts`
3. Import in `src/index.ts`:
   ```typescript
   import myRoutes from './routes/my';
   app.use('/api/my', myRoutes);
   ```

## Troubleshooting

### Port Already in Use

Change the port in `src/index.ts`:

```typescript
const PORT = 3001; // Change from 3000
```

### Database Errors

Ensure the `database/` folder exists:
```bash
mkdir -p database
```

### TypeScript Compilation Errors

Rebuild the project:
```bash
npm run build
```

## Next Steps

1. **Customize Jobs** - Edit job definitions and salaries
2. **Add Houses System** - Create housing database and routes
3. **Add Vehicles** - Implement vehicle ownership
4. **Add Gangs** - Create gang system with territories
5. **Add Admin Commands** - Create admin panel for management

## Performance Tips

- Keep database files optimized
- Implement caching for frequently accessed data
- Use pagination for player lists
- Add request rate limiting
- Consider database migration to SQLite/MySQL for large servers

## Security Checklist

- [ ] Hash passwords (implement bcrypt)
- [ ] Use environment variables for secrets
- [ ] Implement input validation
- [ ] Add rate limiting
- [ ] Use HTTPS in production
- [ ] Add admin authentication
- [ ] Implement logging
- [ ] Regular backups of database

## Support

- Check `README.md` for API documentation
- Review example client code in `client/client.ts`
- Check CEF UI files in `src/public/`

Happy coding! 🚀
