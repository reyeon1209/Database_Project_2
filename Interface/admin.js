module.exports = {
    main: function() {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>Management Page</title>
                <link rel="icon" type="image/png" href="imgs/icon/settings.png">
                <link rel="stylesheet" type="text/css" href="css/admin_style.css">
                <link rel="stylesheet" type="text/css" href="css/admin_main.css">
            </head>

            <body>
                <form>
                    <div class="card">
                        <div class="container">
                            <h2><b>Management Page</b></h2>
                            
                            <div class="btns">
                                <a href="/admin_vehicle"><input class="btn" type="button" name="vehicle" value="기기 관리"></a>
                                <a href="/admin_user"><input class="btn" type="button" name="user" value="사용자 관리"></a>
                                <a href="/admin_place"><input class="btn" type="button" name="place" value="장소 관리"></a>
                                <a href="/logout"><input class="btn" type="button" name="signout" value="로그아웃"></a>
                            </div>
                        </div>
                    </div>
                </form>
            </body>
        </html>
        `
    },
    vehicle: function(list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">

        <head>
            <meta charset="utf-8">
            <title>Vehicle Management</title>
            <link rel="icon" type="image/png" href="imgs/icon/settings.png">
            <link rel="stylesheet" type="text/css" href="css/admin_style.css">
            <link rel="stylesheet" type="text/css" href="css/admin_vehicle.css">
        </head>

        <body>
            <form action='/admin_manage_vehicle' method='post'>
                <div class="card">
                    <div class="container">
                    <a href="/admin_main"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                    <h2><b>Vehicle Management</b></h2>

                        <!--장소에 있는 따릉이, 씽씽이 리스트-->
                        <div id="table">
                            <input class="select_head" id="head" type="button" name="select" value="Select">
                            <input class="no" id="head" type="button" name="no" value="No">
                            <input class="type" id="head" type="button" name="type" value="Type">
                            <input class="place" id="head" type="button" name="place" value="Place">
                            <input class="state" id="head" type="button" name="able" value="State">
                            <br>
                            ${list}
                            
                        </div>

                        <div class="btns">
                            <input class="btn_modify" type="submit" name="name" value="Fix">
                            <input class="btn_delete" type="submit" name="name" value="Delete">
                            <input class="btn_add" type="submit" name="name" value="Add">
                            <input class="btn_history" type="submit" name="history" value="History"></a>
                        </div>
                    </div>
                </div>
            </form>
        </body>
        <script src="js/check.js"></script>

        </html>
        `
    },
    addVehicle: function(option) {
        return ` 
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">

        <head>
            <meta charset="utf-8">
            <title> Add Vehicle
            </title>
            <link rel="icon" type="image/png" href="imgs/icon/settings.png">
            <link rel="stylesheet" type="text/css" href="css/admin_style.css">
            <link rel="stylesheet" type="text/css" href="css/admin_vehicleAdd.css">
        </head>

        <body>
            <form action='/addVehicle' method='post'>
                <div class="card">
                    <div class="container">
                        <a href="/admin_vehicle">
                            <img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back">
                        </a>
                            <h2>
                            <b> Add Vehicle</b>
                            </h2>

                            <input class="textbox" type="text" name="v_id" placeholder="Enter The Vehicle ID" size="35" pattern="[0-9]" required>
                            <select id="type" name="type">
                                <option selected disabled hidden> 기기 종류</option>
                                <option value="1"> 따릉이</option>
                                <option value="2"> 씽씽이</option>
                            </select>
                            <select id="place" name="place">
                                <option selected disabled hidden>장소 선택</option>
                                ${option}
                            </select>

                            <input class="btn_save" type="submit" value="Save">
                    </div>
                </div>
            </form>
        </body>

        </html>
        `
    },
    historyVehicle: function(title, list) {
        return `
        <!DOCTYPE html>
        <html lang="ko" dir="ltr">
            <head>
                <meta charset="utf-8">
                <title>History</title>
                <link rel="icon" type="image/png" href="imgs/icon/settings.png">
                <link rel="stylesheet" type="text/css" href="css/admin_style.css">
                <link rel="stylesheet" type="text/css" href="css/admin_vehicleHistory.css">
            </head>

            <body>
                <form>
                    <div class="card">
                        <div class="container">
                            <a href="/admin_vehicle"><img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back"></a>
                            <h2><b>History of VId = ${title}</b></h2>

                            <!--사용 내역 리스트-->
                            <div id="table">
                                <input class="uid" id="head" type="button" name="uid" value="User Id">
                                <input class="s_time" id="head" type="button" name="s_time" value="Start Time">
                                <input class="e_time" id="head" type="button" name="e_time" value="End Time">
                                <input class="e_place" id="head" type="button" name="e_place" value="End Place">
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
    user: function(list) {
        return ` <!DOCTYPE html>
        <html lang="ko" dir="ltr">
        
        <head>
            <meta charset="utf-8">
            <title> User Management
            </title>
            <link rel="icon" type="image/png" href="imgs/icon/settings.png">
            <link rel="stylesheet" type="text/css" href="css/admin_style.css">
            <link rel="stylesheet" type="text/css" href="css/admin_user.css">
        </head>
        
        <body>
            <form action='/deleteUser' method='post'>
                <div class="card">
                    <div class="container">
                        <a href="/admin_main">
                            <img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back">
                        </a>
                        <h2>
                            <b> User Management</b>
                        </h2>
        
                            <!--사용자 리스트-->
                            <div id="table">
                                <input class="select_head" id="head" type="button" name="select" value="Select"> 
                                <input class="uid" id="head" type="button" name="uid" value="ID">
                                <input class="name" id="head" type="button" name="name" value="Name">
                                <input class="email" id="head" type="button" name="email" value="Email">
                                <input class="pwd" id="head" type="button" name="pwd" value="Password">
                                <input class="card_num" id="head" type="button" name="card_num" value="Card Number">
                                ${list}
        
                            </div>
        
                            <div class="btns">
                                <input class="btn_delete" type="submit" value="Delete">
                            </div>
                    </div>
                </div>
            </form>
        </body>
        <script src="js/check.js">
        </script>
        
        </html>
                    `
    },
    place: function(list) {
        return `<!DOCTYPE html>
        <html lang="ko" dir="ltr">
        
        <head>
            <meta charset="utf-8">
            <title> Place Management
            </title>
            <link rel="icon" type="image/png" href="imgs/icon/settings.png">
            <link rel="stylesheet" type="text/css" href="css/admin_style.css">
            <link rel="stylesheet" type="text/css" href="css/admin_place.css">
        </head>
        <body>
            <form action='/admin_manage_place' method='post'>
                <div class="card">
                    <div class="container">
                        <a href="/admin_main">
                            <img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back">
                        </a>
                        <h2>
                            <b> Place Management</b>
                            </h 2>
        
                            <div id="table">
                                <input class="select_head" id="head" type="button" name="select" value="Select"> 
                                <input class="name" id="head" type="button" name="name" value="name">
                                <input class="address" id="head" type="button" name="address" value="address">
                                ${list}
        
                            </div>
        
                            <div class="btns">
                                <input class="btn_delete" type="submit" name="name" value="Delete">
                                <input class="btn_add" type="submit" name="name" value="Add">
                            </div>
                    </div>
                </div>
            </form>
        </body>
        <script src="js/check.js">
        </script>
        
        </html>
                    `
    },
    placeAdd: function() {
        return ` <!DOCTYPE html>
        <html lang="ko" dir="ltr">
        
        <head>
            <meta charset="utf-8">
            <title> Add Place
            </title>
            <link rel="icon" type="image/png" href="imgs/icon/settings.png">
            <link rel="stylesheet" type="text/css" href="css/admin_style.css">
            <link rel="stylesheet" type="text/css" href="css/admin_placeAdd.css">
        </head>
        
        <body>
            <form action='/addPlace' method='post'>
                <div class="card">
                    <div class="container">
                        <a href="/admin_place">
                            <img class="back_icon" src="imgs/icon/arrow_back.png" alt="Back">
                        </a>
                        <h2>
                            <b> Add Place</b>
                            </h 2>
        
                            <input class="textbox" type="text" name="name" placeholder="Enter The Place Name" size="35" required>
                            <input class="textbox" type="text" name="address" placeholder="Enter The Place Address" size="35" required>
        
                            <input class="btn_save" type="submit" value="추가">
                    </div>
                </div>
            </form>
        </body>
        
        </html>
                `
    }
}