# jQuery Thin Scrollbar Plugin

A jQuery plugin that adds a very simple, thin scrollbar to vertically truncated content and allows users to scroll through the content with their mousewheel.

Syntax:

// Basic usage
$('#truncated-element').thinScroll();

// With options
$('#truncated-element').thinScroll({
	padding: 4, // space to the top/right/bottom of bar
	width: 6, // width of the bar
	minHeight: 20, // minimum possible height for the bar
	speed: 5, // speed content scrolls relative to actual mousewheel scroll speed. higher is faster
	opacity: 0.4 // bar opacity. 0.1 - 1.0
});

## License

This plugin is licensed under the MIT License (LICENSE.txt).

Copyright (c) 2012 [Reed Lauber](http://reedlauber.com)