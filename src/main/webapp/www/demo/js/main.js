/**
 * Created by YYJ on 2016/2/8.
 */
console.log('main:load');
define(function (require, exports, module) {
    console.log('main:init');
    require('zepto');
    var $container = $(".container");
    var _pageStack = [];
    var _isGo= false;
    var init = function(){
        //var self = this;

        $(window).on('hashchange', function (e) {

            var _isBack = !_isGo;
            _isGo = false;
            if (!_isBack) {
                return;
            }

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var found = null;
            for(var i = 0, len = _pageStack.length; i < len; i++){
                var stack = _pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }
            if (found) {
                back();
            }
            else {
                //goDefault();
            }
        });

        /*function goDefault(){
            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var page = self._find('url', url) || self._find('name', self._defaultPage);
            self.go(page.name);
        }

        goDefault();*/

        return this;
    };
    init();
    var goto = function (sectionId, data) {
        console.log('main:goto(' + sectionId + ')');
        if (!sectionId)return;
        //加载css
        //seajs.use('css/' + sectionId + '.css');
        seajs.use('js/' + sectionId + '.js?v='/*+new Date().getTime()*/, function (page) {
            page.init(data);//初始化，生成html，绑定事件
            //page.beforeshow && page.beforeshow(data);
            //page.show && page.show();
            var $h = page.render(data);

            var config={
                name:sectionId,
                url: '#' + sectionId,
                transition:$h.filter('.page').data('transition')||'slideIn'
            };
            //var transition = $h.data('transition');
            var $html = $h.addClass(config.transition);

            $container.append($html);
            _pageStack.push({
                config: config,
                dom: $html
            });
            location.hash = '#'+sectionId;
            _isGo = true;
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
        goto('recharge');
    };
    return {
        goto: goto,
        back: back,
        run: run
    };
});