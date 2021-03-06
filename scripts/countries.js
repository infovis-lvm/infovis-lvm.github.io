// mapping from http://jvectormap.com/maps/world/world/

function getCountryName(id) {
    if(id =="BD" ) return "Bangladesh" ;
    if(id =="BE" ) return "Belgium" ;
    if(id =="BF" ) return "Burkina Faso" ;
    if(id =="BG" ) return "Bulgaria" ;
    if(id =="BA" ) return "Bosnia and Herz." ;
    if(id =="BN" ) return "Brunei" ;
    if(id =="BO" ) return "Bolivia" ;
    if(id =="JP" ) return "Japan" ;
    if(id =="BI" ) return "Burundi" ;
    if(id =="BJ" ) return "Benin" ;
    if(id =="BT" ) return "Bhutan" ;
    if(id =="JM" ) return "Jamaica" ;
    if(id =="BW" ) return "Botswana" ;
    if(id =="BR" ) return "Brazil" ;
    if(id =="BS" ) return "Bahamas" ;
    if(id =="BY" ) return "Belarus" ;
    if(id =="BZ" ) return "Belize" ;
    if(id =="RU" ) return "Russia" ;
    if(id =="RW" ) return "Rwanda" ;
    if(id =="RS" ) return "Serbia" ;
    if(id =="LT" ) return "Lithuania" ;
    if(id =="LU" ) return "Luxembourg" ;
    if(id =="LR" ) return "Liberia" ;
    if(id =="RO" ) return "Romania" ;
    if(id =="GW" ) return "Guinea-Bissau" ;
    if(id =="GT" ) return "Guatemala" ;
    if(id =="GR" ) return "Greece" ;
    if(id =="GQ" ) return "Eq. Guinea" ;
    if(id =="GY" ) return "Guyana" ;
    if(id =="GE" ) return "Georgia" ;
    if(id =="GB" ) return "United Kingdom" ;
    if(id =="GA" ) return "Gabon" ;
    if(id =="GN" ) return "Guinea" ;
    if(id =="GM" ) return "Gambia" ;
    if(id =="GL" ) return "Greenland" ;
    if(id =="KW" ) return "Kuwait" ;
    if(id =="GH" ) return "Ghana" ;
    if(id =="OM" ) return "Oman" ;
    if(id =="_1" ) return "Somaliland" ;
    if(id =="_0" ) return "Kosovo" ;
    if(id =="JO" ) return "Jordan" ;
    if(id =="HR" ) return "Croatia" ;
    if(id =="HT" ) return "Haiti" ;
    if(id =="HU" ) return "Hungary" ;
    if(id =="HN" ) return "Honduras" ;
    if(id =="PR" ) return "Puerto Rico" ;
    if(id =="PS" ) return "Palestine" ;
    if(id =="PT" ) return "Portugal" ;
    if(id =="PY" ) return "Paraguay" ;
    if(id =="PA" ) return "Panama" ;
    if(id =="PG" ) return "Papua New Guinea" ;
    if(id =="PE" ) return "Peru" ;
    if(id =="PK" ) return "Pakistan" ;
    if(id =="PH" ) return "Philippines" ;
    if(id =="PL" ) return "Poland" ;
    if(id =="-99" ) return "N. Cyprus" ;
    if(id =="ZM" ) return "Zambia" ;
    if(id =="EH" ) return "W. Sahara" ;
    if(id =="EE" ) return "Estonia" ;
    if(id =="EG" ) return "Egypt" ;
    if(id =="ZA" ) return "South Africa" ;
    if(id =="EC" ) return "Ecuador" ;
    if(id =="AL" ) return "Albania" ;
    if(id =="AO" ) return "Angola" ;
    if(id =="KZ" ) return "Kazakhstan" ;
    if(id =="ET" ) return "Ethiopia" ;
    if(id =="ZW" ) return "Zimbabwe" ;
    if(id =="ES" ) return "Spain" ;
    if(id =="ER" ) return "Eritrea" ;
    if(id =="ME" ) return "Montenegro" ;
    if(id =="MD" ) return "Moldova" ;
    if(id =="MG" ) return "Madagascar" ;
    if(id =="MA" ) return "Morocco" ;
    if(id =="UZ" ) return "Uzbekistan" ;
    if(id =="MM" ) return "Myanmar" ;
    if(id =="ML" ) return "Mali" ;
    if(id =="MN" ) return "Mongolia" ;
    if(id =="MK" ) return "Macedonia" ;
    if(id =="MW" ) return "Malawi" ;
    if(id =="MR" ) return "Mauritania" ;
    if(id =="UG" ) return "Uganda" ;
    if(id =="MY" ) return "Malaysia" ;
    if(id =="MX" ) return "Mexico" ;
    if(id =="VU" ) return "Vanuatu" ;
    if(id =="FR" ) return "France" ;
    if(id =="FI" ) return "Finland" ;
    if(id =="FJ" ) return "Fiji" ;
    if(id =="FK" ) return "Falkland Is." ;
    if(id =="NI" ) return "Nicaragua" ;
    if(id =="NL" ) return "Netherlands" ;
    if(id =="NO" ) return "Norway" ;
    if(id =="NA" ) return "Namibia" ;
    if(id =="NC" ) return "New Caledonia" ;
    if(id =="NE" ) return "Niger" ;
    if(id =="NG" ) return "Nigeria" ;
    if(id =="NZ" ) return "New Zealand" ;
    if(id =="NP" ) return "Nepal" ;
    if(id =="CI" ) return "Côte d'Ivoire" ;
    if(id =="CH" ) return "Switzerland" ;
    if(id =="CO" ) return "Colombia" ;
    if(id =="CN" ) return "China" ;
    if(id =="CM" ) return "Cameroon" ;
    if(id =="CL" ) return "Chile" ;
    if(id =="CA" ) return "Canada" ;
    if(id =="CG" ) return "Congo" ;
    if(id =="CF" ) return "Central African Rep." ;
    if(id =="CD" ) return "Dem. Rep. Congo" ;
    if(id =="CZ" ) return "Czech Rep." ;
    if(id =="CY" ) return "Cyprus" ;
    if(id =="CR" ) return "Costa Rica" ;
    if(id =="CU" ) return "Cuba" ;
    if(id =="SZ" ) return "Swaziland" ;
    if(id =="SY" ) return "Syria" ;
    if(id =="KG" ) return "Kyrgyzstan" ;
    if(id =="KE" ) return "Kenya" ;
    if(id =="SS" ) return "S. Sudan" ;
    if(id =="SR" ) return "Suriname" ;
    if(id =="KH" ) return "Cambodia" ;
    if(id =="SV" ) return "El Salvador" ;
    if(id =="SK" ) return "Slovakia" ;
    if(id =="KR" ) return "Korea" ;
    if(id =="SI" ) return "Slovenia" ;
    if(id =="KP" ) return "Dem. Rep. Korea" ;
    if(id =="SO" ) return "Somalia" ;
    if(id =="SN" ) return "Senegal" ;
    if(id =="SL" ) return "Sierra Leone" ;
    if(id =="SB" ) return "Solomon Is." ;
    if(id =="SA" ) return "Saudi Arabia" ;
    if(id =="SE" ) return "Sweden" ;
    if(id =="SD" ) return "Sudan" ;
    if(id =="DO" ) return "Dominican Rep." ;
    if(id =="DJ" ) return "Djibouti" ;
    if(id =="DK" ) return "Denmark" ;
    if(id =="DE" ) return "Germany" ;
    if(id =="YE" ) return "Yemen" ;
    if(id =="AT" ) return "Austria" ;
    if(id =="DZ" ) return "Algeria" ;
    if(id =="US" ) return "United States" ;
    if(id =="LV" ) return "Latvia" ;
    if(id =="UY" ) return "Uruguay" ;
    if(id =="LB" ) return "Lebanon" ;
    if(id =="LA" ) return "Lao PDR" ;
    if(id =="TW" ) return "Taiwan" ;
    if(id =="TT" ) return "Trinidad and Tobago" ;
    if(id =="TR" ) return "Turkey" ;
    if(id =="LK" ) return "Sri Lanka" ;
    if(id =="TN" ) return "Tunisia" ;
    if(id =="TL" ) return "Timor-Leste" ;
    if(id =="TM" ) return "Turkmenistan" ;
    if(id =="TJ" ) return "Tajikistan" ;
    if(id =="LS" ) return "Lesotho" ;
    if(id =="TH" ) return "Thailand" ;
    if(id =="TF" ) return "Fr. S. Antarctic Lands" ;
    if(id =="TG" ) return "Togo" ;
    if(id =="TD" ) return "Chad" ;
    if(id =="LY" ) return "Libya" ;
    if(id =="AE" ) return "United Arab Emirates" ;
    if(id =="VE" ) return "Venezuela" ;
    if(id =="AF" ) return "Afghanistan" ;
    if(id =="IQ" ) return "Iraq" ;
    if(id =="IS" ) return "Iceland" ;
    if(id =="IR" ) return "Iran" ;
    if(id =="AM" ) return "Armenia" ;
    if(id =="IT" ) return "Italy" ;
    if(id =="VN" ) return "Vietnam" ;
    if(id =="AR" ) return "Argentina" ;
    if(id =="AU" ) return "Australia" ;
    if(id =="IL" ) return "Israel" ;
    if(id =="IN" ) return "India" ;
    if(id =="TZ" ) return "Tanzania" ;
    if(id =="AZ" ) return "Azerbaijan" ;
    if(id =="IE" ) return "Ireland" ;
    if(id =="ID" ) return "Indonesia" ;
    if(id =="UA" ) return "Ukraine" ;
    if(id =="QA" ) return "Qatar" ;
    if(id =="MZ" ) return "Mozambique" ;
    console.error('No country with id: ' + id);
}

