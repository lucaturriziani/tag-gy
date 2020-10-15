function checkDirection(startNode, endNode){
  if(Number(startNode.id) > Number(endNode.id)){
    return [endNode,startNode];
  }
  return [startNode, endNode];
}

function getSafeRanges(dangerous) {
  let start = dangerous.anchorNode.parentNode;
  let end = dangerous.focusNode.parentNode;

  [start,end] = checkDirection(start, end);

  let sm = "";

  if(start.parentNode.nodeName === "MARK"){
    return [null, null];
  }

  const range = document.createRange();
  if(!start.isSameNode(end)){
    for(let sibling = start.nextSibling; sibling !== null && !sibling.isSameNode(end);sibling = sibling.nextSibling){
      sm += String(sibling.textContent) + " ";
      if(sibling.nodeName === "MARK"){
        return [null, null];
      }
    }
  }

  let stringSelect;
  if(start.isSameNode(end)){
    stringSelect = String(start.textContent);
  }else{
      stringSelect = String(start.textContent) + " " + sm + " " + String(end.textContent);
  }
  range.setStartBefore(start)
  range.setEndAfter(end)
  return [range, stringSelect];
}

function removeHighlight(){
  console.log(this);
  const parent = this.parentNode; 

  while(this.firstChild) parent.insertBefore(this.firstChild,this);

  parent.removeChild(this);
}

function highlightRange(range, tag) {
  const newNode = document.createElement('mark');
  newNode.setAttribute('style', 'background: rgb('+tag.color[0]+","+tag.color[1]+","+tag.color[2]+")");
  newNode.setAttribute('class', 'c0001');
  newNode.addEventListener('click', removeHighlight);
  range.surroundContents(newNode);
}

function highlightSelection(tag) {
  const userSelection = window.getSelection();
  const [safeRange, stringSelect] = getSafeRanges(userSelection);
  if(safeRange !== null){
    highlightRange(safeRange, tag)
  }
  window.getSelection().removeAllRanges();
  return stringSelect;
}

export { highlightSelection };
