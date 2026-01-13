# RAGE MP Server Starter Kit

🎮 TypeScript-based RAGE MP server with JSON database, CEF UI, and core game mechanics.

## Features

- 📋 **TypeScript** - Type-safe server code
- 💿 **JSON Database** - Simple file-based data storage
- 🎫 **CEF UI** - Beautiful HTML/CSS interfaces
- 👮 **Police System** - Law enforcement mechanics
- 💼 **Job System** - Multiple jobs with salaries
- 💵 **Money & Banking** - Cash and bank account system
- 👤 **Player Authentication** - Secure login/register system
- 🞭 **Real-time Updates** - Live player data synchronization

## Project Structure

```
src/
├── types/              # TypeScript interfaces
├── database/           # JSON database management
├── services/           # Business logic
├── routes/             # API endpoints
├─┠─ public/            # CEF UI files
├── index.ts           # Main server file

data/
├── players.json       # Player data storage
├── jobs.json          # Job definitions
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- RAGE MP server binaries

### Setup

```bash
# Clone repository
git clone https://github.com/20XMAS24/ragemp-server-starter.git
cd ragemp-server-starter

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start
```

## Usage

### Development Mode

```bash
npm run dev      # Run with ts-node
npm run watch    # Watch mode with auto-recompile
```

### Production Mode

```bash
npm run build    # Compile TypeScript
npm start        # Run compiled JavaScript
```

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Player Management

```
GET  /api/player/info          # Get player data
GET  /api/player/all           # Get all online players
POST /api/player/transfer      # Transfer money between players
POST /api/player/bank/deposit  # Deposit cash to bank
POST /api/player/bank/withdraw # Withdraw from bank
```

### Job System

```
GET  /api/job/list             # List all jobs
POST /api/job/hire             # Hire player for job
POST /api/job/fire             # Fire player from job
POST /api/job/duty/toggle      # Toggle on/off duty
POST /api/job/earn             # Earn money from job
```

### Police Department

```
POST /api/police/recruit       # Recruit police officer
POST /api/police/fire          # Fire police officer
POST /api/police/duty/in       # Clock in to duty
POST /api/police/duty/out      # Clock out from duty
POST /api/police/salary        # Pay salary to officer
GET  /api/police/officers      # List all officers
```

## Database Structure

### Player Object

```typescript
{
  id: string;                  // Unique player ID
  username: string;            // Username
  password: string;            // Password (hashed in production)
  money: number;               // Cash in hand
  bank: number;                // Bank balance
  job: string | null;          // Current job ID
  jobRank: number;             // Job rank/level
  isPolice: boolean;           // Is police officer
  isOnDuty: boolean;           // Currently on duty
  createdAt: number;           // Account creation timestamp
  lastLogin: number;           // Last login timestamp
}
```

### Default Jobs

- **Police Officer** - $1500/hour, max rank 5
- **Taxi Driver** - $1000/hour, max rank 3
- **Miner** - $1200/hour, max rank 2

## CEF Interfaces

### Login Interface (`login.html`)
- User registration
- User authentication
- Responsive design
- Error handling

### Main Menu (`menu.html`)
- Tabs: Jobs, Police, Bank, Other
- Real-time player info
- Job management
- Banking operations
- Police department access

### HUD (`hud.html`)
- Player info display
- Real-time money tracking
- Online player count
- Status notifications
- Game help text

## Client Script Integration

### Example Client-Side Code

```typescript
// Client side (GTA script)

// Listen for player spawn
multiplayerGTA.playerSpawned.addEventListener('PlayerSpawned', (event) => {
  const player = event.player;
  
  // Load HUD
  mp.nametags.enabled = false;
  mp.gui.chat.visible = false;
  
  // Open login menu
  mp.gui.openUrl('http://localhost:3000/login.html');
});

// Handle menu key (M)
mp.keys.bind(0x4D, () => {
  mp.gui.openUrl('http://localhost:3000/menu.html');
});

// Listen for authentication
mp.addEventListener('auth:success', (playerSession) => {
  console.log('Logged in as:', playerSession.username);
  // Load HUD and update player data
  mp.gui.openUrl('http://localhost:3000/hud.html');
  mp.trigger('hud:update', playerSession);
});
```

## Extending the Server

### Adding a New Job

1. Update `database/jobs.json`:
```json
"trucking": {
  "id": "trucking",
  "name": "Truck Driver",
  "salary": 1800,
  "maxRank": 4,
  "description": "Transport goods across the map"
}
```

2. Create a service in `services/truckingService.ts` if needed

3. Update menu.html to include the job

### Adding a New API Endpoint

1. Create service logic in `services/`
2. Create route handler in `routes/`
3. Import and use in `index.ts`
4. Update documentation

## Security Considerations

⚠️ **This is a starter template. For production:**

- Hash passwords (bcryptjs)
- Use JWT for authentication
- Implement input validation/sanitization
- Add rate limiting
- Use environment variables for configuration
- Implement HTTPS/WSS
- Add logging and monitoring
- Implement admin commands
- Add anti-cheat measures

## Troubleshooting

### Server won't start
- Check Node.js version (16+)
- Verify port 3000 is available
- Check database folder permissions

### Database not saving
- Ensure write permissions to `database/` folder
- Check disk space
- Verify JSON file syntax

### CEF UI not loading
- Verify server is running and accessible
- Check browser console for errors
- Ensure URLs are correct in client code

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License - Feel free to use for personal and commercial projects

## Support

For issues and questions, create an issue on GitHub.

---

**Made with ❤️ for RAGE MP community**
