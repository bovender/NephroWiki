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

/* Helper function to get a string value from a checked radio button.
 * See http://www.somacon.com/p143.php
 * return the value of the radio button that is checked
 * return an empty string if none are checked, or
 * there are no radio buttons
*/
function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function callFunction(functionName) {
	// Call a function by the name given in a string
	// See: http://stackoverflow.com/questions/912596
	window[functionName]();
}


// Initialization method to set up a page's calculator forms.
$(document).ready(function() { 

	// We need several wrapper functions the create closures for
	// the callback functions. This is required to be able to dynamically
	// set up the callbacks for any form.
	// Generate callback closure for the slide method.
	function slideCallBack(formID, inputField) {
		return function(event, ui) {
			inputField.val(ui.value);
			// Call the function indicated by the form's ID.
			callFunction(formID);
		}
	}

	// Generate callback closure for the click method.
	function clickCallBack(formID) {
		return function() {
			// Call the function indicated by the form's ID.
			callFunction(formID);
		}
	}

	// Generate callback closures for the keyup methods.
	// We abandon the DRY principle here so that we don't have to
	// put the detection algorithm for associated sliders into
	// the callbacks.
	function keyUpCallBack(formID) {
		return function(event) {
			// Call the function indicated by the form's ID.
			callFunction(formID);
		}
	}
	function keyUpCallBackWithSlider(formID, inputField, slider) {
		return function(event) {
			// Update the associated slider
			slider.slider('value', inputField.val());
			// Call the function indicated by the form's ID.
			callFunction(formID);
		}
	}

	// Actual body of the function:
	// Iterate over all calculator forms on the page and attach the
	// appropriate event handlers as needed.
	$('.nwCalc').each(function() {
		// Get the name of the current form; we need it in the callback
		// closures.
		formID = $(this).attr('id');

		// Iterate through all the slider divs inside this form
		$(this).find('.nwSlider').each(function() {
			// Retrieve the slider's parameters from the data-field
			// attributes of the div element. 
			slider = $(this);
			minVal = slider.data('min');
			maxVal = slider.data('max');
			stepVal = slider.data('step');
			defaultVal = slider.data('default');

			// Get the associated input field
			// The name of the input field that is associated with a slider
			// div is stored in the slider div's data-field attribute.
			fieldName = slider.data('field');
			inputField = $('#'+formID+' [name='+fieldName+']');

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
		});

		// Iterate through all the text input fields (which may or may not
		// belong to a slider div).
		$(this).find('input[type=text]').each(function() {
			inputField = $(this);
			slider = $('#'+formID+
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

		// Iterate through all radio buttons on this form.
		$(this).find('input[type=radio]').each(function() {
			$(this).click(clickCallBack(formID));
		});
	});
});



/* Berechnung des Plasmavolumens und der Plasmapherese-Parameter.
 * (c) Daniel Kraus 1/2012
 * Dieses Skript setzt die Einbindung von jQuery voraus
 * (sollte standardmäßig in MediaWiki eingebunden sein).
 *
 * Versionsgeschichte:
 * 2.0  10.01.2012  Überarbeitung, jetzt mit jQuery und Slider-Elementen
 */


// Berechnet die PP-DatenFormel.
function nwPlasma() {
	// Text-Eingabefelder auslesen und in Gleitkommazahlen umwandeln.
	try {
		with (document.PPform) {
			var bw = parseFloat(PPbw.value.replace(',', '.'));
			var hk = parseFloat(PPhk.value.replace(',', '.'));
			var pp = parseFloat(PPpp.value.replace(',', '.'));
		};
		
		// Überprüfung der Benutzereingaben:
		// Wenn noch nicht alle Felder ausgefüllt sind, wird gar nichts
		// angezeigt; bei unplausiblen Werten wird eine Warnmeldung
		// angezeigt.
		// Der Fehler "&nbsp;" wird generiert, damit der Status-Absatz
		// immer angezeigt wird.
		if ((isNaN(bw)) || (isNaN(hk)) || (isNaN(pp)))  { throw "&nbsp;"; }
			
		if ((bw < 30)  || (bw > 200)) { throw "Körpergewicht muß zwischen 30 und 200 liegen!" };
		if ((pp < 0.5) || (pp > 5))   { throw "Plasmavolumen-Faktor muß zwischen 0.5 und 5 liegen!" };
		
		// Der Hämatokrit ist möglicherweise als Decimalzahl angegeben,
		// so daß der Wert jetzt in Prozent konvertiert wird.
		if ((hk > 0) && (hk < 1)) {
			hk *= 100; 
			$('[name="PPhk"]').val(hk);
			$('#PPsliderhk').slider('value', hk);
		}
		if ((hk <  10) || (hk > 70)) { throw "Hk muß zwischen 10 und 70 liegen!" };

		
		// Berechnen:
		plasmaVol = 0.07 * bw * (1-hk/100);
		totalVol = plasmaVol * pp;
		
		if (getCheckedValue(document.PPform.PPha) == "ffponly") {
		  var numFFPs = totalVol / 0.2;         // 1 FFP = 0.2 Ltr
		  var s = '<span class="ergebnis">' +
			numFFPs.toFixed(0).replace(".", ",") + ' FFPs</span>';
		} else {
		  var numFFPs = totalVol / 0.2 * 0.5;
		  var albVol  = totalVol / 2;
		  var s = '<span class="ergebnis">' +
			numFFPs.toFixed(0).replace(".", ",") + " FFPs</span> und " +
			'<span class="ergebnis">' +
			albVol.toFixed(1).replace(".", ",") + " Liter Humanalbumin 5 %</span>";
		};
					
		// Ausgeben
		$('p#PPresult').html('Plasmavolumen: <span class="ergebnis">' +
			plasmaVol.toFixed(1).replace(".", ",") + ' Liter</span><br />' +
			'Behandlungsvolumen: <span class="ergebnis">' +
			totalVol.toFixed(1).replace(".", ",") + ' Liter ' +
			'(' + s + ')</span>');
	} catch (e) {
		$('p#PPresult').html(e);
		// console.log(e); // Console ist undefiniert beim IE!
	}
	
};


/* vim: set tw=76 fo=tqn: */
