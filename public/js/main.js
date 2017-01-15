var wordsArray = ["test", "combo", "another", "programming", "associate", "word", "what", "cat", "dog", "vvv"],
//var wordsArray = ["darik", "darko", "marko", "resho", "omgeee", "dron"],
//var wordsArray = [ "mekq", "kggeek", "mem", "asd", "tet"],
//var wordsArray = ["hello", "world", "madbid", "interesting", "task", "korea", "programming",
//        "the", "quick", "brown", "fox", "jumped", "over", "lazy", "dog",
//        "keep", "going", "until", "you", "become", "completely", "numb", "and", "then", "some", "more", "it", "is", "never", "enough"],
//var wordsArray = ["hello", "world", "task", "korea", "the", "quick", "brown", "fox", "jumped", "over", "lazy", "dog", "keep", "going", "until", "you", "become", "numb", "and", "then", "some", "more","it","is","never","enough","ta", "tb", "tc", "td", "te", "tf", "tg", "th", "ti", "tj", "tk", "tl", "tm", "tn", "to", "tp"],
    bestGrids = [],
    lettersGrid = [],
    lettersHashMap = {},
    usedWordsHash = {},
    wordsData = {},
    bestGridScore = 0,
    generateNextGridCount = 0,
    startWordX = 0,
    startWordY = 0,
    startTimeGrid = 0,
    startTimeTotal = 0,

    INITIAL_DIRECTION = 'HORIZONTAL',
    BOX_SIZE = 41,
    TIME_PER_GRID = 45000,
    TIME_TOTAL = 45000;

function init() {

    addEvent();
    calculateWords();

}

function resetVars() {
    wordsArray = [];
    bestGrids = [],
    lettersGrid = [],
    lettersHashMap = {},
    usedWordsHash = {},
    wordsData = {},
    bestGridScore = 0,
    generateNextGridCount = 0,
    startWordX = 0,
    startWordY = 0,
    startTimeGrid = 0,
    startTimeTotal = 0;
}
function addEvent() {
    $('#render-button').on('click', function () {
        resetVars();
        var value = $(this).closest('.input-group').find('input').val().replace(/ /g, '');
        wordsArray = value.split(',');
        calculateWords();
    })
}

function calculateWords() {

    wordsArray.sort(function (a, b) {
        return b.length - a.length;
    });

    lettersHashMap = getLettersHashMap(wordsArray);
    wordsData = getCommonWordsHashMap(lettersHashMap, wordsArray);
    excludeNotCommonWords(wordsData);
    lettersGrid = defineLettersGrid(wordsArray);
    startWordsCalculation(wordsArray);

    console.log(wordsArray, lettersHashMap, wordsData);

}

function startWordsCalculation(words) {


    startTimeTotal = new Date().getTime();
    for (var i = 0; i < words.length; i++) {
        wordsData[words[i]].x = startWordX;
        wordsData[words[i]].y = startWordY;
        wordsData[words[i]].direction = INITIAL_DIRECTION;
        generateGridStartingFromWord(words[i], wordsData[words[i]]);
    }

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

function placeWordInGrid(word, wordData, grid) {

    wordsData[word] = wordData;
    if (wordData.direction == "HORIZONTAL") {
        for (var i = 0; i < word.length; i++) {
            grid[wordData.y][wordData.x + i] = word.charAt(i);
        }
    } else {
        for (var i = 0; i < word.length; i++) {
            grid[wordData.y + i][wordData.x] = word.charAt(i);
        }
    }
    usedWordsHash[word] = true;
}

function removeWordFromGrid(word, wordObject, grid) {

    var currentY = wordObject.y;
    var currentX = wordObject.x;
    for (var i = 0; i < word.length; i++) {

        if (isPositionAvailable(currentY, currentX, wordObject.direction, grid)) {
            grid[currentY][currentX] = '';
        }

        if (wordObject.direction == 'HORIZONTAL') {
            currentX += 1;
        } else {
            currentY += 1;
        }
    }
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

                var offsetX = i - startX;
                var offsetY = j- startY;
                var $letterTemplate = $("<div class='letter'><span class='coordinates'><span class='y'>" + offsetX + "</span>" + ":" + "<span class='x'>" + offsetY+ "</span></span>" + lettersGrid[i][j] + "</div>");
                $letterTemplate.css({
                    'left': (j - startY) * BOX_SIZE + "px",
                    'top': (i - startX) * BOX_SIZE + "px"
                }).appendTo('#word-matrix');
            }
        }
    }

    var currentTime = new Date().getTime();

    console.log('generateNextGridCount: ', generateNextGridCount);
    console.log('Words input: ', wordsArray.length, 'Words used: ', bestGridScore);
    console.log('time spent: ', (currentTime - startTimeTotal) / 1000);

}

function keepGridIfBetter(grid, gridWordsSize) {


    if (gridWordsSize >= bestGridScore) {

        var newGrid = grid.map(function (arr) {
            return arr.slice();
        });

        if (gridWordsSize > bestGridScore) {
            bestGrids = [];
        }

        bestGridScore = gridWordsSize;

        bestGrids.push(newGrid)

    }


}


