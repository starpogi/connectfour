var debug = false;
var debugDir = ['VERTICAL', 'HORIZONTAL', 'DIAG L->R', 'DIAG R->L'];

//--------------"CONSTANTS"--------------------------------
var MIN_WIDTH = 1090;          // Minimum width to play the game
var C_SLOPE = 0.4974;         // Coarse Movement Slope (m) for Left offset when resizing based on y = mx + b
var C_B = -339.0870           // B value in y = mx + b for coarse movement
var F_SLOPE = -0.00196;       // Fine Movement Slope (m) for adjusting piece position with respect to the board
var F_B = 3.63464;            // B value in y = mx + b for fine movement
var EMPTY = 0;					   // Designation for empty chip in the grid
var PLAYERS = 2;				   // Number of players
var COLS = 7;					   // Number of columns
var ROWS = 6;					   // Number of rows
var DIAG_MAX = 6;				   // Max ways you can go in a diagonal. Min(Cols, Rows)
var WIN_STREAK = 4;				// How many pieces in a streak to win
var MAX_PIECES = ROWS * COLS; // How many max pieces there can be before a tie is declared.
var PIECE_OFFSET = 104; 		// Piece vertical offset so that it aligns with the holes.
var LEFT_OFFSET = 33;         // Left position offset.
var CHECK_DIR = 				   // Check direction for the loop
{
	VER: 0,
	HOR: 1,
	DIAG_LR: 2,
	DIAG_RL : 3,
	MAX: 4
};

var player1 = {name: 'Player 1', color: 'red', id: 1, moves: 0, textColor: '#a73c17'};
var player2 = {name: 'Player 2', color: 'yellow', id: 2, moves: 0, textColor: '#a79b17'};

//--------------GLOBAL VARS--------------------------------
var whoWon = undefined;			// Who won?
var currentPlayer = player1;  // Who is playing.
var grid = [];			   		// COL x ROW grid for the game
var pos = [];			   		// Track last dropped object per column. Since this involves gravity, we start from the bottom-up.
var lastDrop = [0, 0];			// ROW, COL coordinate of last dropped piece
var pieces = 0;         		// Track the amount of pieces dropped
var winStack = [];      		// Track the pieces that made the player win. Do some animation to show how player won.
var column = 0;        		 	// Column tracked by the mouse in the actual game board.
var thisStack = [];   			// Track longest streak	

var lastMessage = '';         // Last status message
//--------------GRID INITIALIZE------------------------------
init();

//--------------EVENT HANDLERS-------------------------------
$(window).on('beforeunload', function()
{
   if(whoWon == undefined && pieces > 0 && pieces < MAX_PIECES)
      return 'Are you sure you want to quit a game in progress?';
});

$(window).on('load', function()
{   
   setPlayer(currentPlayer);
   saveMessage();
   resizeComponents();
});

$(window).resize(function() 
{
   resizeComponents();
});

$("#board").mousemove(function(event) {
   var x = event.pageX - $(this).offset().left;
   
   // find next closest column
   column = calculateColumn(x);
   
   if(column < COLS && column > -1)
   {
      var leftOffset = calculateLeftOffset(column);
      $('#pMaster').css('left', leftOffset);
      $('#hoverRegion').css('left', leftOffset);
   }
});

$('#board').mouseenter(function() {
   if(whoWon == undefined && pieces < MAX_PIECES)
   {
      if(!$('#hoverRegion').hasClass('hover'))
      {
         $('#hoverRegion').addClass('hover');
      }
      
      if(!$('#pMaster').hasClass('shown'))
      {
         $('#pMaster').addClass('shown');
      }
   }
});

$('#board').mouseleave(function() {
   if($('#hoverRegion').hasClass('hover'))
   {
      $('#hoverRegion').removeClass('hover');
   }
   
   if($('#pMaster').hasClass('shown'))
   {
      $('#pMaster').removeClass('shown');
   }
});

