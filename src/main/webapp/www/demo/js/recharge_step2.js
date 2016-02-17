/**
 * Created by YYJ on 2016/2/8.
 */
console.log('section1:load');
define(function (require, exports, module) {
    console.log('section1:define');
    require('zepto');
    var tpl = require('../html/recharge_step2.html');
    var template = require('art-template');
    var input = require('input');
    var consts = require('consts');
    var template_render = template.compile(tpl);
    var init = function (data) {
        console.log('section1:init');
        var html = template_render(data || {});
        var $html = $(html);
        this.$html = $html;
        var $money = $html.find('#orderMoney');
        return this;
    };
    var render = function (data) {
        console.log('section1:show');
        return this.$html;
    };
    return {
        init: init,
        //beforeshow: beforeshow,
        render: render
    };
});