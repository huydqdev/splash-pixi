/**
 * Checks if a box is completed when a line is drawn
 * @param {string} lineId - The ID of the line that was just drawn
 * @param {Object} lines - Object containing all lines
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @returns {Array} - Array of box IDs that were completed
 */
export const checkBoxCompletion = (lineId, lines, rows, cols) => {
  const completedBoxes = [];
  
  // Parse line coordinates
  const [start, end] = lineId.split('-');
  const [startX, startY] = start.split(',').map(Number);
  const [endX, endY] = end.split(',').map(Number);
  
  // Check if the line is horizontal or vertical
  const isHorizontal = startY === endY;
  
  if (isHorizontal) {
    // For horizontal lines, check boxes above and below
    const x = Math.min(startX, endX);
    const y = startY;
    
    // Check box above (if not on top edge)
    if (y > 0) {
      const topBoxId = `${x},${y-1}`;
      const leftLineId = `${x},${y-1}-${x},${y}`;
      const rightLineId = `${x+1},${y-1}-${x+1},${y}`;
      const topLineId = `${x},${y-1}-${x+1},${y-1}`;
      
      if (lines[leftLineId] && lines[rightLineId] && lines[topLineId]) {
        completedBoxes.push(topBoxId);
      }
    }
    
    // Check box below (if not on bottom edge)
    if (y < rows - 1) {
      const bottomBoxId = `${x},${y}`;
      const leftLineId = `${x},${y}-${x},${y+1}`;
      const rightLineId = `${x+1},${y}-${x+1},${y+1}`;
      const bottomLineId = `${x},${y+1}-${x+1},${y+1}`;
      
      if (lines[leftLineId] && lines[rightLineId] && lines[bottomLineId]) {
        completedBoxes.push(bottomBoxId);
      }
    }
  } else {
    // For vertical lines, check boxes to the left and right
    const x = startX;
    const y = Math.min(startY, endY);
    
    // Check box to the left (if not on left edge)
    if (x > 0) {
      const leftBoxId = `${x-1},${y}`;
      const topLineId = `${x-1},${y}-${x},${y}`;
      const bottomLineId = `${x-1},${y+1}-${x},${y+1}`;
      const leftLineId = `${x-1},${y}-${x-1},${y+1}`;
      
      if (lines[topLineId] && lines[bottomLineId] && lines[leftLineId]) {
        completedBoxes.push(leftBoxId);
      }
    }
    
    // Check box to the right (if not on right edge)
    if (x < cols - 1) {
      const rightBoxId = `${x},${y}`;
      const topLineId = `${x},${y}-${x+1},${y}`;
      const bottomLineId = `${x},${y+1}-${x+1},${y+1}`;
      const rightLineId = `${x+1},${y}-${x+1},${y+1}`;
      
      if (lines[topLineId] && lines[bottomLineId] && lines[rightLineId]) {
        completedBoxes.push(rightBoxId);
      }
    }
  }
  
  return completedBoxes;
};

/**
 * Checks if the game is finished
 * @param {Object} boxes - Object containing all boxes
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @returns {boolean} - True if the game is finished
 */
export const isGameFinished = (boxes, rows, cols) => {
  // Game is finished when all possible boxes are filled
  const totalPossibleBoxes = (rows - 1) * (cols - 1);
  return Object.keys(boxes).length >= totalPossibleBoxes;
};

/**
 * Gets a move for the bot
 * @param {Object} lines - Object containing all lines
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @returns {string|null} - Line ID for the bot's move, or null if no move is available
 */
export const getBotMove = (lines, rows, cols) => {
  // First, check if there's a box that can be completed
  const potentialBoxCompletions = findPotentialBoxCompletions(lines, rows, cols);
  if (potentialBoxCompletions.length > 0) {
    // Complete a box if possible
    return potentialBoxCompletions[0];
  }
  
  // If no box can be completed, try to find a safe move that doesn't set up a box for the opponent
  const safeMoves = findSafeMoves(lines, rows, cols);
  if (safeMoves.length > 0) {
    // Choose a random safe move
    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }
  
  // If no safe moves, just pick any available line
  const availableLines = getAllAvailableLines(lines, rows, cols);
  if (availableLines.length > 0) {
    return availableLines[Math.floor(Math.random() * availableLines.length)];
  }
  
  return null; // No moves available
};

// Helper functions for bot logic
const findPotentialBoxCompletions = (lines, rows, cols) => {
  const potentialCompletions = [];
  
  // Check all potential boxes
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const topLineId = `${x},${y}-${x+1},${y}`;
      const rightLineId = `${x+1},${y}-${x+1},${y+1}`;
      const bottomLineId = `${x},${y+1}-${x+1},${y+1}`;
      const leftLineId = `${x},${y}-${x},${y+1}`;
      
      const linesDrawn = [
        lines[topLineId], 
        lines[rightLineId], 
        lines[bottomLineId], 
        lines[leftLineId]
      ].filter(Boolean).length;
      
      // If 3 lines are drawn, the 4th would complete a box
      if (linesDrawn === 3) {
        // Find the missing line
        if (!lines[topLineId]) potentialCompletions.push(topLineId);
        else if (!lines[rightLineId]) potentialCompletions.push(rightLineId);
        else if (!lines[bottomLineId]) potentialCompletions.push(bottomLineId);
        else if (!lines[leftLineId]) potentialCompletions.push(leftLineId);
      }
    }
  }
  
  return potentialCompletions;
};

const findSafeMoves = (lines, rows, cols) => {
  const safeMoves = [];
  const availableLines = getAllAvailableLines(lines, rows, cols);
  
  // A move is safe if it doesn't create a box with 3 sides
  for (const lineId of availableLines) {
    let isSafe = true;
    
    // Temporarily add this line
    const tempLines = { ...lines, [lineId]: true };
    
    // Check if this creates any boxes with 3 sides
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const topLineId = `${x},${y}-${x+1},${y}`;
        const rightLineId = `${x+1},${y}-${x+1},${y+1}`;
        const bottomLineId = `${x},${y+1}-${x+1},${y+1}`;
        const leftLineId = `${x},${y}-${x},${y+1}`;
        
        const linesDrawn = [
          tempLines[topLineId], 
          tempLines[rightLineId], 
          tempLines[bottomLineId], 
          tempLines[leftLineId]
        ].filter(Boolean).length;
        
        if (linesDrawn === 3) {
          isSafe = false;
          break;
        }
      }
      if (!isSafe) break;
    }
    
    if (isSafe) {
      safeMoves.push(lineId);
    }
  }
  
  return safeMoves;
};

const getAllAvailableLines = (lines, rows, cols) => {
  const availableLines = [];
  
  // Horizontal lines
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const lineId = `${x},${y}-${x+1},${y}`;
      if (!lines[lineId]) {
        availableLines.push(lineId);
      }
    }
  }
  
  // Vertical lines
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols; x++) {
      const lineId = `${x},${y}-${x},${y+1}`;
      if (!lines[lineId]) {
        availableLines.push(lineId);
      }
    }
  }
  
  return availableLines;
};