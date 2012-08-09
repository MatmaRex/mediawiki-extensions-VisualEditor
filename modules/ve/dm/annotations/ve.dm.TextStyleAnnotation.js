/**
 * VisualEditor data model TextStyleAnnotation class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel annotation for a text style.
 *
 * @class
 * @constructor
 * @extends {ve.dm.Annotation}
 */
ve.dm.TextStyleAnnotation = function () {
	// Inheritance
	ve.dm.Annotation.call( this );
};

/* Static Members */

/**
 * Converters.
 *
 * @see {ve.dm.Converter}
 * @static
 * @member
 */
ve.dm.TextStyleAnnotation.converters = {
	'domElementTypes': ['i', 'b', 'u', 's', 'small', 'big', 'span'],
	'toDomElement': function ( subType, annotation ) {
		var map = {
			'italic': 'i',
			'bold': 'b',
			'underline': 'u',
			'strike': 's',
			'small': 'small',
			'big': 'big',
			'span': 'span',
			'strong': 'strong',
			'emphasize': 'em',
			'superScript': 'sup',
			'subScript': 'sub'
			// TODO: Add other supported inline DOM elements to this list
		};
		return $( document.createElement( map[subType] ) )
			// Restore HTML attributes
			// Will be done for us in the new annotation API
			.attr( annotation.htmlAttributes )
			.get( 0 );
	},
	'toDataAnnotation': function ( tag, element ) {
		var annotation, i, length,
			map = {
				'i': 'italic',
				'b': 'bold',
				'u': 'underline',
				's': 'strike',
				'small': 'small',
				'big': 'big',
				'span': 'span',
				'strong': 'strong',
				'em': 'emphasize',
				'sup': 'superScript',
				'sub': 'subScript'
				// TODO: Add other supported inline DOM elements to this list
			};
		annotation = {
			type: 'textStyle/' + map[tag],
			htmlAttributes: {}
		};
		// Preserve HTML attributes
		// Will be done for us in the new annotation API
		for ( i = 0, length = element.attributes.length; i < length; i++ ) {
			annotation.htmlAttributes[element.attributes[i].name] = element.attributes[i].value;
		}
		return annotation;
	}
};

/* Registration */

ve.dm.annotationFactory.register( 'textStyle', ve.dm.TextStyleAnnotation );

/* Inheritance */

ve.extendClass( ve.dm.TextStyleAnnotation, ve.dm.Annotation );
