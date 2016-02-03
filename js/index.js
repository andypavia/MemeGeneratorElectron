window.onload = function() {
    // executes when HTML-Document is loaded and DOM is ready
    initialize()
    bindEvents()
}
var initialize = function() {
    $('.top.txt-box').draggable().resizable()
    $('.bottom.txt-box').draggable().resizable()
} 
var bindEvents = function() {
    $('.new-meme').on('change', function(){
        var file = this.files[0]
        var reader = new FileReader()
        reader.onload = function(e) {
            var img = new Image()
            img.src = reader.result
            localStorage.selectedImage = reader.result 
            cleanSlate()
            $('.img-wrapper').append(img)
            img.onload = function(e) {
                $('.img-wrapper').css({
                    width: this.width
                    , height: this.height
                })
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
    $('img').remove()
    $('.top.txt-box').removeAttr("style")
    $('.bottom.txt-box').removeAttr("style")
}

 
