const GRID_SIZE = 8;
const CELL_SIZE = 50;
const FALL_SPEED = 5; // pixels per frame

// Gem class
class Gem {
  constructor(color, x, y) {
    this.color = color;
    this.x = x * CELL_SIZE;
    this.y = y * CELL_SIZE;
    this.image = new Image();
    this.image.src = `assets/jewel-${color}.png`;
  }
}

// Variables
let grid = [];
let score = 0;
let timer = 0;
let selectedGem = null;
let isAnimating = false;

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to create the grid
function createGrid() {
    let imagesLoaded = 0;
    const totalImages = GRID_SIZE * GRID_SIZE;
  
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const randomColor = getRandomGemColor();
        const gem = new Gem(randomColor, j, i);
        // Listen for the 'load' event on each image
        gem.image.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            // Once all images are loaded, render the grid
            render();
          }
        };
        grid[i][j] = gem;
        
      }
    }
    console.log(grid);
  }

// Function to get a random gem color
function getRandomGemColor() {
  const colors = ['blue', 'gray', 'purple', 'red', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to render the grid
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const gem = grid[i][j];
      
      const scaleFactor = 0.8;
      // Calculate the offset to center the gem within the cell
      const offsetX = (CELL_SIZE - gem.image.width * scaleFactor) / 2;
      const offsetY = (CELL_SIZE - gem.image.height * scaleFactor) / 2;
      
      // Draw the gem with the calculated offset and scaled size
      ctx.drawImage(gem.image, gem.x + offsetX, gem.y + offsetY, gem.image.width * scaleFactor, gem.image.height * scaleFactor);
    }
  }
}

canvas.addEventListener('click', handleJewelClick);


function handleJewelClick(event) {
  if (isAnimating) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left; //- rect.left;
  const mouseY = event.clientY - rect.top;//- rect.top;

  const clickedGem = getGemAtPosition(mouseX, mouseY);

  if (selectedGem === null) {
      selectedGem = clickedGem;
  } else {
      // Check if clicked gem is adjacent to the selected gem
      const selectedX = selectedGem.x;
      const selectedY = selectedGem.y;
      const clickedX = clickedGem.x;
      const clickedY = clickedGem.y;

      console.log("Selected gem coordinates: x =", selectedX, ", y =", selectedY);
      console.log("Clicked gem coordinates: x =", clickedX, ", y =", clickedY);
      console.log("selectedX / CELL_SIZE - clickedX / CELL_SIZE:  "  +  (selectedX / CELL_SIZE - clickedX / CELL_SIZE))
      console.log("selectedY / CELL_SIZE - clickedY / CELL_SIZE:  " + (selectedY / CELL_SIZE - clickedY / CELL_SIZE));

      if ((Math.abs(selectedX / CELL_SIZE - clickedX / CELL_SIZE) === 1 && selectedY / CELL_SIZE === clickedY / CELL_SIZE) ||
          (Math.abs(selectedY / CELL_SIZE - clickedY / CELL_SIZE) === 1 && selectedX / CELL_SIZE === clickedX / CELL_SIZE)) {
          // Swap gems
          swapGems(selectedGem, clickedGem);
          render(); // Render after swap (for now)
          // Check for matches
      } else {
          selectedGem = null; // Reset selected gem
      }
  }
}
  
  // Function to swap gems
  function swapGems(gem1, gem2) {
    const tempX = gem1.x;
    const tempY = gem1.y;
    gem1.x = gem2.x;
    gem1.y = gem2.y;
    gem2.x = tempX;
    gem2.y = tempY;
    console.log("Swapped from: x: " + gem1.x + " y: " + gem1.y + " swapped to x: " + gem2.x + " y: " + gem2.y);
    // Animate the swapping if needed
    // This part depends on your animation implementation
  }
  
  // Function to get the gem at a specific position
  function getGemAtPosition(x, y) {
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    return grid[row][col];  
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