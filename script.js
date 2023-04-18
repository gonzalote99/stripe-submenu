
 (function() {

	'use strict';

	const ClickyMenus = function( menu ) {

		
		let	container = menu.parentElement,
			currentMenuItem,
			i,
			len;

		this.init = function( i ) {
			menuSetup( i );
			document.addEventListener( 'click', closeOpenMenu );
		}


		function toggleOnMenuClick( e ) {

			const button = e.currentTarget;

			
			if ( currentMenuItem && button !== currentMenuItem ) {
				toggleSubmenu( currentMenuItem );
			}

			toggleSubmenu( button );

		};

		function toggleSubmenu( button ) {

			const submenu = document.getElementById( button.getAttribute( 'aria-controls' ) );

			if ( 'true' === button.getAttribute( 'aria-expanded' ) ) {

				button.setAttribute( 'aria-expanded', false );
				submenu.setAttribute( 'aria-hidden', true );
				currentMenuItem = false;

			} else {

				button.setAttribute( 'aria-expanded', true );
				submenu.setAttribute( 'aria-hidden', false );
				preventOffScreenSubmenu( submenu );
				currentMenuItem = button;

			}

		};

		function preventOffScreenSubmenu( submenu ) {

			const 	screenWidth =	window.innerWidth ||
									document.documentElement.clientWidth ||
									document.body.clientWidth,
					parent = submenu.offsetParent,
					menuLeftEdge = parent.getBoundingClientRect().left,
					menuRightEdge = menuLeftEdge + submenu.offsetWidth;

			if ( menuRightEdge + 32 > screenWidth ) { 
				submenu.classList.add( 'sub-menu--right' );
			}

		}

		function closeOnEscKey( e ) {

			if(	27 === e.keyCode ) {

				if( null !== e.target.closest('ul[aria-hidden="false"]') ) {
					currentMenuItem.focus();
					toggleSubmenu( currentMenuItem );

				
				} else if ( 'true' === e.target.getAttribute('aria-expanded') ) {
					toggleSubmenu( currentMenuItem );
				}

			}

		}

		function closeOpenMenu( e ) {

			if ( currentMenuItem && ! e.target.closest( '#' + container.id ) ) {
				toggleSubmenu( currentMenuItem );
			}

		};

	
		function menuSetup( i ) {

			menu.classList.remove('no-js');

			
			if( menu.parentElement.id === '' ) {
				menu.parentElement.id = 'clicky-menu-' + i;
			}

			menu.querySelectorAll('ul').forEach( ( submenu ) => {

				const menuItem = submenu.parentElement;

				if ( 'undefined' !== typeof submenu ) {

					let button = convertLinkToButton( menuItem );

					setUpAria( submenu, button, i );

					
					button.addEventListener( 'click', toggleOnMenuClick );
					menu.addEventListener( 'keyup', closeOnEscKey );

				}

			});

		};

		
		function convertLinkToButton( menuItem ) {

			const 	link = menuItem.getElementsByTagName( 'a' )[0],
					linkHTML = link.innerHTML,
					linkAtts = link.attributes,
					button = document.createElement( 'button' );

			if( null !== link ) {

			
				button.innerHTML = linkHTML.trim();
				for( i = 0, len = linkAtts.length; i < len; i++ ) {
					let attr = linkAtts[i];
					if( 'href' !== attr.name ) {
						button.setAttribute( attr.name, attr.value );
					}
				}

				menuItem.replaceChild( button, link );

			}

			return button;

		}

		function setUpAria( submenu, button, i ) {

			const submenuId = submenu.getAttribute( 'id' );

			let id;
			if( null === submenuId ) {
				id = button.textContent.trim().replace(/\s+/g, '-').toLowerCase() + '-submenu-' + i;
			} else {
				id = menuItemId + '-submenu-' + i;
			}

		
			button.setAttribute( 'aria-controls', id );
			button.setAttribute( 'aria-expanded', false );

		
			submenu.setAttribute( 'id', id );
			submenu.setAttribute( 'aria-hidden', true );

		}

	}


	document.addEventListener('DOMContentLoaded', function(){
		const menus = document.querySelectorAll( '.clicky-menu' );
		let i = 1;

		menus.forEach( menu => {

			let clickyMenu = new ClickyMenus(menu);
			clickyMenu.init(i);
			i++;

		});
	});

}());