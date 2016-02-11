var remote = require('remote');
var shell = remote.require('shell');
var fs = require('fs');
var BrowserWindow = remote.require('browser-window');

var print_win = null;

$('#print-btn').on('click', function() {
    var width = $('#meme-canvas').width() + 50
    var height = $('#meme-canvas').height() + 100
    print_win = new BrowserWindow({
        'auto-hide-menu-bar':true
        , width: width
        , height: height
    })
    print_win.loadUrl('file://' + __dirname + '/printContent.html')
    print_win.show()
    print_win.webContents.on("did-finish-load", function() {
      print_win.print()  
    })
    print_win.on('closed', function() {
        print_win = null
    })
});

