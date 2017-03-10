# Startup Library

This are my go-to startup files. To use, clone it and then remember to change the git origin to your new project.

## JS

The javascript relies on a modular build system, like browserify.  The lib files are ES5 (so you don't require babel unless you want to use it for your own files), and use CommonJS syntax for the modules.

[ESLint](http://eslint.org/) is included with my own preferences established.  It should be noted, though, that the gulp tasks don't adhere to them (because I'm too lazy to fix them). An error in the lint task is not fatal, and the code will still compile using browserify.

## SCSS

The scss is written with atomic design in mind.  The master styles.scss file includes everything else, which is separated into atomic folders.  Some commenting is present in the KSS style, although a KSS generator is not included in this library.
