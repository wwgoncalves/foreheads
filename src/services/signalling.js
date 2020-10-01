import firebase from '~/services/firebase';

export default class Signalling {
  constructor(channelId) {
    this.channelId = channelId;

    this.send = this.send.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  send(dataObject) {
    firebase.save(this.channelId, dataObject);
  }

  subscribe(handlerFunction) {
    firebase.subscribe(this.channelId, 'child_added', handlerFunction);
  }

  close() {
    firebase.removeKey(this.channelId);
  }
}
