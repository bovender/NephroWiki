/* Nephrowiki.js
 * (c) 2013 Daniel Kraus (http://bovender.users.sf.net)
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * ------------------------------------------------------------
 *
 * This file holds the custom scripts that are used for online
 * calculators and such. 
 */


/* ***********************************************************************
   Helper functions for calculator algorithms
   ***********************************************************************
*/

// Define a class to obtain a private name space.
function NephroWiki() {}

// Retrieve the name of the currently checked radio button of a given
// group. Returns nothing if no button is checked.
NephroWiki.getRadioValue = function(groupName) {
	return $('input[name='+groupName+']:checked').val();
}

// Parse an input field and return its value
// Automatically converts ',' to decimal points and
// respects the field's min/max values.
NephroWiki.parseInputValue = function(formID, fieldName) {
	// Get the current input field as a jQuery object
	var input = $('#'+formID+' [name='+fieldName+']');

	// Locate the associated label
	var label = input.prevUntil('input', 'span:first');
	var labelText = label.text().replace(/[:=]$/, '');

	// Get the min/max parameters and the value
	var min = input.data('min');
	var max = input.data('max');

	if ( input.data('date') == undefined ) {
		var val = parseFloat(input.val().replace(',', '.'));
		if (!val) {
			throw 'Bitte ' + labelText + ' eingeben.';
		}
	} else {
		// The value of a date field is generated differently.
		var val = input.val();
		// Check if the input text matches the common German date format
		// (with optional leading zeros and 2-digit or 4-digit year).
		var date = /(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})/.exec(val);
		if ( date ) {
			// Deal with two-digit years: If it is < 80, assume it is in the
			// current (21st) century. This will cause a Y3K problem
			// sometime, but I will let others fix it then...
			if ( date[3] < 100 ) {
				var century;
				( date[3] < 80 ) ? century = '20' : century = '19';
				date[3] = century + date[3];
			}
			// The Date constructor expects the month to be between 0 and
			// 11, so we must subtract 1 from the actual month number.
			val = new Date(date[3], date[2]-1, date[1]);
		} else {
			throw 'Bitte ' + labelText + ' in der Form "T.M.JJ" ' +
				'oder "TT.MM.JJJJ" eingeben.';
		}
	}

	// If the field has a boolean "percent" data attribute,
	// and the user has entered a decimal number between 0 and 1,
	// multiply the value by 100.
	if ((input.data('percent')) && (Math.abs(val) <= 1)) {
		val *= 100;
	};

	// If the entered value is outside the acceptable
	// range, throw an error.
	if (val < min) {
		throw labelText + ' darf nicht kleiner als ' + min + ' sein.';
	} else if (val > max) {
		throw labelText + ' darf nicht größer als ' + max + ' sein.';
	};
	return val;
}

// Helper function that parses a form's input fields and creates a hash from
// them, which it will then return.
// Cf.  http://andrewdupont.net/2006/05/18/javascript-associative-arrays-considered-harmful
// for more on hashes aka 'associative arrays' in JavaScript.
NephroWiki.parseForm = function(formID) {
	var params = new Object();
	$('#'+formID).find('input[type=text]').each(function() {
		var fieldName = $(this).attr('name');
		params[fieldName] = NephroWiki.parseInputValue(formID, fieldName);
	});
	$('#'+formID).find('input:checked').each(function() {
		var fieldName = $(this).attr('name');
		params[fieldName] = $(this).attr('value');
	});
	// TODO: parse other fields as well (e.g., selection lists).
	return params;
}


// The calculate method is a wrapper for the various functions that perform
// the actual calculations. It takes care of form evaluation and error
// handling, allowing us to keep the actual calculator functions DRY.
NephroWiki.calculate = function(formID) {
	var form = $('#'+formID);
	try {
		// Parse the form and generate a hash.
		var params = this.parseForm(formID);
		// Call the calculation function by the name of the form ID.
		// See: http://stackoverflow.com/questions/912596
		var result = window[formID](params);
		// Output the result.
		form.find('.result').html(result);
	} catch (e) {
		form.find('.result').html('<div class="error">' + e + '</div>');
	} finally {
		result = undefined;
		params = undefined;
	}
}



