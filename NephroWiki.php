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

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'Not an entry point.' );
}

$wgExtensionCredits['parserhook'][] = array(
	'path'           => __FILE__,
	'name'           => '[http://github.com/bovender/NephroWiki NephroWiki Extension]',
	'author'         => '[https://www.mediawiki.org/wiki/User:Bovender Daniel Kraus]', 
	'version'        => '1.1.1',
	'description'    => 'Lädt NephroWiki-eigenes JavaScript'
);

$wgAutoloadClasses['NephroWiki'] = dirname( __FILE__ ) . '/NephroWiki.body.php';
$wgHooks['OutputPageParserOutput'][] = 'NephroWiki::loadModule';

# Register this extension with MediaWiki's resource loader 
# to be able load NephroWiki's JavaScript.
$wgResourceModules['ext.nephrowiki'] = array(
	'scripts' => 'NephroWiki.js',
	'dependencies' => array(
		'jquery.ui.slider',
		'jquery.ui.datepicker',
	),
	'localBasePath' => __DIR__,
	'remoteExtPath' => 'NephroWiki'
);
