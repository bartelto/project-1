// https://raw.githubusercontent.com/VoloshinS/firebase-crud-example/gh-pages/main.js;

var config = {
    apiKey: "AIzaSyCs3K5zwuOuS0odq89IpPLC7HnXTOcDqgI",
    authDomain: "recent-user-with-all-use-e8e76.firebaseapp.com",
    databaseURL: "https://recent-user-with-all-use-e8e76.firebaseio.com",
    projectId: "recent-user-with-all-use-e8e76",
    storageBucket: ""
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE Player

var loginForm = document.getElementById('loginForm');
var fullName = document.getElementById('fullName');
var wins = document.getElementById('wins');
var losses = document.getElementById('losses');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!fullName.value) return null
    var id = Date.now()

    db.ref('players/' + id).set({
        fullName: fullName.value,
        wins: wins.value
    });

    fullName.value = '';
    wins.value = 0;
    losses.value = 0;
});

// READ Players

var players = document.getElementById('players');
var playersRef = db.ref('/players');

playersRef.on('child_added', (data) => {
    var li = document.createElement('li')
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val())
    players.appendChild(li);
});

playersRef.on('child_changed', (data) => {
    var reviewNode = document.getElementById(data.key);
    reviewNode.innerHTML = reviewTemplate(data.val());
});

playersRef.on('child_removed', (data) => {
    var reviewNode = document.getElementById(data.key);
    reviewNode.parentNode.removeChild(reviewNode);
});

players.addEventListener('click', (e) => {
    var reviewNode = e.target.parentNode

    // UPDATE REVEIW
    if (e.target.classList.contains('edit')) {
        fullName.value = reviewNode.querySelector('.fullName').innerText;
        wins.value = reviewNode.querySelector('.wins').innerText;
        losses.value = reviewNode.querySelector('.losses').innerText;
    }

    // DELETE REVEIW
    if (e.target.classList.contains('delete')) {
        var id = reviewNode.id;
        db.ref('players/' + id).remove();
    }
});

function reviewTemplate({ fullName, wins }) {
    return `
    <div class='fullName'>${fullName}</div>
    <div class='wins'>${wins}</div>
    <button class='delete'>Delete</button>
    <button class='edit'>Edit</button>
  `
};

