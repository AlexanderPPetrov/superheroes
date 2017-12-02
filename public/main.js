/**
 * Created by alexanderpetrov on 30.11.17 г..
 */

var HeroesArena = function () {

    var maxRounds = 50,
        currentRound = 0,
        arena = this;

    arena.init = function () {
        console.log('Arena was initialized');
    };

    arena.addPlayers = function (playerOne, playerTwo) {

        arena.playerOne = playerOne;
        arena.playerTwo = playerTwo;
        console.log('Players:', playerOne.get('name'), 'and', playerTwo.get('name'), 'have entered the arena');
        console.log(playerOne.get('name'), 'says:',playerOne.get('entrySlogan'));
        console.log(playerTwo.get('name'), 'says:',playerTwo.get('entrySlogan'));
    };


    arena.start = function (rounds) {
        if(rounds && rounds <= maxRounds){
            maxRounds = rounds;
        }
        console.log('Fight has started!');
        arena.tick()
    };

    arena.tick = function(){

        if(currentRound > maxRounds){
            arenaChooseWinner();

        }else{

            if(arena.playerOne.get('health') <= 0){
                arenaChooseWinner();
                return;
            }
            if(arena.playerOne.get('health') <= 0){
                arenaChooseWinner();
                return;
            }

            arena.playerOne.faceOpponent(arena.playerTwo);
            arena.playerTwo.faceOpponent(arena.playerOne);
            currentRound++;
            arena.tick();
        }
    };

    var arenaChooseWinner = function(){

        console.log('Arena match has ended.');
        var playerOneHealth = arena.playerOne.get('health'),
            playerTwoHealth = arena.playerTwo.get('health');

        if(playerOneHealth <= 0 && playerTwoHealth <= 0){
            console.log('Wow what a match they are both down. There is no winner');
            return;
        }

        if(playerOneHealth > playerTwoHealth){
            arena.playerOne.wins()
        } else if (playerOneHealth < playerTwoHealth){
            arena.playerTwo.wins()
        } else {
            console.log('What a match! It is hard to decide who is stronger');
        }
    };

    arena.init();

};


var SuperHero = function(options){

    var defaults = {
        health: 100,
        hitActions: [{
            name: 'do a normal attack',
            damage: 5,
            chanceToHit: 100
        }],
        entrySlogan:'Get over here!',
        winningSlogan:'I am the winner!',
        bodyParts:[
            {
                name:'head',
                blockChance:50,
                damageMultiplier: 1.5
            },
            {
                name:'body',
                blockChance:30,
                damageMultiplier: 1.2
            },
            {
                name:'legs',
                blockChance:20,
                damageMultiplier: 1.1
            }
        ]
    };

    var hero = this;
    hero.init = function(options){
        hero.settings = $.extend({}, defaults, options)
    };

    hero.faceOpponent = function(superHero){

        strikeOpponent(superHero);

    };

    var strikeOpponent = function(opponent){

        var hit = hero.get('hitActions')[getRandomInt(0, hero.get('hitActions').length - 1)],
            target = opponent.get('bodyParts')[getRandomInt(0, opponent.get('bodyParts').length - 1)];

        console.log(hero.get('name'), 'decides to', hit.name , 'at', opponent.get('name')+ "'s",target.name);


        var blockChance = getRandomInt(0, target.blockChance),
            hitChance = getRandomInt(0, hit.chanceToHit);

        if(hitChance >=blockChance){
            opponent.gotHit(hit.damage*target.damageMultiplier);
        }else{
            console.log(opponent.get('name'), 'blocked the attack!');
        }

    };

    hero.gotHit = function(damage){
        damage = Math.round(damage);
        hero.settings.health -= damage;
        console.log(hero.get('name'), 'was hit for', damage,'damage and his current health is', hero.get('health'))
    };

    hero.wins = function(){
        console.log(hero.get('name'), 'has won the arena' + '\n' + hero.get('winningSlogan'))
    };

    hero.get = function(property){
        return hero.settings[property];
    };
    hero.set = function(property, value){
        hero.settings[property] = value;
    };


    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    hero.init(options)

};

function startGame(){

    var arena = new HeroesArena(),

        bruceWayne = new SuperHero({
            name:'Bruce Wayne',
            entrySlogan:'I am vengeance! I am the night! I am Batman!',
            winningSlogan:'The Night is Dark and full of Terrors!',
            hitActions: [
                {
                    name: 'throw a vicious strike',
                    damage: 15,
                    chanceToHit: 60
                },
                {
                    name: 'throw a shuriken',
                    damage: 8,
                    chanceToHit: 80
                },
                {
                    name: 'swipe his cloak for humiliation',
                    damage: 3,
                    chanceToHit: 100
                }
            ]
        }),
        clarkKent = new SuperHero({
            name:'Clark Kent',
            entrySlogan:"It's a bird! It's a plane! It's Superman!",
            winningSlogan:"Oh boy! Was that even a challenge?",
            hitActions: [
                {
                    name: 'do an epic charge',
                    damage: 18,
                    chanceToHit: 50
                },
                {
                    name: 'throw a rocket punch',
                    damage: 6,
                    chanceToHit: 90
                },
                {
                    name: 'make a gust of wind for humiliation',
                    damage: 3,
                    chanceToHit: 100
                }
            ]
        });

    arena.addPlayers(bruceWayne, clarkKent);

    arena.start(20);
}


