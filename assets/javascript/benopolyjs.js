//BenopolyJS (1-17-2017 - a project to practice with)

//game variable
var g;
//dice roll
var total;

//starting positions for all pieces
var currentXRect = 1130;
var currentYRect = 1150;
var currentXCirc = 1155;
var currentYCirc = 1125;
var currentXRect2 = 1084;
var currentYRect2 = 1150;
var currentXRect3 = 1084;
var currentYRect3 = 1150;
var currentXHouse = 955;
var currentYHouse = 1054;








//shuffles an array
function shuffleCards(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function BoardSquare(location) {
    this.location = location;
}

function Property(location, name, price, rentArray, housePrice, group, xHouse, yHouse) {
    //establishing inheritance from BoardSquare
    BoardSquare.call(this, location);
    //name of the property
    this.name = name;
    //bank starts off owning everything
    this.isOwned = false;
    //this will change if mortgaged
    this.isOwnedOutright = true;
    //this will change if the property becomes part of a monopoly, this will be used to allow houses to be built and 
    //double the rent if no houses 
    this.monopolized = false;
    //the rents with (0 houses, 1 house, 2 house, 3 house, 4 house, hotel)
    this.rentArray = rentArray;
    //cost to purchase property
    this.price = price;
    //price to add houses and hotel
    this.housePrice = housePrice;
    //setting rent as double if monopolized
    this.monoRent = (this.rentArray[0] * 2);
    //set property group
    this.group = group;
    this.xHouse = xHouse;
    this.yHouse = yHouse;
    this.ownedByPlayerIndex = -1;
    this.houses = 0;
    this.monopolized = false;
}


// to inherit methods defined in BoardSquare
// We are using create to create a new prototype property 
// value (which is itself an object that contains properties and methods) with a prototype 
// equal to BoardSquare.prototype, and set that to be the value of Property.prototype. This 
// means that Property.prototype will now inherit all the methods available on 
// BoardSquare.prototype.

Property.prototype = Object.create(BoardSquare.prototype);

//setting constructor of Property to Property (must do this with JS inheritance)
Property.prototype.constructor = Property;


Property.prototype.chanceRRRent = function() {
    var x = this.ownedByPlayerIndex;
    rent = 0;

    switch (g.players[x].rrsOwned) {
        case 1:
            rent = 50;
            console.log(rent);
            break;
        case 2:
            rent = 100;
            console.log(rent);
            break;
        case 3:
            rent = 200;
            console.log(rent);
            break;
        case 4:
            rent = 400;
            console.log(rent);
            break;
    }
    return rent;
}

Property.prototype.canIBuild = function() {
    var props = g.players[g.cpi].props;
    var thisGroup = this.group;
    var housesInGroup = [];
    for (i in props) {
        if (props[i].group === thisGroup) {
            //make array of other properties' houses in group
            if ((props[i].location != this.location)) {
                housesInGroup.push(props[i].houses);
            }
        }
    }
    // Tests if houses are being built evenly and returns false if any prop in the group has 
    // less houses than the current one
    console.log('t/f, can i build? (not valid if hotel already built) - ' + housesInGroup.every(houseHelper, this.houses));
    return ((this.houses < 5) && (housesInGroup.every(houseHelper, this.houses)));
}

function houseHelper(h) {
    //helper to .every, if all houses in group are equal or less to selected property, then you are allowed to build
    return h >= this;
}


function NonProperty(location, name) {
    //establishing inheritance from BoardSquare
    BoardSquare.call(this, location);
    this.name = name;
}

//set it up same as property
NonProperty.prototype = Object.create(BoardSquare.prototype);
NonProperty.prototype.constructor = NonProperty;

function Card(id, name) {
    this.id = id;
    this.name = name;
}

Card.prototype.doCard = function() {
    alert(this.name);
    console.log('doCard started using: ' + this.name);
    switch (this.name) {
        //case statements for all cards
        case 'Advance to Go (Collect $200)':
            g.players[g.cpi].location = 0;
            g.players[g.cpi].passedGo();
            break;
        case 'Bank error in your favor: collect $200':
            g.players[g.cpi].cash += 200;
            break;
        case 'Doctor\'s fees: Pay $50':
            g.players[g.cpi].cash -= 50;
            break;
        case 'Get Out of Jail Free: this card may be kept until needed, or sold':
            g.players[g.cpi].hasGOJcard = true;
            break;
        case 'Go to Jail: go directly to jail, Do not pass Go, do not collect $200':
            g.players[g.cpi].sendToJail();
            break;
        case 'It is your birthday: Collect $10 from each player':
            g.players[g.cpi].collectFromAllOthers(10);
            break;
        case 'Grand Opera Night: collect $50 from every player for opening night seats':
            g.players[g.cpi].collectFromAllOthers(50);
            break;
        case 'Income Tax refund: collect $20':
            g.players[g.cpi].cash += 20;
            break;
        case 'Life Insurance Matures: collect $100':
            g.players[g.cpi].cash += 100;
            break;
        case 'Pay Hospital Fees of $100':
            g.players[g.cpi].cash -= 100;
            break;
        case 'Pay School Fees of $50':
            g.players[g.cpi].cash -= 50;
            break;
        case 'Receive $25 Consultancy Fee':
            g.players[g.cpi].cash += 25;
            break;
        case 'You are assessed for street repairs: $40 per house, $115 per hotel':
            g.players[g.cpi].makeRepairs(40, 115);
            break;
        case 'You have won second prize in a beauty contest: collect $10':
            g.players[g.cpi].cash += 10;
            break;
        case 'You inherit $100':
            g.players[g.cpi].cash += 100;
            break;
        case 'From sale of stock you get $50':
            g.players[g.cpi].cash += 50;
            break;
        case 'Holiday Fund matures: Receive $100':
            g.players[g.cpi].cash += 100;
            break;
        case 'Advance to Illinois Ave:  if you pass Go, collect $200':
            console.log('illinois');
            g.players[g.cpi].goToSquare(24);
            break;
        case 'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.':
            console.log('utility');
            //create flag to skip rent payment and do custom roll and rent payment in its own method
            //todo
            break;
        case 'Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.':
            console.log('RR');

            //chance 7. 22. 36
            if (g.players[g.cpi].location = 7) {
                g.players[g.cpi].goToSquare(15);
                var rent = g.board[15].chanceRRRent;
                var ownerIndex = g.board[15].ownedByPlayerIndex;
                if (g.board[15].isOwned) {
                    g.players[ownerIndex].cash += rent;
                    g.players[g.cpi].cash -= rent;
                    console.log('player id ' + g.players[g.cpi].id + ' paid player id ' + g.players[ownerIndex] + ' rent of ' + rent);
                }
            }
            if (g.players[g.cpi].location = 22) {
                g.players[g.cpi].goToSquare(25);
                var rent = g.board[25].chanceRRRent;
                var ownerIndex = g.board[25].ownedByPlayerIndex;
                if (g.board[25].isOwned) {
                    g.players[ownerIndex].cash += rent;
                    g.players[g.cpi].cash -= rent;
                    console.log('player id ' + g.players[g.cpi].id + ' paid player id ' + g.players[ownerIndex] + ' rent of ' + rent);
                }
            }
            if (g.players[g.cpi].location = 36) {
                g.players[g.cpi].passedGo();
                g.players[g.cpi].goToSquare(5);
                var rent = g.board[5].chanceRRRent;
                var ownerIndex = g.board[5].ownedByPlayerIndex;
                if (g.board[5].isOwned) {
                    g.players[ownerIndex].cash += rent;
                    g.players[g.cpi].cash -= rent;
                    console.log('player id ' + g.players[g.cpi].id + ' paid player id ' + g.players[ownerIndex] + ' rent of ' + rent);
                }
            }
            break;
        case 'Advance to St. Charles Place: if you pass Go, collect $200':
            console.log('st charles');
            g.players[g.cpi].goToSquare(11);
            break;
        case 'Bank pays you dividend of $50':
            g.players[g.cpi].cash += 50;
            break;
        case 'Get out of Jail Free:  this card may be kept until needed, or traded/sold':
            g.players[g.cpi].hasGOJcard = true;
            break;
        case 'Go back 3 spaces':
            console.log('back 3');
            g.players[g.cpi].moveBack3();
            break;
        case 'Go directly to Jail:  do not pass Go, do not collect $200':
            console.log('jail');
            g.players[g.cpi].sendToJail();
            break;
        case 'Make general repairs on all your property: for each house pay $25, for each hotel $100':
            //to-do
            g.players[g.cpi].makeRepairs(25, 100);
            console.log('repairs');
            break;
        case 'Pay poor tax of $15':
            g.players[g.cpi].cash -= 15;
            break;
        case 'Take a trip to Reading Railroad:  if you pass Go, collect $200':
            g.players[g.cpi].goToSquare(5);
            console.log('reading');
            break;
        case 'Take a walk on the Boardwalk:  advance token to Boardwalk':
            g.players[g.cpi].goToSquare(39);
            break;
        case 'You have been elected chairman of the board:  pay each player $50':
            g.players[g.cpi].payAllOthers(50);
            break;
        case 'Your building loan matures:  collect $150':
            g.players[g.cpi].cash += 150;
            break;
        case 'You have won a crossword competition: collect $100':
            g.players[g.cpi].cash += 100;
            break;
            //end of Card case statements
    }

    //draws player on correct board square
    var x = g.players[g.cpi].xArray[g.players[g.cpi].location];
    var y = g.players[g.cpi].yArray[g.players[g.cpi].location];
    movePlayer(x, y);

    if (g.board[g.players[g.cpi].location].constructor === Property) {
        g.players[g.cpi].prompt();
    }
    g.players[g.cpi].promptDone();
}

function Player(id, name) {
    this.name = name;
    this.id = id;
    this.cash = 1500;
    this.location = 0;
    this.props = [];
    this.jRolls = 0;
    this.hasGOJcard = false;
    this.rrsOwned = 0;
    this.utsOwned = 0;
    this.jailed = false;
    this.doubleRolls = 0;
    this.xArray = [];
    this.yArray = [];
}

Player.prototype.payAllOthers = function(pmt) {
    for (i in g.players) {
        if (g.cpi != i) {
            g.players[i].cash += pmt;
            g.players[g.cpi].cash -= pmt;
        }
    }
}

Player.prototype.collectFromAllOthers = function(pmt) {
    for (i in g.players) {
        if (g.cpi != i) {
            g.players[i].cash -= pmt;
            g.players[g.cpi].cash += pmt;
        }
    }
}

Player.prototype.makeRepairs = function(houseCost, hotelCost) {
    var repairCost = 0;
    var housesTotal = 0;
    var hotelsTotal = 0;
    repairableProps = this.props;
    for (i in repairableProps) {
        if (repairableProps[i].houses < 5) {
            housesTotal += repairableProps[i].houses;
        } else {
            hotelsTotal += 1;
        }
    }
    repairCost = (housesTotal * houseCost) + (hotelsTotal * hotelCost);
    this.cash -= repairCost;
    console.log('Player id ' + this.id + ' had ' + housesTotal + ' houses and ' + hotelsTotal +
        ' hotels. Their total repair bill was ' + repairCost);
}

Player.prototype.moveBack3 = function() {
    if (this.location > 2) {
        this.location -= 3;
    } else {
        var temp;
        temp = this.location -= 3;
        this.location = temp + 40;
    }
}


//break

Player.prototype.sendToJail = function() {
    this.location = 10;
    this.jailed = true;
    this.jrolls = 0;
    var x = g.players[g.cpi].xArray[g.players[g.cpi].location];
    var y = g.players[g.cpi].yArray[g.players[g.cpi].location];
    movePlayer(x, y);
    // $('#rollButton').addClass('disabled');
}



Player.prototype.rollDice = function() {
    //rolling dice
    var dice1 = Math.floor((Math.random() * 6) + 1);
    var dice2 = Math.floor((Math.random() * 6) + 1);
    total = dice1 + dice2;

    console.log('Player with id: ' + this.id + ' rolled ' + dice1 + " & " + dice2);
    //debug test dice
    // total = 7;
    // $('#dice').html('');
    // $('#dice').html('Player with id: ' + this.id + ' rolled ' + dice1 + " & " + dice2);

    //jail handler - do this if player not in jail
    if (!(this.jailed)) {
        console.log('Player with id: ' + this.id + ' rolled ' + dice1 + " & " + dice2);
        //incrementing doubles, or resetting to 0
        if (dice1 === dice2) {
            // $('#doneButton').addClass('disabled');
            this.doubleRolls += 1;
            //letting out of jail if rolled doubles
            if (this.jailed) {
                this.jailed = false;
                this.doubleRolls = 0;
            }
        } else {
            this.doubleRolls = 0;
            // $('#rollButton').addClass('disabled');
        }

        //if you havent rolled doubles three times in a row, then move your guy
        if (this.doubleRolls < 3) {
            if ((this.location + total) < 40) {
                this.location += total;
                var x = this.xArray[this.location];
                var y = this.yArray[this.location];
                movePlayer(x, y);
            } else {
                //award player 200
                this.passedGo();
                //set location when passing go
                var goLoc = this.location + total - 40;
                this.location = goLoc;
                var x = this.xArray[goLoc];
                var y = this.yArray[goLoc];
                movePlayer(x, y);
            }
        }
        //if you have rolled doubles 3 times in a row, set location to jail, change jailed to true, set jRolls to 0
        //hide roll button and run promptdone()
        else {
            this.sendToJail();
            this.promptDone();
        }

        hb();
        this.prompt();
        this.promptDone();
    }
    //do this if player in jail
    else {
        if (dice1 === dice2) {
            alert('Doubles! You are free Player with id ' + this.id);
            this.jailed = false;
            this.location += total;
            this.jRolls = 0;
            hb();
            var x = this.xArray[this.location];
            var y = this.yArray[this.location];
            movePlayer(x, y);
            // $('#rollButton').addClass('disabled');
            this.prompt();
            this.promptDone();
        } else if (this.jRolls < 2) {
            this.jRolls += 1;
            alert('You rolled ' + dice1 + ' & ' + dice2 + ' You\'re still in jail, you have ' + (3 - this.jRolls) + ' roll(s) to try and roll doubles and avoid $50 fee.');
            // $('#rollButton').addClass('disabled');
            this.promptDone();
        } else {
            alert('You rolled ' + dice1 + ' & ' + dice2 + '. You did your time player with id ' + this.id + '. But, no doubles so no free pass. You still gotta pay up $50. You are free now.');
            this.cash -= 50;
            this.location += total;
            this.jailed = false;
            this.jRolls = 0;
            // $('#rollButton').addClass('disabled');
            hb();
            this.prompt();
            this.promptDone();
        }
    }

}


Player.prototype.promptDone = function() {
    //alows u to end turn
    // $('#doneButton').removeClass('disabled');
}


Player.prototype.prompt = function() {
    //check if property
    $('#currentSquare').text(g.board[this.location].name);
    if (g.board[this.location].constructor === Property) {
        if (g.board[this.location].ownedByPlayerIndex >= 0) {
            this.payRent();
        } else {
            this.buyPrompt();
        }
    }
    //do this if NonProperty
    else {
        //case statements for each nonproperty square
        switch (g.board[this.location].name) {
            case 'Go':
                //already handled
                break;
            case 'Community Chest':
                this.pullCard('Chest');
                break;
            case 'Income Tax - $200':
                this.cash -= 200;
                break;
            case 'Chance':
                this.pullCard('Chance');
                break;
            case 'Just Visiting':
                break;
            case 'Free Parking':
                break;
            case 'Go to jail':
                this.sendToJail();
                break;
            case 'Chance':
                break;
            case 'Luxury Tax 1.0M':
                break;
        }
    }
}

Player.prototype.pullCard = function(deck) {
    if (deck === 'Chance') {
        //pull card from deck, do action on card, return card to bottom of deck
        var activeCard = g.chanceCards[0];
        console.log('active card\'s name is: ' + activeCard.name);
        g.chanceCards.splice(0, 1);
        console.log('card has been removed from deck. deck size is now: ' + g.chanceCards.length);
        activeCard.doCard();
        console.log('action on card has been performed');
        g.chanceCards.push(activeCard);
        console.log('card has been returned to bottom of deck. deck size is now: ' + g.chanceCards.length);
        console.log('top card in deck is: ' + g.chanceCards[0].name + '. Bottom card in deck is now: ' + g.chanceCards[g.chanceCards.length - 1].name);
    } else if (deck === 'Chest') {
        //pull card from deck, do action on card, return card to bottom of deck
        var activeCard = g.chestCards[0];
        g.chestCards.splice(0, 1);
        activeCard.doCard();
        g.chestCards.push(activeCard);
    }
}

Player.prototype.goToSquare = function(squareLocation) {
    var initialLoc = this.location;
    this.location = squareLocation;
    if (squareLocation < initialLoc) {
        this.passedGo();
    }
}

Player.prototype.buy = function() {
    this.props.push(g.board[this.location]);
    this.cash -= g.board[this.location].price;
    g.board[this.location].ownedByPlayerIndex = g.cpi;
    g.board[this.location].isOwned = true;
    console.log('player ' + this.id + ' just bought ' + g.board[this.location].name + '. He also owns: ');
    for (i in this.props) {
        console.log(this.props[i].name);
    }
    this.checkForMonopolies();
}

Player.prototype.checkForMonopolies = function() {
    var groupArray = [];
    var p = this.props;
    //counts for each monopoly group, starting at 0
    var RR = Ut = BR = LB = PP = OP = RP = YP = GP = DB = 0;

    for (i in p) {
        groupArray.push(p[i].group);
    }
    for (i in groupArray) {
        if (groupArray[i] === 'BR') {
            BR++;
        }
        if (groupArray[i] === 'RR') {
            RR++;
        }
        if (groupArray[i] === 'Ut') {
            Ut++;
        }
        if (groupArray[i] === 'LB') {
            LB++;
        }
        if (groupArray[i] === 'PP') {
            PP++;
        }
        if (groupArray[i] === 'OP') {
            OP++;
        }
        if (groupArray[i] === 'RP') {
            RP++;
        }
        if (groupArray[i] === 'YP') {
            YP++;
        }
        if (groupArray[i] === 'GP') {
            GP++;
        }
        if (groupArray[i] === 'DB') {
            DB++;
        }
    }

    if (BR === 2) {
        g.board[1].monopolized = true;
        g.board[3].monopolized = true;
    }

    if (LB === 3) {
        g.board[6].monopolized = true;
        g.board[8].monopolized = true;
        g.board[9].monopolized = true;
    }
    if (PP === 3) {
        g.board[11].monopolized = true;
        g.board[13].monopolized = true;
        g.board[14].monopolized = true;
    }
    if (OP === 3) {
        g.board[16].monopolized = true;
        g.board[18].monopolized = true;
        g.board[19].monopolized = true;
    }
    if (RP === 3) {
        g.board[21].monopolized = true;
        g.board[23].monopolized = true;
        g.board[24].monopolized = true;
    }
    if (YP === 3) {
        g.board[26].monopolized = true;
        g.board[27].monopolized = true;
        g.board[29].monopolized = true;
    }
    if (GP === 3) {
        g.board[31].monopolized = true;
        g.board[32].monopolized = true;
        g.board[34].monopolized = true;
    }
    if (DB === 2) {
        g.board[37].monopolized = true;
        g.board[39].monopolized = true;
    }

    //railroads
    this.rrsOwned = RR;
    this.utsOwned = Ut;

}



Player.prototype.payRent = function() {
    var ownerIndex = g.board[this.location].ownedByPlayerIndex;
    var tenantIndex = this.id;
    var rent;
    var currentHouses = g.board[this.location].houses;
    console.log('houses: ' + currentHouses);

    if (ownerIndex != tenantIndex) {
        if (g.board[this.location].group === 'RR') {
            // 25, 50, 100, 200
            switch (g.players[ownerIndex].rrsOwned) {
                case 1:
                    rent = 25;
                    console.log(rent);
                    break;
                case 2:
                    rent = 50;
                    console.log(rent);
                    break;
                case 3:
                    rent = 100;
                    console.log(rent);
                    break;
                case 4:
                    rent = 200;
                    console.log(rent);
                    break;
            }
        } else if (g.board[this.location].group === 'Ut') {
            switch (g.players[ownerIndex].utsOwned) {
                case 1:
                    rent = total * 4;
                    console.log(rent);
                    break;
                case 2:
                    rent = total * 10;
                    console.log(rent);
                    break;
            }
        } else {
            switch (currentHouses) {
                case 0:
                    rent = g.board[this.location].rentArray[0];
                    console.log(rent);
                    break;
                case 1:
                    rent = g.board[this.location].rentArray[1];
                    console.log(rent);
                    break;
                case 2:
                    rent = g.board[this.location].rentArray[2];
                    console.log(rent);
                    break;
                case 3:
                    rent = g.board[this.location].rentArray[3];
                    console.log(rent);
                    break;
                case 4:
                    rent = g.board[this.location].rentArray[4];
                    console.log(rent);
                    break;
                case 5:
                    rent = g.board[this.location].rentArray[5];
                    console.log(rent);
                    break;
            }
        }
    }
    g.players[tenantIndex].cash -= rent;
    g.players[ownerIndex].cash += rent;
    console.log('rent paid by player id ' + tenantIndex + ' to player with id ' + ownerIndex + '. Rate of ' + rent);
}

Player.prototype.buyPrompt = function() {
    //show buy button
    if (!(g.board[this.location].isOwned)) {
        $('#buyButton').removeClass('disabled');
    }
}

//function to credit current player w 200
Player.prototype.passedGo = function() {
    this.cash += 200;
    console.log('ran passedGo for player id ' + this.id + ', this.name');
}


//global function to create players
function createPlayers() {
    var players = [];
    var xCoordinateArray = [];
    var yCoordinateArray = [];
    var xRectArray, yRectArray, xCircArray, yCircArray, xRect2Array, yRect2Array, xRect3Array, yRect3Array;

    //setting player position locations for all board spaces
    xRectArray = [1130, 990, 892, 794, 696, 598, 500, 402, 304, 206, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 206, 304, 402, 500, 598, 696, 794, 892, 990, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100];
    yRectArray = [1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 991, 893, 795, 697, 599, 501, 403, 305, 207, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 207, 305, 403, 501, 599, 697, 795, 893, 991];
    xCircArray = [1155, 1015, 917, 819, 721, 623, 525, 427, 329, 231, 133, 133, 133, 133, 133, 133, 133, 133, 133, 133, 133, 231, 329, 427, 525, 623, 721, 819, 917, 1015, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125];
    yCircArray = [1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 1125, 966, 868, 770, 672, 574, 476, 378, 280, 182, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 84, 182, 280, 378, 476, 574, 672, 770, 868, 966];
    xRect2Array = [1084, 944, 846, 748, 650, 552, 454, 356, 258, 160, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 160, 258, 356, 454, 552, 650, 748, 846, 944, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054];
    yRect2Array = [1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 991, 893, 795, 697, 599, 501, 403, 305, 207, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 109, 207, 305, 403, 501, 599, 697, 795, 893, 991];
    xRect3Array = [1084, 944, 846, 748, 650, 552, 454, 356, 258, 160, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 160, 258, 356, 454, 552, 650, 748, 846, 944, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054, 1054];
    yRect3Array = [1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 941, 843, 745, 647, 549, 451, 353, 255, 157, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 157, 255, 353, 451, 549, 647, 745, 843, 941];

    xCoordinateArray.push(xRectArray, xCircArray, xRect2Array, xRect3Array);
    yCoordinateArray.push(yRectArray, yCircArray, yRect2Array, yRect3Array);

    for (i = 0; i < 4; i++) {
        var p = new Player(i, "Bob_" + i);
        p.xArray = xCoordinateArray[i];
        p.yArray = yCoordinateArray[i];
        players.push(p);
    }
    return players;
}

function createHouses(){
    var xCoordinateArray = [];
    var yCoordinateArray = [];

    //1187, 1309, first house on brown 
    // xHouse1
    // yHouse1
    // xHouse2
    // yHouse2
    // xHouse3
    // yHouse3
    // xHouse4
    // yHouse4
}

//global function to create game board, returns the gameboard array of boardsquare objects
function createBoard() {
    //creating array of objects to be the board
    var x;
    var y;
    var currentSquare;
    var loc;
    var board = [];
    var rents = [];
    var name;
    var price;
    var housePrice;
    var group;
    var isProperty = [false, true, false, true, false, true, true, false, true, true, false, true, true, true, true,
        true, true, false, true, true, false, true, false, true, true, true, true, true, true, true, false, true, true, false,
        true, true, false, true, false, true
    ];
    var prices = [0, 60, 0, 60, 0, 200, 100, 0, 100, 120, 0, 140, 150, 140, 160, 200, 180, 0, 180, 200, 0, 220, 0, 220, 240, 200, 260, 260, 150, 280, 0, 300, 300, 0, 320, 200, 350, 0, 400];
    var rent0 = [0, 2, 0, 4, 0, 98, 6, 0, 6, 8, 0, 10, 99, 10, 12, 98, 14, 0, 14, 16, 0, 18, 0, 18, 20, 98, 22, 22, 99, 24, 0, 26, 26, 0, 28, 98, 0, 35, 0, 50];
    var rent1 = [0, 10, 0, 20, 0, 99, 30, 0, 30, 40, 0, 50, 98, 50, 60, 99, 70, 0, 70, 80, 0, 90, 0, 90, 100, 99, 110, 110, 98, 120, 0, 130, 130, 0, 150, 99, 0, 175, 0, 200];
    var rent2 = [0, 30, 0, 60, 0, 99, 90, 0, 90, 100, 0, 150, 98, 150, 180, 99, 200, 0, 200, 220, 0, 250, 0, 250, 300, 99, 330, 330, 98, 360, 0, 390, 390, 0, 450, 99, 0, 500, 0, 600];
    var rent3 = [0, 90, 0, 180, 0, 99, 270, 0, 270, 300, 0, 450, 98, 450, 500, 99, 550, 0, 550, 600, 0, 700, 0, 700, 750, 99, 800, 800, 98, 850, 0, 900, 900, 0, 1000, 99, 0, 1100, 0, 1400];
    var rent4 = [0, 160, 0, 320, 0, 99, 400, 0, 400, 450, 0, 625, 98, 625, 700, 99, 750, 0, 750, 800, 0, 875, 0, 875, 925, 99, 975, 975, 98, 1025, 0, 1100, 1100, 0, 1200, 99, 0, 1300, 0, 1700];
    var rent5 = [0, 250, 0, 450, 0, 99, 550, 0, 550, 600, 0, 750, 98, 750, 900, 99, 950, 0, 950, 1000, 0, 1050, 0, 1050, 1100, 99, 1150, 1150, 98, 1200, 0, 1275, 1275, 0, 1400, 99, 0, 1500, 0, 2000];
    var housePrices = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200];
    var squareIDs = ['Go', 'BrP1', 'Community Chest', 'BrP2', 'Income Tax - $200', 'RR1', 'LBP1', 'Chance', 'LBP2', 'LBP3', 'Just Visiting', 'PP1', 'Utility - Piedmont Natural Gas', 'PP2', 'PP3', 'RR2', 'OP1', 'Community Chest', 'OP2', 'OP3', 'Free Parking', 'RP1', 'Chance', 'RP2', 'RP3', 'RR3', 'YP1', 'YP2', 'Utility - Duke Power', 'YP3', 'Go to jail', 'GP1', 'GP2', 'Community Chest', 'GP3', 'RR4', 'Chance', 'DBP1', 'Luxury Tax 1.0M', 'DBP2'];
    var groups = ["na", "Br", "na", "Br", "na", "RR", "LB", "na", "LB", "LB", "na", "PP", "Ut", "PP", "PP", "RR", "OP", "na", "OP", "OP", "na", "RP", "na", "RP", "RP", "RR", "YP", "YP", "Ut", "YP", "na", "GP", "GP", "na", "GP", "RR", "na", "DB", "na", "DB"];
    var xHouse = [0, 955, 0, 757, 0, 0, 459, 0, 261, 162, 0, 125, 0, 125, 125, 0, 125, 0, 125, 125, 0, 162, 0, 360, 
                    459, 0, 657, 756, 0, 954, 0, 1055, 1055, 0, 1055, 0, 0, 1055, 0, 1055];
    var yHouse = [0, 1054, 0, 1054, 0, 0, 1054, 0, 1054, 1054, 0, 955, 0, 757, 658, 0, 460, 0, 262, 163, 0, 126, 0, 126, 
                    126, 0, 126, 126, 0, 126, 0, 163, 262, 0, 460, 0, 0, 757, 0, 955];


    for (i in isProperty) {
        if (isProperty[i]) {
            //creating rent array
            rents = [];
            rents.push(rent0[i], rent1[i], rent2[i], rent3[i], rent4[i], rent5[i]);
            //property name
            name = squareIDs[i];
            //property price
            price = prices[i];
            //house price
            housePrice = housePrices[i];
            //setting board location to incrementer
            loc = parseInt(i);
            //set property group
            group = groups[i].toUpperCase();
            //set x coord for houses
            x = xHouse[i];
            //set y coord for houses
            y = yHouse[i];
            //creating property object
            currentSquare = new Property(loc, name, price, rents, housePrice, group, x, y);
            //adding to board
            board.push(currentSquare);
        } else {
            name = squareIDs[i];
            loc = parseInt(i);
            //creating non property square and pushing to board
            currentSquare = new NonProperty(loc, name);
            board.push(currentSquare);
        }

    }

    return board;
}

