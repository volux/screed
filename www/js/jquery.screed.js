/*!
 --------------------------------------------------------------------
 jQuery Screed plugin
 Author: Andrey Skulov <screed@volux.ru>
 Copyright (c) 2013 volux.ru
 licensed under MIT (volux.ru/ref/mit-license.txt)
 --------------------------------------------------------------------
 */
;
(function ($, window, document, undefined) {

    "use strict";

    /**
     r     * TODO all custom objects move to namespace volux
     * like volux.Screed etc.
     **/
    window.screedPhrases = window.screedPhrases || {};
    window.screedLists = window.screedLists || {};
    window.lang = $('html').attr('lang') || 'ru';
    window.screedUIBlock = false;

    var pluginName = 'screed',
        phrases = $.extend({

            ru: {
                initError:        'Меня создали для современных браузеров!',
                notImplemented:   'Неужели ещё не дописан код?!',
                needOuterAppImpl: 'Здесь необходима реализация в окружающем приложении',
                screedIsLocked:   'Сценарий закрыт для изменений',
                screedUnSaved:    'Сценарий не сохранён',
                screedIsEmpty:    'Сценарий пуст',
                openOther:        'открыть другой',
                beginNew:         'начать новый',
                info:             'Инфо',
                success:          'Ок',
                error:            'Ошибка',
                characterHasText: 'Персонаж уже имеет текст',
                screedWrong:      'Загруженный объект не является сценарием Screed'
            },

            en: {
                initError:        'Screed created for modern browsers!',
                notImplemented:   'Really not even wrote the whole code?!',
                needOuterAppImpl: 'Need outer application implementation',
                screedIsLocked:   'Screenplay locked for changes',
                screedUnSaved:    'Screenplay not saved',
                screedIsEmpty:    'Screenplay empty',
                openOther:        'open another',
                beginNew:         'begin new',
                info:             'Info',
                success:          'Ok',
                error:            'Error',
                screedWrong:      'Loaded object is not the Screed document'
            }
        }, window.screedPhrases),

        /** TODO move in configurable scope */
            lists = $.extend({
            ru: {
                where: ['инт', 'нат', 'инт/нат', 'нат+инт'],
                when:  ['день', 'ночь', 'утро', 'вечер', 'рассвет', 'закат']
            },

            en: {
                where: ['int', 'nat', 'int/nat', 'nat+int'],
                when:  ['day', 'night', 'morning', 'evening', 'sunrise', 'sunset']
            }
        }, window.screedLists)
        ;

    var Screed = function (element, userOptions) {


        this.defaults = {
            el:  {
                screed:     '.' + pluginName,
                paper:      '.scr-paper',
                screedDoc:  'screed',
                cover:      'cover',
                title:      '.title',
                author:     '.author',
                contact:    '.contact',
                scene:      'scene',
                head:       'header',
                field:      'span',
                where:      '.where',
                when:       '.when',
                location:   '.location',
                action:     'action',
                para:       'p',

                ed:         'tt',
                sp:         ''/*'&nbsp;'*/, /*&#160;*/
                empty:      ''/*'…'*/,
                current:    '.scr-current'
            },
            cssPath: '/css/' + pluginName + '.css'
        };

        this.$area = $(element).addClass(pluginName);

        this.options = $.extend({}, this.defaults, (typeof userOptions == 'object') ? userOptions : {}, this.$area.data(pluginName + '-options'));

        var screed = this;

        this.say = phrases[window.lang];

        this.$paper = $('<div class="' + this.options.el.paper.substr(1) + '"></div>').appendTo(this.$area);

        this.clipCleaner = function ($clip) {

            return $clip
        };

        this.doc = new ScreedDoc(this);
        this.state = new State(this);
        this.select = new Select(this, this.clipCleaner);

        this.status = {
            saved: true
        };

        /**
         * local log
         * @param msg
         */
        this.log = function (msg) {

            screed.$area.trigger({type: 'log', msg: msg})
        };

        this.trigger = function (event) {

            return screed.$area.trigger(event);
        };

        this.find = function (selector) {

            return screed.$area.find(selector);
        };

        this.current = function () {

            return screed.$area.find(screed.options.el.current).first() || screed.$area.find(screed.options.el.scene + ' ' + screed.options.el.ed).first()
        };

        this.getScreed = function (isHtml) {

            isHtml = isHtml || false;
            if (isHtml) {
                return screed.getScreedForShare()
            }
            return screed.$paper.html()
        };

        this.getScreedForShare = function () {

            var $conteiner = $('<div/>'),
                num = 1,
                deep = 1;
            $conteiner
                .append(this.doc.paperToPlainHtml(screed.$paper.clone()))

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

                    $(this).before($(document.createElement(screed.options.el.para)).attr('class', 'b-titr').text('titr:'))
                }).end()

                .find(screed.options.el.scene).each(function () {

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
                    $scene.prepend($(document.createElement(screed.options.el.para)).attr('class', 'scr-scene-num').text(text))
                }).end()

                .find('.scr-first-page')
                .after('<br style="ms-special-character:line-break;page-break-after:always" />')
                .end()
            ;

            return '<!DOCTYPE html>\n' +
                '<html>' +
                '<head>' +
                '<meta charset="UTF-8"/>' +
                '<title>' + $conteiner.find('.title').text() + ' - Screed</title>' +
                '<style type="text/css">' +
                this.css + /** TODO minify! */
                '</style>' +
                '</head>' +
                '<body class="scr-share">' +
                '<div class="' + screed.options.el.paper.substr(1) + '">' +
                $conteiner.html() +
                '</div>' +
                '<footer><a class="scr-go" href="//screed.pro">Screed</a></footer>' +
                '</body>' +
                '</html>'
        };

        this.on = {

            ed: {

                keyup: function (event) {

                    $(event.currentTarget).attr('data-pos', screed.select.event(event).caret());
                    /*
                     if (!event.ctrlKey && !event.shiftKey) {

                     switch (event.which) {

                     }
                     }
                     */
                },

                keydown: function (event) {

                    /**
                     * TODO think about generating where triggers only
                     * like case 13: $ed.trigger('keyEnter')
                     * and catch it in any level listeners
                     * f.e. listen for el.ed + el.field
                     * */
                    /* screed.log(event.which); */
                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        tail = '',
                        jump = new Jump($el, screed),
                        select = screed.select.select();

                    /*console.log(select)*/
                    if (event.ctrlKey && !event.shiftKey) {

                        switch (event.which) {

                            case 13:
                                /* ctrl + enter - new scene */
                                if ($el.parent().is(el.cover)) {

                                    return jump.next()
                                }
                                if (!$el.is(el.field)) {

                                    $ed.trigger({type: 'scene', select: select});
                                    return false
                                }
                                break;

                            case 32:
                                /* ctrl + space - autocomplete list for field */
                                if ($el.parent().is(el.cover)) {

                                    return false
                                }
                                return !$el.is(el.field);
                                break;

                            case 35:
                                /* ctrl + end - last scene */
                                return jump.lastScene();
                                break;

                            case 36:
                                /* ctrl + home - first scene */
                                return jump.firstScene();
                                break;

                            case 37:
                                /* ctrl + left - PopScene(tm) :)  */
                                event.preventDefault();
                                $ed.trigger('pop');
                                return false;
                                break;

                            case 39:
                                /* ctrl + right - DeepScene(tm) :)  */
                                event.preventDefault();
                                $ed.trigger('deep');
                                return false;
                                break;

                            case 46:
                                /* ctrl + del - glue with next scene */
                                $ed.trigger('glue');
                                return false;
                                break;

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
                                /* shift + tab - change type || value */
                                event.preventDefault();
                                if ($el.parent().is(el.cover)) {

                                    return jump.prev()
                                }
                                $ed.trigger({type: 'tab', dir: -1});
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
                                if ($el.is(el.field)) {

                                    $ed.trigger('up');
                                    return false
                                }
                                return false;
                                break;

                            case 34:
                                /* shift + page down - move scene down */
                                event.preventDefault();
                                if ($el.is(el.field)) {

                                    $ed.trigger('down');
                                    return false
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

                            case 38:
                                /* shift + up - continue selection */
                                return true;
                                break;

                            case 46:
                                /* shift + delete - delete, after empty jump to next */
                                event.preventDefault();
                                $ed.trigger({type: 'keydown', which: 46, shiftKey: false, ctrlKey: false});
                                return false;
                                break;

                            case 113:
                                /* shift + f2 - focus to tittle */
                                event.stopPropagation();
                                screed.trigger('coverFocus');
                                return false;
                                break
                        }

                    } else if (event.ctrlKey && event.shiftKey) {

                        switch (event.which) {

                            /*
                             case 90:
                             */
                            /* ctrl + shift + z - redo *//*

                         event.preventDefault();
                         return true;
                         break;
                         */
                        }

                    } else {

                        switch (event.which) {

                            case 8:
                                /* backspace - delete, after empty jump to prev */
                                event.stopPropagation();
                                if ($el.is(el.field) && $el.is(el.location)) {
                                    /*$ed.autocomplete('enable');*/
                                    if ($ed.text().length == 0) {
                                        event.preventDefault();
                                        return false
                                    }
                                }
                                if ($el.is(el.field) && !$el.is(el.location)) {

                                    return false
                                }
                                if ($el.parent().is(el.cover) && ($ed.text().length == 0)) {

                                    $ed.text(el.empty);
                                    return jump.left()
                                }
                                if ($el.is('.character') && $ed.text().length) {
                                    /* $ed.autocomplete('enable'); */
                                    return true
                                }
                                if ($ed.text().length == 0) {

                                    return jump.left()
                                }
                                if (select.end == 0) {
                                    var $start = jump.find.prev();
                                    if (!$start.parent().is(el.para)) {
                                        return false
                                    }
                                    var start = $start.text();
                                    $ed.text(start + $ed.text());
                                    screed.select.event(event).move(start.length);
                                    $start.parent().remove();
                                    screed.trigger('changed');
                                    return false
                                } else {
                                    if (select.length) {
                                        screed.select.delete();
                                        screed.trigger('changed')
                                    }
                                }
                                break;

                            case 9:
                                /* tab - change style in action and move to next with select all in header */
                                event.preventDefault();
                                if ($el.parent().is(el.cover)) {

                                    return jump.next()
                                }
                                $ed.trigger({type: 'tab', dir: 1});
                                return false;
                                break;

                            case 13:
                                /* enter - next, suggestion */
                                event.preventDefault();
                                /*
                                 if (!$ed.text().length) {

                                 return false
                                 }
                                 */
                                if ($el.is(el.field) || ($el.is(el.para) && $el.parent().is(el.cover))) {

                                    return jump.right()
                                }
                                if (select.end == 0) {

                                    tail = $ed.text();
                                    $ed.text(el.empty);
                                    return jump.toNewNext(tail)
                                }
                                tail = $ed.text().substr(select.end);

                                var lost = $ed.text().substr(0, select.end);

                                if (lost == '') {

                                    lost = el.empty;
                                }
                                $ed.text(lost);
                                return jump.toNewNext(tail);
                                break;

                            case 27:
                                /* escape - revert changes, blur without change */
                                $ed.blur();
                                screed.trigger('escape');
                                return true;
                                break;

                            case 33:
                                /* page up - prev scene */
                                event.preventDefault();
                                return jump.prevScene();
                                break;

                            case 34:
                                /* page down - next scene */
                                event.preventDefault();
                                return jump.nextScene();
                                break;

                            case 37:
                                /* go left */
                                if ($el.is(el.field) && !$ed.text().length) {

                                    return false
                                }
                                if ($el.is(el.field) &&

                                    select.end == 0 && !$el.prev().is(el.field) &&
                                    $el.closest(el.scene).prev().is(el.cover + ':hidden')) {
                                    return false
                                }
                                if (select.end == 0) {

                                    return jump.left()
                                }
                                break;

                            case 38:
                                /* go up */
                                if ($el.is(el.field) && !$ed.text().length) {

                                    return false
                                }
                                if ($el.is(el.field)) {

                                    return jump.prevAction()
                                }
                                if (select.end == 0) {

                                    return jump.prev()
                                }
                                break;

                            case 39:
                                /* go right */
                                if ($el.is(el.field) && !$ed.text().length) {

                                    return false
                                }
                                if (select.end == $ed.text().length) {

                                    return jump.right()
                                }
                                break;

                            case 40:
                                /* go down */
                                if ($el.is(el.field) && !$ed.text().length) {
                                    /* $ed.autocomplete('enable');*/
                                    return false
                                }
                                if (!$ed.text().length) {
                                    /* $ed.autocomplete('enable');*/
                                    return true
                                }
                                if ($el.is(el.field)) {
                                    /* if ($ed.autocomplete('option', 'disabled')) {*/
                                    return jump.itAction();
                                    /*
                                     } else {
                                     return true
                                     }
                                     */
                                }
                                if (select.end == $ed.text().length) {
                                    /* if ($ed.autocomplete('option', 'disabled')) {*/
                                    return jump.next();
                                    /*
                                     } else {
                                     return true
                                     }
                                     */
                                }
                                break;

                            case 46:
                                /* delete - delete, after empty jump to next */
                                if ($el.is(el.field) && $el.is(el.location)) {
                                    /* $ed.autocomplete('enable'); */
                                    if ($ed.text().length == 0) {
                                        event.preventDefault();
                                        return false
                                    }
                                }
                                if ($el.is(el.field) && !$el.is(el.location)) {

                                    return false
                                }
                                if ($el.parent().is(el.cover) && ($ed.text().length == 0)) {

                                    $ed.text(el.empty);
                                    return jump.right()
                                }
                                if ($el.is('.character') && $ed.text().length) {
                                    /* $ed.autocomplete('enable'); */
                                    return true
                                }
                                if ($ed.text().length == 0) {

                                    return jump.right()
                                }
                                if (select.end == $ed.text().length) {
                                    var $tail = jump.find.next();
                                    if (!$tail.parent().is(el.para)) {
                                        return false
                                    }
                                    tail = $tail.text();
                                    $ed.text($ed.text() + tail);
                                    screed.select.event(event).move(select.end);
                                    $tail.parent().remove();
                                    screed.trigger('changed');
                                    return false
                                }
                                break;
                        }
                    }
                    return true
                },

                blur: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        jump = new Jump($el, screed),
                        remove = function ($el) {
                            jump.any();
                            $el.remove();
                            screed.trigger('changed');
                            return false
                        };

                    /*                    $ed.text($.trim($ed.text()));*/

                    if ($el.is(el.para) && !$el.parent().is(el.cover)) {

                        if (($ed.text().length > 1)) {

                            var $para = $ed.find(el.para);

                            if ($para.length) {

                                $para.detach();
                                $ed.wrapInner(document.createElement(el.para));
                                var $last = $ed.find(el.para);

                                $el.after($last);
                                $last.addClass('action').trigger('editable');
                                $el.after($para);
                                $para.trigger('editable');
                                screed.trigger('changed')
                            }
                        }

                        if ($el.siblings().length && ($ed.text() == '')) {

                            return remove($el);
                        }

                    }

                    if ($ed.text().length) {

                        $ed.trigger('store');
                    }

                    if ($el.data('orig') !== $ed.html()) {

                        screed.trigger('changed')
                    }

                    return true
                },

                focusin: function (event) {

//                    event.stopPropagation();
                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        pos = $ed.attr('data-pos'),
                        to = 0;

                    if (pos) {
                        screed.select.event(event);
                        switch (pos) {

                            case 'start':
                                to = 0;
                                break;

                            case 'end':
                                to = $ed.text().length;
                                break;

                            default:
                                if (pos > $ed.text().length) {
                                    to = $ed.text().length
                                } else {
                                    to = pos
                                }
                                break;
                        }
                        screed.select.move(to);
                        $ed.attr('data-pos', to)
                    }

                    $ed.trigger('current');

                    if ($el.is(el.para) && ($ed.text() == el.empty)) {
                        $ed.text('');
                    }
                    $el.data('orig', $ed.html());
//                    $ed.trigger('normalize');
                    return true
                },

                input: function (event) {

                    $(event.currentTarget).trigger('normalize');
                    return false
                },

                normalize: function (event) {

                    var $ed = $(event.currentTarget),
                        text = $ed.text(),
                        el = screed.options.el,
                        caret = screed.select.event(event).caret()
                        ;
                    text = text
                        .replace(/\u00a0/g, "")
                        .replace(/\s+/g, " ")
                        .replace('/\n/g', "")
                    ;
                    $ed.text(text);

                    if ($ed.text().length == 0) {

                        if ($ed.parent().parent().is(el.cover)) {
                            $ed.text(el.empty)
                        }/* else {
                         $ed.html(el.sp)
                         }*/
                    }
                    /*
                     if (text !== $ed.text()) {

                     $ed.trigger('changed')
                     }
                     */
                    if (caret > $ed.text().length) {
                        caret = $ed.text().length
                    }
                    screed.select.move(caret);
                    $ed.attr('data-pos', caret);

                    return false
                },

                tab: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el;

                    if ($el.is(el.para)) {

                        if (event.to === undefined) {

                            $ed.trigger({type: 'style', dir: event.dir});

                        } else {

                            $el.attr('class', event.to).children(0).focus().trigger('changed')
                        }
                    }
                    if ($el.is(el.field)) {

                        if (event.to === undefined) {

                            $ed.trigger({type: 'value', dir: event.dir});

                        } else {

                            $ed.text(event.to).focus().trigger('changed')
                        }
                    }
                    return false
                },

                scene: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        select = event.select,
                        anchor = 'scr-anchor';

                    if ($ed.text().length == 1) {
                        $ed.text(el.empty)
                    }
                    $el.addClass(anchor);

                    var $scene = $el.closest(el.scene),
                        $clone = $scene.clone(),
                        andMe = false,
                        len = $ed.text().length;

                    $el.removeClass(anchor);
                    if (select.end == 0) {
                        andMe = true
                    }
                    $el.nextAll().remove();
                    if (andMe) {
                        if (len && $el.siblings().length) {
                            $el.remove()
                        } else {
                            $el.text(el.empty).trigger('editable')
                        }
                    }
                    $scene.after($clone);
                    var $al = $clone.find('.' + anchor).removeClass(anchor);
                    $al.prevAll().remove();
                    if (!andMe) {
                        if ($al.siblings().length) {

                            $al.remove()

                        } else {

                            $al.text(el.empty).trigger('editable')
                        }
                    }
                    $clone.find(el.field).trigger('editable');
                    $clone.find(el.para).trigger('editable').first().attr('class', 'action');
                    $clone.removeAttr('role').find(el.ed).first().focus().trigger('scenes');
                    $ed.trigger('changed');
                    return false
                },

                glue: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        $next = $el.closest(el.scene).next();

                    $el.after($next.find(el.action).children());
                    $next.remove();
                    $ed.focus().trigger('changed').trigger('scenes');
                    return false
                },

                up: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        $scene = $el.closest(el.scene);

                    $scene.prev().before($scene);
                    $scene.find(el.ed).first().focus().trigger('changed').trigger('scenes');
                    return false
                },

                down: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        $scene = $el.closest(el.scene);

                    $scene.next().after($scene);
                    $scene.find(el.ed).first().focus().trigger('changed').trigger('scenes');
                    return false
                },

                pop: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        $scene = $el.closest(el.scene);

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
                    $ed.trigger('changed').trigger('scenes');
                    return false
                },

                deep: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        el = screed.options.el,
                        $scene = $el.closest(el.scene);

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
                    $ed.trigger('changed').trigger('scenes');
                    return false
                },

                after: function (event) {

                    var $el = $(event.currentTarget).parent(),
                        el = screed.options.el,
                        $p = $(document.createElement(el.para)),
                        cls = $el.attr('class'),
                        text = event.text;

                    if (text == '') {
                        text = (screed.doc.afterType[cls]) ? screed.doc.afterType[cls][1] : el.sp
                    }
                    cls = (screed.doc.afterType[cls]) ? screed.doc.afterType[cls][0] : screed.doc.afterType['default'][0];
                    $el.after($p);
                    $p.attr('class', cls).text(text).trigger('editable');
                    screed.trigger('changed');
                },

                cut: function (event) {

                    event.preventDefault();
                    screed.select.event(event).cut();
                    return true
                },

                copy: function (event) {

                    event.preventDefault();
                    screed.select.event(event).copy();
                    return false
                },

                paste: function (event) {

                    event.preventDefault();
                    screed.select.event(event).paste();
                    return false
                }
            },

            self: {

                changed: function (/*event*/) {

                    screed.status.saved = false;
                    screed.state.save(screed.getScreed());
                    return true
                },

                undo: function (/*event*/) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    var undo = screed.state.undo();

                    if (undo) {
                        screed.current().blur();
                        screed.doc.setScreed($(undo), {})
                    }
                    return false
                },

                redo: function (/*event*/) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    var redo = screed.state.redo();

                    if (redo) {
                        screed.current().blur();
                        screed.doc.setScreed($(redo), {})
                    }
                    return false
                },

                setScreed: function (event) {

                    screed.doc.setScreed(event.$doc, event.user);
                },

                /*
                 autoSave: function (event) {

                 if (event.state) {
                 return true
                 }
                 event.state = screed.getScreed();
                 return true
                 },
                 */

                screedEmpty: function (/*event*/) {

                    screed.state.clean();
                    screed.$area.data('clean.undo', true);
//                    screed.log('clean undo');
                    screed.state.save(screed.getScreed());
                    screed.status.saved = false;
                    return true
                },

                screedSaved: function () {

                    screed.status.saved = true;
                },

                screedUnSaved: function () {

                    screed.status.saved = false;
                },

                screedWrong: function () {

                    screed.trigger({type: 'notify', as: {type: 'error', text: screed.say.screedWrong}})
                },

                currentFocus: function (/*event*/) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    screed.doc.trigger('currentFocus');
                    return true
                },

                coverFocus: function (event) {
                    if (window.screedUIBlock) {
                        return false
                    }
                    screed.doc.trigger(event);
                    return true
                }

            }
        };

        /**
         *
         * @private
         */
        this._listenEvents = function () {

            var el = screed.options.el,
                listener;

            for (listener in screed.on.ed) {
                //noinspection JSUnfilteredForInLoop
                screed.$area
                    .on(listener, el.ed, screed.on.ed[listener])
            }

            for (listener in screed.on.self) {
                //noinspection JSUnfilteredForInLoop
                screed.$area
                    .on(listener, screed.on.self[listener])
            }
        };

        this._listenEvents();

        return this
    };

    $.fn.screed = function (userOptions) {

        return this.each(function () {

            if (!$.data(this, pluginName)) {

                $.data(this, pluginName, new Screed(this, userOptions));
            }
        });
    };

    /*
     --------------------------------------------------------------------
     ScreedDoc definitions
     --------------------------------------------------------------------
     */

    var ScreedDoc = function (screed) {

        var sp = this,
            el = screed.options.el;

        this.$paper = screed.$paper;

        this.lists = lists[window.lang];

        this.file = {
            local: {
                name: ''
            },
            picker: {
                url: '',
                filename: '',
                mimetype: '',
                size: 0,
                isWriteable: true
            },
            dates: {
                created:  moment().valueOf(),
                modified: null,
                saved:    null
            }
        };

        this.setFileData = function () {

            sp.$doc.attr('data-file', JSON.stringify(sp.file))
        };

        this.$doc = $('<screed class="none">&#160;</screed>').appendTo(this.$paper);

        this.setScreed = function ($screed, user) {

            if (!$screed.is(el.screedDoc)) {

                this.trigger('screedWrong')
            }
            this.$paper.empty().prepend($screed);

            this.$doc = $screed;

            var dataFile = this.$doc.data('file');
            if (dataFile) {

                this.file = dataFile;
                this.trigger({type: 'setTitle', to: this.file.local.name || this.$doc.find(el.title).text()});

            } else {

                this.trigger({type: 'setTitle', to: this.$doc.find(el.title).text()});
            }

            if (!$.isEmptyObject(user)) {

                this.init(user)

            } else {

                this.trigger('currentFocus')
            }
            return this
        };

        this.paperToPlainHtml = function ($paper) {
            var clear = function () {
                var $ed = $(this);
                $ed.parent().html($ed.text());
            };

            $paper = $paper || this.$paper;

            return $paper
                .find(el.ed).each(clear).end()
                .find(el.cover).removeAttr('style').end()
                .find('[contenteditable]').removeAttr('contenteditable').end()
                .html()

        };

        /**
         * local log
         * @param msg
         */
        this.log = function (msg) {

            this.$paper.trigger({type: 'log', msg: msg})
        };

        /**
         * trigger bridge
         * @param event
         */
        this.trigger = function (event) {

            return this.$paper.trigger(event)
        };

        this.init = function (user) {

            this.trigger('scenes');

            if (!this.$doc.is('.locked')) {

                this.trigger({type: 'screedUnLocked', $doc: this.$doc});

            } else {

                this.trigger({type: 'screedLocked', $doc: this.$doc});
            }

            if (this.$doc.is('.empty')) {

                this.trigger({type: 'screedSign', $doc: this.$doc, user: user});
                this.trigger({type: 'screedEmpty', $doc: this.$doc});
            }

            if (this.$doc.is('.saved')) {

                this.trigger({type: 'screedSaved', $doc: this.$doc})

            } else {

                this.trigger({type: 'screedUnSaved', $doc: this.$doc})
            }

            return this
        };

        this.toggleLock = function (userID) {

            if (this.$doc.data('user') !== userID) {
                return false
            }

            if (this.$doc.is('.locked')) {

                this.$doc.removeClass('locked');
                this.trigger({type: 'screedUnLocked', $doc: this.$doc});

            } else {

                this.$doc.addClass('locked');
                this.trigger({type: 'screedLocked', $doc: this.$doc});
            }
            return true
        };

        /**
         * set event listeners
         * @private
         */
        this._listenEvents = function () {

            var listener;

            for (listener in this.on.self) {
                //noinspection JSUnfilteredForInLoop
                this.$paper
                    .on(listener, sp.on.self[listener])
            }

            for (listener in this.on.editable) {
                //noinspection JSUnfilteredForInLoop
                this.$paper
                    .on('editable', el[listener], sp.on.editable[listener])
            }

            for (listener in this.on.ed) {
                //noinspection JSUnfilteredForInLoop
                this.$paper
                    .on(listener, el.ed, sp.on.ed[listener])
            }
        };

        this.on = {

            self: {

                changed: function (/*event*/) {

                    sp.file.dates.modified = moment().valueOf();
                    sp.setFileData();
                    sp.$doc.removeClass('saved');
                    return false
                },

                screedSign: function (event) {

                    event.$doc
                        .find(el.cover + ' ' + el.author).children(0)
                        .text(event.user.name);
                    event.$doc
                        .find(el.cover + ' ' + el.contact).children(0)
                        .text(event.user.contact);
                    event.$doc
                        .attr('data-user', event.user.id);
                    return true
                },

                screedEmpty: function (event) {

                    sp.file.dates.created = moment().valueOf();
                    sp.setFileData();
                    event.$doc
                        .removeClass('empty');
                    return true
                },

                screedSaved: function (event) {

                    sp.file.dates.saved = moment().valueOf();
                    if (event.to) {
                        if (event.to.url) {
                            sp.file.picker = event.to
                        } else {
                            sp.file.local = event.to
                        }
                    }
                    sp.setFileData();
                    return true
                },

                screedUnSaved: function () {

                    sp.file.dates.modified = moment().valueOf();
                    sp.setFileData();
                },

                screedLocked: function (event) {

                    sp.paperToPlainHtml();
                    return true
                },

                screedUnLocked: function (event) {

                    event.$doc
                        .find(el.field + ', ' + el.para)
                        .trigger('editable');
                    event.$doc
                        .trigger('firstFocus');
                    return true
                },

                firstFocus: function (/*event*/) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    var $current = sp.$doc.find(el.current);
                    if ($current.length) {
                        $current.first().focus();
                        return false
                    }
                    sp.$doc.find(el.scene + ' ' + el.ed).first().focus();
                    return false
                },

                current: function (event) {

                    var $ed = $(event.target),
                        curClass = el.current.substr(1);

                    sp.$doc
                        .find(el.ed + el.current).removeClass(curClass);
                    $ed.addClass(curClass)
                },

                currentFocus: function (event) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    event.stopPropagation();
                    sp.$doc.find(el.current).focus();
                    return false
                },

                coverFocus: function (event) {

                    if (window.screedUIBlock) {
                        return false
                    }
                    event.stopPropagation();
                    var $cover = sp.$doc.find(el.cover);

                    if ($cover.is(':hidden')) {

                        $cover.addClass('scr-show').find(el.ed).first().focus();
                        sp.$doc.addClass('scr-expand')

                    } else {

                        $cover.removeClass('scr-show');
                        sp.$doc.removeClass('scr-expand');
                        sp.$doc.find(el.scene + ' ' + el.ed).first().focus();
                    }
                    return false
                },

                setTitle: function (event) {
                    sp.file.local.name = event.to;
                    sp.setFileData();
                    return true
                }
            },

            editable: {

                cover: function (event) {

                    $(event.currentTarget).prop('contentEditable', false);
                },

                head: function (event) {

                    $(event.currentTarget).prop('contentEditable', false);
                },

                action: function (event) {

                    $(event.currentTarget).prop('contentEditable', true);
                },

                field: function (event) {

                    var $el = $(event.currentTarget),
                        $ed = $(document.createElement(el.ed)).prop('contentEditable', true),
                        $exEd = $el.children(0);

                    if ($exEd.is(el.ed)) {
                        return true
                    }
                    $el
                        .prop('contentEditable', false)
                    /** TODO CLEAN??? .removeAttr('style')*/
                        .html($.trim($el.text()))
                        .wrapInner($ed);

                    return true
                },

                para: function (event) {

                    sp.on.editable.field.call(this, event)
                }
            },

            ed: {

                input: function (/*event*/) {

                    sp.trigger('changed');
                    return true
                },

                style: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent(),
                        elClass = sp.classes.select($el),
                        newClass = sp.values.offset(sp.classes.list, elClass, event.dir);

                    $el
                        .addClass(newClass)
                        .removeClass(elClass);

                    if ($el.is('.parenthetical')) {
                        $ed.text($ed.text().replace(/^\(/, '').replace(/\)$/, ''))
                    }
                    $ed
                        .trigger('current')
                        .trigger('changed');
                    return false
                },

                value: function (event) {

                    var $ed = $(event.currentTarget),
                        edValue = sp.values.select($ed);

                    $ed.text(sp.values.offset(sp.values.list, edValue, event.dir))
                        .trigger('current')
                        .trigger('changed');

                    return false
                },

                store: function (event) {

                    var $ed = $(event.currentTarget),
                        $el = $ed.parent();

                    if ($el.text().length < 2) {

                        /*this.log('nothing to add - small');*/
                        return true
                    }
                    var elClass = $el.attr('class'),
                        listClass = '';
                    /*this.log(elClass);*/

                    switch (elClass) {

                        case 'location':
                            listClass = '.scr-menu-location';
                            break;

                        case 'character':
                            listClass = '.scr-menu-character';
                            break;

                        case 'title':
                            sp.trigger({type: 'setTitle', to: $el.text()});
                            return false;
                            break;

                        case 'author':
                            sp.trigger({type: 'userChanged', to: {name: $el.text()}});
                            return false;
                            break;

                        case 'contact':
                            sp.trigger({type: 'userChanged', to: {contact: $el.text()}});
                            return false;
                            break;

                        default:
                            /*this.log('nothing to add - not l||c');*/
                            return false;
                            break;
                    }

                    var $list = $(listClass, sp.$doc).first(),
                        text = $el.text(),
                        result = false,
                        $li = $list.children();

                    /*this.log('try add: ' + text);*/

                    if (text) {

                        $li.each(function () {

                            if ($(this).text() == text) {

                                /*this.log('exists: ' + text);*/
                                result = true
                            }
                        });
                        if (!result) {

                            $list.append('<li>' + text + '</li>');
                            /*this.log('added: ' + text);*/
                        }
                    }
                    return true
                }

            }
        };

        this.values = {

            list: [],

            location: function () {

                var $list = $('.scr-menu-location li', sp.$doc),
                    list = [];

                $list.each(function () {

                    list.push($(this).text())
                });
                return list
            },

            select: function ($ed) {

                var elClass = $ed.parent().attr('class');
                if (elClass == 'location') {

                    this.list = this.location();

                } else {

                    this.list = sp.lists[elClass]
                }
                return $ed.text()
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
            }
        };

        this.afterType = {

            character:     ['parenthetical', '…'], /* var empty = el.empty  */
            parenthetical: ['dialog', '…'],
            default:       ['action', '…']
        };

        this.classes = {

            list: [],
            from: {

                all: ['action', 'character', 'parenthetical', 'dialog', 'titr', 'transition'],

                action:                   ['action', 'character', 'titr', 'transition'],
                actionFirst:              ['action', 'transition'],
                actionAfterCharacter:     ['action', 'parenthetical', 'dialog'],
                actionAfterParenthetical: ['action', 'dialog'],
                actionAfterDialog:        ['action', 'character', 'parenthetical'],

                character:  ['character', 'titr', 'transition', 'action'],
                charLinked: ['character', 'character', 'action'],

                parenthetical:             ['parenthetical', 'dialog'],
                parentheticalBeforeAction: ['parenthetical', 'character', 'action'],

                dialog:                   ['dialog', 'parenthetical'],
                dialogAfterParenthetical: ['dialog', 'dialog', 'action'],

                titr:            ['titr', 'transition', 'character', 'action'],
                transition:      ['transition', 'action', 'character', 'titr'],
                transitionFirst: ['transition', 'action'],
                MsoNormal:       ['action', 'action'] /** TODO paste from MS Word */
            },

            select: function ($el) {

                var elClass = $el.attr('class');

                this.list = this.from[elClass];

                /** TODO more elegance!! */
                if (!$el.prevAll().length /*&& (elClass == 'action')*/) {

                    this.list = this.from.actionFirst;
                    return elClass
                }
                if ($el.prev().is('.character') && (elClass == 'action')) {

                    this.list = this.from.actionAfterCharacter;
                }
                if ($el.prev().is('.parenthetical') && (elClass == 'action')) {

                    this.list = this.from.actionAfterParenthetical;
                }
                if ($el.prev().is('.dialog') && (elClass == 'action')) {

                    this.list = this.from.actionAfterDialog;
                }
                if (!$el.prevAll().length && (elClass == 'transition')) {

                    this.list = this.from.transitionFirst;
                }
                if ($el.next().is('.dialog') || $el.next().is('.parenthetical')) {

                    this.list = this.from.charLinked;
                    sp.trigger({type: 'notify', as: {type: 'info', text: screed.say.characterHasText + '!'}})
                }
                if ($el.next().is('.action') && (elClass == 'parenthetical')) {

                    this.list = this.from.parentheticalBeforeAction;
                }
                if ($el.prev().is('.parenthetical') && (elClass == 'dialog')) {

                    this.list = this.from.dialogAfterParenthetical;
                }
                return elClass
            }
        };

        this._listenEvents();
    };


    /*
     --------------------------------------------------------------------
     Select definitions
     --------------------------------------------------------------------
     */

    var Select = function (screed, cleaner) {

        this.screed = screed;
        this._sel = window.getSelection();
        this._node = undefined;
        this._$clip = $('<clip/>');
        this._range = document.createRange();
        /*this._store = this._range;*/
        this._event = {};

        if ($.isFunction(cleaner)) {

            this._cleaner = cleaner

        } else {

            this._cleaner = function ($clip) {

                return $clip
            };
        }

        this.node = function (node) {

            this._node = node;
            return this
        };

        this.event = function (event) {

            this._event = event;
            this.node(this._event.currentTarget);
            this.getSel();
            return this
        };

        this.getSel = function () {

            this._sel = window.getSelection();
            return this._sel
        };

        this.createRange = function () {

            this._range = document.createRange();
            return this._range
        };

        this.clip = function (content) {

            //noinspection JSUnresolvedVariable
            var clip = this._event.originalEvent.clipboardData,
                clipText = clip.getData('text'),
                clipHtml = clip.getData('html');

            if (content) {

                this._$clip.html(content);
                /** works with event.preventDefault */
                clip.setData('text', content)

            } else {

                /** if clipboard changed outside */
                if (this._$clip.text() !== clipText) {

                    /** TODO         clipHtml */
                    this._$clip.html(clipText)
                }
            }
            return this._cleaner(this._$clip)
        };

        this.delete = function () {

            this._sel.getRangeAt(0).deleteContents();
            return this
        };

        this.copy = function () {

            var $container = $('<div/>');
            for (var i = 0, len = this._sel.rangeCount; i < len; ++i) {
                $container.append(this._sel.getRangeAt(i).cloneContents());
            }
            this.clip($container.html());
            return this
        };

        this.cut = function () {

            var $container = $('<div/>');
            for (var i = 0, len = this._sel.rangeCount; i < len; ++i) {
                $container.append(this._sel.getRangeAt(i).extractContents());
            }
            this.clip($container.html());
            this.screed.doc.trigger('changed');
            return this
        };

        this.paste = function () {

            var $clip = this.clip();
            if (!$clip.text().length) {
                return this
            }
            var
                $ed = $(this._node),
                $el = $ed.parent(),
                $action,
                select = this.offset(),
                el = this.screed.options.el,
                clip;

            if ($ed.html() == el.sp) {
                $ed.text('')
            }
            var
                text = $ed.text().substring(0, select.start),
                tail = $ed.text().substring(select.end, $ed.text().length);

            /** TODO clear outer html before paste */
            if ($clip.html() == $clip.text()) {

                this.delete();

                if ($el.is(el.location) || $el.parent().is(el.cover)) {

                    clip = $clip.text().replace(/\n/g, ' ');
                    $ed.text(text + clip + tail);

                    this.move(select.start + clip.length);

                } else {

                    clip = $clip.html();
                    var $div = $('<div/>');
                    $.each(clip.split('\n'), function(i, val) {
                        var $p = $('<p class="action"/>');
                        $div.append($p.text(val))
                    });

                    if ($el.is(el.para)) {

                        $copy = $el.clone();
                        $el.after($copy);
                        $el.after($div.html());
                        $copy.text(tail);
                        $el.text(text);
                        $action = $el.parent();
                        $action.find(el.para).trigger('editable');
                        $el.find(el.ed).first().attr('data-pos', select.end).focus()

                    } else {

                        $action = $el.parent().next();
                        $action.prepend($div.html());
                        $action.find(el.para).trigger('editable').end().find(el.ed).first().focus()
                    }
                }

            } else {

                if ($el.parent().is(el.action)) {

                    this.delete();

                    $ed.text(text);

                    var
                        $copy = $el.clone(),
                        $copyEd = $copy.children(0);

                    if (tail) {
                        $copyEd.text(tail);
                        $el.after($copy);
                    }
                    $el.after($clip.html());

                    if (text.length == 0) {

                        $ed.text(el.empty).focus();
                        $copyEd.focus()

                    } else {

                        $el.next().children(0).focus()

                    }
                }
                if ($el.is(el.field)) {

                    $action = $el.parent().next();
                    $action.prepend($clip.html()).find(el.ed).first().focus()
                }
            }
            this.screed.doc.trigger('changed');
            return this
        };

        this.caret = function () {

            return this.offset().start
        };

        this.store = function () {

            if (this._sel.getRangeAt && this._sel.rangeCount) {

                this._store = this._sel.getRangeAt(0)

            } else {

                this._store = this._sel.createRange()
            }
            return this
        };

        this.restore = function () {

            this._swap(this._store);
            return this
        };

        this.contents = function (node) {

            this.getSel();
            this.createRange();
            this.node(node);

            if (this._node !== undefined) {

                this._range.selectNodeContents(this._node);
            }
            return this
        };

        this._selected = function () {

            return {
                start:  this._sel.anchorOffset,
                end:    this._sel.focusOffset,
                length: (this._sel.anchorOffset >= this._sel.focusOffset) ? (this._sel.anchorOffset - this._sel.focusOffset) : (this._sel.focusOffset - this._sel.anchorOffset)
            }
        };

        this.offset = function () {

            var range = this._sel.getRangeAt ? this._sel.getRangeAt(0) : this._sel.createRange();

            return {
                start:  range.startOffset,
                end:    range.endOffset
            }
        };

        this.select = function () {

            return this._selected()
        };

        this._swap = function (range) {

            range = range || this._range;
            if (this._sel.rangeCount > 0) this._sel.removeAllRanges();
            this._sel.addRange(range);
            return this
        };

        this.all = function (node) {

            this.contents(node);

            this._swap();

            return this
        };

        this.end = function (node) {

            this.contents(node);

            this._range.collapse(false);

            this._swap();

            return this
        };

        this.start = function (node) {

            this.contents(node);

            this._range.collapse(true);

            this._swap();

            return this
        };

        this.move = function (pos) {

            if (!this._node.childNodes[0]) {
                return
            }
            var range = document.createRange();
            range.setStart(this._node.childNodes[0], pos);
            range.setEnd(this._node.childNodes[0], pos);
            this._swap(range)
        };

    };

    /*
     --------------------------------------------------------------------
     Find definitions
     --------------------------------------------------------------------
     */

    var Find = function ($el, screed) {

        this.$el = $el;
        this.el = screed.options.el;
    };

    Find.prototype = {

        constructor: Find,

        any: function () {

            var $any = this.$el.next().children(0);

            if (!$any.length) {

                $any = this.$el.prev().children(0)
            }
            return $any
        },

        next: function () {

            var $next = this.$el.next().children(0);

            if (!$next.length) {

                $next = this.firstInNext()
            }
            return $next
        },

        prev: function () {

            var $prev = this.$el.prev().children(0);

            if (!$prev.length) {

                $prev = this.lastInPrev()
            }
            return $prev
        },

        firstInNext: function () {

            var $next = this.$el.parent().next().find(this.el.ed).first();

            if (!$next.length) {

                $next = this.$el.closest(this.el.scene).next().find(this.el.ed).first()
            }
            return $next
        },

        lastInPrev: function () {

            var $prev = this.$el.parent().prev().find(this.el.ed).last();

            if (!$prev.length) {

                $prev = this.$el.closest(this.el.scene).prev().find(this.el.ed).last()
            }
            return $prev
        }
    };

    /*
     --------------------------------------------------------------------
     Jump definitions
     --------------------------------------------------------------------
     */

    var Jump = function ($el, screed) {

        this.$el = $el;
        this.el = screed.options.el;
        this.find = new Find($el, screed);
        this.select = screed.select;
    };

    Jump.prototype = {

        constructor: Jump,

        any: function () {

            var $any = this.find.any();

            $any.focus();
            return false
        },

        next: function () {

            var $next = this.find.next();

            $next.focus();
            return false
        },

        right: function () {

            var $next = this.find.next();

            $next.attr('data-pos', 0).focus();
            return false
        },

        prev: function () {

            var $prev = this.find.prev();

            if ($prev.length) {

                $prev.focus();
            }
            return false
        },

        left: function () {

            var $prev = this.find.prev(),
                pos = 0;

            if ($prev.length) {

                pos = $prev.text().length;
                $prev.attr('data-pos', pos).focus();
            }
            return false
        },

        firstAction: function () {

            this.$el.prevAll().last().find(this.el.ed).first().focus();
            return false
        },

        lastAction: function () {

            this.$el.nextAll().last().find(this.el.ed).first().focus();
            return false
        },

        prevAction: function () {

            this.find.lastInPrev().focus();
            return false
        },

        itAction: function () {

            this.find.firstInNext().focus();
            return false
        },

        toNewNext: function (text) {

            this.$el.children(0).trigger({type: 'after', text: text});
            return this.next()
        },

        prevScene: function () {

            this.$el.closest(this.el.scene).prev().find(this.el.ed).first().focus();
            return false
        },

        nextScene: function () {

            this.$el.closest(this.el.scene).next().find(this.el.ed).first().focus();
            return false
        },

        firstScene: function () {

            this.$el.closest(this.el.screedDoc).find(this.el.scene).first().find(this.el.ed).first().focus();
            return false
        },

        lastScene: function () {

            this.$el.closest(this.el.screedDoc).find(this.el.scene).last().find(this.el.ed).first().focus();
            return false
        }
    };

    /*
     --------------------------------------------------------------------
     State definitions
     --------------------------------------------------------------------
     */
    var State = function (screed) {

        this.screed = screed;
        this.limit = 100;

        this.undoStack = [];
        this.redoStack = [];
    };

    State.prototype = {

        constructor: State,

        /**
         * TODO save state in localStorage, and in stacks save keys to items in LocalStorage
         * @param state
         */
        save: function (state) {

            this.undoStack.push(state);
            this.screed.trigger({type: 'autoSave', state: state});
            this.screed.trigger('undoYep');
            this.redoStack.length = 0;
            this.screed.trigger('redoNope');

            if (this.undoStack.length > this.limit) {

                this.undoStack.shift()
            }
        },

        undo: function () {

            var state = this.undoStack.pop();

            if (state) {

                this.redoStack.push(state);
                this.screed.trigger('redoYep')

            } else {

                this.screed.trigger('undoNope')
            }
            return state
        },

        redo: function () {

            var state = this.redoStack.pop();

            if (state) {

                this.undoStack.push(state);
                this.screed.trigger('undoYep')

            } else {

                this.screed.trigger('redoNope')
            }
            return state
        },

        clean: function () {

            this.undoStack = [];
            this.redoStack = [];

            this.screed.trigger('undoNope');
            this.screed.trigger('redoNope')
        }

    };


})(jQuery, window, document);