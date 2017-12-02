var HeroesArena = function () {

    var maxRounds = 50,
        currentRound = 0,
        playerOne,
        playerTwo,
        arena = this;

    arena.init = function (heroOne, heroTwo, rounds) {

        playerOne = heroOne;
        playerTwo = heroTwo;

        if (rounds) {
            maxRounds = rounds;
        }
        console.log('Players:', playerOne.get('name'), 'and', playerTwo.get('name'), 'have entered the arena');
        console.log(playerOne.get('name'), 'says:', playerOne.get('entrySlogan'));
        console.log(playerTwo.get('name'), 'says:', playerTwo.get('entrySlogan'));
    };


    arena.start = function () {
        console.log('Fight has started!');
        playerOne.setOpponent(playerTwo);
        playerTwo.setOpponent(playerOne);
        arena.round()
    };

    arena.round = function () {

        if (hasMatchEnded()) {
            arenaRenderMatchEnd();
            return;
        }
        update();
        render();
        currentRound++;
        arena.round();
    };

    var hasMatchEnded = function () {
        return currentRound >= maxRounds ||
            playerOne.get('health') <= 0 ||
            playerTwo.get('health') <= 0
    };

    var update = function () {
        playerOne.update();
        playerTwo.update();
        playerOne.updateDamageTaken(playerTwo.getDamage());
        playerTwo.updateDamageTaken(playerOne.getDamage());
    };

    var render = function () {
        playerOne.render();
        playerTwo.renderDamageTaken();
        playerTwo.render();
        playerOne.renderDamageTaken();
    };

    var arenaRenderMatchEnd = function () {
        console.log('Arena match has ended.');
        var playerOneHealth = playerOne.get('health'),
            playerTwoHealth = playerTwo.get('health');

        if (playerOneHealth <= 0 && playerTwoHealth <= 0) {
            console.log('Wow what a match they are both down. There is no winner');
        } else if (playerOneHealth > playerTwoHealth) {
            playerOne.wins()
        } else if (playerOneHealth < playerTwoHealth) {
            playerTwo.wins()
        } else {
            console.log('What a match! It is hard to decide who is stronger');
        }
    };

};


var SuperHero = function (options) {

    var opponent = null,
        defaults = {
            health: 100,
            hitActions: [{
                name: 'do a normal attack',
                damage: 5,
                chanceToHit: 100
            }],
            entrySlogan: 'Get over here!',
            winningSlogan: 'I am the winner!',
            bodyParts: [
                {
                    name: 'head',
                    blockChance: 50,
                    damageMultiplier: 1.5
                },
                {
                    name: 'body',
                    blockChance: 30,
                    damageMultiplier: 1.2
                },
                {
                    name: 'legs',
                    blockChance: 20,
                    damageMultiplier: 1.1
                }
            ]
        },
        currentRound = {
            hit: {},
            target: {},
            damage: 0
        },
        hero = this;

    hero.init = function (options) {
        hero.settings = $.extend({}, defaults, options)
    };

    hero.setOpponent = function (superHero) {

        opponent = superHero;

    };

    hero.update = function () {
        currentRound.hit = hero.get('hitActions')[getRandomInt(0, hero.get('hitActions').length - 1)],
            currentRound.target = opponent.get('bodyParts')[getRandomInt(0, opponent.get('bodyParts').length - 1)];

        var blockChance = getRandomInt(0, currentRound.target.blockChance),
            hitChance = getRandomInt(0, currentRound.hit.chanceToHit);


        if (hitChance >= blockChance) {
            currentRound.damage = Math.ceil(currentRound.hit.damage * currentRound.target.damageMultiplier);
        } else {
            //TODO successively blocks should be restricted?
            currentRound.damage = 0;
        }


    };

    hero.render = function () {
        console.log(hero.get('name'), 'decides to', currentRound.hit.name, 'at', opponent.get('name') + "'s", currentRound.target.name);
    };

    hero.renderDamageTaken = function () {
        if (currentRound.damageTaken > 0) {
            console.log(hero.get('name'), 'was hit for', currentRound.damageTaken, 'damage and his current health is', hero.get('health'))
        } else {
            console.log(hero.get('name'), 'blocked the attack!');
        }
    };

    hero.getDamage = function () {
        return currentRound.damage;
    };

    hero.updateDamageTaken = function (damage) {
        currentRound.damageTaken = damage;
        hero.settings.health -= currentRound.damageTaken;
    };

    hero.wins = function () {
        console.log(hero.get('name'), 'has won the arena', '\n',hero.get('name'), 'says:', hero.get('winningSlogan'))
    };

    hero.get = function (property) {
        return hero.settings[property];
    };
    hero.set = function (property, value) {
        hero.settings[property] = value;
    };


    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    hero.init(options)

};

function startGame() {

    var arena = new HeroesArena(),

        bruceWayne = new SuperHero({
            name: 'Bruce Wayne',
            entrySlogan: 'I am vengeance! I am the night! I am Batman!',
            winningSlogan: 'The Night is Dark and full of Terrors!',
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
            name: 'Clark Kent',
            entrySlogan: "It's a bird! It's a plane! It's Superman!",
            winningSlogan: "Oh boy! Was that even a challenge?",
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

    arena.init(bruceWayne, clarkKent, 20);

    arena.start();
}


