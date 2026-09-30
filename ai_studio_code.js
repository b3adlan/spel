let currentWord = "", currentLang = "en", guesses = [], currentGuess = "";

const loadGame = async (lang) => {
    const res = await fetch('./data/words.json');
    const data = await res.json();
    const words = data[lang];
    currentWord = words[Math.floor(Math.random() * words.length)];
    currentLang = lang;
    document.body.className = lang === 'ar' ? 'rtl' : '';
    initBoard();
};

function initBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitGuess();
    if (e.key === "Backspace") currentGuess = currentGuess.slice(0, -1);
    if (/^[a-zäöå\u0600-\u06FF]$/i.test(e.key) && currentGuess.length < 5) {
        currentGuess += e.key.toLowerCase();
    }
    updateBoard();
});

function updateBoard() {
    const row = document.querySelectorAll(".row")[guesses.length];
    const tiles = row.querySelectorAll(".tile");
    tiles.forEach((tile, i) => {
        tile.textContent = currentGuess[i] || "";
    });
}

function submitGuess() {
    if (currentGuess.length !== 5) return;
    const row = document.querySelectorAll(".row")[guesses.length];
    const tiles = row.querySelectorAll(".tile");
    
    [...currentGuess].forEach((char, i) => {
        if (char === currentWord[i]) tiles[i].classList.add("correct");
        else if (currentWord.includes(char)) tiles[i].classList.add("present");
        else tiles[i].classList.add("absent");
    });

    guesses.push(currentGuess);
    if (currentGuess === currentWord) alert("Win!");
    currentGuess = "";
}

document.getElementById("lang-selector").addEventListener("change", (e) => loadGame(e.target.value));
loadGame("en");