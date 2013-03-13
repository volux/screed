/**
 * jquery.screed.js
 */
(function($){

    "use strict";

    $.fn.screed = function(options) {

        /*
         if (!$.hotkeys) {
         console.log('Need jQuery.hotkey plugin!');
         return this
         }
         */
        var defaults = {
            key: '.screed',
            classes: ['comm', 'char', 'corr', 'text', 'titr'],
            addType: {
                char: ['corr', 'ремарка'],
                corr: ['text', 'Реплика'],
                default: ['comm', 'Описание']
            },
            el: {
                scene: 'section',
                head: 'ul',
                line: 'li',
                act: 'div',
                para: 'p',
                ed: 'span',
                sp: '&nbsp;'
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
                ed = {
                    undefined: function(some) {
                        return ($.type(some) === 'undefined')
                    },

                    selection: function () {
                        var result = {},
                            sel = {
                                type: 'Nothing',
                                anchorOffset: 0,
                                focusOffset: 0,
                                focusNode: null
                            };
                        if (!ed.undefined(window.getSelection)) {
                            sel = window.getSelection();
                        } else
                        if (!ed.undefined(document.selection)) {
                            sel = document.selection.createRange();
                        }
//                        console.log(sel);
                        result.type = sel.type;
                        result.start = sel.anchorOffset;
                        result.end = sel.focusOffset;
                        result.length = (sel.anchorOffset >= sel.focusOffset)? (sel.anchorOffset - sel.focusOffset):(sel.focusOffset - sel.anchorOffset);
                        result.node = $(sel.focusNode);
                        return result
                    },

                    focus: function() {
                        var $ed = $(this), $el = $ed.parent();
                        if ($screed.data('select'+options.key) && $el.is(options.el.line)) {
                            $ed.selectText();
                            $screed.data('select'+options.key, false);
                        }
                        $el.data('revert'+options.key, $el.text());
                        if ($el.is(options.el.para) && $ed.text() == '...') {
                            $ed.html(options.el.sp);
                        }
                    },

                    blur: function() {
                        var $ed = $(this), $el = $ed.parent();
                        $el.data('revert'+options.key, '');
                        if ($el.is(options.el.para) && ($ed.text() == '' || $ed.html() == options.el.sp) && $el.siblings().length) {
                            $el.remove();
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
                                .addClass(newStyle);
                        }
                        return false
                    },

                    action: function($el, text) {
                        var $p = $('<'+options.el.para+'>'), cls = $el.attr('class');
                        $p.prop('contentEditable', false);
                        if (text == '') {
                            text = (!ed.undefined(options.addType[cls]) ? options.addType[cls][1] : options.el.sp)
                        }
                        cls = (!ed.undefined(options.addType[cls]) ? options.addType[cls][0] : options.addType['default'][0]);
                        $p.attr('class', cls).append($('<'+options.el.ed+'/>').prop('contentEditable', true).html(text));
                        $el.after($p)
                    }
                },

                find = {

                    next: function($el) {
                        return $el.next().find(options.el.ed).first()
                    },

                    prev: function($el) {
                        return $el.prev().find(options.el.ed).first()
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
                        if (!$next.length) {
                            $next = find.firstInNext($el);
                        }
                        $next.focus();
                        return false
                    },

                    prev: function($el) {
                        var $prev = find.prev($el);
                        if (!$prev.length) {
                            $prev = find.lastInPrev($el);
                        }
                        $prev.focus();
                        if (!$screed.data('select'+options.key) && !$prev.parent().is(options.el.line)) {
                            $prev.caretToEnd()
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
                            $ed.text('...');
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
                                $el.text('...').trigger('init'+options.key)
                            }
                        }
                        $scene.after($clone);
                        var $al = $clone.find('.anchor').removeClass('anchor');
                        $al.prevAll().remove();
                        if (!andMe) {
                            if ($al.siblings().length) {
                                $al.remove()
                            } else {
                                $al.text('...').trigger('init'+options.key)
                            }
                        }
                        $clone.find(options.el.head).trigger('init'+options.key);
                        $clone.find(options.el.act).trigger('init'+options.key);
                        $screed.data('select'+options.key, true);
                        $clone.find(options.el.ed).first().focus();
                        return false
                    },

                    glue: function($el) {
                        var $next = $el.closest(options.el.scene).next();
                        $el.after($next.find(options.el.act).children());
                        $next.remove();
                        return false
                    },

                    move: {

                        up: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.prev().before($scene);
                            return false
                        },

                        down: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.next().after($scene);
                            return false
                        }
                    },

                    slice: function($el) {
                        var head = $el.text().split(',');
                        return false
                    },

                    shift: function($el) {
                        return false
                    },

                    unShift: function($el) {
                        return false
                    }
                },

                capture = {

                    key: function(event) {
                        var $ed = $(this),
                            tail = '';
                        event.stopPropagation();
                        if (!$ed.is(options.el.ed)) {
                            return true
                        }
                        var $el = $ed.parent(),
                            range = ed.selection();
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
                                    return scene.unShift($el);
                                    break;

                                case 39:
                                    /* ctrl + right - ShiftScene(tm) :)  */
                                    event.preventDefault();
                                    return scene.shift($el);
                                    break;

                                case 46:
                                    /* ctrl + del - glue with next scene */
                                    return scene.glue($el);
                                    break;

                                case 220:
                                    /* ctrl + \ - slice scene with extract p text */
                                    if (!$el.is(options.el.line)) {
                                        scene.slice($el);
                                        return false
                                    }
                                    break;

                                default:
                                    /* console.log(event.which) */
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
                                    if ($el.is(options.el.para)) {
                                        return ed.style($el, -1);
                                    }
                                    if ($el.is(options.el.line) && $ed.text().length) {
                                        $screed.data('select'+options.key, true);
                                        return jump.prev($el);
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
                                default:
                                    break
                            }

                        } else {
                            //console.log(event.which);
                            switch (event.which) {

                                case 8:
                                    /* backspace - delete, after empty jump to prev */
                                    if ($el.is(options.el.line) || $el.attr('class') == 'char') {
//                                        $ed.autocomplete('enable');
                                        return true
                                    }
                                    if (!$ed.text().length) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 9:
                                    /* tab - change type */
                                    event.preventDefault();
                                    if ($el.is(options.el.para)) {
                                        return ed.style($el, 1);
                                    }
                                    if ($el.is(options.el.line) && $ed.text().length) {
                                        $screed.data('select'+options.key, true);
                                        return jump.next($el);
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
                                    if (range.end == $ed.text().length) {
                                        return jump.toNewNext($el, '')
                                    }
                                    tail = $ed.text().substr(range.end);
                                    $ed.text($ed.text().substr(0, range.end));
                                    return jump.toNewNext($el, tail);
                                    break;

                                case 27:
                                    /* escape - revert changes, blur without change */
                                    event.preventDefault();
                                    if ($ed.text() == $el.data('revert'+options.key)) {
                                        $ed.blur()
                                    } else {
                                        $ed.text($el.data('revert'+options.key))
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
                                    if (range.end == 0 && !find.prev($el).length) {
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
                                    if ($ed.text() == '') {
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
//                                    if (range.end == $ed.text().length) {
//                                        if ($ed.autocomplete('option', 'disabled')) {
                                    return jump.next($el);
//                                        } else {
                                    //                                           return true
                                    //                                       }
                                    //                                   }
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

                                default:
//                                    $ed.autocomplete('enable');
//                                    $('body').trigger('scrollTo');
                                    return true;
                            }
                        }
                        return true;
                    }
                },

                section = {

                    head: function() {
                        section.init($(this).prop('contentEditable', false), options.el.line);
                    },

                    action: function() {
                        section.init($(this).prop('contentEditable', true), options.el.para);
                    },

                    init: function($section, find) {
                        $section.find(find).each(section.el);
                    },
                    el: function() {
                        var $el = $(this), $ed = $('<'+options.el.ed+'/>').prop('contentEditable', true);
                        $el
                            .prop('contentEditable', false)
                            .html($el.text())
                            .wrapInner($ed);
                    }
                };
            $screed
                .on('keydown'+options.key, options.el.ed, capture.key)
                .on('blur'+options.key, options.el.ed, ed.blur)
                .on('focus'+options.key, options.el.ed, ed.focus)
                .on('init'+options.key, options.el.head, section.head)
                .on('init'+options.key, options.el.line, section.el)
                .on('init'+options.key, options.el.act, section.action)
                .on('init'+options.key, options.el.para, section.el)
            ;
            $screed.find(options.el.head+', '+options.el.act).trigger('init');
            return $screed;
        })
    };

})(jQuery);