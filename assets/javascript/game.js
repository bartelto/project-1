// First player to login is Player 1
// Second player to login is Player 2
// Player 1 initiates game communication with Player 2; Player 2 simply responds.

//Global Variables---------------------------------------------------
var deckId = "";
var drawnCard = "";
var cardValue = "";
var clickDisabled = false;

//Firebase Variables=================================================
var playerOnePlayed = false;
var playerTwoPlayed = false;
var playerCardValue = 0;
var opponentCardValue = 0;
var playerCardCode = "";
var opponentCardCode = "";
var p1Wins = 0;
var p2Wins = 0;
var inWar = false;
var isPlayer1 = false; // Player 1 is the first to log on, and will create the deck and share it with the other player
var isPlayer2 = false; // Variable for tracking Player 2s actions
var playRef = []; // reference to a play, as stored in the database.
var p1DrawYet = false;
var p2DrawYet = false;

$("#game-screen").hide();

try {
    responsiveVoice.speak("This is War!");
}
catch (err) {
    console.log("voice error: " + err.message);
}

//Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDFbSU7PZJHTzMVbA0JE3bet5RWadB2ajc",
    authDomain: "test-dc061.firebaseapp.com",
    databaseURL: "https://test-dc061.firebaseio.com",
    projectId: "test-dc061",
    storageBucket: "",
    messagingSenderId: "723834254447",
    appId: "1:723834254447:web:b99d118c96d67216"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

setCardValue("#player-card", cardValue);
setCardValue("#opponent-card", "");
$("#player-war-1").hide();
$("#player-war-2").hide();
$("#player-war-3").hide();
$("#player-war-4").hide();
$("#opponent-war-1").hide();
$("#opponent-war-2").hide();
$("#opponent-war-3").hide();
$("#opponent-war-4").hide();

function setCardValue(cardId, cardCode) {

    if (cardCode === "") {
        $(cardId).removeClass("spade club heart diamond");
        $(cardId).addClass("playing-card no-card");
        $(cardId).text("");
        return;
    }

    // set rank
    if (cardCode.substring(0, 1) === "0") {
        $(cardId).text("10");
    } else {
        $(cardId).text(cardCode.substring(0, 1));
    }

    // set suit
    $(cardId).removeClass("no-card spade club heart diamond");
    switch (cardCode.substring(1)) {
        case "S": { $(cardId).addClass("playing-card spade"); } break;
        case "C": { $(cardId).addClass("playing-card club"); } break;
        case "H": { $(cardId).addClass("playing-card heart"); } break;
        default: { $(cardId).addClass("playing-card diamond"); }
    }
}

//$("#player-deck").on("click", function () {
//play the next card (demo only)
//let randomCards = ["8S", "9H", "AC", "KD", "3S", "7H", "AC"];
//let randomCard = randomCards[Math.floor(Math.random() * randomCards.length)];
//setCardValue("#player-card", randomCard);
//});

//startGame();

// Login Logic==========================================================================
let playerName = "";
let playerKey = "";
let playerRef = [];
let opponentName = "";
let opponentKey = "";
let playerCount = 0;
let addingPlayerToDatabase = false;

//++Siva
let deckRef = [];
let deckKey = "";
let addingDeckToDatabase = false;
//--Siva

$("#input-screen-name").on("change keyup paste", function () {
    $("#login-avatar").attr("src", `https://api.adorable.io/avatars/400/${$(this).val()}.png`);
});

$("#submit-screen-name").click(function (event) {
    event.preventDefault();

    playerName = $("#input-screen-name").val();
    addingPlayerToDatabase = true;

    playerRef = database.ref("/players").push({
        name: playerName
    });
    console.log("about to get key");
    playerKey = playerRef.key;
    addingPlayerToDatabase = false;

    // Remove user from the players list when they disconnect.
    playerRef.onDisconnect().remove();

    if (playerCount === 1) {
        console.log("I am Player 1");
        isPlayer1 = true;
    } else if (playerCount === 2) {
        console.log("I am Player 2");
        isPlayer2 = true;
    }

    if (playerKey !== "" && opponentKey !== "") {
        startGame();
    }
})

