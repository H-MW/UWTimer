////////////////////////////��`��///////////////////////////////////////////

//�E�N���b�N���j���[�̖�����
document.oncontextmenu = function () { return false; }

// HTML�̎擾
const timer = document.getElementById("timer");
const siren = document.getElementById("siren");
const bom = document.getElementById("bom");

//�L�[���͂�F��
document.addEventListener('keypress', keypress_ivent);

//�X�^�[�g���̂̎���
var startTime;

//�c�莞�Ԃ̌v�Z�ϐ�
var timeleft;

// ���ݎ����ƕ\���`�������킹�邽�߂� * 1000
var timeToCountDown = 0;

//�֐�countDown�p
var timerId;

//�J�E���g�_�E����Ԋm�F
var isRunning = stop;

//�ŏ��g�����ߐ�ɒ�`
let m;
let s;

//�T�C�����Ɣ��e���Đ����邽��
var sirenCount = 0;   //�o�O���


//�^�b�v�F���p
let touch = false;
let longtap = false;
var touchTimer;




//////////////////////////////����//////////////////////////////////////////

var timeSettingMin = prompt("Enter measurement time (min)","0")   //�_�C�A���O�ŕ������
//�o�O���
if (timeSettingMin >= 60) {
	alert("Error. Please reload!");
	timeSettingMin = 0;
} else if (timeSettingMin === null || timeSettingMin === "") {
	timeSettingMin = 0;
}

var timeSettingSec = prompt("Enter measurement time (sec)","0")   //�_�C�A���O�ŕb�����
//�o�O���
if (timeSettingSec >= 60) {
	alert("Error. Please reload!");
	timeSettingSec = 0;
} else if (timeSettingSec === null || timeSettingSec === "") {
	timeSettingSec = 0;
}

displayTimeSetting();




//////////////////////////////�֐�////////////////////////////////////////


//���͂�������b��\�����A�^�C�}�[��ݒ肷��
function displayTimeSetting() {

	//���Z�b�g
	timer.style.color = '';
	m = timeSettingMin;
	s = timeSettingSec;
	sirenCount = 0;
	siren.currentTime = 0;

	//01:01�Ȃǂ̕\�L�ɑΉ�����
	m = ('0' + m).slice(-2);
	s = ('0' + s).slice(-2);

	//�\������
	timer.textContent = m + ":" + s;
	document.title = m + ":" + s;
	
	//timeToCountDown�p�̌`���ɕς��đ��
	timeToCountDown = m * 60 * 1000 + s * 1000 + 999;
	timeleft = timeToCountDown;

	isRunning = stop;
}


//�~���b�𕪂ƕb�ɒ���
function updateTimer(milliSecond) {

	let d = new Date(milliSecond);
	let m = d.getMinutes(); // �����擾
	let s = d.getSeconds(); // �b���擾

	//01:01�Ȃǂ̕\�L�ɑΉ�����
	m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
	
	//�\������
	timer.textContent = m + ":" + s;
	document.title = m + ":" + s;
}


//�J�E���g�_�E��
function countDown() {

	//10�~���b��ɌJ��Ԃ����s����
	timerId = setTimeout(function () {


		// �c�莞�� = �J�E���g����鎞�� - (���ݎ��� - �X�^�[�g���̎���)
		timeleft = timeToCountDown - (Date.now() - startTime);


		//�c�莞�Ԃ�����0�ɂȂ������̏���
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

		//countDown��������x�Ăяo��
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




///////////////////////����ɂ�鏈��///////////////////////////////


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

			//TimeToCountDown�̍X�V
			timeToCountDown = timeleft;

			//�J�E���g���~�߂�
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



//�L�[�������ꂽ���̏���
function keypress_ivent(e) {

	//Space�L�[�������ꂽ���̏���(�X�^�[�g�X�g�b�v)
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

			//TimeToCountDown�̍X�V
			timeToCountDown = timeleft;

			//�J�E���g���~�߂�
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

	//Enter�L�[�������ꂽ���̏���(���Z�b�g)
	if (e.code === 'Enter') {

		if (isRunning === true) {
			return
		} else {
			displayTimeSetting();
		}
		
	}

	return false;
}