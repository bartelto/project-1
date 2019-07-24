//Global Variables---------------------------------------------------
var deckId = "";
var drawnCard = "";
var cardValue = "";
//Firebase Variables=================================================
var playerOnePlayed = false;
var playerTwoPlayed = false;
var cardOneWorth = "";
var cardTwoWorth = "";
var p1Wins = 0;
var p2Wins = 0;
var inWar = false;
$("#game-screen").hide();

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
    playerKey = playerRef.key;
    addingPlayerToDatabase = false;

    // Remove user from the players list when they disconnect.
    playerRef.onDisconnect().remove();

    if (playerKey !== "" && opponentKey !== "") {
        startGame()
    }
})

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
        startGame()
    }
});

// Game Logic================================================================================
function startGame() {
    // show game area & chat box

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


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //set variable equal to id of deck
        deckId = response.deck_id;
        //Sanity Checks
        console.log(deckId);


    });
    //when player deck is clicked
    $("#player-deck").on("click", function () {

        if (inWar === false) {
            // initialize the play game function
            playCard();
        }
        else {
            playWarCard();
        }
    });
}

function playCard() {
    //* boolean: ready for the next battle?
    var readyToPlay = true;
    // draw from deck API
    var drawnCardUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1"
    $.ajax({
        url: drawnCardUrl,
        method: "GET"
    }).then(function (response) {
        //set variable equal to card code and value
        var cardCode = response.cards[0].code;
        var cardWorth = response.cards[0].value;
        //Sanity Checks
        console.log(cardCode);
        console.log(cardWorth)
        if (cardWorth = King) {
            cardWorth = 13;
        }
        if (cardWorth = Queen) {
            cardWorth = 12;
        }
        if (cardWorth = Jack) {
            cardWorth = 11;
        }


        winCon();
        setCardValue("#player-card", cardCode);

    });
    //convert cards to usable values


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

function winCon() {
    if (playerOnePlayed == true & playerTwoPlayed == true) {
        if (cardOneWorth > cardTwoWorth) {
            p1Wins++
        }
        else if (playerTwoPlayed > playerOnePlayed) {
            p2Wins++
        }
        else {
            alert("Commence War")
            initiateWar();
        }
    }
    else {
        alert("Please, Wait for your opponent")
    }

    function initiateWar() {
        inWar === true;
        var warDrawUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=3"
        $.ajax({
            url: warDrawUrl,
            method: "GET"
        }).then(function (response) {
            var warCard1 = response.cards[0].code;
            var warCard2 = response.cards[1].code;
            var warCard3 = response.cards[2].code;

            //Need to update html to have war cards update

            //Sanity Checks
            console.log(warDrawUrl);


        });
    }

    function playWarCard() {
        var drawnCardUrl = "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1"
        $.ajax({
            url: drawnCardUrl,
            method: "GET"
        }).then(function (response) {
            //set variable equal to card code and value
            var cardWorth = response.cards[0].value;
            winCon();
        })
    }


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
            if (newChat.to === opponentKey) {
                newMessage
                    .addClass("player-message")
                    .append(`<img src="https://api.adorable.io/avatars/400/${playerName}.png">`);
            } else {
                newMessage
                    .addClass("opponent-message")
                    .prepend(`<img src="https://api.adorable.io/avatars/400/${opponentName}.png">`);
            }
            $("#chat-list").append(newMessage);

            // delete message from database
            database.ref("/messages").child(snapshot.key).remove();

        }

    });
