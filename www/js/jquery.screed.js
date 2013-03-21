/**
 * jquery.screed.js
 */
(function($){

    "use strict";

    $.fn.screed = function(options) {

        if (!window.getSelection) {
            options.notify.error('need modern browser');
            return this
        }

        var defaults = {

            key: '.screed',

            classes: ['comm', 'char', 'corr', 'text', 'titr'],

            addType: {
                char: ['corr', '...'],
                corr: ['text', 'Реплика'],
                default: ['comm', 'Описание']
            },

            el: {
                tittle: 'fieldset',
                field: 'label',
                scene: 'section',
                head: 'ul',
                line: 'li',
                action: 'div',
                para: 'p',
                ed: 'span',
                sp: '&nbsp;',
                empty: '...'
            },

            notify: {

                info: function(msg) {
                    alert(msg)
                },

                success: function (msg) {
                    alert(msg)
                },

                error: function (msg) {
                    alert(msg)
                }
            },

            onOpen: function ($screed) {
                $screed.html();
                options.notify.error('need custom implementation')
            },

            onSave: function ($screed) {
                $screed.html();
                options.notify.error('need custom implementation')
            },

            onClean: function ($screed) {
                $screed.html();
                options.notify.error('need custom implementation')
            }
        };
        options = $.extend(defaults, options);

        var classes = {
            current: 0,
           	next: (options.classes.length > 0)? 1: 0
        };

        return this.each(function() {

            var $screed = $(this);
            if ($screed.data(options.key)) {
                return $screed
            }
            $screed.data(options.key, true);

            var
                un = {
                    defined: function(some) {
                        return ($.type(some) === 'undefined')
                    }
                },

                select = {

                    add: function(bean) {
                        bean.sel.removeAllRanges();
                        bean.sel.addRange(bean.range);
                    },

                    bean: function (node) {
                        var bean = {
                            sel: window.getSelection(),
                            range: document.createRange()
                        };
                        if (!un.defined(node)) {
                            bean.range.selectNodeContents(node);
                        }
                        return bean
                    },

                    range: function () {
                        var sel = select.bean().sel,
                            range = {
                                start: sel.anchorOffset,
                                end: sel.focusOffset
                            };
                        range.length = (range.start >= range.end)? (range.start - range.end):(range.end - range.start);
                        return range
                    },

                    all: function (node) {
                        select.add(select.bean(node));
                    },

                    end: function (node) {
                        var bean = select.bean(node);

                        bean.range.collapse(false);

                        select.add(bean);
                    }

                },

                find = {

                    next: function($el) {
                        var $next = $el.next().find(options.el.ed).first();
                        if (!$next.length) {
                            $next = find.firstInNext($el)
                        }
                        return $next
                    },

                    prev: function($el) {
                        var $prev = $el.prev().find(options.el.ed).first();
                        if (!$prev.length) {
                            $prev = find.lastInPrev($el)
                        }
                        return $prev
                    },

                    firstInNext: function($el) {
                        var $next = $el.parent().next().find(options.el.ed).first();
                        if (!$next.length) {
                            $next = $el.closest(options.el.scene).next().find(options.el.ed).first()
                        }
                        return $next
                    },

                    lastInPrev: function($el) {
                        var $prev = $el.parent().prev().find(options.el.ed).last();
                        if (!$prev.length) {
                            $prev = $el.closest(options.el.scene).prev().find(options.el.ed).last()
                        }
                        return $prev
                    }
                },

                jump = {

                    next: function($el) {
                        var $next = find.next($el);
                        $next.focus();
                        return false
                    },

                    prev: function($el) {
                        var $prev = find.prev($el);
                        if ($prev.length) {
                            $prev.focus();
                            if (!$screed.data('select')) {
                                select.end($prev.get(0))
                            }
                        }
                        return false
                    },

                    firstAction: function($el){
                        $el.prevAll().last().find(options.el.ed).first().focus();
                        return false
                    },

                    lastAction: function($el){
                        $el.nextAll().last().find(options.el.ed).first().focus();
                        return false
                    },

                    prevAction: function($el) {
                        find.lastInPrev($el).focus();
                        return false
                    },

                    itAction: function($el) {
                        find.firstInNext($el).focus();
                        return false
                    },

                    toNewNext: function($el, text) {
                        ed.action($el, text);
                        return jump.next($el)
                    },

                    prevScene: function($el) {
                        $el.closest(options.el.scene).prev().find(options.el.ed).first().focus();
                        return false
                    },

                    nextScene: function($el) {
                        $el.closest(options.el.scene).next().find(options.el.ed).first().focus();
                        return false
                    },

                    firstScene: function($el) {
                        $el.closest(options.key).find(options.el.scene).first().find(options.el.ed).first().focus();
                        return false
                    },

                    lastScene: function($el) {
                        $el.closest(options.key).find(options.el.scene).last().find(options.el.ed).first().focus();
                        return false
                    }
                },

                scene = {

                    cut: function($el, $ed, range) {
                        if ($ed.text().length == 1) {
                            $ed.text(options.el.empty)
                        }
                        $el.addClass('anchor');
                        var $scene = $el.closest(options.el.scene),
                            $clone = $scene.clone(),
                            andMe = false,
                            len = $ed.text().length;
                        $el.removeClass('anchor');
                        if (range.end == 0) {
                            andMe = true
                        }
                        $el.nextAll().remove();
                        if (andMe) {
                            if (len && $el.siblings().length) {
                                $el.remove()
                            } else {
                                $el.text(options.el.empty).trigger('el')
                            }
                        }
                        $scene.after($clone);
                        var $al = $clone.find('.anchor').removeClass('anchor');
                        $al.prevAll().remove();
                        if (!andMe) {
                            if ($al.siblings().length) {
                                $al.remove()
                            } else {
                                $al.text(options.el.empty).trigger('el')
                            }
                        }
                        $clone.find(options.el.head).trigger('editable');
                        $clone.find(options.el.action).trigger('editable').find(options.el.para).first().attr('class', 'comm');
                        $screed.data('select', true);
                        $clone.removeAttr('role').find(options.el.ed).first().focus();
                        return false
                    },

                    glue: function($el) {
                        var $next = $el.closest(options.el.scene).next();
                        $el.after($next.find(options.el.action).children());
                        $next.remove();
                        return false
                    },

                    move: {

                        up: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.prev().before($scene);
                            $scene.find(options.el.ed).first().focus();
                            return false
                        },

                        down: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.next().after($scene);
                            $scene.find(options.el.ed).first().focus();
                            return false
                        }
                    },

                    shift: {

                        pop: function($el) {
                            var $scene = $el.closest(options.el.scene);
                            switch ($scene.attr('role')) {
                                case 'skip':
                                    $scene.attr('role', 'sub');
                                    break;
                                case 'sub':
                                    $scene.removeAttr('role');
                                    break;
                                default:
                                    break
                            }
                            return false
                        },

                        deep: function($el) {
                            var $scene = $el.closest(options.el.scene);
                            if (!$scene.prev().length) {
                                return false
                            }
                            switch ($scene.attr('role')) {
                                case 'skip':
                                    break;
                                case 'sub':
                                    $scene.attr('role', 'skip');
                                    break;
                                default:
                                    $scene.attr('role', 'sub');
                                    break
                            }
                            return false
                        }
                    }
                },

                ed = {

                    focus: function() {
                        var $ed = $(this),
                            $el = $ed.parent();
                        if ($screed.data('select') && $el.is(options.el.line)) {
                            select.all(this);
                            $screed.data('select', false)
                        }
                        $el.data('revert', $el.text());
                        if ($el.is(options.el.para) && ($ed.text() == options.el.empty)) {
                            $ed.html(options.el.sp)
                        }
                        $screed.trigger({type: 'current', ed: $ed})
                    },

                    blur: function() {
                        var $ed = $(this),
                            $el = $ed.parent();
                        $el.data('revert', '');
                        if ($ed.text().length > 1) {
                            var $para = $ed.find(options.el.para);
                            if ($para.length) {
                                $para.detach();
                                $ed.wrapInner('<p/>');
                                var $last = $ed.find(options.el.para);
                                $el.after($last);
                                $last.addClass('comm').trigger('el');
                                $el.after($para);
                                $para.trigger('el')
                            } else {
                                $ed.text($.trim($ed.text().replace(options.el.sp, ' ')))
                            }
                        }
                        if ($el.is(options.el.para) &&
                                ($ed.html() == options.el.sp || !$ed.text().length) &&
                                $el.siblings().length &&
                                !$el.next().is('.corr')
                            ) {
                            $screed.trigger({type: 'current', ed: find.prev($el)});
                            $el.remove()
                        }
                    },

                    style: function($el, revert) {
                        if (options.classes.length) {
                            classes.current = $.inArray($el.attr('class'), options.classes);
                            if (revert == 1) {
                                if ((options.classes.length - classes.current) > 1) {
                                    classes.next = classes.current + 1
                                } else {
                                    classes.next = 0
                                }
                            } else {
                                if (classes.current == 0) {
                                    classes.next = options.classes.length - 1
                                } else {
                                    classes.next = classes.current - 1
                                }
                            }
                            var newStyle = options.classes[classes.next];
                            $el
                                .removeClass(options.classes[classes.current])
                                .addClass(newStyle)
                        }
                        return false
                    },

                    action: function($el, text) {
                        var $p = $('<'+options.el.para+'>'),
                            cls = $el.attr('class');
                        if (text == '') {
                            text = (!un.defined(options.addType[cls]) ? options.addType[cls][1] : options.el.sp)
                        }
                        cls = (!un.defined(options.addType[cls]) ? options.addType[cls][0] : options.addType['default'][0]);
                        $el.after($p);
                        $p.attr('class', cls).text(text).trigger('el')
                    },

                    keydown: function(event) {
                        console.log(event.which);
                        var $ed = $(this),
                            tail = '';

                        event.stopPropagation();
                        if (!$ed.is(options.el.ed)) {
                            return true
                        }
                        var $el = $ed.parent(),
                            range = select.range();
                        if (event.ctrlKey && !event.shiftKey) {

                            switch(event.which) {

                                case 13:
                                    /* ctrl + enter - new scene */
                                    if (!$el.is(options.el.line)) {
                                        return scene.cut($el, $ed, range)
                                    }
                                    break;

                                case 32:
                                    /* ctrl + space - glue with next scene ??? or cut */
                                    return true;
                                    break;

                                case 35:
                                    /* ctrl + end - last scene */
                                    return jump.lastScene($el);
                                    break;

                                case 36:
                                    /* ctrl + home - first scene */
                                    return jump.firstScene($el);
                                    break;

                                case 37:
                                    /* ctrl + left - unShiftScene(tm) :)  */
                                    event.preventDefault();
                                    return scene.shift.pop($el);
                                    break;

                                case 39:
                                    /* ctrl + right - ShiftScene(tm) :)  */
                                    event.preventDefault();
                                    return scene.shift.deep($el);
                                    break;

                                case 46:
                                    /* ctrl + del - glue with next scene */
                                    return scene.glue($el);
                                    break;

                                case 69:
                                    /* ctrl + e - new screenplay */
                                    event.preventDefault();
                                    $screed.trigger('empty');
                                    return false;
                                    break;

                                case 79:
                                    /* ctrl + o - open screenplay */
                                    event.preventDefault();
                                    $screed.trigger('open');
                                    return false;
                                    break;

                                case 83:
                                    /* ctrl + s - save screenplay */
                                    event.preventDefault();
                                    $screed.trigger('save');
                                    return false;
                                    break;

                                default:
                                    /*console.log(event.which);*/
                                    break
                            }

                        } else
                        if (event.shiftKey && !event.ctrlKey) {

                            switch(event.which) {

                                case 8:
                                    /* shift + backspace - delete, after empty jump to prev */
                                    if ($el.is(options.el.line)) {
                                        return true
                                    }
                                    if (!$ed.text().length) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 9:
                                    /* shift + tab - change type */
                                    event.preventDefault();
                                    if ($el.is(options.el.para) && $el.prevAll().length) {
                                        return ed.style($el, -1)
                                    }
                                    if ($el.is(options.el.line) && $ed.text().length) {
                                        $screed.data('select', true);
                                        return jump.prev($el)
                                    }
                                    return false;
                                    break;

                                case 13:
                                    /* shift + enter - add <br> ??? need: move text after cursor position to new element */
                                    if ($el.is(options.el.line)) {
                                        return false
                                    }
                                    if (range.end == $ed.text().length) {
                                        return jump.toNewNext($el, '')
                                    }
                                    tail = $ed.text().substr(range.end);
                                    $ed.text($ed.text().substr(0, range.end));
                                    return jump.toNewNext($el, tail);
                                    break;

                                case 33:
                                    /* shift + page up - move scene up */
                                    event.preventDefault();
                                    if ($el.is(options.el.line)) {
                                        return scene.move.up($el)
                                    }
                                    return false;
                                    break;

                                case 34:
                                    /* shift + page down - move scene down */
                                    event.preventDefault();
                                    if ($el.is(options.el.line)) {
                                        return scene.move.down($el)
                                    }
                                    return false;
                                    break;

                                case 35:
                                    /* shift + end - last action in scene */
                                    return jump.lastAction($el);
                                    break;

                                case 36:
                                    /* shift + home - first action in scene */
                                    return jump.firstAction($el);
                                    break;

                                case 46:
                                    /* shift + delete - delete, after empty jump to next */
                                    /*
                                     native!!!
                                     */
                                    break;

                                case 112:
                                    /* shift + f1 - show statistic */
                                    event.preventDefault();
                                    options.notify.info('show statistic from span');
                                    return false;
                                    break;

                                case 113:
                                    /* shift + f2 - focus to tittle */
                                    $screed.trigger('tittleFocus');
                                    return true;
                                    break;

                                default:
                                    break
                            }

                        } else {
                            //console.log(event.which);
                            switch (event.which) {

                                case 8:
                                    /* backspace - delete, after empty jump to prev */
                                    if ($el.is(options.el.line) || $el.is('.char')) {
//                                        $ed.autocomplete('enable');
                                        return true
                                    }
                                    if (!$ed.text().length) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 9:
                                    /* tab - change style in action and move to next with select all in header */
                                    event.preventDefault();
                                    if ($el.is(options.el.para) && $el.prevAll().length) {
                                        return ed.style($el, 1)
                                    }
                                    if ($el.is(options.el.line) && $ed.text().length) {
                                        $screed.data('select', true);
                                        return jump.next($el)
                                    }
                                    return false;
                                    break;

                                case 13:
                                    /* enter - next, suggestion */
                                    event.preventDefault();
                                    if (!$ed.text().length) {
                                        return false
                                    }
                                    if ($el.is(options.el.line)) {
                                        return jump.next($el)
                                    }
                                    if (range.end == 0) {
                                        tail = $ed.text();
                                        $ed.text('...');
                                        return jump.toNewNext($el, tail)
                                    }
                                    tail = $ed.text().substr(range.end);
                                    $ed.text($ed.text().substr(0, range.end));
                                    return jump.toNewNext($el, tail);
                                    break;

                                case 27:
                                    /* escape - revert changes, blur without change */
                                    event.preventDefault();
                                    if ($ed.text() == $el.data('revert')) {
                                        $ed.blur()
                                    } else {
                                        $ed.text($el.data('revert'))
                                    }
                                    return false;
                                    break;

                                case 33:
                                    /* page up - prev scene */
                                    event.preventDefault();
                                    return jump.prevScene($el);
                                    break;

                                case 34:
                                    /* page down - next scene */
                                    event.preventDefault();
                                    return jump.nextScene($el);
                                    break;

                                case 37:
                                    /* go left */
                                    if ($el.is(options.el.line) && !$ed.text().length) {
                                        return false
                                    }
                                    if ($el.is(options.el.line) && range.end == 0) {
                                        return jump.prev($el)
                                    }
                                    if (range.end == 0) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 38:
                                    /* go up */
                                    if ($el.is(options.el.line) && !$ed.text().length) {
                                        return false
                                    }
                                    if ($el.is(options.el.line)) {
                                        return jump.prevAction($el)
                                    }
                                    if (range.end == 0) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 39:
                                    /* go right */
                                    if ($el.is(options.el.line) && !$ed.text().length) {
                                        return false
                                    }
                                    if (range.end == $ed.text().length) {
                                        return jump.next($el)
                                    }
                                    break;

                                case 40:
                                    /* go down */
                                    if ($el.is(options.el.line) && !$ed.text().length) {
//                                        $ed.autocomplete('enable');
                                        return false
                                    }
                                    if (!$ed.text().length) {
//                                        $ed.autocomplete('enable');
                                        return true
                                    }
                                    if ($el.is(options.el.line)) {
//                                        if ($ed.autocomplete('option', 'disabled')) {
                                        return jump.itAction($el);
//                                        } else {
//                                            return true
//                                        }
                                    }
                                    if (range.end == $ed.text().length) {
//                                        if ($ed.autocomplete('option', 'disabled')) {
                                        return jump.next($el);
//                                        } else {
//                                           return true
//                                        }
                                    }
                                    break;

                                case 46:
                                    /* delete - delete, after empty jump to next */
                                    //$ed.autocomplete('enable');
                                    if ($el.is(options.el.line) && !$ed.text().length) {
                                        return false
                                    }
                                    if ($ed.text().length == 0) {
                                        return jump.next($el)
                                    }
                                    break;

                                case 112:
                                    /* f1 - show hotkeys help */
                                    event.preventDefault();
                                    options.notify.info('show hotkeys help from span');
                                    return false;
                                    break;

                                default:
//                                    $ed.autocomplete('enable');
//                                    $('body').trigger('scrollTo');
                                    return true
                            }
                        }
                        return true
                    }

                },

                editable = {

                    tittle: function() {
                        editable.prep($(this).prop('contentEditable', false), options.el.field)
                    },

                    head: function() {
                        editable.prep($(this).prop('contentEditable', false), options.el.line)
                    },

                    action: function() {
                        editable.prep($(this).prop('contentEditable', true), options.el.para)
                    },

                    prep: function($section, find) {
                        $section.find(find).trigger('el')
                    },

                    el: function(e) {
                        e.stopPropagation();
                        var $el = $(this),
                            $ed = $('<'+options.el.ed+'/>').prop('contentEditable', true);
                        $el
                            .prop('contentEditable', false)
                            .removeAttr('style')
                            .html($el.text())
                            .wrapInner($ed)
                    }
                },

                screed = {

                    init: function () {
                        $(this).find(options.el.tittle+', '+options.el.head+', '+options.el.action).trigger('editable');
                    },

                    current: function(e) {
                        $(this).find('.current').removeClass('current');
                        e.ed.addClass('current')
                    },

                    focus: function() {
                        var $current = $(this).find('.current');
                        if (!$current.length) {
                            $current = $(this).find(options.el.scene+' '+ options.el.ed).first()
                        }
                        $current.focus()
                    },

                    tittle: function() {
                        var $screed = $(this),
                            $tittle = $screed.find(options.el.tittle);
                        $tittle.toggle();
                        if (!$tittle.is(':hidden')) {
                            $tittle.find(options.el.ed).first().focus()
                        } else {
                            $screed.find(options.el.scene+' '+options.el.ed).first().focus()
                        }
                    },

                    save: function() {
                        var $clone = $(this).clone();
                        $clone
                            .find(options.el.ed).each(function () {
                                var $ed = $(this);
                                $ed.parent().html($ed.text());
                            }).end()
                            .find('*').removeAttr('contenteditable').end()
                            .wrap('<div/>')
                        ;
                        options.onSave($clone.parent().html())
                    },

                    open: function() {
                        options.onOpen($(this))
                    },

                    clean: function () {
                        options.onClean($(this))
                    }
                };

            return $screed
                .on('keydown',  options.el.ed, ed.keydown)
                .on('blur',     options.el.ed, ed.blur)
                .on('focus',    options.el.ed, ed.focus)

                .on('editable', options.el.tittle, editable.tittle)
                .on('editable', options.el.head,   editable.head)
                .on('editable', options.el.action, editable.action)
                .on('el',       options.el.field,  editable.el)
                .on('el',       options.el.line,   editable.el)
                .on('el',       options.el.para,   editable.el)

                .on('init',     screed.init)
                .on('save',     screed.save)
                .on('open',     screed.open)
                .on('clean',    screed.clean)
                .on('current',  screed.current)
                .on('currentFocus', screed.focus)
                .on('tittleFocus',  screed.tittle)

                .trigger('init')
        })
    };

})(jQuery);