$(document).ready(() => {

    setCookie('cookiesEnabled', 'true', 1);
    const cookiesEnabled = getCookie('cookiesEnabled');
    if (!cookiesEnabled) {
        $('#cookiesDiv').css('display', 'block');
    }

    if (window.location.href.search(/^.+\/(#|\?.+)?$/g) !== -1) {

        $('body').css({
            'background-image': 'url(./images/casino.jpg)',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center center'
        });
    } else {
        $('body').css({
            'background-image': 'url(./images/beige-tiles.png',
            'background-repeat': 'repeat'
        });
    }

    if (window.location.href.search(/((blackjack)|(videoPoker))/g) !== -1) {
        if ((window.innerHeight > window.innerWidth) && window.innerWidth < 1000) {
            $('#cookiesDiv').css('display', 'block');
            $('#cookiesDiv > h2').text('Please use landscape mode for the best gaming experience.');
        } else {
            $('#cookiesDiv').css('display', 'none');
        }
    }

    $(window).on('orientationchange', () => {
        if (window.location.href.search(/((blackjack)|(videoPoker))/g) !== -1) {
            if ((window.innerHeight < window.innerWidth) && window.innerWidth < 1200) {
                $('#cookiesDiv').css('display', 'block');
                $('#cookiesDiv > h2').text('Please use landscape mode for the best gaming experience.');
            } else {
                $('#cookiesDiv').css('display', 'none');
            }
        }
    });

    $(window).on('resize', () => {
        if (window.location.href.search(/((blackjack)|(videoPoker))/g) !== -1) {
            if ((window.innerHeight > window.innerWidth) && window.innerWidth < 1200) {
                $('#cookiesDiv').css('display', 'block');
                $('#cookiesDiv > h2').text('Please use landscape mode for the best gaming experience.');
            } else {
                $('#cookiesDiv').css('display', 'none');
            }
        }
    });

    $('#loginSubmit').click(() => {
        const userData = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $.post('/login', userData, (data, status) => {

            if (data) {
                $('#loginMsg').text('Logged in successfully!').css('color', '#000');
                setTimeout(() => {
                    setCookie('username', data.username);
                    setCookie('money', data.money);
                    location.reload();
                }, 2000);
            } else {
                $('#loginMsg').text('Username/password not found. Please try again.').css('color', '#ff0000');
                setTimeout(() => {
                    $('#loginMsg').empty();
                }, 5000);
            }
        });
    });

    if (getCookie('username')) {
        $('#login').text('Logout');
    }

    $('#login').click(() => {
        if ($('#login').text() === 'Login') {
            $('#loginModal').modal('show');
        } else {
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setCookie('money', 500);
            location.reload();
            $('#login').text('Login');
        }
    });

    $('#registerBtn').click(() => {
        const username = $('#usernameReg').val();
        const password = $('#passwordReg').val();
        const money = getCookie('money') || 500;
        const test1 = ($('#usernameReg').css('border') === '3px solid rgb(0, 255, 0)') ? true : false;
        const test2 = ($('#confirmPassword').css('border') === '3px solid rgb(0, 255, 0)') ? true : false;
        const test3 = ($('#passwordReg').css('border') === '3px solid rgb(0, 255, 0)') ? true : false;

        if (test1 && test2 && test3) {
            $.post('/register', { username, password, money }, (data, status) => {

                if (!data) {
                    $('#registerMsg').text('An error occurred when processing your request.').css('color', '#ff0000');
                } else {
                    $('#registerMsg').text('You have registered successfully! Please login.').css('background-color', '#00ff00');
                }
            });
        } else {
            $('#registerMsg').text('Please ensure all fields are valid before submitting. Please try again.').css('color', '#ff0000');
        }
        setTimeout(() => {
            $('#registerMsg').empty();
        }, 5000);
    });

    $('#usernameReg').on('input', () => {

        const username = $('#usernameReg').val();
        const test1 = (username.search(/[^\w]/g) === -1) ? true : false;
        const test2 = (username.search(/\w{3,}/g) !== -1) ? true : false;

        if (test1 && test2) {
            $.post('/checkUsername', { username }, (data, status) => {

                if (!data) {
                    $('#usernameReg').css('border', '3px solid #ff0000');
                } else {
                    $('#usernameReg').css('border', '3px solid #00ff00');

                }
            });
        } else {
            $('#usernameReg').css('border', '3px solid #ff0000');
        }
    });

    let password;

    $('#passwordReg').on('input', () => {
        password = $('#passwordReg').val();
        let test1 = (password.search(/\w{8,}/g) !== -1) ? true : false;
        let test2 = (password.search(/[a-z]+/g) !== -1) ? true : false;
        let test3 = (password.search(/[A-Z]+/g) !== -1) ? true : false;
        let test4 = (password.search(/\d+/g) !== -1) ? true : false;
        let test5 = (password.search(/[^\w]/g) === -1) ? true : false;

        if (test1 && test2 && test3 && test4 && test5) {
            $('#passwordReg').css('border', '3px solid #00ff00');
        } else {
            $('#passwordReg').css('border', '3px solid #ff0000');
        }
    });

    $('#confirmPassword').on('input', () => {
        const confirmPassword = $('#confirmPassword').val();
        if (password === confirmPassword) {
            $('#confirmPassword').css('border', '3px solid #00ff00');
        } else {
            $('#confirmPassword').css('border', '3px solid #ff0000');
        }
    });

    $('#leaderBoardBtn').click(() => {
        $.get('/leaderBoard', (data, status) => {
            $('#leaderData').empty();
            for (let i = 0; i < data.length; i++) {
                $('#leaderData').append(`
                <tr>
                    <td>${data[i].username}</td>
                    <td>${data[i].money}</td>
                </tr>
                    `);
            }
            $('#leaderBoardModal').modal('show');
        });
    });

    $('.save').click(() => {
        const username = getCookie('username');
        const money = getCookie('money');

        if (username) {
            $.post('/update', { username, money }, (data, status) => {
                if (data) {
                    $('#savedMsg').text('Your progress was saved!');
                    $('#savedModal').modal('show');
                } else {
                    $('#saveMsg').text('An error occurred when making your request.');
                    $('#savedModal').modal('show');
                }
            });
        } else {
            $('#savedMsg').text('You must be logged in to use this feature.');
            $('#savedModal').modal('show');
        }
    });

    $('#clearMsg').click(() => {
        $('#message').val('');
    });

    $('#submitMsg').click(() => {
        const message = $('#message').val();
        if (message.length) {
            $.post('/message', { message }, (data, status) => {
                $('#messageStatus').text('Your message was sent!');
            }).fail(() => {
                $('#messageStatus').text('There was an unknown problem processing your request. Please try again later.');
            });
        } else {
            $('#messageStatus').text('Your message cannot be empty.');
        }
        setTimeout(() => {
            $('#messageModal').modal('show');
        }, 1000);
    });

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 1000 * 60 * 60 * 24));
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


