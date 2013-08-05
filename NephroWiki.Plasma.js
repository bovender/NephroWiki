/* Nephrowiki.Plasma.js
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
 * Plasma volume calculator for therapeutic plasma exchange (TPE).
 * Wiki template name: Rechner:Plasma
 *
 * Version history:
 * 3.0  04.08.2013  Major refactoring, put code into NephroWiki extension.
 * 2.0  10.01.2012  Überarbeitung, jetzt mit jQuery und Slider-Elementen.
 */


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


