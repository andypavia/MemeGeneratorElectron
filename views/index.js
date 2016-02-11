const ipcRenderer = require('electron').ipcRenderer
var remote = require('remote')
var Menu = remote.require('menu')
var menu = Menu.buildFromTemplate([
    {
        label: 'Meme Generator'
        , submenu: [
            {
                label:'Refresh'
                , click: function() {
                    var remote = require('remote')
                    remote.getCurrentWindow().reload()
                }
            }
            , {
                label:'Developer Tools'
                , click: function() {
                    ipcRenderer.send('toggle-dev-tools')
                }
            }
            , {
                label:'Preferences'
                , click: function() {
                    ipcRenderer.send('show-prefs')
                }
            }
        ]
    }
])
Menu.setApplicationMenu(menu)


window.onload = function() {
    // executes when HTML-Document is loaded and DOM is ready
    initialize()
    bindEvents()
}
var canvas
    , ctx
    , img
var initialize = function() {
    $('.top.txt-box').draggable().resizable()
    $('.bottom.txt-box').draggable().resizable()
    canvas = document.getElementById('meme-canvas')
    ctx = canvas.getContext('2d')
} 
var bindEvents = function() {
    $('.new-meme').on('change', function(){
        //readFileViaInput(this)
        //readFile(this.files[0].path)
        readFileViaHttp(this.files[0].path)
    })
    $('.top.txt-box').focusout(function(){
       addMoveCursor('.top.txt-box')
    })
    $('.bottom.txt-box').focusout(function(){
        addMoveCursor('.bottom.txt-box')
    })
    $('.top.txt-box').click(function(){
        $('.top.txt-box textarea').select()
        removeMoveCursor('.top.txt-box')
    })
    $('.bottom.txt-box').click(function(){
        $('.bottom.txt-box textarea').select()
        removeMoveCursor('.bottom.txt-box')
    })
    $('.top.txt-box textarea').keyup(function(){
         adjustText($('.top.txt-box')) 
    })
    $('.bottom.txt-box textarea').keyup(function(){
        adjustText($('.bottom.txt-box')) 
    })
    $('.btn-download').click(function() {
        prepareCanvasForDownload()
    })
    $('.top.txt-box').resize(function(event){
        adjustText($('.top.txt-box')) 
    })
    $('.bottom.txt-box').resize(function(event){
        adjustText($('.bottom.txt-box')) 
    })
}
/*Helpers*/
var removeMoveCursor = function(selector) {
    $(selector + ' .meme-textcontrol-dragoverlay').addClass('hide')
} 
var addMoveCursor = function(selector) {
    $(selector +  ' .meme-textcontrol-dragoverlay').removeClass('hide')
}
var cleanSlate = function() {
    cleanCanvas(ctx, canvas)
    $('.top.txt-box').attr('style', 'left:12px; top:12px;')
    $('.bottom.txt-box').attr('style', 'left:12px; bottom:12px;')
}
var cleanCanvas = function(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height)
}
var translateTxtPosToCanvasPos = function(e){
    return {
        left: parseInt(e.position().left)
        , top: parseInt(e.position().top)  
    }
}
var adjustText = function(textbox) {
    var textarea = textbox.find('textarea')
        , height = parseInt(textbox.height())
        , width = parseInt(textbox.width())
        , chars = textarea.val().length
        , charSize = parseInt(textarea.css('font-size'))
    while(width * height < Math.pow(charSize, 2.1) * chars + 2 * width * charSize){
        charSize-=1
    }
    while(width * height > Math.pow(charSize, 2.1) * chars + width * charSize){
        charSize+=1
    }
    textarea.css('font-size', charSize)
    textbox.height(height)
    textbox.width(width)    
}
var prepareCanvasForDownload = function() {   
    //Creating shadow canvas and context
    var shadowCanvas = document.createElement('canvas')
    shadowCanvas.id = 'shadow-canvas'
    shadowCanvas.setAttribute('height', canvas.getAttribute('height'))
    shadowCanvas.setAttribute('width', canvas.getAttribute('width'))
    document.body.appendChild(shadowCanvas)
    var shadowCtx = shadowCanvas.getContext('2d');
    
    insertTextInCanvas(shadowCanvas, shadowCtx)
     
}
var insertTextInCanvas = function(shadowCanvas, shadowCtx) {
    //Styling top textbox and text area 
    var topTxtBox = $('.top.txt-box')
    var topTextarea =  $('.top.txt-box textarea')
    topTextarea.html(topTextarea.val())
    var topPosTopTxtBox = topTxtBox.css('top') === 'auto' ? '0px;' : topTxtBox.css('top')
    var stylingTopTextarea = 'font-size:' +  topTextarea.css('font-size') + ';'
    var stylingTopTxtBox = ' top:' + topPosTopTxtBox + '; left:' +  topTxtBox.css('left') + '; height:' +  topTxtBox.css('height') +'; width:' +  topTxtBox.css('width') +'; '
    //Styling bottom textbox and text area 
    var bottomTxtBox = $('.bottom.txt-box')
    var bottomTextarea = $('.bottom.txt-box textarea')
    bottomTextarea.html(bottomTextarea.val())
    var topPosBottomTxtBox = bottomTxtBox.css('top') === 'auto' ? (parseInt(canvas.getAttribute('height')) - parseInt(bottomTxtBox.css('height')) - 12) + 'px': bottomTxtBox.css('top')
    var stylingBottomTxtBox =  'top:' + topPosBottomTxtBox + '; left:' +  bottomTxtBox.css('left') + '; height:' +  bottomTxtBox.css('height') +'; width:' + bottomTxtBox.css('width') +'; '
    var stylingBottomTextarea = 'font-size:' +  bottomTextarea.css('font-size') + ';'
    //General styling   
    var stylingTxtBox = ' padding: 0px; margin:0px; background: transparent !important; color:white; text-transform:uppercase; cursor: move; position:absolute; border:none !important;'
    var stylingTextArea = "overflow: hidden; padding: 0px; margin:0px; font-family: Arial; font-weight: 700; text-align:center; border:none; width:100%; height:100%; vertical-align: top; text-transform: uppercase;webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box; background: transparent; color:white; outline:none; resize: none; text-shadow: 2px 2px 2px #000,-2px -2px 2px #000,2px -2px 2px #000,-2px 2px 2px #000,2px -2px 2px #000,2px 2px 2px #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px -2px 0 #000;"
    //DOM elements to be inserted into the canvas
    var data = '<svg xmlns="http://www.w3.org/2000/svg" crossOrigin="Anonymous" width="' + canvas.getAttribute('width') + '" height="' + canvas.getAttribute('height') + '">' +
           '<foreignObject width="100%" height="100%" style="position:relative; display:block;">' +
           '<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative; display:block;">' +
           '<div style="' + stylingTxtBox + stylingTopTxtBox + '">' +
               '<textarea style="' + stylingTextArea + stylingTopTextarea + '">'  + 
                topTextarea.val() +
                '</textarea>'  +
           '</div>' +
           '<div style="' + stylingTxtBox + stylingBottomTxtBox + '">' +
                '<textarea style="' + stylingTextArea +  stylingBottomTextarea + '">'  + 
                bottomTextarea.val() +
                '</textarea>'  +
           '</div>' +
           '</div>' +
           '</foreignObject>' +
           '</svg>';
    var DOMURL = window.URL || window.webkitURL || window;
    var textImg = new Image();
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    textImg.onload = function () {
        shadowCtx.drawImage(img, 0, 0);
        shadowCtx.drawImage(textImg, 0, 0);
        DOMURL.revokeObjectURL(url);
        
        //Just for testing purposes
        /*
        var canvasURL = shadowCanvas.toDataURL();
        var domImg = document.createElement('img')
        domImg.setAttribute('src', canvasURL)
        document.body.appendChild(domImg)
        */
        var canvasURL = shadowCanvas.toDataURL();
        writeFile(canvasURL)
    }
    textImg.setAttribute('crossOrigin', 'Anonymous');
    textImg.src = url
    //var canvasURL = shadowCanvas.toDataURL();
    //writeFile(canvasURL)  
}
var writeFile = function(data) {
    var path = require('path')
    var p = path.join(__dirname, '..', 'out.png')
    var base64Data = data.replace(/^data:image\/png;base64,/, "")
    var buff = new Buffer(base64Data, 'base64')
    var fs = require('fs')
    fs.writeFile(p, buff, 'base64', function(err,res) {
        if(err) console.log(err)
    });
}

