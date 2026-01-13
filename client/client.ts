/**
 * RAGE MP Client Script Template
 * This is a template for integrating the server with your client-side scripts
 */

/**
 * Initialize player when they spawn
 */
function initializePlayer() {
  console.log('[Client] Player initialized');

  // Hide default UI
  mp.nametags.enabled = false;
  mp.gui.chat.visible = false;

  // Load login page
  openLoginMenu();

  // Setup keyboard bindings
  setupKeyBindings();

  // Setup event listeners
  setupEventListeners();
}

/**
 * Open login menu
 */
function openLoginMenu() {
  // Load CEF with login page
  // mp.gui.openUrl('file:///' + mp.game.joaat('RAGEMPDIR') + '/client/login.html');
  console.log('[Client] Opening login menu');
}

/**
 * Open main menu
 */
function openMainMenu() {
  console.log('[Client] Opening main menu');
  // mp.gui.openUrl('file:///path/to/menu.html');
}

/**
 * Open HUD
 */
function openHUD() {
  console.log('[Client] Opening HUD');
  // mp.gui.openUrl('file:///path/to/hud.html');
}

/**
 * Setup keyboard bindings
 */
function setupKeyBindings() {
  // M key - Open menu
  mp.keys.bind(0x4D, () => {
    console.log('[Client] Menu key pressed');
    openMainMenu();
  });

  // E key - Interact
  mp.keys.bind(0x45, () => {
    console.log('[Client] Interact key pressed');
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Listen for authentication success
  mp.events.add('auth:success', (playerSession: any) => {
    console.log('[Client] Authentication successful:', playerSession);
    // Update HUD with player data
    mp.trigger('hud:update', playerSession);
  });

  // Listen for logout
  mp.events.add('logout', () => {
    console.log('[Client] Player logged out');
    openLoginMenu();
  });

  // Listen for menu close
  mp.events.add('menu:close', () => {
    console.log('[Client] Menu closed');
  });

  // Listen for notifications
  mp.events.add('hud:notify', (message: string, type: string) => {
    console.log('[Client] Notification:', message, type);
  });

  // Listen for online players update
  mp.events.add('hud:onlinePlayers', (count: number) => {
    console.log('[Client] Online players:', count);
  });
}

/**
 * Update HUD with player data
 */
function updatePlayerHUD(playerData: any) {
  console.log('[Client] Updating HUD:', playerData);
  // Trigger HUD update through CEF
  // mp.gui.execute(`updatePlayerInfo('${playerData.username}', ${playerData.money}, ${playerData.bank})`);
}

/**
 * Example: Fetch player info from server
 */
async function getPlayerInfo(playerId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/player/info?playerId=${playerId}`);
    const data = await response.json();

    if (data.success) {
      console.log('[Client] Player info:', data.data);
      return data.data;
    } else {
      console.error('[Client] Error getting player info:', data.message);
    }
  } catch (error) {
    console.error('[Client] Fetch error:', error);
  }
}

/**
 * Example: Get all jobs
 */
async function getJobsList() {
  try {
    const response = await fetch('http://localhost:3000/api/job/list');
    const data = await response.json();

    if (data.success) {
      console.log('[Client] Jobs list:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('[Client] Error fetching jobs:', error);
  }
}

/**
 * Example: Hire player for a job
 */
async function hirePlayerForJob(username: string, jobId: string) {
  try {
    const response = await fetch('http://localhost:3000/api/job/hire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, jobId })
    });

    const data = await response.json();

    if (data.success) {
      console.log('[Client] Hired successfully:', data.data);
      return data.data;
    } else {
      console.error('[Client] Hire failed:', data.message);
    }
  } catch (error) {
    console.error('[Client] Error hiring player:', error);
  }
}

/**
 * Example: Toggle on/off duty
 */
async function toggleOnDuty(username: string) {
  try {
    const response = await fetch('http://localhost:3000/api/job/duty/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    const data = await response.json();

    if (data.success) {
      console.log('[Client] Duty toggled:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('[Client] Error toggling duty:', error);
  }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializePlayer,
    openLoginMenu,
    openMainMenu,
    getPlayerInfo,
    getJobsList,
    hirePlayerForJob,
    toggleOnDuty
  };
}