/*
database.ref("/players").on("value", function (snapshot) {
    //console.log("num players changed");
    playerCount = snapshot.numChildren();
    if (playerCount > 1) {
        $("#label-screen-name").text("Sorry, but there are already two players in the game. Please try again later.");
        $("#input-screen-name").prop('disabled', true);
        $("#submit-screen-name").prop('disabled', true);
    } else {
        $("#label-screen-name").text("Your screen name:");
        $("#input-screen-name").prop('disabled', false);
        $("#submit-screen-name").prop('disabled', false);
    }
});


database.ref("/players").on("child_added", function (snapshot) {
    //console.log("child added");
    if ((snapshot.key !== playerKey) && !addingPlayerToDatabase) {
        opponentKey = snapshot.key;
        opponentName = snapshot.val().name;
    }
    if (playerKey !== "" && opponentKey !== "") {

        startGame();
    }
});
*/

// New login logic
database.ref("/players").on("child_added", function(snapshot) {
    // the setTimeout ensures that the code runs after the playerKey has been captured
    setTimeout(function() {
        if (snapshot.key !== playerKey) { //not _this_ player
            let newPlayer = $("<button>")
                .text(snapshot.val().name)  
                .addClass("list-group-item list-group-item-action competitor")
                .attr('data-key', snapshot.key)
                .attr('data-toggle', "modal")
                .attr('data-target', '#challenge-modal')
                .prepend(`<img src="https://api.adorable.io/avatars/400/${snapshot.val().name}.png">`);
            if (playerKey === "") { // player is not logged in yet
                newPlayer.addClass("disabled"); 
            }
            $("#players-list").append(newPlayer);
            $("#no-competitors").hide();
        } else {
            // make sure all opponents are enabled for clicking
            $(".competitor").removeClass("disabled");
        }
    },0);
});

database.ref("/players").on("child_removed", function(snapshot) {
    $(`button[data-key=${snapshot.key}]`).remove();
    if ($("#players-list li").length === 0) {
        $("#no-competitors").show(2000);
    }

    if (snapshot.key === opponentKey) {
        $("#instructions").text(`${opponentName} has left the game. Choose a different competitor to play again.`);
        opponentKey = "";
        opponentName = "";
        $("#game-area").hide();
        $("#competitors").show(2000);
    }
});

// clicking on a competitor's name
$(document).on("click", ".competitor", function() {
    console.log("clicked " + $(this).text());
    opponentName = $(this).text();
    opponentKey = $(this).attr("data-key");

    // show challenge modal
    $('#challenge-modal').modal("show");
    $("#button-challenge").attr("data-action", "challenge");
    $("#challenge-comm").text(`Do you want to challenge ${opponentName} to play WAR?`);

});

// sending or accepting a challenge
$("#button-challenge").on("click", function() {
    console.log("clicked YES");
    if ($(this).attr("data-action") === "challenge") {
        $("#challenge-comm").text(`Waiting for ${opponentName} to accept your challenge!`);
        matchRef = matchesRef.push({
            to: opponentKey,
            from: playerKey,
            accepted: false
        });

        matchRef.onDisconnect().remove();

        matchRef.child("accepted").on("value", function(snapshot) {
            if (snapshot.val() === true) { // opponent has accepted the challenge
                isChallenger = true;
                console.log("opponent accepted!");
                startGame();
            }
        });
    } // accepting a challenge
    else if ($(this).attr("data-action") === "accept") {
        matchRef.child("accepted").set(true); // won't affect other children
        $('#challenge-modal').modal("hide");
        $("#competitors").hide();
        // reveal game controls
        $("#game-area").show();
        $("#announcer").text("Choose your attack!");
    }
});

// receiving a challenge from another player
matchesRef.on("child_added", function(snapshot) {
    if (snapshot.val().to === playerKey) {
        matchRef = snapshot.ref;
        opponentName = $(`button[data-key="${snapshot.val().from}"]`).text();
        opponentKey = $(`button[data-key="${snapshot.val().from}"]`).attr("data-key");
        $("#challenge-comm").text(`${opponentName} is challenging you to a game of WAR! Accept?`);
        $("#button-challenge").attr("data-action", "accept");
        $('#challenge-modal').modal("show");
    }
});

////////////////
// Game Logic //
////////////////

