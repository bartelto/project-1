setCardValue("#player-card", "0H");
setCardValue("#opponent-card", "AD");
//setCardValue("#player-wild-1", "8C");
//setCardValue("#player-wild-2", "JS");

function setCardValue(cardId, cardCode) {
    // set rank
    if (cardCode.substring(0, 1) === "0") {
        $(cardId).text("10");
    } else {
        $(cardId).text(cardCode.substring(0, 1));
    }

    // set suit
    $(cardId).removeClass("spade club heart diamond");
    switch (cardCode.substring(1)) {
        case "S": {$(cardId).addClass("playing-card spade");} break;
        case "C": {$(cardId).addClass("playing-card club");} break;
        case "H": {$(cardId).addClass("playing-card heart");} break;
        default: {$(cardId).addClass("playing-card diamond");} 
    }
}

$("#player-deck").on("click", function() {
    // play the next card (demo only)
    let randomCards = ["8S", "9H", "AC", "KD", "3S", "7H", "AC"];
    let randomCard = randomCards[Math.floor(Math.random()*randomCards.length)];
    setCardValue("#player-card", randomCard);
});

function startGame() {
    // show game area & chat box
    // display player names
    // display avatars
    // create a shuffled deck
    // place deckID on Firebase
}

function playCard() {
    //* boolean: ready for the next battle?
    //* draw from the deck API
    //* store card in firebase
    //* when child_added to firebase, update card(s) on screen
    //* when both cards are played:
    //    * determine winner
    //    * display winner
    //    * score for winner += 2 points
    //    * remove the two children on firebase (player 1)
    //    * timer: 3 seconds
    //    * both played cards disappear
    //* test: game over?
    //    * player has > 26 points
    //    * if over, declare a winner
    //    * players are removed from firebase/players
    //    * players return to login screen
}