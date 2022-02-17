var LHIN = window.LHIN || {}


LHIN.PostalViewModel = function () {

    var load = function (postalcode) {
        jQuery.support.cors = true;
        var t = document.getElementById("LHINresult");
        t.innerHTML = "";
        jQuery.ajax({
            url: "http://healthcareathome.ca/_api/web/lists/getbytitle('CCAC%20Postal%20Codes')/items?$select=EnterpriseID&$filter=Title eq '" + postalcode + "'",
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            success: onSuccess,
            error: function(xhr, status, error) 
			{ 
			  var err = xhr.responseText; 
			  onError(postalcode);
			}
        });
    },

    onSuccess = function (data) {
        var t = document.getElementById("LHINresult");
        if (data) {
            var results = data.d.results;
            if (results) {
                if (results.length > 1) {
                    setHtml(results[1].EnterpriseID);
				}
				else if (results.length = 1) {
                    setHtml(results[0].EnterpriseID);
				}
                else {
                    t.innerHTML = "LHIN not found.  Try again.";
                }
            }
            else {
                t.innerHTML = "LHIN not found.  Try again.";
            }
        }
    },

    setHtml = function (val) {
        var t = document.getElementById("LHINresult");
		
		
        var name = "";
        var url = "";
        
		switch (val) {
			case "1":
				name = "Erie St. Clair";
				url = "http://www.eriestclairlhin.on.ca/";
				break;
			case "2":
				name = "South West";
				url = "http://www.southwestlhin.on.ca/";
				break;
			case "3":
				name = "Waterloo Wellington";
				url = "http://www.wwlhin.on.ca/";
				break;
			case "4":
				name = "Hamilton Niagara Haldimand Brant";
				url = "http://www.hnhblhin.on.ca/";
				break;
			case "5":
				name = "Central West";
				url = "http://www.centralwestlhin.on.ca/";
				break;
			case "6":
				name = "Mississauga Halton";
				url = "http://www.mhlhin.on.ca/";
				break;
			case "7":
				name = "Toronto Central";
				url = "http://www.torontocentrallhin.on.ca/";
				break;
			case "8":
				name = "Central";
				url = "http://www.centrallhin.on.ca/";
				break;
			case "9":
				name = "Central East";
				url = "http://www.centraleastlhin.on.ca/";
				break;
			case "10":
				name = "South East";
				url = "http://www.southeastlhin.on.ca/";
				break;
			case "11":
				name = "Champlain";
				url = "http://www.champlainlhin.on.ca/";
				break;
			case "12":
				name = "North Simcoe Muskoka";
				url = "http://www.nsmlhin.on.ca/";
				break;
			case "13":
				name = "North East";
				url = "http://www.nelhin.on.ca/";
				break;
			case "14":
				name = "North West";
				url = "http://www.northwestlhin.on.ca/";
				break;
		}
		t.innerHTML = "You are in the <a href='" + url + "'>" + name + "</a> LHIN.";
        
		selectLHIN(val);

    },

    lookup = function (data, container) {
        load(data.replace(" ", ""));
    },

    onError = function (postalcode) {       
        jQuery.ajax({
                  url: "http://healthcareathome.ca/_api/web/lists/getbytitle('CCAC%20Postal%20Codes')/items?$select=EnterpriseID&$filter=Title eq '" + postalcode + "'",
                  type: "GET",
                  dataType: 'xml',
                  success: onSecondSuccess,
                  error: onPostalError
              });
          };

    onSecondSuccess = function (xmlData) {
	    var t = document.getElementById("LHINresult");
        var xmlDoc = xmlData.xml;
		var val;
		
		if(xmlDoc != null)
			val = xmlDoc.substring(xmlDoc.indexOf("<d:EnterpriseID>") + 16, xmlDoc.indexOf("</d:EnterpriseID>"))
        
        if (val != null && val.length > 0) {
            setHtml(val);
        }
        else {
            t.innerHTML = "LHIN not found.  Try again.";
        }
    };

    onPostalError = function (err) {
        var t = document.getElementById("LHINresult");
        t.innerHTML = "There was an error.  Try again.";
    };

    return {
        load: load,
        lookup: lookup

    };

}();