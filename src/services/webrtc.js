export default class WebRTC {
  constructor(
    myID,
    servers,
    myVideoElement,
    theirVideoElement,
    firebaseRTDB,
    roomID,
    setAlone
  ) {
    this.database = firebaseRTDB; // Signalling server // ??? here ???!!
    this.roomID = roomID; // here?!?

    this.myID = myID || Math.floor(Math.random() * 1000000000);
    this.servers = servers || {
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' },
        // {
        //   urls: 'turn:numb.viagenie.ca',
        //   credential: 'webrtc',
        //   username: 'websitebeaver@mail.com',
        // },
      ],
    };

    this.myVideo = myVideoElement;
    this.theirVideo = theirVideoElement;

    this.sendMessage = this.sendMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.initMedia = this.initMedia.bind(this);
    this.call = this.call.bind(this);

    this.pc = new RTCPeerConnection(this.servers);

    this.pc.onicecandidate = (event) => {
      console.log('ONICE');

      if (event.candidate) {
        this.sendMessage(this.myID, JSON.stringify({ ice: event.candidate }));
      } else {
        console.log('All ICE candidates have been sent.');
      }
    };

    this.pc.onaddstream = (event) => {
      console.log('ONADDSTREAM');

      this.theirVideo.srcObject = event.stream;
      this.setAlone(false);
    };

    this.pc.ontrack = (event) => {
      console.log('ONTRACK');

      [this.theirVideo.srcObject] = event.streams;
      setAlone(false);
    };

    this.database.subscribe(this.roomID, 'value', this.readMessage);
  }

  sendMessage(senderID, data) {
    console.log('SENDMSG');

    this.database.save(this.roomID, {
      sender: senderID,
      message: data,
    });
  }

  readMessage(data) {
    console.log('READMSG');

    const msg = JSON.parse(data.val().message);
    const { sender } = data.val();

    console.log('SENDER: ', sender);
    console.log('MYID: ', this.myID);

    if (sender !== this.myID) {
      if (msg.ice !== undefined) {
        console.log('RECEIVED ICE');

        this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === 'offer') {
        console.log('RECEIVED OFFER');

        this.pc
          .setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .then(() => this.pc.createAnswer())
          .then((answer) => this.pc.setLocalDescription(answer))
          .then(() =>
            this.sendMessage(
              this.myID,
              JSON.stringify({ sdp: this.pc.localDescription })
            )
          );
      } else if (msg.sdp.type === 'answer') {
        console.log('RECEIVED ANSWER');

        this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      }
    }
  }

  initMedia() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.myVideo.srcObject = stream;
        this.pc.addTrack(stream.getTracks()[0]);
      });
    //   .then((stream) => this.pc.addStream(stream));
  }

  call() {
    this.pc
      .createOffer()
      .then((offer) => this.pc.setLocalDescription(offer))
      .then(() =>
        this.sendMessage(
          this.myID,
          JSON.stringify({ sdp: this.pc.localDescription })
        )
      );
  }
}

// "Draft/inspiration" from https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo
/// //////////////////////////////////////////////////////////////////////////////

// const database = firebase.database().ref();

// const myVideo = document.getElementById('myVideo');
// const theirVideo = document.getElementById('theirVideo');

/// //////////////////////////////////////////////////////////////////////////////