$("#board").click(function() {
   if(pos[column] > -1 && whoWon == undefined)
   {
      // Disable Rematch button
      $("#rematch button").removeAttr('disabled');
	  
      unsetPlayer(currentPlayer);
      
      // Make the piece
      var dropTo = calculateDropRow(column);
      var newPiece = makePiece(column);
      $('#pieces').append(newPiece);
      
      drop(column);

      newPiece = updatePiece(newPiece, lastDrop);
      
      // Bounce the piece
      newPiece.animate({
         opacity: 1,
         top: '+=' + dropTo
      }, 1000, 'easeOutBounce');
      
      // Check if someone has won, if not, prepare next player
      if(whoWon != undefined)
      {
         setWinner();
      }
      else
      {
         // Prepare for next player!
         setPlayer(currentPlayer);
         isTie();
         saveMessage();
      }
   }
});

$("#rematch button").click(function() 
{
   window.location.href = 'index.html';
});

//--------------UI FUNCTIONS------------------------------------
function isTie()
{
   /*	Display it as a tie!
	 *
	 *	Returns:
	 *		Boolean if it is a tie or not.
	 */
   if(pieces == MAX_PIECES)
   {
      $('#currentPlayer').css('background-color', '#1478d9').css('color', '#fff').html('It is a tie!');
      $('#hoverRegion').removeClass('hover');
      $('#pMaster').removeClass('shown');
      $('#player' + currentPlayer.id).css('color', '#000').css('background-image', '');
      
      return true;
   }
   else
   {
      return false;
   }
}

function saveMessage()
{
   /*	Save the display message
	 *
	 *	Returns:
	 *		None
	 */
   lastMessage = $('#currentPlayer').html();
}

function unsetPlayer(player)
{
   /*	Unsets the previous player in the UI
	 *
    * Args:
    *    Player: A player object on the targeted player.
    *
	 *	Returns:
	 *		None
	 */
   
   // Show user where the piece will drop
   $('#pMaster').removeClass(player.color);
   $('#player' + player.id).css('color', '#000').css('background-image', '');
   
   // Increment moves and show it
   $('#player' + player.id + 'moves').html(++player.moves);
   $('#player' + player.id + ' .moveslabel').html((player.moves > 1 ? 'MOVES' : 'MOVE'));
}

function setPlayer(player)
{
   /*	Sets the player in the UI
	 *
    * Args:
    *    Player: A player object on the targeted player.
    *
	 *	Returns:
	 *		None
	 */
   $('#currentPlayer').html(player.name + ' is up!');
   $('#pMaster').addClass(player.color);
   $('#favicon').attr('href', 'img/' + player.color + '.ico');
   $('#player' + player.id).css('color', player.textColor).css('background-image', 'url(img/flag.png)');
}

function setWinner()
{
   /*	Sets the winner in the UI
	 *
	 *	Returns:
	 *		None
	 */
   $('#player' + whoWon.id).css('background-image', 'url("img/trophy.png")');
   $('#currentPlayer').css('color', 'green').html('Player ' + whoWon.id + ' won in ' + whoWon.moves + ' moves.');
   $('#favicon').attr('href', 'img/winner.ico');
   $('#hoverRegion').removeClass('hover');
   $('#pMaster').removeClass('shown');
   setInterval(showWin, 1000);
}

function makePiece(column)
{
   /*	Drops a piece on a row
	 *
	 *	Returns:
	 *		The piece as a DOM object
	 */
   var newPiece = $(document.createElement('div'))
      .addClass('piece')
      .addClass(currentPlayer.color)
      .addClass('slave')
      .css('left', calculateLeftOffset(column))
      .attr('column', column);
      
   return newPiece
}

function updatePiece(piece, coords)
{
   /*	Updates the piece with post information after the drop.
	 *
    * Args:
    *    Piece: The target piece
    *    Coords: Coordinates after the drop
    *
	 *	Returns:
	 *		None
	 */
   return piece.attr('id', 'p' + coords[0] + '-' + coords[1]);
}

