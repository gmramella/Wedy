var vehicles = [];
vehicles.push({type: "Motocicleta", capacity: 50, load: 0, cargo: []});
vehicles.push({type: "Motocicleta", capacity: 50, load: 0, cargo: []});
vehicles.push({type: "Furgão", capacity: 5000, load: 0, cargo: []});
vehicles.push({type: "Furgão", capacity: 5000, load: 0, cargo: []});
vehicles.push({type: "Caminhão", capacity: 15000, load: 0, cargo: []});
vehicles.push({type: "Caminhão", capacity: 15000, load: 0, cargo: []});

var lines = null;
var words = null;
var products = [];

function isWeight(word) {
	word = word.toLowerCase();
	return word.length > 2 && isNumber(word.slice(0, -2)) && word.slice(-2) == "kg";
}

function isAmmount(word) {
	word = word.toLowerCase();
	return word.length > 1 && word[0] == 'x' && isNumber(word.slice(1));
}

function weight(word) {
	return parseFloat(word.slice(0, -2));
}

function ammount(word) {
	return parseFloat(word.slice(1));
}

function leqMotorcycle(products, capacity) {
	var leq = [];
	var gt = [];
	for (var i = 0; i < products.length; i++) {
		if (products[i].weight <= capacity)
			leq.push(products[i]);
		else
			gt.push(products[i]);
	}
	return [leq, gt];
}

function leqVan(products, capacity) {
	var leq = [];
	var gt = [];
	for (var i = 0; i < products.length; i++) {
		if (products[i].weight <= capacity)
			leq.push(products[i]);
		else
			gt.push(products[i]);
	}
	return [leq, gt];
}

function loadCargo() {
	for (var i = 0; i < vehicles.length; i++) {
		vehicles[i].load = 0;
		vehicles[i].cargo.clear();
	}
	
	products.sort(function(p1, p2) {return p1.weight - p2.weight});
	var motorcycleIndex = -1;
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Motocicleta") {
			motorcycleIndex = i;
			break;
		}
	}
	var motorcycleCapacity = (motorcycleIndex != -1) ? vehicles[motorcycleIndex].capacity : -1;
	var splitMotorcycle = leqMotorcycle(products, motorcycleCapacity);
	splitMotorcycle[0].sort(function(p1, p2) {return p2.weight - p1.weight});
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Motocicleta") {
			var j = 0;
			while (j < splitMotorcycle[0].length) {
				if (vehicles[i].load + splitMotorcycle[0][j].weight <= vehicles[i].capacity) {
					vehicles[i].load += splitMotorcycle[0][j].weight;
					vehicles[i].cargo.push(splitMotorcycle[0][j].type);
					splitMotorcycle[0].splice(j, 1);
				} else {
					j++;
				}
			}
		}
	}
	
	products = splitMotorcycle[0].concat(splitMotorcycle[1]);
	var vanIndex = -1;
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Furgão") {
			vanIndex = i;
			break;
		}
	}
	var vanCapacity = (vanIndex != -1) ? vehicles[vanIndex].capacity : -1;
	var splitVan = leqVan(products, vanCapacity);
	splitVan[0].sort(function(p1, p2) {return p2.weight - p1.weight});
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Furgão") {
			var j = 0;
			while (j < splitVan[0].length) {
				if (vehicles[i].load + splitVan[0][j].weight <= vehicles[i].capacity) {
					vehicles[i].load += splitVan[0][j].weight;
					vehicles[i].cargo.push(splitVan[0][j].type);
					splitVan[0].splice(j, 1);
				} else {
					j++;
				}
			}
		}
	}
	
	products = splitVan[0].concat(splitVan[1]);
	var truckIndex = -1;
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Caminhão") {
			truckIndex = i;
			break;
		}
	}
	var truckCapacity = (truckIndex != -1) ? vehicles[truckIndex].capacity : -1;
	products.sort(function(p1, p2) {return p2.weight - p1.weight});
	for (var i = 0; i < vehicles.length; i++) {
		if (vehicles[i].type == "Caminhão") {
			var j = 0;
			while (j < products.length) {
				if (vehicles[i].load + products[j].weight <= vehicles[i].capacity) {
					vehicles[i].load += products[j].weight;
					vehicles[i].cargo.push(products[j].type);
					products.splice(j, 1);
				} else {
					j++;
				}
			}
		}
	}
}

//input parser
//array of words from each line
//valid format: 2 or 3 valid words OR empty line
//returns: -1 if valid OR line number where it is invalid
function parser(words) {
	for (var i = 0; i < words.length; i++) {
		var element = words[i];
		if (element.length == 2) {
			if (element[0] == "" || element[1] == "")
				return i;
			if (!isWeight(element[0]))
				return i;
			products.push({type: element[1], weight: weight(element[0])});
		} else if (element.length == 3) {
			if (element[0] == "" || element[1] == "" || element[2] == "")
				return i;
			if (!isWeight(element[0]) || !isAmmount(element[2]))
				return i;
			for (var j = 0; j < ammount(element[2]); j++) {
				products.push({type: element[1], weight: weight(element[0]) / ammount(element[2])});
			}
		} else if (element.length == 1) {
			if (element[0] != "") {
				return i;
			}
		}
		else {
			return i;
		}
	}
	return -1;
}

window.onload = function() {
	var input = document.getElementById("input");
	var output = document.getElementById("output");
	window.addEventListener("keyup", function(e) {
		lines = input.value.split("\n");
		words = lines;
		lines.forEach(function(element, index) {
			words[index] = element.split(" ");
		});
		products = [];
		output.value = "";
		var res = parser(words);
		if (res == -1) {
			loadCargo();
			$(".inline-txtarea").each(function() {
				$(this).css("border", "2px solid green");
			});
			$("#valid").text("");
			output.value = "";
			for (var i = 0; i < vehicles.length; i++) {
				output.value += vehicles[i].type + " " + 
				vehicles[i].load + "/" + vehicles[i].capacity + "kg" + " " + 
				"+" + (vehicles[i].capacity - vehicles[i].load) + "kg" + " " + 
				(100 * vehicles[i].load / vehicles[i].capacity) + "%" + " " + 
				vehicles[i].cargo + "\n";
			}
			if (products.length == 0) {
				output.value += "Nenhum produto sobrando";
			} else {
				output.value += "Produtos sobrando:" + "\n";
				for (var i = 0; i < vehicles.length; i++) {
					output.value += products[i].type + " " + products[i].weight + "kg" + "\n";
				}
			}
		} else {
			$(".inline-txtarea").each(function() {
				$(this).css("border", "2px solid red");
			});
			$("#valid").text("Inválido na linha " + res);
			output.value = "ERRO";
		}
	});
};