$(document).ready(() => {
    const tokens = [{string: 'hat', vectorPos: 1, image: ''}, {string: 'iron'}, 'dog', 'car', 'boot', 'ship', 'thimble', 'wheelBarrow'];
    const deeds = [{ color: '#945536', rent: 2, house1: 10, house2: 30, house3: 90, house4: 160, hotel: 250, mort: 30, houses: 50, hotels: 50, owned: 'bank' }];
    let chance = [];
    let communityChest = [];
    let players = ['1', '2', '3', '4', '5'];

    $('#deedTitle').css({
        'background-color': deeds[0].color,
        'color': '#fff'
    });

    $('#rent').text(deeds[0].rent);

    $('#go').append('<img class="token" src="./images/hat.png" width="30vw">');
    $('#mediterranean').append('<img class="token" src="./images/hat.png" width="30vw">');
    $('#mediterranean').append('<img class="token" src="./images/iron.png" width="40%">');
    $('#go').append('<img class="token" src="./images/car.png" width="25%">');
    $('#go').append('<img class="token" src="./images/ship.png" width="25%">');
    $('#go').append('<img class="token" src="./images/dog.png" width="25%">');
    $('#go').append('<img class="token" src="./images/wheelBarrow.png" width="25%">');

    // $('#chooseToken').modal('show');

    $('#tokenBtn').click(() => {
        p1Token = $('input[name="token"]:checked').val();
        for (let i = 0; i < tokens.length; i++) {
            if (p1Token === tokens[i].string) {
                tokens.splice(i, 1);
                break;
            }
        }
        cpu1Token = tokens[Math.floor(Math.random() * tokens.length)];
        console.log(cpu1Token);
        for (let i = 0; i < tokens.length; i++) {
            if (cpu1Token === tokens[i]) {
                tokens.splice(i, 1);
                break;
            }
        }
        console.log(tokens);
    });

    $('#roll').click(() => {
        const outcome = roll();
        $('#rollOutcome').text(outcome);
    });

    const square = 2;

    const test = $(`div[data-attr=${square}]`);
    console.log(test);

    function shuffle(arr) {
        const shuffled = [];
        while (arr.length) {
            const current = Math.floor(Math.random() * arr.length);
            shuffled.push(arr[current]);
            app.splice(current, 1);
        }

        return shuffled;
    }

    function roll() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        return die1 + die2;
    }

    function Player(type, token) {
        this.type = type; // cpu or human
        this.token = token;
        this.currentSquare = 0;
        this.money = 1500;
        this.propertiesOwned = [];
        this.inJail = false;
    }
});