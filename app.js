var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var user = require('./users/user');

var db = mysql.createConnection({
    host: 'ourdatabaseproject.cnfauaikje6z.us-east-2.rds.amazonaws.com',
    user: 'admin',
    database: 'PJ',
    password: '03170317',
    port: 3306
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('users'));
app.get('/', (req, res) => {
    res.redirect('/signIn');
});
app.get('/signIn', (req, res) => {
    var html = user.signIn();
    res.send(html)
});
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
            message = "<script>alert('로그인 성공!'); location.replace('/main');</script>";
        }
        res.send(message);
    });
});
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
})

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
})

app.get('/vList', (req, res) => {
    var list = ``;
    var html = ``;
    db.query('select * from Vehicle where v_place = ? and v_cnt <= 10 order by v_type', [req.query.p_id], function(err, result) {
        for (i = 0; i < result.length; i++) {
            if (result[i].v_type == 1) {
                list += `
                <br>
                <input class="no" type="button" name="no" value=${result[i].v_id}>
                <input class="type" type="button" name="type" value="따릉이">
                <label><input class="select" type="checkbox" name="v_id" value=${result[i].v_id}></label>
                `;
            } else {
                list += `
                <br>
                <input class="no" type="button" name="no" value=${result[i].v_id}>
                <input class="type" type="button" name="type" value="킥보드">
                <label><input class="select" type="checkbox" name="v_id" value=${result[i].v_id}></label>
                `;
            };
        }

        html += user.vList(list);
        res.send(html);
    })
});

app.listen(3000, () => {
    console.log('Connection!');
});