function Game(players, board) {
    this.players = players;
    this.gameGoing = true;
    this.playersLeft = players.length;
    this.totalRolls = 0;
    //this is the board in array form, it will hold boardSquare objects
    this.board = board;
    this.cpi = 0;
    this.chestCards = [];
    this.createChestCards();
    this.chanceCards = [];
    this.createChanceCards();
}

Game.prototype.nextPlayer = function() {
    this.cpi += 1;
    if (this.cpi === this.players.length) {
        this.cpi = 0;
    }
    //re-enable roll dice button for next player
    $('#rollButton').removeClass('disabled');
    console.log('next player run');
}

Game.prototype.createChestCards = function() {
    var c;
    var retArray = [];
    var chestCards = ['Advance to Go (Collect $200)', 'Bank error in your favor: collect $200', 'Doctor\'s fees: Pay $50',
        'Get Out of Jail Free: this card may be kept until needed, or sold',
        'Go to Jail: go directly to jail, Do not pass Go, do not collect $200',
        'It is your birthday: Collect $10 from each player',
        'Grand Opera Night: collect $50 from every player for opening night seats',
        'Income Tax refund: collect $20', 'Life Insurance Matures: collect $100', 'Pay Hospital Fees of $100',
        'Pay School Fees of $50', 'Receive $25 Consultancy Fee',
        'You are assessed for street repairs: $40 per house, $115 per hotel',
        'You have won second prize in a beauty contest: collect $10', 'You inherit $100',
        'From sale of stock you get $50', 'Holiday Fund matures: Receive $100'
    ];

    for (i in chestCards) {
        c = new Card(i, chestCards[i]);
        retArray.push(c);
    }
    this.chestCards = shuffleCards(retArray);
}

