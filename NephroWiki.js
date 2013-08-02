/* Nephrowiki.js
 * (c) 2013 Daniel Kraus
 *
 * This file holds the custom scripts that are used for online
 * calculators and such. 
 */

/* Helfer-Funktion zum Auslesen von Radiobuttons.
 * Von http://www.somacon.com/p143.php
 * return the value of the radio button that is checked
 * return an empty string if none are checked, or
 * there are no radio buttons
*/
$(document).ready(function() {
	alert("it works");
});

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



/* Berechnung des Plasmavolumens und der Plasmapherese-Parameter.
 * (c) Daniel Kraus 1/2012
 * Dieses Skript setzt die Einbindung von jQuery voraus
 * (sollte standardmäßig in MediaWiki eingebunden sein).
 *
 * Versionsgeschichte:
 * 2.0  10.01.2012  Überarbeitung, jetzt mit jQuery und Slider-Elementen
 */


	// Berechnet die PP-DatenFormel.
	function ComputePP() {
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
	
	// Diese Funktion registriert die Event-Handler für die Eingabefelder
	// und die Slider.
	// Jedes Eingabefeld hat ein assoziiertes Slider-Element
	// (siehe http://jqueryui.com/demos/slider).
	// Auf Tastendruck übermittelt jedes Eingabefeld seinen
	// Wert an den Slider; jeder Slider übermittelt bei Veränderung
	// seinen Wert an das Eingabefeld.
	function RegisterHandlers(uiName, aDefault, aMin, aMax, aStep) {
		$('[name=PP'+uiName+']').keyup(function(event) {
			$('#PPslider'+uiName).slider("value", $('[name=PP'+uiName+']').val());
			ComputePP();
		});
		
		$('[name=PP'+uiName+']').val(aDefault);
		
		$('#PPslider'+uiName).slider({
			value: aDefault, min: aMin, max: aMax, step: aStep, 
			slide: function(event, ui) {
				$('[name=PP'+uiName+']').val(ui.value);
				ComputePP();
			}
		});
	};

	$(document).ready(function() { 
		// Die Auswahl-Buttons brauchen einen Click-Handler.
		$('input[name="PPha"]').click(function(event) {
			ComputePP();
		});
		
		// Es folgen Event-Handler für die Eingabefelder und Slider.
		RegisterHandlers('bw', 70, 30, 200, 1);
		RegisterHandlers('hk', 45, 10,  70, 1);
		RegisterHandlers('pp',  1, 0.5,  5, 0.5);
		
		// Für die Schönheit: Texteingabefelder rechtsbündig
		$('input[name^="PP"]').css('text-align', 'right');
	
		// Um die Initialberechnung mit den Vorgabewerten
		// durchzuführen, wird ein Mal die Berechnungs-Funktion
		// aufgerufen.
		ComputePP();

		// Versionsinformation in die Konsole schreiben
		// console.log($().jquery); // Console ist undefiniert beim IE!
	});
-->
</script>