var showWin = function () 
{
	/*	Animates the pieces that made the player win.
	 *
	 *	Returns:
	 *		None
	 */
	 
   $(winStack).each(function(index)
   {
      coords = this;
      $('#p' + coords[0] + '-' + coords[1]).animate(
      {
         opacity: 1.0
      }, 490, 'linear', function() {
         $(this).animate(
         {
            opacity: 0.0
         }, 490, 'linear');
      
      });
   });
};

function resizeComponents()
{
   /*	Resizes components
	 *
	 *	Returns:
	 *		None
	 */
    
   $('#currentPlayer').css('width', $(window).width() + 2);
   $('#rematch').css('width', $(window).width() + 2);
   
   if(!minimumWidth($(window).width()))
   {
      $('#board').hide();
      $('#rematch').hide();
      $('#currentPlayer').html('Please resize to greater than ' + MIN_WIDTH + ' pixels to play.');
   }
   else
   {
      $('#board').show();
      $('#rematch').show();
      $('#currentPlayer').html(lastMessage);
      LEFT_OFFSET = calculateCoarseMovement($(window).width());
   }
   
   var fineOffset = calculateFineMovement($(window).width());
   
   // Move all the pieces
   $('#pieces .slave').each(function()
   {
      var column = parseInt($(this).attr('column'));
      $(this).css('left', calculateLeftOffset(column) - fineOffset);
   });
}

function minimumWidth(windowWidth)
{
   /*	Checks if the player can play at the window width.
	 *
    * Args:
    *    windowWidth: Width of the window
    *
	 *	Returns:
	 *		Boolean, True if playable.
	 */
    
   return windowWidth > MIN_WIDTH;
}

function calculateCoarseMovement(windowWidth)
{
   /*	Calculates the Coarse movement equation y = mx + b
	 *
    * Coarse movement refers to big steps in adjusting board elements that are in absolute positions.
    * this includes the column highlighter and the pieces.
    *
    * Equation constants for both coarse and fine have been derived by series of points through y = mx + b
    * where y is the desired offset, and x is the width of the window.
    *
    * Args:
    *    windowWidth: Width of the current window. Is the x.
    *
	 *	Returns:
	 *		New offset in double. 
	 */
    
   return C_SLOPE * windowWidth + C_B;
}

function calculateFineMovement(windowWidth)
{
   /*	Calculates the Fine movement equation y = mx + b
	 *
    * Fine movement refers to smaller steps in adjusting the pieces. Due to the nature of the board, the  
    * pieces remain fixed while the board facade moves by +/- 2 pixels. To account for this, the fine movement
    * is taken into account to make it seem like the pieces are centered on the holes.
    *
    * Equation constants for both coarse and fine have been derived by series of points through y = mx + b
    * where y is the desired offset, and x is the width of the window.
    *
    * Args:
    *    windowWidth: Width of the current window. Is the x.
    *
	 *	Returns:
	 *		New offset in double. 
	 */
   return F_SLOPE * windowWidth + F_B;
}

function calculateColumn(x)
{
   /*	Calculates the column from the board coordinates.
	 *
    * Args:
    *    x: x coordinate as a double.
    *
	 *	Returns:
	 *		The column in integer 
	 */
   return Math.floor(x / PIECE_OFFSET);
}

function calculateLeftOffset(column)
{
   /*	Calculate the left offset of objects to align on the board
	 *
    * Args:
    *    column: Column number as an integer
    *
	 *	Returns:
	 *		New offset in double. 
	 */
   return LEFT_OFFSET + column * PIECE_OFFSET;
}

function calculateDropRow(column)
{
   /*	Calculate the row as a function of top offset at which to drop the piece.
	 *
    * Args:
    *    column: Column number as an integer
    *
	 *	Returns:
	 *		New offset in double. 
	 */
   return (pos[column] + 1) * PIECE_OFFSET;
}

