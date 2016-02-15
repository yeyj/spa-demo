/**
 * Created by YYJ on 2016/2/8.
 */
console.log('section2:load');
define(function(require, exports, module) {
    console.log('section2:define');
    var tpl = require('../html/section2.html');
    var init = function(){
        this.$html = $(tpl);
        console.log('section2:init');
    };
    var beforeshow = function(){
        console.log('section2:beforeshow');
    };
    var show = function(){
        console.log('section2:show');
    };
    var html = function () {
        return this.$html;
    };
    return {
        init: init,
        beforeshow: beforeshow,
        show: show,
        html: html
    };
});