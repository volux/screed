/**
 * logic.js
 */
(function($){

    "use strict";

    $.fn.selectText = function() {
        /**
         * taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element
         **/
        return this.each(function() {
            var range, selection;
            if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(this);

                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(this);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    };

    $.fn.caretToEnd = function() {
        /**
         * taken from http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
         */
        return this.each(function() {
            var range, selection;
            if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(this);

                range.collapse(false);

                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(this);

                range.collapse(false);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    };

    $.when(
        $.getScript('/js/jquery.screed.js')
    ).then(function() {
        $('.screed').screed()
    });

})(jQuery);