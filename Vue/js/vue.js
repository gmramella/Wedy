class Vehicle {
	constructor(type, capacity) {
		this.type = type;
		this.capacity = capacity;
		this.load = 0;
		this.cargo = [];
	}
}

Vue.component('transportadora', {
	template:	'<div>\
					<div class="inline-div">\
						<p align="center">Entrada</p>\
						<textarea v-model="inp" v-on:keyup="listen" class="inline-txtarea" autofocus placeholder="1350kg Automóvel" cols="166" rows="14"></textarea>\
					</div>\
					<div class="inline-div">\
						<p align="center">Saída</p>\
						<textarea v-model="out" class="inline-txtarea" readonly cols="166" rows="14"></textarea>\
					</div>\
					<div>\
						<p id="valid" align="center">Válido</p>\
					</div>\
				</div>',
	data: function () {
		return {
			inp: "",
			out: "",
			lines: null,
			words: null,
			vehicles: [],
			products: [],
		}
	},
	methods: {
		isWeight: function(word) {
			word = word.toLowerCase();
			return word.length > 2 && isNumber(word.slice(0, -2)) && word.slice(-2) == "kg";
		},
		isAmmount: function(word) {
			word = word.toLowerCase();
			return word.length > 1 && word[0] == 'x' && isNumber(word.slice(1));
		},
		weight: function(word) {
			return parseFloat(word.slice(0, -2));
		},
		ammount: function(word) {
			return parseFloat(word.slice(1));
		},
		leqGt: function(capacity) {
			var leq = [];
			var gt = [];
			for (var i = 0; i < products.length; i++) {
				if (products[i].weight <= capacity)
					leq.push(products[i]);
				else
					gt.push(products[i]);
			}
			return [leq, gt];
		},
		setVehicles: function() {
			this.vehicles.push(new Vehicle("Motocicleta", 50));
			this.vehicles.push(new Vehicle("Motocicleta", 50));
			this.vehicles.push(new Vehicle("Furgão", 5000));
			this.vehicles.push(new Vehicle("Furgão", 5000));
			this.vehicles.push(new Vehicle("Ônibus", 10000));
			this.vehicles.push(new Vehicle("Ônibus", 10000));
			this.vehicles.push(new Vehicle("Caminhão", 15000));
			this.vehicles.push(new Vehicle("Caminhão", 15000));
		},
		resetVehicles: function() {
			for (var i = 0; i < this.vehicles.length; i++) {
				this.vehicles[i].load = 0;
				this.vehicles[i].cargo.clear();
			}
		},
		loadToVehicle: function(type) {
			var vehicleIndex = -1;
			for (var i = 0; i < this.vehicles.length; i++) {
				if (this.vehicles[i].type == type) {
					vehicleIndex = i;
					break;
				}
			}
			var vehicleCapacity = (vehicleIndex != -1) ? this.vehicles[vehicleIndex].capacity : -1;
			var splitVehicle = this.leqGt(vehicleCapacity);
			splitVehicle[0].sort(function(p1, p2) {return p2.weight - p1.weight});
			for (var i = 0; i < this.vehicles.length; i++) {
				if (this.vehicles[i].type == type) {
					var j = 0;
					while (j < splitVehicle[0].length) {
						if (this.vehicles[i].load + splitVehicle[0][j].weight <= this.vehicles[i].capacity) {
							this.vehicles[i].load += splitVehicle[0][j].weight;
							this.vehicles[i].cargo.push(splitVehicle[0][j].type);
							splitVehicle[0].splice(j, 1);
						} else {
							j++;
						}
					}
				}
			}
			return splitVehicle;
		},
		loadCargo: function() {
			this.resetVehicles();
			products.sort(function(p1, p2) {return p1.weight - p2.weight});
			
			var splitMotorcycle = this.loadToVehicle("Motocicleta");
			products = splitMotorcycle[0].concat(splitMotorcycle[1]);
			
			var splitVan = this.loadToVehicle("Furgão");
			products = splitVan[0].concat(splitVan[1]);
			
			var splitBus = this.loadToVehicle("Ônibus");
			products = splitBus[0].concat(splitBus[1]);
			
			var splitTruck = this.loadToVehicle("Caminhão");
			products = splitTruck[0].concat(splitTruck[1]);
		},
		//input parser
		//array of words from each line
		//valid format: 2 or 3 valid words OR empty line
		//returns: -1 if valid OR line number where it is invalid
		parser: function() {
			for (var i = 0; i < words.length; i++) {
				var element = words[i];
				if (element.length == 2) {
					if (element[0] == "" || element[1] == "")
						return i;
					if (!this.isWeight(element[0]))
						return i;
					products.push({type: element[1], weight: this.weight(element[0])});
				} else if (element.length == 3) {
					if (element[0] == "" || element[1] == "" || element[2] == "")
						return i;
					if (!this.isWeight(element[0]) || !this.isAmmount(element[2]))
						return i;
					for (var j = 0; j < this.ammount(element[2]); j++) {
						products.push({type: element[1], weight: this.weight(element[0]) / this.ammount(element[2])});
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
		},
		showLoading: function() {
			for (var i = 0; i < this.vehicles.length; i++) {
				this.out += this.vehicles[i].type + " " + 
				this.vehicles[i].load + "/" + this.vehicles[i].capacity + "kg" + " " + 
				"+" + (this.vehicles[i].capacity - this.vehicles[i].load) + "kg" + " " + 
				(100 * this.vehicles[i].load / this.vehicles[i].capacity) + "%" + " " + 
				this.vehicles[i].cargo + "\n";
			}
		},
		listen: function() {
			lines = this.inp.split("\n");
			words = lines;
			lines.forEach(function(element, index) {
				words[index] = element.split(" ");
			});
			products = [];
			this.out = "";
			var res = this.parser(words);
			if (res == -1) {
				$(".inline-txtarea").each(function() {
					$(this).css("border", "2px solid green");
				});
				$("#valid").text("");
				this.loadCargo();
				this.showLoading();
				if (products.length == 0) {
					this.out += "Nenhum produto sobrando";
				} else {
					this.out += "Produtos sobrando:" + "\n";
					for (var i = 0; i < products.length; i++) {
						this.out += products[i].type + " " + products[i].weight + "kg" + "\n";
					}
				}
			} else {
				$(".inline-txtarea").each(function() {
					$(this).css("border", "2px solid red");
				});
				$("#valid").text("Inválido na linha " + res);
				this.out = "ERRO";
			}
		}
	},
	filters: {
		capitalize: function (value) {
			if (!value) return '';
			value = value.toLowerCase();
			return value.charAt(0).toUpperCase() + value.slice(1);
		},
	},
	created: function () {
		this.setVehicles();
		this.showLoading();
	},
})