/**
 * type:money|authCode|graphAuthCode|mobile|idCard|password|passwordBox|cardNo|text|checkBox
 * input.onComponentInput({el: $(".js-mobile-input"), group: "1", type: "mobile", needClear: true});
 * input.onButtonActive({el: $(".js-sun-next"), group: "1"});
 *
 * input.init();
 * */
(function (root, factory) {
    if (typeof define === 'function' && define.cmd) {
        define('input', ['zepto'], function (require, exports, module) {
            return factory(root, {}, $);
        });
    } else {
        root.input = factory(root, {}, root.jQuery || root.Zepto);
    }
})(this, function (root, Input, $) {
        Input.VERSION = '0.0.1';
        var commonJs = {
            //验证是否是数字
            isNumber: /^[0-9]+$/,
            //验证是否是字符串
            isString: /^[a-zA-Z]+$/,
            //验证是否是中文
            isZw: /[\u4E00-\u9FA5]/,
            isAllZw: /^[\u4E00-\u9FA5]+$/,
            //验证是否是两位小数
            isFloatTwo: /^\d+\.?\d{0,2}$/,
            //验证是否是金额
            isMoney: /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/,
            //验证是否是6位数字验证码
            isAuthCode: /^\d{6}$/,
            //验证是否是4位图片验证码
            isGraphAuthCode: /^\d{4}$/,
            //验证空格、换行、回车
            isRNS: /(\r|\n|\s)/,
            //手机号
            isMobile: /^\d{11}$/,
            //验证身份证
            isIDcard: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))$/,
            //特殊字符
            isSpecial: /^[^a-zA-Z0-9]+$/,
            showError: function (msg) {
                J.showToast(msg, 'error');
            }
        };
        Input.inputClear = (function () {
            var template = '<div class="clear icon-cross"></div>';
            var showClear = function ($target) {
                if ($target.next(".clear").size() == 0) {
                    //$target.after(cancel);
                    //$target.offsetParent().append(cancel);
                    //$target.wrap('<div class="wrap_input"></div>');
                    $target.after(cancel);
                    //cancel.offset({left:$target.position().left+$target.width()-cancel.width(),top:$target.position().top+$target.height()/2-cancel.height()/2});
                }
            };
            var hideClear = function ($target) {
                $target.next(".clear").remove();
            };
            var clear = function () {
                console.debug("inputClear:clear");
                $(this).prev().val('').trigger("input");
            };
            var cancel = $(template).tap(clear);
            return function ($el) {
                //input.on("clear:show",function(){showClear($(this));});
                //input.on("clear:hide",function(){hideClear($(this));});
                $el.on("input focus", function () {
                    console.debug("inputClear:" + event.type);
                    if ($(this).val() == "") {
                        $(this).val("");
                        hideClear($(this));
                    } else {
                        if ($(this).is(":focus") || event.type == "focus") {
                            showClear($(this));
                        } else {
                            hideClear($(this));
                        }
                    }
                }).blur(function () {
                    console.debug("inputClear:" + event.type);
                    hideClear($(this));
                });
            };
        })();
        Input.onMoneyInput = function ($el, validate) {
            if (!$el)return;
            $el = $($el);
            $el.prop("type", "text");
            $el.focus(function () {
                this.type = "number";
            });
            $el.blur(function () {
                this.type = "text";
            });
            $el.on("input", function () {
                console.debug("onMoneyInput:" + event.type);
                var val = $(this).val();
                if (val.length > 10) {
                    $(this).val(val.substring(0, 10));
                    val = $(this).val();
                }
                if (val == "0.00") {
                    $(this).val("0.0");
                    val = $(this).val();
                }
                if (/^0{2}|^0[1-9]/.test(val)) {
                    $(this).val(val.substring(0, val.length - 1));
                    val = $(this).val();
                }
                if (!commonJs.isFloatTwo.test(val)) {
                    $(this).val(val.substring(0, val.indexOf(".") + 3));
                    val = $(this).val();
                }

                if ((!validate || (validate && validate.apply(this))) && commonJs.isMoney.test(val) && Number(val) != 0) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            }).blur(function () {
                console.debug("onMoneyInput:" + event.type);
                var val = $(this).val();
                if (/\.$/.test(val)) {
                    $(this).val(val.replace(/^(\d+)\.$/, "$1"));
                    val = $(this).val();
                }
                if ((!validate || (validate && validate.apply(this))) && commonJs.isMoney.test(val) && Number(val) != 0) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onAuthCodeInput = function ($el) {
            if (!$el)return;
            $el = $($el);
            $el.prop("type", "text");
            $el.focus(function () {
                this.type = "number";
            });
            $el.blur(function () {
                this.type = "text";
            });
            $el.on("input", function () {
                console.debug("onAuthCodeInput:" + event.type);
                var val = $(this).val();
                if (/\./.test(val)) {
                    $(this).val(val.replace(/\./, ""));
                    val = $(this).val();
                }
                if (val.length > 6) {
                    $(this).val(val.substring(0, 6));
                    val = $(this).val();
                }
                if (commonJs.isAuthCode.test(val)) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onGraphAuthCodeInput = function ($el) {
            if (!$el)return;
            $el = $($el);
            $el.on("input", function () {
                console.debug("onGraphAuthCodeInput:" + event.type);
                var val = $(this).val();
                if (/\./.test(val)) {
                    $(this).val(val.replace(/\./, ""));
                    val = $(this).val();
                }
                if (val.length > 4) {
                    $(this).val(val.substring(0, 4));
                    val = $(this).val();
                }
                if (commonJs.isGraphAuthCode.test(val)) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onIdCardInput = function ($el) {
            if (!$el)return;
            $el = $($el);
            $el.prop("maxlength", 18);
            $el.on("input", function () {
                console.debug("onIdCardInput:" + event.type);
                this.value = this.value.toUpperCase();
                var val = $(this).val();
                if (val.length > 18) {
                    $(this).val(val.substring(0, 18));
                }
                if (commonJs.isIDcard.test(val) && !commonJs.isRNS.test(val)) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onMobileInput = function ($el) {
            if (!$el)return;
            $el = $($el);
            $el.prop("type", "text");
            $el.focus(function () {
                this.type = "number";
            });
            $el.blur(function () {
                this.type = "text";
            });
            $el.on("input", function () {
                console.debug("onMobileInput:" + event.type);
                var val = $(this).val();
                if (/\./.test(val)) {
                    $(this).val(val.replace(/\./, ""));
                    val = $(this).val();
                }
                if (val.length > 11) {
                    $(this).val(val.substring(0, 11));
                    val = $(this).val();
                }
                if (commonJs.isMobile.test(val)) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onCardNoInput = function ($el, validate) {
            if (!$el)return;
            $el = $($el);
            $el.prop("type", "text");
            $el.focus(function () {
                this.type = "number";
            });
            $el.blur(function () {
                this.type = "text";
            });
            $el.on("input", function () {
                console.debug("onCardNoInput:" + event.type);
                var val = $(this).val();
                if (/\./.test(val)) {
                    $(this).val(val.replace(/\./, ""));
                    val = $(this).val();
                }
                /*var i = this.selectionStart;
                 console.log(i);
                 if(i%5==0)i=i+1;
                 console.log(i);
                 $(this).val(val.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));
                 $(this).textFocus(i);*/
                if (val.length > 32) {
                    $(this).val(val.substring(0, 32));
                    val = $(this).val();
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onCheckBoxChange = function ($el, validate) {
            if (!$el)return;
            $el = $($el);
            $el.change(function () {
                console.debug("onCheckBoxChange:" + event.type);
                if ($(this).data('checkbox') == 'checked') {
                    $(this).addClass("js-val");
                } else if ($(this).data('checkbox') == 'unchecked') {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            }).trigger("change");
        };
        Input.onTextInput = function ($el) {
            if (!$el)return;
            $el.on("input", function () {
                console.debug("onCardNoInput:" + event.type);
                if ($(this).val() == '') {
                    $(this).removeClass("js-val");
                } else {
                    $(this).addClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onPasswordInput = function ($el) {
            if (!$el)return;
            $el = $($el);
            $el.on("input", function () {
                console.debug("onPasswordInput:" + event.type);
                var val = $(this).val();
                if (val.length > 20) {
                    $(this).val(val.substring(0, 20));
                }
                if (val.length >= 6) {
                    $(this).addClass("js-val");
                } else {
                    $(this).removeClass("js-val");
                }
                $(this).trigger("input:step2");
            });
        };
        Input.onPasswordBoxInput = function ($el) {
            if (!$el)return;
            $el.on("input", function () {
                console.debug("onPasswordBoxInput:" + event.type);
                var val = $(this).val();
                var cnt = val.length;
                if (val == "") {
                    $(this).val("");
                }
                if (cnt > 6) {
                    $(this).val(val.substring(0, 6));
                    val = $(this).val();
                    cnt = val.length;
                }
                if (val == '' || cnt != 6) {
                    $(this).removeClass("js-val");
                } else {
                    $(this).addClass("js-val");
                }
                $(this).next().find('li').each(function (i) {
                    if (i < cnt) {
                        $(this).addClass("dot");
                    } else {
                        $(this).removeClass("dot");
                    }
                });
                $(this).trigger("input:step2");
            }).after('<ul class="bfui_input_box passwordbg1"><li></li><li></li><li></li><li></li><li></li><li></li></ul>');
        };
        Input.onBoxInput = function (options) {
            var _opt = {length:6,mask:true};
            $.extend(_opt,options);
            var $el = _opt.$el, length = _opt.length, mask = _opt.mask;
            if (!$el)return;
            $el.on("input", function () {
                console.debug("onPasswordBoxInput:" + event.type);
                var val = $(this).val();
                var cnt = val.length;
                if (val == "") {
                    $(this).val("");
                }
                if (cnt > length) {
                    $(this).val(val.substring(0, length));
                    val = $(this).val();
                    cnt = val.length;
                }
                if (val == '' || cnt != length) {
                    $(this).removeClass("js-val");
                } else {
                    $(this).addClass("js-val");
                }
                $(this).next().find('li').each(function (i) {
                    if (mask) {
                        if (i < cnt) {
                            $(this).addClass("dot");
                        } else {
                            $(this).removeClass("dot");
                        }
                    } else {
                        $(this).html('<span>'+val.substring(i,i+1)+'</span>');
                    }
                });
                $(this).trigger("input:step2");
            });//.after('<ul class="bfui_input_box"><li></li><li></li><li></li><li></li><li></li><li></li></ul>');
            var $box = $('<ul class="bfui_input_box"></ul>');
            for(var i=0;i<length;i++){
                $box.append('<li></li>');
            }
            $el.after($box);
        };;
        var INPUT_TYPE_FN = {
            'money': Input.onMoneyInput,
            'authCode': Input.onAuthCodeInput,
            'graphAuthCode': Input.onGraphAuthCodeInput,
            'mobile': Input.onMobileInput,
            'idCard': Input.onIdCardInput,
            'password': Input.onPasswordInput,
            'passwordBox': Input.onPasswordBoxInput,
            'cardNo': Input.onCardNoInput,
            'text': Input.onTextInput,
            'checkBox': Input.onCheckBoxChange
        };
        var SELECTOR = {
            'money': '[data-money]',
            'authcode': '[data-authcode]',
            'authcodegraph': '[data-authcodegraph]',
            'idcard': '[data-idcard]',
            'mobile': '[data-mobile]',
            'cardno': '[data-cardno]',
            'checkbox': '[data-checkbox]',
            'text': '[data-text]',
            'password': '[data-password]',
            'passwordbox': '[data-passwordbox]',
        };
        var _inputs = {};
        var _addInput = function (el, group) {
            group || (group = "default");
            (_inputs[group] || (_inputs[group] = new Array())) && (_inputs[group].push(el));
            /*var has = false;
             $.each(_inputs[group],function(i,e){
             if(e.selector == el.selector){
             has = true;
             }
             });
             if(!has) {
             _inputs[group].push(el);
             }*/
        };
        var _isAllOk = function (group) {
            group || (group = "default");
            if (!_inputs[group])return false;
            var len = _inputs[group].length;
            var okLen = 0;
            $.each(_inputs[group], function (i, input) {
                if (input.hasClass("js-val"))okLen++;
            });
            return len == okLen;
        };
        var _getInputByGroup = function (group) {
            group || (group = "default");
            return _inputs[group] || [];
        };
        var _getMatchElements = function ($el, selector) {
            return $el.find(selector).add($el.filter(selector));
        };
        Input.init = function (selector) {
            var $el = $(selector || 'body');
            if ($el.length == 0)return;
            $.map(_getMatchElements($el, SELECTOR.money), Input.onMoneyInput);
            $.map(_getMatchElements($el, SELECTOR.authcode), Input.onAuthCodeInput);
            $.map(_getMatchElements($el, SELECTOR.authcodegraph), Input.onGraphAuthCodeInput);
            $.map(_getMatchElements($el, SELECTOR.idcard), Input.onIdCardInput);
            $.map(_getMatchElements($el, SELECTOR.mobile), Input.onMobileInput);
            $.map(_getMatchElements($el, SELECTOR.cardno), Input.onCardNoInput);
            $.map(_getMatchElements($el, SELECTOR.checkbox), Input.onCheckBoxChange);
            $.map(_getMatchElements($el, SELECTOR.text), Input.onTextInput);
            $.map(_getMatchElements($el, SELECTOR.password), Input.onPasswordInput);
            $.map(_getMatchElements($el, SELECTOR.passwordbox), Input.onPasswordBoxInput);
            $el = null;
        };
        Input.clearButton = function () {
            _inputs = {};
        };
        Input.onComponentInput = function (param) {
            var options = {el: null, group: "default", type: "text", needClear: true};
            var p = $.extend(options, param);
            var el = p.el, group = p.group, type = p.type, needClear = p.needClear, validate = p.validate;
            if (!el)return;

            _addInput(el, group);
            if (needClear&&type!='passwordBox') {
                if(!el.parent().hasClass("wrap_input")){
                    el.wrap('<div class="wrap_input"></div>');
                }
                Input.inputClear(el);
            }
            INPUT_TYPE_FN[type] && INPUT_TYPE_FN[type](el, validate);
        };
        Input.onButtonActive = function (param) {
            var options = {el: null, group: "default"};
            var p = $.extend(options, param);
            var el = p.el, group = p.group;
            el.off("onButtonActive").on("onButtonActive", function () {
                console.debug("onButtonActive:" + event.type);
                if (_isAllOk(group)) {
                    el.removeClass("disabled");
                } else {
                    el.addClass("disabled");
                }
            });
            $.each(_getInputByGroup(group), function (i, iel) {
                iel.off("input:step2").on("input:step2", function () {
                    console.debug("iel:" + event.type);
                    el.trigger("onButtonActive");
                });
            });
        };
        return Input;
    }
);


//充值金额验证
var checkMoney = function (target) {
    var order_money = $(target).val();
    var reg = /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/;
    if (!reg.test(order_money) || order_money <= 0) {
        return false;
    }
    return true;
}
//预留手机格式校验
var checkTel = function (target) {
    var mobile = $(target).val();
    var chek_tel = /^\d{11}$/;
    if (mobile == "") {
        return "不能为空";
    }
    if (!chek_tel.test(mobile)) {
        return "格式不对";
    }
    return "";
}

/*
 * 格式化金额
 *
 * s:要格式化的数
 * n:保留几位小数
 *
 * */
function moneyFormat(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/*define('input', [], function (require, exports, module) {


 //var param1 = {
 //    el: $("#recharge_safe_orderMoney"), group: "1", type: "money", needClear: true, validate: function (el) {
 //        if (el.val() > 2) {
 //            return true;
 //        } else {
 //            return false;
 //        }
 //    }
 //};
 //var param2 = {el: $("#recharge_safe_authcode"), group: "1", type: "authCode", needClear: true};
 //var param3 = {el: $("#mobile"), group: "1", type: "mobile", needClear: true};
 //var button = {el: $("#safeCardRecharge"), group: "rechargeInit_section"};
 //baofoo.onComponentInput.on(param1);
 //baofoo.onComponentInput.on(param2);
 //baofoo.onComponentInput.on(param3);
 //baofoo.onButtonActive(button);

 baofoo.wrapMoneyInput = (function ($) {
 var options = {el: null, group: "default"};
 return function (param) {
 var p = $.extend(options, param);
 var el = p.el, group = p.group;
 el.hide();
 var mouse = $("<div>", {class: "mouse"});
 var ctx = $("<div>", {
 id: el.attr("id") + "_dummy",
 style: "padding-right:1px"
 });
 ctx.click(function () {
 console.log(event.clientX);
 });
 el.after(mouse).after(ctx);
 };
 })($);
 return baofoo;
 });*/
/*(function ($) {
    $.fn.textFocus = function (v) {
        var range, len, v = v === undefined ? 0 : parseInt(v);
        this.each(function () {
            if ($.browser.msie) {
                range = this.createTextRange();
                v === 0 ? range.collapse(false) : range.move("character", v);
                range.select();
            } else {
                len = this.value.length;
                v === 0 ? this.setSelectionRange(len, len) : this.setSelectionRange(v, v);
            }
            this.focus();
        });
        return this;
    }
})($);*/


//var param = {el: $("#recharge_safe_orderMoney")};
//baofoo.wrapMoneyInput(param);
//softkeyboard({target: $("#recharge_safe_orderMoney"), closeBtn: true}).show();
//baofoo.softkeyboard({target: $("#recharge_safe_orderMoney_dummy"), closeBtn: true}).show();

