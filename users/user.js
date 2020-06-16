module.exports = {
    signIn: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
        
        <head>
            <meta charset="utf-8">
            <title>Sign In</title>
            <link rel="icon" type="image/png" href="imgs/icon/user.png">
            <link rel="stylesheet" type="text/css" href="css/style.css">
            <link rel="stylesheet" type="text/css" href="css/signIn.css">
        </head>
        
        <body>
            <form action='/login' method="post">
                <div class="card">
                    <img class="user_img" src="imgs/user.png" alt="User">
                    <div class="container">
                        <h2><b>Sign In</b></h2>
                        <input class="textbox" type="text" name="id" placeholder="Enter The User Id" size="35">
                        <input class="textbox" type="password" name="pw" placeholder="Enter The Password" size="35">
                        <div class="btns">
                            <input class="btn_signin" type="submit" name="sign_in" value="Sign In">
                            <a href = "/signUp"><input class="btn_signup" type="button" name="sign_up" value="Sign Up"></a>
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
            <link rel="stylesheet" type="text/css" href="css/style.css">
            <link rel="stylesheet" type="text/css" href="css/signUp.css">
        </head>

        <body>
            <form action='/regist' method='post'>
                <div class="card">
                    <div class="container">
                        <h2><b>Sign Up</b></h2>

                        <input class="textbox" type="text" name="id" placeholder="Enter Your ID" size="35">
                        <input class="textbox" type="text" name="name" placeholder="Enter Your Full Name" size="35">
                        <input class="textbox" type="email" name="email" placeholder="Enter Your Email" size="35">
                        <input class="textbox" type="password" name="pw" placeholder="Enter Your Password" size="35">

                        <input class="btn_next" type="submit" value="signUp">
                    </div>
                </div>
            </form>
        </body>

        </html>
        `
    },
    main: function(list) {
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
            <form action='/vList'>
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

                    <input class="btn_next" type="submit">
                    </div>
                </div>
            </form>
        </body>
        </html>
        `;
    },
    vList: function(list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
        <head>
            <meta charset="utf-8">
            <title>Vehicle List</title>
            <link rel="icon" type="image/png" href="imgs/icon/bycicle.png">
            <link rel="stylesheet" type="text/css" href="css/style.css">
            <link rel="stylesheet" type="text/css" href="css/vehicleList.css">
        </head>

        <body>
            <form action='/rent'>
                <div class="card">
                    <div class="container">
                    <a href="main.html"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                    <h2><b>Vehicle List</b></h2>

                    <!--장소에 있는 따릉이, 씽씽이 리스트-->
                    <div id="table">
                        <input class="no" id="head" type="button" name="no" value="No">
                        <input class="type" id="head" type="button" name="type" value="Type">
                        <input class="select_head" id="head" type="button" name="place" value="Select">
                        ${list}
                    </div>

                    <input class="btn_start" type="submit">
                    </div>
                </div>
            </form>
        </body>
        </html>
        `
    }
}