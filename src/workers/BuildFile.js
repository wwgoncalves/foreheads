function buildFile() {
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('message', (event) => {
    if (!event) return;

    const { data } = event;
    const { fileBuffer, fileType } = data;

    const fileBlob = new Blob(fileBuffer, {
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