/* ***********************************************************************
   Initialization method to set up a page's calculator forms.
   ***********************************************************************
*/
$(document).ready(function() { 

	// We need several wrapper functions the create closures for
	// the callback functions. This is required to be able to dynamically
	// set up the callbacks for any form.
	// Generate callback closure for the slide method.
	function slideCallBack(formID, inputField) {
		return function(event, ui) {
			inputField.val(ui.value);
			// Call the function indicated by the form's ID.
			NephroWiki.calculate(formID);
		}
	}

	// Generate callback closure for the click method.
	function clickCallBack(formID) {
		return function() {
			// Call the function indicated by the form's ID.
			NephroWiki.calculate(formID);
		}
	}

	// Generate callback closures for the keyup methods.
	// We abandon the DRY principle here so that we don't have to
	// put the detection algorithm for associated sliders into
	// the callbacks.
	function keyUpCallBack(formID) {
		return function(event) {
			// Call the function indicated by the form's ID.
			NephroWiki.calculate(formID);
		}
	}
	function keyUpCallBackWithSlider(formID, inputField, slider) {
		return function(event) {
			// Update the associated slider
			slider.slider('value', inputField.val());
			// Call the function indicated by the form's ID.
			NephroWiki.calculate(formID);
		}
	}

	// Actual body of the function:
	// Iterate over all calculator forms on the page and attach the
	// appropriate event handlers as needed.
	$('.nwCalc').each(function() {
		// Get the name of the current form; we need it in the callback
		// closures.
		var formID = $(this).attr('id');
		if (!formID) {
			throw "Missing ID on form.nwCalc!"
		}

		// Check if the form tells us how wide the sliders should be.
		// If the data attribute is not present, use a sensible default.
		var sliderWidth = $(this).data('slider-width');
		if (!sliderWidth) {
			sliderWidth = 300; // pixels
		}

		// Iterate through all the slider divs inside this form
		$(this).find('.nwSlider').each(function() {
			// Get the input field that belongs to this slider.
			// The name of the input field that is associated with a slider
			// div is stored in the slider div's data-field attribute.
			var slider = $(this);
			var fieldName = slider.data('field');
			if (!fieldName) {
				throw "Missing data-field on nwSlider."
			}
			var inputField = $('#'+formID+' [name='+fieldName+']');
			if (!inputField.length) {
				throw "Missing input field associated with nwSlider."
			}

			// Retrieve the slider's parameters from the associated
			// input element which is indicated in the slider's data-field
			var minVal = inputField.data('min');
			var maxVal = inputField.data('max');
			var defaultVal = inputField.data('default');

			// The stepper value is taken from the slider's data
			// attribute (it would not make sense to define it in the
			// input field's attributes).
			var stepVal = slider.data('step');

			// Make the div a jQueryUI slider and attach the required callback
			// functions.
			slider.slider({
				value: defaultVal, min: minVal, max: maxVal, step: stepVal, 
				slide: slideCallBack(formID, inputField)
			});

			// Put the default value into the input field.
			if (inputField.length) {
				inputField.val(defaultVal);
			}

			// Set the slider's width
			slider.css('width', sliderWidth + 'px');
		});

		// Iterate through all the text input fields (which may or may not
		// belong to a slider div).
		$(this).find('input[type=text]').each(function() {
			var inputField = $(this);
			var slider = $('#'+formID+
				' .nwSlider[data-field='+inputField.attr('name')+']');
			// If the input field has an associated slider, the slider
			// object will have a length greater than zero.
			if (slider.length) {
				inputField.keyup(keyUpCallBackWithSlider(formID, inputField,
						slider));
			} else {
				inputField.keyup(keyUpCallBack(formID));
			}
		});

		$(this).find('input[type=text][data-date]').each(function() {
			$(this).datepicker({
				shortYearCutoff: "+1",
				showOn: "button",
				onSelect: clickCallBack(formID)
			});
			$(this).css('text-align', 'left');
		});

		// Iterate through all radio buttons on this form.
		$(this).find('input[type=radio], input[type=checkbox]').each(function() {
			$(this).click(clickCallBack(formID));
		});

		// Iterate through all span elements and make them equally wide
		// This requires the spans to have display: inline-block
		var spanWidth = 0;
		$(this).find('span').each(function() {
			if ($(this).width() > spanWidth) {
				spanWidth = $(this).width();
			}
		});
		$(this).find('span').each(function() {
			$(this).width(spanWidth);
		});

		NephroWiki.calculate(formID);
	});
});

/* vim: set tw=76 fo=tqn: */
