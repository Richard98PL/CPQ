function calculateSortOrder(lines){

	let maxNumber = 0;
	let maxNestedLevel = 0;

	lines.sort(function(a,b){
		let aOptionLevel = a.record["SBQQ__OptionLevel__c"];
		if(aOptionLevel == null){
			aOptionLevel = -1;
		}
		let bOptionLevel = b.record["SBQQ__OptionLevel__c"];
		if(bOptionLevel == null){
			bOptionLevel = -1;
		}

		if(aOptionLevel < bOptionLevel){
			return -1;
		} else {
			return 1;
		}
	});

	
	lines.forEach(function(line){
		//console.log(line.record["SBQQ__ProductName__c"]);
		line.record["Sort_Order__c"] = null;
		if(line.record["SBQQ__Number__c"] > maxNumber){
			maxNumber = line.record["SBQQ__Number__c"];
		}
		if(parseInt(line.record["Feature_Number__c"]) > maxNumber){
			maxNumber = parseInt(line.record["Feature_Number__c"]);
		}
		let tmpLine = line;
		let nestedLevel = 0;
		while(tmpLine.parentItem){
			tmpLine = tmpLine.parentItem;
			nestedLevel++;
		}
		if(nestedLevel > maxNestedLevel){
			maxNestedLevel = nestedLevel;
		}
	});

	let maxDigitsNumber = maxNumber.toString().length + 1; //e.g. 3 places and 965 feature can be bugged so we will have 0965
	let biggestSordOrder = '';
	lines.forEach(function(line){


		if(line.parentItem == null){
			line.record["Sort_Order__c"] = line.record["SBQQ__Number__c"].toString().padStart(maxDigitsNumber,0);
		}else {
			let numberGeneratedByParents = line.parentItem.record["Sort_Order__c"].toString().padStart(maxDigitsNumber,0);

			let featureNumber;
			if(line.record["Feature_Number__c"]){
				featureNumber = line.record["Feature_Number__c"].toString().padStart(maxDigitsNumber,0);
			}else{
				featureNumber = ''.padStart(maxDigitsNumber,9);
			}

			line.record["Sort_Order__c"] = 
			(numberGeneratedByParents + featureNumber + line.record["SBQQ__Number__c"].toString().padStart(maxDigitsNumber,0));

			if(line.record["Sort_Order__c"].toString().length > biggestSordOrder){
				biggestSordOrder = line.record["Sort_Order__c"].toString().length;
			}
		}
	});

	lines.forEach(function(line){
		line.record["Sort_Order__c"] = line.record["Sort_Order__c"].padEnd(biggestSordOrder,0);
	});
	
}


if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

if (!String.prototype.padEnd) {
	String.prototype.padEnd = function padEnd(targetLength, padString) {
	  targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
	  padString = String(typeof padString !== 'undefined' ? padString : ' ');
	  if (this.length > targetLength) {
		return String(this);
	  } else {
		targetLength = targetLength - this.length;
		if (targetLength > padString.length) {
		  padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
		}
		return String(this) + padString.slice(0, targetLength);
	  }
	};
  }
