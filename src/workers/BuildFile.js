function buildFile() {
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('message', (event) => {
    if (!event) return;

    const { data } = event;
    const { fileBuffer, fileType } = data;

    const fileBytes = fileBuffer.reduce((prev, current) => {
      const tmp = new Uint8Array(prev.byteLength + current.byteLength);
      tmp.set(prev, 0);
      tmp.set(current, prev.byteLength);
      return tmp;
    }, new Uint8Array());

    const fileBlob = new Blob([fileBytes], {
      type: fileType,
    });

    postMessage(fileBlob);
  });
}

export default class BuildFileWorker {
  constructor() {
    const worker = buildFile;
    const workerCode = worker.toString();
    const workerAsBlob = new Blob([`(${workerCode})()`]);
    return new Worker(URL.createObjectURL(workerAsBlob));
  }
}
