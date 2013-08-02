<?php
# NephroWiki extension for MediaWiki
# (c) 2013 Daniel Kraus

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'Not an entry point.' );
}

$wgExtensionCredits['nephrowiki'][] = array(
	'path'           => __FILE__,
	'name'           => 'NephroWiki',
	'author'         => 'Daniel Kraus', 
	'version'        => '1.0.0'
);

# Use MediaWiki's resource loader to load NephroWiki's JavaScript.
$wgResourceModules['ext.nephrowiki'] = array(
	'scripts' => 'NephroWiki.js',
	'dependencies' => 'jquery.ui.slider',
	'localBasePath' => __DIR__,
	'remoteExtPath' => 'NephroWiki');

