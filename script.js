  // Constants
  const GRID_SIZE = 8;
  const JEWEL_TYPES = ['blue', 'gray', 'purple', 'red', 'yellow'];
  const CELL_SIZE = 50;
  const FALL_SPEED = 5; // pixels per frame

  const jewelImages = {
    blue: new Image(),
    gray: new Image(),
    purple: new Image(),
    red: new Image(),
    yellow: new Image()
  };

  // Load images
  jewelImages.blue.src = 'assets/jewel-blue.png';
  jewelImages.blue.onload = () => console.log('Blue jewel image loaded successfully');
  jewelImages.gray.src = 'assets/jewel-gray.png';
  jewelImages.gray.onload = () => console.log('Gray jewel image loaded successfully');
  jewelImages.purple.src = 'assets/jewel-purple.png';
  jewelImages.purple.onload = () => console.log('Purple jewel image loaded successfully');
  jewelImages.red.src = 'assets/jewel-red.png';
  jewelImages.red.onload = () => console.log('Red jewel image loaded successfully');
  jewelImages.yellow.src = 'assets/jewel-yellow.png';
  jewelImages.yellow.onload = () => console.log('Yellow jewel image loaded successfully');



  // Variables
  let grid = [];
  let score = 0;
  let timer = 0;
  let selectedJewel = null;
  let isAnimating = false;

  // Function to create the grid
  // Function to create the grid without initial matches
function createGrid() {
let hasInitialMatches = true;
while (hasInitialMatches) {
  // Generate the grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      const randomJewelType = getRandomJewelType();
      grid[i][j] = {
        color: randomJewelType,
        x: j * CELL_SIZE,
        y: i * CELL_SIZE
      };
    }
  }

  // Check for initial matches
  hasInitialMatches = checkForInitialMatches();
}

render(); // Render the grid
}

// Function to check for initial matches
function checkForInitialMatches() {
let hasMatches = false;
// Check horizontally
for (let i = 0; i < GRID_SIZE; i++) {
  for (let j = 0; j < GRID_SIZE - 2; j++) {
    if (grid[i][j].color === grid[i][j + 1].color && grid[i][j].color === grid[i][j + 2].color) {
      hasMatches = true;
      break;
    }
  }
  if (hasMatches) break;
}

// Check vertically
if (!hasMatches) {
  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      if (grid[i][j].color === grid[i + 1][j].color && grid[i][j].color === grid[i + 2][j].color) {
        hasMatches = true;
        break;
      }
    }
    if (hasMatches) break;
  }
    }

    return hasMatches;
  }


  // Function to get a random jewel type
  function getRandomJewelType() {
    return jewelImages[Math.floor(Math.random() * jewelImages.length)];
  }

  // Function to render the grid
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const jewel = grid[i][j];
        const image = jewelImages[jewel.color];
        ctx.drawImage(image, jewel.x, jewel.y, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // Function to handle jewel click
canvas.addEventListener('click', handleJewelClick);

function handleJewelClick(event) {
if (isAnimating) return;

const rect = canvas.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;

const clickedJewel = getJewelAtPosition(mouseX, mouseY);
if (selectedJewel === null) {
  selectedJewel = clickedJewel;
  // Start spinning animation
  startSpinAnimation(selectedJewel);
} else {
  // Swap jewels
  swapJewels(selectedJewel, clickedJewel);
  render(); // Render after swap (for now)
  // Reset selected jewel
  selectedJewel = null;
  // Check for matches
  checkAndRemoveMatches();
}
}

// Function to start spinning animation
function startSpinAnimation(jewel) {
const rotationSpeed = 0.1; // radians per frame
const targetRotation = Math.PI / 2; // 90 degrees
let currentRotation = 0;

const spinInterval = setInterval(() => {
  currentRotation += rotationSpeed;
  if (currentRotation >= targetRotation) {
    clearInterval(spinInterval);
  }
  render(); // Render after rotation
}, 16);
}

  // Function to get the jewel at a specific position
  function getJewelAtPosition(x, y) {
    const row = Math.floor(y / CELL_SIZE);
    const col = Math.floor(x / CELL_SIZE);
    return grid[row][col];
  }

  // Function to swap jewels
  function swapJewels(jewel1, jewel2) {
    const tempColor = jewel1.color;
    jewel1.color = jewel2.color;
    jewel2.color = tempColor;
  }

  // Function to check for matches
  function checkAndRemoveMatches() {
    let matchedJewels = [];

    // Check horizontally
    for (let i = 0; i < GRID_SIZE; i++) {
      let streak = 1;
      for (let j = 1; j < GRID_SIZE; j++) {
        if (grid[i][j].color === grid[i][j - 1].color) {
          streak++;
        } else {
          if (streak >= 3) {
            for (let k = 0; k < streak; k++) {
              matchedJewels.push(grid[i][j - 1 - k]);
            }
          }
          streak = 1;
        }
      }
      if (streak >= 3) {
        for (let k = 0; k < streak; k++) {
          matchedJewels.push(grid[i][GRID_SIZE - 1 - k]);
        }
      }
    }

    // Check vertically
    for (let j = 0; j < GRID_SIZE; j++) {
      let streak = 1;
      for (let i = 1; i < GRID_SIZE; i++) {
        if (grid[i][j].color === grid[i - 1][j].color) {
          streak++;
        } else {
          if (streak >= 3) {
            for (let k = 0; k < streak; k++) {
              matchedJewels.push(grid[i - 1 - k][j]);
            }
          }
          streak = 1;
        }
      }
      if (streak >= 3) {
        for (let k = 0; k < streak; k++) {
          matchedJewels.push(grid[GRID_SIZE - 1 - k][j]);
        }
      }
    }

    // Remove matched jewels
    if (matchedJewels.length > 0) {
      isAnimating = true;
      animateJewelsFalling(matchedJewels, () => {
        removeAndMakeFall(matchedJewels);
      });
    }
  }

  function animateJewelsFalling(matchedJewels, callback) {
    let frames = Math.ceil(CELL_SIZE / FALL_SPEED); // Use let instead of const
    const interval = setInterval(() => {
      for (const jewel of matchedJewels) {
        if (jewel.y < canvas.height - CELL_SIZE) {
          jewel.y += FALL_SPEED;
        }
      }
      render();
      frames--;
      if (frames <= 0) {
        clearInterval(interval);
        callback();
      }
    }, 16);
  }

  // Function to remove matched jewels and make jewels fall
  function removeAndMakeFall(matchedJewels) {
    matchedJewels.forEach(jewel => {
      jewel.color = null; // Set color to null to clear cell
    });
    makeJewelsFall();
  }

  // Function to make jewels fall down
  function makeJewelsFall() {
    for (let j = 0; j < GRID_SIZE; j++) {
      let emptySpaces = 0;
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        if (grid[i][j].color === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          const jewel = grid[i][j];
          const newRow = i + emptySpaces;
          grid[newRow][j].color = jewel.color;
          grid[i][j].color = null;
        }
      }
    }
    // Refill the top row with new jewels
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[0][j].color === null) {
        grid[0][j].color = getRandomJewelType();
      }
    }
    render();
    isAnimating = false; // Reset animation flag
    checkAndRemoveMatches(); // Check for new matches after jewels fall
  }

  $('#audio-control').click(function() {
    bgmusic.volume = 0.2;
    if (bgmusic.paused) {
        bgmusic.play();
        $(this).text('⏸');
    } else {
        bgmusic.pause();
        $(this).text('▶️');
    }
});

  // Start the game
  createGrid();