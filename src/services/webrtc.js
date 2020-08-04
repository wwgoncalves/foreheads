// TODO WebRTC logic here

/*
// "Draft/inspiration" from https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo
/////////////////////////////////////////////////////////////////////////////////

// Create an account on Firebase, and use the credentials they give you in place of the following
const config = {
  apiKey: 'AIzaSyCTw5HVSY8nZ7QpRp_gBOUyde_IPU9UfXU',
  authDomain: 'websitebeaver-de9a6.firebaseapp.com',
  databaseURL: 'https://websitebeaver-de9a6.firebaseio.com',
  storageBucket: 'websitebeaver-de9a6.appspot.com',
  messagingSenderId: '411433309494',
};
firebase.initializeApp(config);

const database = firebase.database().ref();
const yourVideo = document.getElementById('yourVideo');
const friendsVideo = document.getElementById('friendsVideo');
const yourId = Math.floor(Math.random() * 1000000000);
const servers = {
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'webrtc',
      username: 'websitebeaver@mail.com',
    },
  ],
};
const pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event) =>
  event.candidate
    ? sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
    : console.log('Sent All Ice');
pc.onaddstream = (event) => (friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
  const msg = database.push({ sender: senderId, message: data });
  msg.remove();
}

function readMessage(data) {
  const msg = JSON.parse(data.val().message);
  const { sender } = data.val();
  if (sender != yourId) {
    if (msg.ice != undefined) pc.addIceCandidate(new RTCIceCandidate(msg.ice));
    else if (msg.sdp.type == 'offer')
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(() =>
          sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }))
        );
    else if (msg.sdp.type == 'answer')
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  }
}

database.on('child_added', readMessage);

function showMyFace() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream))
    .then((stream) => pc.addStream(stream));
}

function showFriendsFace() {
  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .then(() =>
      sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }))
    );
}

/////////////////////////////////////////////////////////////////////////////////
*/
