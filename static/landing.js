
function aboutClick() {
    window.location.replace("http://127.0.0.1:5500/static/streaming.html");
}

function hostClick() {
    window.location.replace("http://127.0.0.1:5500/static/streaming.html");
}

// Returns 6 digit code entered by the user
function acceptClick() {
    var code = "";

    var keys = [
        "firstNo",
        "secondNo",
        "thirdNo",
        "fourthNo",
        "fifthNo",
        "sixthNo"
    ];

    for (const key of keys){
        code += document.getElementById(key).value;
    }
    return parseInt(code);
}

window.onload = function () {
    const joinBtn = document.querySelector('#join');
    const modalBg = document.querySelector('.modal-background');
    const modal = document.querySelector('.modal');

    joinBtn.addEventListener('click', () => {
        modal.classList.add('is-active');
    })

    modalBg.addEventListener('click', () => {
        modal.classList.remove('is-active');
    })
};

