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
    var init = function (data) {//初始化，生成html，绑定事件
        console.log('section1:init');
        var html = template_render(data || {});
        var $html = $(html);
        this.$html = $html;
        var $money = $html.find('#orderMoney');
        var $tip = $html.find('.js-input-tip');
        var $btn = $html.find('.js-bfbtn');

        $btn.tap(function () {
            alert(1);
        });
        // 金额输入
        var moneyfn = function(){
            if ($money.val() > _quota) {//超限
                $tip.html(consts.MSG_QUOTA).show().removeClass("tipshake");
                $(this).removeClass("js-val");
                return false;
            } else {
                $tip.html('').hide();
                return true;
            }
        };
        var param = {el: $money, group: "#rechargeInit_section", type: "money", validate: moneyfn};
        input.onComponentInput(param);
        var button = {el: $btn, group: "#rechargeInit_section"};
        input.onButtonActive(button);
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