# War of Words

Playing multiplayer games online is great, but often, one of the best aspects of gameplay is missing: getting to throw shade at your opponent. For this project, we asked: how could we both destroy our opponents with our skill in the game AND with our withering wordplay?

*War of Words* is a multiplayer imagining of the card game WAR &mdash; plus both text and synthesized voice chat.

Try it! [bartelto.github.io/project-1/](https://bartelto.github.io/project-1/)

## Introduction

*War of Words* is a web application built with HTML, CSS, JavaScript, and jQuery. It also uses Firebase to enable multiplayer interaction and the Deck of Cards API to keep track of both players' hands.

### Using *War of Words*
- On the main page of the app, enter a screen name to play under. The app will automatically generate an Adorable Avatar based on the characters you type.
- Only one game can be played at a time, so if two people are already playing, you may need to wait your turn.
- Once you are signed in, you will be redirected to the main game page. Your avatar and deck will appear at the bottom of the screen, and your opponent will appear at the top.
- Click your deck to play a card. Once your opponent plays their card, the winner of the hand will be displayed, and the cards will be swept to the winner's discard pile.
- If the card have the numeric value, each player will automatically deal three more cards face-down and then another face-up for the 'rematch'. This continues until the players play cards with different values.
- After all cards have been played, the game will count each players' cards and pronounce a winner!

## The authors

This app was developed by the following team as part of the Full-Stack Web Development program at University of Kansas Professional and Continuing Education: 
- Logan Ayers
- Sandra Martinez
- Siva Boppana
- Todd Bartelt
