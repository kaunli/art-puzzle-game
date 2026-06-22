// generating a random number to select which puzzle pieces
const randomPuzzle = Math.floor(Math.random() * 3) + 1;
// getting the path
const puzzlePath = "329EHW11.images/puzzle" + randomPuzzle + "/";
// write into html to display
const piecesContainer = document.getElementById("piecesContainer");
// each puzzle file name 
var pieces = ["img" + randomPuzzle + "-1.jpg", "img" + randomPuzzle + "-2.jpg", "img" + randomPuzzle + "-3.jpg", "img" + randomPuzzle + "-4.jpg",
"img" + randomPuzzle + "-5.jpg", "img" + randomPuzzle + "-6.jpg", "img" + randomPuzzle + "-7.jpg", "img" + randomPuzzle + "-8.jpg",
"img" + randomPuzzle + "-9.jpg", "img" + randomPuzzle + "-10.jpg", "img" + randomPuzzle + "-11.jpg", "img" + randomPuzzle + "-12.jpg",];
console.log("puzzle: ", pieces);
// check answer with
const answer = ["img" + randomPuzzle + "-1.jpg", "img" + randomPuzzle + "-2.jpg", "img" + randomPuzzle + "-3.jpg", "img" + randomPuzzle + "-4.jpg",
"img" + randomPuzzle + "-5.jpg", "img" + randomPuzzle + "-6.jpg", "img" + randomPuzzle + "-7.jpg", "img" + randomPuzzle + "-8.jpg",
"img" + randomPuzzle + "-9.jpg", "img" + randomPuzzle + "-10.jpg", "img" + randomPuzzle + "-11.jpg", "img" + randomPuzzle + "-12.jpg",];

// timer
var timeInterval;
var elapsedTime = 0;

// used to display the puzzle pieces 
var count = 0;
var offsetContainer = (window.innerWidth - 690) / 2;

// grid positions
var gridPos = document.getElementById("grid").getBoundingClientRect();
const startX = gridPos.left;
const startY = gridPos.top;
var gridPoints = [];

var piecePoints = new Array(answer.length);
var userPlace = new Array(answer.length);

pieces = shufflePieces(pieces);

// start timer when page is loaded
function startTimer() {
    // update the stopwatch every sec
    timeInterval = setInterval(updateTime, 1000);
    getGridPoints(gridPoints);
}
// update the timmer (by hours, minutes, and seconds) and display
function updateTime() {
    elapsedTime++;
    var hrs = Math.floor(elapsedTime / 3600);
    var min = Math.floor((elapsedTime % 3600) / 60);
    var sec = elapsedTime % 60;

    // format the text display
    var time = ("00" + hrs).slice(-2) + ":" + ("00" + min).slice(-2) + ":" + ("00" + sec).slice(-2);
    document.getElementById("timer").innerHTML = time;
}

// clear stopWatch when button is clicked or when window is reload
function stopTimer() {
    document.getElementById("endTime").innerHTML = "<p> You finished in: " + elapsedTime + " seconds</p>";
    clearInterval(timeInterval);
    getPuzzlePiecePositions(userPlace, piecePoints);
    checkPuzzle(gridPoints, piecePoints);
}

// shuffle puzzle pieces randomly by exchanging a[j] and a[i]
// Fisher–Yates algorithm
function shufflePieces(array) {
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// create an array of grid points
function getGridPoints(gridPoints) {
    newX = startX;
    newY = startY;
    for (var row = 0; row <= 3; row++) {
        for (var col = 0; col <= 4; col++) {
            if (col == 0) {
                gridPoints.push([newX, newY]);
            }
            else {
                newX = newX + 100;
                gridPoints.push([newX, newY]);
            }
        }
        newX = startX;
        newY = newY + 100;
    }
    console.log("gridPos: ", gridPoints);
    return gridPoints;
}

// dragging function
function grabber(event) {

    // Set the global variable for the element to be moved
    theElement = event.currentTarget;

    // Determine the position of the word to be grabbed, first removing the units from left and top
    posX = parseInt(theElement.style.left);
    posY = parseInt(theElement.style.top);

    // Compute the difference between where it is and where the mouse click occurred
    diffX = event.clientX - posX;
    diffY = event.clientY - posY;

    // Now register the event handlers for moving and dropping
    document.addEventListener("mousemove", mover, true);
    document.addEventListener("mouseup", dropper, true);
}

// The event handler function for moving
function mover(event) {
    // Compute the new position, add the units, and move
    theElement.style.left = (event.clientX - diffX) + "px";
    theElement.style.top = (event.clientY - diffY) + "px";
}

// The event handler function for dropping
function dropper(event) {
    // Unregister the event handlers for mouseup and mousemove
    document.removeEventListener("mouseup", dropper, true);
    document.removeEventListener("mousemove", mover, true);

}

// get each puzzle positions
function getPuzzlePiecePositions(userPlace, piecePoints) {
    images = document.querySelectorAll('.puzzle-piece');
    images.forEach(img => {
        rect = img.getBoundingClientRect();
        xPos = rect.left;
        yPos = rect.top;

        file = img.src.split('/').pop();
        locatIndex = answer.indexOf(file);

        userPlace[locatIndex] = file;
        piecePoints[locatIndex]= [xPos, yPos];
    });

    console.log("User: ", userPlace);
    console.log("UserPos: ", piecePoints);
}

// check puzzle and is called from stopTimer 
function checkPuzzle(gridPoints, piecePoints) {
    count = 0;
    console.log("Check with: ", answer);
    // goes through the points of the puzzle pieces
    for (var i = 0; i < piecePoints.length; i++) {

        if (userPlace[i] === answer[i]) {
            // getting pieces points x and y
            pieceX = piecePoints[i][0];
            pieceY = piecePoints[i][1];

            // getting grid points x and y
            gridX = gridPoints[i][0];
            gridY = gridPoints[i][1];

            console.log("X: ", Math.abs(pieceX - gridX));
            console.log("y: ", Math.abs(pieceY - gridY));

            // check if its within the threshold 
            if (Math.abs(pieceX - gridX) <= 400 && Math.abs(pieceY - gridY) <= 200) {
                count++;
            }
        }
        else {
            document.getElementById("result").innerHTML = "<p>Better luck next time!</p>";
            break;
        }
    }
    console.log(count);
    if (count == pieces.length) {
        document.getElementById("result").innerHTML = "<p>Congratulations! You got it!</p>"
    }
    else {
        document.getElementById("result").innerHTML = "<p>Better luck next time! Tip is put the puzzle pieces within the grids.</p>"
    }
}

// accessing the puzzle pieces and display by going through the array of image file names
pieces.forEach(fileName => {
    const img = new Image();
    img.src = puzzlePath + fileName;
    img.alt = "Puzzle: " + randomPuzzle;
    img.classList.add("puzzle-piece");
    // create two rows and center the puzzzle pieces
    if (count < 6) {
        img.style.left = offsetContainer + count * 115 + "px";
        img.style.top = "600px";

    }
    else {
        img.style.left = offsetContainer + (count - 6) * 115 + "px";
        img.style.top = "720px";
    }

    img.style.position = "absolute";
    img.style.cursor = "pointer";
    img.setAttribute("onmousedown", "grabber(event)");
    img.setAttribute("draggable", "false");
    piecesContainer.appendChild(img);
    count++;
});
