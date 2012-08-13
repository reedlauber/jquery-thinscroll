/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },

    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

/*! Copyright (c) 2012 Reed Lauber (http://reedlauber.com)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0
 */
(function($) {
	$.fn.thinScroll = function(options) {
		var o = $.extend({
				padding: 4, // space to the top/right/bottom of bar
				width: 6, // width of the bar
				minHeight: 20, // minimum possible height for the bar
				speed: 5, // speed content scrolls relative to actual mousewheel scroll speed. higher is faster
				opacity: 0.4 // bar opacity. 0.1 - 1.0
			}, options),
			style = {
				position: 'absolute',
				top: o.padding,
				right: o.padding,
				width: o.width,
				backgroundColor: 'rgba(30, 30, 30, ' + o.opacity + ')',
				borderRadius: '4px'
			};

		function adjustPosition($bar, $el, delta, ratio, bLimit, elLimit) {
			var barTop = $bar.position().top,
				elTop = $el.position().top;

			barTop -= (delta * o.speed * ratio);
			elTop += (delta * o.speed);

			if(barTop <= o.padding) {
				barTop = o.padding;
				elTop = 0;
			}

			if(barTop >= bLimit - o.padding) {
				barTop = bLimit - o.padding;
			}
			if(elTop <= (0 - elLimit)) {
				elTop = (0 - elLimit);
			}

			if(delta < 1) { // scroll down
				$bar.css('top', barTop);
				$el.css('top', elTop);
			} else { // scroll up
				$bar.css('top', barTop);
				$el.css('top', elTop);
			}
		}

		return this.each(function() {
			var $this = $(this).css('position', 'relative'),
				$p = $this.parent().css('position', 'relative');

			var h = $this.outerHeight(),
				pH = $p.outerHeight();

			// If inner content is shorter, don't bother
			if(h > pH) {
				var ratio = pH / h, // ratio of outer (container) element to inner (content) element
					barH = pH * ratio, // bar height will be percentage of non-visible height to overall height
					scrollRatio; // declare for later

				// make sure content isn't so tall that it becomes less than minimum height
				if(barH < o.minHeight) {
					barH = o.minHeight;
				}
				// bar scrolling needs to be in sync with scrolling of content
				// so, the bar scrolling ratio is the relationship between:
				// the distance the bar can travel (container height - bar height - padding)
				// and the distance the content can travel (content height - visible content area)
				scrollRatio  =  (pH - (o.padding * 2) - barH) / (h - pH);

				// calculate the limits that the bar and content can travel when scrolling down
				var barLimit = pH - barH,
					thisLimit = h - pH;

				// create bar style using default styles and computed height
				var css = $.extend({ height:barH }, style);
				var $bar = $('<div class="thin-scroll" />').css(css).appendTo($p);

				// listen for mousewheel events and move bar/content
				$p.mousewheel(function(evt, d) {
					adjustPosition($bar, $this, d, scrollRatio, barLimit, thisLimit);
				});
			}
		});
	};
})(jQuery);