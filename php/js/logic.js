/**
 * logic.js
 */
(function($){
    "use strict";

    $.undefined = function(some) {
        return ($.type(some) === 'undefined')
    };

    $.fn.screed = function(options){

        var defaults = {
            key: 'bind.screed',
            classes: ['comm', 'char', 'corr', 'text', 'titr'],
            addType: {
                char: ['corr', 'rema', 'ремарка'],
                corr: ['text', 'rep2', 'Реплика'],
                default: ['comm', 'desc', 'Описание']
            },
            el: {
                line: 'li',
                para: 'p',
                head: 'ul',
                sect: 'div'
            }
        };
        options = $.extend(defaults, options);

        var classes = {
            current: 0,
           	next: (options.classes.length > 0)? 1: 0
        };

        return this.each(function() {
            var $this = $(this);
            if ($this.data(options.key)) {
                return $this
            }
            $this
                .data(options.key, true);
            var
                ed = {
                    getSelection: function () {
                        var result = {},
                            sel = {};
                        if (!$.undefined(window.getSelection)) {
                            sel = document.getSelection();
                        } else
                        if (!$.undefined(document.selection)) {
                            sel = document.selection.createRange();
                        }
                        result.type = sel.type;
                        result.start = sel.anchorOffset;
                        result.end = sel.focusOffset;
                        result.length = (sel.anchorOffset >= sel.focusOffset)? (sel.anchorOffset - sel.focusOffset):(sel.focusOffset - sel.anchorOffset);
                        result.node = $(sel.focusNode);
                        return result
                    }
                },
                check = {

                    forThat: function(type){
                        return (!$.undefined(options.addType[type]) ? options.addType[type] : options.addType['default'])
                    }

                ,	forText: function(type, text) {
                        if (!text.length) {
                            text = (!$.undefined(options.addType[type]) ? options.addType[type][2] : '&nbsp;')
                        }
                        return text
                    }
                },
                change = {
                    style: function(revert) {
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
                	action: function(type, text) {
                        text = check.forText(type, text);
                        type = check.forThat(type);
                        var $p = $('<p>')
                            .attr('class', type[0])
                            .prop('contentEditable', false);
                        $p
                            .append($('<span>').html(text)).children().first().screed();
                        $el.after($p);
                    }
                },

                find = {
                    firstInNext: function() {
                        return $el.parent().next().find('span').first()
                    },
                    firstInPrev: function() {
                        return $el.parent().prev().find('span').first()
                    },
                    lastInPrev: function() {
                        return $el.parent().prev().find('span').last()
                    }
                },
                jump = {
                    next: function() {
                        var $next = $el.next().find('span').first();
                        if (!$next.length) {
                            $next = find.firstInNext()
                            if (!$next.length) {
                                $next = $el.closest('section').next().find('span').first()
                            }
                        }
                        $next.focus();
                        return false
                    },
                    prev: function() {
                        var $prev = $el.prev().find('span').first();
                        if (!$prev.length) {
                            $prev = find.lastInPrev();
                            if (!$prev.length) {
                                $prev = $el.closest('section').prev().find('span').last()
                            }
                        }
                        $prev.focus();
                        return false
                    },
                    prevAction: function(){
                        var $prev = $el.closest('section').prev().find('span').last();
                        $prev.focus();
                        return false
                    },
                    firstAction: function(){
                        $el.prevAll().last().find('span').first().focus();
                        return false
                    },
                    lastAction: function(){
                        $el.nextAll().last().find('span').first().focus();
                        return false
                    },
                    itAction: function() {
                        find.firstInNext().focus();
                        return false
                    },
                    toNewNext: function(text) {
                        change.action($el.attr('class'), text);
                        return jump.next()
                    },
                    prevScene: function() {
                        $el.closest('section').prev().find('span').first().focus();
                        return false
                    },
                    nextScene: function() {
                        $el.closest('section').next().find('span').first().focus();
                        return false
                    },
                    firstScene: function() {
                        $el.closest('.screed').find('section').first().find('span').first().focus();
                        return false
                    },
                    lastScene: function() {
                        $el.closest('.screed').find('section').last().find('span').first().focus();
                        return false
                    }
                },

                scene = {
                    cut: function(range) {
                        $el.addClass('anchor');
                        $this.blur();
                        var $scene = $el.closest('section'),
                            $clone = $scene.clone(),
                            andMe;
                        switch (range.end) {
                            case 0:
                                andMe = true;
                                break;
                            case $this.text().length:
                                andMe = false;
                                break;
                            default:
                                return false
                        }

                        $el.nextAll().remove();
                        if (andMe) {
                            $el.remove()
                        }
                        $scene.after($clone);
                        var $al = $clone.find('.anchor').removeClass('anchor');
                        $al.prevAll().remove();
                        if (!andMe) {
                            $al.remove()
                        }
                        $clone.find('ul').screed();
                        $clone.find('div').screed();
                        $screed.data('select', true);
                        $clone.find('span').first().focus();
                        return false
                    },
                    glue: function() {
                        var $next = $el.closest('section').next();
                        $el.after($next.find(options.el.sect).children());
                        $next.remove();
                        return false
                    },
                    slice: function() {
                        return false
                    }
                },

                capture = {
                    keyb: function(event) {

                        if (!$this.is('span')) {
                            return true
                        }

                        var range = ed.getSelection();
                        if (event.ctrlKey && !event.shiftKey) {
                            switch(event.which) {
                                case 13:
                                    /* ctrl + enter - new scene */
                                    if (!$el.is(options.el.line)) {
                                        return scene.cut(range)
                                    }
                                    break;

                            	case 32:
                                /* ctrl + space - glue with next scene ??? or cut */
                                    return true;
                                    break;

                                case 35:
                                /* ctrl + end - last scene */
                                    return jump.lastScene();
                                    break;

                                case 36:
                                /* ctrl + home - first scene */
                                    return jump.firstScene();
                                    break;

                                case 46:
                                /* ctrl + del - glue with next scene */
                                    return scene.glue();
                                    break;

                                case 220:
                                /* ctrl + \ - slice scene with extract p text */
                                    if (!$el.is(options.el.line)) {
                                        scene.slice();
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
                                    if ($this.text() == '') {
                                        return jump.prev()
                                    }
                                    break;

                                case 9:
                                    /* shift + tab - change type */
                                    if ($el.is(options.el.line)) {
                                        return jump.prev()
                                    }
                                    return change.style(-1);
                                    break;

                                case 13:
                                    /* shift + enter - add <br> ??? need: move text after cursor position to new element */
                                    if ($el.is(options.el.line)) {
                                        return false
                                    }
                                    if (range.end == $this.text().length) {
                                        return jump.toNewNext('')
                                    }
                                    ending = $this.text().substr(range.end);
                                    $this.text($this.text().substr(0, range.end));
                                    return jump.toNewNext(ending);
                                    break;

                                case 33:
                                    /* shift + page up - move scene up */
                                    event.stopImmediatePropagation(); /** TODO event.preventDefault() ??? */
                                    if ($el.is(options.el.line)) {
//                                        return scene.move($el, 'up')
                                    }
                                    return false;
                                    break;

                                case 34:
                                    /* shift + page down - move scene down */
                                    event.stopImmediatePropagation(); /** TODO event.preventDefault() ??? */
                                	if ($el.is(options.el.line)) {
//                                        return scene.move($el, 'down')
                                    }
                                    return false;
                                    break;

                                case 35:
                                    /* shift + end - last action in scene */
                                    return jump.lastAction();
                                    break;

                                case 36:
                                    /* shift + home - first action in scene */
                                    return jump.firstAction();
                                    break;

                                case 46:
                                    /* shift + delete - delete, after empty jump to next */
/*
    native!!!
                                    if ($this.text().length == 0) {
                                        return jump.next()
                                    }
                                    if (range.end == $this.text().length) {
                                        if (have.existNext('')) {
                                            $this.text($this.text()+have.from_next());
                                            $this.focus();
                                            return false
                                        }
                                    // glue scenes
//                                    return scene.glue()
                                    }
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
//                                        $this.autocomplete('enable');
                                        return true
                                    }
                                    if ($this.text().length == 0) {
                                        return jump.prev()
                                    }
                                    break;

                                case 9: /* tab - change type */
                                    event.stopPropagation();
                                    if ($el.is(options.el.para)) {
                                        return change.style(1);
                                    }
                                    if ($el.is(options.el.line)) {
                                        $screed.data('select', true);
                                        return jump.next();
                                    }
                                    return false;
                                    break;
                                case 13: /* enter - next, suggestion */
                                    event.stopPropagation();
                                    if ($this.text() == '') {
                                        return false
                                    }
                                    if ($el.is(options.el.line)) {
                                        return jump.next()
                                    }
                                    var ending = '';
                                    if (range.end == 0) {
                                        ending = $this.text();
                                        $this.text('...');
                                    	return jump.toNewNext(ending)
                                    }
                                    if (range.end == $this.text().length) {
                                        return jump.toNewNext('')
                                    }
                                    ending = $this.text().substr(range.end);
                                    $this.text($this.text().substr(0, range.end));
                                	return jump.toNewNext(ending);
                                    break;
                                case 27:
                                /* escape - blur without change */
                                    event.stopPropagation();
                                    $this.text($this.data('revert'));
//                                    $this.blur();
                                    return false;
                                    break;

                                case 33:
                                    /* page up - prev scene */
                                    event.stopImmediatePropagation(); /** TODO event.preventDefault() ??? */
                                    return jump.prevScene();
                                    break;

                                case 34:
                                    /* page down - next scene */
                                    event.stopImmediatePropagation(); /** TODO event.preventDefault() ??? */
                                    return jump.nextScene();
                                    break;

                                case 37:
                                /* go left */
                                    if ($el.is(options.el.line) && $this.text() == '') {
                                        return false
                                    }
                                    if (range.end == 0) {
                                        return jump.prev()
                                    }
                                    break;
                                case 38:
                                    /* go up */
                                    if ($el.is(options.el.line) && $this.text() == '') {
                                        return false
                                    }
                                    if ($el.is(options.el.line)) {
                                        return jump.prevAction()
                                    }
                                    if (range.end == 0) {
                                        return jump.prev()
                                    }
                                    break;
                                case 39:
                                    /* go right */
                                    if ($el.is(options.el.line) && $this.text() == '') {
                                        return false
                                    }
                                    if (range.end == $this.text().length) {
                                        return jump.next()
                                    }
                                    break;
                                case 40:
                                    /* go down */
                                    if ($el.is(options.el.line) && $this.text() == '') {
//                                        change.autocomplete('enable');
                                        return false
                                    }
                                    if ($this.text() == '') {
//                                        change.autocomplete('enable');
                                        return true
                                    }
                                    if ($el.is(options.el.line)) {
//                                        if ($this.autocomplete('option', 'disabled')) {
                                            return jump.itAction();
//                                        } else {
//                                            return true
//                                        }
                                    }
                                    if (range.end == $this.text().length) {
//                                        if ($this.autocomplete('option', 'disabled')) {
                                            return jump.next();
//                                        } else {
 //                                           return true
 //                                       }
                                    }
                                    break;
                                case 46:
                                    /* delete - delete, after empty jump to next */
                                    //change.autocomplete('enable');
                                    if ($el.is(options.el.line) && ($this.text().length == 0)) {
                                        return false
                                    }
                                    if ($this.text().length == 0) {
                                        return jump.next()
                                    }
                                    break;
                                default:
//                                    change.autocomplete('enable');
//                                    $('body').trigger('scrollTo');
                                    return true;
                            }
                        }
                        return true;
                    }
                }
                ;
            var $el = $this.parent(), $screed = $el.closest('.screed'),
                el = options.el.para;
            if ($this.is('ul')) {
                el = options.el.line;
            } else {
                $this.prop('contentEditable', true);
            }
            $this.find(el).each(function(){
                var $el = $(this);
                $el.html($el.text()).wrapInner('<span/>')
                    .prop('contentEditable', false);
                $el
                    .find('span').screed();
            });
            if ($screed.data('select') && $el.is(options.el.line)) {
                document.execCommand('selectAll',false,null);
                $screed.data('select', false);
            }
            $this
                .on('keydown', capture.keyb)
                .on('blur', function() {
                    $this.data('revert', '');
                    if ($el.is(options.el.para) && ($this.text() == '' || $this.html() == '&nbsp;')) {
                        $el.remove();
                    }
                    if ($el.is(options.el.sect)) {
                        console.log('save');
                    }
                })
                .on('focus', function() {
                    $this.data('revert', $this.text());
                    if ($el.is(options.el.para) && $this.text() == '...') {
                        $this.html('&nbsp;');
                    }
                })
            ;
            return $this;
        })
    };
    $('.screed ul').screed();
    $('.screed div').screed();
    $('.screed span').first().focus();
})(jQuery);