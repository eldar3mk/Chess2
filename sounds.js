var game = new Chess();

var board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
});

var stockfish = new Worker("https://cdn.jsdelivr.net/npm/stockfish/stockfish.js");

var time = 600;
var timer = setInterval(updateTimer, 1000);

function updateTimer(){
    time--;
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    document.getElementById("timer").innerHTML =
    minutes + ":" + (seconds<10?"0":"") + seconds;
}

function onDrop(source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    if(move.captured){
        captureSound.play();
    } else {
        moveSound.play();
    }

    if(game.in_check()){
        checkSound.play();
    }

    window.setTimeout(makeBotMove, 500);
}

function makeBotMove(){

    let level = document.getElementById("difficulty").value;

    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth " + level);

    stockfish.onmessage = function(event){

        if(event.data.startsWith("bestmove")){

            var move = event.data.split(" ")[1];

            game.move({
                from: move.substring(0,2),
                to: move.substring(2,4),
                promotion: 'q'
            });

            board.position(game.fen());

        }
    }
}

function resetGame(){
    game.reset();
    board.start();
    time = 600;
      }