Game.prototype.createChanceCards = function() {
    var c;
    var retArray = [];
    var chanceCards = ['Advance to Go (Collect $200)', 'Advance to Illinois Ave:  if you pass Go, collect $200',
        'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.',
        'Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',
        'Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',
        'Advance to St. Charles Place: if you pass Go, collect $200', 'Bank pays you dividend of $50',
        'Get out of Jail Free:  this card may be kept until needed, or traded/sold', 'Go back 3 spaces',
        'Go directly to Jail:  do not pass Go, do not collect $200',
        'Make general repairs on all your property: for each house pay $25, for each hotel $100',
        'Pay poor tax of $15', 'Take a trip to Reading Railroad:  if you pass Go, collect $200',
        'Take a walk on the Boardwalk:  advance token to Boardwalk',
        'You have been elected chairman of the board:  pay each player $50',
        'Your building loan matures:  collect $150', 'You have won a crossword competition: collect $100'
    ];
    g
    for (i in chanceCards) {
        c = new Card(i, chanceCards[i]);
        retArray.push(c);
    }
    this.chanceCards = shuffleCards(retArray);
}






function createButtons() {
    var b1 = $('<input/>').attr({
        type: "button",
        id: "rollButton",
        value: 'Roll Dice',
        class: 'actionButton btn-primary'
    }).on("click", function() {
        g.players[g.cpi].rollDice();
    });
    $('#buttons').append(b1);

    var b2 = $('<input/>').attr({
        type: "button",
        id: "buyButton",
        value: 'Buy Property',
        class: 'actionButton btn-primary disabled'
    }).on("click", function() {
        g.players[g.cpi].buy();
        $('#buyButton').addClass('disabled');
    });

    var b3 = $('<input/>').attr({
        type: "button",
        id: "doneButton",
        value: 'Done With Turn',
        class: 'actionButton btn-primary disabled'
    }).on("click", function() {
        g.nextPlayer();
        console.log('next player button clicked');
        $('#doneButton').addClass('disabled');
        $('#buyButton').addClass('disabled');
        hb();
    });

    $('#buttons').append(b1);
    $('#buttons').append(b2);
    $('#buttons').append(b3);
}





