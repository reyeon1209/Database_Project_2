var stTime = new Date().getTime() // 현재시간 timestamp를 stTime에 저장
var timerStart = setInterval(function() {
    var nowTime = new Date().getTime() // 1ms당 한 번씩 현재시간 timestamp를 불러와서 nowTime에 저장
    var newTime = new Date(nowTime - stTime) // (nowTime - stTime)을 new Date()에
    var hour = newTime.getHours() - 9 // 9??
    var min = newTime.getMinutes()
    var sec = newTime.getSeconds()

    document.getElementById('post_hour').innerText = addZero(hour)
    document.getElementById('post_min').innerText = addZero(min)
    document.getElementById('post_sec').innerText = addZero(sec)
}, 1)

document.getElementById('end_rent').addEventListener('click', function() {
    if (timerStart) {
        clearInterval(timerStart)
    }
    document.getElementById('use').value =
        parseInt(document.getElementById('post_hour').innerText) * 60 * 60 +
        parseInt(document.getElementById('post_min').innerText) * 60 +
        parseInt(document.getElementById('post_sec').innerText);
});

function addZero(num) {
    return (num < 10 ? '0' + num : '' + num)
}