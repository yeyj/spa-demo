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
        var $vcode = $html.find("#vcode");
        var $keyboard = $html.find('#softkeyboard');
        var mask = $html.find('#mask');
        var actionsheet = $html.find('#actionsheet');
        var btn_as_back = $html.find(".js_bfui_btn_back");

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
            mask.show();/*.one('tap', function () {
                hide_as();
            });*/
            setTimeout(function () {
                mask.addClass('bfui_fade_toggle');
            }, 1);
            actionsheet.addClass('bfui_actionsheet_toggle').off('transitionend webkitTransitionEnd');
        });

        btn_as_back.tap(function(){
            hide_as();
        });
        var hide_as = function(){
            mask.removeClass('bfui_fade_toggle');
            actionsheet.removeClass('bfui_actionsheet_toggle');
            actionsheet.on('transitionend', function () {
                mask.hide();
            }).on('webkitTransitionEnd', function () {
                mask.hide();
            });
        };
        //软键盘
        var softkeyboard = (function () {
            var $el;
            $keyboard.find(".bfui_keyboard_key").not('.bfui_keyboard_key_backspace').each(function () {
                $(this).tap(function () {
                    $el.val($el.val() + $(this).find('span').html()).trigger("input");
                });
            });
            $keyboard.find(".bfui_keyboard_key_backspace").tap(function () {
                var val = $el.val();
                $el.val(val.substring(0, val.length - 1)).trigger("input");
            });
            return {
                bind: function (_$el) {
                    $el = _$el;
                }
            };
        })();
        //支付密码
        input.onBoxInput({$el:$password});
        input.onBoxInput({$el:$vcode,mask:false});
        $password.on('input:success', function () {
            $(".bfui_authentication").removeClass('bfui_step1').addClass('bfui_step2');
            softkeyboard.bind($vcode);
        });
        softkeyboard.bind($password);

        $vcode.on('input:success', function () {
            app.goto('recharge_step2');
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