function drawRectanglePiece(xRect, yRect) {
    var xText, yText;
    currentXRect = xRect;
    currentYRect = yRect;
    xText = xRect + 6;
    yText = yRect + 39;
    var canvas;
    var canvas = document.getElementById('bCanvas');
    if (canvas.getContext) {
        canvas.width = 1200; //horizontal resolution (?) - increase for better looking text
        canvas.height = 1200; //vertical resolution (?) - increase for better looking text
        //canvas.style.width=600;//actual width of canvas
        //canvas.style.height=600;//actual height of canvas
        // canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight); //other fix for res
        var ctx = canvas.getContext('2d');
        ctx.fillRect(xRect, yRect, 50, 50);
        ctx.font = '32pt Wingdings';
        ctx.fillStyle = 'white';
        ctx.fillText("[", xText, yText);
    }
}



function movePlayer(x, y) {
    var playerID = g.players[g.cpi].id;
    if (playerID === 0) {
        drawPlayers(x, y, currentXCirc, currentYCirc, currentXRect2, currentYRect2, currentXRect3, currentYRect3);
    }

    if (playerID === 1) {
        drawPlayers(currentXRect, currentYRect, x, y, currentXRect2, currentYRect2, currentXRect3, currentYRect3);
    }

    if (playerID === 2) {
        drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, x, y, currentXRect3, currentYRect3);
    }

    if (playerID === 3) {
        drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2, currentYRect2, x, y);
    }
}


