'use strict';

const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
hangupButton.disabled = true;
startButton.onclick = start;
hangupButton.onclick = hangup;

const hostVideo = document.querySelector('video#hostVideo');
const viewerVideo1 = document.querySelector('video#viewerVideo1');
const viewerVideo2 = document.querySelector('video#viewerVideo2');

let pc1Local;
let pc1Remote;
let pc2Local;
let pc2Remote;
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

function gotStream(stream) {
    console.log('Received local stream');
    hostVideo.srcObject = stream;
    window.localStream = stream;

    call();
}

function start() {
    console.log('Requesting local stream');
    startButton.disabled = true;
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    })
    .then(gotStream)
    .catch(e => console.log('getUserMedia() error: ', e));
}

async function call() {
    hangupButton.disabled = false;
    console.log('Starting calls');
    const audioTracks = window.localStream.getAudioTracks();
    const videoTracks = window.localStream.getVideoTracks();
    if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
    }
    // Create an RTCPeerConnection via the polyfill.
    const defaultConfiguration = null;
    pc1Local = new RTCPeerConnection(defaultConfiguration);
    pc1Remote = new RTCPeerConnection(defaultConfiguration);
    pc1Remote.ontrack = gotRemoteStream1;
    pc1Local.onicecandidate = iceCallback1Local;
    pc1Remote.onicecandidate = iceCallback1Remote;
    console.log('pc1: created local and remote peer connection objects');
    
    pc2Local = new RTCPeerConnection(defaultConfiguration);
    pc2Remote = new RTCPeerConnection(defaultConfiguration);
    pc2Remote.ontrack = gotRemoteStream2;
    pc2Local.onicecandidate = iceCallback2Local;
    pc2Remote.onicecandidate = iceCallback2Remote;
    console.log('pc2: created local and remote peer connection objects');

    window.localStream.getTracks().forEach(track => pc1Local.addTrack(track, window.localStream));
    console.log('Adding local stream to pc1Local');
    pc1Local
    .createOffer(offerOptions)
    .then(gotDescription1Local, onCreateSessionDescriptionError);

    window.localStream.getTracks().forEach(track => pc2Local.addTrack(track, window.localStream));
    console.log('Adding local stream to pc2Local');
    pc2Local.createOffer(offerOptions)
    .then(gotDescription2Local, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
}

function gotDescription1Local(desc) {
    pc1Local.setLocalDescription(desc);
    console.log(`Offer from pc1Local\n${desc.sdp}`);
    pc1Remote.setRemoteDescription(desc);
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError);
}

function gotDescription1Remote(desc) {
    pc1Remote.setLocalDescription(desc);
    console.log(`Answer from pc1Remote\n${desc.sdp}`);
    pc1Local.setRemoteDescription(desc);
}

function gotDescription2Local(desc) {
    pc2Local.setLocalDescription(desc);
    console.log(`Offer from pc2Local\n${desc.sdp}`);
    pc2Remote.setRemoteDescription(desc);
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc2Remote.createAnswer().then(gotDescription2Remote, onCreateSessionDescriptionError);
}

function gotDescription2Remote(desc) {
    pc2Remote.setLocalDescription(desc);
    console.log(`Answer from pc2Remote\n${desc.sdp}`);
    pc2Local.setRemoteDescription(desc);
}

function hangup() {
    console.log('Ending calls');
    pc1Local.close();
    pc1Remote.close();
    pc2Local.close();
    pc2Remote.close();
    pc1Local = pc1Remote = null;
    pc2Local = pc2Remote = null;
    hangupButton.disabled = true;
}

function gotRemoteStream1(e) {
    if (viewerVideo1.srcObject !== e.streams[0]) {
        viewerVideo1.srcObject = e.streams[0];
        console.log('pc1: received remote stream');
    }
}

function gotRemoteStream2(e) {
    if (viewerVideo2.srcObject !== e.streams[0]) {
        viewerVideo2.srcObject = e.streams[0];
        console.log('pc2: received remote stream');
    }
}

function iceCallback1Local(event) {
    handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
}

function iceCallback1Remote(event) {
    handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote');
}

function iceCallback2Local(event) {
    handleCandidate(event.candidate, pc2Remote, 'pc2: ', 'local');
}

function iceCallback2Remote(event) {
    handleCandidate(event.candidate, pc2Local, 'pc2: ', 'remote');
}

function handleCandidate(candidate, dest, prefix, type) {
    dest.addIceCandidate(candidate)
        .then(onAddIceCandidateSuccess, onAddIceCandidateError);
    console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
    console.log(`Failed to add ICE candidate: ${error.toString()}`);
}

function logoClick(){
    window.location.replace("index.html");
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

window.onload = function () {
    const aboutBtn = document.querySelector('#about');
    const aboutModal = document.querySelector('#aboutModal');
    const aboutModalBg = document.querySelector('#aboutModalBg');

    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.add('is-active');
    })

    aboutModalBg.addEventListener('click', () => {
        aboutModal.classList.remove('is-active');
    })
};