//--------------ENGINE FUNCTIONS------------------------------------
function init()
{
   /*	Initializes everything.
	 *
	 *	Returns:
	 *		None
	 */
    
   grid = [];
   pos = [];
   whoWon = undefined;
   winStack = [];
   thisStack = [];
   lastDrop = [0, 0];			
   pieces = 0;
   
   // Initializes everything.
   var _row = [];	// Create the row 

   for(i = 0; i < COLS; i++)
   {
      _row.push(EMPTY);
      pos.push(ROWS - 1);
   } 

   for(j = 0; j < ROWS; j++)
   {
      // Do a shallow copy.
      grid.push(_row.slice(0));
   }
   
   if(debug)
		logtable();
}

function drop(column)
{
	/*	Drop a piece on the column. 
	 *
	 * 	Player changes automatically per turn. Round-robin style.	
	 *
	 *	Returns:
	 *		None
	 */
	 
	if(whoWon != undefined || pos[column] < 0)
	{
		return;
	}
	
	// Drop a piece into the board.
	grid[pos[column]][column] = currentPlayer;
	
	// Track last drop
	lastDrop = [pos[column], column];
	
	// Adjust counters
	pos[column]--;
	pieces++;
   
	// Check if we have sufficient pieces
	if(currentPlayer.moves >= WIN_STREAK)
	{
		if(check() > 0)
		{
			whoWon = currentPlayer;
		}
	}
	
	changePlayer();
	
	if(debug)
		logtable();
}

function changePlayer()
{
	/*	Changes the player between player 1 and player 2
	 *
	 *	Returns:
	 *		A player object who is gonna play next.
	 */
	 
   if(currentPlayer == player1)
   {
      currentPlayer = player2;
   }
   else if(currentPlayer == player2)
   {
      currentPlayer = player1;
   }
}

function check()
{
	/*	Checks all directions from the last drop if there is 4 in a row.
	 *
	 *	Returns:
	 *		A number stating which player won. 0 means nobody has won yet.
	 */
	 
	if(whoWon != undefined)
	{
		return;
	}
	
	// Check if someone won.
	// Execute the algorithm if one of the players 
	// has 4 or more moves.
	// Checks only the immediate pieces of the dropped piece
	// Max number of iteration (from the center) is 25 =>
	//	6 (vertical) + 7 (horizontal) + 6 (diagonal) + 6 (diagonal)
	if(debug) console.log('Last Drop: ' + lastDrop);
	
	// Evaluate longest pattern in terms of row,col
	var row = lastDrop[0];
	var col = lastDrop[1];
   
	//----------------------------------------------------------
	// Vertical Check
	//----------------------------------------------------------
	for(k = 0; k < ROWS; k++)
	{
		if(checkCell(k, col, CHECK_DIR.VER) == EMPTY)
			continue;
	}

	win = checkWinner();
	if(win > 0)
		return win;
	
	if(debug) console.log('VERTICAL - Longest Streak for Player ' + currentPlayer.id + ' is ' + winStack.length);
	
	//----------------------------------------------------------
	// Horizontal Check
	//----------------------------------------------------------
	for(k = 0; k < COLS; k++)
	{
		if(checkCell(row, k, CHECK_DIR.HOR) == EMPTY)
			continue;
	}
	
	win = checkWinner();
	if(win > 0)
		return win;
		
	if(debug) console.log('HORIZONTAL - Longest Streak for Player ' + currentPlayer.id + ' is ' + winStack.length);
	
	//----------------------------------------------------------
	// Diagonal Left->Right Check
	//   0    [direction --->]
	//	  0\
	//   00\
	//   000\
	//----------------------------------------------------------
	// if we are at the top-right, or bottom-right edge, you can't do a left->right for obvious reasons.
	// === since we don't have to type cast it any more.
	if(row === 0 && col === COLS - 1 || row === ROWS - 1 && col === 0)
	{
		// Skip L->R diagonal check
	}
	else
	{
		// Find the starting points based on the current row,col coordinates
		row0 = 0;
		col0 = col - row;
		
		// TODO: Find exact number of iterations. Right now it goes beyond the grid :(
		for(k = 0; k < DIAG_MAX; k++)
		{			
			v = row0 + k;
			w = col0 + k;
			
			// Por favor, do not exceed ze grid
			if(v < 0 || w < 0)
				continue;
				
			if(v >= ROWS || w >= COLS)
				break;
			
			if(checkCell(v, w, CHECK_DIR.DIAG_LR) == EMPTY)
				continue;
		}
		
		win = checkWinner();
		if(win > 0)
			return win;
		
		if(debug) console.log('DIAG L->R - Longest Streak for Player ' + currentPlayer.id + ' is ' + winStack.length);
		
	}
	
	//----------------------------------------------------------
	// Diagonal Right->Left Check
	//        0     [direction <-----]
	//       /0
	//      /00
	//     /000
	//----------------------------------------------------------
	// if we are at the top-left, or bottom-left edge, you can't do a right->left for obvious reasons.
	// === since we don't have to type cast it any more.
	if(row === 0 && col === 0 || row === ROWS - 1 && col === COLS - 1)
	{
		// Skip the rest of the function since this is last check.
		return;
	}
	
	// Find the starting points based on the current row,col coordinates
	row0 = 0;
	col0 = col + row;
	
	for(k = 0; k < DIAG_MAX; k++)
	{		
		v = row0 + k;
		w = col0 - k;
		
		// Por favor, do not exceed ze grid
		if(v >= ROWS || w >= COLS)
			continue;
			
		if(v < 0 || w < 0)
			break;
			
		if(checkCell(v, w, CHECK_DIR.DIAG_RL) == EMPTY)
				continue;
	}
	
	win = checkWinner();
	if(win > 0)
		return win;
		
	if(debug) console.log('DIAG R->L - Longest Streak for Player ' + currentPlayer.id + ' is ' + winStack.length);
	
}

