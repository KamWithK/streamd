
function aboutClick(){
    window.location.replace("http://127.0.0.1:5500/static/streaming.html");
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

