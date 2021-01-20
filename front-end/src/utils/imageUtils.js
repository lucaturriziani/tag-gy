import { App } from "../components/App";
import { urlMongo } from "../environments/environment";

var availTag = [];

// holds all our boxes
var boxes = [];

// 0  1  2
// 3     4
// 5  6  7
var selectionHandles = [];

// Hold canvas information
var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var INTERVAL = 1;  // how often, in milliseconds, we check to see if a redraw is needed

var isDrag = false;
var isResizeDrag = false;
var isNew = false;
var expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.
var mx, my; // mouse coordinates

var canvasValid = false;

// The node (if any) being selected.
var mySel = null;

// The new node
var newBox = null;

// The selection color and width. Right now we have a red selection with a small width
var mySelWidth = 7;
var mySelBoxSize = 18;

// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx; // fake canvas context

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;


let currentImg;

// Box object to hold data
function Box2() {
  this.x = 0;
  this.y = 0;
  this.w = 0;
  this.h = 0;
  this.label = null;
  this.fill = null;
}

Box2.prototype = {
  draw: function (context, optionalColor) {
    if (context === gctx) {
      context.strokeStyle = 'black';
    } else {
      context.strokeStyle = this.fill;
    }

    if (this.x > WIDTH || this.y > HEIGHT) return;
    if (this.x + this.w < 0 || this.y + this.h < 0) return;

    context.strokeRect(this.x, this.y, this.w, this.h);

    if(!isResizeDrag && newBox !== this){
      context.font = "18px Arial";
      context.fillStyle = this.fill;
      let txtX = this.x;
      let txtY = this.y;
      if (this.w < 0) txtX = this.x + this.w;
      if (this.h < 0) txtY = this.y + this.h;
      context.fillRect(txtX, txtY, context.measureText(this.label).width + 4, 22);
      context.fillStyle = "black";
      context.fillText(this.label, txtX + 2, txtY + 18);
    }

    // draw selection
    if (mySel === this) {
      context.strokeStyle = this.fill;
      context.strokeRect(this.x, this.y, this.w, this.h);

      // draw the boxes

      var half = mySelBoxSize / 2;

      // 0  1  2
      // 3     4
      // 5  6  7

      // top left, middle, right
      selectionHandles[0].x = this.x - half;
      selectionHandles[0].y = this.y - half;

      selectionHandles[1].x = this.x + this.w / 2 - half;
      selectionHandles[1].y = this.y - half;

      selectionHandles[2].x = this.x + this.w - half;
      selectionHandles[2].y = this.y - half;

      //middle left
      selectionHandles[3].x = this.x - half;
      selectionHandles[3].y = this.y + this.h / 2 - half;

      //middle right
      selectionHandles[4].x = this.x + this.w - half;
      selectionHandles[4].y = this.y + this.h / 2 - half;

      //bottom left, middle, right
      selectionHandles[6].x = this.x + this.w / 2 - half;
      selectionHandles[6].y = this.y + this.h - half;

      selectionHandles[5].x = this.x - half;
      selectionHandles[5].y = this.y + this.h - half;

      selectionHandles[7].x = this.x + this.w - half;
      selectionHandles[7].y = this.y + this.h - half;


      context.fillStyle = this.fill;
      for (var i = 0; i < 8; i++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }

  }
}

function addRect(x, y, w, h, label, fill) {
  var rect = new Box2();
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.label = label;
  rect.fill = fill;
  boxes.push(rect);
  invalidate();
}

function init2(firstImg, tags) {
  getRefCnvs();

  availTag = tags;
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () {
    return false;
  }

  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
    stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
    styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
  }

  setInterval(mainDraw, INTERVAL);

  for (var i = 0; i < 8; i++) {
    var rect = new Box2();
    selectionHandles.push(rect);
  }

  loadImage(firstImg)
}

function getRefCnvs() {
  canvas = document.getElementById("cnvs");
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');

  canvas.onmousedown = myDown;
  canvas.onmouseup = myUp;
  //canvas.ondblclick = myDblClick;
  canvas.onmousemove = myMove;

  ctx.lineWidth = mySelWidth;
}

function loadImage(image) {
  clear(ctx);
  boxes = [];
  currentImg = new Image();
  currentImg.src = urlMongo + "/img/file/" + image._id;
  currentImg.onload = function () {
    ctx.drawImage(currentImg, 0, 0, WIDTH, HEIGHT);
    image.spans.forEach(item => {
      let c = availTag.find(i => i.name === item.label);
      addRect(item.x, item.y, item.w, item.h, item.label, c.color);
    });
    invalidate();
  }
}

function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

// Main draw loop.
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function mainDraw() {
  if (canvasValid === false) {
    clear(ctx);

    var l = boxes.length;
    ctx.drawImage(currentImg, 0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < l; i++) {
      boxes[i].draw(ctx);
    }

    canvasValid = true;
  }
}

