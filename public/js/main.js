var wordsArray = ["test", "combo", "another", "programming", "associate", "word", "what", "cat", "dog", "vvv"],
    bestGrids = [],
    lettersGrid = [],
    lettersHashMap = {},
    usedWordsHash = {},
    wordsData = {},
    wordsLeft = 0,
    wordsUsed = 0,
    bestGridScore = 0,
    generateNextGridCount = 0,
    initialDirection = 'horizontal',
    startWordX = 0,
    startWordY = 0,
    boxSize = 31;

function init() {

    addEvent();
    calculateWords();

}

function addEvent() {
    $('#render-button').on('click', function () {
        var value = $(this).closest('.input-group').find('input').val().replace(/ /g, '');
        wordsArray = value.split(',');
        calculateWords();
    })
}

function calculateWords() {
    console.log('calculate words')

    wordsArray.sort(function (a, b) {
        return b.length - a.length;
    });

    lettersHashMap = getLettersHashMap(wordsArray);
    wordsData = getCommonWordsHashMap(lettersHashMap, wordsArray);
    console.log(wordsData)
    excludeNotCommonWords(wordsData);
    lettersGrid = defineLettersGrid(wordsArray);
    startWordsCalculation(wordsArray);

    console.log(wordsArray, lettersHashMap, wordsData);

}

function startWordsCalculation(words) {

    for (var i = 0; i < words.length; i++) {

        wordsData[words[i]].x = startWordX;
        wordsData[words[i]].y = startWordY;
        wordsData[words[i]].direction = initialDirection;
        generateGridStartingFromWord(words[i], wordsData[words[i]]);

    }

    console.log(bestGrids);
    var counter = 0;

    //setInterval(function(){
    //    if(counter == bestGrids.length){
    //        counter = 0;
    //    }
    //    renderLetters(bestGrids[counter]);
    //    counter++;
    //
    //}, 1000);

    renderLetters(bestGrids[0]);


}

function getLettersHashMap(words) {

    var lettersHash = {};

    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {

            if (!lettersHash[words[i][j]]) {
                lettersHash[words[i][j]] = [];
            }

            if (lettersHash[words[i][j]].indexOf(words[i]) == -1) {
                lettersHash[words[i][j]].push(words[i])
            }
        }
    }

    return lettersHash;
}

function getCommonWordsHashMap(lettersHash, words) {

    var wordsData = {};

    for (var i = 0; i < words.length; i++) {
        wordsData[words[i]] = {};
        if (!wordsData[words[i]].candidates) {
            wordsData[words[i]].candidates = [];
        }
        for (var j = 0; j < words[i].length; j++) {

            for (var k = 0; k < lettersHash[words[i][j]].length; k++) {
                if (wordsData[words[i]].candidates.indexOf(lettersHash[words[i][j]][k]) == -1 && words[i] != lettersHash[words[i][j]][k]) {
                    wordsData[words[i]].candidates.push(lettersHash[words[i][j]][k])

                }
            }
        }
    }

    return wordsData;
}

function excludeNotCommonWords(wordsData) {
    for (var key in wordsData) {

        if (wordsData[key].candidates.length == 0) {
            var index = wordsArray.indexOf(key);
            wordsArray.splice(index, 1);
            for (var j = 0; j < key.length; j++) {
                delete lettersHashMap[key[j]];
            }
            delete wordsData[key];
        }
    }
}

function defineLettersGrid(words) {
    var lettersGrid = [],
        index = Math.ceil(words.length / 2),
        maxSize = 0;
    for (var i = 0; i < index; i++) {
        maxSize += words[i].length - 1;
    }

    startWordX = startWordY = maxSize;

    maxSize = maxSize * 2;

    for (var j = 0; j < maxSize; j++) {
        var xArray = [];
        lettersGrid.push(xArray);

        for (var k = 0; k < maxSize; k++) {
            lettersGrid[j].push('');
        }
    }
    return lettersGrid;

}

function placeWordInGrid(word, wordObject, grid) {

    if (wordObject.direction == "horizontal") {
        for (var i = 0; i < word.length; i++) {
            grid[wordObject.y][wordObject.x + i] = word.charAt(i);
        }
    } else {
        for (var i = 0; i < word.length; i++) {
            grid[wordObject.y + i][wordObject.x] = word.charAt(i);
        }
    }
    wordsUsed++;
    usedWordsHash[word] = true;

}

function removeWordFromGrid(word, wordObject, grid) {

    var currentY = wordObject.y;
    var currentX = wordObject.x;
    for (var i = 0; i < word.length; i++) {

        if (isPositionAvailable(currentY, currentX, wordObject.direction, grid)) {
            grid[currentY][currentX] = '';
        }

        if (wordObject.direction == 'horizontal') {
            currentX += 1;
        } else {
            currentY += 1;
        }
    }

    wordsUsed--;
    usedWordsHash[word] = false;

}

function renderLetters(lettersGrid) {

    $('#word-matrix').empty();

    var startX = lettersGrid.length,
        startY = lettersGrid.length,
        endX = 0,
        endY = 0;

    for (var i = 0; i < lettersGrid.length; i++) {
        for (var j = 0; j < lettersGrid[i].length; j++) {
            if (lettersGrid[i][j] != '') {
                startX = Math.min(startX, i);
                startY = Math.min(startY, j);
                endX = Math.max(endX, i);
                endY = Math.max(endY, j);
            }
        }
    }


    for (var i = startX; i <= endX; i++) {
        for (var j = startY; j <= endY; j++) {
            if (lettersGrid[i][j] != '') {

                var $letterTemplate = $("<div class='letter'><span class='coordinates'><span class='y'>"+i +"</span>" + ":" + "<span class='x'>"+ j +"</span></span>" + lettersGrid[i][j] + "</div>");
                $letterTemplate.css({
                    'left': (j - startY) * boxSize + "px",
                    'top': (i - startX) * boxSize + "px"
                }).appendTo('#word-matrix');
            }
        }
    }

    console.log('generateNextGridCount: ', generateNextGridCount, 'Words input: ', wordsArray.length, 'Words used: ', bestGridScore);

}

