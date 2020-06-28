/*
필요한 모듈 import 부분
웹 어플리케이션 구현 난이도가 쉬운 express 프레임워크를 사용하였습니다. 
bodyParser를 import 해서 post방식으로 통신할때, body에 넘어오는 값들을 파싱해주었습니다.
express 사용을 편리하게 하기 위해서 app 변수를 지정하여 사용했습니다.
mysql을 import 해서 db와 연결하기 위한 기능을 가져왔습니다.
html 파일이 js파일안에 모듈화 되어있는 user와 admin를 가져왔습니다.
cookie를 import해서 쿠키값을 보다 쉽게 파싱할 수 있도록 했습니다.
sanitizeHtml을 import해서 sql Injection과 cross site scripting에 대한 공격을 막아두었습니다.
*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var user = require('./Interface/user');
var admin = require('./Interface/admin');
var cookie = require('cookie');
var sanitizeHtml = require('sanitize-html');

//db와 연결 - amazon rds에 올려둔 db와 연결하였습니다.
var db = mysql.createConnection({
    host: 'ourdatabaseproject.cnfauaikje6z.us-east-2.rds.amazonaws.com',
    user: 'admin',
    database: 'PJ',
    password: '03170317',
    port: 3306
});

//body에서 가져오는 값들을 파싱해주기 위한 코드
app.use(bodyParser.urlencoded({ extended: false }));

//express에서 정적파일을 사용하기 위해 추가
app.use(express.static('Interface'));

//메인 페이지
app.get('/', (req, res) => {
    //auth 함수를 통해 쿠키에 id값이 있는지 없는지 판별
    if (user.auth(req, res)) {
        var u_id = cookie.parse(req.headers.cookie).id;
        //쿠키에 값이 있을때 그 값이 admin이라면 관리자 페이지 아니라면 사용자 페이지로 이동
        if (u_id == 'admin') {
            res.redirect('/admin_main');
        } else {
            res.redirect('/user_main');
        }
    } else {
        //쿠키에 값이 없다면 메인페이지로 이동
        res.send(user.main());
    }
});
//로그인
app.get('/signIn', (req, res) => {
    var html = user.signIn();
    res.send(html)
});
//회원가입
app.get('/signUp', (req, res) => {
    var html = user.signUp();
    res.send(html)
});
//로그인과 로그아웃 실행시
app.post('/login', (req, res) => {
    //입력된 값 필터링
    var id = sanitizeHtml(req.body.id);
    var pw = sanitizeHtml(req.body.pw);
    //유저 아이디와 대조한 후 각 경우에 맞는 알람문 출력 후 경로 이동
    db.query("select * from User where u_id = ?", [id], function(err, result) {
        var message;
        if (!result.length) {
            message = "<script>alert('존재하지 않는 아이디 입니다.'); history.back();</script>";
        } else if (result[0].u_pw != pw) {
            message = "<script>alert('비밀번호가 틀렸습니다!'); history.back();</script>";
        } else {
            //로그인 성공시 해당하는 id를 쿠키에 저장
            res.cookie('id', id);
            message = "<script>alert('로그인 되었습니다!'); location.replace('/');</script>";
        }
        res.send(message);
    });
});
app.get('/logout', (req, res) => {
    //로그아웃시에는 생성되었던 쿠키를 지운 후 초기 경로로 이동
    res.clearCookie('id');
    res.send("<script>alert('로그아웃 되었습니다!'); location.replace('/');</script>");
});
//회원가입 실행시
app.post('/regist', (req, res) => {
    //입력되는 각각의 값을 필터링
    var id = sanitizeHtml(req.body.id);
    var pw = sanitizeHtml(req.body.pw);
    var name = sanitizeHtml(req.body.name);
    var email = sanitizeHtml(req.body.email);
    db.query('select * from User where u_id = ?', [id], function(err, result) {
        //이미 존재하는 아이디인지 체크 후 없다면 User 테이블에 추가
        if (result.length) {
            res.send("<script>alert('이미 존재하는 아이디입니다!'); location.replace('/signIn');</script>");
        } else {
            db.query(`insert into User(u_id, u_pw, u_name, u_email) 
                values(?, ?, ?, ?)`, [id, pw, name, email], function(err, result) {
                res.send("<script>alert('회원가입 성공!'); location.replace('/signIn');</script>");
            });
        }
    })
});
//회원탈퇴 실행시
app.get('/withdraw', (req, res) => {
    id = cookie.parse(req.headers.cookie).id;
    //쿠키값에 존재하는 아이디로 유저를 검색한 후 삭제하고 쿠키에서도 지우기
    db.query('delete from User where u_id = ?', [id], (err, result) => {
        res.clearCookie('id');
        res.send("<script>alert('탈퇴가 완료되었습니다.'); location.replace('/');</script>");
    })
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//사용자 페이지 user.js에서 모듈화하여 함수형식으로 사용
//유저 메인 - 로그인시 바로 이동되는 페이지
app.get('/user_main', (req, res) => {
    res.send(user.user_main());
});
//대여장소 선택화면
app.get('/searchPlace', (req, res) => {
    var list = ``;
    var html = ``;
    //Place 테이블에서 모든 장소 가져온 후 테이블에 뿌리기
    db.query('select * from Place', function(err, result) {
        //체크박스에 대해서 check.js 파일에 있는 onclick함수를 이용해 다중선택 방지
        for (i = 0; i < result.length; i++) {
            list += `
        <br>
        <label>
        <input class="no" type="button" name="no" value = "${result[i].p_id}">
        <input class="place" type="button" name="place" value= "${result[i].p_name}">
        <input class="select" type="checkbox" name="id" value="${result[i].p_id}" onclick="oneCheckbox(this)"></label>
        `;
        }
        html += user.searchPlace(list);
        res.send(html);
    })
});
//탈것 선택
app.post('/vList', (req, res) => {
    //만약에 이전 페이지에서 장소가 체크되지 않고 넘어왔을시 다시 되돌림
    if (!req.body.id) {
        res.send('<script>alert("장소를 선택해주세요!"); history.back()</script>');
    } else {
        var list = ``;
        var html = ``;
        //Vehicle 테이블에서 현재 선택된 장소에 있는 탈 것들 중 사용 가능한 것들만 뽑아서 탈 것 종류순으로 정렬
        db.query(`select v.v_id, v.v_type from Vehicle as v where v.v_id = 
            (select vc.v_id from VehicleCheck as vc where vc.v_state = 1 and v.v_id = vc.v_id)
            and v_place = ?`, [req.body.id], function(err, result) {
            if (!result.length) {
                //만약에 선택된 장소에 탈것이 존재하지 않는다면 다시 되돌아가기
                res.send('<script>alert("현재 장소에 이용가능한 탈 것이 없습니다!"); history.back();</script>');
            } else {
                //탈것이 있다면 해당 장소의 이름을 제목으로 넘겨주기 위해 Place테이블을 참조하고 프론트에 제목과 탈것들 뿌리기
                db.query('select * from Place where p_id = ?', [req.body.id], function(err2, places) {
                    for (i = 0; i < result.length; i++) {
                        var type;
                        if (result[i].v_type == 1) {
                            type = "따릉이";
                        } else {
                            type = "씽씽이";
                        }
                        //체크박스에 대해서 check.js 파일의 onCheckbox 함수를 통해 다중선택 방지
                        list += `
                        <br>
                        <input class="no" type="button" name="no" value=${result[i].v_id}>
                        <input class="type" type="button" name="type" value=${type}>
                        <label><input class="select" type="checkbox" name="id" value=${result[i].v_id} onclick="oneCheckbox(this)"></label>
                    `;
                    }
                    //쿠키에 넘어온 장소값을 저장
                    res.cookie('p_id', req.body.id);
                    html += user.vList(places[0].p_name, list);
                    res.send(html);
                })
            }
        })
    }
});
//대여시작
app.post('/rent', (req, res) => {
    if (!req.body.id) {
        //이전단계에서 선택된 탈것이 없다면 다시 되돌아가기
        res.send('<script>alert("탈것을 선택해주세요!"); history.back()</script>');
    } else {
        var u_id = cookie.parse(req.headers.cookie).id;
        //Card 테이블에서 로그인한 유저가 카드가 있는지 없는지 확인
        db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
            if (!result.length) {
                //없다면 마이페이지의 카드 관리 페이지로 이동
                res.send('<script>alert("카드를 먼저 등록해주세요!"); location.replace("/card")</script>');
            } else {
                //있다면 대여 시작 후 자전거의 상태를 이용중으로 변경
                db.query('update VehicleCheck set v_state = 2 where v_id = ?', [req.body.id], function(err, vehicle) {
                    var html = '';
                    //시작 시간 체크
                    var stime = new Date().toLocaleString();
                    //쿠키에 넘어온 탈것의 아이디와 시작 시간을 저장
                    res.cookie('v_id', req.body.id);
                    res.cookie('stime', stime);
                    html += user.rent();
                    res.send(html);
                })
            }
        });
    }
});
//반납확인
app.post('/receipt', (req, res) => {
    //종료시간 체크
    var etime = new Date().toLocaleString();
    var html = '';
    var option = ``;
    var price, p_id, stime;
    //쿠키에서 장소값과 시작시간을 받기
    p_id = cookie.parse(req.headers.cookie).p_id;
    stime = cookie.parse(req.headers.cookie).stime;
    //넘어온 이용시간을 통해서 가격 측정 - 1분에 100원 10분 미만시 천원
    if (req.body.using < 600) {
        price = 1000;
    } else {
        price = req.body.using / 60 * 100;
    }
    //쿠키의 장소값과 일치하는 장소 검색 - 시작장소
    db.query('select * from Place where p_id = ?', [p_id], function(err, result) {
        //Place 테이블에서 모든 장소 가져오기 - 종료장소 입력을 위함
        db.query('select * from Place', function(err2, places) {
            //반복문을 이용해서 모든 장소를 옵션으로 넘겨줌
            for (var i = 0; i < places.length; i++) {
                option += `
                    <option>${places[i].p_name}</option>
                `
            }
            //시작시간과 종료시간, 시작장소의 이름, 모든 장소가 담긴 option 그리고 가격을 프론트에 뿌리기
            html += user.receipt(stime,
                etime, result[0].p_name, option, price);
            res.cookie('price', price);
            res.cookie('etime', etime);
            res.send(html);
        })
    })
});
//반납 완료
app.post('/finish', (req, res) => {
    //전부 받아온 값이기때문에 (선택하거나 쿠키에 저장된 값) 따로 필터링은 필요가 없음
    var stime, etime, p_id, v_id, u_id, price;
    //각 변수에 대해 쿠키에서 파싱해서 저장
    u_id = cookie.parse(req.headers.cookie).id;
    p_id = cookie.parse(req.headers.cookie).p_id;
    v_id = cookie.parse(req.headers.cookie).v_id;
    stime = cookie.parse(req.headers.cookie).stime;
    etime = cookie.parse(req.headers.cookie).etime;
    price = cookie.parse(req.headers.cookie).price;
    if (!req.body.e_place) {
        res.send('<script>alert("반납장소를 선택하세요!"); history.back()</script>');
    } else {
        //넘어온 e_place 즉 종료 지점의 이름을 통해서 Place테이블에서 그 장소의 아이디값을 가져오기
        db.query('select * from Place where p_name = ?', [req.body.e_place], function(err2, eplace) {
            //이전 단계에서 리스트로 존재하는 장소들의 목록을 주었기에 따로 예외처리는 필요없음
            //사용 내역에 사용된 기록 저장
            db.query(`insert into History(Vehicle_id, s_time, e_time, h_price, s_place, e_place, User_u_id) 
            values(?, ?, ?, ?, ?, ?, ?)`, [v_id, stime, etime, price, p_id, eplace[0].p_id, u_id],
                function(err3, result) {
                    //사용된 탈것에 대해서 사용된 횟수를 1회 증가하고 탈것이 다시 이용 가능하도록 수정
                    db.query('update VehicleCheck set v_cnt = v_cnt + 1, v_state = 1 where v_id = ?', [v_id], function(err4, results) {
                        //사용 횟수가 증가되었을때, 탈것들 중에 사용 횟수가 10회가 넘어간 탈것들에 대해서 상태를 고장으로 변경
                        db.query('update VehicleCheck set v_state = 0 where v_cnt > 10', function(err5, result5) {
                            //모든 과정이 완료되었을때, 유저 아이디와 비밀번호를 제외한 나머지 값들을 쿠키에서 삭제
                            res.clearCookie('p_id');
                            res.clearCookie('v_id');
                            res.clearCookie('stime');
                            res.clearCookie('etime');
                            res.clearCookie('price');
                            //반납 완료 후 다시 main페이지로 이동
                            res.send('<script>alert("반납이 완료되었습니다."); location.replace("/user_main")</script>');
                        })
                    })
                })
        })
    }
});
//마이페이지
app.get('/myPage', (req, res) => {
    var html = ``;
    html += user.myPage();
    res.send(html);
});
//회원정보 수정
app.get('/userInfo', (req, res) => {
    var html = ``;
    var id = cookie.parse(req.headers.cookie).id;
    //쿠키에 저장된 아이디를 통해서 본인의 정보를 db에서 가져온 후 프론트에 뿌리기
    db.query('select * from User where u_id = ?', [id], function(err, result) {
        html += user.userInfo(result[0].u_id, result[0].u_name, result[0].u_email, result[0].u_pw);
        res.send(html);
    });
});
//수정하는 과정
app.post('/changeInfo', (req, res) => {
    //받아온 값들을 필터링
    var u_id = cookie.parse(req.headers.cookie).id;
    var id = sanitizeHtml(req.body.id);
    var pw = sanitizeHtml(req.body.pw);
    var name = sanitizeHtml(req.body.name);
    var email = sanitizeHtml(req.body.email);
    //받아온 id 값에 대해서 이미 있는 값인지 체크
    db.query('select * from User where u_id = ?', [id], function(err, result) {
        if (result.length && id != u_id) {
            res.send("<script>alert('이미 존재하는 아이디입니다!'); history.back();</script>");
        } else {
            //없는 값이라면 쿠키에 존재하는 아이디 값을 이용해서 유저의 정보 수정
            db.query(`update User set u_id = ?, u_pw = ?, u_name = ?, u_email = ? 
            where u_id = ?`, [id, pw, name, email, u_id], function(err, result) {
                //수정된 유저의 아이디와 패스워드를 쿠키에 새롭게 저장
                res.cookie('id', id);
                res.send("<script>alert('정보수정 성공!'); location.replace('/myPage');</script>");
            });
        }
    })
});
//카드관리
app.get('/card', (req, res) => {
    var html = ``;
    var u_id = cookie.parse(req.headers.cookie).id;
    //카드 테이블에서 현재 로그인 되어있는 유저의 카드가 있는지 확인
    db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
        //유저에게 카드가 없다면 기본정보, 카드가 있다면 카드 정보를 프론트에 뿌리기
        if (!result.length) {
            html += user.card("은행명입력", "카드번호입력", "CVC", "월", "년");
        } else {
            //유효기간을 양식에 맞게 년과 월로 나누기
            cmonth = parseInt(parseInt(result[0].c_valid) / 100);
            cyear = parseInt(result[0].c_valid) % 100;
            html += user.card(result[0].c_name, result[0].c_num, result[0].c_cvc, cmonth, cyear);
        }
        res.send(html);
    });
});
//카드 갱신과정 - 입력된 값에 대해 실행
app.post('/updateCard', (req, res) => {
    var u_id = cookie.parse(req.headers.cookie).id;
    //입력된 각 값을 필터링
    var c_num = sanitizeHtml(req.body.c_num);
    var c_name = sanitizeHtml(req.body.c_name);
    var c_cvc = sanitizeHtml(req.body.c_cvc);
    //유효기간을 테이블에 넣기 위해서 간단한 수정
    var cvalid = parseInt(sanitizeHtml(req.body.c_month)) * 100 + parseInt(sanitizeHtml(req.body.c_year));
    //카드 테이블에서 로그인된 유저의 카드가 있는지 탐색
    db.query('select * from Card where User_u_id = ?', [u_id], function(err, result) {
        if (!result.length) {
            //카드가 없다면 입력된 정보들을 통해서 카드 테이블에 카드를 추가
            db.query(`insert into Card(User_u_id, c_num, c_name, c_cvc, c_valid) 
                values(?, ?, ?, ?, ?)`, [u_id, c_num, c_name, c_cvc, cvalid], function(err2, result1) {
                if (cookie.parse(req.headers.cookie).p_id) {
                    res.send("<script>alert('카드등록이 완료됐습니다!'); location.replace('/searchPlace');</script>")
                } else {
                    res.send("<script>alert('카드등록이 완료됐습니다!'); history.back();</script>")
                }
            })
        } else {
            //카드가 있다면 입력된 정보를을 통해서 카드 테이블을 수정
            db.query(`update Card set c_num = ?, c_name = ?, c_cvc = ?, c_valid = ? 
                where User_u_id = ?`, [c_num, c_name, c_cvc, cvalid, u_id], function(err2, result1) {
                res.send("<script>alert('카드수정이 완료됐습니다!'); history.back();</script>")
            })
        }
    });
});
//사용기록 조회
app.get('/history', (req, res) => {
    var html = ``;
    var list = ``;
    var u_id = cookie.parse(req.headers.cookie).id;
    //History 테이블에서 해당 유저가 이용한 기록만 선택 후 프론트에 뿌리기
    db.query('select * from History where User_u_id = ?', [u_id], function(err, result) {
        for (var i = 0; i < result.length; i++) {
            //사용시간을 출력할때, 가독성이 좋은 시간으로 출력하기 위해서 저장된 시간을 날짜와 시간 문자열로 나누어 다시 합침
            var stime = result[i].s_time.toLocaleDateString() + ' ' + result[i].s_time.toLocaleTimeString();
            var etime = result[i].e_time.toLocaleDateString() + ' ' + result[i].e_time.toLocaleTimeString();
            list += `
            <input class="no" type="button" name="no" value=${i+1}>
            <input class="vid" type="button" name="vid" value=${result[i].Vehicle_id}>
            <input class="s_time" type="button" name="s_time" value="${stime}">
            <input class="e_time" type="button" name="e_time" value="${etime}">
            <input class="price" type="button" name="price" value=${result[i].h_price}>
            <br>
            `
        }
        html += user.history(list);
        res.send(html);
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//관리자 페이지 admin.js에서 모듈화하여 함수형식으로 사용
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
    //존재하는 모든 탈것들에 대해서 각 탈것이 존재하는 장소값을 함께 얻어오기 위해서 join을 이용
    db.query(`select v.v_id, v.v_state, v.v_type, p.p_name from Vehicles as v
        join Place as p on v.v_place = p.p_id`, function(err, vehicles) {
        //모든 탈것의 갯수만큼 돌면서 각 상태와 탈것의 종류를 변수로 설정한 후 프론트에 뿌리기
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
                type = "씽씽이";
            }
            list += `
                <label><input class="select" type="checkbox" name="id" value="${vehicles[i].v_id}" onclick="oneCheckbox(this)"></label>
                <input class="no" type="button" name="no" value="${vehicles[i].v_id}">
                <input class="type" type="button" name="type" value="${type}">
                <input class="place" type="button" name="place" value="${vehicles[i].p_name}">
                <input class="btn_${state}" type="button" name="${state}" value="${avail}">
                <br>
            `;
        }
        html += admin.vehicle(list);
        res.send(html);
    })
});
//탈것 관리 수행 - add와 delete, fix 각각의 기능 수행
app.post('/admin_manage_vehicle', (req, res) => {
    //넘어온 기능의 이름이 Add일때 addVehicle 페이지로 이동 이동하면서 모든 장소의 리스트를 옵션으로 넘겨줌
    if (req.body.name == 'Add') {
        var option = ``;
        db.query('select * from Place', function(err, places) {
            for (var i = 0; i < places.length; i++) {
                option += `
                    <option value="${places[i].p_id}">${places[i].p_name}</option>
                `
            }
            var html = admin.addVehicle(option);
            res.send(html);
        });
        //넘어온 기능의 이름이 Add가 아닐때는 선택된 탈것이 있어야하기에 넘어온 id값이 없다면 경고문을 띄운 후 되돌림
    } else if (!req.body.id) {
        res.send('<script>alert("탈것을 선택해주세요!"); history.back()</script>');
    } else {
        //해당 기능의 이름이 Fix일때
        if (req.body.name === 'Fix') {
            //선택된 탈것의 사용횟수를 초기화하고 상태를 가능으로 수정
            db.query('update VehicleCheck set v_state = 1, v_cnt = 0 where v_id = ?', [req.body.id], function(err, result) {
                res.send('<script>alert("수리되었습니다!"); location.replace("/admin_vehicle");</script>');
            });
        } else if (req.body.name === 'Delete') {
            //해당 기능의 이름이 Delete일때 선택된 탈것을 삭제
            db.query('delete from Vehicle where v_id = ?', [req.body.id], function(err, result) {
                res.send('<script>alert("삭제되었습니다!"); location.replace("/admin_vehicle");</script>');
            });
        } else {
            //해당 기능의 이름이 history일때
            var list = ``;
            //선택된 탈것의 기록을 History 테이블에서 가져오기
            db.query('select * from History where Vehicle_id = ?', [req.body.id], function(err, result) {
                if (!result.length) {
                    //기록이 없으면 없다고 출력 후 되돌아가기
                    res.send('<script>alert("사용기록이 존재하지 않습니다!"); history.back();</script>');
                } else {
                    //있으면 유저 아이디, 대여 시작시간, 끝나는 시간 그리고 끝나는 장소를 프론트로 뿌리기
                    for (var i = 0; i < result.length; i++) {
                        //탈퇴하거나 탈퇴 당한 회원일 경우 탈퇴한 회원으로 표시하게 하기
                        var u_id;
                        if (!result[i].User_u_id) {
                            u_id = "탈퇴한 회원";
                        } else {
                            u_id = result[i].User_u_id;
                        }
                        //시간을 가독성 좋게 표시하기 위해서 날짜와 시간으로 쪼개서 다시 합치기
                        var stime = result[i].s_time.toLocaleDateString() + ' ' + result[i].s_time.toLocaleTimeString();
                        var etime = result[i].e_time.toLocaleDateString() + ' ' + result[i].e_time.toLocaleTimeString();
                        list += `
                        <input class="uid" type="button" name="uid" value="${u_id}"style="height: 36px;">
                        <input class="s_time" type="button" name="s_time" value="${stime}">
                        <input class="e_time" type="button" name="e_time" value="${etime}">
                        <input class="e_place" type="button" name="e_place" value="${result[i].e_place}">
                        <br>
                        `;
                    }
                    res.send(admin.historyVehicle(req.body.id, list));
                }
            });
        }
    }

});
//탈것 추가 수행
app.post('/addVehicle', (req, res) => {
    //입력된 값을 필터링
    var v_id = sanitizeHtml(req.body.v_id);
    //만약 장소나 탈것의 종류가 선택되지 않았을때는 다시 되돌아가기
    if (!req.body.type || !req.body.place) {
        res.send("<script>alert('양식을 제대로 채워주세요!'); history.back();</script>");
    } else {
        //입력된 탈것의 아이디에 대해서 이미 존재하는 값인지 Vehicle에서 v_id로 검색
        db.query('select * from Vehicle where v_id = ?', [v_id], function(err, vehicle) {
            //이미 존재한다면 다시 되돌아가기
            if (vehicle.length) {
                res.send('<script>alert("이미 존재하는 식별번호 입니다!"); history.back();</script>');
                //존재하지 않는다면 해당하는 탈것을 추가하기 - 해당장소는 존재하는 장소의 리스트에서 받아왔기에 체크 불필요
            } else {
                db.query(`insert into Vehicle(v_id, v_type, v_place)
                    values(?, ?, ?)`, [v_id, req.body.type, req.body.place], function(err1, result) {
                    res.send("<script>alert('추가되었습니다!'); location.replace('/admin_vehicle');</script>");
                });
            }
        });
    }
});
//유저 관리 페이지
app.get('/admin_user', (req, res) => {
    var html = ``;
    var list = ``;
    //만들어둔 user_manage VIEW에서 카드번호를 포함해서 user에 대한 모든 값을 받아오기
    db.query('select * from user_manage', function(err, result) {
        for (var i = 0; i < result.length; i++) {
            //admin 유저 정보는 띄우지 않도록 설정
            if (result[i].u_name == 'admin') {
                continue;
            }
            //아직 카드를 등록하지 않은 경우 카드정보없음이라고 저장하기
            var cnum;
            if (!result[i].c_num) {
                cnum = "카드정보없음";
            } else {
                cnum = result[i].c_num;
            }
            //그 외 유저 정보는 list에 담아서 프론트로 뿌리기
            list += `
            <br>
            <input class="select" type="checkbox" name="id" value="${result[i].u_id}" onclick="oneCheckbox(this)">
            <input class="uid" type="button" name="uid" value=${result[i].u_id}>
            <input class="name" type="button" name="name" value=${result[i].u_name} style="height: 36px;">
            <input class="email" type="button" name="email" value=${result[i].u_email}>
            <input class="pwd" type="button" name="pwd" value=${result[i].u_pw}>
            <input class="card_num" type="button" name="card_num" value="${cnum}">
            `
        }
        html += admin.user(list);
        res.send(html);
    });
});
//유저 삭제 수행
app.post('/deleteUser', (req, res) => {
    //유저가 선택되지 않았다면 이전으로 돌아가도록 설정
    if (!req.body.id) {
        res.send('<script>alert("사용자를 선택해주세요!"); history.back()</script>');
    } else {
        //넘어온 id값을 이용해서 해당 유저를 삭제
        db.query('delete from User where u_id = ?', [req.body.id], function(err, result) {
            res.send('<script>alert("삭제되었습니다!"); location.replace("/admin_user")</script>');
        });
    }
});
//장소 목록 페이지
app.get('/admin_place', (req, res) => {
    var html = ``;
    var list = ``;
    //Place 테이블에서 모든 장소 가져온 후 프론트에 뿌리기
    db.query('select * from Place', function(err, places) {
        for (var i = 0; i < places.length; i++) {
            list += `
                <br>
                <label><input class="select" type="checkbox" name="id" value="${places[i].p_id}" onclick="oneCheckbox(this)"></label>   
                <input class="name" type="button" name="name" value="${places[i].p_name}">
                <input class="address" type="button" name="address" value="${places[i].p_address}">
            `;
        }
        html += admin.place(list);
        res.send(html);
    })
});
//장소 관리 수행 - 장소 추가와 장소 삭제 기능 구현
app.post('/admin_manage_place', (req, res) => {
    if (req.body.name == 'Add') {
        //선택된 기능이 Add 일때 placeAdd 페이지로 이동
        var html = admin.placeAdd();
        res.send(html);
    } else if (!req.body.id) {
        //delete를 선택했을때는 check된 장소가 없을때 다시 돌아가도록 설정
        res.send('<script>alert("장소를 선택해주세요!"); history.back()</script>');
    } else {
        //선택된 장소에 대해 삭제 수행하기 전에 장소에 기기가 남아있으면 다시 되돌아가기
        db.query('select * from Vehicle where v_place = ?', [req.body.id], function(err, vehicles) {
            if (vehicles.length) {
                res.send('<script>alert("장소에 아직 기기가 남아있습니다!"); history.back()</script>');
            } else {
                db.query('delete from Place where p_id = ?', [req.body.id], function(err, result) {
                    res.send('<script>alert("삭제되었습니다!"); location.replace("/admin_place");</script>');
                });
            }
        });
    }
});
//장소 추가 수행
app.post('/addPlace', (req, res) => {
    //입력된 정보에 대해서 필터링
    var name = sanitizeHtml(req.body.name);
    var address = sanitizeHtml(req.body.address);
    //Place 테이블에서 입력된 장소 이름에 해당하는 장소가 있는지 검색
    db.query('select * from Place where p_name = ?', [name], function(err, places) {
        if (places.length) {
            //장소가 있다면 다시 되돌아가기
            res.send('<script>alert("이미 존재하는 장소 입니다!"); history.back();</script>');
        } else {
            //장소가 없다면 Place 테이블에 장소 추가
            db.query('insert into Place(p_name, p_address) values(?, ?)', [name, address], function(err, result) {
                res.send('<script>alert("추가되었습니다!"); location.replace("/admin_place");</script>');
            });
        }
    });
});
//서버 연결
app.listen(3000, () => {
    console.log('Connection!');
});