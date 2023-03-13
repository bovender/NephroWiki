NephroWiki extension for MediaWiki
==================================

This is a MediaWiki extension for the private wiki 'NephroWiki'. It serves
to add custom JavaScript to every wiki page. This is accomplished by
[defining][2] a [resource loader][1] module which defines the path to the
custom JavaScript. I previously used the `MediaWiki:common.js` page, but
maintaining the code on this page was very cumbersome. Now I can use my
favorite programming editor along with my favorite version control software
to write and maintain the code.

This GitHub repository was set up to help anybody who wants to serve their
own JavaScript in their Wiki. It is deliberately not registered on
mediawiki.org as it serves a rather special purpose.

The extension consists of the following files:

* `NephroWiki.php` -- registers the resource loader and a parser hook that
  ensures the resource module is loaded with every page.
* `NephroWiki.body.php` -- defines the `NephroWiki` class and its
  `loadModule` method which is hooked onto the MediaWiki parser.
* `NephroWiki.js` -- contains custom JavaScript. You won't need the code in
  this file; in my Wiki, it serves to facilitate programming of online
  calculators.

If you want to use this extension on your own wiki, you may want to clone
the repository:

```bash
git clone https://bovender.github.com/NephroWiki MyOwnWiki
```

I suggest you replace all occurrences of 'NephroWiki' with something else
with a command like this (provided you are using Linux):

```bash
cd MyOwnWiki
sed -i 's/[Nn]ephro[Ww]iki/MyOwnWiki/g' *.php *.js
```

But your mileage may vary of course.


Enabling the extension for your wiki
------------------------------------

Add the following line to your `LocalSettings.php`:

```php
require_once("$IP/extensions/NephroWiki/NephroWiki.php");
```

Replace `NephroWiki` with your chosen extension name.


License
-------

This extension is licensed under the [GNU General Public License V.2][gpl].

	NephroWiki extension
	Copyright (C) 2013-2023 Daniel Kraus (github.com/bovender)

	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


[1]: http://www.mediawiki.org/wiki/ResourceLoader
[2]: http://www.mediawiki.org/wiki/ResourceLoader/Developing_with_ResourceLoader#Registering
[gpl]: http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
