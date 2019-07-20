/*
  game.js
  Tyler Roland
  Modified 11/21/17
  War functionality
  https://github.com/MisterTeeRoland/war/blob/master/game.js
  http://www.tyler-roland.com/War/
  https://github.com/bartelto/project-1
*/

//initialize variables
var warArray = [], player1Array = [], player2Array = [];
var player1Deck = '', Player2Deck = '', player1Card = '', player2Card = '';

var playing = false;

//function to fill an array with 52 numbers
function fillArray() {
  var deck = [];
  for (var i = 0; i < 52; i++)
    deck[i] = i;

  shuffle(deck);
  splitCards(deck);
}

//function to shuffle deck of cards. 
function shuffle(deck) {
  for (var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
  return deck;
}

//function to split shuffled deck in half
function splitCards(deck) {
  var i = 0;

  //push a card to each "hand" array
  while (i != deck.length) {
    player1Array.push(deck[i]);
    player2Array.push(deck[(i + 1)]);
    i += 2;
  }

  $('.player1Count').html("Player1 cards: " + player1Array.length);
  $('.player2Count').html("Player2 cards: " + player2Array.length);
  $('.result').html("");
}

//function to take top card off of each deck and put into card slot
function deal() {

  //if a card is already in the slot, removes card. Also shows "New Game" button if hidden
  $('.player1Card').html("");
  $('.player2Card').html("");
  $('.newGame').show();

  //sets current card for each hand
  player1Card = player1Array[0];
  player2Card = player2Array[0];

  //creates an image element for the current card in each hand
  var img1 = document.createElement('img');
  var img2 = document.createElement('img');

  img1.src = ("img/cards/" + player1Array[0] + ".png");
  img2.src = ("img/cards/" + player2Array[0] + ".png");

  //adds card image to the card slot of the game board
  $('.player1Card').append(img1).animateCss("flipInYRev");
  $('.player2Card').append(img2).animateCss("flipInY");

  //calls compare function to compare current cards
  compare(player1Card, player2Card);
}


//function to compare both face up cards (or current cards)
function compare(player1, player2) {

  //if player1's card value is higher than the player2's card value, player1 wins
  if ((player1 % 13) > (player2 % 13)) {

    //updates result div of the game board
    $('.result').html("Player1 wins!").animateCss("flipInX");

    //pushes current cards from each hand to the back of the player1's hand
    player1Array.push(player2);
    player1Array.push(player1);

    //removes current card from the front of each deck
    player1Array.shift();
    player2Array.shift();

    setTimeout(function () {
      moveCards('player1');
    }, 1500);

    //update card counts and check for a winner
    updateCount();
    checkWin();
  }

  //if player2's card value is higher than the player1's card value, player2 wins
  else if ((player1 % 13) < (player2 % 13)) {

    //update the results div of the game table
    $('.result').html("Computer wins!").animateCss("flipInX");

    //pushes current cards from each hand to the back of the player2's hand
    player2Array.push(player1);
    player2Array.push(player2);

    //removes current card from the front of each deck
    player2Array.shift();
    player1Array.shift();

    setTimeout(function () {
      moveCards('player2');
    }, 1500);

    //update card counts and check for a winner
    updateCount();
    checkWin();
  }

  //if player1's current card value is the same as the player2's current card value a "War" (tie) occurs
  else if ((player1 % 13) === (player2 % 13))
    war();
}

//function to move cards to a winners deck (animation)
function moveCards(winner) {

  if (winner == "player1") {
    console.log("moving left");
    $(".player1Card img").css('position', 'relative').animate({ left: '-2000px' }, function () { $(this).hide(); });
    $(".player2Card img").css('position', 'relative').animate({ left: '-2000px' }, function () { $(this).hide(); });
  }
  else if (winner == "player2") {
    console.log("moving right");
    $(".player1Card img").css('position', 'relative').animate({ left: '2000px' }, function () { $(this).hide(); });
    $(".player2Card img").css('position', 'relative').animate({ left: '2000px' }, function () { $(this).hide(); });
  }
  else if (winner == "player1War") {
    $("#warArea img").css("position", "relative").animate({ left: '-2000px' }, function () { $("#warArea img").hide(); });
  }
  else if (winner == "player2War") {
    $("#warArea img").css("position", "relative").animate({ left: '2000px' }, function () { $("#warArea img").hide(); });
  }
}


//function to handle "war" instances or "ties"
function war() {

  //show "war" animation
  $('#warAnimation').css("display", "table");

  $("#warText").animateCss("lightSpeedIn", function () {
    $("#warText").animateCss("lightSpeedOut");
  });

  //keeps animation going for 1 second, then removes the 'war' class and hides the animation
  setTimeout(function () {
    $('#warAnimation').hide();
    $("#warText").removeClass("lightSpeedOut");

    $("#warArea").show();

    //calls function to draw cards from each deck
    warToArray();
  }, 2000);


}


//function to take cards from each deck and put into "war" array
function warToArray() {

  var cardStr = "";
  var length = 0;

  //if not able to draw 4 cards, draw as many as possible
  if (player1Array.length < 5 || player2Array.length < 5) {

    //if player2 has less than 4 cards
    if (player1Array.length > player2Array.length) {
      length = player2Array.length - 1;
    }

    //if the player1 hand has less than 4 cards
    else if (player1Array.length < player2Array.length) {
      length = player1Array.length - 1;
    }
  }

  //if both decks have greater than four cards
  else {
    length = 3;
  }

  //take the cards from each deck and push them to the war array
  for (var i = 0; i < length; i++) {
    warArray.push(player1Array[0]);
    player1Array.shift();
    warArray.push(player2Array[0]);
    player2Array.shift();
    cardStr += '<img src="img/cardback.jpg">';
  }

  //set up the War visual with relevant cards
  $(".playerWarFinal").html("<img src='img/cards/" + player1Array[0] + ".png'>").animateCss("flipInYRev");
  $(".playerWarCards").html(cardStr);
  $(".compWarCards").html(cardStr);
  $(".compWarFinal").html("<img src='img/cards/" + player2Array[0] + ".png'>").animateCss("flipInY");

  //compare the new current card from each deck
  compareWar(player1Array[0], player2Array[0]);
}


//function to compare current cards and allocate the war array correctly
function compareWar(player1, player2) {

  //if player1's War card value is greater than the player2's War card value, player1 wins the tie
  if ((player1 % 13) > (player2 % 13)) {

    //updates result section of the game board
    $('.result').html("Player1 wins!");

    //pushes entire war array to the back of the player1's hand
    player1Array.push.apply(player1Array, warArray);

    //pushes both current cards (War cards) to back of the player1's hand
    player1Array.push(player2);
    player1Array.push(player1);

    //removes current card from both hands
    player1Array.shift();
    player2Array.shift();

    //resets the war array to empty
    warArray.length = 0;

    setTimeout(function () {
      moveCards("player1War");
      moveCards("player1");
    }, 3000);

    setTimeout(function () {
      $("#warArea").hide();
    }, 3500);

    //update card count and check for a winner
    updateCount();
    checkWin();
  }

  //if player2's War card value is greater than the player1's War card value, player2 wins the tie
  else if ((player1 % 13) < (player2 % 13)) {

    //update result section of the game board
    $('.result').html("Computer wins!");

    //pushes the entire war array to the back of the player2's hand
    player2Array.push.apply(player2Array, warArray);

    //pushes both current cards (War cards) to the back of the player2's hand
    player2Array.push(player1);
    player2Array.push(player2);

    //removes the current cards from each hand
    player1Array.shift();
    player2Array.shift();

    //resets the war array to empty
    warArray.length = 0;

    setTimeout(function () {
      moveCards("player2War");
      moveCards("player2");
    }, 3000);

    setTimeout(function () {
      $("#warArea").hide();
    }, 3500);

    //update card count and check for a winner
    updateCount();
    checkWin();
  }

  //if player1's War card value is the same as the player2's War card value, call for another war
  else if ((player1 % 13) === (player2 % 13))
    war();
}


//function to check if either player is out of cards (being a win for the other player)
function checkWin() {

  //if player1 is out of cards, player2 wins
  if (player1Array.length == 0) {
    $(".result").html("The player2 wins the game :(").animateCss("flipInX");

    //resets the card and deck image to make it seem like the player1 is out of cards
    $('.player1Card').html("");
    $('.playerDeck').html("");

    //hides the "deal" button, forces player1 to only start a new game
    $('.deal').hide();
  }

  //if player2 is out of cards, player1 wins
  else if (player2Array.length == 0) {

    $(".result").html("You won the game! :)").animateCss("flipInX");

    //resets the card and deck image to make it seem like the player2 is out of cards.
    $('.player2Card').html("");
    $('.compDeck').html("");

    //hides the "deal" button, forces the player1 to only start a new game
    $('.deal').hide();
  }
}

//function that hides the "how to play" screen and shows the game board
function play() {
  hideAll();
  $("#header").show().addClass("animated fadeInDown");
  $("#gameboard").show();
  playing = true;
}

//function to update the card count after every "deal" finishes
function updateCount() {
  $('.player1Count').html("Player1 cards: " + player1Array.length);
  $('.player2Count').html("Player2 cards: " + player2Array.length);
}

//simple function to hide big page elements, usually followed by showing other specific elements
function hideAll() {
  $("#jumbotron").hide();
  $("#gameboard").hide();
  $("#howToPlay").hide();
  $("#header").hide();
  $(".newGame").hide();
}

window.onload = function () {

  preloadImages();

  hideAll();
  $("#jumbotron").show();
  $("#howToPlay").show();
  fillArray();

  $("#year").html(new Date().getFullYear());
};

//custom function, used with animate.css to quickly add and then remove animation classes (once animation is finished)
//found here: https://github.com/daneden/animate.css
$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});

//function to preload images into the browser cache for quicker loading during play
function preloadImages() {
  for (var i = 0; i < 52; i++) {
    var img = new Image();
    img.src = 'img/cards/' + i + '.png';
  }
}