function getCountryId(name) {
    // own definitions
    if(name =="Austria-Hungary" )	return "AT" ; // Austria instead
    if(name =="Bosnia" )	return "BA" ; // Bosnia and Herz.
    if(name =="Czechoslovakia" )	return "CZ" ; // Czech Rep.
    if(name =="Democratic Republic of the Congo" )	return "CD" ;
    if(name =="Laos" )	return "Lao" ; // Laos PDR
    if(name =="North Korea" )	return "KP" ; // Dem. Rep. Korea
    if(name =="South Korea" )	return "KR" ; // Korea
    if(name =="South Vietnam" )	return "VN" ; // Vietnam
    if(name =="United States of America" )	return "US" ; // United States
    if(name =="USSR" )	return "RU" ; // Russia
    if(name =="Yugoslavia" )	return "BA" ; // Bosnia and Herz.
    if(name =="Jordan\n" )	return "JO" ; // Jordan with newline
    if(name =="Yemen\n" )	return "YE" ; // Yemen with newline
    // definitions of map
    if(name =="Bangladesh" )	return "BD" ;
    if(name =="Belgium" )		return "BE" ;
    if(name =="Burkina Faso" )  return "BF" ;
    if(name =="Bulgaria" )	     return "BG" ;
    if(name =="Bosnia and Herz." )return "BA" ;
    if(name =="Brunei" )		return "BN" ;
    if(name =="Bolivia" )		return "BO" ;
    if(name =="Japan" )		    return "JP" ;
    if(name =="Burundi" )		return "BI" ;
    if(name =="Benin" )		    return "BJ" ;
    if(name =="Bhutan" )		return "BT" ;
    if(name =="Jamaica" )		return "JM" ;
    if(name =="Botswana" )	    return "BW" ;
    if(name =="Brazil" )		return "BR" ;
    if(name =="Bahamas" )		return "BS" ;
    if(name =="Belarus" )		return "BY" ;
    if(name =="Belize" )		return "BZ" ;
    if(name =="Russia" )		return "RU" ;
    if(name =="Rwanda" )		return "RW" ;
    if(name =="Serbia" )		return "RS" ;
    if(name =="Lithuania" )	    return "LT" ;
    if(name =="Luxembourg" )	return "LU" ;
    if(name =="Liberia" )		return "LR" ;
    if(name =="Romania" )		return "RO" ;
    if(name =="Guinea-Bissau")  return "GW" ;
    if(name =="Guatemala" )	    return "GT" ;
    if(name =="Greece" )		return "GR" ;
    if(name =="Eq. Guinea" )	return "GQ" ;
    if(name =="Guyana" )		return "GY" ;
    if(name =="Georgia" )		return "GE" ;
    if(name =="United Kingdom" )return "GB" ;
    if(name =="Gabon" )		    return "GA" ;
    if(name =="Guinea" )		return "GN" ;
    if(name =="Gambia" )		return "GM" ;
    if(name =="Greenland" )	    return "GL" ;
    if(name =="Kuwait" )		return "KW" ;
    if(name =="Ghana" )		    return "GH" ;
    if(name =="Oman" )		    return "OM" ;
    if(name =="Somaliland" )	return "_1" ;
    if(name =="Kosovo" )		return "_0" ;
    if(name =="Jordan" )		return "JO" ;
    if(name =="Croatia" )		return "HR" ;
    if(name =="Haiti" )		    return "HT" ;
    if(name =="Hungary" )		return "HU" ;
    if(name =="Honduras" )	return "HN" ;
    if(name =="Puerto Rico" )	return "PR" ;
    if(name =="Palestine" )	return "PS" ;
    if(name =="Portugal" )	return "PT" ;
    if(name =="Paraguay" )	return "PY" ;
    if(name =="Panama" )		return "PA" ;
    if(name =="Papua New Guinea" )	return "PG" ;
    if(name =="Peru" )		return "PE" ;
    if(name =="Pakistan" )	return "PK" ;
    if(name =="Philippines" )	return "PH" ;
    if(name =="Poland" )		return "PL" ;
    if(name =="N. Cyprus" )	return "-99" ;
    if(name =="Zambia" )		return "ZM" ;
    if(name =="W. Sahara" )	return "EH" ;
    if(name =="Estonia" )		return "EE" ;
    if(name =="Egypt" )		return "EG" ;
    if(name =="South Africa" )	return "ZA" ;
    if(name =="Ecuador" )		return "EC" ;
    if(name =="Albania" )		return "AL" ;
    if(name =="Angola" )		return "AO" ;
    if(name =="Kazakhstan" )	return "KZ" ;
    if(name =="Ethiopia" )	return "ET" ;
    if(name =="Zimbabwe" )	return "ZW" ;
    if(name =="Spain" )		return "ES" ;
    if(name =="Eritrea" )		return "ER" ;
    if(name =="Montenegro" )	return "ME" ;
    if(name =="Moldova" )		return "MD" ;
    if(name =="Madagascar" )	return "MG" ;
    if(name =="Morocco" )		return "MA" ;
    if(name =="Uzbekistan" )	return "UZ" ;
    if(name =="Myanmar" )		return "MM" ;
    if(name =="Mali" )		return "ML" ;
    if(name =="Mongolia" )	return "MN" ;
    if(name =="Macedonia" )	return "MK" ;
    if(name =="Malawi" )		return "MW" ;
    if(name =="Mauritania" )	return "MR" ;
    if(name =="Uganda" )		return "UG" ;
    if(name =="Malaysia" )	return "MY" ;
    if(name =="Mexico" )		return "MX" ;
    if(name =="Vanuatu" )		return "VU" ;
    if(name =="France" )		return "FR" ;
    if(name =="Finland" )		return "FI" ;
    if(name =="Fiji" )		return "FJ" ;
    if(name =="Falkland Is." )	return "FK" ;
    if(name =="Nicaragua" )	return "NI" ;
    if(name =="Netherlands" )	return "NL" ;
    if(name =="Norway" )		return "NO" ;
    if(name =="Namibia" )		return "NA" ;
    if(name =="New Caledonia" )	return "NC" ;
    if(name =="Niger" )		return "NE" ;
    if(name =="Nigeria" )		return "NG" ;
    if(name =="New Zealand" )	return "NZ" ;
    if(name =="Nepal" )		return "NP" ;
    if(name =="Côte d'Ivoire" )	return "CI" ;
    if(name =="Switzerland" )	return "CH" ;
    if(name =="Colombia" )	return "CO" ;
    if(name =="China" )		return "CN" ;
    if(name =="Cameroon" )	return "CM" ;
    if(name =="Chile" )		return "CL" ;
    if(name =="Canada" )		return "CA" ;
    if(name =="Congo" )		return "CG" ;
    if(name =="Central African Rep." )	return "CF" ;
    if(name =="Dem. Rep. Congo" )	return "CD" ;
    if(name =="Czech Rep." )	return "CZ" ;
    if(name =="Cyprus" )		return "CY" ;
    if(name =="Costa Rica" )	return "CR" ;
    if(name =="Cuba" )		return "CU" ;
    if(name =="Swaziland" )	return "SZ" ;
    if(name =="Syria" )		return "SY" ;
    if(name =="Kyrgyzstan" )	return "KG" ;
    if(name =="Kenya" )		return "KE" ;
    if(name =="S. Sudan" )	return "SS" ;
    if(name =="Suriname" )	return "SR" ;
    if(name =="Cambodia" )	return "KH" ;
    if(name =="El Salvador" )	return "SV" ;
    if(name =="Slovakia" )	return "SK" ;
    if(name =="Korea" )		return "KR" ;
    if(name =="Slovenia" )	return "SI" ;
    if(name =="Dem. Rep. Korea" )	return "KP" ;
    if(name =="Somalia" )		return "SO" ;
    if(name =="Senegal" )		return "SN" ;
    if(name =="Sierra Leone" )return "SL" ;
    if(name =="Solomon Is." )	return "SB" ;
    if(name =="Saudi Arabia" )return "SA" ;
    if(name =="Sweden" )		return "SE" ;
    if(name =="Sudan" )		return "SD" ;
    if(name =="Dominican Rep." )	return "DO" ;
    if(name =="Djibouti" )	return "DJ" ;
    if(name =="Denmark" )		return "DK" ;
    if(name =="Germany" )		return "DE" ;
    if(name =="Yemen" )		return "YE" ;
    if(name =="Austria" )		return "AT" ;
    if(name =="Algeria" )		return "DZ" ;
    if(name =="United States")return "US" ;
    if(name =="Latvia" )		return "LV" ;
    if(name =="Uruguay" )		return "UY" ;
    if(name =="Lebanon" )		return "LB" ;
    if(name =="Lao PDR" )		return "LA" ;
    if(name =="Taiwan" )		return "TW" ;
    if(name =="Trinidad and Tobago" )	return "TT" ;
    if(name =="Turkey" )		return "TR" ;
    if(name =="Sri Lanka" )	return "LK" ;
    if(name =="Tunisia" )		return "TN" ;
    if(name =="Timor-Leste" )	return "TL" ;
    if(name =="Turkmenistan" )	return "TM" ;
    if(name =="Tajikistan" )	return "TJ" ;
    if(name =="Lesotho" )		return "LS" ;
    if(name =="Thailand" )	return "TH" ;
    if(name =="Fr. S. Antarctic Lands" )	return "TF" ;
    if(name =="Togo" )		return "TG" ;
    if(name =="Chad" )		return "TD" ;
    if(name =="Libya" )		return "LY" ;
    if(name =="United Arab Emirates" )	return "AE" ;
    if(name =="Venezuela" )	return "VE" ;
    if(name =="Afghanistan" )	return "AF" ;
    if(name =="Iraq" )		return "IQ" ;
    if(name =="Iceland" )		return "IS" ;
    if(name =="Iran" )		return "IR" ;
    if(name =="Armenia" )		return "AM" ;
    if(name =="Italy" )		return "IT" ;
    if(name =="Vietnam" )		return "VN" ;
    if(name =="Argentina" )	return "AR" ;
    if(name =="Australia" )	return "AU" ;
    if(name =="Israel" )		return "IL" ;
    if(name =="India" )		return "IN" ;
    if(name =="Tanzania" )	return "TZ" ;
    if(name =="Azerbaijan" )	return "AZ" ;
    if(name =="Ireland" )		return "IE" ;
    if(name =="Indonesia" )	return "ID" ;
    if(name =="Ukraine" )		return "UA" ;
    if(name =="Qatar" )		return "QA" ;
    if(name =="Mozambique" )	return "MZ" ;
    
    console.error('No country with name: \'' + name + '\'');
}

function getCountries(war) {
    var countries = new Array();
    var country;
    for (i = 1; i < 27; i++) { 
        country = war['involved country ' + i];
        if(country != '1') {
            countries.push(country);
        } else break;
    }
    return countries;
}

function getWars(id) {
    var wars = new Array();
    wardata.forEach(function(war, index, array) {
        if(getCountries(war).some(function(country, index, array) {
            return getCountryId(country) == id;
        })) {
            wars.push(war);
        }
    });
    return wars;
}