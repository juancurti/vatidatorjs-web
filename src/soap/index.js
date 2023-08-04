const euUrl = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService";

export default async function validateVAT(fullCode) {
    if (fullCode.length < 2) { return false };
    var cleanCode = fullCode.split(' ').join('');
    let countryCode = cleanCode.substring(0, 2);
    let code = cleanCode.substring(2, cleanCode.length);
    
    return new Promise(async(resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', euUrl, true);

            var sr =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<env:Envelope ' + 
                    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                    'xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat" '+
                    'xmlns:ins0="urn:ec.europa.eu:taxud:vies:services:checkVat:types" '+
                    'xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">' +
                    '<env:Body>' +
                            '<ins0:checkVat>' +
                                '<ins0:vatNumber xsi:type="xsd:string">'+code+'</ins0:vatNumber>' +
                                '<ins0:countryCode xsi:type="xsd:string">'+countryCode+'</ins0:countryCode>' +
                            '</ins0:checkVat>' +
                    '</env:Body>' +
                '</env:Envelope>';


            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        console.log(xmlhttp.responseText);
                        let _xmlResponseText = xmlhttp.responseText;
                        let _xmlParts = _xmlResponseText.split('valid>');
                        if(_xmlParts.length < 2) {
                            reject();
                            return;
                        }else{
                            resolve(_xmlParts[1].charAt(0) == 't')
                        }
                    }
                }
            }
            
            xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
            xmlhttp.setRequestHeader('SOAPAction', 'checkVat');
            xmlhttp.send(sr);
    })
}