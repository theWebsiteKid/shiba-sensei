(() => {
	// init global variables
	var url = 'http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true';
	var imagesSorted = [
		'top-left-image',
		'top-mid-image',
		'top-right-image',
		'mid-left-image',
		'mid-mid-image',
		'mid-right-image',
		'bottom-left-image',
		'bottom-mid-image',
		'bottom-right-image'
	];
	var borkOnClick = new Howl({ src: [ './audio/bork.mp3' ] });
	var growlOnClick = new Howl({ src: [ './audio/growl.mp3' ] });
	var howlOnClick = new Howl({ src: [ './audio/howl.mp3' ] });
	var squeakOnClick = new Howl({ src: [ './audio/squeak2.wav' ] });

	// init stats received-from or sent-to Firebase
	var numPuzzles = 0;
	var numMoves = 0;
	var numSkips = 0;

	// init global DOM elements
	var main = $('.main');
	var timer = $('<h1>');
	var puzzleBoard = $('<div>');
	var skipButton = $('<p>');
	var quitButton = $('<p>');
	timer.addClass('timer');
	timer.text('1:00');
	puzzleBoard.addClass('puzzle-board');
	skipButton.text('skip');
	skipButton.addClass('skip-button');
	quitButton.text('quit');
	quitButton.addClass('quit-button');
	quitButton.addClass('alert');

	var resetGame = () => {
		document.location.reload();
	};

	var leaderboardScreen = function() {
		var playButton = $('<p>');
		playButton.text('play again');
		playButton.addClass('skill-button');
		main.empty(main.children);``
		main.append(playButton);
		playButton.on('click', resetGame);
	};

	var endScreen = function() {
		var title = $('<h1>');
		var solves = $('<h2>');
    var leaderboard = $('<p>');
    var playButton = $('<p>');
    var resetGame = function() {
			document.location.reload();
		};
		var wiki = $('<a>');
		title.addClass('title');
		title.text('GAME OVER');
		solves.addClass('endTitle2');
		solves.text(`Solved ${numPuzzles} puzzles in ${numMoves} moves, skipped ${numSkips}.`);
		leaderboard.text('leaderboard');
    leaderboard.addClass('skill-button');
    playButton.addClass('skill-button');
		playButton.text('play again');
		wiki.text('What is a shiba?')
		main.empty(main.children);
		main.append(title);
		main.append(solves);
		main.append(leaderboard);
		main.append(playButton);
		main.append(wiki);
		leaderboard.on('click', leaderboardScreen);
		playButton.on('click', resetGame);
	};

	var gameLogic = function() {
		var seconds = 60;
		var isPaused = true;
		var bonus = false;
		var oneClick = false;
		var firstPiece = '';
		var firstPieceClass = '';
		// init get images function
		var getImages = function(data) {
			puzzleBoard.empty(puzzleBoard.children);
			// init scramble image classes
			var scrambleImages = function(images) {
				var imagesScrambled = [];
				var j = 0;
				while (j < 9) {
					var i = Math.floor(Math.random() * 9);
					if (imagesScrambled.includes(images[i]) !== true) {
						imagesScrambled.push(images[i]);
						j++;
					}
				}
				return imagesScrambled;
			};
			var image = data[0];
			var imagesScrambled = scrambleImages(imagesSorted);
			// init puzzle pieces
			for (var i = 0; i < 9; i++) {
				var setPuzzleBoard = function() {
					var puzzlePiece = document.createElement('div');
					var pieceImage = document.createElement('img');
					puzzlePiece.classList.add('puzzle-piece');
					pieceImage.setAttribute('src', image);
					pieceImage.classList.add(imagesScrambled[i]);
					puzzlePiece.appendChild(pieceImage);
					puzzleBoard.append(puzzlePiece);
					isPaused = false;
				};
				setPuzzleBoard();
			}
		};
		let printPuzzle = () => {
			$.get('https://my-little-cors-proxy.herokuapp.com/' + url, getImages);
		};
		let skipPuzzle = (event) => {
			event.preventDefault();
			oneClick = false;
			isPaused = true;
			numSkips++;
			printPuzzle();
			growlOnClick.play();
		};
		var swapPieces = function(event) {
			event.preventDefault();
			if (event.target !== event.currentTarget) {
				if (oneClick === true && event.target !== firstPiece) {
					oneClick = false;
					numMoves++;
					var secondPieceClass = event.target.getAttribute('class');
					event.target.classList.remove(secondPieceClass);
					event.target.classList.add(firstPieceClass);
					firstPiece.classList.add(secondPieceClass);
					firstPiece.classList.remove(firstPieceClass);
					firstPiece.classList.remove('highlightproperties');
					var puzzlePieceList = document.getElementsByClassName('puzzle-piece');
					var listToCompare = [];
					borkOnClick.play();

					for (var i = 0; i < 9; i++) {
						var imgPosition = puzzlePieceList[i].firstChild.className;
						listToCompare.push(imgPosition);
					}
					var win = true;
					for (var i = 0; i < 9; i++) {
						if (imagesSorted[i] !== listToCompare[i]) {
							win = false;
						}
					}
					if (win === true) {
						squeakOnClick.play();
						numPuzzles++;
						isPaused = true;
						if (seconds < 49) {
							seconds += 11;
						} else {
							seconds = 60;
						}
						bonus = true;
						setTimeout(function() {
							printPuzzle();
						}, 1000);
					}
				} else if (oneClick === true && event.target === firstPiece) {
					oneClick = false;
					firstPiece.classList.remove('highlightproperties');
				} else {
					oneClick = true;
					firstPiece = event.target;
					firstPieceClass = event.target.getAttribute('class');
					event.target.classList.add('highlightproperties');
				}
			}
		};
		window.setTimeout(function() {
			window.setInterval(function() {
				if (!isPaused) {
					timer.removeClass('timer-green');
					if (bonus) {
						timer.addClass('timer-green');
						bonus = false;
					}
					if (seconds > 10) {
						timer.text('0:' + seconds);
					}
					if (seconds < 10) {
						timer.text('0:0' + seconds);
					}
					if (seconds < 0) {
						timer.text('TIME UP');
					}
					if (seconds < -1) {
						isPaused = true;
						howlOnClick.play();
						endScreen();
					}
					seconds -= 1;
				}
			}, 1000);
		}, 1000);
		main.empty(main.children);
		main.append(timer);
		main.append(puzzleBoard);
		main.append(skipButton);
		main.append(quitButton);
		puzzleBoard.on('click', swapPieces);
		skipButton.on('click', skipPuzzle);
		quitButton.on('click', resetGame);
		printPuzzle();
	};

	var homeScreen = function() {
		var title = $('<h1>');
		var description = $('<p>');
		var senseiImage = $('<img>');
		var startButton = $('<p>');
		var loginUI = $('<div>');
		title.addClass('title');
		title.text('SHIBA SENSEI');
		description.addClass('description');
		description.text('an infinite puzzle game by Nat Sharpe, Michael Lohmeier, and Xavier Duncan.');
		senseiImage.attr('src', 'images/sensei.jpg');
		senseiImage.addClass('sensei-image');
		startButton.text('play');
		startButton.addClass('start-button');
		loginUI.attr('id', 'firebaseui-auth-container');
		main.append(title);
		main.append(senseiImage);
		main.append(description);
		main.append(startButton);
		main.append(loginUI);
		startButton.on('click', gameLogic);
	};

	homeScreen();
})();
