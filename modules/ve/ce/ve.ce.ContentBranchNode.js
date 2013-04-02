/*!
 * VisualEditor ContentEditable ContentBranchNode class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * ContentEditable content branch node.
 *
 * Content branch nodes can only have content nodes as children.
 *
 * @abstract
 * @extends ve.ce.BranchNode
 * @constructor
 * @param {ve.dm.BranchNode} model Model to observe
 * @param {jQuery} [$element] Element to use as a container
 */
ve.ce.ContentBranchNode = function VeCeContentBranchNode( model, $element ) {
	// Parent constructor
	ve.ce.BranchNode.call( this, model, $element );

	// Events
	this.addListenerMethod( this, 'childUpdate', 'renderContents' );

	// Initialization
	this.renderContents();
};

/* Inheritance */

ve.inheritClass( ve.ce.ContentBranchNode, ve.ce.BranchNode );

/* Methods */

/**
 * Handle splice events.
 *
 * This is used to automatically render contents.
 * @see ve.ce.BranchNode#onSplice
 *
 * @method
 */
ve.ce.ContentBranchNode.prototype.onSplice = function () {
	// Call parent implementation
	ve.ce.BranchNode.prototype.onSplice.apply( this, arguments );
	// Rerender to make sure annotations are applied correctly
	this.renderContents();
};

/**
 * Get an HTML rendering of the contents.
 *
 * @method
 * @returns {jQuery}
 */
ve.ce.ContentBranchNode.prototype.getRenderedContents = function () {
	var i, j, itemHtml, itemAnnotations, startClosingAt, arr, annotation, $ann,
		store = this.model.doc.getStore(),
		annotationStack = new ve.dm.AnnotationSet( store ),
		annotatedHtml = [],
		$wrapper = $( '<div>' ),
		$current = $wrapper;

	// Gather annotated HTML from the child nodes
	for ( i = 0; i < this.children.length; i++ ) {
		annotatedHtml = annotatedHtml.concat( this.children[i].getAnnotatedHtml() );
	}

	// Render HTML with annotations
	for ( i = 0; i < annotatedHtml.length; i++ ) {
		if ( ve.isArray( annotatedHtml[i] ) ) {
			itemHtml = annotatedHtml[i][0];
			itemAnnotations = new ve.dm.AnnotationSet( store, store.values( annotatedHtml[i][1] ) );
		} else {
			itemHtml = annotatedHtml[i];
			itemAnnotations = new ve.dm.AnnotationSet( store );
		}

		// FIXME code largely copied from ve.dm.Converter
		// Close annotations as needed
		// Go through annotationStack from bottom to top (low to high),
		// and find the first annotation that's not in annotations.
		startClosingAt = undefined;
		arr = annotationStack.get();
		for ( j = 0; j < arr.length; j++ ) {
			annotation = arr[j];
			if ( !itemAnnotations.contains( annotation ) ) {
				startClosingAt = j;
				break;
			}
		}
		if ( startClosingAt !== undefined ) {
			// Close all annotations from top to bottom (high to low)
			// until we reach startClosingAt
			for ( j = annotationStack.getLength() - 1; j >= startClosingAt; j-- ) {
				// Traverse up
				$current = $current.parent();
				// Remove from annotationStack
				annotationStack.removeAt( j );
			}
		}

		// Open annotations as needed
		arr = itemAnnotations.get();
		for ( j = 0; j < arr.length; j++ ) {
			annotation = arr[j];
			if ( !annotationStack.contains( annotation ) ) {
				// Create new node and descend into it
				$ann = ve.ce.annotationFactory.create( annotation.getType(), annotation ).$;
				$current.append( $ann );
				$current = $ann;
				// Add to annotationStack
				annotationStack.push( annotation );
			}
		}

		// Output the actual HTML
		$current.append( itemHtml );
	}

	return $wrapper.contents();

};

/**
 * Render contents.
 *
 * @method
 */
ve.ce.ContentBranchNode.prototype.renderContents = function () {
	if ( this.root instanceof ve.ce.DocumentNode && !this.root.getSurface().isRenderingEnabled() ) {
		return;
	}

	// Detach all child nodes from this.$
	// We can't use this.$.empty() because that destroys .data() and event handlers
	this.$.contents().each( function () {
		$(this).detach();
	} );

	// Reattach child nodes with the right annotations
	this.$.append( this.getRenderedContents() );

	// Add slugs
	this.setupSlugs();

	// Highlight the node in debug mode
	if ( ve.debug ) {
		this.$.css( 'backgroundColor', '#F6F6F6' );
		setTimeout( ve.bind( function () {
			this.$.css( 'backgroundColor', 'transparent' );
		}, this ), 350 );
	}
};
