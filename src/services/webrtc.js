import Signalling from '~/services/signalling';

export default class WebRTC {
  constructor(stream, options) {
    this.init = this.init.bind(this);
    this.sendSignal = this.sendSignal.bind(this);
    this.readSignal = this.readSignal.bind(this);
    this.onICECandidateHandler = this.onICECandidateHandler.bind(this);
    this.onTrackHandler = this.onTrackHandler.bind(this);
    this.onDataChannelHandler = this.onDataChannelHandler.bind(this);
    this.onDataChannelMessageHandler = this.onDataChannelMessageHandler.bind(
      this
    );
    this.sendMessage = this.sendMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.buildFile = this.buildFile.bind(this);
    this.muteTrack = this.muteTrack.bind(this);
    this.unmuteTrack = this.unmuteTrack.bind(this);
    this.endPeerConnection = this.endPeerConnection.bind(this);

    this.stream = stream;
    this.myId = Math.floor(Math.random() * 1000000000);
    this.signallingChannel = new Signalling(options.networkId);

    this.onLocalMedia = options.onLocalMedia;
    this.onRemoteMedia = options.onRemoteMedia;
    this.onMessage = options.onMessage;
    this.onFileTransfer = options.onFileTransfer;
    this.onFileReady = options.onFileReady;

    this.servers = {
      iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    }; // (!) no turn server configured

    this.pc = new RTCPeerConnection(this.servers);

    this.messageDataChannel = this.pc.createDataChannel('messageDataChannel');

    this.fileDataChannel = this.pc.createDataChannel('fileDataChannel');
    this.fileDataChannel.binaryType = 'arraybuffer';
    this.fileBuffer = [];
    this.fileInfo = {};
    this.fileInfo.fileState = 'waiting'; // 'waiting' OR 'receiving'

    this.pc.onicecandidate = this.onICECandidateHandler;
    this.pc.ontrack = this.onTrackHandler;

    this.pc.ondatachannel = this.onDataChannelHandler;

    this.signallingChannel.subscribe(this.readSignal);
  }

  static async build(options) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        options.mediaConstraints
      );

      return new WebRTC(stream, options);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async init(isCaller) {
    try {
      this.stream.getTracks().forEach((track) => {
        this.pc.addTrack(track, this.stream);
      });

      this.onLocalMedia(this.stream);

      if (isCaller) {
        await this.pc.setLocalDescription(await this.pc.createOffer());
        this.sendSignal(JSON.stringify({ sdp: this.pc.localDescription }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  sendSignal(data) {
    const dataObject = {
      [`${new Date().getTime()}`]: {
        sender: this.myId,
        information: data,
      },
    };

    this.signallingChannel.send(dataObject);
  }

  async readSignal(data) {
    if (data.val() === null) return;
    const msg = JSON.parse(data.val().information);
    const { sender } = data.val();

    if (sender !== this.myId) {
      if (msg.ice !== undefined) {
        this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === 'offer') {
        try {
          await this.pc.setRemoteDescription(msg.sdp);
          await this.pc.setLocalDescription(await this.pc.createAnswer());
          this.sendSignal(JSON.stringify({ sdp: this.pc.localDescription }));
        } catch (error) {
          console.error(error);
        }
      } else if (msg.sdp.type === 'answer') {
        this.pc.setRemoteDescription(msg.sdp);
      }
    }
  }

  onICECandidateHandler(event) {
    if (event.candidate) {
      this.sendSignal(JSON.stringify({ ice: event.candidate }));
    }
  }

  onTrackHandler(event) {
    this.onRemoteMedia(event.streams[0]);
  }

  onDataChannelHandler(event) {
    const receiving = event.channel;
    receiving.onmessage = this.onDataChannelMessageHandler;
  }

  onDataChannelMessageHandler(event) {
    const dataChannelLabel = event.target.label;

    switch (dataChannelLabel) {
      case 'messageDataChannel':
        this.readMessage(event.data);
        break;
      case 'fileDataChannel':
        this.readFile(event.data);
        break;
      default:
        console.error({ error: 'Data channel unknown.' });
    }
  }

  sendMessage(data) {
    this.messageDataChannel.send(
      JSON.stringify({ ...data, sender: this.myId })
    );
  }

  readMessage(data) {
    if (typeof data === 'string') {
      this.onMessage(JSON.parse(data));
    }
  }

  sendFile(fileData) {
    const { fileName, fileType, fileSize, fileArrayBuffer } = fileData;
    const maxChunkSize = 16000; // 16kB due to current browsers interoperability issues

    this.fileDataChannel.send(JSON.stringify({ fileName, fileType, fileSize }));

    for (let bytesSent = 0; bytesSent < fileSize; bytesSent += maxChunkSize) {
      const bytesToBeSent = Math.min(bytesSent + maxChunkSize, fileSize);

      this.fileDataChannel.send(
        new Uint8Array(fileArrayBuffer.slice(bytesSent, bytesToBeSent))
      );
    }
  }

  readFile(data) {
    const { fileState } = this.fileInfo;

    if (
      typeof data === 'string' &&
      fileState === 'waiting' &&
      this.fileBuffer.length === 0
    ) {
      this.fileInfo = JSON.parse(data);
      if (this.fileInfo.fileSize > 0) {
        this.fileInfo.fileState = 'receiving';
        this.fileInfo.bytesReceived = 0;
        this.onFileTransfer(this.fileInfo);
      } else {
        this.fileInfo = {};
        this.fileInfo.fileState = 'waiting';
      }
    } else if (data instanceof ArrayBuffer && fileState === 'receiving') {
      this.fileBuffer.push(new Uint8Array(data));

      this.fileInfo.bytesReceived += data.byteLength;

      if (this.fileInfo.bytesReceived === this.fileInfo.fileSize) {
        this.buildFile();
      }
    } else {
      console.error('DC READ FILE ERROR');
    }
  }

  buildFile() {
    const fileBytes = this.fileBuffer.reduce((prev, current) => {
      const tmp = new Uint8Array(prev.byteLength + current.byteLength);
      tmp.set(prev, 0);
      tmp.set(current, prev.byteLength);
      return tmp;
    }, new Uint8Array());

    const fileBlob = new Blob([fileBytes], {
      type: this.fileInfo.fileType,
    });

    this.onFileReady(this.fileInfo, fileBlob);

    this.fileBuffer = [];
    this.fileInfo = {};
    this.fileInfo.fileState = 'waiting';
  }

  async muteTrack(kind) {
    this.stream.getTracks().forEach((track) => {
      if (track.kind === kind) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
    });
  }

  async unmuteTrack(kind) {
    this.stream.getTracks().forEach((track) => {
      if (track.kind === kind) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = true;
      }
    });
  }

  endPeerConnection() {
    this.messageDataChannel.close();
    this.fileDataChannel.close();

    this.pc.close();

    this.stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
