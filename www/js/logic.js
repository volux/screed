/**
 * screed app logic.js
 */
(function($){

    "use strict";

    var options = {
        key: '.screed',

        onOpen: function ($screed) {
            $.ajax({
                url: '/open',
                type: 'GET',
                cache: false
            })
                .done(function(screed) {
                    $screed
                        .html($(screed).html())
                        .trigger('init');
                })
                .fail(function(){
                    options.notify.error('something went wrong')
                })
        },

        onSave: function (screed) {
            $.ajax({
                url: '/save',
                type: 'POST',
                data: {screed: screed},
                cache: false
            })
                .done(function (msg) {
                    options.notify.info(msg)
                })
                .fail(function(){
                    options.notify.error('something went wrong')
                })
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
        }

    };

    $.when(

        $.getScript('/js/jquery.screed.js')

    ).then(function() {

        $(options.key).screed(options);

        $(window.document).on('keydown'+options.key, function(event) {
            console.log(event.which);
            if (event.ctrlKey && !event.shiftKey) {
                switch(event.which) {

                    case 69:
                        /* ctrl + e - new screenplay */
                        event.preventDefault();
                        $(options.key).trigger('clean');
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
            } else
            if (!event.ctrlKey && event.shiftKey) {
                switch(event.which) {

                    case 112:
                        /* shift + f1 - show statistic */
                        event.preventDefault();
                        options.notify.info('show statistic from body');
                        return false;
                        break;

                    case 113:
                        /* shift + f2 - focus to tittle */
                        $(options.key).trigger('tittleFocus');
                        return true;
                        break
                }
            } else {
                switch(event.which) {

                    case 8:
                        /* backspace - block browser history back */
                        event.preventDefault();
                        options.notify.info('browser history back blocked');
                        return false;
                        break;

                    case 112:
                        /* f1 - show hotkeys help */
                        event.preventDefault();
                        options.notify.info('show hotkeys help body');
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
        })
    });

})(jQuery);