//take in array of properties w houses 
function drawPlayers() {
    // xCirc, yCirc, xRect, yRect 
    var xRect = arguments[0];
    var yRect = arguments[1];
    var xCirc = arguments[2];
    var yCirc = arguments[3];
    var xRect2 = arguments[4];
    var yRect2 = arguments[5];
    var xRect3 = arguments[6];
    var yRect3 = arguments[7];
    // var xHouseTest1 = arguments[8];
    // var yHouseTest1 = arguments[9];
    // houses
    var xText, yText, xCircText, yCircText, xRect2Text, yRect2Text, xRect3Text, yRect3Text;
    currentXCirc = xCirc;
    currentYCirc = yCirc;
    currentXRect = xRect;
    currentYRect = yRect;
    currentXRect2 = xRect2;
    currentYRect2 = yRect2;
    currentXRect3 = xRect3;
    currentYRect3 = yRect3;
    // currentXHouse = xHouseTest1;
    // currentYHouse = yHouseTest1;
    xRectText = xRect + 6;
    yRectText = yRect + 39;
    xCircText = xCirc - 13;
    yCircText = yCirc + 13;
    xRect2Text = xRect2 + 6;
    yRect2Text = yRect2 + 39;
    xRect3Text = xRect3 + 6;
    yRect3Text = yRect3 + 39;
    var canvas;
    var canvas = document.getElementById('bCanvas');
    var radius = 20;
    if (canvas.getContext) {
        canvas.width = 1200; //horizontal resolution - increase for better looking text
        canvas.height = 1200; //vertical resolution - increase for better looking text
        var ctx = canvas.getContext('2d');
        ctx.beginPath();

        ctx.arc(xCirc, yCirc, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.font = '30pt Wingdings';
        ctx.fillStyle = 'white';
        ctx.fillText("N", xCircText, yCircText);
        // 
        //begin drawing rectangle 1 here
        ctx.fillStyle = 'black';
        ctx.fillRect(xRect, yRect, 50, 50);

        ctx.font = '32pt Wingdings';
        ctx.fillStyle = 'white';
        ctx.fillText("[", xRectText, yRectText);

        //begin drawing rectangle 2 here
        ctx.fillStyle = 'red';
        ctx.fillRect(xRect2, yRect2, 50, 50);

        ctx.font = '32pt Wingdings';
        ctx.fillStyle = 'black';
        ctx.fillText("[", xRect2Text, yRect2Text);

        //begin drawing rectangle 3 here  
        ctx.fillStyle = 'orange';
        ctx.fillRect(xRect3, yRect3, 50, 50);

        ctx.font = '32pt Wingdings';
        ctx.fillStyle = 'black';
        ctx.fillText("Q", xRect3Text, yRect3Text);



        for (i in g.players){
            for (x in g.players[i].props) {
                var h = g.players[i].props[x].houses;
                var loc = g.players[i].props[x].location;
                var xH = g.players[i].props[x].xHouse;
                var yH = g.players[i].props[x].yHouse;
                //if not a hotel
                if (h > 0){
                    //horizontal house drawing
                    if ((loc < 10) || ((loc > 20) && (loc < 30))) {
                        console.log('detected horiz prop');
                        if(h != 5){
                            if (h > 0){
                               // draw 1 house
                               console.log('drawing 1 at loc: ' + loc + '. x: ' + xH + ' y: ' + yH);
                               ctx.fillStyle = 'green';
                               ctx.fillRect(xH, yH, 20, 30);
                            }
                            if (h > 1){
                               // draw 2 house
                               console.log('drawing 2 at loc: ' + loc);
                                ctx.fillRect(xH + 24, yH, 20, 30);
                            }
                            if (h > 2){
                               // draw 3 house
                               console.log('drawing 3 at loc: ' + loc);
                                ctx.fillRect(xH + 48, yH, 20, 30);
                            }
                            if (h > 3){
                               // draw 4 house
                               console.log('drawing 4 at loc: ' + loc);
                               ctx.fillRect(xH + 72, yH, 20, 30);
                            }
                        }
                        if (h === 5) {
                            //draw hotel horiz
                            console.log('drawing hotel at loc: ' + loc);
                            ctx.fillStyle = 'red';
                            ctx.strokeStyle = 'white';
                            ctx.fillRect(xH + 22, yH, 50, 30);
                        }
                    }
                    //vertical house drawing
                    else {
                        console.log('detected vertical prop');
                        if(h != 5){
                            if (h > 0){
                               // draw 1 house
                                ctx.fillStyle = 'green';
                                ctx.fillRect(xH, yH, 30, 20);
                                                       
                            }
                            if (h > 1){
                               // draw 2 house
                               ctx.fillRect(xH, yH + 24, 30, 20);                           
                            }
                            if (h > 2){
                               // draw 3 house
                               ctx.fillRect(xH, yH + 48, 30, 20);

                            }
                            if (h > 3){
                               // draw 4 house
                               ctx.fillRect(xH, yH + 72, 30, 20);
                            }
                        }
                        if (h === 5) {
                            //draw hotel horiz
                            ctx.fillStyle = 'red';
                            ctx.fillRect(xH, yH + 22, 30, 50);

                        }
                    }    
                }
            }
        }
    }
}


function hb() {
    var source = $("#player-list").html();
    var template = Handlebars.compile(source);
    var context = g.players;
    var html = template(context);
    $('#template-dump').html(html);
}



Player.prototype.returnBuildablePropArray = function() {
    var buildables = [];
    var props = this.props;
    console.log(props);
    for (x in props) {
        console.log(props[x]);
        //if its monopolized and has even or less houses than others in group, then it is buildable
        if ((props[x].monopolized === true) && (props[x].canIBuild())) {
            console.log('true for ' + props[x].location);
            buildables.push(props[x]);
        }
    }
    return buildables;
}



function createBuildButton() {

    //change to start disabled once checking for buildables is complete
    var $b1 = $('<input/>').attr({
        type: "button",
        id: "build-button",
        value: 'Build Houses',
        class: 'actionButton btn-primary'
    }).on("click", function() {
        //give div of monopolized properties, where buildable, allow user to select, then build house(s)
        var $d1 = $('<div>').attr({
            id: 'mono-props-main-div',
            class: 'mono-props-div'
        });
        //for loop over buildables
        var buildables = g.players[g.cpi].returnBuildablePropArray();
        for (i in buildables) {
            var $d2 = $('<div>').attr({
                id: 'mono-prop-div_' + i,
                class: 'mono-prop-div',
                'data-location': buildables[i].location,
            }).on("click", function() {
                console.log('clicked ' + this.id)
                for (y in g.players[g.cpi].props) {
                    if (g.players[g.cpi].props[y].location === $(this).data('location')) {
                        g.players[g.cpi].props[y].houses++;
                        $('#mono-props-main-div').remove();
                        drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2, currentYRect2, currentXRect3, currentYRect3);
                    }
                }
            });

            var $h = $('<h3>').attr({
                id: 'mono-prop-text_' + i,
                class: 'mono-prop-text',
                'data-location': buildables[i].location
            }).text(buildables[i].name);
            $d2.append($h);
            $d1.append($d2);
        }
        $('body').append($d1);
    });
    $('body').append($b1);
}

