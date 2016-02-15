/**
 * Created by YYJ on 2016/2/8.
 */
console.log('main:load');
define(function (require, exports, module) {
    console.log('main:init');
    require('zepto');
    var $container = $(".container");
    var _pageStack = [];
    var animate = function () {
    };
    var goto = function (sectionId, data) {
        console.log('main:goto(' + sectionId + ')');
        if (!sectionId)return;
        //加载css
        //seajs.use('css/' + sectionId + '.css');
        seajs.use('js/' + sectionId + '.js?v=1', function (page) {
            page.init(data);//初始化，生成html，绑定事件
            //page.beforeshow && page.beforeshow(data);
            //page.show && page.show();
            var $h = page.render(data);
            var transition = $h.data('transition');
            var $html = $h.addClass(transition || 'slideIn');
            $container.append($html);
            _pageStack.push({
                dom: $html
            });
        });
    };

    var back = function () {
        var stack = _pageStack.pop();
        if (!stack) {
            return;
        }
        stack.dom.addClass('slideOut').on('animationend', function () {
            stack.dom.remove();
        }).on('webkitAnimationEnd', function () {
            stack.dom.remove();
        });

        return this;
    };
    var run = function () {
        console.log('main:run');
        goto('section1');
    };
    return {
        goto: goto,
        back: back,
        run: run
    };
});