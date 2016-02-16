/**
 * Created by YYJ on 2016/2/8.
 */
console.log('section1:load');
define(function (require, exports, module) {
    console.log('section1:define');
    require('zepto');
    var tpl = require('../html/recharge.html');
    var template = require('art-template');
    var input = require('input');
    var consts = require('consts');
    var app = require('app');
    var template_render = template.compile(tpl);
    var init = function (data) {//初始化，生成html，绑定事件
        console.log('section1:init');
        var safecard = {
            "safeCard": {
                "id": "101",
                "payId": "3003",
                "bankName": "平安银行",
                "tailNumber": "1234",
                "quota": "5,000",
                "quota_daily": "500,000"
            }, "quota_acc": "1,000", "authflg": 1
        };
        _quota = safecard.quota_acc && Number(('' + safecard.quota_acc).replace(/,/, ""));
        var html = template_render(safecard || {});
        var $html = $(html);
        this.$html = $html;
        var $money = $html.find('#orderMoney');
        var $tip = $html.find('.js-input-tip');
        var $btn = $html.find('.js-bfbtn');
        var $password = $html.find('#pay_password');
        var $keyboard = $html.find('#softkeyboard');
        // 金额输入
        var moneyfn = function () {
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
        //下一步
        $btn.tap(function () {
            if ($(this).hasClass('disabled'))return;
            var mask = $('#mask');
            var actionsheet = $('#actionsheet');
            mask.show().one('tap', function () {
                mask.removeClass('bfui_fade_toggle');
                actionsheet.removeClass('bfui_actionsheet_toggle');
                actionsheet.on('transitionend', function () {
                    mask.hide();
                }).on('webkitTransitionEnd', function () {
                    mask.hide();
                });
            });
            setTimeout(function () {
                mask.addClass('bfui_fade_toggle')
            }, 1);
            actionsheet.addClass('bfui_actionsheet_toggle').off('transitionend webkitTransitionEnd');
        });
        //支付密码
        //var param = {el: $password, group: "", type: "passwordBox"};
        //input.onComponentInput(param);
        //input.onPasswordBoxInput($password);
        input.onBoxInput({$el:$password,length:20,mask:false});
        //软键盘
        $keyboard.find(".bfui_keyboard_key").not('.bfui_keyboard_key_backspace').each(function () {
            $(this).tap(function () {
                if ($password[0].nodeName == "INPUT") {
                    $password.val($password.val() + $(this).find('span').html()).trigger("input");
                } else {
                    $password.html($password.html() + $(this).find('span').html());
                }
            });
        });
        $keyboard.find(".bfui_keyboard_key_backspace").tap(function () {
            if ($password[0].nodeName == "INPUT") {
                var val = $password.val();
                $password.val(val.substring(0, val.length - 1)).trigger("input");
            } else {
                var val = $password.html();
                $password.html(val.substring(0, val.length - 1));
            }
        });

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