////////////////////////////定義等///////////////////////////////////////////

//右クリックメニューの無効化
document.oncontextmenu = function () { return false; }

// HTMLの取得
const timer = document.getElementById("timer");
const siren = document.getElementById("siren");
const bom = document.getElementById("bom");

//キー入力を認識
document.addEventListener('keypress', keypress_ivent);

//スタート時のの時刻
var startTime;

//残り時間の計算変数
var timeleft;

// 現在時刻と表示形式を合わせるために * 1000
var timeToCountDown = 0;

//関数countDown用
var timerId;

//カウントダウン状態確認
var isRunning = stop;

//最初使うため先に定義
let m;
let s;

//サイレンと爆弾を再生するため
var sirenCount = 0;   //バグ回避


//タップ認識用
let touch = false;
let longtap = false;
var touchTimer;




//////////////////////////////処理//////////////////////////////////////////

var timeSettingMin = prompt("Enter measurement time (min)","0")   //ダイアログで分を入力
//バグ回避
if (timeSettingMin >= 60) {
	alert("Error. Please reload!");
	timeSettingMin = 0;
} else if (timeSettingMin === null || timeSettingMin === "") {
	timeSettingMin = 0;
}

var timeSettingSec = prompt("Enter measurement time (sec)","0")   //ダイアログで秒を入力
//バグ回避
if (timeSettingSec >= 60) {
	alert("Error. Please reload!");
	timeSettingSec = 0;
} else if (timeSettingSec === null || timeSettingSec === "") {
	timeSettingSec = 0;
}

displayTimeSetting();




//////////////////////////////関数////////////////////////////////////////


//入力した分や秒を表示し、タイマーを設定する
function displayTimeSetting() {

	//リセット
	timer.style.color = '';
	m = timeSettingMin;
	s = timeSettingSec;
	sirenCount = 0;
	siren.currentTime = 0;

	//01:01などの表記に対応する
	m = ('0' + m).slice(-2);
	s = ('0' + s).slice(-2);

	//表示する
	timer.textContent = m + ":" + s;
	document.title = m + ":" + s;
	
	//timeToCountDown用の形式に変えて代入
	timeToCountDown = m * 60 * 1000 + s * 1000 + 999;
	timeleft = timeToCountDown;

	isRunning = stop;
}


//ミリ秒を分と秒に直す
function updateTimer(milliSecond) {

	let d = new Date(milliSecond);
	let m = d.getMinutes(); // 分を取得
	let s = d.getSeconds(); // 秒を取得

	//01:01などの表記に対応する
	m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
	
	//表示する
	timer.textContent = m + ":" + s;
	document.title = m + ":" + s;
}


//カウントダウン
function countDown() {

	//10ミリ秒後に繰り返し実行する
	timerId = setTimeout(function () {


		// 残り時間 = カウントされる時間 - (現在時刻 - スタート時の時間)
		timeleft = timeToCountDown - (Date.now() - startTime);


		//残り時間が実質0になった時の処理
		if (timeleft < 1000) {

			if (timeSettingMin == 0 && timeSettingSec <= 10) {
				
			} else {

				bom.play();

			}

			isRunning = false;
			clearTimeout(timerId);
			timeleft = 0
			updateTimer(timeleft);

			return;
		}

		//countDownをもう一度呼び出す
		updateTimer(timeleft);
		countDown();

	}, 10);

	if (sirenCount === 0 && timeleft < 11000) {

		if (timeSettingMin == 0 && timeSettingSec <= 10) {
			return
		} else {

			sirenCount = 1

			timer.style.color = "red";

			siren.play();

		}

	}

}




///////////////////////操作による処理///////////////////////////////


timer.addEventListener("touchstart", () => {

	touch = true;
	longtap = false;

	 touchTimer = setTimeout(() => {

		 if (touch === true) {

			 longtap = true;

			if (isRunning === true) {
				return
			} else {
				displayTimeSetting();
			}

		 } else {
			 return
		 }

	 }, 1000);

})

timer.addEventListener("touchend", () => {

	if (longtap === false) {

		clearTimeout(touchTimer);
		touch = false;

		if (isRunning == stop) {
			isRunning = true;

			startTime = Date.now();

			if (sirenCount === 1 && timeleft < 11000) {
				siren.play();
			} else {
				timer.style.color = "springgreen";
			}

			countDown();
		} else if (isRunning == true) {
			isRunning = stop;

			//TimeToCountDownの更新
			timeToCountDown = timeleft;

			//カウントを止める
			clearTimeout(timerId);

			if (sirenCount === 1 && timeleft < 11000) {
				siren.pause();
			} else {
				timer.style.color = "green";
			}

		} else if (isRunning == false) {
			displayTimeSetting();
		}

	} else {
		touch = false;
		longtap = false;
	}

})



//キーを押された時の処理
function keypress_ivent(e) {

	//Spaceキーが押された時の処理(スタートストップ)
	if (e.code === 'Space') {

		if (isRunning == stop) {
			isRunning = true;

			startTime = Date.now();

			if (sirenCount === 1 && timeleft < 11000) {
				siren.play();
			} else {
			timer.style.color = "springgreen";
			}

			countDown();
		} else if (isRunning == true) {
			isRunning = stop;

			//TimeToCountDownの更新
			timeToCountDown = timeleft;

			//カウントを止める
			clearTimeout(timerId);
			if (sirenCount === 1 && timeleft < 11000) {
				siren.pause();
			} else {
				timer.style.color = "green";
			}

		} else if (isRunning == false) {
			displayTimeSetting();
		}

	}

	//Enterキーが押された時の処理(リセット)
	if (e.code === 'Enter') {

		if (isRunning === true) {
			return
		} else {
			displayTimeSetting();
		}
		
	}

	return false;
}