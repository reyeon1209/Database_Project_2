var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var user = require('./Interface/user');
var admin = require('./Interface/admin');
var cookie = require('cookie');

var db = mysql.createConnection({
    host: 'ourdatabaseproject.cnfauaikje6z.us-east-2.rds.amazonaws.com',
    user: 'admin',
    database: 'PJ',
    password: '03170317',
    port: 3306
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Interface'));
app.get('/', (req, res) => {
    if (user.auth(req, res)) {
        var u_id = cookie.parse(req.headers.cookie).id;
        if (u_id == 'admin') {
            res.redirect('/main_admin');
        } else {
            res.redirect('/main');
        }
    } else {
        res.redirect('/signIn');
    }
});
app.get('/signIn', (req, res) => {
    var html = user.signIn();
    res.send(html)
});
//로그인
app.get('/signUp', (req, res) => {
    var html = user.signUp();
    res.send(html)
});
app.post('/login', (req, res) => {
    var id = req.body.id;
    db.query("select * from User where u_id = ?", [id], function(err, result) {
        if (err) {
            throw (err);
        }
        var message;
        if (result.length == 0) {
            message = "<script>alert('존재하지 않는 아이디 입니다.'); history.back();</script>";
        } else if (result[0].u_pw != req.body.pw) {
            message = "<script>alert('비밀번호가 틀렸습니다!'); history.back();</script>";
        } else {
            res.cookie('id', id);
            res.cookie('password', req.body.pw);
            message = "<script>alert('로그인 되었습니다!'); location.replace('/');</script>";
        }
        res.send(message);
    });
});
app.get('/logout', (req, res) => {
    res.clearCookie('id');
    res.clearCookie('password');
    res.send("<script>alert('로그아웃 되었습니다!'); location.replace('/');</script>");
});
//회원가입
app.post('/regist', (req, res) => {
    if (req.body.id == '' || req.body.pw == '' || req.body.email == '' || req.body.name == '') {
        res.send("<script>alert('양식을 모두 채워주세요!'); location.replace('/signUp');</script>");
    }
    db.query('select * from User where u_id = ?', [req.body.id], function(err, result) {
        if (result.length != 0) {
            res.send("<script>alert('이미 존재하는 아이디입니다!'); location.replace('/signIn');</script>");
        }
        db.query("insert into User(u_id, u_pw, u_name, u_email) values(?, ?, ?, ?)", [req.body.id, req.body.pw, req.body.name, req.body.email], function(err, result) {
            if (err) {
                throw (err);
            }
            res.send("<script>alert('회원가입 성공!'); location.replace('/signIn');</script>");
        });
    })
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//사용자 페이지
//마이페이지
app.get('/myPage', (req, res) => {
    var html = ``;
    html += user.myPage();
    res.send(html);
});
//회원정보 수정
app.get('/userInfo', (req, res) => {
    var html = ``;
    var cookies = cookie.parse(req.headers.cookie);
    db.query('select * from User where u_id = ?', [cookies.id], function(err, result) {
        html += user.userInfo(result[0].u_id, result[0].u_name, result[0].u_email, result[0].u_pw);
        res.send(html);
    });
});
app.post('/changeInfo', (req, res) => {
    if (req.body.id == '' || req.body.pw == '' || req.body.email == '' || req.body.name == '') {
        res.send("<script>alert('양식을 모두 채워주세요!'); location.replace('/signUp');</script>");
    }
    var u_id = cookie.parse(req.headers.cookie).id;
    db.query('select * from User where u_id = ?', [req.body.id], function(err, result) {
        if (result.length != 0) {
            res.send("<script>alert('이미 존재하는 아이디입니다!'); location.replace('/signIn');</script>");
        }
        db.query(`update User set u_id = ?, u_pw = ?, u_name = ?, u_email = ? 
            where u_id = ?`, [req.body.id, req.body.pw, req.body.name, req.body.email, u_id], function(err, result) {
            if (err) {
                throw (err);
            }
            res.cookie('id', req.body.id);
            res.cookie('password', req.body.pw);
            res.send("<script>alert('정보수정 성공!'); location.replace('/myPage');</script>");
        });
    })
});
//카드관리
app.get('/card', (req, res) => {
    var html = ``;
    var u_id = cookie.parse(req.headers.cookie).id;
    db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
        if (result.length == 0) {
            html += user.card("은행명입력", "카드번호입력", "CVC", "월", "년");
        } else {
            cmonth = parseInt(parseInt(result[0].c_valid) / 100);
            cyear = parseInt(result[0].c_valid) % 100;
            html += user.card(result[0].c_name, result[0].c_num, result[0].c_cvc, cmonth, cyear);
        }
        res.send(html);
    });
});
app.post('/updateCard', (req, res) => {
    var u_id = cookie.parse(req.headers.cookie).id;
    var cvalid = parseInt(req.body.c_month) * 100 + parseInt(req.body.c_year);
    db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
        if (result.length == 0) {
            db.query(`insert into Card(User_u_id, c_num, c_name, c_cvc, c_valid) 
                values(?, ?, ?, ?, ?)`, [u_id, req.body.c_num, req.body.c_name, req.body.c_cvc, cvalid], function(err2, result1) {
                if (err2) {
                    throw (err2);
                }
                res.send("<script>alert('카드등록이 완료됐습니다!'); history.back();</script>")
            })
        } else {
            db.query(`update Card set c_num = ?, c_name = ?, c_cvc = ?, c_valid = ? 
                where User_u_id = ?`, [req.body.c_num, req.body.c_name, req.body.c_cvc, cvalid, u_id], function(err2, result1) {
                res.send("<script>alert('카드수정이 완료됐습니다!'); history.back();</script>")
                if (err2) {
                    throw (err2);
                }
            })
        }
    });
});
//사용기록 조회
app.get('/history', (req, res) => {
    var html = ``;
    var list = ``;
    var u_id = cookie.parse(req.headers.cookie).id;
    db.query('select * from History where User_u_id = ?', [u_id], function(err, result) {
        for (var i = 0; i < result.length; i++) {
            var stime = result[i].s_time.toLocaleDateString() + '_' + result[i].s_time.toLocaleTimeString();
            var etime = result[i].e_time.toLocaleDateString() + '_' + result[i].e_time.toLocaleTimeString();
            list += `
            <input class="no" type="button" name="no" value=${i+1}>
            <input class="vid" type="button" name="vid" value=${result[i].Vehicle_id}>
            <input class="s_time" type="button" name="s_time" value=${stime}>
            <input class="e_time" type="button" name="e_time" value=${etime}>
            <input class="price" type="button" name="price" value=${result[i].h_price}>
            <br>
            `
        }
        html += user.history(list);
        res.send(html);
    });
});
//장소 선택
app.get('/main', (req, res) => {
    var list = ``;
    var html = ``;
    db.query('select * from Place', function(err, result) {
        for (i = 1; i < result.length; i++) {
            list += `
        <br>
        <label>
        <input class="no" type="button" name="no" value = ${result[i].p_id}>
        <input class="place" type="button" name="place" value= ${result[i].p_name}>
        <input class="select" type="checkbox" name="p_id" value="${result[i].p_id}"></label>
        `;
        }
        html += user.main(list);
        res.send(html);
    })
});
//탈것 선택
app.post('/vList', (req, res) => {
    if (!req.body.p_id) {
        res.send('<script>alert("장소를 선택해주세요!"); history.back()</script>');
    } else if (req.body.p_id.length > 1) {
        res.send('<script>alert("장소를 하나만 골라주세요!"); history.back()</script>');
    }
    var list = ``;
    var html = ``;
    db.query('select * from Vehicle where v_place = ? and v_cnt <= 10 order by v_type', [req.body.p_id], function(err, result) {
        if (result.length == 0) {
            res.send('<script>alert("현재 장소에 이용가능한 탈 것이 없습니다!"); history.back();</script>');
        } else {
            db.query('select * from Place where p_id = ?', [req.body.p_id], function(err2, places) {
                for (i = 0; i < result.length; i++) {
                    var type;
                    if (result[i].v_type == 1) {
                        type = "따릉이";
                    } else {
                        type = "킥보드";
                    }
                    list += `
                        <br>
                        <input class="no" type="button" name="no" value=${result[i].v_id}>
                        <input class="type" type="button" name="type" value=${type}>
                        <label><input class="select" type="checkbox" name="v_id" value=${result[i].v_id}></label>
                    `;
                }
                html += user.vList(places[0].p_name, req.body.p_id, list);
                res.send(html);
            })
        }
    })
});
//대여시작
app.post('/rent', (req, res) => {
    if (!req.body.v_id) {
        res.send('<script>alert("탈것을 선택해주세요!"); history.back()</script>');
    } else if (req.body.v_id.length > 1) {
        res.send('<script>alert("탈것을 하나만 골라주세요!"); history.back()</script>');
    } else {
        var u_id = cookie.parse(req.headers.cookie).id;
        db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
            if (result.length == 0) {
                res.send('<script>alert("카드를 먼저 등록해주세요!"); location.replace("/card")</script>');
            } else {
                var html = '';
                var sdate = new Date().toLocaleDateString();
                var stime = new Date().toLocaleTimeString();
                html += user.rent(sdate, stime, req.body.p_id, req.body.v_id);
                res.send(html);
            }
        });
    }
});
//반납확인
app.post('/receipt', (req, res) => {
    var edate = new Date().toLocaleDateString();
    var etime = new Date().toLocaleTimeString();
    var html = '';
    var price;
    if (req.body.using < 600) {
        price = 1000;
    } else {
        price = req.body.using / 60 * 100;
    }
    db.query('select * from Place where p_id = ?', [req.body.p_id], function(err, result) {
        html += user.receipt(req.body.sdate, req.body.stime,
            edate, etime, result[0].p_name, price, req.body.v_id);
        res.send(html);
    })
});
//반납 완료
app.post('/finish', (req, res) => {
    var stime = req.body.sdate + ' ' + req.body.stime;
    var etime = req.body.edate + ' ' + req.body.etime;
    db.query('select * from Place where p_name = ?', [req.body.eplace], function(err2, eplace) {
        if (eplace.length == 0) {
            res.send('<script>alert("반납 장소명을 정확히 입력해주세요!"); history.back()</script>');
        }
        db.query('select * from Place where p_name = ?', [req.body.splace], function(err1, splace) {
            db.query(`insert into History(Vehicle_id, s_time, e_time, h_price, Card_id, s_place, e_place, User_u_id) 
            values(?, ?, ?, ?, 1, ?, ?, 18011660)`, [req.body.v_id, stime, etime, req.body.price, splace[0].p_id, eplace[0].p_id],
                function(err3, result) {
                    db.query('update Vehicle set v_cnt = v_cnt + 1 where v_id = ?', [req.body.v_id], function(err4, results) {
                        db.query('update Vehicle set v_state = 0 where v_cnt > 10', function(err5, result5) {
                            res.send('<script>alert("반납이 완료되었습니다."); location.replace("/main")</script>');
                        })
                    })
                })
        })
    })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//관리자 페이지
//메인 페이지
app.get('/admin_main', (req, res) => {
    var html = ``;
    html += admin.main();
    res.send(html);
});
//탈것 관리 페이지
app.get('/admin_vehicle', (req, res) => {
    var html = ``;
    var list = ``;
    db.query(`select v.v_id, v.v_state, v.v_type, v.v_place, p.p_name 
        from Vehicle as v join Place as p
        on v.v_place = p.p_id`, function(err, vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            var state, avail, type;
            if (vehicles[i].v_state) {
                state = "able";
                avail = "가능";
            } else {
                state = "unable";
                avail = "고장";
            }
            if (vehicles[i].v_type == 1) {
                type = "따릉이";
            } else {
                type = "킥보드";
            }
            list += `
                <input class="no" type="button" name="no" value=${vehicles[i].v_id}>
                <input class="type" type="button" name="type" value=${type}>
                <input class="place" type="button" name="place" value=${vehicles[i].p_name}>
                <input class=${"btn_" + state} type="button" name=${state} value=${avail}>
                <label><input class="select" type="checkbox" name="v_id" value=${vehicles[i].v_id}><br></label>
                <br>
            `;
        }
        html += admin.vehicle(list);
        res.send(html);
    })
});
//탈것 관리 수행
app.post('/admin_manage_vehicle', (req, res) => {
    if (req.body.name == 'Add') {
        var html = admin.addVehicle();
        res.send(html);
    } else if (!req.body.v_id) {
        res.send('<script>alert("탈것을 선택해주세요!"); history.back()</script>');
    } else if (req.body.v_id.length > 1) {
        res.send('<script>alert("탈것을 하나만 골라주세요!"); history.back()</script>');
    } else {
        if (req.body.name === 'Fix') {
            db.query('update Vehicle set v_state = 1, v_cnt = 0 where v_id = ?', [req.body.v_id], function(err, result) {
                res.send('<script>alert("수리 되었습니다!"); location.replace("/admin_vehicle");</script>');
            });
        } else {
            db.query('delete from Vehicle where v_id = ?', [req.body.v_id], function(err, result) {
                res.send('<script>alert("삭제 되었습니다!"); location.replace("/admin_vehicle");</script>');
            });
        }
    }

});
//탈것 추가
app.post('/addVehicle', (req, res) => {
    db.query('select * from Place where p_name = ?', [req.body.place], function(err, place) {
        db.query(`insert into Vehicle(v_id, v_state, v_type, v_place, v_cnt)
        values(?, ?, ?, ?, 0)`, [req.body.v_id, req.body.state, req.body.type, place[0].p_id], function(err1, result) {
            res.send("<script>alert('추가 되었습니다!'); location.replace('/admin_vehicle');</script>");
        });
    })
});
//유저 관리 페이지
app.get('/admin_user', (req, res) => {
    var html = ``;
    var list = ``;
    db.query('select * from User', function(err, result) {
        for (var i = 0; i < result.length; i++) {
            list += `
            <input class="uid" type="button" name="uid" value=${result[i].u_id}>
            <input class="name" type="button" name="name" value=${result[i].u_name}>
            <input class="email" type="button" name="email" value=${result[i].u_email}>
            <input class="pwd" type="button" name="pwd" value=${result[i].u_pw}>
            <br>
            `
        }
        html += admin.user(list);
        res.send(html);
    });
});
//장소 관리 페이지
app.get('/admin_place', (req, res) => {
    var html = ``;
    var list = ``;
    db.query('select * from Place', function(err, places) {
        for (var i = 0; i < places.length; i++) {
            list += `
                <br>
                <input class="name" type="button" name="name" value=${places[i].p_name}>
                <input class="address" type="button" name="address" value=${places[i].p_address}>
            `;
        }
        html += admin.place(list);
        res.send(html);
    })
});

app.listen(3000, () => {
    console.log('Connection!');
});