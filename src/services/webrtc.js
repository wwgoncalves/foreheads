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
    this.setAlone = setAlone; // here??!

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

    this.constraints = { audio: true, video: true };

    this.sendMessage = this.sendMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.initMedia = this.initMedia.bind(this);
    this.onICECandidateHandler = this.onICECandidateHandler.bind(this);
    this.onTrackHandler = this.onTrackHandler.bind(this);

    // this.pc = new RTCPeerConnection(this.servers);
    this.pc = new RTCPeerConnection({});

    this.pc.onicecandidate = this.onICECandidateHandler;

    /// / this.pc.onaddstream = (event) => {
    /// /   console.log('ONADDSTREAM');

    /// /   this.theirVideo.srcObject = event.stream;
    /// /   this.setAlone(false);
    /// / };
    this.pc.ontrack = this.onTrackHandler;

    this.database.subscribe(this.roomID, 'child_added', this.readMessage);
  }

  sendMessage(senderID, data) {
    console.log('SENDMSG');

    this.database.save(this.roomID, {
      [`${new Date().getTime()}`]: {
        sender: senderID,
        message: data,
      },
    });
  }

  async readMessage(data) {
    console.log('READMSG: ', data.val());
    if (data.val() === null) return;

    // const content = data.val();
    // const timeKey = Object.keys(content)[0];
    // const msg = JSON.parse(content[timeKey].message);
    // const { sender } = content[timeKey];

    const msg = JSON.parse(data.val().message);
    const { sender } = data.val();

    console.log('SENDER: ', sender);
    console.log('MYID: ', this.myID);

    if (sender !== this.myID) {
      if (msg.ice !== undefined) {
        console.log('RECEIVED ICE');

        this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === 'offer') {
        console.log('RECEIVED OFFER, SEND ANSWER');

        try {
          await this.pc.setRemoteDescription(
            new RTCSessionDescription(msg.sdp)
          );

          const stream = await navigator.mediaDevices.getUserMedia(
            this.constraints
          );
          stream
            .getTracks()
            .forEach((track) => this.pc.addTrack(track, stream));
          await this.pc.setLocalDescription(await this.pc.createAnswer());

          this.sendMessage(
            this.myID,
            JSON.stringify({ sdp: this.pc.localDescription })
          );
        } catch (error) {
          console.error(error);
        }
      } else if (msg.sdp.type === 'answer') {
        console.log('RECEIVED ANSWER');

        this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      }
    }
  }

  async initMedia(isCaller) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        this.constraints
      );
      stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));

      this.myVideo.srcObject = stream;

      if (isCaller) {
        console.log('IS THE CALLER, SEND OFFER');

        await this.pc.setLocalDescription(await this.pc.createOffer());

        this.sendMessage(
          this.myID,
          JSON.stringify({ sdp: this.pc.localDescription })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  onICECandidateHandler(event) {
    console.log('ONICE');

    if (event.candidate) {
      this.sendMessage(this.myID, JSON.stringify({ ice: event.candidate }));
    } else {
      console.log('All ICE candidates have been sent.');
    }
  }

  onTrackHandler(event) {
    console.log('ONTRACK');

    if (this.theirVideo.srcObject) return;
    this.theirVideo.srcObject = event.streams[0];
    this.setAlone(false);
  }
}

// "Draft/inspiration" from https://websitebeaver.com/insanely-simple-webrtc-video-chat-using-firebase-with-codepen-demo
/// //////////////////////////////////////////////////////////////////////////////

// const database = firebase.database().ref();

// const myVideo = document.getElementById('myVideo');
// const theirVideo = document.getElementById('theirVideo');

/// //////////////////////////////////////////////////////////////////////////////
