$(document).ready(() => {

    const imageArr = ['lemon.png', 'grape.png', 'cherries.png', 'bar.png', 'double_bar.png', 'triple_bar.png', 'blue_seven.png', 'white_seven.png', 'red_seven.png', 'money.png'];
    let money = parseInt(getCookie('money')) || 500;
    let bet = 1;
    let vector1 = Math.floor(Math.random() * 10);
    let vector2 = Math.floor(Math.random() * 10);
    let vector3 = Math.floor(Math.random() * 10);
    let spinning = false;

    $('#img1').attr('src', `images/${imageArr[vector1]}`);
    $('#img2').attr('src', `images/${imageArr[vector2]}`);
    $('#img3').attr('src', `images/${imageArr[vector3]}`);

    $('#money').text(money);

    for (let i = 1; i <= 17; i++) {
        $('#lights').append(`<span id="light${i}" class="light light-top"></span>`);
    }

    for (let i = 18; i <= 34; i++) {
        $('#lights').append(`<span id="light${i}" class="light light-bottom"></span>`);
    }

    for (let i = 35; i <= 41; i++) {
        $('#lights').append(`<span id="light${i}" class="light light-right"></span>`);
    }

    for (let i = 43; i <= 48; i++) {
        $('#lights').append(`<span id="light${i}" class="light light-left"></span>`);
    }

    $('#money').text(money);

    $('#yes').click(() => {
        money = 500;
        $('#money').text(500);
        setCookie('money', money);
        bet = 1;
        $('#bet').text(1);
        $('#spin').show();
    });

    $('#bet1').css('border', '2px solid #fff');

    $('.betBtn').click(e => {

        switch (e.target.id) {
            case 'bet1':
                $('.betBtn').css('border', 'none');
                $('#bet1').css('border', '2px solid #fff');
                bet = 1;
                break;
            case 'bet5':
                if (money >= 5) {
                    $('.betBtn').css('border', 'none');
                    $('#bet5').css('border', '2px solid #fff');
                    bet = 5;
                }
                break;
            case 'bet10':
                if (money >= 10) {
                    $('.betBtn').css('border', 'none');
                    $('#bet10').css('border', '2px solid #fff');
                    bet = 10;
                }
                break;
            case 'bet50':
                if (money >= 50) {
                    $('.betBtn').css('border', 'none');
                    $('#bet50').css('border', '2px solid #fff');
                    bet = 50;
                }
                break;
            case 'bet100':
                if (money >= 100) {
                    $('.betBtn').css('border', 'none');
                    $('#bet100').css('border', '2px solid #fff');
                    bet = 100;
                }
                break;
            default:
                console.log('Something went wrong with bet selection.');
        }

    });

    /* ------------------------- Odds verification --------------------------------- */

    // let count = 0;

    // setInterval(() => {
    //     $('#spin').trigger('click');
    //     count++;
    //     console.log(count);
    // }, 10);

    /* ------------------------------------------------------------------------------ */

    $('#spin').click(() => {

        if (!spinning) {
            spinning = true;

            money -= bet;
            $('#money').text(money);

            (async () => {
                await spinEffect();
                vector1 = Math.floor(Math.random() * 10);
                vector2 = Math.floor(Math.random() * 10);
                vector3 = Math.floor(Math.random() * 10);
                const altStr1 = imageArr[vector1].replace('.png', '').replace('_', ' ');
                const altStr2 = imageArr[vector2].replace('.png', '').replace('_', ' ');
                const altStr3 = imageArr[vector3].replace('.png', '').replace('_', ' ');
                $('#img1').attr({
                    'src': `images/${imageArr[vector1]}`,
                    'alt': altStr1
                });
                $('#img2').attr({
                    'src': `images/${imageArr[vector2]}`,
                    'alt': altStr2
                });
                $('#img3').attr({
                    'src': `images/${imageArr[vector3]}`,
                    'alt': altStr3
                });

                if (vector1 === vector2 && vector2 === vector3) {
                    let prewinnings = money;

                    switch (vector1) {
                        case 0:
                            money += (bet * 5);
                            break;
                        case 1:
                            money += (bet * 10);
                            break;
                        case 2:
                            money += (bet * 50);
                            break;
                        case 3:
                            money += (bet * 75);
                            break;
                        case 4:
                            money += (bet * 100);
                            break;
                        case 5:
                            money += (bet * 110);
                            break;
                        case 6:
                            money += (bet * 125);
                            break;
                        case 7:
                            money += (bet * 150);
                            break;
                        case 8:
                            money += (bet * 175);
                            break;
                        case 9:
                            money += (bet * 200);
                            break;
                        default:
                            console.log('Something went wrong.');
                    }

                    $('#winAmount').text(`$${money - prewinnings}`);
                    $('#winner').modal('show');
                    $('#money').text(money);
                } else if (vector1 === 8 && vector2 === 7 && vector3 === 6) {
                    let prewinnings = money;
                    money += (bet * 500);
                    $('#winAmount').text(`$${money - prewinnings}`);
                    $('#winner').modal('show');
                    $('#money').text(money);
                } else if ((vector1 === 6 || vector1 === 7 || vector1 === 8) && (vector2 === 6 || vector2 === 7 || vector2 === 8) && (vector3 === 6 || vector3 === 7 || vector3 === 8)) {
                    let prewinnings = money;
                    money += (bet * 40);
                    $('#winAmount').text(`$${money - prewinnings}`);
                    $('#winner').modal('show');
                    $('#money').text(money);
                }

                spinning = false;

                if (money === 0) {
                    $('#gameover').modal('show');
                    $('#spin').hide();
                }

                if (money < bet) {
                    bet = 1;
                    $('.betBtn').css('border', 'none');
                    $('#bet1').css('border', '2px solid #fff');
                }
                setCookie('money', money);
            })();
        }
    });

    let set1 = true;

    setInterval(() => {

        if (set1) {
            $('.light:nth-child(2n)').css('background-color', '#0000ff');
            $('.light:nth-child(2n + 1)').css('background-color', '#fff');

            if (!spinning) {
                $('#spin').css('border', '2px solid white');
            }
        } else {
            $('.light:nth-child(2n)').css('background-color', '#fff');
            $('.light:nth-child(2n + 1)').css('background-color', '#0000ff');
            $('#spin').css('border', 'none');
        }
        set1 = !set1;
    }, 500);

    function spinEffect() {

        return new Promise((resolve, reject) => {

            let time = 0;
            let i = Math.floor(Math.random() * 10);
            let j = Math.floor(Math.random() * 10);
            let k = Math.floor(Math.random() * 10);
            let interval = 100;

            const spin = () => {
                return setInterval(() => {

                    if (i > 9) {
                        i = 0;
                    }

                    if (j < 0) {
                        j = 9;
                    }

                    if (k > 9) {
                        k = 0;
                    }

                    $('#img1').attr('src', `images/${imageArr[i]}`);
                    $('#img2').attr('src', `images/${imageArr[j]}`);
                    $('#img3').attr('src', `images/${imageArr[k]}`);

                    i++;
                    j--;
                    k++;

                }, interval);
            }

            let clear = spin();

            const timer = setInterval(() => {

                time++;

                if (time >= 5) {
                    resolve();
                    clearInterval(timer);
                    clearInterval(clear);
                }

                switch (time) {
                    case 0:
                    case 1:
                    case 2:
                        clearInterval(clear);
                        interval = 200;
                        clear = spin();
                        break;
                    case 3:
                        clearInterval(clear);
                        interval = 300;
                        clear = spin();
                        break;
                    case 4:
                        clearInterval(clear);
                        interval = 500;
                        clear = spin();
                        break;
                    default:
                }

            }, 1000);
        });
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