function myMove(e) {
  if (isDrag) {
    getMouse(e);

    mySel.x = mx - offsetx;
    mySel.y = my - offsety;

    invalidate();
  } else if (isResizeDrag) {
    let oldx = mySel.x;
    let oldy = mySel.y;

    switch (expectResize) {
      case 0:
        mySel.x = mx;
        mySel.y = my;
        mySel.w += oldx - mx;
        mySel.h += oldy - my;
        break;
      case 1:
        mySel.y = my;
        mySel.h += oldy - my;
        break;
      case 2:
        mySel.y = my;
        mySel.w = mx - oldx;
        mySel.h += oldy - my;
        break;
      case 3:
        mySel.x = mx;
        mySel.w += oldx - mx;
        break;
      case 4:
        mySel.w = mx - oldx;
        break;
      case 5:
        mySel.x = mx;
        mySel.w += oldx - mx;
        mySel.h = my - oldy;
        break;
      case 6:
        mySel.h = my - oldy;
        break;
      case 7:
        mySel.w = mx - oldx;
        mySel.h = my - oldy;
        break;
      default: break;
    }
    invalidate();
  } else if (isNew) {
    let oldx = newBox.x;
    let oldy = newBox.y;

    newBox.w = mx - oldx;
    newBox.h = my - oldy;
    invalidate()
  }

  getMouse(e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 8; i++) {

      var cur = selectionHandles[i];

      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
        my >= cur.y && my <= cur.y + mySelBoxSize) {

        expectResize = i;
        invalidate();

        switch (i) {
          case 0:
            this.style.cursor = 'nwse-resize';
            break;
          case 1:
            this.style.cursor = 'ns-resize';
            break;
          case 2:
            this.style.cursor = 'nesw-resize';
            break;
          case 3:
            this.style.cursor = 'ew-resize';
            break;
          case 4:
            this.style.cursor = 'ew-resize';
            break;
          case 5:
            this.style.cursor = 'nesw-resize';
            break;
          case 6:
            this.style.cursor = 'ns-resize';
            break;
          case 7:
            this.style.cursor = 'nwse-resize';
            break;
          default: break;
        }
        return;
      }

    }
    isResizeDrag = false;
    expectResize = -1;
  }
  if (!isResizeDrag) {
    if (hitBox()) this.style.cursor = "grab";
    else this.style.cursor = "crosshair";
  }
}

function hitBox() {
  if (isNew) return false;
  clear(gctx);
  var l = boxes.length;
  for (var i = l - 1; i >= 0; i--) {

    boxes[i].draw(gctx, 'black');

    var imageData = gctx.getImageData(mx, my, 1, 1);

    if (imageData.data[3] > 0) {
      clear(gctx)
      return true;
    }
  }
  return false;
}

function myDown(e) {
  getMouse(e);

  if (expectResize !== -1) {
    isResizeDrag = true;
    return;
  }

  clear(gctx);
  var l = boxes.length;
  for (var i = l - 1; i >= 0; i--) {

    boxes[i].draw(gctx, 'black');

    var imageData = gctx.getImageData(mx, my, 1, 1);

    if (imageData.data[3] > 0) {
      mySel = boxes[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;

      invalidate();
      clear(gctx);
      return;
    }

  }

  if (window.$selectedTag === null) {
    App.visualizeToast('error', 'No tag selected', 'Please select or insert a tag');
    return;
  }

  mySel = null;
  clear(gctx);
  invalidate();
  drawNew();
}

function myUp() {
  isDrag = false;
  isResizeDrag = false;
  isNew = false;
  expectResize = -1;
  newBox = null;
  if (boxes.length > 0) {
    if (boxes[boxes.length - 1].w === 0 || boxes[boxes.length - 1].h === 0) boxes.pop();
  }
  window.$currentTag = boxes;
  invalidate()
}

/*function myDblClick(e) {
  getMouse(e);
  // for this method width and height determine the starting X and Y, too.
  // so I left them as vars in case someone wanted to make them args for something and copy this code
  var width = 100;
  var height = 100;
  addRect(mx - (width / 2), my - (height / 2), width, height, colorRandom());
}*/

function drawNew() {
  addRect(mx, my, 0, 0, window.$selectedTag.name, window.$selectedTag.color);
  newBox = boxes[boxes.length - 1];
  isNew = true;
}


function invalidate() {
  canvasValid = false;
}

function getMouse(e) {
  var element = canvas, offsetX = 0, offsetY = 0;

  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  offsetX += stylePaddingLeft;
  offsetY += stylePaddingTop;

  offsetX += styleBorderLeft;
  offsetY += styleBorderTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
}

function deleteSelected() {
  const index = boxes.indexOf(mySel);
  if (index !== -1) {
    boxes.splice(index, 1);
    invalidate();
  }
}

function deleteAll() {
  console.log(window.$currentTag);
  boxes = window.$currentTag = [];
  console.log(window.$currentTag);
  invalidate();
}

export { init2, loadImage, getRefCnvs, deleteSelected, deleteAll };