function isPositionAvailable(y, x, direction, grid) {

    if (direction == 'HORIZONTAL') {
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

    if (wordScore >= 0) {

        startTimeGrid = new Date().getTime();
        placeWordInGrid(word, wordData, lettersGrid);
        keepGridIfBetter(lettersGrid, 1);

        var wordsLeft = wordsArray.length - 1;
        var wordsUsed = 1;
        generateNextGrid(word, wordData, wordsLeft, wordsUsed);

        removeWordFromGrid(word, wordData, lettersGrid);
    }

}

function generateNextGrid(previousWord, previousWordData, wordsLeft, wordsUsed) {

    generateNextGridCount++;
    var previous = $.extend(true, {}, previousWordData);

    if (bestGridScore == wordsArray.length) return;
    var exceeds = shouldTerminate(wordsLeft, wordsUsed);
    if (exceeds) {
        return
    }


    var candidateDirection = 'HORIZONTAL';
    if (previous.direction == 'HORIZONTAL') {
        candidateDirection = 'VERTICAL';
    }

    for (var i = 0; i < previous.candidates.length; i++) {

        var candidateWord = previous.candidates[i];

        if (!usedWordsHash[candidateWord]) {

            for (var j = 0; j < previousWord.length; j++) {

                var crossLetter = previousWord.charAt(j);
                if (lettersHashMap[crossLetter].indexOf(candidateWord) != -1) {


                    var crossingY = previous.y,
                        crossingX = previous.x + j;

                    if (previousWord.direction == 'VERTICAL') {

                        crossingY = previous.y + j;
                        crossingX = previous.x;

                    }

                    for (var k = 0; k < candidateWord.length; k++) { //find where is this letter in the second word.
                        var candidateCrossLetter = candidateWord.charAt(k);

                        if (crossLetter == candidateCrossLetter) {
                            var candidateY = previous.y + j;
                            var candidateX = previous.x - k;

                            if (candidateDirection == 'VERTICAL') {
                                candidateY = previous.y - k;
                                candidateX = previous.x + j;
                            }
                            var candidateWordData = $.extend(true, {}, wordsData[candidateWord]);
                            candidateWordData.y = candidateY;
                            candidateWordData.x = candidateX;
                            candidateWordData.direction = candidateDirection;

                            var candidateBoardScore = calculateCandidateScore(candidateWord, candidateWordData, crossingX, crossingY);
                            if (candidateBoardScore >= 0) { //the candidate is good, so let's place it and explore the option further

                                placeWordInGrid(candidateWord, candidateWordData, lettersGrid);

                                var newWordsUsed = wordsUsed + 1;
                                var newWordsLeft = wordsLeft - 1;
                                keepGridIfBetter(lettersGrid, newWordsUsed);

                                if (bestGridScore == wordsArray.length) return;

                                for (var i = 0; i < wordsArray.length; i++) {
                                    if (usedWordsHash[wordsArray[i]]) {
                                        generateNextGrid(wordsArray[i], wordsData[wordsArray[i]], newWordsLeft, newWordsUsed);
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

    if (wordData.direction == 'HORIZONTAL') {
        //check whether the element before first letter and element after last letter are free. Words should not touch others
        if (lettersGrid[wordData.y][wordData.x + word.length] != '') return -1;
        if (lettersGrid[wordData.y][wordData.x - 1] != '') return -1;


        for (var i = 0; i < word.length; i++) {
            if (wordData.x + i == intersectionX) continue;
            currentLetter = word.charAt(i);
            target = lettersGrid[wordData.y][wordData.x + i];
            if (word == 'jumped' && wordData.x == 76 && wordData.y == 71) {
                console.log('wordData', word, wordData)
            }
            if (word == 'brown' && wordData.x == 75 && wordData.y == 75) {
                console.log('wordData', word, wordData)
            }
            if (target == '') { //empty, so good candidate if it has valid neighbours

                if (!isPositionAvailable(wordData.y, wordData.x + i, wordData.direction, lettersGrid)) return -1;
            } else if (target != word.charAt(i)) {
                return -1;//letter is not matching
            } else {
                //word is crossing another word, increase score
                //console.log('---->', word, wordData, intersectionX, intersectionY)
                candidateScore++;
            }
        }

    } else { //wordData.direction == 'VERTICAL'
        //check whether the element before first letter and element after last letter are free. Words should not touch others
        if (lettersGrid[wordData.y + word.length][wordData.x] != '') return -1;
        if (lettersGrid[wordData.y - 1][wordData.x] != '') return -1;


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


function shouldTerminate(wordsLeft, wordsUsed) {
    var currentTime = new Date().getTime();
    //console.log(currentTime)
    if (currentTime - startTimeGrid >= TIME_PER_GRID) {
        return true; //kill execution if time limit is reached
    }

    if (currentTime - startTimeTotal >= TIME_TOTAL) {
        return true;
    }
    //
    //bottom of recursion
    if (wordsLeft == 0) {
        return true;
    }
    //we will not find a better solution down this path
    if (wordsLeft + wordsUsed <= bestGridScore) {
        return true;
    }
    //this is a global maximum so stop searching for better solutions (here better means with more words, not with more crossings)
    if (bestGridScore == wordsArray.length) {
        return true;
    }

    return false;
}
