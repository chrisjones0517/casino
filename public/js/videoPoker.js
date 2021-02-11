$(document).ready(() => {

    if (window.location.href.search(/(videoPoker)/g) !== -1) { 

        let deck = [];
        let money = parseInt(getCookie('money')) || 500;
        let bet = 1;
        let originalDeal = true;

        $('#vpMoney').text(money);
        $('#bet').text(bet);

        $('#playVPagain').click(() => {
            money = 500;
            $('#vpMoney').text(money);
            setCookie('money', money);
            newGame();
            $('#deal').removeAttr('disabled');
            $('#gameover').remove();
            $('#playAgainModal').modal('hide');
        });

        $('#betMax').click(() => {

            bet = 5;

            if (money < bet) {
                bet = money;
            }

            $('#bet').text(bet);
        });

        $('#changeBet').click(() => {

            bet++;

            if (bet > 5 || bet > money) {
                bet = 1;
            }

            if (money < bet) {
                bet = money;
            }

            $('#bet').text(bet);
        });

        $('#deal').click(() => {

            if (originalDeal) {
                newGame();
                deck = shuffle(deck);
                originalDeal = false;
                money -= bet;
                $('#vpMoney').text(money);
                $('#betMax').attr('disabled', 'true');
                $('#changeBet').attr('disabled', 'true');
            } else {
                originalDeal = true;
                $('#betMax').removeAttr('disabled');
                $('#changeBet').removeAttr('disabled');
            }

            const hand = [];

            for (let i = 1; i <= 5; i++) {
                const card = deck[deck.length - 1].card;
                $('.playingCard').css({
                    'background-color': '#fff',
                    'background-image': 'none'
                });

                const border = $(`#card${i}`).css('border');

                if (border !== '3px solid rgb(0, 123, 255)') {
                    $(`#card${i} > span`).text(card).css('color', deck[deck.length - 1].color);
                    $(`#card${i} > div`).html(`<img src="./images/${deck[deck.length - 1].suit}.png" width="50%">`);
                    $(`#card${i}`).attr('data-attr', JSON.stringify(deck[deck.length - 1]));
                    deck.pop();
                }
            }

            const htmlArr = $('.playingCard');

            for (let i = 0; i < htmlArr.length; i++) {
                hand.push(JSON.parse(htmlArr[i].dataset.attr));
            }

            if (originalDeal) {
                $('#deal').attr('disabled', 'true');
                const payoutMultiple = evaluateHand(hand);

                money += bet * payoutMultiple;

                $('#vpMoney').text(money);

                if (money < bet) {
                    bet = 1;
                    $('#bet').text(bet);
                }

                if (money === 0) {
                    $('#pokerDiv').append('<div id="gameover">GAME OVER</div>')
                    $('#gameover').css({
                        'position': 'absolute',
                        'color': '#ff0000',
                        'font-size': '8vw',
                        'text-shadow': '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
                    });

                    $('#deal').attr('disabled', 'true');

                    setTimeout(() => {
                        $('#playAgainModal').modal('show');
                    }, 2000);

                } else {
                    setTimeout(() => {
                        newGame();
                        $('#deal').removeAttr('disabled');
                    }, 2000);
                }
            }
            setCookie('money', money);
        });

        $('.holdBtn').click(e => {
            const card = $(e.target).parent().parent().children('.playingCard');
            const border = $(card).css('border');

            if (border === '3px solid rgb(0, 123, 255)') {
                $(card).css('border', '1px solid #000');
            } else {
                $(card).css('border', '3px solid #007bff');
            }
        });

        const width = $('.playingCard').css('width').replace('px', '');

        $('.playingCard').css('height', width * 1.5 + 'px');

        $(window).resize(() => {
            const width = $('.playingCard').css('width').replace('px', '');
            $('.playingCard').css('height', width * 1.5 + 'px');
        });

        function shuffle(arr) {

            const shuffled = [];

            while (arr.length) {
                const current = Math.floor(Math.random() * arr.length);
                shuffled.push(arr[current]);
                arr.splice(current, 1);
            }

            return shuffled;
        }

        function newGame() {

            $('.playingCard').css('background-image', 'url("../images/cardBack.png")');
            $('.playingCard > span').text('');
            $('.playingCard > div').empty();

            deck = [];

            for (let i = 0; i < 4; i++) {
                let suit = ['heart', 'spade', 'diamond', 'club'];
                for (let j = 1; j <= 13; j++) {
                    let card;
                    let color;
                    let value = j;
                    switch (j) {
                        case 1:
                            card = 'A';
                            value = 14;
                            break;
                        case 11:
                            card = 'J';
                            break;
                        case 12:
                            card = 'Q';
                            break;
                        case 13:
                            card = 'K';
                            break;
                        default:
                            card = j;
                    }

                    if (i === 0 || i === 2) {
                        color = '#ff0000';
                    } else {
                        color = '#000000';
                    }
                    deck.push({ value: value, suit: suit[i], card: card, color: color });
                }
            }

            $('.playingCard').css('border', '1px solid #000');
        }

        function evaluateHand(hand) {
            let royalFlush = false;
            let flush = true;
            let straight = true;
            let duplicate = false;

            let sorted = hand.sort((a, b) => {
                return a.value - b.value;
            });

            let duplicates = [];
            let numOccurrences = 1;
            let currentObj = {};

            for (let i = 0; i < 5; i++) {
                if (i !== 4 && sorted[i].value === sorted[i + 1].value) {
                    duplicate = true;
                    currentObj.value = sorted[i].value;
                    numOccurrences++;
                } else {
                    if (numOccurrences >= 2) {
                        currentObj.numOccurrences = numOccurrences;
                        duplicates.push(currentObj);
                        currentObj = {};
                        numOccurrences = 1;
                    }
                }
            }

            if (!duplicate && sorted[0].value === 2) {
                sorted = sorted.sort((a, b) => {
                    if (a.value === 14) {
                        a.value = 1;
                    }
                    if (b.value === 14) {
                        b.value = 1;
                    }
                    return a.value - b.value;
                });
            }

            for (let i = 0; i < 5; i++) {
                if (hand[0].suit !== hand[i].suit) {
                    flush = false;
                }

                if (i !== 4 && hand[i].value !== hand[i + 1].value - 1) {
                    straight = false;
                }
            }

            if (flush && straight && sorted[0].value === 10) {
                if (bet === 5) {
                    $('#payType').text('ROYAL FLUSH');
                    $('#vpWinner').modal('show');
                    return 800;
                } else {
                    return 250;
                }
            }

            if (duplicates.length === 2) {
                if (duplicates[0].numOccurrences === 2 && duplicates[1].numOccurrences === 2) {
                    $('#payType').text('TWO PAIR');
                    $('#vpWinner').modal('show');
                    return 2;
                } else {
                    $('#payType').text('FULL HOUSE');
                    $('#vpWinner').modal('show');
                    return 9;
                }
            }

            if (duplicates.length === 1) {
                if (duplicates[0].numOccurrences === 4) {
                    $('#payType').text('FOUR OF A KIND');
                    $('#vpWinner').modal('show');
                    return 25;
                }
                if (duplicates[0].numOccurrences === 3) {
                    $('#payType').text('THREE OF A KIND');
                    $('#vpWinner').modal('show');
                    return 3;
                }
                if (duplicates[0].numOccurrences === 2 && duplicates[0].value >= 11) {
                    $('#payType').text('JACKS OR BETTER');
                    $('#vpWinner').modal('show');
                    return 1;
                }
            }

            if (!royalFlush && straight && flush) {
                $('#payType').text('STRAIGHT FLUSH');
                $('#vpWinner').modal('show');
                return 50;
            }

            if (!royalFlush && flush) {
                $('#payType').text('FLUSH');
                $('#vpWinner').modal('show');
                return 6;
            }

            if (!royalFlush && straight) {
                $('#payType').text('STRAIGHT');
                $('#vpWinner').modal('show');
                return 4;
            }

            return 0;
        }
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${cname}=${cvalue};${expires};max-age=86400;path=/`;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});