function checkCell(r, c, dir)
{
	/*	Checks a direction
	 *
	 *	Args:
	 *	 r (number): Row Number
	 *   c (number): Column Number
	 *   dir (CHECK_DIR enum): Direction of check
	 *
	 * 	Returns:
	 *		A number stating which player won. 0 means nobody has won yet.
	 *		Can also return EMPTY if we are checking for empty blocks just
	 *		so the loop can skip these.
	 */
	dirStr = debugDir[dir];
	var winner;
	
	if(grid[r][c].id == EMPTY)
	{		
		// Not interested in checking the winner, but just resetting the cache.
		winner = checkWinner();
		
		if(debug) console.log(dirStr + ' - Player ' + currentPlayer.id + ' - Checking [' + r + ',' + c + ']: ' + grid[r][c].id + '; Streak: ' + thisStack.length);
		
		return EMPTY; 
	}
	
	if(grid[r][c] == currentPlayer)
	{
		thisStack.push([r, c]);
	}
	else
	{
		winner = checkWinner();
	}
	
	if(debug) console.log(dirStr + ' - Player ' + currentPlayer.id + ' - Checking [' + r + ',' + c + ']: ' + grid[r][c].id + '; Streak: ' + thisStack.length);
	
	return winner;
}

function checkWinner()
{
	/*	Checks a winner
	 *
	 *	Returns:
	 *		A number stating which player won. 0 means nobody has won yet.
	 */
	 
	if(thisStack.length > winStack.length)
	{
		winStack = thisStack.slice(0);
	}
	
	thisStack = [];
	
	// Check if we won, son!
	if(winStack.length >= WIN_STREAK)
	{
		if(debug) console.log('WIN: ' + currentPlayer.name + ' (' + currentPlayer.id + ')');
		return currentPlayer.id;
	}
	else
	{
		return 0;
	}
}

//--------------DEBUG--------------------------------------
function logtable()
{
	/*	Prints out the grid board.
	 *
	 *	Returns:
	 *		A console grid
	 */
   if(!debug)
      return;
      
	var s = '';
	
	for(var i = 0; i < ROWS; i++)
	{
		for(var j = 0; j < COLS; j++)
		{
         if(grid[i][j].id == undefined)
            s += '0 ';
         else
            s += grid[i][j].id + ' ';
		}
		s += '\n';
	}
	
	console.log(s);
}