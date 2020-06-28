var cookie = require('cookie');

module.exports = {
    main: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Main</title>
                <link rel="icon" type="image/png" href="imgs/icon/home.png">
                <link rel="stylesheet" type="text/css" href="css/main.css">
            </head>

            <body>
                <form>
                    <div class="card">
                        <div class="container">
                            <h2><b>따릉이 & 씽씽이</b></h2>

                            <div class="btns">
                                <a href="/signIn"><input class="btn_signin" type="button" name="sign_in" value="Sign In"></a>
                                <a href="/signUp"><input class="btn_signup" type="button" name="sign_up" value="Sign Up"></a>
                            </div>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    auth: function(req, res) {
        var isLogin = false;
        if (req.headers.cookie) {
            if (cookie.parse(req.headers.cookie).id) {
                isLogin = true;
            }
        }
        return isLogin;
    },
    signIn: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Sign In</title>
                <link rel="icon" type="image/png" href="imgs/icon/user.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_signIn.css">
            </head>

            <body>
                <form action='login' method='post'>
                    <div class="card">
                        <img class="user_img" src="imgs/user.png" alt="User">
                        <div class="container">
                            <h2><b>Sign In</b></h2>

                            <input class="textbox" type="text" name="id" placeholder="Enter The User Id" size="35" required>
                            <input class="textbox" type="password" name="pw" placeholder="Enter The Password" size="35" required>
                
                            <div class="btns">
                                <input class="btn_signin" type="submit" value="Sign In">
                            </div>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    signUp: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">

        <head>
            <meta charset="utf-8">
            <title>Sign Up</title>
            <link rel="icon" type="image/png" href="imgs/icon/user.png">
            <link rel="stylesheet" type="text/css" href="css/user_style.css">
            <link rel="stylesheet" type="text/css" href="css/user_signUp.css">
        </head>

        <body>
            <form action='/regist' method='post'>
                <div class="card">
                    <div class="container">
                        <h2><b>Sign Up</b></h2>

                        <input class="textbox" type="text" name="id" placeholder="Enter Your ID" size="35" required>
                        <input class="textbox" type="text" name="name" placeholder="Enter Your Full Name" size="35" required>
                        <input class="textbox" type="email" name="email" placeholder="Enter Your Email" size="35" required>
                        <input class="textbox" type="password" name="pw" placeholder="Enter Your Password" size="35" required>

                        <input class="btn_next" type="submit" value="signUp">
                    </div>
                </div>
            </form>
        </body>

        </html>
        `
    },
    user_main: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">

        <head>
            <meta charset="utf-8">
            <title>User Page</title>
            <link rel="icon" type="image/png" href="imgs/icon/home.png">
            <link rel="stylesheet" type="text/css" href="css/user_style.css">
            <link rel="stylesheet" type="text/css" href="css/user_main.css">
        </head>

        <body>
            <form>
                <div class="card">
                    <div class="container">
                        <h2><b>User Page</b></h2>

                        <div class="btns">
                            <a href="/myPage"><input class="btn" type="button" name="myPage" value="마이 페이지"></a>
                            <a href="/searchPlace"><input class="btn" type="button" name="searchPlace" value="대여 장소 검색"></a>
                        </div>
                    </div>
                </div>
            </form>
        </body>

        </html>
        `
    },
    myPage: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>My Page</title>
                <link rel="icon" type="image/png" href="imgs/icon/star.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_myPage.css">
            </head>

            <body>
                <form>
                    <div class="card">
                        <div class="container">
                            <a href="/user_main"><img class="home_icon" src="imgs/icon/home.png" alt="Home"></a>
                            <h2><b>My Page</b></h2>
                            
                            <div class="btns">
                                <a href="/userInfo"><input class="btn" type="button" name="info" value="회원 정보 수정"></a>
                                <a href="/card"><input class="btn" type="button" name="card" value="카드 관리"></a>
                                <a href="/history"><input class="btn" type="button" name="hist" value="사용 내역 조회"></a>
                                <a href="/logout"><input class="btn" type="button" name="signout" value="로그아웃"></a>
                                <a href="/withdraw"><input class="btn" type="button" name="withdraw" value="회원 탈퇴"></a>
                            </div>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    userInfo: function(id, name, email, password) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>User Information</title>
                <link rel="icon" type="image/png" href="imgs/icon/user.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_userInfo.css">
            </head>
        
            <body>
                <form action="/changeInfo" method="post">
                    <div class="card">
                        <div class="container">
                            <a href="/myPage"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                            <h2><b>User Information</b></h2>
        
                            <input class="textbox" type="text" name="id" placeholder="Enter Your ID" value=${id} size="35" required>
                            <input class="textbox" type="text" name="name" placeholder="Enter Your Full Name" value=${name} size="35" required>
                            <input class="textbox" type="email" name="email" placeholder="Enter Your Email" value=${email} size="35" required>
                            <input class="textbox" type="password" name="pw" placeholder="Enter Your Password" value=${password} size="35" required>
        
                            <input class="btn_save" type="submit" value="수정"></a>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    card: function(cname, cnum, cvc, cvalid_m, cvalid_y) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Card</title>
                <link rel="icon" type="image/png" href="imgs/icon/credit-card.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_card.css">
            </head>

            <body>
                <form action='updateCard' method="post">
                    <div class="card">
                        <div class="container">
                            <a href="/myPage"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                            <h2><b>Card Information</b></h2>

                            <div class="card_info">
                                <input class="card_name" type="text" name="c_name" placeholder="은행명입력" value=${cname} required><br>
                                <input class="card_num" type="text" name="c_num" placeholder="카드번호 입력" value=${cnum} pattern="[0-9]{16}" required><br>    
                                <input class="card_year" type="text" name="c_month" placeholder="월" value=${cvalid_m} size="3" pattern="[0-9]{2}" required>
                                <p class="card_slash">/</p>
                                <input class="card_month" type="text" name="c_year" placeholder="년" value=${cvalid_y} size="3" pattern="[0-9]{2}" required>
                                <input class="card_cvc" type="password" name="c_cvc" placeholder="CVC 입력" value=${cvc} size="5" pattern="[0-9]{3}" required><br>
                            </div>

                            <input class="btn_save" type="submit" name="save" value="저장">
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    history: function(list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>History</title>
                <link rel="icon" type="image/png" href="imgs/icon/like.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_history.css">
            </head>

            <body>
                <form>
                    <div class="card">
                        <div class="container">
                            <a href="/myPage"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                            <h2><b>History</b></h2>

                            <!--사용 내역 리스트-->
                            <div id="table">
                                <input class="no" id="head" type="button" name="no" value="No">
                                <input class="vid" id="head" type="button" name="vid" value="Vehicle Id">
                                <input class="s_time" id="head" type="button" name="s_time" value="Start Time">
                                <input class="e_time" id="head" type="button" name="e_time" value="End Time">
                                <input class="price" id="head" type="button" name="price" value="Price">
                                <br>
                                ${list}
                            </div>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    searchPlace: function(list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
        <head>
            <meta charset="utf-8">
            <title>Main</title>
            <link rel="icon" type="image/png" href="imgs/icon/home.png">
            <link rel="stylesheet" type="text/css" href="css/user_style.css">
            <link rel="stylesheet" type="text/css" href="css/user_searchPlace.css">
        </head>

        <body>
            <form action='/vList' method='post'>
                <div class="card">
                    <div class="container">
                    <a href="/myPage"><img class="user_icon" src="imgs/icon/user.png" alt="User"></a>
                    <h2><b>Search Place</b></h2>
                    
                    <!--장소 리스트-->
                    <div id="table">
                        <input class="no" id="head" type="button" name="no" value="No">
                        <input class="place" id="head" type="button" name="place" value="Place">
                        <input class="select" id="head" type="button" name="place" value="Select">
                        ${list}

                    </div>

                    <input class="btn_next" type="submit" value="장소선택">
                    </div>
                </div>
            </form>
        </body>
        <script src="js/check.js"></script>
        </html>
        `;
    },
    vList: function(title, list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Vehicle List</title>
                <link rel="icon" type="image/png" href="imgs/icon/bycicle.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_vehicleList.css">
            </head>

            <body>
                <form action='/rent' method='post'>
                    <div class="card">
                        <div class="container">
                        <a href="/searchPlace"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                        <h2><b>${title}<br>Vehicle List</b></h2>

                        <!--장소에 있는 따릉이, 씽씽이 리스트-->
                        <div id="table">
                            <input class="no" id="head" type="button" name="no" value="No">
                            <input class="type" id="head" type="button" name="type" value="Type">
                            <input class="select_head" id="head" type="button" name="place" value="Select">
                            ${list}
                        </div>

                        <input class="btn_start" type="submit" value="대여">
                        </div>
                    </div>
                </form>
            </body>
            <script src="js/check.js"></script>
        </html>
        `
    },
    rent: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Renting</title>
                <link rel="icon" type="image/png" href="imgs/icon/bycicle.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_rent.css">
            </head>

            <body>
                <form action = '/receipt' method='post'>
                    <div class="card">
                        <div class="container">
                            <h2><b>Renting</b></h2>

                            <div>
                                <div class="time">
                                    <span id="post_hour">00</span>
                                    <span>:</span>
                                    <span id="post_min">00</span>
                                    <span>:</span>
                                    <span id="post_sec">00</span>
                                </div>
                                <input type="hidden" id="use" name="using">
                                <input class="btn_end" id="end_rent" type="submit" value="반납">
                            </div>

                        </div>
                    </div>
                </form>
            </body>
            
            <script src="js/rent.js"></script>

        </html>
        `
    },
    receipt: function(stime, etime, place, option, price) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Receipt</title>
                <link rel="icon" type="image/png" href="imgs/icon/bycicle.png">
                <link rel="stylesheet" type="text/css" href="css/user_style.css">
                <link rel="stylesheet" type="text/css" href="css/user_receipt.css">
            </head>

            <body>
            <form action='/finish' method='post'>
                    <div class="card">
                        <div class="container">
                            <h2><b>Rent Receipt</b></h2>

                            <table>
                                <tr>
                                    <td>시작 시간 :</td>
                                    <td class="input" id="startTime"> ${stime}</td>
                                </tr>

                                <tr>
                                    <td>종료 시간 :</td>
                                    <td class="input"id="endTime"> ${etime}</td>
                                </tr>

                                <tr>
                                    <td>시작 장소 :</td>
                                    <td class="input"id="startPlace"> ${place}</td>
                                </tr>
                                
                                <tr>
                                    <td>종료 장소 :</td>
                                    <td class="input">
                                        <select id="end_place" name = "e_place">
                                            <option value="" selected disabled hidden> </option>
                                            ${option};
                                        </select></td>
                                </tr>

                                <tr>
                                    <td>결제 금액 :</td>
                                    <td class="input" id="price"> ${price}</td>
                                </tr>
                            </table>

                            <input class="btn_okay" id="end_receipt" type="submit" value="확인">
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    }
}