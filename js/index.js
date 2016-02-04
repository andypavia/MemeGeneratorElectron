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
         //shrinkText($('.top.txt-box textarea')) 
    })
    $('.bottom.txt-box textarea').keyup(function(){
         //shrinkText($('.bottom.txt-box textarea')) 
    })
    $('.btn-download').click(function() {
        prepareCanvasForDownload()
    })
    $('.top.txt-box').resize(function(event){
      //add logic to resize fonts
    })
    $('.bottom.txt-box').resize(function(event){
      //add logic to resize fonts
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
/*
var createShadowCanvas = function() {
    var shadowCanvas = document.createElement('canvas')
    shadowCanvas.id = 'shadow-canvas'
    shadowCanvas.setAttribute('height', canvas.getAttribute('height'))
    shadowCanvas.setAttribute('width', canvas.getAttribute('width'))
    document.body.appendChild(shadowCanvas)
    var shadowCtx = shadowCanvas.getContext('2d')
    var t = $('.top.txt-box')
    var b = $('.bottom.txt-box')
    var tTxt = $('.top.txt-box textarea')
    var bTxt = $('.bottom.txt-box textarea')
    shadowCtx.drawImage(img, 0, 0)
    parseTextareaToWriteableLines(shadowCtx, tTxt, t)
    parseTextareaToWriteableLines(shadowCtx, bTxt, b)
    var url = document.getElementById('shadow-canvas').toDataURL()
    //cleanCanvas(shadowCtx, shadowCanvas)
    return url
}
var writeLine = function(context, text, fontSize, left, top, width) {
    context.textBaseline = 'top'
    context.font = 'bold ' + fontSize + ' sans-serif'
    context.shadowColor='black'
    context.lineWidth = 7;
    context.strokeText(text.toUpperCase(), left, top,width)
    context.shadowBlur = 0
    context.fillStyle = '#ffffff'
    context.fillText(text.toUpperCase(), left, top, width)
}
var parseTextareaToWriteableLines = function(context, textarea, txtbox){
    var pos = translateTxtPosToCanvasPos(txtbox)
    var topL = pos.top
        , leftL = pos.left
        , lines = textarea.val().replace(/\r\n/g, "\n").split("\n")
        , width = textarea.width()
    lines.forEach(function(line){
        topL += parseInt(textarea.css('font-size'))
        writeLine(context, line, textarea.css('font-size'), leftL, topL, width)
    })
}
*/
var shrinkText = function(textarea) {
    while(textarea[0].scrollHeight > textarea.height()){
        textarea.css('font-size', parseInt(textarea.css('font-size'))-1)
    }
}

var prepareCanvasForDownload = function() {   
    //var url = createShadowCanvas()
    //$('.btn-download').attr('href', url) 
    
    
    var shadowCanvas = document.createElement('canvas')
    shadowCanvas.id = 'shadow-canvas'
    shadowCanvas.setAttribute('height', canvas.getAttribute('height'))
    shadowCanvas.setAttribute('width', canvas.getAttribute('width'))
    document.body.appendChild(shadowCanvas)
    var shadowCtx = shadowCanvas.getContext('2d');
    $('.top.txt-box textarea').html($('.top.txt-box textarea').val())
    $('.bottom.txt-box textarea').html($('.bottom.txt-box textarea').val())
    var stylingBottomTxtBox = ' top:' +  $('.bottom.txt-box').css('top') + '; left:' +  $('.bottom.txt-box').css('left') + '; height:' +  $('.bottom.txt-box').css('height') +'; width:' +  $('.bottom.txt-box').css('width') +'; '
    var stylingTopTxtBox = ' top:' +  $('.top.txt-box').css('top') + '; left:' +  $('.top.txt-box').css('left') + '; height:' +  $('.top.txt-box').css('height') +'; width:' +  $('.top.txt-box').css('width') +'; '
    var stylingTxtBox = ' background: transparent !important; color:white; font-weight: 500; text-align: center; text-transform:uppercase; cursor: move; position:absolute; border:none !important;'
    var stylingTopTextarea = 'font-size:' +  $('.top.txt-box textarea').css('font-size') + ';'
    var stylingBottomTextarea = 'font-size:' +  $('.bottom.txt-box textarea').css('font-size') + ';'
    var stylingTextArea = ' text-align:center; border:none; width:100%; height:100%; vertical-align: top; text-transform: uppercase;webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box; background: transparent; color:white; outline:none; resize: none; text-shadow: 2px 2px 2px #000,-2px -2px 2px #000,2px -2px 2px #000,-2px 2px 2px #000,2px -2px 2px #000,2px 2px 2px #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px -2px 0 #000;'
    
    
    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.getAttribute('height') + '" height="' + canvas.getAttribute('width') + '">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml">' +
           '<div style="' + stylingTxtBox
           + stylingTopTxtBox + '">' +
               '<textarea style="' + stylingTextArea + stylingTopTextarea + '">'  + 
                $('.top.txt-box textarea').val() +
                '</textarea>'  +
           '</div>' +
           '<div style="' + stylingTxtBox
           + stylingBottomTxtBox + '">' +
                '<textarea style="' + stylingTextArea +  stylingBottomTextarea + '">'  + 
                $('.bottom.txt-box textarea').val() +
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

    textImg.src = url;
}
var getCss = function(el) {
    var style = window.getComputedStyle(el);
    return Object.keys(style).reduce(function(acc, k) {
        var name = style[k],
            value = style.getPropertyValue(name);
        if (value !== null) {
            acc[name] = value;
        }
        return acc;
    }, {});
};
 
