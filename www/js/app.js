/* screed app logic.js */
(function ($) {

    "use strict";

    var app = {

        debug: false,

        help: '.scr-help',

        info:   '.scr-info',
        type:   '.scr-info-type',
        pos:    '.scr-info-pos',
        select: '.scr-info-type-sel',

        status: '.scr-status',
        lock:   '.scr-status-lock',
        save:   '.scr-status-save',

        edit:     '.scr-edit',
        undo:     '.scr-edit-undo',
        redo:     '.scr-edit-redo',

        /*        scrollIn: '.scr-content',*/
        scrollIn: 'body',
        appendTo: 'body>header',

        menu: {
            active:    {},
            p:         '.scr-menu-p',
            where:     '.scr-menu-where',
            when:      '.scr-menu-when',
            location:  '.scr-menu-location',
            character: '.scr-menu-character'
        },

        volux: {
            id: '7d2d8236-3694-4fb7-a35a-3cb58e7ad194'
        },

        googleDrive: {
            clientID: '94663496299.apps.googleusercontent.com'
        },

        dropbox: {
            key:     'YRkaWUkRc2A=|sjiyStVuSiRzt+JJVP4WRYsTHbFR3ilUP3IKKNQBRQ==',
            sandbox: true
        },

        filepicker: {
            key:           'AMMYr96hlQf2E9H9eAVMAz',
            mimetype:      'text/plain', /* not use -> filepicker set ext to .txt */
            extension:     '.screed',
            htmlExtension: '.html'
        },

        server: {
            pick: function (afterPick) {

            },

            open: function (filename, afterOpen) {
                $.ajax({
                    url:      "/open",
                    data:     {filename: filename},
                    type:     'GET',
                    dataType: 'html',
                    cache:    false
                })
                    .done(afterOpen)
                    .fail(function () {
                        options.notify.error('something went wrong')
                    })
            },

            save: function (file, screed, callback) {
                $.ajax({
                    url:      '/save',
                    type:     'POST',
                    dataType: 'html',
                    data:     {filename: file.filename, screed: screed},
                    cache:    false
                })
                    .done(callback)
                    .fail(function () {
                        options.notify.error('something went wrong')
                    })
            }
        },

        local: {

            pick: function (afterPick) {

            },

            open: function (afterOpen) {

            },

            save: function (afterSave) {

            },

            file: {}
        },

        toolbar: {
            info:    {
                disable: function () {
                    $(app.select).button('disable');
                    $(app.pos).button('disable');
                    $(app.type).button('disable')
                },
                enable:  function () {
                    $(app.select).button('enable');
                    $(app.pos).button('enable');
                    $(app.type).button('enable')
                }
            },
            status:  {
                disable: function () {
                    $(app.save).button('disable');
                    $(app.lock).button('disable')
                },
                enable:  function () {
                    $(app.save).button('enable');
                    $(app.lock).button('enable')
                }
            },
            edit:    {
                disable: function () {
                    $(app.undo).button('disable');
                    $(app.redo).button('disable')
                },
                enable:  function () {
                    $(app.undo).button('enable');
                    $(app.redo).button('enable')
                }
            },
            disable: function (name) {
                $(name).button('disable');
            },
            enable:  function (name) {
                $(name).button('enable');
            },
            icon:    function (name, icon) {
                $(name).button("option", "icons", { primary: icon })
            }
        },

        scrollTo: function ($to, offset) {
            if (0 === $to) {
                $to = {top: 0}
            }
            if ($.type(offset) == 'undefined') {
                offset = -200
            }
            $(app.scrollIn).scrollTo($to, 0, {axis: 'y', offset: offset})
        },

        preview: function (screedHtml) {
            return $('<div class="scr-preview"><div class="scr-ribbon">' + screedHtml + '</div></div>')
        },

        log: function (msg) {
            if (app.debug) {
                $('#scr_debug').children(0).prepend('<li>' + msg + '</li>')
            }
        },

        do: {

            uuid: function () {
                /**
                 * @link http://www.broofa.com/Tools/Math.uuid.js
                 * */
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },

            initApp: function () {

                window.screedOptions = {};

                app.do.initVendors();
                app.do.makeToolBar();
                app.do.helpInit();
                app.do.listenKeyboard();

                app.do.userIdentify();

                app.do.restoreAutoSaved();

            },

            userIdentify: function () {
                options.user.info = JSON.parse(localStorage.getItem('user' + options.screed));
                if (null == options.user.info) {
                    options.user.info = {
                        id:      app.do.uuid(),
                        name:    '',
                        contact: ''
                    }
                }
                localStorage.setItem('user' + options.screed, JSON.stringify(options.user.info))
            },

            restoreAutoSaved: function () {

                app.local.file = JSON.parse(localStorage.getItem('autoSave' + options.screed));

                if (app.local.file) {
                    var
                        $preview,
                        $ask = $('<div>' +
                            'Найден автосохранённый сценарий:' +
                            '<div class="alert alert-info scr-pointer">' +
                            '<p class="scr-inline-title">' +
                            app.local.file.title +
                            '</p>' +
                            '<p class="muted">' +
                            moment(app.local.file.date).fromNow() +
                            '</p>' +
                            '</div>' +
                            'Восстановить его?' +
                            '</div>')
                            .find('.alert').on('mouseenter',function () {
                                $preview = app.preview(app.local.file.html).appendTo('#scr_ask').position({
                                    my: 'left top',
                                    at: 'left+5 bottom+5',
                                    of: $(app.appendTo)
                                }).show().scrollTo(options.get().el.current, 0, {axis: 'y', offset: -400})
                            }).on('mouseleave',function () {
                                $preview.remove()
                            }).end();

                    options.ask($ask,
                        function (result) {
                            if (result) {
                                options.get().replace(app.local.file.html, false);
                                $(window).on('unload', function () {
                                    var $screed = $(options.screed);
                                    if (!$screed.is('.saved')) {
                                        $screed.trigger('unsaved')
                                    }
                                });
                            } else {
                                localStorage.removeItem('autoSave' + options.screed);
                                $(options.screed).screed(options)
                            }
                        }
                    );
                    $(options.screed).screed($.extend(options, {autoStart: false}));
                } else {
                    $(options.screed).screed(options);
                }
            },

            initVendors: function () {

                if (app.debug) {
                    $('<div id="scr_debug"><ul></ul></div>')
                        .appendTo(app.appendTo)
                        .on('dblclick', 'li', function () {
                            $(this).nextAll().andSelf().remove()
                        })
                }
                /*else {
                 $(document).tooltip()
                 }*/

                $.pnotify.defaults.delay = 4000;
                $.pnotify.defaults.history = false;

                filepicker.setKey(app.filepicker.key);
                moment.lang('ru');
            },

            delegateMenus: function () {
                $(app.menu.p)
                    /*        .hide().menu()*/
                    .on('click', 'a', function () {
                        var $a = $(this);
                        event.preventDefault();
                        $a.closest('ul').hide();
                        $(options.screed).find(options.get().el.current).trigger({type: 'type', to: $a.attr('href').substr(3)}).focus();
                        return false
                    });

                $(app.menu.where + ', ' + app.menu.when + ', ' + app.menu.location + ', ' + app.menu.character)
                    /*        .hide().menu()*/
                    .on('click', 'a', function () {
                        var $a = $(this);
                        event.preventDefault();
                        $a.closest('ul').hide();
                        $(options.screed).find(options.get().el.current).text($a.attr('href').substr(3)).focus();
                        return false
                    })
                    .on('menuselect', function (event, ui) {
                        console.log(event, ui);
                    })
                ;
            },

            makeToolBar: function () {
                $('.navbar')
                    .on('selectstart', function () {
                        return false
                    });

                $(app.edit)
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
                    .on('click', 'button', function (event) {
                        event.preventDefault();
                        var $button = $(this);
                        if ($button.is(app.undo)) {
                            $(options.screed).trigger('undo')
                        }
                        if ($button.is(app.redo)) {
                            $(options.screed).trigger('redo')
                        }
                        return false
                    })
                    .buttonset()
                    .show();

                $(app.status)
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
                        /*
                         disabled: true,
                         */
                        text:  false
                    })
                    .parent()
                    .on('click', 'button', function () {
                        var $button = $(this);
                        if ($button.is(app.lock)) {
                            $(options.screed).trigger('lock')
                        }
                        if ($button.is(app.save)) {
                            $(options.screed).trigger('save')
                        }
                        return false
                    })
                    .show();

                $(app.info)
                    .on('click', 'button', function (event) {
                        event.preventDefault();
                        var $button = $(this),
                            $current = $(options.screed).find(options.get().el.current),
                            prepareList = function (elClass) {
                                var $list = $(app.menu[elClass]).first().clone();
                                $list.children().each(function () {
                                    var $li = $(this),
                                        text = $li.text();
                                    $li.empty().append('<a href="/#!' + text + '">' + text + '</a>')
                                });
                                return $list
                            }
                            ;

                        if ($button.is(app.pos)) {
                            $(options.screed).trigger('currentFocus')
                        }

                        if ($button.is(app.type)) {
                            $current.trigger({type: 'type', dir: 1})
                        }

                        if ($button.is(app.select)) {
                            if ($current.parent().is(options.get().el.para)) {
                                options.get().classesList($current.parent());
                                app.menu.active = $(app.menu.p).clone();
                                app.menu.active.children().each(function () {
                                    var $li = $(this),
                                        $a = $li.children(0),
                                        type = $a.attr('href').substr(3);
                                    if ($.inArray(type, options.get().classes[options.get().classes.list]) >= 0) {
                                        $li.removeClass('ui-state-disabled')
                                    } else {
                                        $li.addClass('ui-state-disabled')
                                    }
                                });
                            } else {
                                var elClass = $current.parent().attr('class');
                                switch (elClass) {
                                    case 'location':
                                        app.menu.active = prepareList(elClass);
                                        break;
                                    case 'character':
                                        app.menu.active = prepareList(elClass);
                                        break;
                                    default:
                                        app.menu.active = $(app.menu[elClass]).clone();
                                        break;
                                }
                            }
                            app.menu.active.appendTo(app.appendTo).menu().show();
                            app.do.delegateMenus();
                            app.menu.active.position({
                                my: 'left top',
                                at: 'left top',
                                of: this
                            });
                            $(document).one('click', function () {
                                options.onEscape();
                            });
                        }
                        return false
                    })
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
                    .on('label' + options.screed, 'button', function (event) {
                        $('.ui-button-text > span', this).text(event.label)
                    })
                    .buttonset()
                    .show();

            },

            helpInit: function () {

                $(app.help)
                    .on('selectstart', function () {
                        return false
                    })
                    .on('click', '.nav-list code', function () {
                        $(this).prev().trigger('click')
                    })
                    .on('click', 'a', function (event) {
                        event.preventDefault();
                        var $a = $(this);
                        if ($a.is('.a-help')) {
                            $(app.help).trigger('help');
                            return false
                        }
                        $(options.screed).trigger($a.attr('href').substr(3));
                        return false
                    })
                    .on('help', function () {
                        var $help = $(this);
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
                ;
                $('.brand').on('click', function () {
                    $(app.help).trigger('help');
                    return false
                })
            },

            listenKeyboard: function () {
                $(window.document).on('keydown.document', function (event) {
                    /*console.log(event.which);*/
                    if (event.ctrlKey && !event.shiftKey) {
                        switch (event.which) {

                            case 69:
                                /* ctrl + e - new screenplay */
                                event.preventDefault();
                                $(options.screed).trigger('clean');
                                return false;
                                break;

                            case 76:
                                /* ctrl + l - lock screenplay */
                                event.preventDefault();
                                $(options.screed).trigger('lock');
                                return false;
                                break;

                            case 79:
                                /* ctrl + o - open screenplay */
                                event.preventDefault();
                                $(options.screed).trigger('open');
                                return false;
                                break;

                            case 83:
                                /* ctrl + s - save screenplay */
                                event.preventDefault();
                                $(options.screed).trigger('save');
                                return false;
                                break;

                            case 90:
                                /* ctrl + z - undo */
                                $(options.screed).trigger('undo');
                                break;

                        }
                    } else if (!event.ctrlKey && event.shiftKey) {
                        switch (event.which) {

                            case 112:
                                /* shift + f1 - show scenes list */
                                event.preventDefault();
                                $(options.screed).trigger('scenes');
                                return false;
                                break;

                            case 113:
                                /* shift + f2 - focus to tittle */
                                $(options.screed).trigger('tittleFocus');
                                return true;
                                break
                        }
                    } else if (event.ctrlKey && event.shiftKey) {
                        switch (event.which) {
                            case 83:
                                /* ctrl + shift + s - save screenplay as standalone html*/
                                event.preventDefault();
                                $(options.screed).trigger('alone');
                                return false;
                                break;

                            case 90:
                                /* ctrl + shift + z - redo */
                                $(options.screed).trigger('redo');
                                break;
                        }
                    } else {
                        switch (event.which) {

                            case 8:
                                /* backspace - block browser history back */
                                event.preventDefault();
                                options.notify.info('Browser history back blocked');
                                return false;
                                break;

                            case 27:
                                /* escape - revert changes, blur without change */
                                event.stopPropagation();
                                options.onEscape();
                                /* $(options.get().el.current).focus().blur();*/
                                return false;
                                break;

                            case 112:
                                /* f1 - show help */
                                event.preventDefault();
                                $(app.help).trigger('help');
                                return false;
                                break;

                            case 113:
                                /* f2 - focus to current element */
                                event.preventDefault();
                                $(options.screed).trigger('currentFocus');
                                return false;
                                break
                        }
                    }
                    return true
                });

            }
        }

    };

    var options = {

        screed: '.screed',

        user: {
            info:    {},
            name:    function () {

            },
            contact: function () {

            }
        },

        onHelp: function () {
            $(app.help).trigger('help')
        },

        onEscape: function () {
            if (!$.isEmptyObject(app.menu.active)) {
                app.menu.active.remove()
            }
        },

        onUndo: function (state) {
            if (!state) {
                app.toolbar.disable(app.undo)
            } else {
                if (!options.get().edit.undoStack.length) {
                    app.toolbar.disable(app.undo)
                } else {
                    app.toolbar.enable(app.undo)
                }
            }
        },

        onRedo: function (state) {
            if (!state) {
                app.toolbar.disable(app.redo)
            } else {
                if (!options.get().edit.redoStack.length) {
                    app.toolbar.disable(app.redo)
                } else {
                    app.toolbar.enable(app.redo)
                }
            }
        },

        onCurrent: function ($el) {
            if (($.type($el) === 'undefined')) {
                return false
            }

            options.onEscape();
            var pos = $el.prevAll().length + 1,
                posLabel = '',
                typeLabel = '',
                sections = $el.closest(options.get().el.scene).prevAll().length;

            if (sections == 0) {
                posLabel = '';
                typeLabel = '';
                app.toolbar.info.disable();

            } else {

                if ($el.is(options.get().el.para)) {
                    posLabel = sections + ':' + pos;
                    typeLabel = $(app.menu.p).find('a[href="/#!' + $el.attr('class') + '"]').text();
                    app.toolbar.info.enable()
                } else {
                    posLabel = sections;
                    if ($el.is('.location')) {
                        typeLabel = $(app.menu.location).find('li').first().text();
                        app.toolbar.info.enable()
                    } else {
                        typeLabel = $(app.menu[$el.attr('class')]).find('a[href="/#!' + $el.text() + '"]').text();
                        app.toolbar.info.enable()
                    }
                }
            }
            $(app.pos).trigger({type: 'label', label: posLabel});
            $(app.type).trigger({type: 'label', label: typeLabel});
            app.scrollTo($el);
            return true
        },

        onClean: function (afterClean) {
            afterClean($('#scr_clean').html(), false);
            app.scrollTo($(options.screed).trigger('saved'))
        },

        onLock: function (locked) {
            var icon = 'icon-unlock';
            if (locked) {
                icon = 'icon-lock';
            }
            app.toolbar.icon(app.lock, icon)
        },

        onLocked: function (locked) {
            if (locked) {
                app.toolbar.disable(app.lock)
            } else {
                app.toolbar.enable(app.lock)
            }
        },

        fileData: function ($screed, filename) {
            var $parent = $screed.parent(),
                file = $parent.data('file');
            if ($.isPlainObject(file)) {
                return file
            }
            return filename;
        },

        fileStore: function (file) {
            if (file) {
                $(options.screed).parent().data('file', file)
            }
        },

        onSaved: function (file) {
            app.toolbar.disable(app.save);
            options.fileStore(file)
        },

        onUnsaved: function () {
            app.toolbar.enable(app.save)
        },

        onOpen: function (afterRead) {

            var progress,
                notice = $.pnotify({
                    title:       'Open Filepicker.io',
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
                            title:   'Cancel',
                            text:    'No file picked',
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
                        title:   'Error!',
                        type:    'error',
                        icon:    'icon-exclamation-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    return false
                },

                onRead = function (screed) {

                    notice.pnotify({
                        title:   'Done!',
                        type:    'success',
                        icon:    'icon-ok-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    progress.progressbar('option', 'value', 100);

                    var $screed = afterRead(screed, file);
                    app.scrollTo($screed.trigger('saved'))
                },

                onProgress = function (percent) {
                    notice.pnotify({
                        title: 'Read'
                    });
                    progress.progressbar('option', 'value', percent)
                },

                file = false
                ;

            filepicker.pick({
                    extension: app.filepicker.extension,
                    modal:     true
                },
                function (FPFile) {

                    file = FPFile;

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

        onSave: function (FPFile, screed, callback, html) {
            var progress,
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

                writeProgress = function (percent) {
                    notice.pnotify({
                        title: 'Saving'
                    });
                    progress.progressbar('option', 'value', percent)
                },

                afterWrite = function (file) {
                    progress.progressbar('option', 'value', 100);
                    notice.pnotify({
                        title:   'Done!',
                        type:    'success',
                        icon:    'icon-ok-sign',
                        hide:    true,
                        closer:  true,
                        sticker: true
                    });
                    callback(file)
                },

                onError = function (FPError) {
                    if (FPError.code === 131) {
                        notice.pnotify({
                            title:   'Done!',
                            type:    'success',
                            icon:    'icon-ok-sign',
                            hide:    true,
                            closer:  true,
                            sticker: true
                        });
                    } else {
                        notice.pnotify({
                            title:   'Error!',
                            text:    FPError.toString(),
                            type:    'error',
                            icon:    'icon-exclamation-sign',
                            hide:    true,
                            closer:  true,
                            sticker: true
                        })
                    }
                };

            if (!$.isPlainObject(FPFile)) {
                var ext = ((html) ? app.filepicker.htmlExtension : app.filepicker.extension);
                filepicker.store(
                    screed,
                    {
                        filename: FPFile
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
                    FPFile,
                    screed,
                    afterWrite,
                    onError,
                    writeProgress
                )
            }
        },

        autoSave: function (screedHtml, title) {
            var screed = {
                title: title,
                date:  new Date(),
                html:  screedHtml
            };
            localStorage.setItem('autoSave' + options.screed, JSON.stringify(screed));
        },

        ask: function (question, callback, opt) {

            var defaults = {
                id:        'scr_ask',
                label:     'Да',
                title:     'Вопрос',
                icon:      'icon-question-sign',
                container: app.appendTo,
                position:  { my: 'right top', at: 'right-10 bottom+10 ', of: $(app.info) },
                minWidth:  function () {
                    return $(app.info).outerWidth()
                },
                open:      function () {
                    app.scrollTo(0, 0);
                },
                close:     function () {
                    $(this).dialog('destroy').remove();
                    $(options.screed).trigger('currentFocus')
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

            var $div = $('<div><i class="' + opt.icon + '"></i></div>')
                .attr('id', opt.id).attr('title', opt.title);
            $(opt.container).append($div);
            $div.append(question);

            $div.dialog({
                resizable: false,
                modal:     false,
                autoOpen:  true,
                position:  opt.position,
                minWidth:  opt.minWidth(),
                open:      opt.open,
                close:     opt.close,
                buttons:   [
                    {
                        text:  opt.label,
                        click: opt.confirm
                    },
                    {
                        text:  'Нет',
                        click: opt.reject
                    }
                ]
            });
        },

        confirm: function (label, callback) {

            options.ask('Рабочий сценарий не сохранён. Продолжить?', callback, {
                id:    'scr_confirm',
                title: 'Вы уверены?',
                icon:  'icon-warning-sign',
                label: 'Да, ' + label
            })
        },

        notify: {

            info: function (msg) {
                $.pnotify({
                    title: 'Info:',
                    text:  msg,
                    type:  'info'
                })
            },

            success: function (msg) {
                $.pnotify({
                    title: 'Success:',
                    text:  msg,
                    type:  'success'
                })
            },

            error: function (msg) {
                $.pnotify({
                    title: 'Error:',
                    text:  msg,
                    type:  'error'
                })
            }
        },

        get: function () {
            var dataOptions = window.screedOptions;
            if (!$.isPlainObject(dataOptions)) {
                options.log('Screed not initialized!');
                return options;
            }
            return dataOptions;
        },

        log: app.log
    };

    app.do.initApp();

})(jQuery);