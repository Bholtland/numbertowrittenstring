const userLanguage = "nl";
const userWrittenString = "tweehonderdzevenenvijftigmiljoendriehonderdduizendzevenhonderdvijftig";
const userNumber = 12345;

const writtenNumbersByLanguage = {
    nl: {
        units: ["nul", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"],
        tens: ["", "tien", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"],
        scales: ["", "honderd", "duizend", "miljoen", "miljard"]
    },
    en: {
        units: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventien", "eighteen", "nineteen"],
        tens: ["", "ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"],
        scales: ["", "hundred", "thousand", "million", "billion"]
    },
}

function fromNumberToString(number, language) {
    const sum = (group) => Number(group.join("")); 

    // Create groups of three (hundreds)
    const numberToReversedString = number.toString().split("").reverse().join("");
    const arrayOfGroupedHundreds = numberToReversedString.match(/.{1,3}/g);
    let groupArray = [];

    // Loop through all groups of hundreds.
    for (let i=0; i < arrayOfGroupedHundreds.length; i++) {
        
        
        // split the group into an array of numbers.
        let group = arrayOfGroupedHundreds[i].toString().split("").reverse();
        group = group.map((n) => Number(n));

        // instantiate short reference to array of objects containing written numbers.
        const n = writtenNumbersByLanguage[language];

        // instantiate variables for hundreds, tens, and units.
        let hundreds = "";
        let tens = "";
        let units = "";
        let hasScale = "";

        // if a group of hundreds is more than 99 and not a 0.
        if (group.length > 2 && group[group.length-3] !== 0) {
            hundreds = group[0] > 1 ? n.units[group[0]] + n.scales[1] : n.scales[1];
        }
    
        // if a group of hundreds is more than 19.
        if (group.length > 1 && group[group.length-2] > 0) {
            tens = sum(group.slice(group.length-2, group.length)) > 19 ? n.tens[group[group.length-2]]: n.units[sum(group.slice(group.length-2, group.length))];
        }
        
        // create unit (i.a. fourhundred or four).
        if (group.length > 1 && group[group.length-1] > 0) {
            units = sum(group.slice(group.length-2, group.length)) > 19 || sum(group.slice(group.length-2, group.length)) < 10 ? n.units[group[group.length-1]] : "";
        }

        // if there are only units in the group.
        else if (group.length === 1) {
            units = n.units[group[0]];
        }

        // Add a scale based on where the group is positioned in the array.
        hasScale = i > 0 && sum(group) !== 0 ? n.scales[i+1] : "";

        // create the order in which the numbers are written based on the language.
        switch (language) {
            case "nl":
                units = units != 0 ? units+"en" : units;
                groupArray.push(hundreds + units + tens + hasScale);
                break;
            case "en":
                groupArray.push(hundreds + tens + units + hasScale);
                break;
            default:
                console.log("Please enter a language");
                break;
        }
    }
    return groupArray.reverse();
}

function fromStringToNumber(string, language) {
    // instantiate short reference to array of objects containing written numbers.
    const n = writtenNumbersByLanguage[language];
    let matchGroupsByScale = string.match(/(.+?(?:milard|miljoen|duizend(\w*)))/g);
    matchGroupsByScale[matchGroupsByScale.length-1] = matchGroupsByScale[matchGroupsByScale.length-1].replace(n.scales[2], n.scales[2]+",").split(",");
    matchGroupsByScale = matchGroupsByScale.flat();

    let writtenNumberString = "";

    for(let k=0; k < matchGroupsByScale.length; k++) {
        let hundreds = "";
        let tens = "";
        let units = "";

        const group = matchGroupsByScale[k];

        const checkForHundreds = group.match(/(\w*)honderd/);
        if (checkForHundreds[1]) {
            hundreds = n.units.indexOf(checkForHundreds[1]);
        }
        
        const checkForTens = group.match(/(?:honderd)?(\w*)/);
        // if (checkForTens[]) {
        // }
        
        // checkForHundreds.length
        writtenNumberString += hundreds.toString() + tens.toString() + units.toString();
        return writtenNumberString;
    }

}

// String to number (Works)
console.log(`Your number converted to a written string: \n${fromNumberToString(userNumber, userLanguage).join("")}\n`);

// Number to string (Doesn't work yet)
console.log(`Your written string converted to a number: \n${fromStringToNumber(userWrittenString, userLanguage)}`);


