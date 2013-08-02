<?php
# NephroWiki extension for MediaWiki
# (c) 2013 Daniel Kraus
#
# This file contains the NephroWiki class which defines the loadModule
# method that is hooked on to OutputPageParserOutput. It serves to add
# the resource loader module which loads NephroWiki's own JavaScript.

if ( !defined( 'MEDIAWIKI' ) ) {
	die( 'Not an entry point.' );
}

class NephroWiki {
	function loadModule($out, $parseroutput) {
		$out->addModules('ext.nephrowiki');
		return true;
	}
}
