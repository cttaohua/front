!function(window, undefined) {

    if(document.documentElement.currentStyle) {
		var user_webset_font = document.documentElement.currentStyle['fontSize'];
	}else {
		var user_webset_font = getComputedStyle(document.documentElement,false)['fontSize'];
    }

    var xs = parseFloat(user_webset_font) / 14;

	var response = window.response || {};

    response._size = function(){
        var width = document.documentElement.clientWidth ? document.documentElement.clientWidth : 750;
        if(width>750) {
           width = 750;
        }
        var ratio = ( width / 375 ) * 100;
        var result_font = ratio/xs;
            document.getElementsByTagName('html')[0].style.fontSize = result_font + "px";
            document.getElementsByTagName('html')[0].setAttribute("base", width);
    };

    response._resize = function(){
        if(window.addEventListener) {
            window.addEventListener('resize', response._size, false);
        }else if(window.attachEvent) {
            window.attachEvent('resize', response._size);
        }
    };

    response._size();
    response._resize();

}(window);
