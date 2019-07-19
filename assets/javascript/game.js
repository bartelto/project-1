setCardValue("#player-card", "0H");
setCardValue("#opponent-card", "AD");

function setCardValue(cardId, cardCode) {
    // set rank
    if (cardCode.substring(0, 1) === "0") {
        $(cardId).text("10");
    } else {
        $(cardId).text(cardCode.substring(0, 1));
    }

    // set suit
    switch (cardCode.substring(1)) {
        case "S": {$(cardId).addClass("card spade");} break;
        case "C": {$(cardId).addClass("card club");} break;
        case "H": {$(cardId).addClass("card heart");} break;
        default: {$(cardId).addClass("card diamond");} 
    }
}