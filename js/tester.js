var url = window.location.search.substring(1);
var args = url.split('&');
var test = false;

for(i = 0; i < args.length; i++)
{
	var val = args[i].split('=');
	if(val[0] == 'test')
	{
		test = true;
		break;
	}
   else if(val[0] == 'debug')
	{
		debug = true;
		break;
	}
}

if(args.length > 0 && test)
{
	console.log('Testing');
	
	// Remove container and then add qunit
	$('#container').hide();
	$('body').append($(document.createElement('div')).attr('id', 'qunit'));
	
	// Activate debug mode.
	debug = true;
	
	QUnit.start();
	
	// Unit Test
   QUnit.module("Javascript Test");
	QUnit.test("Javascript Test", function(assert)
	{
		assert.equal(2, 1 + 1, "Added 1+1");
	});
   
   QUnit.module("Engine");
   QUnit.test("Empty Grid", function(assert)
	{
		assert.equal(grid.length, ROWS, "Has " + ROWS + " rows");
      assert.equal(grid[0].length, COLS, "Has " + COLS + " columns");
	});
   
   QUnit.test("Who Won?", function(assert)
	{
      winStack = [(0,0), (1,0), (2,0), (3,0)];
      currentPlayer = player2;
		assert.equal(checkWinner(), player2.id, "Player 2 Won!");
      currentPlayer = player1;
		assert.equal(checkWinner(), player1.id, "Player 1 Won!");
      winStack = [];
	});
   
   QUnit.test("Change Player", function(assert)
	{
      currentPlayer = player1;
      changePlayer();
		assert.equal(player2, currentPlayer, "Player 1 -> Player 2");
      changePlayer();
		assert.equal(player1, currentPlayer, "Player 2 -> Player 1");
	});
   
   QUnit.test("Grid Cell Check", function(assert)
	{
      drop(1);
		assert.equal(checkCell(5, 1, CHECK_DIR.VER), 0, "Cell at 5,1 checked, no winner yet");
	});
   
   QUnit.test("Piece Drop", function(assert)
	{
      pieces = 0;
      currentPlayer = player1;
      drop(1);
		assert.equal(grid[pos[1] + 1][1].id, player1.id, player1.name + " dropped");
      assert.equal(lastDrop, pos[1] + 1 + ',' + 1, "Last Drop updated to " + lastDrop);
      assert.equal(pieces, 1, "1 new piece.");
      assert.equal(currentPlayer, player2, "Player 2 is next");
	});
   
   QUnit.test("Vertical Streak Check", function(assert)
	{
      
      init();
      console.log("VERTICAL");
      var usePlayer = player1;
      
      currentPlayer = usePlayer;
      drop(0);
      currentPlayer = usePlayer;
      drop(0);
      currentPlayer = usePlayer;
      drop(0);
      currentPlayer = usePlayer;
      drop(0);
      currentPlayer = usePlayer;
      
      var win = check();
		assert.equal(win, usePlayer.id, "Player 1 won!");
      
      init();
      
      var usePlayer = player2;
      
      currentPlayer = usePlayer;
      drop(COLS - 1);
      currentPlayer = usePlayer;
      drop(COLS - 1);
      currentPlayer = usePlayer;
      drop(COLS - 1);
      currentPlayer = usePlayer;
      drop(COLS - 1);
      currentPlayer = usePlayer;
      
      var win = check();
		assert.equal(win, usePlayer.id, "Player 2 won!");
      
      init();
	});
   
   QUnit.test("Horizontal Streak Check", function(assert)
	{
      init();
		console.log("HORIZONTAL");
      var usePlayer = player1;
      
      currentPlayer = usePlayer;
      drop(0);
      currentPlayer = usePlayer;
      drop(1);
      currentPlayer = usePlayer;
      drop(2);
      currentPlayer = usePlayer;
      drop(3);
      currentPlayer = usePlayer;
      
      var win = check();
		assert.equal(win, usePlayer.id, "Player 1 won!");
      
      init();
      
      var usePlayer = player2;
      
      currentPlayer = usePlayer;
      drop(COLS - 1);
      currentPlayer = usePlayer;
      drop(COLS - 2);
      currentPlayer = usePlayer;
      drop(COLS - 3);
      currentPlayer = usePlayer;
      drop(COLS - 4);
      currentPlayer = usePlayer;
      
      var win = check();
		assert.equal(win, usePlayer.id, "Player 2 won!");
      
      init();
	});
   
   QUnit.test("Left->Right Diagonal Streak Check", function(assert)
	{      
      init();
		console.log("DIAGONAL LEFT->RIGHT");
      
      currentPlayer = player1;
      
      drop(0);
      drop(1);
      drop(1);
      drop(2);
      drop(2);
      drop(4);
      drop(2);
      drop(4);
      drop(3);
      drop(3);
      drop(3);
      drop(4);
      currentPlayer = player1;
      drop(3);
      currentPlayer = player1;
      
      var win = check();
		assert.equal(win, currentPlayer.id, "Player 1 won!");
      
      init();
      
      currentPlayer = player2;
      
      drop(0);
      drop(1);
      drop(1);
      drop(2);
      drop(2);
      drop(4);
      drop(2);
      drop(4);
      drop(3);
      drop(3);
      drop(3);
      drop(4);
      currentPlayer = player2;
      drop(3);
      currentPlayer = player2;
      
      var win = check();
		assert.equal(win, currentPlayer.id, "Player 2 won!");
      
      init();
	});
   
   QUnit.test("Right->Left Diagonal Streak Check", function(assert)
	{
      init();
		console.log("DIAGONAL RIGHT -> LEFT");
      
      currentPlayer = player1;
      
      drop(4);
      drop(3);
      drop(3);
      drop(2);
      drop(0);
      drop(2);
      drop(2);
      drop(1);
      drop(0);
      drop(1);
      drop(0);
      drop(1);
      currentPlayer = player1;
      drop(1);
      currentPlayer = player1;
      
      var win = check();
		assert.equal(win, currentPlayer.id, "Player 1 won!");
      
      init();
      
      currentPlayer = player2;
      
      drop(4);
      drop(3);
      drop(3);
      drop(2);
      drop(0);
      drop(2);
      drop(2);
      drop(1);
      drop(0);
      drop(1);
      drop(0);
      drop(1);
      currentPlayer = player2;
      drop(1);
      currentPlayer = player2;
      
      var win = check();
		assert.equal(win, currentPlayer.id, "Player 2 won!");
      init();
	});
   
   QUnit.test("Move increment", function(assert)
	{
      var c = player1.moves + 1;
		assert.equal(player1.moves + 1, c, c + " move for Player 1");
      var c = player2.moves + 1;
      assert.equal(player2.moves + 1, c, c + " move for Player 2");
	});
   
   QUnit.test("Tie", function(assert)
	{
      pieces = MAX_PIECES;
      assert.ok(isTie(), "Tie Success!");
      pieces = 0;
      
      assert.equal($('#currentPlayer').html(), "It is a tie!", "Tie Message of Success!");
	});
   
   QUnit.module("User Interface - Positioning");
   QUnit.test("Minimum Playable Width", function(assert)
	{
      assert.equal(minimumWidth(MIN_WIDTH - 1), false, "Smaller than " + MIN_WIDTH);
      assert.equal(minimumWidth(MIN_WIDTH + 1), true, "Greater than " + MIN_WIDTH);
	});
   
   QUnit.test("Coarse Movement Offset", function(assert)
	{
		assert.equal(calculateCoarseMovement(1024), 170.25060000000002, "1024 Window Width Offset = " + calculateCoarseMovement(1024));
      assert.equal(calculateCoarseMovement(860), 88.67700000000002, "860 Window Width Offset = " + calculateCoarseMovement(860));
	});
   
   QUnit.test("Fine Movement Offset", function(assert)
	{
		assert.equal(calculateFineMovement(1024), 1.6276000000000002, "1024 Window Width = " + calculateFineMovement(1024));
      assert.equal(calculateFineMovement(860), 1.94904, "860 Window Width = " + calculateFineMovement(860));
	});
   
   QUnit.test("Column Derivation From Board Coordinates", function(assert)
	{
		assert.equal(calculateColumn(30.6787), 0, "Column 0 Location = " + calculateColumn(30.6787));
      assert.equal(calculateColumn(701.09), 6, "Column 6 Location = " + calculateColumn(701.09));
      assert.equal(calculateColumn(801.09), 7, "Out of Bounds Location = " + calculateColumn(801.09));
	});
   
   QUnit.test("Object Horizontal Alignment Offset", function(assert)
	{
		assert.equal(calculateLeftOffset(0), 615.921, "Column 0 = " + calculateLeftOffset(0));
      assert.equal(calculateLeftOffset(6), 1239.921, "Column 6 = " + calculateLeftOffset(6));
	});
   
   QUnit.test("Object Vertical Alignment Offset", function(assert)
	{
      init();
		assert.equal(calculateDropRow(0), 624, "Column 0 - Row 5, Drop at " + calculateDropRow(0));
      pos[0]--;
      assert.equal(calculateDropRow(0), 520, "Column 0 - Row 4, Drop at " + calculateDropRow(0));
      pos[0]++;
      assert.equal(calculateDropRow(6), 624, "Column 6 - Row 5, Drop at " + calculateDropRow(6));
	});
   
   QUnit.module("User Interface - DOM");
   QUnit.test("Creating a Piece", function(assert)
	{
      currentPlayer = player2;
      var piece = makePiece(0);
		assert.ok(piece.hasClass(currentPlayer.color), "Player 2 Piece Color " + currentPlayer.color);
      assert.ok(piece.hasClass('slave'), "Player 2 Piece Slave");
      assert.ok(piece.hasClass('piece'), "Player 2 Piece Identifier");
      assert.equal(piece.attr('column'), 0, "Player 2 Piece Column");
	});
   
   QUnit.test("Reposition Pieces", function(assert)
	{
      resizeComponents();
      var offset = calculateCoarseMovement($(window).width());
      var fine = calculateFineMovement($(window).width());
      assert.equal(LEFT_OFFSET, offset, "Pieces moved by LEFT_OFFSET = " + offset);
      assert.equal(fine, calculateFineMovement($(window).width()), "Pieces adjusted by Fine Movement = " + fine);
	});
   
   QUnit.test("Update Piece", function(assert)
	{
      var piece = makePiece(0);
      updatePiece(piece, [1,2])
      assert.equal(piece.attr('id'), 'p1-2', "Piece Updated Column");
	});
   
   QUnit.test("Setting a Player", function(assert)
	{
      setPlayer(player2);
      assert.equal($('#favicon').attr('href'), 'img/' + player2.color + '.ico', "Player 2 Favicon");
      assert.ok($('#pMaster').hasClass(player2.color), "Player 2 Color " + player2.color);
	});
   
   QUnit.test("Unsetting a Player", function(assert)
	{
      var m = player2.moves + 1;
      unsetPlayer(player2);
      assert.equal(player2.moves, m, "Player 2 Move Incremented");
      assert.equal($('#player' + player2.id).css('background-image'), "none", "Player 2 Text Color Set Back");
	});
   
   QUnit.test("Set Winner", function(assert)
	{
      whoWon = player2;
      setWinner();
      assert.equal($('#favicon').attr('href'), 'img/winner.ico', "Player 2 Favicon");
      assert.ok(!$('#pMaster').hasClass('shown'), "Controller Hidden");
	});
   
   QUnit.test("Save Message", function(assert)
	{
      lastMessage = "Hello World";
      saveMessage();
      assert.equal($('#currentPlayer').html(), lastMessage, "Message Set");
	});

}