$(document).ready(() => {

    if (window.location.href.indexOf('/blackjack') !== -1) {  
        let credits = parseInt(getCookie('money')) || 500;
        let deck = [];
        let playerHand = [];
        let dealerHand = [];
        let splitHand1 = [];
        let splitHand2 = [];
        let focusHand2 = false;
        let splitTotal1 = 0;
        let splitTotal2 = 0;
        let playerTotal = 0;
        let dealerTotal = 0;
        let bet = 1;
        let origDealPlayerOffsetRight = 0;
        let origDealDealerOffsetRight = 0;
        let playerAces = 0;
        let dealerAces = 0;
        let splitAces1 = 0;
        let splitAces2 = 0;
        let insurance = 0;
        let split1Top = window.matchMedia('(min-width: 1700px)').matches ? 120 : 6.9;
        let split2Top = window.matchMedia('(min-width: 1700px)').matches ? 120 : 6.9;
        let dealerBlackJack = false;
        let split1BlackJack = false;
        let split2BlackJack = false;

        $('#playBJagain').click(() => {
            credits = 500;
            newHand();
            $('#bjGameover').modal('hide');
            $('#bjBet').text(bet);
            $('#credits').text(credits);
        });

        $('#bjBet').text(bet);
        $('#credits').text(credits);

        $('#split').click(() => {
            $('#double').attr('disabled', 'true');
            $('#split').attr('disabled', 'true');
            bet *= 2;
            $('#bjBet').text(bet);
            splitHand1.push(playerHand[0]);
            splitHand2.push(playerHand[1]);
            splitTotal1 = playerHand[0].value;
            splitTotal2 = playerHand[1].value;
            if (window.matchMedia('(min-width: 1700px)').matches) {
                $('#playerCard50').css('left', '200px');
            } else {
                $('#playerCard50').css('left', '12vw');
            }
            $('#playerCard52').css('border', '8px solid #0000ff');
            if (playerHand[0].card === 'A') {
                $('#hit').attr('disabled', 'true');
                $('#stand').attr('disabled', 'true');
                setTimeout(() => {
                    $('#hit').removeAttr('disabled');
                    $('#stand').removeAttr('disabled');
                    $('#hit').trigger('click');
                    $('#stand').trigger('click');
                    $('#hit').attr('disabled', 'true');
                    $('#stand').attr('disabled', 'true');
                }, 1000);
                setTimeout(() => {
                    $('#hit').removeAttr('disabled');
                    $('#stand').removeAttr('disabled');
                    $('#hit').trigger('click');
                    $('#stand').trigger('click');
                }, 2000);
            }
        });

        $('#double').click(async function () {
            $('.bjBtn').attr('disabled', 'true');
            bet *= 2;
            $('#bjBet').text(bet);
            await addCardPlayer(deck.length);

            showHiddenDealerCard();

            for (let i = 0; i < playerAces; i++) {
                if (playerTotal > 21 && playerAces) {
                    playerTotal -= 10;
                }
            }

            if (dealerTotal === 21 && dealerHand.length === 2) {
                credits -= bet;
                $('#credits').text(credits);
                displayDealerMsg('BLACKJACK!!!');
                setTimeout(() => {
                    newHand();
                    bet /= 2;
                    $('#bjBet').text(bet);
                }, 3000);
            } else if (playerTotal > 21) {
                credits -= bet;
                displayDealerMsg('WINNER');
                displayPlayerMsg('BUSTED');
                setTimeout(() => {
                    newHand();
                    bet /= 2;
                    $('#bjBet').text(bet);
                }, 3000);
            } else {
                const addCard = setInterval(async function () {
                    if (dealerTotal < 17) {
                        await addCardDealer(deck.length);
                        if (dealerTotal > 21 && dealerAces) {
                            dealerTotal -= 10;
                            dealerAces--;
                        }
                        if (dealerTotal > 21 && !dealerAces) {
                            credits += bet;
                            displayDealerMsg('BUSTED');
                            displayPlayerMsg('WINNER');
                            setTimeout(() => {
                                newHand();
                                bet /= 2;
                                $('#bjBet').text(bet);
                            }, 3000);
                            clearInterval(addCard);
                        }
                    } else {
                        if (dealerTotal > playerTotal) {
                            credits -= bet;
                            displayDealerMsg('WINNER');
                            setTimeout(() => {
                                newHand();
                                bet /= 2;
                                $('#bjBet').text(bet);
                            }, 3000);
                        } else if (dealerTotal === playerTotal) {
                            displayDealerMsg('PUSH');
                            displayPlayerMsg('PUSH');
                            setTimeout(() => {
                                newHand();
                                bet /= 2;
                                $('#bjBet').text(bet);
                            }, 3000);
                        } else {
                            credits += bet;
                            displayPlayerMsg('WINNER');
                            setTimeout(() => {
                                newHand();
                                bet /= 2;
                                $('#bjBet').text(bet);
                            }, 3000);
                        }
                        clearInterval(addCard);
                    }

                    $('#dealerTotal').text(dealerTotal);
                    $('#credits').text(credits);
                }, 1000);
            }

            $('#playerTotal').text(playerTotal);
            $('#credits').text(credits);
        });

        $('#insurance').click(() => {
            $('#double').attr('disabled', 'true');
            $('#insurance').attr('disabled', 'true');
            $('#bjBet').text(bet * 1.5)
            insurance = bet * 0.5;
        });

        $('#bet1bj').click(() => {
            bet++;
            if (bet > 5) {
                bet = 1;
            }
            $('#bjBet').text(bet);
        });

        $('#stand').click(() => {
            $('.bjBtn').attr('disabled', 'true');
            if (!splitHand1.length) {

                showHiddenDealerCard();

                $('#dealerTotal').text(dealerTotal);

                if (insurance && dealerTotal === 21) {
                    credits += insurance * 2;
                }

                if (insurance && dealerTotal !== 21) {
                    credits -= insurance;
                }

                if (dealerTotal === 21 && dealerHand.length === 2) {
                    credits -= bet;
                    $('#credits').text(credits);
                    displayDealerMsg('BLACKJACK!!!');
                    setTimeout(() => {
                        newHand();
                    }, 3000);
                } else {
                    const addCard = setInterval(async function () {
                        if (dealerTotal < 17) {
                            await addCardDealer(deck.length);
                            if (dealerTotal > 21 && dealerAces) {
                                dealerTotal -= 10;
                                dealerAces--;
                            }
                            if (dealerTotal > 21 && !dealerAces) {
                                credits += bet;
                                displayDealerMsg('BUSTED');
                                displayPlayerMsg('WINNER');
                                setTimeout(() => {
                                    newHand();
                                }, 3000);
                                clearInterval(addCard);
                            }
                        } else {
                            if (dealerTotal > playerTotal) {
                                credits -= bet;
                                displayDealerMsg('WINNER');
                                setTimeout(() => {
                                    newHand();
                                }, 3000);
                            } else if (dealerTotal === playerTotal) {
                                displayDealerMsg('PUSH');
                                displayPlayerMsg('PUSH');
                                setTimeout(() => {
                                    newHand();
                                }, 3000);
                            } else {
                                credits += bet;
                                displayPlayerMsg('WINNER');
                                setTimeout(() => {
                                    newHand();
                                }, 3000);
                            }
                            clearInterval(addCard);
                        }

                        $('#dealerTotal').text(dealerTotal);
                        $('#credits').text(credits);
                    }, 1000);
                }
            } else if (!focusHand2) {
                $('#hit').removeAttr('disabled');
                $('#stand').removeAttr('disabled');
                $('#playerCard50').css('border', '8px solid #0000ff');
                $('#playerCard52').css('border', 'none');
                focusHand2 = true;
            } else {

                showHiddenDealerCard();

                if (splitTotal1 <= 21 || splitTotal2 <= 21) {
                    const addCard = setInterval(async function () {
                        if (dealerTotal < 17) {
                            await addCardDealer(deck.length);
                            if (dealerTotal > 21 && dealerAces) {
                                dealerTotal -= 10;
                                dealerAces--;
                            }
                            if (dealerTotal > 21 && !dealerAces) {

                                evaluateSplitHands();

                                clearInterval(addCard);
                            }
                        } else {
                            clearInterval(addCard);
                            evaluateSplitHands();
                        }
                        $('#dealerTotal').text(dealerTotal);
                    }, 1000);
                } else {
                    displayPlayerMsg('BUSTED');
                    credits -= bet;
                    $('#credits').text(credits);
                    setTimeout(() => {
                        newHand();
                        bet /= 2;
                        $('#bjBet').text(bet);
                    }, 3000);
                }
            }
        });

        $('#hit').click(async function () {

            $('#double').attr('disabled', 'true');
            $('#split').attr('disabled', 'true');
            if (!splitHand1.length) {
                await addCardPlayer(deck.length);
                if (playerTotal > 21 && playerAces) {
                    playerTotal -= 10;
                    playerAces--;
                }
                if (playerTotal > 21 && !playerAces) {
                    credits -= bet;
                    $('#credits').text(credits);
                    displayPlayerMsg('BUSTED');
                    displayDealerMsg('WINNER');
                    setTimeout(() => {
                        newHand();
                    }, 3000);
                }

                $('#playerTotal').text(playerTotal);
            } else {
                if (focusHand2) {
                    addCardSplit2(deck.length);
                    if (splitTotal2 > 21 && splitAces2) {
                        splitTotal2 -= 10;
                        splitAces2--;
                    }
                    if (splitTotal2 > 21 && !splitAces2) {
                        $('#playerCard50').css('border', 'none');
                        $('#hit').attr('disabled', 'true');
                        $('#stand').trigger('click');
                    }
                } else {
                    addCardSplit1(deck.length);
                    if (splitTotal1 > 21 && splitAces1) {
                        splitTotal1 -= 10;
                        splitAces1--;
                    }
                    if (splitTotal1 > 21 && !splitAces1) {
                        $('#playerCard50').css('border', '8px solid #0000ff');
                        $('#playerCard52').css('border', 'none');
                        focusHand2 = true;
                    }

                }
                $('#playerTotal').text(`${splitTotal1} | ${splitTotal2}`);
            }
        });

        $('#maxBetbj').click(() => {
            bet = 5;
            $('#bjBet').text(bet);
        });

        $('#dealBj').click(async function () {
            newHand();
            
            $('.bjBtn').attr('disabled', 'true');

            for (let i = 0; i < 4; i++) {
                if (i % 2 === 0) {
                    await addCardPlayer(deck.length);
                } else {
                    await addCardDealer(deck.length);
                }
            }

            if (playerTotal === 22) {
                playerTotal = 12;
                playerAces--;
            }

            $('#playerTotal').text(playerTotal);

            if (dealerTotal === 22) {
                dealerTotal = 12;
                dealerAces--;
            }

            if (playerTotal === 21 && dealerTotal === 21) {
                setTimeout(() => {

                    showHiddenDealerCard();

                    displayPlayerMsg('PUSH');
                    displayDealerMsg('PUSH');
                    $('#dealerTotal').text(dealerTotal);
                }, 1000);
                setTimeout(() => {
                    newHand();
                }, 4000);
            } else if (playerTotal === 21) {
                credits += bet * 1.5;
                setTimeout(() => {
                    displayPlayerMsg('BLACKJACK!!!');

                    showHiddenDealerCard();

                    $('#dealBj').removeAttr('disabled');
                    $('#dealerTotal').text(dealerTotal);
                }, 1000);
                setTimeout(() => {
                    newHand();
                }, 4000);
            } else {
                if (playerHand[0].card === playerHand[1].card) {
                    $('#split').removeAttr('disabled');
                }
                if (dealerHand[0].card === 'A') {
                    $('#insurance').removeAttr('disabled');
                }
                $('#hit').removeAttr('disabled');
                $('#stand').removeAttr('disabled');
                $('#bet1bj').attr('disabled', 'true');
                $('#maxBetbj').attr('disabled', 'true');
                $('#double').removeAttr('disabled');
            }
            setTimeout(() => {
                $('#credits').text(credits);
            }, 1000);
        });

        function addCardPlayer(i) {

            return new Promise(resolve => {

                playerHand.push(deck[deck.length - 1]);

                if (deck[deck.length - 1].card === 'A') {
                    playerAces++;
                }

                playerTotal += deck[deck.length - 1].value;

                $('#playerHandDiv').append(`<div id="playerCard${i}" class="playerCard"></div>`);

                if (window.matchMedia('(min-width: 1700px)').matches) {
                    $(`#playerCard${i}`).css('left', origDealPlayerOffsetRight + 'px');
                    origDealPlayerOffsetRight += 40;
                } else {
                    $(`#playerCard${i}`).css('left', origDealPlayerOffsetRight + 'vw');
                    origDealPlayerOffsetRight += 2.5;
                }

                $(`#playerCard${i}`).append(`<p class="showing">${deck[deck.length - 1].card}</p>
                <img class="smallSuit d-block" src="./images/${deck[deck.length - 1].suit}.png" width="15%">
                <img class="bjImg" src="./images/${deck[deck.length - 1].suit}.png" width="50%">`);

                if (deck[deck.length - 1].card === 10) {
                    $(`#playerCard${i} > p`).css({
                        'letter-spacing': '-2px',
                        'margin-left': '0'
                    });
                }

                $(`#playerCard${i}`).css({
                    'color': deck[deck.length - 1].color,
                    'background-image': 'none',
                    'background-color': '#fff'
                });

                deck.pop();
                resolve();
            });
        }

        function addCardSplit1(i) {
            splitHand1.push(deck[deck.length - 1]);
            if (deck[deck.length - 1].card === 'A') {
                splitAces1++;
            }
            splitTotal1 += deck[deck.length - 1].value;
            $('#playerHandDiv').append(`<div id="playerCard${i}" class="playerCard"></div>`);

            if (window.matchMedia('(min-width: 1700px)').matches) {
                $(`#playerCard${i}`).css({
                    'top': split1Top + 'px',
                    'left': '0'
                });
                split1Top += 80;
            } else {
                $(`#playerCard${i}`).css({
                    'top': split1Top + 'vw',
                    'left': '0'
                });
                split1Top += 4.5;
            }

            $(`#playerCard${i}`).append(`<p class="showing">${deck[deck.length - 1].card}</p>
            <img class="smallSuit d-block" src="./images/${deck[deck.length - 1].suit}.png" width="15%">
            <img class="bjImg" src="./images/${deck[deck.length - 1].suit}.png" width="50%">`);
            if (deck[deck.length - 1].card === 10) {
                $(`#playerCard${i} > p`).css({
                    'letter-spacing': '-2px',
                    'margin-left': '0'
                });
            }

            $(`#playerCard${i}`).css({
                'color': deck[deck.length - 1].color,
                'background-image': 'none',
                'background-color': '#fff'
            });

            deck.pop();
        }

        function addCardSplit2(i) {
            splitHand2.push(deck[deck.length - 1]);
            if (deck[deck.length - 1].card === 'A') {
                splitAces2++;
            }
            splitTotal2 += deck[deck.length - 1].value;
            $('#playerHandDiv').append(`<div id="playerCard${i}" class="playerCard"></div>`);

            if (window.matchMedia('(min-width: 1700px)').matches) {
                $(`#playerCard${i}`).css({
                    'top': split2Top + 'px',
                    'left': '200px'
                });
                split2Top += 80;
            } else {
                $(`#playerCard${i}`).css({
                    'top': split2Top + 'vw',
                    'left': '12vw'
                });
                split2Top += 4.5;
            }

            $(`#playerCard${i}`).append(`<p class="showing">${deck[deck.length - 1].card}</p>
            <img class="smallSuit d-block" src="./images/${deck[deck.length - 1].suit}.png" width="15%">
            <img class="bjImg" src="./images/${deck[deck.length - 1].suit}.png" width="50%">`);
            if (deck[deck.length - 1].card === 10) {
                $(`#playerCard${i} > p`).css({
                    'letter-spacing': '-2px',
                    'margin-left': '0'
                });
            }

            $(`#playerCard${i}`).css({
                'color': deck[deck.length - 1].color,
                'background-image': 'none',
                'background-color': '#fff'
            });

            deck.pop();
        }

        function evaluateSplitHands() {

            if (dealerTotal === 21 && dealerHand.length === 2) {
                dealerBlackJack = true;
            }

            if (splitTotal1 === 21 && splitHand1.length === 2) {
                split1BlackJack = true;
            }

            if (splitTotal2 === 21 && splitHand2.length === 2) {
                split2BlackJack = true;
            }

            if (dealerTotal > 21) {
                if (splitTotal1 <= 21 && splitTotal2 <= 21) {
                    credits += bet;
                    displayPlayerMsg('WINNER');
                    displayDealerMsg('BUSTED');
                } else {
                    displayPlayerMsg('PUSH');
                    displayDealerMsg('PUSH');
                }
            } else if (dealerBlackJack && !split1BlackJack && !split2BlackJack) {
                credits -= bet;
                displayDealerMsg('WINNER');
            } else if (dealerBlackJack && split1BlackJack && split2BlackJack) {
                displayPlayerMsg('PUSH');
                displayDealerMsg('PUSH');
            } else if (dealerBlackJack && (split1BlackJack || split2BlackJack)) {
                credits -= bet * 0.5;
                displayDealerMsg('WINNER');
            } else if (!dealerBlackJack && split1BlackJack && split2BlackJack) {
                credits += bet;
                displayPlayerMsg('WINNER');
            } else if (dealerTotal === 21 && split1BlackJack && splitTotal2 === 21) {
                credits += bet * 0.5;
                displayPlayerMsg('WINNER');
            } else if (dealerTotal === 21 && split2BlackJack && splitTotal1 === 21) {
                credits += bet * 0.5;
                displayPlayerMsg('WINNER');
            } else if ((splitTotal1 > 21 && splitTotal2 > dealerTotal) || (splitTotal2 > 21 && splitTotal1 > dealerTotal)) {
                displayPlayerMsg('PUSH');
                displayDealerMsg('PUSH');
            } else if ((splitTotal1 > 21 && splitTotal2 === dealerTotal) || (splitTotal2 > 21 && splitTotal1 === dealerTotal)) {
                credits -= bet * 0.5;
                displayDealerMsg('WINNER');
            } else if ((splitTotal1 > 21 && splitTotal2 < dealerTotal) || (splitTotal2 > 21 && splitTotal1 < dealerTotal)) {
                credits -= bet;
                displayDealerMsg('WINNER');
            } else if (dealerTotal > splitTotal1 && dealerTotal > splitTotal2) {
                credits -= bet;
                displayDealerMsg('WINNER');
            } else if (dealerTotal < splitTotal1 && dealerTotal < splitTotal2) {
                credits += bet;
                displayPlayerMsg('WINNER');
            } else if ((dealerTotal === splitTotal1 || dealerTotal === splitTotal1) && (dealerTotal < splitTotal1 || dealerTotal < splitTotal2)) {
                credits += bet * 0.5;
                displayPlayerMsg('WINNER');
            } else if ((dealerTotal === splitTotal1 || dealerTotal === splitTotal1) && (dealerTotal > splitTotal1 || dealerTotal > splitTotal2)) {
                credits -= bet * 0.5;
                displayDealerMsg('WINNER');
            } else {
                displayPlayerMsg('PUSH');
                displayDealerMsg('PUSH');
            }

            $('#credits').text(credits);

            setTimeout(() => {
                newHand();
                bet /= 2;
                $('#bjBet').text(bet);
            }, 3000);
        }

        function showHiddenDealerCard() {
            $('#dealerCard49').append(`<p class="showing">${dealerHand[1].card}</p>
            <img class="smallSuit d-block" src="./images/${dealerHand[1].suit}.png" width="15%">
            <img class="bjImg" src="./images/${dealerHand[1].suit}.png" width="50%">`);

            if (dealerHand[1].card === 10) {
                $(`#dealerCard49 > p`).css({
                    'letter-spacing': '-2px',
                    'margin-left': '0'
                });
            }

            $('#dealerCard49').css({
                'color': dealerHand[1].color,
                'background-image': 'none',
                'background-color': '#fff'
            });
        }

        function addCardDealer(i) {

            return new Promise(resolve => {

                dealerHand.push(deck[deck.length - 1]);

                if (deck[deck.length - 1].card === 'A') {
                    dealerAces++;
                }

                dealerTotal += deck[deck.length - 1].value;

                $('#dealerHandDiv').append(`<div id="dealerCard${i}" class="dealerCard"></div>`);

                if (window.matchMedia('(min-width: 1700px)').matches) {
                    $(`#dealerCard${i}`).css('left', origDealDealerOffsetRight + 'px');
                    origDealDealerOffsetRight += 40;
                } else {
                    $(`#dealerCard${i}`).css('left', origDealDealerOffsetRight + 'vw');
                    origDealDealerOffsetRight += 2.5;
                }

                if (i !== 49) {
                    $(`#dealerCard${i}`).append(`<p class="showing">${deck[deck.length - 1].card}</p>
                    <img class="smallSuit d-block" src="./images/${deck[deck.length - 1].suit}.png" width="15%">
                    <img class="bjImg" src="./images/${deck[deck.length - 1].suit}.png" width="50%">`);

                    if (deck[deck.length - 1].card === 10) {
                        $(`#dealerCard${i} > p`).css({
                            'letter-spacing': '-2px',
                            'margin-left': '0'
                        });
                    }

                    $(`#dealerCard${i}`).css({
                        'color': deck[deck.length - 1].color,
                        'background-image': 'none',
                        'background-color': '#fff'
                    });
                }

                deck.pop();
                resolve();
            });
        }

        function shuffle(arr) {

            const shuffled = [];

            while (arr.length) {
                const current = Math.floor(Math.random() * arr.length);
                shuffled.push(arr[current]);
                arr.splice(current, 1);
            }

            return shuffled;
        }

        function createDeck() {

            let deck = [];

            for (let i = 0; i < 4; i++) {
                let suit = ['heart', 'spade', 'diamond', 'club'];
                for (let j = 1; j <= 13; j++) {
                    let card;
                    let color;
                    let value = j;
                    switch (j) {
                        case 1:
                            card = 'A';
                            value = 11;
                            break;
                        case 11:
                            card = 'J';
                            value = 10;
                            break;
                        case 12:
                            card = 'Q';
                            value = 10;
                            break;
                        case 13:
                            card = 'K';
                            value = 10;
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
            return deck;
        }

        function newHand() {
            playerHand = [];
            dealerHand = [];
            splitHand1 = [];
            splitHand2 = [];
            playerTotal = 0;
            dealerTotal = 0;
            splitTotal1 = 0;
            splitTotal2 = 0;
            origDealPlayerOffsetRight = 0;
            origDealDealerOffsetRight = 0;
            split1Top = window.matchMedia('(min-width: 1700px)').matches ? 120 : 6.9;
            split2Top = window.matchMedia('(min-width: 1700px)').matches ? 120 : 6.9;
            dealerAces = 0;
            playerAces = 0;
            insurance = 0;
            splitAces1 = 0;
            splitAces2 = 0;
            focusHand2 = false;
            $('.bjBtn').attr('disabled', 'true');
            if (credits <= 0.5) {
                $('#bjGameover').modal('show');
            } else if (credits < 5) {
                bet = 1;
            } else {
                $('#maxBetbj').removeAttr('disabled');
                $('#bet1bj').removeAttr('disabled');
            }
            $('#playerHandDiv').empty();
            $('#dealerHandDiv').empty();
            $('#dealerTotal').text('');
            $('#playerTotal').text('');
            $('#bjBet').text(bet);
            deck = shuffle(createDeck());
            $('#dealBj').removeAttr('disabled');
            setCookie('money', credits, 1);
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

        function displayPlayerMsg(msg) {
            $('#playerMsgDiv > h2').text(msg);
            const width = parseInt($('#playerMsgDiv').css('width').replace('px', ''));
            const height = parseInt($('#playerMsgDiv').css('height').replace('px', ''));
            const parentWidth = parseInt($('#playerMsgDiv').parent().css('width').replace('px', ''));
            const parentHeight = parseInt($('#playerMsgDiv').parent().css('height').replace('px', ''));
            const left = parentWidth / 2 - width / 2;
            const top = parentHeight / 2 - height / 2;

            $('#playerMsgDiv').css({
                'left': left + 'px',
                'top': top + 'px',
                'display': 'block'
            });

            setTimeout(() => {
                $('#playerMsgDiv').css('display', 'none');
            }, 3000);
        }

        function displayDealerMsg(msg) {
            $('#dealerMsgDiv > h2').text(msg);
            const width = parseInt($('#dealerMsgDiv').css('width').replace('px', ''));
            const height = parseInt($('#dealerMsgDiv').css('height').replace('px', ''));
            const parentWidth = parseInt($('#dealerMsgDiv').parent().css('width').replace('px', ''));
            const parentHeight = parseInt($('#dealerMsgDiv').parent().css('height').replace('px', ''));
            const left = parentWidth / 2 - width / 2;
            const top = parentHeight / 2 - height / 2;

            $('#dealerMsgDiv').css({
                'left': left + 'px',
                'top': top + 'px',
                'display': 'block'
            });

            setTimeout(() => {
                $('#dealerMsgDiv').css('display', 'none');
            }, 3000);
        }
    }
});