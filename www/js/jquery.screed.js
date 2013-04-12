/* jquery.screed.js */

(function ($) {

    "use strict";

    $.fn.screed = function (options) {

        var screedDictionary = {
            initError:      'Меня создали для современных браузеров!',
            notImplemented: 'Неужели ещё не дописан код?!',
            screedIsLocked: 'Сценарий закрыт для изменений',
            screedUnsaved:  'Сценарий не сохранён',
            screedIsEmpty:  'Сценарий пуст',
            openOther:      'открыть другой',
            beginNew:       'начать новый'
        };

        var screedList = {
            where: ['инт', 'нат', 'инт/нат', 'нат+инт'],
            when:  ['день', 'ночь', 'утро', 'вечер', 'рассвет', 'закат']
        };

        if (!window.getSelection) {
            options.notify.error(screedDictionary.initError);
            return this
        }

        var defaults = {

            screed:    '.screed',
            stylePath: '/css/screed.css',
            autoStart: true,

            say: screedDictionary,

            /** TODO more elegance!! */
            classes: {
                list:                      '',
                all:                       ['action', 'character', 'parenthetical', 'dialog', 'titr', 'transition'],
                action:                    ['action', 'character', 'titr', 'transition'],
                actionFirst:               ['action', 'transition'],
                actionAfterCharacter:      ['action', 'parenthetical', 'dialog'],
                actionAfterParenthetical:  ['action', 'dialog'],
                actionAfterDialog:         ['action', 'character', 'parenthetical'],
                character:                 ['character', 'titr', 'transition', 'action'],
                charLinked:                ['character'],
                parenthetical:             ['parenthetical', 'dialog'],
                parentheticalBeforeAction: ['parenthetical', 'character', 'action'],
                dialog:                    ['dialog', 'parenthetical'],
                dialogAfterParenthetical:  ['dialog'],
                titr:                      ['titr', 'transition', 'character', 'action'],
                transition:                ['transition', 'action', 'character', 'titr'],
                transitionFirst:           ['transition', 'action'],
                MsoNormal:                 ['action'] /** TODO paste from MS Word */
            },

            classesList: function ($el) {

                var elClass = $el.attr('class');
                options.classes.list = elClass;

                /** TODO more elegance!! */
                if (!$el.prevAll().length /*&& (elClass == 'action')*/) {
                    options.classes.list = 'actionFirst';
                    return elClass
                }
                if ($el.prev().is('.character') && (elClass == 'action')) {
                    options.classes.list = 'actionAfterCharacter';
                }
                if ($el.prev().is('.parenthetical') && (elClass == 'action')) {
                    options.classes.list = 'actionAfterParenthetical';
                }
                if ($el.prev().is('.dialog') && (elClass == 'action')) {
                    options.classes.list = 'actionAfterDialog';
                }
                if (!$el.prevAll().length && (elClass == 'transition')) {
                    options.classes.list = 'transitionFirst';
                }
                if ($el.next().is('.dialog') || $el.next().is('.parenthetical')) {
                    options.classes.list = 'charLinked';
                    options.notify.info('Персонаж уже имеет текст!')
                }
                if ($el.next().is('.action') && (elClass == 'parenthetical')) {
                    options.classes.list = 'parentheticalBeforeAction';
                }
                if ($el.prev().is('.parenthetical') && (elClass == 'dialog')) {
                    options.classes.list = 'dialogAfterParenthetical';
                }
                return elClass
            },

            values: {
                list:     false,
                where:    function () {
                    return screedList.where
                },
                when:     function () {
                    return screedList.when
                },
                location: function () {
                    var $list = $(options.screed + ' .scr-menu-location li'),
                        list = [];
                    $list.each(function () {
                        list.push($(this).text())
                    });
                    return list
                }
            },

            valuesList: function ($ed) {

                options.values.list = options.values[$ed.parent().attr('class')];
                return $ed.text()
            },

            addType: {
                character:     ['parenthetical', '…'],
                parenthetical: ['dialog', '…'],
                default:       ['action', '…']
            },

            el: {
                tittle:  '.scr-first-page',
                /*field:  'p',*/
                scene:   'section',
                head:    'header',
                line:    'span',
                action:  'div',
                para:    'p',
                ed:      'tt',
                sp:      '&nbsp;',
                empty:   '…',
                current: '.scr-current'
            },

            log: function (msg) {
                console.log(msg)
            },

            notify: {

                info: function (msg) {
                    alert(msg)
                },

                success: function (msg) {
                    alert(msg)
                },

                error: function (msg) {
                    alert(msg)
                }
            },

            onUndo: function (state) {
                console.log(state);
                options.notify.error(options.say.notImplemented)
            },

            onRedo: function (state) {
                console.log(state);
                options.notify.error(options.say.notImplemented)
            },

            onCurrent: function ($el) {
                console.log($el);
                options.notify.error(options.say.notImplemented)
            },

            onClean: function ($parent, afterClean) {
                console.log($parent, afterClean);
                options.notify.error(options.say.notImplemented)
            },

            onOpen: function (afterOpen) {
                console.log(afterOpen);
                options.notify.error(options.say.notImplemented)
            },

            onSave: function (file, screed, afterWrite) {
                console.log(file, screed, afterWrite);
                options.notify.error(options.say.notImplemented)
            },

            onHelp: function () {
                options.notify.error(options.say.notImplemented)
            },

            onLock: function (locked) {
                console.log(locked);
                options.notify.error(options.say.notImplemented)
            },

            onLocked: function (locked) {
                console.log(locked);
                options.notify.error(options.say.notImplemented)
            },

            fileData: function ($screed, filename) {
                console.log($screed, filename);
                options.notify.error(options.say.notImplemented)
            },

            fileStore: function (file) {
                console.log(file);
                options.notify.error(options.say.notImplemented)
            },

            onSaved: function (saved) {
                console.log(saved);
                options.notify.error(options.say.notImplemented)
            },

            onUnsaved: function () {
                options.notify.error(options.say.notImplemented)
            },

            autoSave: function (screedHtml) {
                console.log(screedHtml);
                options.notify.error(options.say.notImplemented)
            },

            title: function (title) {
                $('title').text(title + ' - Screed');
            },

            replace: function (screed, file) {
                /** TODO get from user.info author and contact and write to fields */

                var $parent = $(options.screed).parent();
                options.fileStore(file);
                screed.replace('&quot;', '"');
                $parent.html(screed);
                var $screed = $parent.children(0);

                $screed.find(options.el.current).parent().attr('role', 'current');

                options.title($screed.find('.title').text());

                $screed.attr({'data-user': JSON.stringify(options.user.info), 'class': 'screed'}).screed(options);

                var $current = $screed.find('*[role="current"]');

                $current.removeAttr('role').children(0).focus();

                return $screed
            },

            restore: function ($screed) {
                var clear = function () {
                    var $ed = $(this);
                    $ed.parent().html($ed.text());
                };

                return $screed
                    .find(options.el.ed).each(clear).end()
                    .find(options.el.tittle).removeAttr('style').end()
                    .find('[contenteditable]').removeAttr('contenteditable').end()
                    .html()
            },

            ask: function (question, callback) {
                console.log(question, callback);
                options.notify.error(options.say.notImplemented)
            },

            confirm: function (label, callback) {
                console.log(label, callback);
                options.notify.error(options.say.notImplemented)
            },

            edit: {

                limit: 100,

                undoStack: [],
                redoStack: [],

                /**
                 * TODO save state in localStorage, in stacks save keys to items in LocalStorage
                 * @param state
                 */
                save: function (state) {
                    this.undoStack.push(state);
                    options.onUndo(true);
                    this.redoStack.length = 0;
                    options.onRedo(false);
                    if (this.undoStack.length > this.limit) {
                        this.undoStack.shift()
                    }
                },

                undo: function () {
                    var state = this.undoStack.pop();
                    if (state) {
                        this.redoStack.push(state);
                        options.onRedo(true)
                    } else {
                        options.onUndo(false)
                    }
                    return state
                },

                redo: function () {
                    var state = this.redoStack.pop();
                    if (state) {
                        this.undoStack.push(state);
                        options.onUndo(true)
                    } else {
                        options.onRedo(false)
                    }
                    return state
                },

                clean: function () {
                    this.undoStack = [];
                    this.redoStack = [];
                    $(options.screed).parent().data('clean.undo', true);
                    options.onUndo(false);
                    options.onRedo(false);
                    options.log('clean undo')
                }
            }
        };

        options = $.extend(defaults, options);

        window.screedOptions = options;

        return this.each(function () {

            var
                $screed = $(this),
                un = {
                    defined: function (some) {
                        return ($.type(some) === 'undefined')
                    }
                },

                select = {

                    add: function (bean) {
                        bean.sel.removeAllRanges();
                        bean.sel.addRange(bean.range);
                    },

                    bean: function (node) {
                        var bean = {
                            sel:   window.getSelection(),
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
                                end:   sel.focusOffset
                            };
                        range.length = (range.start >= range.end) ? (range.start - range.end) : (range.end - range.start);
                        return range
                    },

                    all: function (node) {
                        select.add(select.bean(node));
                    },

                    end: function (node) {
                        var bean = select.bean(node);

                        bean.range.collapse(false);

                        select.add(bean);
                    },

                    to: function (node, bean) {
                        select.add(bean);
                    }

                },

                find = {

                    next: function ($el) {
                        var $next = $el.next().children(0);
                        if (!$next.length) {
                            $next = find.firstInNext($el)
                        }
                        return $next
                    },

                    prev: function ($el, input) {
                        var $prev = $el.prev().children(0);
                        if (!$prev.length) {
                            $prev = find.lastInPrev($el)
                        }
                        if (input) {
                            $prev.trigger('input')
                        }
                        return $prev
                    },

                    firstInNext: function ($el) {
                        var $next = $el.parent().next().find(options.el.ed).first();
                        if (!$next.length) {
                            $next = $el.closest(options.el.scene).next().find(options.el.ed).first()
                        }
                        return $next
                    },

                    lastInPrev: function ($el) {
                        var $prev = $el.parent().prev().find(options.el.ed).last();
                        if (!$prev.length) {
                            $prev = $el.closest(options.el.scene).prev().find(options.el.ed).last()
                        }
                        return $prev
                    }
                },

                jump = {

                    next: function ($el, input) {
                        var $next = find.next($el);
                        $next.focus();
                        if (input) {
                            $next.trigger('input');
                        }
                        return false
                    },

                    prev: function ($el, input) {
                        var $prev = find.prev($el, input);
                        if ($prev.length) {
                            $prev.focus();
                            select.end($prev.get(0))
                        }
                        return false
                    },

                    firstAction: function ($el) {
                        $el.prevAll().last().find(options.el.ed).first().focus();
                        return false
                    },

                    lastAction: function ($el) {
                        $el.nextAll().last().find(options.el.ed).first().focus();
                        return false
                    },

                    prevAction: function ($el) {
                        find.lastInPrev($el).focus();
                        return false
                    },

                    itAction: function ($el) {
                        find.firstInNext($el).focus();
                        return false
                    },

                    toNewNext: function ($el, text) {
                        ed.action($el, text);
                        return jump.next($el, true)
                    },

                    prevScene: function ($el) {
                        $el.closest(options.el.scene).prev().find(options.el.ed).first().focus();
                        return false
                    },

                    nextScene: function ($el) {
                        $el.closest(options.el.scene).next().find(options.el.ed).first().focus();
                        return false
                    },

                    firstScene: function ($el) {
                        $el.closest(options.screed).find(options.el.scene).first().find(options.el.ed).first().focus();
                        return false
                    },

                    lastScene: function ($el) {
                        $el.closest(options.screed).find(options.el.scene).last().find(options.el.ed).first().focus();
                        return false
                    }
                },

                scene = {

                    cut: function ($el, $ed, range) {
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
                        $clone.find(options.el.action).trigger('editable').find(options.el.para).first().attr('class', 'action');
                        $clone.removeAttr('role').find(options.el.ed).first().focus();
                        $ed.trigger('input');
                        return false
                    },

                    glue: function ($el) {
                        var $next = $el.closest(options.el.scene).next();
                        $el.after($next.find(options.el.action).children());
                        $next.remove();
                        $el.children(0).focus().trigger('input');
                        return false
                    },

                    move: {

                        up: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.prev().before($scene);
                            $scene.find(options.el.ed).first().focus().trigger('input');
                            return false
                        },

                        down: function ($el) {
                            var $scene = $el.closest(options.el.scene);
                            $scene.next().after($scene);
                            $scene.find(options.el.ed).first().focus().trigger('input');
                            return false
                        }
                    },

                    shift: {

                        pop: function ($el) {
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
                            $el.children(0).trigger('input');
                            return false
                        },

                        deep: function ($el) {
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
                            $el.children(0).trigger('input');
                            return false
                        }
                    }
                },

                ed = {

                    type: function (e) {
                        var $ed = $(this),
                            $el = $ed.parent();
                        if ($el.is(options.el.para)) {
                            if (un.defined(e.to)) {
                                return ed.style($el, e.dir)
                            } else {
                                $el.attr('class', e.to).children(0).focus().trigger('input')
                            }
                        }
                        if ($el.is(options.el.line)) {
                            if (un.defined(e.to)) {
                                return ed.value($ed, e.dir)
                            } else {
                                $ed.text(e.to).focus().trigger('input')
                            }
                        }
                        return false
                    },

                    focus: function () {
                        var $ed = $(this),
                            $el = $ed.parent();

                        if ($el.is(options.el.para) && ($ed.text() == options.el.empty)) {
                            $ed.html(options.el.sp).trigger('input');
                            /** TODO .caretToStart() */
                        }

                        $screed.trigger({type: 'current', el: $el})
                    },

                    blur: function () {
                        var $ed = $(this),
                            $el = $ed.parent(),
                            remove = function () {
                                $screed.trigger({type: 'current', el: find.prev($el, false).parent()});
                                $el.remove();
                                $screed.trigger('unsaved');
                                return true
                            };

                        ed.normalize($ed);

                        if ($el.is(options.el.para) && !$el.parent().is(options.el.tittle)) {

                            if (($ed.text().length > 1)) {
                                var $para = $ed.find(options.el.para);
                                if ($para.length) {
                                    $para.detach();
                                    $ed.wrapInner(document.createElement(options.el.para));
                                    var $last = $ed.find(options.el.para);
                                    $el.after($last);
                                    $last.addClass('action').trigger('el');
                                    $el.after($para);
                                    $para.trigger('el');
                                    $screed.trigger('unsaved')
                                }
                            }

                            if ($el.siblings().length && ($ed.html() == options.el.sp)) {
                                if (!$el.is('.character')) {
                                    return remove($el)
                                }
                                $ed.text(options.el.empty)
                            }

                        }

                        if (!$ed.text().length) {
                            if ($el.parent().is(options.el.tittle)) {
                                $ed.text(options.el.empty)
                            } else {
                                $ed.html(options.el.sp)
                            }
                        } else {
                            ed.addValue($el);
                        }

                        return true
                    },

                    style: function ($el, dir) {
                        var elClass = options.classesList($el),
                            newClass = ed.offset(options.classes[options.classes.list], elClass, dir);
                        $el.addClass(newClass).removeClass(elClass).children(0).focus().trigger('input');
                        return false
                    },

                    offset: function (list, value, dir) {
                        if (!list) {
                            return value
                        }
                        var currentOffset = $.inArray(value, list),
                            nextOffset = currentOffset + dir;
                        switch (nextOffset) {
                            case list.length:
                                nextOffset = 0;
                                break;
                            case -1:
                                nextOffset = list.length - 1;
                                break;
                        }
                        return list[nextOffset]
                    },

                    value: function ($ed, dir) {
                        var edValue = options.valuesList($ed);
                        $ed.text(ed.offset(options.values.list(), edValue, dir)).focus().trigger('input');
                        return false
                    },

                    addValue: function ($el) {

                        if ($el.text().length < 2) {
                            /*options.log('nothing to add - small');*/
                            return true
                        }
                        var elClass = $el.attr('class'),
                            listClass = '';
                        /*options.log(elClass);*/

                        switch (elClass) {
                            case 'location':
                                listClass = '.scr-menu-location';
                                break;
                            case 'character':
                                listClass = '.scr-menu-character';
                                break;
                            case 'author':
                                /** TODO change in user.info (in screed & in localStorage) */
                                return false;
                                break;
                            case 'contact':
                                /** TODO change in user.info (in screed & in localStorage) */
                                return false;
                                break;
                            default:
                                /*options.log('nothing to add - not l||c');*/
                                return false;
                                break;
                        }

                        var $list = $(options.screed + ' ' + listClass).first(),
                            text = $el.text(),
                            result = false,
                            $li = $list.children();

                        /*options.log('try add: ' + text);*/

                        if (text) {

                            $li.each(function () {
                                if ($(this).text() == text) {
                                    /*options.log('exists: ' + text);*/
                                    result = true
                                }
                            });
                            if (!result) {
                                $list.append('<li>' + text + '</li>');
                                /*options.log('added: ' + text);*/
                            }
                        }
                        return true
                    },

                    action: function ($el, text) {
                        var $p = $(document.createElement(options.el.para)),
                            cls = $el.attr('class');
                        if (text == '') {
                            text = (!un.defined(options.addType[cls]) ? options.addType[cls][1] : options.el.sp)
                        }
                        cls = (!un.defined(options.addType[cls]) ? options.addType[cls][0] : options.addType['default'][0]);
                        $el.after($p);
                        $p.attr('class', cls).text(text).trigger('el')
                    },

                    normalize: function ($ed) {
                        var html = $ed.text();
//                            position = select.position($ed);
                        html = html
                            .replace(/\u00a0/g, '')
                            .replace('/\n/', '')
                            .replace('  ', ' ')
                        ;

                        $ed.text($.trim(html));

                        if (!$ed.text().length) {
                            if ($ed.parent().parent().is(options.el.tittle)) {
                                $ed.text(options.el.empty)
                            } else {
                                $ed.html(options.el.sp)
                            }
                        }

                        if (html !== $ed.text()) {
                            $screed.trigger('unsaved')
                        }
                        /*options.log($ed.text());*/
//                        select.to($ed, position)
                        //$ed.html($ed.html().substring(anchorOffset)+"<inserted>"+$ed.html().substring(0,anchorOffset))
                    },

                    changed: function () {
                        /* ed.normalize($(this)); */
                        var $ed = $(this);
                        $ed.find('br').remove();
                        if (!$ed.text().length) {
                            $ed.html(options.el.sp)
                        }
                        $screed.trigger('unsaved')
                    },

                    keydown: function (event) {
                        /*options.log(event.which);*/
                        var $ed = $(this),
                            tail = '';

                        event.stopPropagation();
                        if (!$ed.is(options.el.ed)) {
                            return true
                        }
                        var $el = $ed.parent(),
                            range = select.range();
                        if (event.ctrlKey && !event.shiftKey) {

                            switch (event.which) {

                                case 13:
                                    /* ctrl + enter - new scene */
                                    if (!$el.is(options.el.line)) {
                                        return scene.cut($el, $ed, range)
                                    }
                                    break;

                                case 32:
                                    /* ctrl + space - autocomplete list for field */
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
                                    $screed.trigger('clean');
                                    return false;
                                    break;

                                case 76:
                                    /* ctrl + l - lock screenplay */
                                    event.preventDefault();
                                    $screed.trigger('lock');
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

                                case 90:
                                    /* ctrl + z - undo */
                                    $screed.trigger('undo');
                                    break;

                                default:
                                    /*options.log(event.which);*/
                                    break
                            }

                        } else if (event.shiftKey && !event.ctrlKey) {

                            switch (event.which) {

                                case 8:
                                    /* shift + backspace - delete, after empty jump to prev */
                                    event.preventDefault();
                                    $ed.trigger({type: 'keydown', which: 8, shiftKey: false, ctrlKey: false});
                                    return false;
                                    break;

                                case 9:
                                    /* shift + tab - change type */
                                    event.preventDefault();
                                    if ($el.parent().is(options.el.tittle)) {
                                        return jump.prev($el)
                                    }
                                    $ed.trigger({type: 'type', dir: -1});
                                    return false;
                                    break;

                                case 13:
                                    /* shift + enter - add <br> ??? need: move text after cursor position to new element */
                                    event.preventDefault();
                                    $ed.trigger({type: 'keydown', which: 13, shiftKey: false, ctrlKey: false});
                                    return false;
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
                                    event.preventDefault();
                                    $ed.trigger({type: 'keydown', which: 46, shiftKey: false, ctrlKey: false});
                                    return false;
                                    break;

                                case 112:
                                    /* shift + f1 - show scenes list */
                                    event.preventDefault();
                                    $screed.trigger('scenes');
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

                        } else if (event.ctrlKey && event.shiftKey) {
                            switch (event.which) {
                                case 83:
                                    /* ctrl + shift + s - save screenplay as standalone html*/
                                    event.preventDefault();
                                    $screed.trigger('alone');
                                    return false;
                                    break;

                                case 90:
                                    /* ctrl + shift + z - redo */
                                    $screed.trigger('redo');
                                    break;
                            }
                        } else {

                            switch (event.which) {

                                case 8:
                                    /* backspace - delete, after empty jump to prev */
                                    if ($el.is(options.el.line) && $el.is('.location')) {
                                        /*$ed.autocomplete('enable');*/
                                        if ($ed.text().length == 0) {
                                            return false
                                        }
                                    }
                                    if ($el.is(options.el.line) && !$el.is('.location')) {
                                        return false
                                    }
                                    if ($el.parent().is(options.el.tittle)) {
                                        $ed.text(options.el.empty);
                                        return jump.prev($el)
                                    }
                                    if ($el.is('.character')) {
//                                        $ed.autocomplete('enable');
                                        return true
                                    }
                                    if ($ed.text().length == 0) {
                                        return jump.prev($el)
                                    }
                                    break;

                                case 9:
                                    /* tab - change style in action and move to next with select all in header */
                                    event.preventDefault();
                                    if ($el.parent().is(options.el.tittle)) {
                                        return jump.next($el)
                                    }
                                    $ed.trigger({type: 'type', dir: 1});
                                    return false;
                                    break;

                                case 13:
                                    /* enter - next, suggestion */
                                    event.preventDefault();
                                    if (!$ed.text().length) {
                                        return false
                                    }
                                    if ($el.is(options.el.line) || ($el.is(options.el.para) && $el.parent().is(options.el.tittle))) {
                                        return jump.next($el)
                                    }

                                    if (range.end == 0) {
                                        tail = $ed.text();
                                        $ed.text(options.el.empty);
                                        return jump.toNewNext($el, tail)
                                    }
                                    tail = $ed.text().substr(range.end);
                                    var lost = $ed.text().substr(0, range.end);
                                    if (lost == '') {
                                        lost = options.el.empty;
                                    }
                                    $ed.text(lost);
                                    return jump.toNewNext($el, tail);
                                    break;

                                case 27:
                                    /* escape - revert changes, blur without change */
                                    event.stopPropagation();
                                    options.onEscape();
                                    $ed.blur();
                                    event.preventDefault();
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
                                    if ($el.is(options.el.line) &&
                                        range.end == 0 && !$el.prev().is(options.el.line) &&
                                        $el.closest(options.el.scene).prev().is(options.el.tittle + ':hidden')) {
                                        return false
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
                                        /*                                        $ed.autocomplete('enable');*/
                                        return false
                                    }
                                    if (!$ed.text().length) {
                                        /*                                        $ed.autocomplete('enable');*/
                                        return true
                                    }
                                    if ($el.is(options.el.line)) {
                                        /*                                        if ($ed.autocomplete('option', 'disabled')) {*/
                                        return jump.itAction($el);
                                        /*
                                         } else {
                                         return true
                                         }
                                         */
                                    }
                                    if (range.end == $ed.text().length) {
                                        /*                                        if ($ed.autocomplete('option', 'disabled')) {*/
                                        return jump.next($el);
                                        /*
                                         } else {
                                         return true
                                         }
                                         */
                                    }
                                    break;

                                case 46:
                                    /* delete - delete, after empty jump to next */
                                    if ($el.is(options.el.line) && $el.is('.location')) {
                                        /*$ed.autocomplete('enable');*/
                                        if ($ed.text().length == 0) {
                                            return false
                                        }
                                    }
                                    if ($el.is(options.el.line) && !$el.is('.location')) {
                                        return false
                                    }
                                    if ($el.parent().is(options.el.tittle)) {
                                        $ed.text(options.el.empty);
                                        return jump.next($el)
                                    }
                                    if ($el.is('.character')) {
//                                        $ed.autocomplete('enable');
                                        return true
                                    }
                                    if ($ed.text().length == 0) {
                                        return jump.next($el)
                                    }
                                    return true;
                                    break;

                                case 112:
                                    /* f1 - show hotkeys help */
                                    event.preventDefault();
                                    options.onHelp();
                                    return false;
                                    break;

                                default:
                                    /*
                                     $ed.autocomplete('enable');
                                     */
                                    return true
                            }
                        }
                        return true
                    }

                },

                editable = {

                    tittle: function () {
                        var $tittle = $(this);
                        editable.prep($tittle.prop('contentEditable', false), options.el.para);
                        $tittle.on('input' + options.screed + 'Title', '.title', function () {

                            options.title($(this).text());

                        })
                    },

                    head: function () {
                        editable.prep($(this).prop('contentEditable', false), options.el.line)
                    },

                    action: function () {
                        editable.prep($(this).prop('contentEditable', true), options.el.para)
                    },

                    prep: function ($section, find) {
                        $section.find(find).trigger('el')
                    },

                    el: function (e) {
                        e.stopPropagation();
                        var $el = $(this),
                            elClass = $el.attr('class'),
                            $ed = $(document.createElement(options.el.ed)).prop('contentEditable', true);
                        $el
                            .prop('contentEditable', false)
                            .removeAttr('style')
                            .html($el.text())
                            .wrapInner($ed);
                        if (!$.inArray(elClass, options.classes.all)) {
                            $el.attr('class', 'action')
                        }
                    }
                },

                screed = {

                    init: function () {
                        var $screed = $(this);
                        options.title($screed.find('.title').text());
                        if (!screed.is.locked()) {
                            $screed.find(options.el.tittle + ', ' + options.el.head + ', ' + options.el.action).trigger('editable')
                        }
                        screed.is.saved();
                        return $screed
                    },

                    begin: function () {
                        $screed.parent().data('clean.undo', false);
                        options.log('first save for undo');
                        options.edit.save($screed.parent().html())
                    },

                    current: function (e) {
                        var $screed = $(this),
                            currentClass = options.el.current.substr(1);
                        options.onCurrent(e.el);
                        $screed.find(options.el.current).removeClass(currentClass);
                        if (!un.defined(e.el)) {
                            e.el.children(0).addClass(currentClass);
                        }
                        /*
                         var n = '';
                         $screed.find(options.el.current).closest(options.el.scene).each(function () {
                         n = n + '\n' + getComputedStyle(this, ':before').content
                         });
                         console.log(n);
                         */
                        return $screed
                    },

                    currentFocus: function () {
                        var $screed = $(this),
                            normal = function ($screed) {
                                return $screed.find(options.el.current)
                            },
                            first = function ($screed) {
                                screed.is.begin();
                                return $screed.find(options.el.scene + ' ' + options.el.ed).first()
                            },
                            init = function () {
                                $screed.trigger('init');
                                screed.is.begin();
                                return normal($screed)
                            },
                            $current = normal($screed);

                        if (!$current.length) {
                            $current = first($screed)
                        }
                        if (!$current.length) {
                            $current = init();
                        }
                        $current.focus();
                        return $screed
                    },

                    tittleFocus: function () {
                        var $screed = $(this),
                            $tittle = $screed.find(options.el.tittle);
                        if ($tittle.is(':hidden')) {
                            $tittle.removeClass('hidden').find(options.el.ed).first().focus();
                            $screed.removeClass('scr-collapsed')
                        } else {
                            $tittle.addClass('hidden');
                            $screed.addClass('scr-collapsed').find(options.el.scene + ' ' + options.el.ed).first().focus()
                        }
                        return $screed
                    },

                    is: {

                        begin: function () {
                            if (!$screed.parent().data('clean.undo')) {
                                options.edit.clean();
                            }
                            screed.begin()
                        },

                        locked: function () {
                            if (options.user.info.id !== $screed.data('user').id) {
                                $screed.addClass('locked');
                                options.onLocked(true)
                            } else {
                                options.onLocked(false)
                            }
                            var locked = $screed.is('.locked');
                            options.onLock(locked);
                            if (locked) {
                                options.notify.info(options.say.screedIsLocked);
                                return true
                            }
                            return false
                        },

                        saved: function () {
                            if (!$screed.is('.saved')) {
                                /*options.notify.info(options.say.screedUnsaved);*/
                                options.onUnsaved();
                                return false
                            }
                            options.onSaved(false);
                            return true
                        },

                        empty: function () {
                            if ($screed.is('.empty')) {
                                options.notify.info(options.say.screedIsEmpty);
                                return true
                            }
                            return false
                        }
                    },

                    plain: function () {
                        var $screed = $(this);
                        $screed.html(options.restore($screed));
                        return $screed
                    },

                    encode: function ($screed) {

                        var code = {screed: [
                            {id: $screed.attr('id')}
                        ]};
                        $screed
                            .children().each(function (s, sEl) {
                                var $s = $(sEl),
                                    oS = {n: sEl.nodeName.toLowerCase(), c: $s.attr('class'), r: $s.attr('role')},
                                    tS = [];

                                $s.children().each(function (u, uEl) {
                                    var $u = $(uEl),
                                        oU = {n: uEl.nodeName.toLowerCase(), c: $u.attr('class')},
                                        tU = [];

                                    $u.children().each(function (p, pEl) {
                                        var $p = $(pEl);

                                        tU.push({h: {n: pEl.nodeName.toLowerCase(), c: $p.attr('class')}, t: $p.text()})
                                    });

                                    tS.push({h: oU, t: tU})
                                });

                                code.screed.push({h: oS, t: tS});
                            });

                        return code;
                    },

                    decode: function () {

                    },

                    saved: function (event) {
                        $(this).addClass('saved');
                        options.onSaved(event.file);
                    },

                    unsaved: function () {
                        var $screed = $(this);
                        $screed.removeClass('saved');
                        options.onUnsaved();
                        var screed = $screed.parent().html();
                        options.edit.save(screed);
                        options.autoSave(screed, $('.title', $screed).first().text())
                    },

                    save: function () {
                        var $screed = $(this);
                        if (!screed.is.saved()) {
                            var afterWrite = function (file) {
                                    $screed.trigger({type: 'saved', file: file})
                                },

                                forSave = function ($screed) {
                                    return '<?xml version="1.0" encoding="utf-8"?>\n' +
                                        '<article data-user=\'' + JSON.stringify(options.user.info) + '\' class="' + $screed.attr('class') + '">\n' +
                                        options.restore($screed.clone()) +
                                        '</article>'
                                },

                                fileData = function ($screed) {
                                    return options.fileData($screed, $screed.find('.title').text() + ' by ' + $screed.find('.author').text())
                                };
//                            options.ask($('<textarea style="width: 500px; height: 350px;">'+JSON.stringify(screed.encode($screed))+ '</textarea>'), $.noop);

                            options.onSave(fileData($screed), forSave($screed), afterWrite);
                        }
                        return $screed
                    },

                    alone: function () {
                        var $screed = $(this);
                        var afterWrite = function (file) {

                            },

                            forSave = function ($screed, style) {
                                var $items = $('<div>' + options.restore($screed.clone()) + '</div>'),
                                    num = 1,
                                    deep = 1;
                                $items
                                    .find('.parenthetical').each(function () {
                                        var $p = $(this);
                                        $p.text('(' + $p.text() + ')')
                                    }).end()
                                    .find('.where').each(function () {
                                        var $p = $(this);
                                        $p.text($p.text() + '.')
                                    }).end()
                                    .find('.location').each(function () {
                                        var $p = $(this);
                                        $p.text($p.text() + ' -')
                                    }).end()
                                    .find('.titr').each(function () {
                                        $(this).before($(document.createElement(options.el.para)).attr('class', 'b-titr').text('titr:'))
                                    }).end()
                                    .find(options.el.scene).each(function () {
                                        var $scene = $(this),
                                            text = '';
                                        if ($scene.is('[role]')) {
                                            text = num + '.' + deep;
                                            deep++;
                                            num++
                                        } else {
                                            deep = 1;
                                            text = num
                                        }
                                        $scene.prepend($(document.createElement(options.el.para)).attr('class', 'scr-scene-num').text(text))
                                    }).end()
                                    .find('.scr-first-page')
                                    .after('<br style="ms-special-character:line-break;page-break-after:always" />')
                                    .end()
                                ;

                                return '<!DOCTYPE html>\n' +
                                    '<html>' +
                                    '<head>' +
                                    '<meta charset="UTF-8"/>' +
                                    '<title>' + $screed.find('.title').text() + ' - Screed</title>' +
                                    '<style type="text/css">' +
                                    style + /* TODO minify! */
                                    '</style>' +
                                    '</head>' +
                                    '<body class="scr-alone">' +
                                    '<div class="scr-ribbon">' +
                                    '<article class="screed">\n' +
                                    $items.html() +
                                    '</article>' +
                                    '</div>' +
                                    '<footer><a class="scr-go" href="http://screed.pro">Screed</a></footer>' +
                                    '</body>' +
                                    '</html>'
                            },

                            fileData = function ($screed) {
                                return $screed.find('.title').text() + ' by ' + $screed.find('.author').text() + '-screed'
                            };
                        $.get(options.stylePath, function (style) {
                            options.onSave(fileData($screed), forSave($screed, style), afterWrite, true);
                        });
                        return $screed
                    },

                    open: function () {
                        var $screed = $(this),

                            doOpen = function (result) {
                                if (result) {
                                    options.onOpen(options.replace);
                                    options.edit.clean()
                                }
                            };

                        if (!screed.is.saved()) {
                            options.confirm(options.say.openOther, doOpen)
                        } else {
                            doOpen(true)
                        }
                        return $screed
                    },

                    clean: function () {
                        var doClean = function (result) {
                            if (result) {
                                options.onClean(options.replace);
                                options.edit.clean()
                            }
                        };

                        if (!screed.is.saved()) {
                            options.confirm(options.say.beginNew, doClean)
                        } else {
                            doClean(true)
                        }
                        return $screed
                    },

                    print: function () {
                        window.print();
                        return $screed
                    },

                    scenes: function () {
                        options.notify.error(options.say.notImplemented);
                        return $screed
                    },

                    lock: function () {
                        var $screed = $(this);
                        if ($screed.data('user').id !== options.user.info.id) {
                            return false
                        }
                        $screed.toggleClass('locked');
                        if ($screed.is('.locked')) {
                            $screed.trigger('plain');
                            options.onLock(true);
                        } else {
                            $screed.trigger('init');
                            options.onLock(false);
                        }
                        return false
                    },

                    undo: function () {
                        var undo = options.edit.undo();
                        if (undo) {
                            options.replace(undo, false);
                        }
                    },

                    redo: function () {
                        var redo = options.edit.redo();
                        if (redo) {
                            options.replace(redo, false);
                        }
                    }

                };

            $screed

                .on('keydown' + options.screed, options.el.ed, ed.keydown)
                .on('blur' + options.screed, options.el.ed, ed.blur)
                .on('focus' + options.screed, options.el.ed, ed.focus)
                .on('input' + options.screed, options.el.ed, ed.changed)
                .on('type' + options.screed, options.el.ed, ed.type)

                .on('editable' + options.screed, options.el.tittle, editable.tittle)
                .on('editable' + options.screed, options.el.head, editable.head)
                .on('editable' + options.screed, options.el.action, editable.action)

                .on('el' + options.screed, options.el.line, editable.el)
                .on('el' + options.screed, options.el.para, editable.el)

                .on('init' + options.screed, screed.init)

                .on('clean' + options.screed, screed.clean)
                .on('open' + options.screed, screed.open)
                .on('save' + options.screed, screed.save)
                .on('alone' + options.screed, screed.alone)
                .on('lock' + options.screed, screed.lock)
                .on('plain' + options.screed, screed.plain)
                .on('print' + options.screed, screed.print)
                .on('scenes' + options.screed, screed.scenes)

                .on('saved' + options.screed, screed.saved)

                .on('unsaved' + options.screed, screed.unsaved)
                .on('undo' + options.screed, screed.undo)
                .on('redo' + options.screed, screed.redo)

                .on('current' + options.screed, screed.current)
                .on('currentFocus' + options.screed, screed.currentFocus)
                .on('tittleFocus' + options.screed, screed.tittleFocus);

            if (options.autoStart) {
                $screed.trigger('init')
            } else {
                screed.is.saved()
            }
        })
    }

})(jQuery);
