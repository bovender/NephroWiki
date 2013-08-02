<?php
# NephroWiki extension for MediaWiki
# (c) 2013 Daniel Kraus

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'Not an entry point.' );
}

$wgExtensionCredits['parserhook'][] = array(
	'path'           => __FILE__,
	'name'           => 'NephroWiki',
	'author'         => '[https://www.mediawiki.org/wiki/User:Bovender Daniel Kraus]', 
	'version'        => '1.0.0',
	'description'    => 'Lädt NephroWiki-eigenes JavaScript'
);

$wgAutoloadClasses['NephroWiki'] = dirname( __FILE__ ) . '/NephroWiki.body.php';
$wgHooks[''][] = 'NephroWiki::loadModule';

# Register this extension with MediaWiki's resource loader 
# to be able load NephroWiki's JavaScript.
$wgResourceModules['ext.nephrowiki'] = array(
	'position' => 'top',
	'scripts' => 'NephroWiki.js',
	'dependencies' => 'jquery.ui.slider',
	'localBasePath' => __DIR__,
	'remoteExtPath' => 'NephroWiki'
);

