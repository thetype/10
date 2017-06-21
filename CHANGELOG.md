CHANGELOG
=========

#### Testbench
- <https://thetype.github.io/10/?v1.2.0>

* * *

### Version [1.1.4] (2017-06-18)

#### Changed
* Polish two em-dash style.

### Version [1.1.3] (2017-06-18)

#### Testbench
- <https://thetype.github.io/10/?v1.1.3>

#### Changed
* Reword copy.

### Version [1.1.2] (2017-06-18)

#### Changed
* Change `og:image`/`twitter:image` asset ratio to 2:1.
* Append version tag for `og:image`/`twitter:image` asset's URL.

### Version [1.1.1] (2017-06-18)

#### Changed
* Update page description.
* Update `og:image`/`twitter:image` asset's URL.

### Version [1.1.0] (2017-06-17)

#### Added
+ New manuscript.
+ New image of the 5th sourvenir.
+ Open Graph configurations.

#### Changed
* Article typography:
	- Increase tracking for H1 and H3.
	- Increase font-size for text, when screen width is larger than 1280 px.
	- Refine multi-col layout for responsive screens.
* Slideshow:
	- Increase slideshow pager's hover area.
	- Increase slideshow's margins, when screen width is larger than 1280 px.
* Brand:
	- Increase header brand module's margins, when screen width is larger than 1280 px.
	- Enlarge TIB logo size in page footer, when screen width is larger than 640 px.
* Souvenir:
	- Increase font-size and tracking for the module heading (following the article H1).
	- Increase font-size of souvenir info (following the article body text).
	- Increase margins for sourvenir info.

#### Fixed
- Fix slideshow's height collapse for Edge and Gecko. (See issue [#1](https://github.com/thetype/10/issues/1).)

* * *

### Version [1.0.0] (2017-06-16)

#### Added
+ Add an interaction hint for the slideshow.

#### Changed
* Remove duplicated slides.
* Remove testing assets.
* Change slide’s tag from `<div>` (with CSS `background-image`) to `<img>`.
* Revise README.

* * *

### Version [0.7.1] (2017-06-16)

#### Fixed
- Slideshow transition duration mismatching on touch devices.

### Version [0.7.0] (2017-06-16)

#### Added
+ New image assets for the slideshow, two sets of gallery, and souvenirs.

#### Changed
* Increase logos' size for desktop (wider than 640px).
* Twist slideshow's transition duration and pager size.
* Remove gallery and souvenir's frame styles.
* Update sourvenir's reponsive layout logic.
* Change page footer into TIB logo and slogan.

* * *

### Version [0.6.2] (2017-06-15)

#### Added
+ Add Google Analytics.

### Version [0.6.1] (2017-06-14)

#### Added
+ New figures and captions for body article.

#### Changed
* Decouple gallery data (images and captions) from body article's template.

### Version [0.6.0] (2017-06-14)

#### Added
+ Add the [README](README).

#### Changed
* Transfer the repo from [realfish/tib-tenth](https://github.com/realfish/tib-tenth) to [thetype/10](https://github.com/thetype/10).

* * *

### Version [0.5.2] (2017-06-14)

#### Fixed
* Remove font-weight adjustment for Android, since webfont are installed.
* Refine typography for mobile screens to reduce widows.

### Version [0.5.1] (2017-06-14)

#### Fixed
- Fix copy for souvenirs.

### Version [0.5.0] (2017-06-14)

#### Added
+ Official copy (proof needed).
+ Souvenir image assets.
+ Hyperlink style (the Medium-flavour underline) for body text.
+ Heading 4 style for body text.
+ A "safe" webfont set `@font-serif--safe` as a work-around to the Adobe Caslon Pro webfont's line-height issue.

#### Changed
* Decouple data and template, and modularize data.
* Twist font weight setting.

* * *

### Version [0.4.1] (2017-06-11)

#### Changed
* Polish the shape of slideshow pagers.

#### Fixed
- Fix typos in change log.
- Remove unused variables in JS.

### Version [0.4.0] (2017-06-11)

#### Added
+ Make a responsive slideshow component.
+ Add main logics for the `home` view.

#### Changed
* Remove the unused JS dep `doT.js`.
* Remove unused modules for `app.js`.

#### Known issues
* The ratio of slideshow for mobile portrait screens.

* * *

### Version [0.3.1] (2017-06-10)

#### Fixed
- Fix the centering for `.souvenir-thumb` with micro-typography polishments.

### Version [0.3.0] (2017-06-10)

#### Added
+ Make the layout, typesetting, and other detail styles responsive for almost all screen widthes.
+ Install the webfonts Adobe Caslon Pro and Source Han Serif SC.
+ Append the Limited (限) mark to the souvenir heading.

#### Changed
* Change the writing styles of change log.

* * *

### Version [0.2.2] (2017-06-09)

#### Fixed
+ Restore completeness  of the `.brand-tib10`.

### Version [0.2.1] (2017-06-09)

#### Fixed
- Fix the `overflow: hidden` failure in Safari (Mac) for `$('.souvenir-thumb')`.

### Version [0.2.0] (2017-06-09)

#### Added
+ Restructer the homepage of the TIB10-Recap site.
+ Fill the draft copy with some sample data.

* * *

### Version 0.1.0 (2017-06-08)

#### Added
+ Mock up the main modules, including header, hero, body, and footer.
+ Make scaffolds of source codes:
	+ Add static assets;
	+ Make the Pug-based template's scaffold;
	+ Make the JS-based script's scaffold;
	+ Make the Less-based style's scaffold;
	+ Add some JS and CSS deps.
+ Configure Travis CI workflow.
+ Test the GitHub Pages deployment: <https://realfish.github.io/tib-tenth/>.



[1.2.0]: https://github.com/thetype/10/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/thetype/10/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/thetype/10/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/thetype/10/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/thetype/10/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/thetype/10/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/thetype/10/compare/v0.7.1...v1.0.0
[0.7.1]: https://github.com/thetype/10/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/thetype/10/compare/v0.6.2...v0.7.0
[0.6.2]: https://github.com/thetype/10/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/thetype/10/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/thetype/10/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/realfish/tib-tenth/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/realfish/tib-tenth/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/realfish/tib-tenth/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/realfish/tib-tenth/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/realfish/tib-tenth/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/realfish/tib-tenth/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/realfish/tib-tenth/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/realfish/tib-tenth/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/realfish/tib-tenth/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/realfish/tib-tenth/compare/v0.1.0...v0.2.0
