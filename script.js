document.addEventListener("DOMContentLoaded", () => {
    const reels = document.querySelectorAll(".reel");
    const spinButton = document.getElementById("spinButton");
    const coinsDisplay = document.getElementById("coins");
    const messageDisplay = document.getElementById("message");
    messageDisplay.textContent = "Tenés 7 fichas. Cada giro puede subir o bajar tu puntaje. ¡Tenés que hacer al menos una jugada!";

    let coins = 7;
    
    const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "💎", "7️⃣", "🔔"];
    const messages = {
        win: [
            "¡Increíble! ¿Ves como la suerte está de mi lado?",
            "¡Esta racha ganadora no puede terminar ahora!",
            "¡Lo sabía! Estoy en mi mejor momento.",
            "¡Por fin! Esto demuestra que el esfuerzo vale la pena.",
            "¡Era cuestión de tiempo! Ahora vienen las grandes.",
            "¡Esto es solo el comienzo, ahora sí se viene lo bueno!",
            "¡Estoy recuperando todo lo que perdí!",
            "¡Sabía que esta máquina era la indicada!",
            "¡Te dije que tenía un buen presentimiento!",
            "¡Estoy en racha, no puedo parar ahora!",
            "¡Esto confirma que estoy haciendo lo correcto!",
            "¡Ahora sí me voy a recuperar por completo!",
            "¡Es la señal que estaba esperando!",
            "¡Lo sentía en el cuerpo, hoy era mi día!",
            "¡Todo sacrificio tiene su recompensa!",
            "¡Estoy por ganarle al sistema!",
            "¡Cuando uno insiste, las cosas llegan!",
            "¡Venía aguantando y valió la pena!",
            "¡Este juego tiene memoria, me lo debía!",
            "¡La suerte al fin está de mi lado!"
        ],
        
        lose: [
            "Casi gano... ¡la próxima seguro!",
            "¡Estuve tan cerca! Solo un giro más...",
            "La suerte está por cambiar, lo sé.",
            "¡No puedo rendirme ahora! Estoy demasiado cerca.",
            "¡Ya puse demasiado dinero como para irme con las manos vacías!",
            "Esta máquina está cargada, está por largar el premio...",
            "Si me voy ahora, seguro el próximo se lo lleva.",
            "Necesito recuperar lo que perdí, solo un poco más...",
            "Los números están a punto de alinearse, tengo que esperar.",
            "Estoy leyendo el patrón, ahora sí toca.",
            "Las veces que pierde uno, más cerca está del premio.",
            "Hoy no me puedo ir con las manos vacías.",
            "¡No me puede estar yendo tan mal, ya va a venir!",
            "La próxima seguro es la buena.",
            "Me falta poquito para compensar todo lo que puse.",
            "Es solo cuestión de tiempo, no de suerte.",
            "No hay forma de que siga perdiendo así, algo viene.",
            "¡Es parte del juego! Primero se pierde, después se gana.",
            "¡Ya está por largar, lo siento!",
            "No me puedo rendir ahora, ya estoy jugado.",
            "Siempre pasa: justo cuando uno se va, toca el premio.",
            "Si dejo ahora, todo lo que aposté fue en vano.",
            "Hoy no me voy hasta que recupere lo mío.",
            "La máquina está a punto de pagar, es matemática.",
            "Esta mala racha no puede durar mucho más.",
            "Un mal giro no borra todo lo que puedo ganar."
        ]
        
    };

    // Load sound effects
    const spinSound = new Audio("sounds/spin.mp3");
    const winSound = new Audio("sounds/win.mp3");
    const loseSound = new Audio("sounds/lose.mp3");
    const buttonSound = new Audio("sounds/button.mp3");

    // Configure sounds
    spinSound.volume = 0.3;
    winSound.volume = 0.4;
    loseSound.volume = 0.2;
    buttonSound.volume = 0.3;

    // Preload sounds
    function preloadSounds() {
        spinSound.load();
        winSound.load();
        loseSound.load();
        buttonSound.load();
    }
    preloadSounds();

    function animateReel(reel, symbols, duration) {
        return new Promise(resolve => {
            let startTime = null;
            const initialPosition = 0;
            const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                
                if (elapsed < duration) {
                    reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    requestAnimationFrame(animate);
                } else {
                    reel.textContent = finalSymbol;
                    resolve(finalSymbol);
                }
            }
            
            requestAnimationFrame(animate);
        });
    }

    const quitButton = document.getElementById("quitButton");
    quitButton.disabled = true; // Initially disabled
    const phraseSelection = document.getElementById("phraseSelection");
    const phraseOptions = document.getElementById("phraseOptions");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const selectedPhrases = document.getElementById("selectedPhrases");
    
    let playerPhrases = [];
    let consecutiveLosses = 0;
    
    function showPhraseSelection(type) {
        spinButton.disabled = true;
        quitButton.disabled = true;
        
        const phrasesToShow = type === 'win' ? 
            shuffleArray(messages.win).slice(0, 3) : 
            shuffleArray(messages.lose).slice(0, 3);
        
        phraseOptions.innerHTML = phrasesToShow
            .map(phrase => `<button class="phrase-button">${phrase}</button>`)
            .join('');
            
        phraseSelection.style.display = 'block';
        
        phraseOptions.querySelectorAll('.phrase-button').forEach(button => {
            button.addEventListener('click', () => {
                playerPhrases.push(button.textContent);
                phraseSelection.style.display = 'none';
                spinButton.disabled = false;
                quitButton.disabled = false;
            }, { once: true });
        });
    }
    
    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }
    
    function showGameOver(reason) {
        gameOverScreen.style.display = 'block';
        spinButton.style.display = 'none';
        quitButton.style.display = 'none';
        
        let message = reason === 'quit' ? 
            `Te retiraste con ${coins} fichas.` : 
            '¡Te quedaste sin fichas!';
            
        if (consecutiveLosses >= 3) {
            message += '\n\n¿Notaste que mientras más jugás, más sentís que no podés parar?';
        }
        
        document.getElementById('finalMessage').textContent = message;
        selectedPhrases.innerHTML = '<h3>Tus frases durante el juego:</h3>' +
            playerPhrases.map(phrase => `<p>${phrase}</p>`).join('');
    }
    
    async function spin() {
        if (coins < 1) {
            consecutiveLosses++;
            showGameOver('lose');
            return;
        }

        buttonSound.currentTime = 0;
        buttonSound.play();
        
        quitButton.disabled = false; // Enable quit button after first spin
        spinButton.disabled = true;
        messageDisplay.textContent = ""; // Clear initial message
        
        coins--;
        coinsDisplay.textContent = coins;
        
        // Play spin sound with loop
        spinSound.currentTime = 0;
        spinSound.loop = true;
        spinSound.play();

        const results = await Promise.all([
            animateReel(reels[0], symbols, 1000),
            animateReel(reels[1], symbols, 1500),
            animateReel(reels[2], symbols, 2000)
        ]);

        // Stop spin sound
        spinSound.loop = false;
        spinSound.pause();

        // Modify the win/lose checks:
        if (results[0] === results[1] && results[1] === results[2]) {
            const prize = 3;
            coins += prize;
            coinsDisplay.textContent = coins;
            consecutiveLosses = 0;
            winSound.currentTime = 0;
            winSound.play();
            showPhraseSelection('win');
        } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
            const prize = 1;
            coins += prize;
            coinsDisplay.textContent = coins;
            consecutiveLosses = 0;
            winSound.currentTime = 0;
            winSound.play();
            showPhraseSelection('win');
        } else {
            consecutiveLosses++;
            loseSound.currentTime = 0;
            loseSound.play();
            showPhraseSelection('lose');
        }
    }
    
    document.getElementById('playAgainButton').addEventListener('click', () => {
        // Reset game state
        coins = 7;
        playerPhrases = [];
        consecutiveLosses = 0;
        
        // Reset UI
        coinsDisplay.textContent = coins;
        messageDisplay.textContent = "Tenés 7 fichas. Cada giro puede subir o bajar tu puntaje. ¡Tenés que hacer al menos una jugada!";
        gameOverScreen.style.display = 'none';
        spinButton.style.display = 'block';
        quitButton.style.display = 'block';
        quitButton.disabled = true;
        spinButton.disabled = false;
    });
    
    quitButton.addEventListener('click', () => {
        showGameOver('quit');
    });
    
    spinButton.addEventListener("click", spin);
});