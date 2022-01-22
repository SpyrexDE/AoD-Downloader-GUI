const { spawn } = require("child_process");
const app = require('electron').remote.app;

const appPath = app.getAppPath();


//COMPONENTS

[].forEach.call(document.querySelectorAll('.mdc-text-field'), function(el) {
    mdc.textField.MDCTextField.attachTo(el);
});
const helperText = new mdc.textField.MDCTextFieldHelperText(document.querySelector('.mdc-text-field-helper-text'));
const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

const menu = new mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));

[].forEach.call(document.querySelectorAll('.mdc-switch'), function(el) {
    new mdc.switchControl.MDCSwitch.attachTo(el);
});

[].forEach.call(document.querySelectorAll('.mdc-button'), function(el) {
  mdc.ripple.MDCRipple.attachTo(el);
});

const pb = new mdc.linearProgress.MDCLinearProgress(document.querySelector('.mdc-linear-progress'));

var contentEls = document.querySelectorAll('.content');

tabBar.listen('MDCTabBar:activated', function(event) {
  // Hide currently-active content
  document.querySelector('.content--active').classList.remove('content--active');
  // Show content for newly-activated tab
  contentEls[event.detail.index].classList.add('content--active');
});

//DOWNLOADER


const ffmpegPath = appPath + "\\ffmpeg\\ffmpeg.exe";
const downloaderPath = appPath + "\\AoDDownloader\\__main__.exe";

var password = '';

function loginBtnClick(btn) {
    btn.disabled = true;

    let i1 = document.getElementById("usernameInput").value;
    let i2 = document.getElementById("passwordInput").value;

    if (i1 == '' || i2 == '') {
        document.getElementById("resultLabel").innerHTML = "Please fill in all fields";
        btn.disabled = false;
    }
    password = i2;

    let proc = spawn(downloaderPath, ["login", "--no-keyring", i1, i2]);
    proc.stdout.setEncoding('utf8');

    proc.stdout.on('data', function(data) {
    
        document.getElementById("resultLabel").innerHTML = data.toString('utf8');

    });

    proc.stdout.on('close', function(code) {
    
        btn.disabled = false;

    });

}


function downloadBtnClick(btn) {
    btn.disabled = true;
    document.getElementById("urlInput").disabled = true;

    let i1 = document.getElementById("urlInput").value;

    if (!i1) {
        document.getElementById("resultLabel3").innerHTML = "Please fill in all fields";
        allowAll()
        return;
    } else if (!password) {
        document.getElementById("resultLabel3").innerHTML = "Please login first";
        allowAll()
        return;
    }

    let proc3 = spawn(downloaderPath, ["download", i1, password, "--no-buffer-output"]);
    proc3.stdout.setEncoding('utf8');


    proc3.stdout.on('data', function(data) {
        console.log(data);
        if(data.includes('/')){
            pb.progress = data.split('/')[0] / data.split('/')[1];
            allowAll()
        }
        if(data.includes('Already')){
            document.getElementById("resultLabel3").innerHTML = "File already exists";
            allowAll()
        }
        if(data.includes('Converting')){
            document.getElementById("resultLabel3").innerHTML = "Converting...";
            allowAll()
        }
        if(data.includes('finished')){
            document.getElementById("resultLabel3").innerHTML = "Successfully downloaded!";
            allowAll()
        }
        if(data.includes('Error')){
            document.getElementById("resultLabel3").innerHTML = data.toString('utf8');
            allowAll()
        }
    });

    function allowAll() {
        btn.disabled = false;
        document.getElementById("urlInput").disabled = false;
    }

}





menu.listen('MDCMenu:selected', (e) => {
    alert(`Selected option at index ${e.detail.index}"`);
});





let i = 0.0;

function cl() {
    i  += 0.01
    pb.progress = i;
}
