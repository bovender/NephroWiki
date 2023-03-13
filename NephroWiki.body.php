<?php
# NephroWiki extension for MediaWiki
# (c) 2013 Daniel Kraus (http://bovender.users.sf.net)
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 2
# as published by the Free Software Foundation.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# --------------------------------------------------------------------
#
# This file contains the NephroWiki class which defines the loadModule
# method that is hooked on to OutputPageParserOutput. It serves to add
# the resource loader module which loads NephroWiki's own JavaScript.

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'Not an entry point.' );
}

class NephroWiki {
	static function loadModule($out, $parseroutput) {
		$out->addModules('ext.nephrowiki');
		return true;
	}
}
