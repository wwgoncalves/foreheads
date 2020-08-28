export default async function (elementRef) {
  const currentNode = elementRef.current;
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(currentNode);
  selection.removeAllRanges();
  selection.addRange(range);
  const selectedContent = selection.focusNode.innerText;
  try {
    await navigator.clipboard.writeText(selectedContent);
    console.log('COPIED TO CLIPBOARD!');
  } catch (error) {
    console.error(error);
  }
  selection.removeAllRanges();
}
