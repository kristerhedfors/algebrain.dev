/**
 * Player Switcher Component
 * Provides a dropdown to switch between existing players or create a new one
 */

class PlayerSwitcher {
  /**
   * Create a player switcher component
   * @param {Function} onPlayerChange - Callback when player changes, receives playerName
   */
  constructor(onPlayerChange) {
    this.onPlayerChange = onPlayerChange;
    this.isOpen = false;
  }

  /**
   * Render the player switcher button and dropdown
   * @returns {string} HTML string for the component
   */
  render() {
    const currentPlayer = PlayerStorage.getCurrentPlayer();
    const allPlayers = PlayerStorage.getAllPlayerNames();
    const playerId = `player-switcher-${Math.random().toString(36).substr(2, 9)}`;

    return `
      <div class="player-switcher" style="position: relative; display: inline-block;">
        <button
          id="${playerId}-btn"
          class="player-switcher-btn"
          onclick="window.playerSwitcherToggle('${playerId}')"
          style="
            background: var(--color-bg-alt);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-2) var(--space-3);
            font-size: var(--font-size-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: var(--space-2);
            transition: all 0.2s;
          "
          onmouseover="this.style.background='var(--color-bg)'; this.style.borderColor='var(--color-primary)'"
          onmouseout="this.style.background='var(--color-bg-alt)'; this.style.borderColor='var(--color-border)'"
        >
          <span style="font-weight: var(--font-weight-semibold);">👤 ${currentPlayer}</span>
          <span style="font-size: var(--font-size-xs); opacity: 0.7;">▼</span>
        </button>

        <div
          id="${playerId}-dropdown"
          class="player-switcher-dropdown"
          style="
            display: none;
            position: absolute;
            top: calc(100% + var(--space-2));
            right: 0;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            max-width: 280px;
            z-index: 1000;
            overflow: hidden;
          "
        >
          <div style="padding: var(--space-3); border-bottom: 1px solid var(--color-border); background: var(--color-bg-alt);">
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              Switch Player
            </div>
          </div>

          ${allPlayers.length > 0 ? `
            <div style="max-height: 200px; overflow-y: auto;">
              ${allPlayers.map(name => `
                <button
                  onclick="window.playerSwitcherSelect('${playerId}', '${name.replace(/'/g, "\\'")}')"
                  style="
                    width: 100%;
                    text-align: left;
                    padding: var(--space-3) var(--space-4);
                    background: ${name === currentPlayer ? 'var(--color-primary-light)' : 'transparent'};
                    border: none;
                    cursor: pointer;
                    font-size: var(--font-size-sm);
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--color-text);
                  "
                  onmouseover="if ('${name}' !== '${currentPlayer}') this.style.background='var(--color-bg-alt)'"
                  onmouseout="if ('${name}' !== '${currentPlayer}') this.style.background='transparent'"
                >
                  ${name === currentPlayer ? '<span style="color: var(--color-primary);">✓</span>' : '<span style="opacity: 0;">✓</span>'}
                  <span>${name}</span>
                </button>
              `).join('')}
            </div>
            <div style="border-top: 1px solid var(--color-border);"></div>
          ` : ''}

          <div style="padding: var(--space-3);">
            <form id="${playerId}-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <input
                type="text"
                id="${playerId}-input"
                placeholder="New player name"
                maxlength="20"
                style="
                  padding: var(--space-2) var(--space-3);
                  border: 1px solid var(--color-border);
                  border-radius: var(--radius-sm);
                  font-size: var(--font-size-sm);
                  width: 100%;
                  box-sizing: border-box;
                "
              />
              <button
                type="submit"
                class="btn-primary"
                style="width: 100%; padding: var(--space-2); font-size: var(--font-size-sm);"
              >
                Create Player
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize event handlers (call after rendering)
   * @param {string} playerId - The unique ID for this player switcher instance
   */
  initialize(playerId) {
    const form = document.getElementById(`${playerId}-form`);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById(`${playerId}-input`);
        const newName = input.value.trim();

        if (newName.length > 0) {
          PlayerStorage.setCurrentPlayer(newName);
          this.close(playerId);
          if (this.onPlayerChange) {
            this.onPlayerChange(newName);
          }
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById(`${playerId}-dropdown`);
      const btn = document.getElementById(`${playerId}-btn`);
      if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        this.close(playerId);
      }
    });
  }

  /**
   * Toggle dropdown visibility
   * @param {string} playerId - The unique ID for this player switcher instance
   */
  toggle(playerId) {
    const dropdown = document.getElementById(`${playerId}-dropdown`);
    if (dropdown) {
      if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        this.isOpen = true;
      } else {
        dropdown.style.display = 'none';
        this.isOpen = false;
      }
    }
  }

  /**
   * Close the dropdown
   * @param {string} playerId - The unique ID for this player switcher instance
   */
  close(playerId) {
    const dropdown = document.getElementById(`${playerId}-dropdown`);
    if (dropdown) {
      dropdown.style.display = 'none';
      this.isOpen = false;
    }
  }

  /**
   * Handle player selection
   * @param {string} playerId - The unique ID for this player switcher instance
   * @param {string} playerName - Selected player name
   */
  selectPlayer(playerId, playerName) {
    PlayerStorage.setCurrentPlayer(playerName);
    this.close(playerId);
    if (this.onPlayerChange) {
      this.onPlayerChange(playerName);
    }
  }
}

/**
 * Global helper functions for inline event handlers
 */
window.playerSwitcherToggle = function(playerId) {
  const instance = window[`playerSwitcherInstance_${playerId}`];
  if (instance) {
    instance.toggle(playerId);
  }
};

window.playerSwitcherSelect = function(playerId, playerName) {
  const instance = window[`playerSwitcherInstance_${playerId}`];
  if (instance) {
    instance.selectPlayer(playerId, playerName);
  }
};

/**
 * Helper function to easily add a player switcher to any element
 * @param {string|HTMLElement} containerSelector - CSS selector or element to append to
 * @param {Function} onPlayerChange - Callback when player changes
 * @returns {PlayerSwitcher} The player switcher instance
 */
function createPlayerSwitcher(containerSelector, onPlayerChange) {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container) {
    console.error('Player switcher container not found');
    return null;
  }

  const switcher = new PlayerSwitcher(onPlayerChange);
  const html = switcher.render();
  container.innerHTML = html;

  // Extract the playerId from the rendered HTML
  const btn = container.querySelector('[id$="-btn"]');
  if (btn) {
    const playerId = btn.id.replace('-btn', '');
    window[`playerSwitcherInstance_${playerId}`] = switcher;
    switcher.initialize(playerId);
  }

  return switcher;
}

/**
 * Make PlayerSwitcher available globally
 */
window.PlayerSwitcher = PlayerSwitcher;
window.createPlayerSwitcher = createPlayerSwitcher;
