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
                    window.location.reload()
                    console.log('reload')
                }
            }
            , {
                label:'Developer Tools'
                , click: function() {
                    //mainWindow.webContents.openDevTools();
                    ipcRenderer.send('toggle-dev-tools')
                    console.log('toggle dev tools')
                }
            }
            , {
                label:'Preferences'
                , click: function() {
                    ipcRenderer.send('show-prefs')
                    console.log('show preferences')
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
        var file = this.files[0]
        var reader = new FileReader()
        reader.onload = function(e) {
            img = new Image()
            img.src = reader.result
            localStorage.selectedImage = reader.result 
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
        reader.readAsDataURL(file)
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
    $('.top.txt-box').removeAttr("style")
    $('.bottom.txt-box').removeAttr("style")
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
    while(width * height < Math.pow(charSize, 2.05) * chars){
        charSize-=1
    }
    while(width * height > Math.pow(charSize, 2.05) * chars + width * charSize){
        charSize+=1
    }
    textarea.css('font-size', charSize)
    textbox.height(height)
    textbox.width(width)    
}
var prepareCanvasForDownload = function() {   
    var shadowCanvas = document.createElement('canvas')
    shadowCanvas.id = 'shadow-canvas'
    shadowCanvas.setAttribute('height', canvas.getAttribute('height'))
    shadowCanvas.setAttribute('width', canvas.getAttribute('width'))
    document.body.appendChild(shadowCanvas)
    var shadowCtx = shadowCanvas.getContext('2d');
    var bottomTxtBox = $('.bottom.txt-box')
    var topTxtBox = $('.top.txt-box')
    var topTextarea =  $('.top.txt-box textarea')
    var bottomTextarea = $('.bottom.txt-box textarea')
    topTextarea.html(topTextarea.val())
    bottomTextarea.html(bottomTextarea.val())
    var stylingBottomTxtBox = ' top:' +  bottomTxtBox.css('top') + '; left:' +  bottomTxtBox.css('left') + '; height:' +  bottomTxtBox.css('height') +'; width:' + bottomTxtBox.css('width') +'; ' + (bottomTxtBox.css('top') === 'auto' ? 'bottom:0px;' : '')
    var stylingTopTxtBox = ' top:' + (topTxtBox.css('top') === 'auto' ? '0px;' : topTxtBox.css('top')) + '; left:' +  topTxtBox.css('left') + '; height:' +  topTxtBox.css('height') +'; width:' +  topTxtBox.css('width') +'; '
    var stylingTxtBox = ' padding: 0px; margin:0px; background: transparent !important; color:white; font-weight: 500; text-transform:uppercase; cursor: move; position:absolute; border:none !important;'
    var stylingTopTextarea = 'font-size:' +  topTextarea.css('font-size') + ';'
    var stylingBottomTextarea = 'font-size:' +  bottomTextarea.css('font-size') + ';'
    var stylingTextArea = "overflow: hidden; padding: 0px; margin:0px; font-family: 'sans-serif';text-align:center; border:none; width:100%; height:100%; vertical-align: top; text-transform: uppercase;webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box; background: transparent; color:white; outline:none; resize: none; text-shadow: 2px 2px 2px #000,-2px -2px 2px #000,2px -2px 2px #000,-2px 2px 2px #000,2px -2px 2px #000,2px 2px 2px #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px -2px 0 #000;"
    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.getAttribute('width') + '" height="' + canvas.getAttribute('height') + '">' +
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
    }
    textImg.src = url
    //erase
    var url2 =shadowCanvas.toDataURL('image/jpg');
    
    //shadow button
    var btnWithDownload = document.createElement('a')
    btnWithDownload.id = "shadow-btn"
    document.body.appendChild(btnWithDownload)
    $('#shadow-btn').attr('download', 'your-new-meme.jpg')
    $('#shadow-btn').attr('herf', url) 
    $('#shadow-btn').html('download')
    $('#shadow-btn')[0].click()
}

 
