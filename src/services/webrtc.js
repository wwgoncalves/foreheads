import Signalling from '~/services/signalling';

export default class WebRTC {
  constructor(stream, myVideoElement, theirVideoElement, roomId, setAlone) {
    this.signallingChannel = new Signalling(roomId);
    this.setAlone = setAlone; // here??!

    this.myId = Math.floor(Math.random() * 1000000000);
    this.servers = {
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    };

    this.myVideo = myVideoElement;
    this.theirVideo = theirVideoElement;

    this.init = this.init.bind(this);

    this.sendSignal = this.sendSignal.bind(this);
    this.readSignal = this.readSignal.bind(this);

    this.onICECandidateHandler = this.onICECandidateHandler.bind(this);
    this.onTrackHandler = this.onTrackHandler.bind(this);
    this.onICEConnectionStateChangeHandler = this.onICEConnectionStateChangeHandler.bind(
      this
    );
    this.onConnectionStateChangeHandler = this.onConnectionStateChangeHandler.bind(
      this
    );

    this.onDataChannelHandler = this.onDataChannelHandler.bind(this);
    this.onDataChannelMessageHandler = this.onDataChannelMessageHandler.bind(
      this
    );
    this.onDataChannelStateChangeHandler = this.onDataChannelStateChangeHandler.bind(
      this
    );

    this.sendMessage = this.sendMessage.bind(this);
    // this.readMessage = this.readMessage.bind(this);

    // this.sendFile = this.sendFile.bind(this);
    // this.readFile = this.readFile.bind(this);

    this.muteTrack = this.muteTrack.bind(this);
    this.unmuteTrack = this.unmuteTrack.bind(this);
    this.endPeerConnection = this.endPeerConnection.bind(this);

    this.stream = stream;
    this.pc = new RTCPeerConnection(this.servers);

    this.messageDataChannel = this.pc.createDataChannel('messageDataChannel');
    this.fileDataChannel = this.pc.createDataChannel('fileDataChannel');

    this.pc.onicecandidate = this.onICECandidateHandler;
    this.pc.ontrack = this.onTrackHandler;
    this.pc.oniceconnectionstatechange = this.onICEConnectionStateChangeHandler;
    this.pc.onconnectionstatechange = this.onConnectionStateChangeHandler;

    this.pc.ondatachannel = this.onDataChannelHandler;

    this.signallingChannel.subscribe(this.readSignal);
  }

  static async build(myVideoElement, theirVideoElement, roomId, setAlone) {
    const constraints = {
      audio: true,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('STREAM: ', stream);
      console.log('TRACKS: ', stream.getTracks());

      return new WebRTC(
        stream,
        myVideoElement,
        theirVideoElement,
        roomId,
        setAlone
      );
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async init(isCaller) {
    try {
      this.stream.getTracks().forEach((track) => {
        if (track.kind === 'video') {
          console.log('VIDEO SOURCE LABEL: ', track.label);
          console.log('VIDEO WIDTH MAX: ', track.getCapabilities().width.max);
          console.log('VIDEO HEIGHT MAX: ', track.getCapabilities().height.max);
        }

        this.pc.addTrack(track, this.stream);
      });

      this.myVideo.srcObject = this.stream;

      if (isCaller) {
        console.log('IS THE CALLER, SEND OFFER');

        await this.pc.setLocalDescription(await this.pc.createOffer());

        this.sendSignal(JSON.stringify({ sdp: this.pc.localDescription }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  sendSignal(data) {
    console.log('SENDSIG');

    const dataObject = {
      [`${new Date().getTime()}`]: {
        sender: this.myId,
        information: data,
      },
    };

    this.signallingChannel.send(dataObject);
  }

  async readSignal(data) {
    console.log('READSIG: ', data.val());
    if (data.val() === null) return;

    const msg = JSON.parse(data.val().information);
    const { sender } = data.val();

    console.log('SENDER: ', sender);
    console.log('MYID: ', this.myId);

    if (sender !== this.myId) {
      if (msg.ice !== undefined) {
        console.log('RECEIVED ICE');

        this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === 'offer') {
        console.log('RECEIVED OFFER, SEND ANSWER');

        try {
          await this.pc.setRemoteDescription(msg.sdp);

          // this.stream.getTracks().forEach((track) => {
          //   this.pc.addTrack(track, this.stream);
          // });

          await this.pc.setLocalDescription(await this.pc.createAnswer());

          this.sendSignal(JSON.stringify({ sdp: this.pc.localDescription }));
        } catch (error) {
          console.error(error);
        }
      } else if (msg.sdp.type === 'answer') {
        console.log('RECEIVED ANSWER');

        this.pc.setRemoteDescription(msg.sdp);
      }
    }
  }

  onICECandidateHandler(event) {
    console.log('ONICE');

    if (event.candidate) {
      this.sendSignal(JSON.stringify({ ice: event.candidate }));
    } else {
      console.log('All ICE candidates have been sent.');
    }
  }

  onTrackHandler(event) {
    console.log('ONTRACK');
    console.log('REMOTE STREAMS: ', event.streams);

    if (this.theirVideo.srcObject) return;
    [this.theirVideo.srcObject] = event.streams;
    this.setAlone(false);
  }

  onICEConnectionStateChangeHandler() {
    console.log('ICE CONNECTION STATE CHANGE: ', this.pc.iceConnectionState);
  }

  onConnectionStateChangeHandler() {
    console.log('CONNECTION STATE CHANGE: ', this.pc.connectionState);
  }

  onDataChannelHandler(event) {
    const receiving = event.channel;
    console.log('RECEIVING DC: ', receiving.label);
    receiving.onmessage = this.onDataChannelMessageHandler;
    receiving.onopen = this.onDataChannelStateChangeHandler;
    receiving.onclose = this.onDataChannelStateChangeHandler;
  }

  onDataChannelMessageHandler(event) {
    console.log('DC MESSAGE: ', event.target);
    const data = JSON.parse(event.data);

    console.log('DC MESSAGE DATA: ', JSON.stringify(data));

    const dataChannelLabel = event.target.label;
    switch (dataChannelLabel) {
      case 'messageDataChannel':
        this.readMessage(event.data);
        break;
      default:
        console.log('TBD');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onDataChannelStateChangeHandler(event) {
    console.log('DC STATE CHANGE: ', event);
  }

  sendMessage(data) {
    console.log('DC SEND MESSAGE: ', data);
    this.messageDataChannel.send(
      JSON.stringify({ ...data, sender: this.myId })
    );
  }

  readMessage(data) {
    console.log('DC READ MESSAGE: ', data);
  }

  // sendFile() {}
  // readFile() {}

  async muteTrack(kind) {
    this.stream.getTracks().forEach((track) => {
      if (track.kind === kind) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
        console.log(kind, 'MUTED');
      }
    });
  }

  async unmuteTrack(kind) {
    this.stream.getTracks().forEach((track) => {
      if (track.kind === kind) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = true;
        console.log(kind, 'UNMUTED');
      }
    });
  }

  endPeerConnection() {
    this.pc.close();
    console.log('PEERCONNECTION CLOSED');
    this.stream.getTracks().forEach((track) => {
      track.stop();
    });
    console.log('ALL TRACKS STOPPED');
  }
}
