import {App} from '../components/App'

function checkDirection(startNode, endNode) {
  if (Number(startNode.id) > Number(endNode.id)) {
    return [endNode, startNode];
  }
  return [startNode, endNode];
}

function getSafeRanges(dangerous) {
  let start = dangerous.anchorNode.parentNode;
  let end = dangerous.focusNode.parentNode;

  [start, end] = checkDirection(start, end);

  let sm = "";

  if (start.parentNode.nodeName === "MARK") {
    return [null, null, null, null];
  }

  const range = document.createRange();
  if (!start.isSameNode(end)) {
    for (let sibling = start.nextSibling; sibling !== null && !sibling.isSameNode(end); sibling = sibling.nextSibling) {
      sm += String(sibling.textContent) + " ";
      if (sibling.nodeName === "MARK") {
        return [null, null, null, null];
      }
    }
  }

  let stringSelect;
  if (start.isSameNode(end)) {
    stringSelect = String(start.textContent);
  } else {
    stringSelect = String(start.textContent) + " " + sm + " " + String(end.textContent);
  }
  range.setStartBefore(start)
  range.setEndAfter(end)
  return [range, stringSelect, start.id, end.id];
}

function removeHighlight(node) {
  const parent = node.parentNode;

  while (node.firstChild) {
    if (node.firstChild.isSameNode(node.lastChild)) {
      break;
    }
    parent.insertBefore(node.firstChild, node);
  }

  parent.removeChild(node);
}

function onClickRemoveHighlight() {
  let index = window.$currentTag.findIndex( t => {
    let string = String(t.string).concat(String(t.tag.name)).replace(/\s/g,'');
    return string === this.textContent
  });
  if(index !== -1){
    window.$currentTag.splice(index,1)
    removeHighlight(this)
  }else{
    App.visualizeToast('error','Element not found','It\'s impossible to remove the tag, please reload the page');
  }
}

function removeAllHighlights() {
  window.$currentTag = [];
  const parent = document.querySelectorAll(".c0001");
  parent.forEach(node => {
    removeHighlight(node)
  });
}

function highlightAlredyInsert(tags) {
  tags.forEach(t => {
    const startNode = document.getElementById(t.startId);
    const endNode = document.getElementById(t.endId);
    let range = document.createRange()
    range.setStartBefore(startNode);
    range.setEndAfter(endNode);
    highlightRange(range, t.tag)
  });
}

function highlightRange(range, tag) {
  const newNode = document.createElement('mark');
  newNode.setAttribute('style', 'background: rgb(' + tag.color[0] + "," + tag.color[1] + "," + tag.color[2] + ")");
  newNode.setAttribute('class', 'c0001 c0005');
  newNode.addEventListener('click', onClickRemoveHighlight);
  range.surroundContents(newNode);
  const tagNode = document.createElement('span');
  tagNode.setAttribute('class', 'c0004');
  tagNode.textContent = tag.name;
  newNode.insertBefore(tagNode, range.endContainer.nextSibling);
}

function highlightSelection(tag) {
  const userSelection = window.getSelection();
  const [safeRange, stringSelect, startId, endId] = getSafeRanges(userSelection);
  if (safeRange !== null) {
    highlightRange(safeRange, tag)
    return [startId, endId, stringSelect];
  }
  window.getSelection().removeAllRanges();
  return [null, null, null]
}

export { highlightSelection, removeAllHighlights, highlightAlredyInsert };