function startGame() {
    // show game area & chat box

    $("#instructions").hide();
    $("#login-screen").hide();
    $("#game-screen").show();
    $("#chat-list").empty();

    // display player names
    $("#player-name").text(playerName);
    $("#opponent-name").text(opponentName);

    // display avatars
    $(".player-avatar").attr("src", `https://api.adorable.io/avatars/400/${playerName}.png`);
    $(".opponent-avatar").attr("src", `https://api.adorable.io/avatars/400/${opponentName}.png`);

    // create a shuffled deck
    // place deckID on Firebase

    var queryURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"


    if (isPlayer1) { // Player 1 "deals" the deck
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //set variable equal to id of deck
            deckId = response.deck_id;
            //Sanity Checks
            console.log("deckID: " + deckId);

            //++Siva
            //addingDeckToDatabase = true;
            deckRef = database.ref("/decks").push({
                deckId: deckId,
                to: opponentKey // so the opponent knows the deck is for them
            });
            //deckKey = deckRef.key;
            //addingDeckToDatabase = false;
            //-Siva

            //++Siva
            // Remove deck from the decks list when players disconnect
            //if (deckRef.length > 0)
            deckRef.onDisconnect().remove();
            //--Siva
        });
    }

    //when player deck is clicked
    $("#player-deck").on("click", function () {
        if (clickDisabled) return;
        clickDisabled = true;
        if (inWar === false) {
            if (isPlayer1) {
                //    p1DrawYet = true;
            }
            else if (!isPlayer1) {
                //    p2DrawYet = true;
            }
            // initialize the play game function
            playCard();
        } else {
            playWarCard();
        }

    });


}

database.ref("/decks").on("child_added", function (snapshot) {
    let newDeck = snapshot.val();
    if (newDeck.to === playerKey) {
        deckId = newDeck.deckId;
        console.log("deckID: " + deckId);
    }
});