function keepGridIfBetter(grid, gridWordsSize) {


    if (gridWordsSize >= bestGridScore) {

        var newGrid = grid.map(function (arr) {
            return arr.slice();
        });

        if (gridWordsSize > bestGridScore) {
            bestGrids = [];
            console.log('empty')
        }

        bestGridScore = gridWordsSize;

        bestGrids.push(newGrid)

    }


}


function isPositionAvailable(y, x, direction, grid) {
    if (direction == 'horizontal') {
        if (y - 1 > 0 && grid[y - 1][x] != '')
            return false;
        if (y + 1 < grid.length && grid[y + 1][x] != '')
            return false;
    } else {
        if (x - 1 > 0 && grid[y][x - 1] != '')
            return false;
        if (x + 1 < grid[0].length && grid[y][x + 1] != '')
            return false;
    }
    return true;
}


function generateGridStartingFromWord(word, wordData) {

    var wordScore = calculateCandidateScore(word, wordData, -1, -1);
    console.log(wordScore, word);

    if (wordScore >= 0) {

        placeWordInGrid(word, wordData, lettersGrid);
        keepGridIfBetter(lettersGrid, 1);

        wordsLeft = wordsArray.length - 1;

        generateNextGrid(word, wordData);

        removeWordFromGrid(word, wordData, lettersGrid);
    }

}

function generateNextGrid(previousWord, previousWordData) {

    generateNextGridCount++;
    if(bestGridScore == wordsArray.length) return;


    var candidateDirection = 'horizontal';

    if (previousWordData.direction == 'horizontal') {
        candidateDirection = 'vertical';
    }

    for (var i = 0; i < previousWordData.candidates.length; i++) {

        var candidateWord = previousWordData.candidates[i];
        var candidateWordData = wordsData[candidateWord];
        candidateWordData.direction = candidateDirection;

        if (!usedWordsHash[candidateWord]) {

            for (var j = 0; j < previousWord.length; j++) {

                var crossLetter = previousWord.charAt(j);
                if (lettersHashMap[crossLetter].indexOf(candidateWord)) {

                    var crossingY = previousWordData.y + j,
                        crossingX = previousWordData.x;

                    if (candidateDirection == 'vertical') {

                        crossingY = previousWordData.y;
                        crossingX = previousWordData.x + j;

                    }

                    for (var k = 0; k < candidateWord.length; k++) { //find where is this letter in the second word.
                        var candidateCrossLetter = candidateWord.charAt(k);

                        if (crossLetter == candidateCrossLetter) {
                            var candidateY = previousWordData.y + j;
                            var candidateX = previousWordData.x - k;

                            if (candidateDirection == 'vertical') {
                                candidateY = previousWordData.y - k;
                                candidateX = previousWordData.x + j;
                            }
                            candidateWordData.y = candidateY;
                            candidateWordData.x = candidateX;

                            var candidateBoardScore = calculateCandidateScore(candidateWord, candidateWordData, crossingY, crossingX);
                            if (candidateBoardScore >= 0) { //the candidate is good, so let's place it and explore the option further

                                placeWordInGrid(candidateWord, candidateWordData, lettersGrid);

                                keepGridIfBetter(lettersGrid, wordsUsed);

                                if(bestGridScore == wordsArray.length) return;

                                for (var key in usedWordsHash) {

                                    if (usedWordsHash[key]) {
                                        console.log(key, usedWordsHash[key])
                                        generateNextGrid(key, wordsData[key]);
                                    }
                                }

                                removeWordFromGrid(candidateWord, candidateWordData, lettersGrid);


                            }

                        }
                    }
                }

            }
        }
    }


}

function calculateCandidateScore(word, wordData, intersectionX, intersectionY) {

    var candidateScore = 0;
    var currentLetter = '',
        target = '';

    if (wordData.direction == 'horizontal') {

        for (var i = 0; i < word.length; i++) {
            if (wordData.x + i == intersectionX) continue;
            currentLetter = word.charAt(i);
            target = lettersGrid[wordData.y][wordData.x + i];
            if (target == '') { //empty, so good candidate if it has valid neighbours
                if (!isPositionAvailable(wordData.y, wordData.x + i, wordData.direction, lettersGrid)) return -1;
            } else if (target != word.charAt(i)) {
                return -1;//letter is not matching
            } else {
                //word is crossing another word, increase score
                console.log('---->', word, wordData, intersectionX, intersectionY)
                candidateScore++;
            }
        }

    } else {

        for (var i = 0; i < word.length; i++) {
            if (wordData.y + i == intersectionY) continue;
            currentLetter = word.charAt(i);
            target = lettersGrid[wordData.y + i][wordData.x];

            if (target == '') { //empty, so good candidate if it has valid neighbours
                if (!isPositionAvailable(wordData.y + i, wordData.x, wordData.direction, lettersGrid)) return -1;
            } else if (target != currentLetter) {
                return -1;//letter is not matching
            } else {// target == current
                //word is crossing another word, increase score
                candidateScore++;
            }

        }
    }

    return candidateScore;
}