// function moveHouseRight(x){
//     drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2,
//      currentYRect2, currentXRect3, currentYRect3, currentXHouse + x, currentYHouse);
// }

// function moveHouseLeft(x){
//     drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2,
//      currentYRect2, currentXRect3, currentYRect3, currentXHouse - x, currentYHouse);
// }

// function moveHouseUp(x){
//     drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2,
//      currentYRect2, currentXRect3, currentYRect3, currentXHouse, currentYHouse - x);
// }

// function moveHouseDown(x){
//     drawPlayers(currentXRect, currentYRect, currentXCirc, currentYCirc, currentXRect2,
//      currentYRect2, currentXRect3, currentYRect3, currentXHouse, currentYHouse + x);
// }



//need x,y coordinates of top left of every prop, when drawing canvas, check if houses and draw them

function CreateDebugButton() {
    var $b1 = $('<input/>').attr({
        type: "button",
        id: "debug-button",
        value: 'give current player props',
        class: 'actionButton btn-primary'
    }).on("click", function() {
        //display buttons of unowned properties and push to g.players[0].props when clicked, 
        //also disappear when clicked
        for (i in g.board) {
            if (g.board[i].constructor === Property && !g.board[i].isOwned) {
                var $b2 = $('<input/>').attr({
                    type: "button",
                    id: "debug-button",
                    value: g.board[i].name,
                    class: 'actionButton btn-primary',
                    'data-id': i
                }).on("click", function() {
                    g.board[$(this).data('id')].isOwned = true;
                    g.board[$(this).data('id')].ownedByPlayerIndex = g.cpi;
                    g.players[g.cpi].props.push(g.board[$(this).data('id')]);
                    console.log('clicked ' + $(this).data('id'));
                    hb();
                    g.players[g.cpi].checkForMonopolies();
                });
                //create button for each unowned property
                // var $b2 = $('<input type="button" value="' + g.board[i].name +'" />');
                // $b2.click(function () { 
                // 	g.players[g.cpi].props.push(this.data);
                // });
                //add button to debug div
                $('#debug-buttons').append($b2);
            }
        }
        hb();

    });
    $('#debug-buttons').append($b1);
}


function debug() {
    g = new Game(createPlayers(), createBoard());
    hb();
    createButtons();
    CreateDebugButton();
    createBuildButton();
    drawPlayers(1130, 1150, 1155, 1125, 1084, 1150, 1084, 1100);
}


debug();