function playCard() {
    //* boolean: ready for the next battle?
    //if (p1DrawYet === true & p2DrawYet === true) {
    //  p1DrawYet === false;
    //p2DrawYet === false;
    // draw from deck API
    var drawnCardUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1"

    $.ajax({
        url: drawnCardUrl,
        method: "GET"
    }).then(function (response) {
        //set variable equal to card code and value
        playerCardCode = response.cards[0].code;
        playerCardValue = calcCardValue(response.cards[0].value);

        //Sanity Checks
        console.log(playerCardCode);
        console.log(playerCardValue);

        setCardValue("#player-card", playerCardCode); // display card on screen

        if (isPlayer1) { // P1 sends their cardCode to P2
            playRef = database.ref("/plays").push({
                cardCode1: playerCardCode,
                to: opponentKey // so the opponent knows the deck is for them
            });
            playRef.onDisconnect().remove();

            // P1 listens to Firebase for P2's card
            playRef.child("cardCode2").on("value", function (snapshot) {
                if (snapshot.val() !== null && snapshot.val() !== "") {
                    opponentCardCode = snapshot.val();
                    opponentCardValue = calcCardValue(opponentCardCode);
                    console.log("p2 played " + opponentCardCode);
                    // display opponent's card on screen
                    setCardValue("#opponent-card", opponentCardCode);
                    // both sides have played; determine winner of the hand
                    winCon();
                }
            });
        } else if (!isPlayer1 && opponentCardCode !== "") { // P1 has already played
            // send P2 card to P1
            console.log(`sending ${playerCardCode} to Player 1`);
            playRef.child("cardCode2").set(playerCardCode);
            // both sides have played; determine winner of the hand
            winCon();
        }

    });


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


// Player 2 listens to Firebase for Player 1's card
database.ref("/plays").on("child_added", function (snapshot) {
    let newPlay = snapshot.val();
    if (newPlay.to === playerKey) {
        playRef = snapshot.ref;
        opponentCardCode = newPlay.cardCode1;
        console.log("opponentCardCode: " + opponentCardCode);
        opponentCardValue = calcCardValue(opponentCardCode);
        setCardValue("#opponent-card", opponentCardCode); // display card on screen

        if (playerCardValue > 0) {
            playRef.child("cardCode2").set(playerCardCode);

            // both players have played, so determine winner
            winCon();
        }
    }

});



function calcCardValue(code) {
    let val = code.substring(0, 1);
    if ($.isNumeric(val)) {
        return parseInt(val);
    } else {
        switch (val) {
            case "A": return 1;
            case "J": return 11;
            case "Q": return 12;
            case "K": return 13;
            case "0": return 10;
        }
    }
}

function winCon() {
    //if (playerOnePlayed == true & playerTwoPlayed == true) {
    if (playerCardValue > opponentCardValue) {
        p1Wins += 2; // collect both cards
        console.log(playerName + " has " + p1Wins + " wins");
        $("#player-score p").text(p1Wins);
    }
    else if (playerCardValue < opponentCardValue) {
        p2Wins += 2; // collect both cards
        console.log(opponentName + " has " + p2Wins + " wins");
        $("#opponent-score p").text(p2Wins);
    }
    else { // values are equal
        console.log("Commence War");
        // initiateWar(); // commenting this out until the war logic is ready
    }
    testGameOver();

    setTimeout(function () {
        // reset everything related to the hand
        playerCardValue = 0;
        opponentCardValue = 0;
        playerCardCode = "";
        opponentCardCode = "";
        setCardValue("#player-card", "");
        setCardValue("#opponent-card", "");
        clickDisabled = false; // allow click for next hand
    }, 3000);

}

function testGameOver() {
    if (p1Wins >= 26) {
        alert("You are the winner!")
    }
    else if (p2Wins >= 26) {
        alert(`${opponentName} is the Winner!`)
    }

}
//}
//else {
//    alert("Please, Wait for your opponent")
//} 

//  }

function initiateWar() {
    inWar === true;
    var warDrawUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=4"
    $.ajax({
        url: warDrawUrl,
        method: "GET"
    }).then(function (response) {
        let childToWatch = ""; // the name of the child value to watch for the opponent's "war" card

        playerCardCode = response.cards[3].code;
        playerCardValue = calcCardValue(response.cards[3].value);

        // store 4th card value to Firebase
        if (isPlayer1) {
            playRef.child("warCode1").set(playerCardCode);
            childToWatch = "warCode2";
        } else {
            playRef.child("warCode2").set(playerCardCode);
            childToWatch = "warCode1";
        }

        //Need to update html to have war cards update
        $("#player-war-1").show();
        $("#player-war-2").show();
        $("#player-war-3").show();
        $("#player-war-4").show();

        // 4th card drawn is shown face-up
        setCardValue("#player-war-4", playerCardCode);

        //Sanity Checks
        console.log(playerCardCode);

        // Create listener to check for other player's "war" card
        playRef.child(childToWatch).on("value", function (snapshot) {
            if (snapshot.val() !== null && snapshot.val() !== "") {
                opponentCardCode = snapshot.val();
                opponentCardValue = calcCardValue(opponentCardCode);
                console.log("during war, opponent played " + opponentCardCode);
                // display opponent's card on screen
                setCardValue("#opponent-war-4", opponentCardCode);
                // both sides have played; determine winner of the hand
                //winCon();
            }
        });
    });
}

//function playWarCard() {
//  var drawnCardUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1"
// $.ajax({
//   url: drawnCardUrl,
//  method: "GET"
//}).then(function (response) {
//set variable equal to card code and value
//  var cardWorth = response.cards[0].value;
// winCon();
//})
// }


// Chat Logic=======================================================================================================
let messagesRef = undefined;
let messagesKey = "";

$("#chat-send").click(function () {
    event.preventDefault();

    let message = $("#input-message").val();

    database.ref("/messages").push({
        to: opponentKey,
        message: message
    });
    $("#input-message").val("");
});

database.ref("/messages").on("child_added", function (snapshot) {

    let newChat = snapshot.val();
    if (newChat.to === playerKey || newChat.to === opponentKey) {
        let newMessage = $("<li>")
            .text(newChat.message)
            .addClass("list-group-item");
        if (newChat.to === opponentKey) { // message is from the player
            newMessage
                .addClass("player-message")
                .append(`<img src="https://api.adorable.io/avatars/400/${playerName}.png">`);
        } else { // message is from the opponent
            newMessage
                .addClass("opponent-message")
                .prepend(`<img src="https://api.adorable.io/avatars/400/${opponentName}.png">`);
            try {
                responsiveVoice.speak(newChat.message);
            }
            catch (err) {
                console.log("voice error: " + err.message);
            }
        }
        $("#chat-list").append(newMessage);

        // delete message from database
        database.ref("/messages").child(snapshot.key).remove();

    }

});
