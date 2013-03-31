/* screed app logic.js */
(function ($) {

    "use strict";

    var options = {
        key:  '.screed',
        help: '.scr-help',
        info: '.scr-info',

        server: {
            pick: function (afterPick) {

            },

            open: function (filename, afterOpen) {
                $.ajax({
                    url:      "/open",
                    data:     {filename: filename},
                    type:     'GET',
                    dataType: 'xml',
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

        onCurrent: function ($p) {
            if (!($.type($p) === 'undefined')) {
                var text = '',
                    sections = $p.closest('section').prevAll().length;
                if (sections > 0) {
                    if ($p.is('p')) {
                        text = sections + ':' + ($p.prevAll().length + 1)
                    } else {
                        text = sections
                    }
                }
                $('#scr_current').text(text);
                $('#scr_type').text($p.attr('class'));
            }
        },

        onClean: function ($parent, afterClean) {
            var $screed = $parent.html($('#scr_clean').html()).children(0);
            $parent.data('file', false);
            afterClean($screed)
        },

        onOpen: function (afterPick, afterRead) {

            var progress,
                notice = $.pnotify({
                    title:       "Open Filepicker.io",
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
                            title:   'Cansel',
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
                    afterRead(screed)
                },

                onProgress = function (percent) {
                    notice.pnotify({
                        title: 'Read'
                    });
                    progress.progressbar('option', 'value', percent)
                }
                ;
            filepicker.pick({
                    extension: options.filepicker.extension,
                    modal:     true
                },
                function (FPFile) {
                    afterPick(FPFile);
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
                filepicker.store(
                    screed,
                    {
                        filename: FPFile + ((html) ? ' -screed.html' : '.screed.xml')
                    },
                    function (FPFile) {
                        filepicker.exportFile(
                            FPFile.url,
                            {
                                extension:         options.filepicker.extension,
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

        confirm: function (label, callback) {

            $('#scr_confirm').dialog({
                resizable: false,
                modal:     true,
                autoOpen:  true,
                buttons:   [
                    {
                        text:  'Yes, ' + label,
                        click: function () {
                            $(this).dialog('close');
                            callback();
                        }
                    },
                    {
                        text:  'Cancel',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }
                ]
            });
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

        filepicker: {
            key:       'AMMYr96hlQf2E9H9eAVMAz',
            mimetype:  'text/html',
            extension: '.html'
        }

    };

    $(document).tooltip({
        track: true
    });

    $.pnotify.defaults.delay = 5000;
    $.pnotify.defaults.history = false;

    filepicker.setKey(options.filepicker.key);

    $(options.info)
        .on('click', 'a', function (event) {
            event.preventDefault();
            var $a = $(this);
            if ($a.is('#scr_type')) {
                $('.current').trigger('type').focus()
            }
            return false
        });

    $(options.help)
        .on('click', 'a', function (event) {
            event.preventDefault();
            var $a = $(this);
            if ($a.is('.a-help')) {
                $(options.help).trigger('help');
                return false
            }
            $(options.key).trigger($a.attr('href').substr(3));
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

    $(options.key).screed(options);

    $(window.document).on('keydown', function (event) {
        /*console.log(event.which);*/
        if (event.ctrlKey && !event.shiftKey) {
            switch (event.which) {

                case 69:
                    /* ctrl + e - new screenplay */
                    event.preventDefault();
                    $(options.key).trigger('clean');
                    return false;
                    break;

                case 76:
                    /* ctrl + l - lock screenplay */
                    event.preventDefault();
                    $(options.key).trigger('lock');
                    return false;
                    break;

                case 79:
                    /* ctrl + o - open screenplay */
                    event.preventDefault();
                    $(options.key).trigger('open');
                    return false;
                    break;

                case 83:
                    /* ctrl + s - save screenplay */
                    event.preventDefault();
                    $(options.key).trigger('save');
                    return false;
                    break;
            }
        } else if (!event.ctrlKey && event.shiftKey) {
            switch (event.which) {

                case 112:
                    /* shift + f1 - show scenes list */
                    event.preventDefault();
                    $(options.key).trigger('scenes');
                    return false;
                    break;

                case 113:
                    /* shift + f2 - focus to tittle */
                    $(options.key).trigger('tittleFocus');
                    return true;
                    break
            }
        } else if (event.ctrlKey && event.shiftKey) {
            switch (event.which) {
                case 83:
                    /* ctrl + shift + s - save screenplay as standalone html*/
                    event.preventDefault();
                    $(options.key).trigger('html');
                    return false;
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

                case 112:
                    /* f1 - show help */
                    event.preventDefault();
                    $(options.help).trigger('help');
                    return false;
                    break;

                case 113:
                    /* f2 - focus to current element */
                    $(options.key).trigger('currentFocus');
                    return true;
                    break
            }
        }
        return true
    });

})(jQuery);