var readFile = function(path) {
    var fs = require('fs')
    fs.readFile(path, function (err, contents) {
        if(err) console.log(err)    
        var blob = new Blob([contents], {'type': 'image/png'})
        addImageToCanvas(URL.createObjectURL(blob))
    })
 }
 
 var readFileViaHttp = function(path) {
      var http = new XMLHttpRequest();
      http.open('GET', path, true);
      http.responseType = 'arraybuffer';
      http.send();
      http.onreadystatechange = function() {
        console.log(http.readyState)
        if (http.readyState == 4) {
          var b64Response = arrayBufferToBase64(http.response)
          addImageToCanvas('data:image/png;base64,' + b64Response)
        }
      }
 }
 
var readFileViaInput = function(input){
    var file = input.files[0]
    var reader = new FileReader()
    reader.onload = function(e) {
       addImageToCanvas(reader.result)                   
    }
    reader.readAsDataURL(file)
 }
 
 var addImageToCanvas = function(file){
    img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.src = file
    localStorage.selectedImage = file
    cleanSlate()
    img.onload = function(e) {
        $('.top.txt-box').removeClass('hide')
        $('.bottom.txt-box').removeClass('hide')
        $('.bottom-controls').removeClass('hide')
        $('#meme-canvas').addClass('with-border')
        canvas.setAttribute('height', this.height)
        canvas.setAttribute('width', this.width)
        $('.img-wrapper').css({
            width: this.width 
            , height: this.height
        })
        ctx.drawImage(img, 0, 0)
    } 
 }
 
var arrayBufferToBase64 = function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};
