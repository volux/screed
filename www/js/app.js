/*!
 --------------------------------------------------------------------
 jQuery screedApp plugin - outer application fo screed plugin
 Author: Andrey Skulov <screed@volux.ru>
 Copyright (c) 2013 volux.ru
 licensed under MIT (volux.ru/ref/mit-license.txt)
 --------------------------------------------------------------------
 */
;
(function ($, window, document, undefined) {

    "use strict";

     window._gaq = window._gaq || false;

         $(window).on('error', function (msg, url, line) {

         if (!window._gaq) {
             return true
         }
         window._gaq.push([ '_trackEvent', 'Error Log', msg, url + '_' + line ]);
         return false
     });
    window.screedAppPhrases = window.screedAppPhrases || {};
    window.lang = window.lang || $('html').attr('lang') || 'ru';

    var appPhrases = $.extend({
            ru: {
                appOnLine:         'Связь с интернетом есть. Можно использовать облака для открытия и сохранения сценариев',
                appOffLine:        'Связь с интернетом прервана. Возможно только локальное открытие и сохранение сценариев',
                screedNotLoaded:   'Screed плагин не загружен',
                historyBlocked:    'История браузера заблокирована',
                autoSavedFind:     'Найден автосохранённый %s сценарий',
                screedUnSaved:     'Рабочий сценарий не сохранён',
                screedSaved:       'Сценарий сохранён',
                openScreed:        'Открыть сценарий',
                openFromCloud:     'Открыть из облака',
                openFromDevice:    'Открыть из компьютера',
                saveScreed:        'Сохранить сценарий',
                saveOnCloud:       'Сохранить в облаке',
                saveOnDevice:      'Сохранить в компьютере',
                fileWrongEncoding: 'Проблемы кодировки',
                fileNotFound:      'Файл не найден',
                fileNotReadable:   'Файл не может быть прочитан',
                fileSecurity:      'Проблема безопасности',
                fileUnresolved:    'Я понятия не имею, что случилось',
                fileNotOpening:    'Сценарий не открывается',
                fileNotPicked:     'Файл не выбран',
                restoreIt:         'Восстановить его?',
                notOpen:           'Не открывать',
                notSave:           'Не сохранять',
                areYouSure:        'Вы уверены?',
                question:          'Вопрос',
                continue:          'Продолжить',
                opening:           'Открываем',
                saving:            'Сохраняем',
                pick:              'Выбрать',
                done:              'Сделано',
                yes:               'Да',
                no:                'Нет'
            },
            en: {
                appOnLine:         'You\'re currently online. You can use cloud for open|save screenplay',
                appOffLine:        'You\'re currently offline. You can use local open|save screenplay only',
                screedNotLoaded:   'Screed plugin not loaded',
                historyBlocked:    'Browser history back blocked',
                autoSavedFind:     'Find autosaved %s screenplay',
                screedUnSaved:     'The current screenplay is not saved',
                screedSaved:       'Screenplay saved',
                openScreed:        'Open screenplay',
                openFromCloud:     'Open from cloud',
                openFromDevice:    'Open from device',
                saveScreed:        'Save screenplay',
                saveOnCloud:       'Save on cloud',
                saveOnDevice:      'Save on device',
                fileWrongEncoding: 'Wrong file encoding',
                fileNotFound:      'File not found',
                fileNotReadable:   'File not readable',
                fileSecurity:      'File under security restrict',
                fileUnresolved:    'I have no idea what happened',
                fileNotOpening:    'Screenplay does not open',
                fileNotPicked:     'File not picked',
                restoreIt:         'Do you want it back?',
                notOpen:           'Not open',
                notSave:           'Not save',
                areYouSure:        'Are you sure?',
                question:          'Question',
                continue:          'Continue',
                opening:           'Opening',
                saving:            'Saving',
                pick:              'Pick',
                done:              'Done',
                yes:               'Yes',
                no:                'No'
            }
        },
        window.screedAppPhrases);

    /**
     * ScreedApp constructor
     * @param element
     * @param userOptions
     * @constructor
     */
    var ScreedApp = function (element, userOptions) {

        this.say = appPhrases[window.lang];

        if (!$.fn.screed) {
            $.error(this.say.screedNotLoaded)
        }

        this.defaults = {

            debug: false,

            offset: -200,

            el: {
                screed:   '.screed',
                preview:  '.scr-preview',
                help:     '.scr-help',
                navbar:   '.navbar',
                info:     '.scr-info',
                type:     '.scr-info-type',
                pos:      '.scr-info-pos',
                select:   '.scr-info-type-sel',
                status:   '.scr-status',
                lock:     '.scr-status-lock',
                save:     '.scr-status-save',
                edit:     '.scr-edit',
                undo:     '.scr-edit-undo',
                redo:     '.scr-edit-redo',
                scrollIn: '.screed',
                /*scrollIn: 'body',*/
                appendTo: 'body'/*'body>header'*/,
                debug:    '#scr_debug',
                docs:     '.scr-docs',
                scenes:   '.scr-scenes'
            },

            menu: {
                p:         '.scr-menu-p',
                where:     '.scr-menu-where',
                when:      '.scr-menu-when',
                location:  '.scr-menu-location',
                character: '.scr-menu-character'
            },

            filepicker: {
                logo: '//drpyjw32lhcoa.cloudfront.net/61cebff/img/portal/logo.png',
                key:  'AMMYr96hlQf2E9H9eAVMAz',
                use:  true
            },

            file: {
                mimetype:      'text/screed', /* not use? -> filepicker set ext to .txt ;charset=utf-8 */
                extension:     '.screed',
                htmlExtension: '.html'
            }
        };

        this.app = element;
        this.$app = $(element);
        this.options = $.extend({}, this.defaults, (typeof userOptions == 'object') ? userOptions : {}, this.$app.data('app-options'));
        this.$scrollIn = $(this.options.el.scrollIn);
        this.$scenes = $(this.options.el.scenes);
        this.activeMenu = {};
        this.user = {};

        /**
         *
         * @param msg
         */
        this.log = function(msg) {

            if (this.options.debug) {

                $(this.options.el.debug).children(0).prepend('<li>' + msg + '</li>')
            }
        };

        /**
         *
         * @param event
         * @returns {*}
         */
        this.trigger = function (event) {

            return this.$app.trigger(event)
        };

        /**
         *
         * @param $to
         * @param offset
         */
        this.scrollTo = function ($to, offset) {

            if (0 === $to) {
                $to = {top: 0}
            }
            offset = offset || this.options.offset;
            this.$scrollIn.scrollTo($to, 0, {axis: 'y', offset: offset})
        };


    };

    /**
     *
     * @returns {*}
     */
    ScreedApp.prototype.init = function () {

        this._initVendors();
        this._initUser();
        this._listenEvents();

        this.$screed = $(this.options.el.screed).screed();
        this.screed = this.$screed.data('screed');

        this._initToolBar();
        this._initHelp();

        this.loadScreedDoc();

        return this
    };

    /**
     *
     * @returns {*}
     * @private
     */
    ScreedApp.prototype._initUser = function () {

        this.user = JSON.parse(localStorage.getItem('user'));
        if (!this.user) {

            var service = new Service();
            this.user = {
                id: service.getUUId(),
                name: this.screed.options.el.empty,
                contact: this.screed.options.el.empty
            };
            localStorage.setItem('user', JSON.stringify(this.user));
        }
        return this
    };

    ScreedApp.prototype.on = {

        test: function (/*event*/) {

            this.escape();
            this.trigger({type: 'notify', as: {type: 'error', text: this.screed.say.notImplemented}})
        },

        link: function (event) {

            this.log('linked with ' + event.test)
        },

        log: function (event) {

            this.log(event.msg)
        },

        notify: function (event) {

            event.as.title = this.screed.say[event.as.type] + ':';

            $.pnotify(event.as)
        },

        keydown: function (event) {
            /*console.log(event.which);*/
            if (event.ctrlKey && !event.shiftKey) {

                switch (event.which) {

                    case 69:
                        /* ctrl + e - new screenplay */
                        event.preventDefault();
                        this.trigger('clean');
                        return false;
                        break;

                    case 76:
                        /* ctrl + l - lock screenplay */
                        event.preventDefault();
                        this.trigger('lock');
                        return false;
                        break;

                    case 79:
                        /* ctrl + o - open screenplay */
                        event.preventDefault();
                        this.trigger('open');
                        return false;
                        break;

                    case 83:
                        /* ctrl + s - save screenplay */
                        event.preventDefault();
                        this.trigger('save');
                        return false;
                        break;

                    case 90:
                        /* ctrl + z - undo */
                        event.preventDefault();
                        this.screed.trigger('undo');
                        return false;
                        break;

                }
            } else if (!event.ctrlKey && event.shiftKey) {

                switch (event.which) {

                    case 112:
                        /* shift + f1 - show right panel (scenes list) */
                        event.preventDefault();
                        this.trigger('right');
                        return false;
                        break;

                    case 113:
                        /* shift + f2 - focus to cover */
                        this.screed.trigger('coverFocus');
                        return true;
                        break
                }

            } else if (event.ctrlKey && event.shiftKey) {

                switch (event.which) {

                    case 83:
                        /* ctrl + shift + s - save screenplay as standalone html*/
                        event.preventDefault();
                        this.trigger('share');
                        return false;
                        break;

                    case 90:
                        /* ctrl + shift + z - redo */
                        event.preventDefault();
                        this.screed.trigger('redo');
                        return false;
                        break;
                }
            } else {

                switch (event.which) {

                    case 8:
                        /* backspace - block browser history back */
                        event.preventDefault();
                        this.trigger({type: 'notify', as: {type: 'info', text: this.say.historyBlocked}});
                        return false;
                        break;

                    case 27:
                        /* escape - revert changes, blur without change */
                        this.trigger('escape');
                        return true;
                        break;

                    case 112:
                        /* f1 - show help */
                        event.preventDefault();
                        $(this.options.el.help).trigger('help');
                        event.stopPropagation();
                        return false;
                        break;

                    case 113:
                        /* f2 - focus to current element */
                        event.preventDefault();
                        this.screed.trigger('currentFocus');
                        return false;
                        break
                }
            }
            return true
        },

        setTitle: function (event) {

            $('title').text(event.to.replace(this.options.file.extension, '') + ' - Screed')
        },

        screedEmpty: function (/*event*/) {

//            this.toolbar.enable(this.options.el.save);
        },

        lock: function (event) {

            this.screed.doc.toggleLock(this.user.id)
        },

        screedLocked: function (event) {

            if (event.$doc.data('user') == this.user.id) {

                this.toolbar.enable(this.options.el.lock);

            } else {

                this.toolbar.disable(this.options.el.lock);
            }
            this.toolbar.icon(this.options.el.lock, 'lock');
        },

        screedUnLocked: function (/*event*/) {

            this.toolbar.enable(this.options.el.lock);
            this.toolbar.icon(this.options.el.lock, 'unlock')
        },

        screedSaved: function (/*event*/) {

            this.toolbar.disable(this.options.el.save);
        },

        screedUnSaved: function (event) {

            if (event.$doc.data('user') == this.user.id) {
                this.toolbar.enable(this.options.el.save);
            }
        },

        current: function (event) {

            var $ed = $(event.target),
                $el = $ed.parent(),
                pos = $el.prevAll().length + 1,
                posLabel = '',
                typeLabel = '',
                sections = $el.closest(this.screed.options.el.scene).prevAll().length,
                elClass = $el.attr('class');

            if (!elClass) {
                elClass = 'action';
                $el.addClass(elClass)
            }

            this.$scenes.trigger({type: 'active', to: sections});

            if (sections == 0) {

                posLabel = '';
                typeLabel = elClass;
                this.toolbar.info.disable();

            } else {

                if ($el.is(this.screed.options.el.para)) {

                    posLabel = sections + ':' + pos;
                    typeLabel = $(this.options.menu.p).first().find('a[href="/#!' + elClass + '"]').first().text();
                    this.toolbar.info.enable()

                } else {

                    posLabel = sections;
                    if ($el.is('.location')) {

                        typeLabel = $(this.options.menu.location).first().find('li').first().text();
                        this.toolbar.info.enable()

                    } else {

                        typeLabel = $(this.options.menu[elClass]).first().find('a[href="/#!' + $el.text() + '"]').first().text();
                        this.toolbar.info.enable()
                    }
                }
            }
            $(this.options.el.pos).trigger({type: 'label', label: posLabel});
            $(this.options.el.type).trigger({type: 'label', label: typeLabel});
            this.scrollTo($el);
            return true
        },

        escape: function (/*event*/) {

            if (!$.isPlainObject(this.activeMenu)) {

                this.activeMenu
                    .off('click touchstart', 'a')
                    .menu('destroy')
                    .remove();
                this.activeMenu = {}
            }
        },

        userChanged: function (event) {

            if (event.to !== undefined) {

                $.extend(this.user, event.to);
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        },

        clean: function (/*event*/) {

            if (window.screedUIBlock) {
                return false
            }
            var app = this,
                doClean = function (result) {
                    if (result) {
                        app.loadScreedDoc('empty')
                    }
                };

            if (!this.screed.status.saved) {

                var dialog = new Dialog(this);
                dialog.confirm(this.screed.say.beginNew, doClean)

            } else {

                doClean(true)
            }
            return false
        },

        share: function () {

            var app = this;
            $.get(app.screed.options.cssPath, $.proxy(function (css) {

                app.screed.css = css;
                app.trigger({type: 'save', isHtml: true})

            }, this));
            return false
        },

        save: function (event) {

            if (window.screedUIBlock) {
                return false
            }
            var isHtml = event.isHtml || false,
                ext = (isHtml)? this.options.file.htmlExtension: this.options.file.extension;
            /**
             * TODO not give save not owned
             */
            if (this.screed.status.saved && !isHtml) {
                this.trigger({type: 'notify', as: {type: 'info', text: this.say.screedSaved}});
                return false
            }
            var app = this,
                useFP = app.options.filepicker.use,

                $save = $('<div>' +
                    '<span class="help-block">' + app.say.saveOnCloud + ':</span>' +
                    '<button class="fp btn btn-block" ' + ((useFP) ? 'title="Powered By Filepicker.io"' : 'title="Offline. Filepicker.io disabled" disabled') + '>' +
                    '<img src="' + app.options.filepicker.logo + '" alt="Powered By Filepicker.io" />' +
                    '</button><br/>' +
                    '<span class="help-block">' + app.say.saveOnDevice + ':</span>' +
                    '<div class="input-append scr-save">' +
                    '<input class="fl span3" type="text" name="file" value="' + app.screed.doc.file.local.name.replace(this.options.file.extension, '') + '"/>' +
                    '<span class="add-on">' + ext + '</span>' +
                    '<button class="btn fl-save" type="button" title="' + app.say.saveOnDevice + '"><i class="icon-save"></i></button>' +
                    '</div>' +
                    '</div>'),

                onAnswer = function () {
                },

                afterSave = function (file) {

                    if (!isHtml) {

                        app.screed.doc.trigger({type: 'screedSaved', to: file});
                    }
                    dialog.close();
                },

                dialog = new Dialog(this);

            dialog.ask($save, onAnswer, {

                open: function () {

                    $(this)
                        .on('keydown', '.fl', $.proxy(function (event) {
                            event.stopPropagation();
                            if (event.which == 13) {

                                $(event.currentTarget).closest('div').find('button').click();
                                return false
                            }
                            if (event.which == 27) {

                                dialog.close();
                            }
                            return true
                        }, dialog))

                        .on('click touchstart', '.fl-save', $.proxy(function (event) {

                            var $button = $(event.currentTarget);

                            new LocalFile(app).save($button.closest('div').find('input').val(), afterSave, isHtml);

                            return false

                        }, dialog))

                        .on('click touchstart', '.fp', $.proxy(function (event) {

                            var $button = $(event.currentTarget);

                            new PickerFile(app).save($button.closest('div').find('input').val(), afterSave, isHtml);

                            return false

                        }, dialog))
                },

                minWidth: function () {
                    return $(dialog.el.info).outerWidth() + 77
                },

                id:    'scr_save',
                title: this.say.saveScreed,
                icon: 'icon-save',
                label: this.say.notSave

            }, true);

            return false
        },

        open: function () {

            if (window.screedUIBlock) {
                return false
            }
            var app = this,
                useFP = app.options.filepicker.use,

                $open = $('<div>' +
                    '<span class="help-block">' + app.say.openFromCloud + ':</span>' +
                    '<button class="fp btn btn-block" ' + ((useFP)? 'title="Powered By Filepicker.io"' : 'title="Offline. Filepicker.io disabled" disabled') + '>' +
                    '<img src="' + app.options.filepicker.logo + '" alt="Powered By Filepicker.io" />' +
                    '</button><br/>' +
                    '<span class="help-block">' + app.say.openFromDevice + ':</span>' +
                    '<div class="input-prepend scr-open">' +
                    '<button class="btn" title="' + app.say.pick + '"><i class="icon-folder-open-alt"></i><span>' + app.say.pick + '</span></button>' +
                    '<input class="fl span3" type="file" name="file" />' +
                    '</div>' +
                    '</div>'),

                onAnswer = function () {},

                afterRead = function (result, file) {

                    app.loadScreedDoc(result);
                    console.log(file)
                },

                dialog = new Dialog(this);

            dialog.ask($open, onAnswer, {

                open:     function () {

                    $(this)

                        .on('change', '.fl', $.proxy(function (event) {

                            new LocalFile(app).pick(event, afterRead);
                            this.close()

                        }, dialog))

                        .on('click touchstart', '.btn', function (event) {

                            event.preventDefault();
                            $(this).next().click();
                            return false

                        })

                        .on('click touchstart', '.fp', $.proxy(function (event) {

                            event.preventDefault();

                            new PickerFile(app).pick(event, afterRead);
                            this.close();

                            return false

                        }, dialog))
                },

                minWidth: function () {
                    return $(dialog.el.info).outerWidth() + 13
                },

                id:    'scr_open',
                title: this.say.openScreed,
                icon:  'icon-folder-open-alt',
                label: this.say.notOpen

            }, true);

            return false
        },

        changed: function (/*event*/) {

            this.toolbar.enable(this.options.el.save);
        },

        autoSave: function (event) {

            var screed = {
                title: $(event.state).find('.title').text(),
                date:  moment().valueOf(),
                html: event.state
            };
            localStorage.setItem('autoSave', JSON.stringify(screed));
        },

        undoYep: function (/*event*/) {

            this.toolbar.enable(this.options.el.undo);
        },

        undoNope: function (/*event*/) {

            this.toolbar.disable(this.options.el.undo);
        },

        redoYep: function (/*event*/) {

            this.toolbar.enable(this.options.el.redo);
        },

        redoNope: function (/*event*/) {

            this.toolbar.disable(this.options.el.redo);
        },

        print: function () {

            window.print()
        },

        scenes: function () {

            var app = this,
                $list = $('<ul/>').addClass('nav nav-list');

            app.screed.$area.find(app.screed.options.el.head).each(function () {
                $list.append('<li><a>'+$(this).html()+'</a></li>')
            });
            app.$scenes.children(0).replaceWith($list);
            app.$scenes.trigger('plain');
        },

        right: function () {
            $(this.options.el.appendTo).toggleClass('with-scenes')
        }
    };

    /**
     * set events to app
     * @private
     */
    ScreedApp.prototype._listenEvents = function () {

        for (var listener in this.on) {
            //noinspection JSUnfilteredForInLoop
            this.$app
                .on(listener, $.proxy(this.on[listener], this))
        }

        $(document)

            .on('click', $.proxy(function () {

                this.screed.trigger('escape');
            }, this))

            .on('touchstart', $.proxy(function () {

                this.screed.trigger('escape');
            }, this))
        ;
        this.$scenes

            .on('plain', $.proxy(function (event) {

                var app = this;
                $(event.currentTarget).find(app.screed.options.el.ed).each(function () {

                    var $ed = $(this),
                        $el = $ed.parent();

                    $el.text($ed.text()).removeProp('contentEditable')
                })
            }, this))

            .on('active', $.proxy(function (event) {

                var scene = event.to,
                    $scenes = $(event.currentTarget),
                    active = 'active';

                if (scene > 0) {

                    $scenes
                        .find('li')
                        .removeClass(active)
                        .eq(scene - 1).addClass(active);
                    $scenes.scrollTo('.' + active, 0, {axis: 'y', offset: this.options.offset})

                } else {

                    $scenes
                        .find('li')
                        .removeClass(active);
                }


            }, this))

            .on('click', 'a', $.proxy(function (event) {

                var el = this.screed.options.el;

                this.$screed.find(el.scene).eq($(event.currentTarget).parent().index()).find(el.ed).first().focus()

            }, this))
        ;

        $(window)

            .on('online', $.proxy(function () {

                this.trigger({type: 'notify', as: {type: 'success', text: this.say.appOnLine}});
                window.filepicker && filepicker.setKey(this.options.filepicker.key);
                this.options.filepicker.use = true
            }, this))

            .on('offline', $.proxy(function () {

                this.trigger({type: 'notify', as: {type: 'info', text: this.say.appOffLine}});
                this.options.filepicker.use = false
            }, this))
        /**
         * TODO not autoSave locked && not owned
         .on('unload', $.proxy(function () {

                this.screed.trigger({type:'autoSave', state: this.screed.getScreed()})
            }, this))
         */
        ;
    };

    /**
     *
     * @param screedHtml
     */
    ScreedApp.prototype.loadScreedDoc = function (screedHtml) {

        var $screed;

        switch (screedHtml) {

            case undefined:
                if (this.existsAutoSaved()) {

                    return this
                }
                $screed = $(this.options.el.docs + ' screed.locked').clone();
                break;

            case 'empty':
                $screed = $(this.options.el.docs + ' screed.empty').clone();
                break;

            default:
                $screed = $(screedHtml);
                break;
        }
        this.screed.trigger({type: 'setScreed', $doc: $screed, user: this.user});
        return this
    };

    /**
     *
     * @param screedHtml
     * @returns {*|HTMLElement}
     */
    ScreedApp.prototype.preview = function (screedHtml) {

        return $('<div class="' + this.options.el.preview.substr(1) + '"><div class="' + this.screed.options.el.paper.substr(1) + '">' + screedHtml + '</div></div>')
    };

    /**
     *
     * @returns {*}
     */
    ScreedApp.prototype.existsAutoSaved = function () {

        var file = JSON.parse(localStorage.getItem('autoSave'));

        if (file) {

            var app = this,

                $ask = $('<div class="scr-preview-inside">' +
                    '<p>' + this.say.autoSavedFind.replace('%s', moment(file.date).fromNow()) + ':</p>' +
                    '<p class="scr-inline-title">' + file.title + '</p>' +
                    '<div class="' + this.options.el.preview.substr(1) + '">' +
                    app.preview(file.html).html() +
                    '</div>' +
                    '<p>' + this.say.restoreIt + '</p>' +
                    '</div>' +
                    '</div>')
                ,

                onAnswer = function (result) {

                    if (result) {

                        app.screed
                            .trigger({type: 'setScreed', $doc: $(file.html), user: app.user})
                        ;

                    } else {

                        localStorage.removeItem('autoSave');
                        app.loadScreedDoc('empty')
                    }
                },

                dialog = new Dialog(this);

            dialog.ask($ask, onAnswer, {

                minWidth: function () {

                    return 460
                },
                open: function () {

                    $(this)
                        .find(app.options.el.preview)
                        .scrollTo(app.screed.options.el.current, 400, {axis: 'y', offset: app.options.offset * 3})
                }
            });
        }
        return file
    };

    /**
     *
     * @returns {*}
     * @private
     */
    ScreedApp.prototype._initVendors = function () {

        if (this.options.debug) {

            $('<div id="' + this.options.el.debug.substr(1) + '"><ul></ul></div>')
                .appendTo(this.options.el.appendTo)
                .on('dblclick', 'li', function () {

                    $(this).nextAll().andSelf().remove()
                })
        }

        $.pnotify.defaults.delay = 4000;
        $.pnotify.defaults.history = false;

        if (window.filepicker) {

            filepicker.setKey(this.options.filepicker.key);

        } else {

            this.options.filepicker.use = false

        }
        moment.lang(window.lang);

        return this
    };

    /**
     *
     * @returns {*}
     * @private
     */
    ScreedApp.prototype._initToolBar = function () {

        var $navBar = $(this.options.el.navbar)
            .on('selectstart', function () {

                return false
            });

        this.toolbar = {

            disable: function (name) {
                $(name, $navBar).button('disable');
                $(this.self.options.el.help).trigger({type: 'disable', a: name.split('-')[2].split(' ')[0]})
            },

            enable:  function (name) {
                $(name, $navBar).button('enable');
                $(this.self.options.el.help).trigger({type: 'enable', a: name.split('-')[2].split(' ')[0]})
            },

            icon:    function (name, icon) {
                $(name, $navBar).button('option', 'icons', { primary: 'icon-' + icon });
                $(this.self.options.el.help).trigger({type: 'icon', a: name.split('-')[2].split(' ')[0], icon: icon})
            }
        };

        this.toolbar.self = new ToolBar($navBar, this);

        /**
         *
         * @param $element
         * @param app
         * @returns {*}
         * @constructor
         */
        function ToolBarEdit($element, app) {

            var tb = ToolBar($element, app);

            tb.on.click = function (event) {

                if (window.screedUIBlock) {
                    return false
                }
                this.screed
                    .trigger($(event.currentTarget).attr('class').split('-')[2].split(' ')[0]);
                return true
            };

            tb.init = function() {

                this.$group
                    .find('button')
                    .first()
                    .button({
                        icons:    {primary: 'icon-undo'},
                        disabled: true,
                        text:     false
                    })
                    .next()
                    .button({
                        icons:    {primary: 'icon-repeat'},
                        disabled: true,
                        text:     false
                    })
                    .parent()
                    .show();

                //noinspection JSUnresolvedFunction
                this._listenEvents();

            };

            tb.init();

            return tb
        }

        this.toolbar.edit = new ToolBarEdit($(this.options.el.edit), this);

        /**
         *
         * @param $element
         * @param app
         * @returns {*}
         * @constructor
         */
        function ToolBarStatus($element, app) {

            var tb = ToolBar($element, app);

            tb.on.click = function (event) {

                if (window.screedUIBlock) {
                    return false
                }
                this.screed
                    .trigger($(event.currentTarget).attr('class').split('-')[2].split(' ')[0])
                    .trigger('currentFocus');
                return true
            };
            tb.init = function () {

                this.$group
                    .find('button')
                    .first()
                    .button({
                        icons:    {primary: 'icon-lock'},
                        disabled: true,
                        text:     false
                    })
                    .next()
                    .button({
                        icons: {primary: 'icon-save'},
                        disabled: true,
                        text:  false
                    })
                    .parent()
                    .show();

                //noinspection JSUnresolvedFunction
                this._listenEvents();

            };

            tb.init();

            return tb
        }

        this.toolbar.status = new ToolBarStatus($(this.options.el.status), this);

        /**
         *
         * @param $element
         * @param app
         * @returns {*}
         * @constructor
         */
        function ToolBarInfo($element, app) {

            var tb = ToolBar($element, app);

            tb.on.click = function (event) {

                if (window.screedUIBlock) {
                    return false
                }
                event.preventDefault();
                var self = this,
                    $button = $(event.currentTarget),
                    $current = this.screed.current(),
                    prepareList = function (elClass) {

                        var $list = $(self.options.menu[elClass]).first().clone();

                        $list.children().each(function () {

                            var $li = $(this),
                                text = $li.text();

                            $li.empty().append('<a href="/#!' + text + '">' + text + '</a>')
                        });
                        return $list
                    };

                if ($button.is(self.options.el.pos)) {

                    this.screed.trigger('currentFocus')
                }
                if ($button.is(self.options.el.type)) {

                    $current.trigger({type: 'tab', dir: 1})
                }
                if ($button.is(self.options.el.select)) {

                    var $el = $current.parent(),
                        disabled = 'ui-state-disabled';

                    if ($el.is(this.screed.options.el.para)) {

                        this.screed.doc.classes.select($el);

                        app.activeMenu = $(self.options.menu.p).clone();
                        app.activeMenu.children().each(function () {

                            var $li = $(this),
                                $a = $li.children(0),
                                type = $a.attr('href').substr(3);

                            if ($.inArray(type, self.screed.doc.classes.list) >= 0) {

                                $li.removeClass(disabled);
                                $a.removeAttr('disabled')

                            } else {

                                $li.addClass(disabled);
                                $a.attr('disabled', true)
                            }
                        });

                    } else {

                        var elClass = $el.attr('class');

                        switch (elClass) {

                            case 'location':
                                app.activeMenu = prepareList(elClass);
                                break;

                            case 'character':
                                app.activeMenu = prepareList(elClass);
                                break;

                            default:
                                app.activeMenu = $(self.options.menu[elClass]).clone();
                                break;
                        }
                    }
                    app.activeMenu
                        .appendTo(self.options.el.appendTo)
                        .menu()
                        .on('click touchstart', 'a', function (event) {

                            var $a = $(event.currentTarget),
                                destroy = function () {

                                    app.activeMenu
                                        .off('click touchstart', 'a')
                                        .menu('destroy')
                                        .remove();
                                    app.activeMenu = {};
                                };

                            if ($a.parent().is('.'+ disabled)) {

                                destroy();
                                return false
                            }
                            self.screed
                                .current()
                                .trigger({type: 'tab', to: $a.attr('href').substr(3)});
                            destroy();
                            return false
                        })
                        .show()
                        .position({
                            my: 'left top',
                            at: 'left top',
                            of: $button
                        })
                    ;
                }
                return false
            };

            tb.on.label = function (event) {

                $('.ui-button-text > span', $(event.currentTarget)).text(event.label)
            };

            tb.init = function () {

                this.$group
                    .find('button')
                    .first()
                    .button({
                        disabled: true,
                        text:     !!$(this).attr('title')
                    })
                    .next()
                    .button({
                        disabled: true,
                        text:     !!$(this).attr('title')
                    })
                    .next()
                    .button({
                        disabled: true,
                        text:     false
                    })
                    .parent()
                    .buttonset()
                    .show();

                //noinspection JSUnresolvedFunction
                this._listenEvents();
            };

            tb.init();

            return tb
        }

        this.toolbar.info = new ToolBarInfo($(this.options.el.info), this);

        return this
    };

    /**
     *
     * @returns {*}
     * @private
     */
    ScreedApp.prototype._initHelp = function () {
        /** TODO define whole selectors in options */

        var app = this,

            $help = $(app.options.el.help)
                .on('selectstart', function () {

                    return false
                })
                .on('click touchstart', '.nav-list code', function () {

                    $(this).prev().trigger('click')
                })
                .on('click touchstart', 'a', function (event) {

                    var $a = $(event.currentTarget);

                    if ($a.is('.a-help')) {

                        $help.trigger('help');
                        return true
                    }
                    if ($a.is('.disabled')) {
                        return false
                    }
                    app.screed.trigger($a.attr('class').substr(2));
                    return true
                })
                .on('help', function () {

                    if (window.screedUIBlock) {
                        return false
                    }
                    if ($help.is('.scr-min')) {

                        $('.scr-command').slideDown(300);
                        $help.switchClass('scr-min', 'scr-open', 500);
                        return false
                    }
                    if ($help.is('.scr-open')) {

                        $help.switchClass('scr-open', 'scr-full', 500, function () {

                            $('.scr-command').slideUp(300);
                            $('.scr-help-full').slideDown(300);
                        });
                        return false
                    }
                    if ($help.is('.scr-full')) {

                        $('.scr-help-full').slideUp(300, function () {

                            $help.switchClass('scr-full', 'scr-min', 500);
                        });
                        return false
                    }
                    return false
                })
                .on('disable', function(event) {

                    $help.find('.a-' + event.a).addClass('disabled').parent().addClass('ui-state-disabled')
                })
                .on('enable', function (event) {

                    $help.find('.a-' + event.a).removeClass('disabled').parent().removeClass('ui-state-disabled')
                })
                .on('icon', function (event) {

                    $help.find('.a-' + event.a + '>i').attr('class', 'icon-'+event.icon)
                })
            ;
        $('.brand').on('click touchstart', function () {

            $help.trigger('help');
            return false
        });

        return this
    };

    /**
     * plugin init
     * @param userOptions
     * @returns {*}
     */
    $.fn.screedApp = function (userOptions) {

        return this.each(function () {

            if (!$.data(this, 'app')) {

                $.data(this, 'app', new ScreedApp(this, userOptions).init());
            }
        });
    };

    /*
     --------------------------------------------------------------------
     ToolBar definitions
     --------------------------------------------------------------------
     */

    /**
     *
     * @param $element
     * @param app
     * @returns {{$group: *, options: *, screed: *, on: {click: Function, touchstart: Function}, _listenEvents: Function, init: Function, disable: Function, enable: Function}}
     */
    function ToolBar ($element, app) {

        return {
            $group: $element,
            options: app.options,
            screed: app.screed,
            on: {

                click: function (event) {

                },

                touchstart: function (event) {

                    var self = this;

                    self.on.click.call(self, event);
                    return false
                }
            },

            /**
             *
             * @private
             */
            _listenEvents: function () {

                var listener;

                for (listener in this.on) {
                    //noinspection JSUnfilteredForInLoop
                    this.$group
                        .on(listener, 'button', $.proxy(this.on[listener], this))
                }
            },

            init: function () {

                return this
            },

            disable: function () {

                $('button', this.$group).button('disable');
                return this
            },

            enable: function () {

                $('button', this.$group).button('enable');
                return this
            }

        }
    }

    /*
     --------------------------------------------------------------------
     Dialog definitions
     --------------------------------------------------------------------
     */

    /**
     *
     * @param app
     * @constructor
     */
    var Dialog = function (app) {

        var dialog = this;

        this.el = app.options.el;

        /**
         *
         * @param question
         * @param callback
         * @param opt
         * @param oneButton
         */
        this.ask = function (question, callback, opt, oneButton) {

            var defaults = {
                id:        'scr_ask',
                label:     app.say.yes,
                title:     app.say.question,
                icon:      'icon-question-sign',
                container: this.el.appendTo,
                position:  {
                    my: 'right top',
                    at: 'right bottom+10 ',
                    of: $(dialog.el.info)
                },

                minWidth:  function () {

                    return $(dialog.el.info).outerWidth()
                },

                create: function () {

                    $(this).closest('.ui-dialog').find('.ui-dialog-title').prepend('<i class="' + opt.icon + '"></i>');
                    window.screedUIBlock = true;
                },

                open:      function () {

                },

                close:     function () {

                    $(this).dialog('destroy').remove();
                    window.screedUIBlock = false;
                    app.screed.trigger('currentFocus')
                },

                confirm:   function () {

                    $(this).dialog('close');
                    callback(true)
                },

                reject:    function () {

                    $(this).dialog('close');
                    callback(false)
                }
            };

            opt = $.extend(defaults, opt);

            oneButton = oneButton || false;

            var buttons = (!oneButton)? [
                {
                    text:  opt.label,
                    click: opt.confirm
                },
                {
                    text:  app.say.no,
                    click: opt.reject
                }
            ] : [
                {
                    text:  opt.label,
                    click: opt.reject
                }
            ];

            dialog.$div = $('<div id="'+ opt.id+'"></div>');
            $(opt.container).append(dialog.$div);
            dialog.$div.append(question);

            dialog.$div.dialog({
                resizable: false,
                modal:     true,
                autoOpen:  true,
                position:  opt.position,
                minWidth:  opt.minWidth(), /** () - required! */
                create:    opt.create,
                open:      opt.open,
                close:     opt.close,
                title:     opt.title,
                buttons:   buttons
            });
        };

        /**
         *
         * @param label
         * @param callback
         */
        this.confirm = function (label, callback) {

            this.ask(app.say.screedUnSaved+' '+app.say.continue+'?', callback, {
                id:    'scr_confirm',
                title: app.say.areYouSure,
                icon:  'icon-warning-sign',
                label: app.say.yes+ ', ' + label
            })
        };

        /**
         *
         */
        this.close = function () {

            this.$div.dialog('close').remove();
        };
    };

    /*
     --------------------------------------------------------------------
     LocalFile definitions
     --------------------------------------------------------------------
     */

    /**
     *
     * @param app
     * @constructor
     */
    var LocalFile = function (app) {

        this.app = app;
        this.file = this.app.screed.doc.file.local;
        return this
    };

    /**
     *
     * @type {{constructor: Function, pick: Function, read: Function, save: Function, file: {}}}
     */
    LocalFile.prototype = {

        constructor: LocalFile,

        /**
         *
         * @param event
         * @param afterRead
         */
        pick: function (event, afterRead) {

            this.file = event.target.files.item(0);
            this.read(afterRead)
        },

        /**
         *
         * @param afterRead
         */
        read: function (afterRead) {

            var fl = this,
                progress,
                notice = $.pnotify({
                    title:       this.app.say.opening + ' ' + this.file.name,
                    text:        '<div class="progress-bar"></div>',
                    type:        'info',
                    icon:        'icon-folder-open-alt',
                    hide:        false,
                    closer:      false,
                    sticker:     false,
                    before_open: function (pnotify) {

                        progress = pnotify.find('.progress-bar');
                        progress.progressbar({
                            value: 0
                        });
                    }
                }),
                reader = new FileReader();

            reader.onprogress = function (event) {

                //noinspection JSUnresolvedVariable
                if (event.lengthComputable) {
                    //noinspection JSUnresolvedVariable
                    var percentLoaded = Math.round((event.loaded / event.total) * 100);
                    if (percentLoaded < 100) {
                        progress.progressbar('option', 'value', percentLoaded);
                    }
                }
            };

            reader.onload = function (event) {

                notice.pnotify({
                    title:   fl.app.say.done + '!',
                    type:    'success',
                    icon:    'icon-ok-sign',
                    hide:    true,
                    closer:  true,
                    sticker: true
                });
                progress.progressbar('option', 'value', 100);
                afterRead(event.target.result, fl.file);
            };

            reader.onerror = function (event) {

                var error = event.target.error,
                    text = '';
                //noinspection JSUnresolvedVariable
                switch (error.code) {

                    case error.ENCODING_ERR:
                        text = fl.app.say.fileWrongEncoding;
                        break;

                    case error.NOT_FOUND_ERR:
                        text = fl.app.say.fileNotFound;
                        break;

                    case error.NOT_READABLE_ERR:
                        text = fl.app.say.fileNotReadable;
                        break;

                    case error.SECURITY_ERR:
                        text = fl.app.say.fileSecurity;
                        break;

                    default:
                        text = fl.app.say.fileUnresolved;
                }
                notice.pnotify({
                    title:   fl.app.say.fileNotOpening,
                    text:    text,
                    type:    'error',
                    icon:    'icon-exclamation-sign',
                    hide:    true,
                    closer:  true,
                    sticker: true
                });
            };

            reader.readAsText(this.file);

        },

        /**
         * TODO notify progress
         * @param fileName
         * @param afterSave
         * @param isHtml
         */
        save: function (fileName, afterSave, isHtml) {

            isHtml = isHtml || false;

            var fl = this,
                screedDoc = fl.app.screed.getScreed(isHtml),
                type = fl.app.options.file.mimetype,
                ext = ((isHtml) ? fl.app.options.file.htmlExtension : fl.app.options.file.extension),
                blob = new Blob([screedDoc], {type: type}),
                fileSaver = saveAs(blob, fileName + ext);

            fl.file.name = fileName + ext;
            fl.file.size = screedDoc.length;
            fl.file.type = type;

            fileSaver.onwriteend = function (event) {
                console.log(event);
//                afterSave(fl.file);
            };
            afterSave(fl.file)
        }
    };

    /*
     --------------------------------------------------------------------
     PickerFile definitions
     --------------------------------------------------------------------
     */

    /**
     *
     * @param app
     * @constructor
     */
    var PickerFile = function (app) {

        this.app = app;

        /*
         var appFile = this.app.screed.doc.file.picker;
         if (!$.isPlainObject(appFile)) {
         appFile = {
         url: '',
         filename: '',
         mimetype: this.app.options.file.mimetype,
         size: 0,
         isWriteable: false
         };
         }
         */
        this.file = this.app.screed.doc.file.picker;
        return this
    };

    /**
     *
     * @type {{constructor: Function, pick: Function, read: Function, save: Function, file: {}}}
     */
    PickerFile.prototype = {

        constructor: PickerFile,

        /**
         *
         * @param event
         * @param afterRead
         */
        pick: function (event, afterRead) {

            this.read(afterRead)
        },

        /**
         *
         * @param afterRead
         */
        read: function (afterRead) {

            var fp = this,
                progress,
                notice = $.pnotify({
                    title:       fp.app.say.opening + ' Filepicker.io',
                    text:        '<div class="progress-bar"></div>',
                    type:        'info',
                    icon:        'icon-cloud-download',
                    hide:        false,
                    closer:      false,
                    sticker:     false,
                    before_open: function (pnotify) {

                        progress = pnotify.find('.progress-bar');
                        progress.progressbar({
                            value: 0
                        });
                    }
                }),

                onError = function (FPError) {

                    if (FPError.code === 101) {

                        notice.pnotify({
                            title:   fp.app.say.cancel,
                            text:    fp.app.say.fileNotPicked,
                            type:    'notice',
                            icon:    'icon-cloud',
                            hide:    true,
                            closer:  true,
                            sticker: true
                        });
                        return true
                    }
                    notice.pnotify({
                        text:    FPError.toString(),
                        title:   fp.app.say.error + '!',
                        type:    'error',
                        icon:    'icon-exclamation-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    return false
                },

                onRead = function (screedDoc) {

                    notice.pnotify({
                        title:   fp.app.say.done + '!',
                        type:    'success',
                        icon:    'icon-ok-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    progress.progressbar('option', 'value', 100);

                    afterRead(screedDoc, fp.file);
                },

                onProgress = function (percent) {

                    notice.pnotify({
                        title: fp.app.say.opening
                    });
                    progress.progressbar('option', 'value', percent)
                };

            filepicker.pick({
                    extension: fp.app.options.file.extension,
                    modal:     true
                },
                function (FPFile) {

                    fp.file = FPFile;

                    filepicker.read(
                        FPFile,
                        {
                            asText: true
                        },
                        onRead,
                        onError,
                        onProgress
                    )
                },
                onError
            );

        },

        /**
         *
         * @param fileName
         * @param afterSave
         * @param isHtml
         */
        save: function (fileName, afterSave, isHtml) {

            isHtml = isHtml || false;

            var fp = this,
                screedDoc = this.app.screed.getScreed(isHtml),
                progress,
                notice = $.pnotify({
                    title:       'Filepicker.io',
                    text:        '<div class="progress-bar"></div>',
                    type:        'info',
                    icon:        'icon-cloud-upload',
                    hide:        false,
                    closer:      false,
                    sticker:     false,
                    before_open: function (pnotify) {
                        progress = pnotify.find('.progress-bar');
                        progress.progressbar({
                            value: 0
                        });
                    }
                }),

                onProgress = function (percent) {

                    notice.pnotify({
                        title: fp.app.say.saving
                    });
                    progress.progressbar('option', 'value', percent)
                },

                afterWrite = function (FPFile) {

                    progress.progressbar('option', 'value', 100);
                    notice.pnotify({
                        title:   fp.app.say.done,
                        type:    'success',
                        icon:    'icon-ok-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    afterSave(FPFile)
                },

                onError = function (FPError) {

                    if (FPError.code === 131) {

                        notice.pnotify({
                            title:   fp.app.say.done + '!',
                            type:    'success',
                            icon:    'icon-ok-sign',
                            hide:    true,
                            closer:  true,
                            sticker: true
                        });

                    } else {

                        notice.pnotify({
                            title:   fp.app.say.error + '!',
                            text:    FPError.toString(), /** TODO custom resolve on FPError.code */
                            type:    'error',
                            icon:    'icon-exclamation-sign',
                            hide:    true,
                            closer:  true,
                            sticker: true
                        })
                    }
                };

            if (!fp.file.url) {

                var ext = ((isHtml) ? fp.app.options.file.htmlExtension : fp.app.options.file.extension);

                filepicker.store(
                    screedDoc,
                    {
                        filename: fileName
                    },
                    function (FPFile) {

                        filepicker.exportFile(
                            FPFile.url,
                            {
                                extension:         ext,
                                suggestedFilename: FPFile.filename
                            },
                            afterWrite,
                            onError
                        );
                    },
                    onError
                )

            } else {

                filepicker.write(
                    fp.file, /* as FPFile object */
                    screedDoc,
                    afterWrite,
                    onError,
                    onProgress
                )
            }
        }
    };

    /*
     --------------------------------------------------------------------
     Service definitions
     --------------------------------------------------------------------
     */

    var Service = function () {

        this.getUUId = function () {
            /**
             * @link http://www.broofa.com/Tools/Math.uuid.js
             * */
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        /*
         this.isEmail = function (str) {
         return (/^[a-zA-Z0-9.!#$%&'*+\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/).test(str);
         };
         */

        return this
    };

    Service.prototype = {
        constructor: Service
    }

})(jQuery, window, document);
