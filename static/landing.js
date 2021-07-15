
function hostClick() {
    window.location.replace("streaming.html");
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

window.onload = function codeModal() {
    const aboutBtn = document.querySelector('#about');
    const aboutModal = document.querySelector('#aboutModal');
    const aboutModalBg = document.querySelector('#aboutModalBg');
    const joinBtn = document.querySelector('#join');
    const codeModalBg = document.querySelector('#codeModalBg');
    const codeModal = document.querySelector('#codeModal');

    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.add('is-active');
    })

    joinBtn.addEventListener('click', () => {
        codeModal.classList.add('is-active');
    })

    aboutModalBg.addEventListener('click', () => {
        aboutModal.classList.remove('is-active');
    })

    codeModalBg.addEventListener('click', () => {
        codeModal.classList.remove('is-active');
    })
};

