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


console.log('app.js init');





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

window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);
});