var lettersArray = new Array();
lettersArray[0]= new Array("a","","c","d","e","f","g","h","i","j" );
lettersArray[1]= new Array("A","","C","","","F","","","I","J" );
lettersArray[2]= new Array("ä","","","","","Ø",">","","","ÿ" );

var wordsArray = ["test", "combo","another","programming","associate","word","what","cat","dog","vvv"];

var lettersHashMap = {},
    commonWords = {};


var boxSize = 31;

function init() {
    // test render
    renderLetters(lettersArray);

    wordsArray.sort(function(a, b){
        return b.length - a.length;
    });

    lettersHashMap = getLettersHashMap(wordsArray);
    commonWords = getCommonWordsHashMap(lettersHashMap, wordsArray);
    excludeUncommonWords(commonWords);
    console.log(wordsArray, lettersHashMap, commonWords)

}



function getLettersHashMap(words){

    var lettersHash = {};

    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {

            if(!lettersHash[words[i][j]]){
                lettersHash[words[i][j]] = [];
            }

            if(lettersHash[words[i][j]].indexOf(words[i]) == -1){
                lettersHash[words[i][j]].push(words[i])
            }
        }
    }

    return lettersHash;
}

function getCommonWordsHashMap(lettersHash, words) {

    var commonWords = {};

    for (var i = 0; i < words.length; i++) {
        if(!commonWords[words[i]]){
            commonWords[words[i]] = [];
        }
        for (var j = 0; j < words[i].length; j++) {

            for(var k = 0; k < lettersHash[words[i][j]].length; k++){
                if(commonWords[words[i]].indexOf(lettersHash[words[i][j]][k]) == -1 && words[i] != lettersHash[words[i][j]][k]){
                    commonWords[words[i]].push(lettersHash[words[i][j]][k])

                }
            }
        }
    }

    return commonWords;
}

function excludeUncommonWords(commonWords) {
    for(var key in commonWords){
        if(commonWords[key].length == 0){
            var index = wordsArray.indexOf(commonWords[key]);
            wordsArray.splice(index, 1);
            for (var j = 0; j < key.length; j++) {
                delete lettersHashMap[key[j]];
            }
            delete commonWords[key];
        }
    }
}

function renderLetters(lettersArray){

    for (var i = 0; i < lettersArray.length; i++) {
        for(var j = 0; j < lettersArray[i].length; j++){
            if(lettersArray[i][j] != ''){
                var $letterTemplate = $("<div class='letter'>"+ lettersArray[i][j] +"</div>");
                $letterTemplate.css({'left':j*boxSize+"px",'top':i*boxSize+ "px"}).appendTo('#word-matrix');
            }
        }
    }

}
//TODO

// Dictionary za bukva i dumi
// findNeighbours - думи които споделят същите букви
// words = removeWordsWithoutNeighbours(words, neighbours);
// da excludena dumite bez obsti bukvi ot wordsArray i ot 2ta hashmapa

