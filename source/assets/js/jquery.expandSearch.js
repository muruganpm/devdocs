;(function ($,window,document,undefined ) {
    "use strict";

    /**
     * Short description
     * The plugin extends the search and adds keyboard arrow support and show/hide effects.
     *
     * long description
     * The search input field is displayed with a slide animation when the button element is clicked.
     * The search results based on the input inside the search input field are generated by the jquery.lunr.search plugin.
     * The navigateResults function allows the user to navigate through the search results by using the up & down arrow keys.
     *
     * @example Initialize the plugin
     *    $('.test').expandSearch();
     *
     * @example dom structure
     * 
     *    <div id="searchBox">
     *       <form>
     *          <input id="search-query">
     *       </form>
     *    </div>
     *        
     *    <div id="search-results"> 
     *       <div class="entries">
     *          <a class="entry">
     *              //content
     *          </a>
     *       </div>
     *    </div>
     *    
     *    <span class="searchButton"></span>
     */

    /** @string plugin name */
    var pluginName = 'expandSearch',

        /** @object default options */
        opts = {

            /** @string Search box selector */
            search: '#searchBox',

            /** @string Search input field (id selector) */
            inputForm: 'search-query',

            /** @int search show effect animation speed */
            animationSpeed: 200,

            /** @string search result div */
            results: '#search-results',

            /** @string search result entries div */
            entries: '.entries',

            /** @string* search result entry active class */
            activeClass: 'active'
        };

    /**
     * @param {Node} el
     * @param {Object} options
     * @constructor
     */
    function Plugin(el, options) {
        var me = this;

        me.opts = $.extend({}, opts, options);

        me.$el = $(el);
        me.$body = $('body');
        me.$search = $(me.opts.search);
        me.$result = $(me.opts.results);
        me.$entries = $(me.opts.entries);
        me.$input = $('#' + me.opts.inputForm);

        this.init();
    }

    /**
     * plugin init function
     */
    Plugin.prototype.init = function () {
        var me = this,
            query = me.getParameterByName('q');

        me.$el.on('click.' + pluginName, $.proxy(me.onClick, me));
        me.$body.on('click.' + pluginName, $.proxy(me.onBodyClick, me));
        me.$body.on('keydown.' + pluginName, $.proxy(me.navigateResults, me));

        if(query) {
            me.$search.show();
        }
    };

    /**
     * Event listener which will be fired when the user clicks on the element {@link this.$el}
     * @event click
     */
    Plugin.prototype.onClick = function() {
        var me = this;

        me.$search.animate({width:'toggle'}, me.opts.animationSpeed, function () {
            $('#' + me.opts.inputForm).focus();
        });

        if (me.$result.is(':visible')) {
            me.$result.hide();
        }
    };

    /**
     * closes menu on body click (if not button or input field)
     * @event click
     * @param {Event} event
     */
    Plugin.prototype.onBodyClick = function (event) {
        var me = this;
        var $target = $(event.target);

        if ($target.attr('id') === me.opts.inputForm
            || $target.hasClass('searchButton')
            || $target.hasClass('icon-search')) {
            return;
        }

        if (!me.$input.val().length || me.$result.is(':visible')) {
            me.$search.hide();
            me.$result.hide();
            me.$input.val("");
        }
    };

    /**
     * Enables keyboard arrow (up / down) support to navigate though the search results and enter to go to the link location with the enter key.
     * @event keyDown
     * @param {Event} event
     */
    Plugin.prototype.navigateResults = function (event) {
        var me = this,
            key = event.keyCode || event.which,
            activeElement,
            entry;

        if (me.$entries.children().length) {
            activeElement = $(me.opts.entries).find('.' + me.opts.activeClass);

            if (activeElement.length === 1) {
                if (key === 40) {
                    event.preventDefault();
                    if (!activeElement.next().length) {
                        var entry = me.$entries.children().first();
                        entry.addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    } else {
                        activeElement.next().addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    }
                } else if (key === 38) {
                    event.preventDefault();
                    if (!activeElement.prev().length) {
                        var entry = me.$entries.children().last();
                        entry.addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    } else {
                        activeElement.prev().addClass(me.opts.activeClass);
                        activeElement.removeClass(me.opts.activeClass);
                    }
                }
            } else {
                if (key === 40) {
                    entry = $(me.opts.entries).children().first();
                    entry.addClass(me.opts.activeClass);
                } else if (key === 38) {

                    entry = $(me.opts.entries).children().last();
                    entry.addClass(me.opts.activeClass);
                }
            }
        }

        if(key === 13) {
            event.preventDefault();

            entry = $(me.opts.entries).find('.' + me.opts.activeClass);
            if(entry.length) {
                window.location.href = entry.attr('href');
            }
        }
    };

    /**
     * @param {String} name Query parameter
     * @returns {undefined|string} returns the value of the query parameter
     */
    Plugin.prototype.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    $.fn.expandSearch = function (options) {
        return this.each(function() {
            new Plugin(this, options);
        });
    };

    /**
     * initial function call on DOM element
     */
    $(function() {
        $('.searchButton').expandSearch();
    });

}) (jQuery, window, document);