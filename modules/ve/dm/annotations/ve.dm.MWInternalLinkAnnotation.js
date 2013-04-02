/*!
 * VisualEditor DataModel MWInternalLinkAnnotation class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel MediaWiki internal link annotation.
 *
 * Example HTML sources:
 *     <a rel="mw:WikiLink">
 *
 * @class
 * @extends ve.dm.LinkAnnotation
 * @constructor
 * @param {HTMLElement|Object} linmodAnnotation
 */
ve.dm.MWInternalLinkAnnotation = function VeDmMWInternalLinkAnnotation( linmodAnnotation ) {
	// Parent constructor
	ve.dm.LinkAnnotation.call( this, linmodAnnotation );
};

/* Inheritance */

ve.inheritClass( ve.dm.MWInternalLinkAnnotation, ve.dm.LinkAnnotation );

/* Static Properties */

/**
 * @static
 * @property static.name
 * @inheritdoc
 */
ve.dm.MWInternalLinkAnnotation.static.name = 'link/MWinternal';

/**
 * @static
 * @property static.matchTagNames
 * @inheritdoc
 */
ve.dm.MWInternalLinkAnnotation.static.matchRdfaTypes = ['mw:WikiLink'];

ve.dm.MWInternalLinkAnnotation.static.toDataElement = function ( domElements ) {
	// Get title from href
	// The href is simply the title, unless we're dealing with a page that has slashes in its name
	// in which case it's preceded by one or more instances of "./" or "../", so strip those
	/*jshint regexp:false */
	var matches = domElements[0].getAttribute( 'href' ).match( /^((?:\.\.?\/)*)(.*)$/ );
	return {
		'type': 'link/MWinternal',
		'attributes': {
			'hrefPrefix': matches[1],
			'title': decodeURIComponent( matches[2] ).replace( /_/g, ' ' ),
			'origTitle': matches[2]
		}
	};
};

ve.dm.MWInternalLinkAnnotation.static.toDomElements = function ( dataElement ) {
	var href,
		domElement = document.createElement( 'a' ),
		title = dataElement.attributes.title,
		origTitle = dataElement.attributes.origTitle;
	if ( origTitle && decodeURIComponent( origTitle ).replace( /_/g, ' ' ) === title ) {
		// Restore href from origTitle
		href = origTitle;
		// Only use hrefPrefix if restoring from origTitle
		if ( dataElement.attributes.hrefPrefix ) {
			href = dataElement.attributes.hrefPrefix + href;
		}
	} else {
		href = encodeURIComponent( title );
	}
	domElement.setAttribute( 'href', href );
	domElement.setAttribute( 'rel', 'mw:WikiLink' );
	return [ domElement ];
};

/* Registration */

ve.dm.modelRegistry.register( ve.dm.MWInternalLinkAnnotation );
