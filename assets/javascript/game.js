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
        case "S": { $(cardId).addClass("playing-card spade"); } break;
        case "C": { $(cardId).addClass("playing-card club"); } break;
        case "H": { $(cardId).addClass("playing-card heart"); } break;
        default: { $(cardId).addClass("playing-card diamond"); }
    }
}

$("#player-deck").on("click", function () {
    // play the next card (demo only)
    let randomCards = ["8S", "9H", "AC", "KD", "3S", "7H", "AC"];
    let randomCard = randomCards[Math.floor(Math.random() * randomCards.length)];
    setCardValue("#player-card", randomCard);
});
startGame();
// Game Logic
function startGame() {
    var queryURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // var newDeck = response.data
        console.log(response.deck_id)

    });

    $("#player-deck").on("click", function () {
        // when player deck is clicked
        "https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/draw/?count=2"


    });

}