CHANGELOG
=========

### Version [0.7.1] (2017-06-16)

#### Testbench
- <https://thetype.github.io/10/?v0.7.1>

#### Fixed
- Slideshow transition duration mismatching on touch devices.

### Version [0.7.0] (2017-06-16)

#### Testbench
- <https://thetype.github.io/10/?v0.7.0>

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

#### Testbench
- <https://thetype.github.io/10/?v0.6.2>

#### Added
+ Add Google Analytics.

### Version [0.6.1] (2017-06-14)

#### Testbench
- <https://thetype.github.io/10/?v0.6.1>

#### Added
+ New figures and captions for body article.

#### Changed
* Decouple gallery data (images and captions) from body article's template.

### Version [0.6.0] (2017-06-14)

#### Testbench
- <https://thetype.github.io/10/?v0.6.0>

#### Added
+ Add the [README](README).

#### Changed
* Transfer the repo from [realfish/tib-tenth](https://github.com/realfish/tib-tenth) to [thetype/10](https://github.com/thetype/10).

* * *

### Version [0.5.2] (2017-06-14)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.5.2>

#### Fixed
* Remove font-weight adjustment for Android, since webfont are installed.
* Refine typography for mobile screens to reduce widows.

### Version [0.5.1] (2017-06-14)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.5.1>

#### Fixed
- Fix copy for souvenirs.

### Version [0.5.0] (2017-06-14)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.5.0>

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

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.4.1>

#### Changed
* Polish the shape of slideshow pagers.

#### Fixed
- Fix typos in change log.
- Remove unused variables in JS.

### Version [0.4.0] (2017-06-11)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.4.0>

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

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.3.1>

#### Fixed
- Fix the centering for `.souvenir-thumb` with micro-typography polishments.

### Version [0.3.0] (2017-06-10)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.3.0>

#### Added
+ Make the layout, typesetting, and other detail styles responsive for almost all screen widthes.
+ Install the webfonts Adobe Caslon Pro and Source Han Serif SC.
+ Append the Limited (限) mark to the souvenir heading.

#### Changed
* Change the writing styles of change log.

* * *

### Version [0.2.2] (2017-06-09)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.2.2>

#### Fixed
+ Restore completeness  of the `.brand-tib10`.

### Version [0.2.1] (2017-06-09)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.2.1>

#### Fixed
- Fix the `overflow: hidden` failure in Safari (Mac) for `$('.souvenir-thumb')`.

### Version [0.2.0] (2017-06-09)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.2.0>

#### Added
+ Restructer the homepage of the TIB10-Recap site.
+ Fill the draft copy with some sample data.

* * *

### Version 0.1.0 (2017-06-08)

#### Testbench
- <https://realfish.github.io/tib-tenth/?v0.1.0>

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
