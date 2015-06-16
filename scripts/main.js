var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasUi = document.getElementById("canvasUi");
var ctxUi = canvasUi.getContext("2d");

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.requestAnimationFrame = requestAnimationFrame;

function animate(time) {           // Animation loop
	update();
	draw(time);                     // A function that draws the current animation frame
	requestAnimationFrame(animate); // Keep the animation going
};

// Auxiliary Functions
// ----------------------------------------
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Player Class
// The Player Class will contain all of the player's actions and attributes.
// ----------------------------------------
Player = function() {
	this.turnEnd = false;
	
	// Inspector Rectangle
	this.inspectRect = new Rectangle(0, 0, gameCell, gameCell);
	this.inspectRect.color = new Color(50, 50, 50, 0.6);
	
	// Player Stats
	this.health = 100;
	this.maxHealth;
	this.mana = 100;
	this.maxMana;
	this.dex = 10;
	this.con = 10;
	this.intel = 10;
	this.str = 10;
	
	this.prevHealth;
	this.newHealth;

	this.pClass = "Soldier";
	this.img = playerImg;
	
	this.abilityOne;
	this.abilityTwo;
	this.abilityThree;
	this.abilityFour;
	
	this.level = 1;
	this.exp = 0;
	
	this.money;
	this.headSlot = "";
	this.chestSlot = "";
	this.bootSlot = "";
	this.gloveSlot = "";
	this.legSlot = "";
	this.weaponSlot = "";
	
	// Inventory
	this.inventory = [];
	
	this.makePlayer = function(x, y, w, h) {
		this.rect = new Rectangle(x, y, w, h);
		this.rect.color = new Color(120, 120, 120, 1);
	}
	
	// Updates the player
	this.Move = function() {
		// Player Input
		// Up
		if (input.w == true && this.turnEnd == false) {
			player.rect.y -= gameCell;
			this.turnEnd = true;
			ctx.translate(0, +gameCell);
			transY += gameCell;
			turnCount += 1;
			playerTurn = false;
		}
		
		// Down
		else if (input.s == true && this.turnEnd == false) {
			player.rect.y += gameCell;
			this.turnEnd = true;
			ctx.translate(0, -gameCell);
			transY -= gameCell;
			turnCount += 1;
			playerTurn = false;
		}
		
		// Left
		else if (input.a == true && this.turnEnd == false) {
			player.rect.x -= gameCell;
			this.turnEnd = true;
			ctx.translate(+gameCell, 0);
			transX += gameCell;
			turnCount += 1;
			playerTurn = false;
		}
		
		// Right
		 else if (input.d == true && this.turnEnd == false) {
			player.rect.x += gameCell;
			this.turnEnd = true;
			ctx.translate(-gameCell, 0);
			transX -= gameCell;
			turnCount += 1;
			playerTurn = false;
		}
		
		if (input.w == false && input.a == false && input.s == false && input.d == false) {
			this.turnEnd = false;
		}
		
		// Camera Movement
		if (input.up == true) {
			ctx.translate(0, +gameCell);
			transY += gameCell;
		} else if (input.down == true) {
			ctx.translate(0, -gameCell);
			transY -= gameCell;
		} else if (input.left == true) {
			ctx.translate(+gameCell, 0);
			transX += gameCell;
		} else if (input.right == true) {
			ctx.translate(-gameCell, 0);
			transX -= gameCell;
		}		
	}
	
	// Draws the Player
	this.Draw = function() {
		ctx.drawImage(this.img, player.rect.x, player.rect.y);

		if (player.prevHealth > player.newHealth) {
			ctx.fillStyle = "red";
			ctx.font = "bold 16px Arial";
			ctx.fillText(player.newHealth - player.prevHealth, player.rect.x + 8, player.rect.y - 5);
		}
		//player.rect.Draw(ctx);
	}
}

Attack = function(name) {
	this.name = name;
	this.type;
	this.shieldCost;
	this.range;
	this.minDamage;
	this.maxDamage;
	this.toggle = false;
	this.color = new Color(0, 0, 0, 1);
	this.image;
	
	if (this.name == "Melee") {
		this.image = meleeSrc;
		this.color = new Color(0, 0, 50, 1);
		this.range = 1;
		this.shieldCost = 0;
	
		this.attackRect = new Rectangle(player.rect.x - gameCell - 2, player.rect.y - gameCell - 2, gameCell * 3, gameCell * 3);
		this.attackRect.color = new Color(100, 50, 50, 0.5);
		this.minDamage = player.str / 2;
		this.maxDamage = player.str;
		
		this.Update = function() {
			this.minDamage = player.str / 2;
			this.maxDamage = player.str;
		}
		
		this.Atk = function(enemy) {
			
			var atkDamage = getRandomInt(this.minDamage, this.maxDamage);
			enemy.health -= atkDamage;
			textBox.addText("You Melee the " + enemy.name + " for " + atkDamage + " damage!");
			
		}
	}
	
	if (this.name == "Shoot") {
		this.image = shootSrc;
		this.color = new Color(0, 50, 0, 1);
		this.range = 4;
		this.shieldCost = 10;
	
		this.attackRect = new Rectangle(player.rect.x - (gameCell * 4) - 2, player.rect.y - (gameCell * 4) - 2, gameCell * 9, gameCell * 9);
		this.attackRect.color = new Color(100, 50, 50, 0.5);
		if (player.weaponSlot.minDmg != null && player.weaponSlot.maxDmg != null) {
			this.minDamage = player.weaponSlot.minDmg;
			this.maxDamage = player.weaponslot.maxDmg;
		}
		
		this.Update = function() {
			if (player.weaponSlot.minDmg != null && player.weaponSlot.maxDmg != null) {
				this.minDamage = player.weaponSlot.minDmg;
				this.maxDamage = player.weaponSlot.maxDmg;
			}
		}
		
		this.Atk = function(enemy) {
			var atkDamage = getRandomInt(this.minDamage, this.maxDamage);
			enemy.health -= atkDamage;
			textBox.addText("You expend 10 shield to Shoot the " + enemy.name + " for " + atkDamage + " damage!");
			player.mana -= 10;
		}
	}
	
	this.Draw = function() {
		if (this.toggle == true) {
			this.attackRect.Draw(ctxUi);
		}		
	}
}

// Enemy Class
Enemy = function(name, type, drop, level, exp, health, con, str) {
	this.name = name;
	this.type = type;
	this.level = level;
	this.exp = exp;
	this.health = health;
	this.maxHealth = health;
	this.con = con;
	this.str = str;
	this.rect;
	this.color;
	this.drop = drop;
	this.dropChance;
	this.img;
	
	this.prevHealth;
	this.newHealth;
	
	this.textScroll;
	this.dispDmg;
	this.drawDmg = function(dmg) {
		if (this.dispDmg == true) {
			ctx.font = "14px Arial";
			ctx.fillStyle = "black";
			ctx.fillText(dmg, this.rect.x, this.rect.y);
		}
	}
}

// Item Class
Item = function(name, type, str, con, intel) {
	this.color;
	this.name = name;
	this.type = type;
	this.freq;
	this.start;
	this.minDmg;
	this.maxDmg;
	this.str = str;
	this.con = con;
	this.intel = intel;
	this.rect;
}

// UI Panel Class
Ui = function(x, y, w,  h, type) {
	this.x = x;
	this.y = y;
	this.height = h;
	this.width = w;
	this.type = type;
	this.image;
	this.contents = new Array;
	this.rect = new Rectangle(this.x, this.y, this.width, this.height);
	
	this.toggle = false;
	this.inputRelease = true;
	
	// Player Stat
	this.healthBar = new Rectangle(this.x, this.y + 100, 100, 20);
	this.healthBar.color = new Color(225, 0, 0, 1);
	this.healthBarMax = new Rectangle(this.x, this.y + 100, 100, 20);
	this.healthBarMax.color = new Color(225, 125, 125, 1);

	// Temp mana bar test
	this.shieldBar = new Rectangle(this.x, this.y + 120, 100, 20);
	this.shieldBar.color = new Color(0, 0, 225, 1);
	this.shieldBarMax = new Rectangle(this.x, this.y + 120, 100, 20);
	this.shieldBarMax.color = new Color(125, 125, 225, 1);

	// Temp exp bar test
	this.expBar = new Rectangle(this.x, this.y + 140, 100, 20);
	this.expBar.color = new Color(255, 255, 0, 1);
	this.expBarMax = new Rectangle(this.x, this.y + 140, 100, 20);
	this.expBarMax.color = new Color(225, 255, 125, 1);

	// Inventory Display
	this.invDisp = new Array;
	
	// Action Bar
	if (this.type == "action") {
		this.abOneRect = new Rectangle(this.x + 2, this.y + 2, 40, 40);
		this.abOneRect.color = player.abilityOne.color;

		this.abTwoRect = new Rectangle(this.x + 44, this.y + 2, 40, 40);
		this.abTwoRect.color = new Color(50, 50, 50, 1);
		
		this.abThreeRect = new Rectangle(this.x + 86, this.y + 2, 40, 40);
		this.abThreeRect.color = new Color(50, 50, 50, 1);
		
		this.abFourRect = new Rectangle(this.x + 128, this.y + 2, 40, 40);
		this.abFourRect.color = new Color(50, 50, 50, 1);
	}
	
	// Text Box Specific
	if (this.type == "textBox") {
		this.addText = function(input) {
			this.contents.push(input);
			if (this.contents.length > 10) {
				this.contents.RemoveAt(0);
			}	
		}
	}	
	
	this.Draw = function() {
		if (this.toggle == true) {
			this.rect.Draw(ctxUi);
			// Text Box Specific
			if (this.type == "textBox") {
				ctxUi.font = "14px Arial";
				ctxUi.fillStyle = "black";
				var boxTotal = this.contents.length;
				for (i = 0; i < this.contents.length; i++) {
					var n = this.contents.length - i - 1;
					var deltaY = -14 * n; 
					ctxUi.fillText(this.contents[i], this.x, this.y + 138 + deltaY);
				}
			}
			
			// Action Bar Specific
			if (this.type == "action") {
				ctxUi.font = "14px Arial";
				//this.abOneRect.Draw(ctxUi);
				ctxUi.drawImage(player.abilityOne.image, this.abOneRect.x, this.abOneRect.y);
				ctxUi.fillStyle = "white";
				ctxUi.fillText("z", this.x + 5, this.y + 37);
				this.abTwoRect.Draw(ctxUi);
				if (player.abilityTwo != null) {
					ctxUi.drawImage(player.abilityTwo.image, this.abTwoRect.x, this.abTwoRect.y);
				}
				ctxUi.fillStyle = "white";
				ctxUi.fillText("x", this.x + 72, this.y + 37);
				this.abThreeRect.Draw(ctxUi);
				ctxUi.fillStyle = "white";
				ctxUi.fillText("c", this.x + 89, this.y + 37);
				this.abFourRect.Draw(ctxUi);
				ctxUi.fillStyle = "white";
				ctxUi.fillText("v", this.x + 131, this.y + 37);
			}
			
			// Char Specific
			if (this.type == "char") {
				ctxUi.font = "14px Arial";
				ctxUi.fillStyle = "black";
				ctxUi.fillText("Head", this.x + 24, this.y + 17);
				this.headRect = new Rectangle(this.x + 2, this.y + 2, 20, 20);
				this.headRect.color = player.headSlot.color;
				this.headRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				ctxUi.fillText("Chest", this.x + 24, this.y + 39);
				this.chestRect = new Rectangle(this.x + 2, this.y + 24, 20, 20);
				this.chestRect.color  =  player.chestSlot.color;
				this.chestRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				ctxUi.fillText("Legs", this.x + 24, this.y + 61);
				this.legRect = new Rectangle(this.x + 2, this.y + 46, 20, 20);
				this.legRect.color = player.legSlot.color;
				this.legRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				ctxUi.fillText("Boots", this.x + 24, this.y + 83);
				this.bootRect = new Rectangle(this.x + 2, this.y + 68, 20, 20);
				this.bootRect.color = player.bootSlot.color;
				this.bootRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				ctxUi.fillText("Gloves", this.x + 24, this.y + 105);
				this.gloveRect = new Rectangle(this.x + 2, this.y + 91, 20, 20);
				this.gloveRect.color = player.gloveSlot.color;
				this.gloveRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				ctxUi.fillText("Weapon", this.x + 24, this.y + 127);
				this.weaponRect = new Rectangle(this.x + 2, this.y + 114, 20, 20);
				this.weaponRect.color = player.weaponSlot.color;
				this.weaponRect.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				
				// Stats display
				ctxUi.font = "13px Arial";
				ctxUi.fillStyle = "Black";
				ctxUi.fillText("STR:  " + player.str, this.x + 80, this.y + 20);
				ctxUi.fillText("CON: " + player.con, this.x + 80, this.y + 40);
				ctxUi.fillText("DEX:  " + player.dex, this.x + 80, this.y + 60);
				ctxUi.fillText("INT:    " + player.intel, this.x + 80, this.y + 80);
			
			}
			
			// Inventory Specific
			if (this.type == "inv") {
				// Setting up display Array
				for (i = 0; i < player.inventory.length; i++) {
					if (this.invDisp.Contains(player.inventory[i]) == false) {
						this.invDisp.push(player.inventory[i]);
					}
				}
			
				ctxUi.font = "16px Arial";
				ctxUi.fillStyle = "black";
				for (i = 0; i < this.invDisp.length; i++) {
					//var n = this.invDisp.length - i - 1;
					if (i <= 5) {
						var deltaY = 22 * i;
						var deltaX = 0;
					} else if (i >= 6 && i <= 11) {
						var deltaY = 22 * (i - 6);
						var deltaX = 22;
					}					
					this.invDisp[i].rect = new Rectangle(this.x + 3 + deltaX, this.y + 2 + deltaY, 20, 20)
					this.invDisp[i].rect.color = this.invDisp[i].color;
					this.invDisp[i].rect.Draw(ctxUi);
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.inventory.Occurs(this.invDisp[i]), this.x + 7 + deltaX, this.y + 18 + deltaY);
				}
			}
			
			if (this.type == "tip") {
				this.x = toolTipBox.rect.x;
				this.y = toolTipBox.rect.y
				// Tooltip over inventory pane
				for (i = 0; i < invMenu.invDisp.length; i++) {
					if (invMenu.invDisp[i].rect.Contains(input.mousePosition.x, input.mousePosition.y)) {
						if (invMenu.invDisp[i].type == "lowHP") {
							ctxUi.fillStyle = "black";
							ctxUi.fillText(invMenu.invDisp[i].name, this.x + 2, this.y + 13);
							ctxUi.fillText("HP: 20 ", this.x + 2, this.y + 25);
						} else if (invMenu.invDisp[i].type == "weapon") {
							ctxUi.fillStyle = "black";
							ctxUi.fillText(invMenu.invDisp[i].name, this.x + 2, this.y + 13);
							ctxUi.fillText(invMenu.invDisp[i].minDmg + " - " + invMenu.invDisp[i].maxDmg + " Damage", this.x + 2, this.y + 25);
							ctxUi.fillText("CON: " + invMenu.invDisp[i].con, this.x + 2, this.y + 37);
							ctxUi.fillText("STR:  " + invMenu.invDisp[i].str, this.x + 2, this.y + 49);
							ctxUi.fillText("INT:   " + invMenu.invDisp[i].intel, this.x + 2, this.y + 61);
						} else {
						ctxUi.fillStyle = "black";
						ctxUi.fillText(invMenu.invDisp[i].name, this.x + 2, this.y + 13);
						ctxUi.fillText("CON: " + invMenu.invDisp[i].con, this.x + 2, this.y + 25);
						ctxUi.fillText("STR:  " + invMenu.invDisp[i].str, this.x + 2, this.y + 37);
						ctxUi.fillText("INT:   " + invMenu.invDisp[i].intel, this.x + 2, this.y + 49);
						}
					}
				}
				
				// Tooltip over character pane
				if (charMenu.chestRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.chestSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText("CON: " + player.chestSlot.con, this.x + 2, this.y + 25);
					ctxUi.fillText("STR:  " + player.chestSlot.str, this.x + 2, this.y + 37);
					ctxUi.fillText("INT:   " + player.chestSlot.intel, this.x + 2, this.y + 49);
				}
				if (charMenu.gloveRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.gloveSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText("CON: " + player.gloveSlot.con, this.x + 2, this.y + 25);
					ctxUi.fillText("STR:  " + player.gloveSlot.str, this.x + 2, this.y + 37);
					ctxUi.fillText("INT:   " + player.gloveSlot.intel, this.x + 2, this.y + 49);
				}
				if (charMenu.headRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.headSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText("CON: " + player.headSlot.con, this.x + 2, this.y + 25);
					ctxUi.fillText("STR:  " + player.headSlot.str, this.x + 2, this.y + 37);
					ctxUi.fillText("INT:   " + player.headSlot.intel, this.x + 2, this.y + 49);
				}
				if (charMenu.legRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.legSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText("CON: " + player.legSlot.con, this.x + 2, this.y + 25);
					ctxUi.fillText("STR:  " + player.legSlot.str, this.x + 2, this.y + 37);
					ctxUi.fillText("INT:   " + player.legSlot.intel, this.x + 2, this.y + 49);
				}
				if (charMenu.bootRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.bootSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText("CON: " + player.bootSlot.con, this.x + 2, this.y + 25);
					ctxUi.fillText("STR:  " + player.bootSlot.str, this.x + 2, this.y + 37);
					ctxUi.fillText("INT:   " + player.bootSlot.intel, this.x + 2, this.y + 49);
				}
				if (charMenu.weaponRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.fillText(player.weaponSlot.name, this.x + 2, this.y + 13);
					ctxUi.fillText(player.weaponSlot.minDmg + " - " + player.weaponSlot.maxDmg + " Damage", this.x + 2, this.y + 25);
					ctxUi.fillText("CON: " + player.weaponSlot.con, this.x + 2, this.y + 37);
					ctxUi.fillText("STR:  " + player.weaponSlot.str, this.x + 2, this.y + 49);
					ctxUi.fillText("INT:   " + player.weaponSlot.intel, this.x + 2, this.y + 61);
				}
				
				// Tooltip over Action Bar
				// Action Bar Slot One
				if (actionBar.abOneRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
					ctxUi.fillStyle = "black";
					ctxUi.font = "14px Arial";
					ctxUi.fillText(player.abilityOne.name, this.x + 2, this.y + 13);
					ctxUi.fillText("Damage: " + player.abilityOne.minDamage + " to " + player.abilityOne.maxDamage, this.x + 2, this.y + 27);
					ctxUi.fillText("Energy Cost: " + player.abilityOne.shieldCost, this.x + 2, this.y + 40);
					ctxUi.fillText("Range: " + player.abilityOne.range, this.x + 2, this.y + 53);
				}
				// Action Bar Slot Two
				if (player.abilityTwo != null) {
					if (actionBar.abTwoRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
						ctxUi.fillStyle = "black";
						ctxUi.font = "14px Arial";
						ctxUi.fillText(player.abilityTwo.name, this.x + 2, this.y + 13);
						ctxUi.fillText("Damage: " + player.abilityTwo.minDamage + " to " + player.abilityTwo.maxDamage, this.x + 2, this.y + 27);
						ctxUi.fillText("Energy Cost: " + player.abilityTwo.shieldCost, this.x + 2, this.y + 40);
						ctxUi.fillText("Range: " + player.abilityTwo.range, this.x + 2, this.y + 53);
					}
				}
			}
			
			if (this.type == "stat") {
				ctxUi.font = "13px Arial";
				ctxUi.fillStyle = "black";
				// Draw health, mana, and exp bars
				this.healthBarMax.Draw(ctxUi);
				this.healthBar.Draw(ctxUi);
				ctxUi.fillStyle = "black";
				ctxUi.fillText("Health: " + player.health + "/" + player.maxHealth, this.x, this.y + 115);
				
				this.shieldBarMax.Draw(ctxUi);
				this.shieldBar.Draw(ctxUi);
				ctxUi.fillStyle = "Black";
				ctxUi.fillText("Energy: " + player.mana + "/" + player.maxMana, this.x, this.y + 135);
				
				this.expBarMax.Draw(ctxUi);
				this.expBar.Draw(ctxUi);
				ctxUi.fillStyle = "Black";
				ctxUi.fillText("Exp: " + player.exp + "/" + expPerLevel[player.level], this.x, this.y + 155);
				
				//Portrait
				ctxUi.fillText(player.pClass + ": Level " + player.level, this.x + 5, this.y + 95);
				ctxUi.fillText("Portrait Here! ", this.x + 10, this.y + 50);
				
			}
		}
	}
}

// Room Class
// Handles the generation of rooms allowing specified ranges for size and cell size.
// ----------------------------------------
Room = function(xIn, yIn, roomMin, roomMax, cellIn) {
	this.x = xIn;
	this.y = yIn;
	this.cellSize = cellIn;
	this.roomWidth;
	this.roomHeight;
	this.totalWidth;
	this.totalHeight
	this.doorLocation;
	this.visible = true;
	
	this.floorEnd;
	
	// Walls and floors
	this.wallTile = new Array;
	this.stairTile = new Array;
	this.fogTile = new Array;
	this.doorTile = new Array;
	this.doorSide = getRandomInt(1, 4);
	this.doorType = new Array;
	this.floorTile = new Array;
	this.enemyTile = new Array;
	
	this.roomCount = 0;
	this.roomSpace = new Array;
	
	// Items
	var roomItemCount = getRandomInt(0, Math.round(floorLevel/2));
	
	this.roomItems = new Array;
	this.itemTile = new Array;
	
	// Room contents
	this.generateFloor = function(seedX, seedY) {
		this.roomWidth = getRandomInt(roomMin, roomMax);
		this.roomHeight = getRandomInt(roomMin, roomMax);
		this.totalWidth = this.cellSize * this.roomWidth;
		this.totalHeight = this.cellSize * this.roomHeight;
		
		// Determine initial doors
		this.doorCount = getRandomInt(1, 4);
		
		// Determine room contents
		this.itemList = new Array;
		var roomItems = getRandomInt(0, Math.round(floorLevel/2));
		
		if (seedX == null || seedY == null) {
			// Top wall generation
			var topWallCursor = 0;
			for (i = 0; i < this.roomWidth; i++) {
				this.wallTile.push(new Rectangle(this.x + topWallCursor, this.y, this.cellSize, this.cellSize));
				topWallCursor += this.cellSize;
			}
			
			// Bottom wall generation
			var bottomWallCursor = 0;
			for (i = 0; i < this.roomWidth; i++) {
				this.wallTile.push(new Rectangle(this.x + bottomWallCursor, (this.y + (this.totalHeight - this.cellSize)), this.cellSize, this.cellSize));
				bottomWallCursor += this.cellSize;
			}
			
			// Left wall generation
			var leftWallCursor = 0;
			for (i = 0; i < this.roomHeight; i++) {
				this.wallTile.push(new Rectangle(this.x, this.y + leftWallCursor, this.cellSize, this.cellSize));
				leftWallCursor += this.cellSize;
			}
			
			// Right wall generation
			var rightWallCursor = 0;
			for (i = 0; i < this.roomHeight; i++) {
				this.wallTile.push(new Rectangle(this.x + (this.totalWidth - this.cellSize), this.y + rightWallCursor, this.cellSize, this.cellSize));
				rightWallCursor += this.cellSize;
			}

			
			// Door generation
			var pickedSide = []
			for (i = 0; i < this.doorCount; i++) {
				this.doorSide = getRandomInt(1, 4);
				if (i != 0) {
					while (pickedSide.Contains(this.doorSide) == true) {
						this.doorSide = getRandomInt(1, 4);
					}				
				}
				pickedSide.push(this.doorSide);
				
				if (this.totalWidth <= this.totalHeight) {
					this.doorLocation = getRandomInt(2, this.roomWidth - 2);
				} else {
					this.doorLocation = getRandomInt(2, this.roomHeight - 2);
				}
				// Top
				if (this.doorSide == 1) {
					this.doorTile.push(new Rectangle(this.x + (this.doorLocation * this.cellSize) + 1, this.y + 1, this.cellSize - 2 , this.cellSize - 2));
					this.doorType.push("top");
				} 
				// Bottom
				else if (this.doorSide == 2) {
					this.doorTile.push(new Rectangle(this.x + (this.doorLocation * this.cellSize) + 1, this.y + 1 + (this.totalHeight - this.cellSize), this.cellSize - 2 , this.cellSize - 2));
					this.doorType.push("bottom");
				}
				// Left
				if (this.doorSide == 3) {
					this.doorTile.push(new Rectangle(this.x + 1, this.y + (this.doorLocation * this.cellSize) + 1, this.cellSize - 2 , this.cellSize - 2));
					this.doorType.push("left");
				} 
				// Right
				else if (this.doorSide == 4) {
					this.doorTile.push(new Rectangle(this.x + (this.totalWidth - this.cellSize), this.y + (this.doorLocation * this.cellSize) + 1, this.cellSize - 2 , this.cellSize - 2));
					this.doorType.push("right");
				}
				
			}
			
			// Assigning floorEnd to a side which will eventually lead to the exit.
			if (pickedSide.length >= 2) {
				if (pickedSide[0] == 1) {
					this.floorEnd = "top"
				} else if (pickedSide[0] == 2) {
					this.floorEnd = "bottom"
				} else if (pickedSide[0] == 3) {
					this.floorEnd = "left"
				} else if (pickedSide[0] == 4) {
					this.floorEnd = "right"
				}
					console.log(this.floorEnd);
			}
			
			// New room item generation
			for (i = 0; i < roomItemCount; i++) {
				var pickItemIndex = getRandomInt(0, (worldItems.length - 1));
				var pickItem = worldItems[pickItemIndex];
				var itemX = getRandomInt(2 , this.roomWidth - 2);
				var itemY = getRandomInt(2, this.roomHeight - 2);
				this.itemTile.push(new Rectangle(this.x + (itemX * this.cellSize), this.y + (itemY * this.cellSize), this.cellSize, this.cellSize));
				this.itemTile[this.itemTile.length - 1].color = worldItems[pickItemIndex].color;
				this.itemList.push(pickItem);
			}

			// Generate floor and fog tiles
			for (i = 0; i < this.roomWidth; i++) {
				for (j = 0; j < this.roomHeight; j++) {
					this.floorTile.push(new Rectangle(this.x + (i * this.cellSize), this.y + (j * this.cellSize), this.cellSize, this.cellSize));
					this.fogTile.push(new Rectangle(this.x + (i * this.cellSize), this.y + (j * this.cellSize), this.cellSize, this.cellSize));
				}
			}
			
			// Coloring tiles
			// Color floor
			for (i = 0; i < this.floorTile.length; i++) {
				this.floorTile[i].color = new Color(200,200,200,1);
			}
			// Color walls
			for (i = 0; i < this.wallTile.length; i++) {
				this.wallTile[i].color = new Color(0,0,0,1);
			}
			// Color stairs
			for (i = 0; i < this.stairTile.length; i++) {
				this.stairTile[i].color = new Color(0,255,0,1);
			}
			// Color fog
			for (i = 0; i < this.fogTile.length; i++) {
				this.fogTile[i].color = new Color(128,128,128,1);
			}
			// Color doors
			for (i = 0; i < this.doorTile.length; i++) {
				this.doorTile[i].color = new Color(150, 0, 200, 1);
			}
			/*
			// Color Items
			for (i = 0; i < this.itemTile.length; i++) {
				this.itemTile[i].color = new Color(0, 0, 255, 1);
			}
			*/
		} 
	}
	
	// Adds a new room after the initial floor lobby
	this.AddRoom = function(playerX, playerY, type) {
		
		this.roomCount += 1;
		var roomItemCount = getRandomInt(0, Math.round(floorLevel/2));
		var stairChance = getRandomInt(1, 4);
		this.doorSide = getRandomInt(1, 0);
		this.enemyChance = getRandomInt(1, 10);
		// Room expansion from a top door
		if (type == "top") {
			// Bottom Wall
			var leftExp = getRandomInt(3, 7);
			var bLeftCursor = 1;
			for (i = 0; i < leftExp; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (bLeftCursor * this.cellSize), playerY - 2, this.cellSize, this.cellSize)); 
				tempTile = new Rectangle((playerX) - (bLeftCursor * this.cellSize), playerY, this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bLeftCursor += 1;
			}
			
			var rightExp = getRandomInt(3, 7);
			var bRightCursor = 1;
			for (i = 0; i < rightExp; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + (bRightCursor * this.cellSize), playerY - 2, this.cellSize, this.cellSize)); 
				tempTile = new Rectangle((playerX) + (bRightCursor * this.cellSize), playerY, this.cellSize - 2, this.cellSize - 2);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bRightCursor += 1;
			}
			
			// Top Wall
			var newHeight = getRandomInt(6, 14);
			var topWidth = leftExp + rightExp + 1;
			var topCursor = 0;
			for (i = 0; i < topWidth; i++) {
				this.wallTile.push(new Rectangle(((playerX - 2) - (leftExp * this.cellSize) + (topCursor * this.cellSize)), (playerY - 2) - (newHeight * this.cellSize), this.cellSize, this.cellSize)); 
				tempTile = new Rectangle(((playerX - 2) - (leftExp * this.cellSize) + (topCursor * this.cellSize)), (playerY - 2) - (newHeight * this.cellSize), this.cellSize - 2, this.cellSize - 2);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				topCursor += 1;
			}
			
			// Left Wall
			var leftCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (leftExp * this.cellSize), (playerY - 2) - (leftCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX - 2) - (leftExp * this.cellSize), (playerY - 2) - (leftCursor * this.cellSize), this.cellSize - 2, this.cellSize - 2);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				leftCursor += 1;
			}
			
			// Right Wall
			var rightCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + (rightExp * this.cellSize), (playerY - 2) - (rightCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX - 2) + (rightExp * this.cellSize), (playerY - 2) - (rightCursor * this.cellSize), this.cellSize - 2, this.cellSize - 2);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				rightCursor += 1;
			}
			
			var newRoomX = (playerX - 2) - (leftExp * this.cellSize);
			var newRoomY = (playerY - 2) - (newHeight * this.cellSize);
			var newRoomWidth = topWidth;
			var newRoomHeight = newHeight;
			
		}
		
		// Room expansion from a bottom door.
		if (type == "bottom") {
			// Top Wall
			var leftExp = getRandomInt(3, 7);
			var bLeftCursor = 1;
			for (i = 0; i < leftExp; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (bLeftCursor * this.cellSize), playerY - 2, this.cellSize, this.cellSize)); 
				tempTile = new Rectangle((playerX) - (bLeftCursor * this.cellSize), playerY, this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bLeftCursor += 1;
			}
			
			var rightExp = getRandomInt(3, 7);
			var bRightCursor = 1;
			for (i = 0; i < rightExp; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + (bRightCursor * this.cellSize), playerY - 2, this.cellSize, this.cellSize)); 
				tempTile = new Rectangle((playerX) + (bRightCursor * this.cellSize), playerY, this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bRightCursor += 1;
			}
			
			// Bottom Wall
			var newHeight = getRandomInt(6, 14);
			var topWidth = leftExp + rightExp + 1;
			var topCursor = 0;
			for (i = 0; i < topWidth; i++) {
				this.wallTile.push(new Rectangle(((playerX - 2) - (leftExp * this.cellSize) + (topCursor * this.cellSize)), (playerY - 2) + ((newHeight - 1) * this.cellSize), this.cellSize, this.cellSize)); 
				tempTile = new Rectangle(((playerX) - (leftExp * this.cellSize) + (topCursor * this.cellSize)), (playerY) + (newHeight * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				topCursor += 1;
			}
			
			// Left Wall
			var leftCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (leftExp * this.cellSize), (playerY - 2) + (leftCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) - (leftExp * this.cellSize), (playerY) + (leftCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);

				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				leftCursor += 1;
			}
			// Right Wall
			var rightCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + (rightExp * this.cellSize), (playerY - 2) + (rightCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) + (rightExp * this.cellSize), (playerY) + (rightCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				rightCursor += 1;
			}
			
			var newRoomX = (playerX - 2) - (leftExp * this.cellSize);
			var newRoomY = (playerY - 2);
			var newRoomWidth = topWidth;
			var newRoomHeight = newHeight;
		}
		
		// Room expansion from left door.
		if (type == "left") {
			// Right Wall
			var upExp = getRandomInt(3, 7);
			var upCursor = 0;
			for (i = 0; i < upExp; i++) {
				this.wallTile.push(new Rectangle(playerX - 2, (playerY - 2) - this.cellSize - (upCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle(playerX, (playerY) - this.cellSize - (upCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				upCursor += 1;
			}
			var downExp = getRandomInt(3, 7);
			var downCursor = 0;
			for (i = 0; i < downExp; i++) {
				this.wallTile.push(new Rectangle(playerX - 2, (playerY - 2) + this.cellSize + (downCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle(playerX, (playerY) + this.cellSize + (downCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				downCursor += 1;
			}
			
			// Left Wall
			var newWidth = getRandomInt(6, 14);
			var newHeight = upExp + downExp + 1;
			var leftCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (newWidth * this.cellSize), (playerY - 2) + (downExp * this.cellSize) - (leftCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) - (newWidth * this.cellSize), (playerY) + (downExp * this.cellSize) - (leftCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				leftCursor += 1;
			}
			
			// Top Wall
			var topCursor = 0;
			for (i = 0; i < newWidth; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (newWidth * this.cellSize) + (topCursor * this.cellSize), (playerY - 2) - (upExp * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) - (newWidth * this.cellSize) + (topCursor * this.cellSize), (playerY) - (upExp * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				topCursor += 1;
			}
			
			// Bottom Wall
			var bottomCursor = 0;
			for (i = 0; i < newWidth; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) - (newWidth * this.cellSize) + (bottomCursor * this.cellSize), (playerY - 2) + (downExp * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) - (newWidth * this.cellSize) + (bottomCursor * this.cellSize), (playerY) + (downExp * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bottomCursor += 1;
			}
			
			var newRoomX = (playerX - 2) - (newWidth * this.cellSize);
			var newRoomY = (playerY - 2) - (upExp * this.cellSize);
			var newRoomWidth = newWidth;
			var newRoomHeight = newHeight;
		}
		
		// Expand from right door.
		if (type == "right") {
			// Left Wall
			var upExp = getRandomInt(4, 7);
			var upCursor = 0;
			for (i = 0; i < upExp; i++) {
				this.wallTile.push(new Rectangle(playerX - 2, (playerY - 2) - this.cellSize - (upCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle(playerX, (playerY) - this.cellSize - (upCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				upCursor += 1;
			}
			var downExp = getRandomInt(3, 7);
			var downCursor = 0;
			for (i = 0; i < downExp; i++) {
				this.wallTile.push(new Rectangle(playerX - 2, (playerY - 2) + this.cellSize + (downCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle(playerX, (playerY) + this.cellSize + (downCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				downCursor += 1;
			}
			
			// Right Wall
			var newWidth = getRandomInt(6, 14);
			var newHeight = upExp + downExp + 1;
			var leftCursor = 0;
			for (i = 0; i < newHeight; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + ((newWidth - 1) * this.cellSize), (playerY - 2) + (downExp * this.cellSize) - (leftCursor * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) + (newWidth * this.cellSize), (playerY) + (downExp * this.cellSize) - (leftCursor * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				leftCursor += 1;
			}
			
			// Top Wall
			var topCursor = 0;
			for (i = 0; i < newWidth; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + ((newWidth - 1) * this.cellSize) - (topCursor * this.cellSize), (playerY - 2) - (upExp * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) + (newWidth * this.cellSize) - (topCursor * this.cellSize), (playerY) - (upExp * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				topCursor += 1;
			}
			
			// Bottom Wall
			var bottomCursor = 0;
			for (i = 0; i < newWidth; i++) {
				this.wallTile.push(new Rectangle((playerX - 2) + ((newWidth - 1) * this.cellSize) - (bottomCursor * this.cellSize), (playerY - 2) + (downExp * this.cellSize), this.cellSize, this.cellSize));
				tempTile = new Rectangle((playerX) + (newWidth * this.cellSize) - (bottomCursor * this.cellSize), (playerY) + (downExp * this.cellSize), this.cellSize - 5, this.cellSize - 5);
				
				for (n = 0; n < this.roomSpace.length; n++) {
					if (tempTile.Intersects(this.roomSpace[n])) {
						this.wallTile.pop();
					}
				}
				bottomCursor += 1;
			}
			
			var newRoomX = (playerX - 2);
			var newRoomY = (playerY - 2) - (upExp * this.cellSize);
			var newRoomWidth = newWidth;
			var newRoomHeight = newHeight;
		}
		
		// New room stair generation
		if (stairChance == 4 && this.floorEnd == type) {
			var stairX = getRandomInt(2 , newRoomWidth - 2);
			var stairY = getRandomInt(2, newRoomHeight - 2);
			this.stairTile.push(new Rectangle(newRoomX + (stairX * this.cellSize), newRoomY + (stairY * this.cellSize), this.cellSize, this.cellSize));
		}
		if (stairChance == 4 && this.doorCount == 1) {
			var stairX = getRandomInt(2 , newRoomWidth - 2);
			var stairY = getRandomInt(2, newRoomHeight - 2);
			this.stairTile.push(new Rectangle(newRoomX + (stairX * this.cellSize), newRoomY + (stairY * this.cellSize), this.cellSize, this.cellSize));
		}
		if (stairChance == 4 && this.doorCount != 1 && this.floorEnd != type) {
			textBox.addText("You have discovered a supply room!");
			for (i = 0; i < roomItemCount + 2; i++) {
				var pickItemIndex = getRandomInt(0, (treasureItems.length - 1));
				var pickItem = treasureItems[pickItemIndex];
				var itemX = getRandomInt(2 , newRoomWidth - 2);
				var itemY = getRandomInt(2, newRoomHeight - 2);
				this.itemTile.push(new Rectangle(newRoomX + (itemX * this.cellSize), newRoomY + (itemY * this.cellSize), this.cellSize, this.cellSize));
				this.itemTile[this.itemTile.length - 1].color = treasureItems[pickItemIndex].color;
				this.itemList.push(pickItem);
			}
		}
		
		// New room door generation
		/*
		// Testing new door sides each room
		this.doorSide = getRandomInt(1, 4);
		// Top
		if (this.doorSide == 1) {
			type = "top";
		} 
		// Bottom
		else if (this.doorSide == 2) {
			type = "bottom";
		}
		// Left
		if (this.doorSide == 3) {
			type = "left";
		} 
		// Right
		else if (this.doorSide == 4) {
			type = "right";
		}
		*/
		if (stairChance != 4) {
			if (newRoomWidth <= newRoomHeight) {
				this.doorLocation = getRandomInt(2, newRoomWidth - 2);
			} else {
				this.doorLocation = getRandomInt(2, newRoomHeight - 2);
			}
			// Top
			if (type == "top") {
				this.doorTile.push(new Rectangle(newRoomX + (this.doorLocation * this.cellSize) + 1, newRoomY + 1, this.cellSize - 2 , this.cellSize - 2));
				this.doorType.push("top");
			} 
			// Bottom
			else if (type == "bottom") {
				this.doorTile.push(new Rectangle(newRoomX + (this.doorLocation * this.cellSize) + 1, newRoomY - 1 - this.cellSize  + (newRoomHeight * this.cellSize), this.cellSize - 2 , this.cellSize - 2));
				this.doorType.push("bottom");
			}
			// Left
			if (type == "left") {
				this.doorTile.push(new Rectangle(newRoomX + 1, newRoomY + (this.doorLocation * this.cellSize) + 1, this.cellSize - 2 , this.cellSize - 2));
				this.doorType.push("left");
			} 
			// Right
			else if (type == "right") {
				this.doorTile.push(new Rectangle(newRoomX + (((newRoomWidth - 1) * this.cellSize)), newRoomY + (this.doorLocation * this.cellSize) + 1, this.cellSize - 2 , this.cellSize - 2));
				this.doorType.push("right");
			}
		}
		
		// Generate floor tiles
		for (i = 0; i < newRoomWidth; i++) {
			for (j = 0; j < newRoomHeight; j++) {
				this.floorTile.push(new Rectangle(newRoomX + (i * this.cellSize), newRoomY + (j * this.cellSize), this.cellSize, this.cellSize));
				this.fogTile.push(new Rectangle(newRoomX + (i * this.cellSize), newRoomY + (j * this.cellSize), this.cellSize, this.cellSize));
			}
		}
		
		// Create roomSpace
		var newRoomTotalWidth = newRoomWidth * this.cellSize;
		var newRoomTotalHeight = newRoomHeight * this.cellSize;
		this.roomSpace.push(new Rectangle(newRoomX, newRoomY, newRoomTotalWidth, newRoomTotalHeight));
		
		// New room enemy generation
		if (this.enemyChance >= 3 && this.enemyChance <= 8) {
			// Pick and push new enemy
			var enemyTypePicker = getRandomInt(0, currentEnemies.length - 1);
			var newEnemy = currentEnemies[enemyTypePicker];
			worldEnemies.push(new Enemy(newEnemy.name, newEnemy.type, newEnemy.drop, newEnemy.level, newEnemy.exp, newEnemy.health, newEnemy.con, newEnemy.str));
			//worldEnemies[worldEnemies.length - 1].drop = newEnemy.drop;
			worldEnemies[worldEnemies.length - 1].dropChance = newEnemy.dropChance;
			worldEnemies[worldEnemies.length - 1].img = newEnemy.img;
			//worldEnemies[worldEnemies.length - 1].exp = newEnemy.exp;
			
			// Define and push rectangle
			var enemyX = getRandomInt(2 , newRoomWidth - 2);
			var enemyY = getRandomInt(2, newRoomHeight - 2);
			this.enemyTile.push(new Rectangle(newRoomX + 2 + (enemyX * this.cellSize), newRoomY + 2 + (enemyY * this.cellSize), (this.cellSize - 4), (this.cellSize - 4)));
			this.enemyTile[this.enemyTile.length - 1].color = newEnemy.color;
			worldEnemies[worldEnemies.length - 1].rect = this.enemyTile[this.enemyTile.length - 1];
		}
		
		if (this.enemyChance >= 9) {
			for (i = 0; i < 2; i++) {
				// Pick and push new enemy
				var enemyTypePicker = getRandomInt(0, currentEnemies.length - 1);
				var newEnemy = currentEnemies[enemyTypePicker];
				worldEnemies.push(new Enemy(newEnemy.name, newEnemy.type, newEnemy.drop, newEnemy.level, newEnemy.exp, newEnemy.health, newEnemy.con, newEnemy.str));
				//worldEnemies[worldEnemies.length - 1].drop = newEnemy.drop;
				worldEnemies[worldEnemies.length - 1].dropChance = newEnemy.dropChance;
				worldEnemies[worldEnemies.length - 1].img = newEnemy.img;
				//worldEnemies[worldEnemies.length - 1].exp = newEnemy.exp;
				
				// Define and push rectangle
				var enemyX = getRandomInt(2 , newRoomWidth - 2);
				var enemyY = getRandomInt(2, newRoomHeight - 2);
				this.enemyTile.push(new Rectangle(newRoomX + 2 + (enemyX * this.cellSize), newRoomY + 2 + (enemyY * this.cellSize), (this.cellSize - 4), (this.cellSize - 4)));
				this.enemyTile[this.enemyTile.length - 1].color = newEnemy.color;
				worldEnemies[worldEnemies.length - 1].rect = this.enemyTile[this.enemyTile.length - 1];
			}
		}
		
		// New room item generation
		
		for (i = 0; i < roomItemCount; i++) {
			var pickItemIndex = getRandomInt(0, (worldItems.length - 1));
			var pickItem = worldItems[pickItemIndex];
			var itemX = getRandomInt(2 , newRoomWidth - 2);
			var itemY = getRandomInt(2, newRoomHeight - 2);
			this.itemTile.push(new Rectangle(newRoomX + (itemX * this.cellSize), newRoomY + (itemY * this.cellSize), this.cellSize, this.cellSize));
			this.itemTile[this.itemTile.length - 1].color = worldItems[pickItemIndex].color;
			this.itemList.push(pickItem);
		}
		
		// Color new floor tiles
		for (i = 0; i < this.floorTile.length; i++) {
			this.floorTile[i].color = new Color(200, 200, 200, 1);
		}
		// Color new room tiles
		for (i = 0; i < this.wallTile.length; i++) {
			this.wallTile[i].color = new Color(0,0,0,1);
		}
		// Color new door tiles
		for (i = 0; i < this.doorTile.length; i++) {
			this.doorTile[i].color = new Color(150, 0, 200, 1);
		}
		// Color new stair tiles
		for (i = 0; i < this.stairTile.length; i++) {
			this.stairTile[i].color = new Color(0, 255, 0, 1);
		}
		// Color new fog tiles
		for (i = 0; i < this.fogTile.length; i++) {
			this.fogTile[i].color = new Color(128, 128, 128, 1);
		}
	}
	
	// Renders the room.
	this.Draw = function() {
		this.drawWidth = this.x;
		this.drawHeight = this.y;
		for (i = 0; i < this.floorTile.length; i++) {
			this.floorTile[i].Draw(ctx);
		}
		
		// Floor test image
		for (i = 0; i < currentRoom.floorTile.length; i++) {
			ctx.drawImage(floorSrc, currentRoom.floorTile[i].x, currentRoom.floorTile[i].y);
		}
		for (i = 0; i < currentRoom.wallTile.length; i++) {
			ctx.drawImage(wallSrc, currentRoom.wallTile[i].x, currentRoom.wallTile[i].y);
		}
		for (i = 0; i < currentRoom.stairTile.length; i++) {
			ctx.drawImage(stairSrc, currentRoom.stairTile[i].x, currentRoom.stairTile[i].y);
		}
		for (i = 0; i < currentRoom.doorTile.length; i++) {
			ctx.drawImage(doorSrc, currentRoom.doorTile[i].x - 1, currentRoom.doorTile[i].y - 1);
		}
		for (i = 0; i < currentRoom.itemTile.length; i++) {
			ctx.drawImage(itemSrc, currentRoom.itemTile[i].x, currentRoom.itemTile[i].y);
		}
		for (i = 0; i < worldEnemies.length; i++) {
			ctx.fillStyle = "white";
			ctx.font = "14px Arial";
			ctx.drawImage(worldEnemies[i].img, currentRoom.enemyTile[i].x, currentRoom.enemyTile[i].y);
			ctx.fillText(worldEnemies[i].level, currentRoom.enemyTile[i].x, currentRoom.enemyTile[i].y + 30);
			if (worldEnemies[i].prevHealth > worldEnemies[i].newHealth) {
				ctx.fillStyle = "red";
				ctx.font = "bold 16px Arial";
				ctx.fillText(worldEnemies[i].newHealth - worldEnemies[i].prevHealth, worldEnemies[i].rect.x + 8, worldEnemies[i].rect.y - 5);
			}
			
		}/*
		for (i = 0; i < this.wallTile.length; i++) {
			this.wallTile[i].Draw(ctx);
		}
		for (i = 0; i < this.stairTile.length; i++) {
			this.stairTile[i].Draw(ctx);
		}
		for (i = 0; i < this.doorTile.length; i++) {
			this.doorTile[i].Draw(ctx);
		}
		for (i = 0; i < this.itemTile.length; i++) {
			this.itemTile[i].Draw(ctx);
		}*/
		/*
		for (i = 0; i < this.enemyTile.length; i++) {
			this.enemyTile[i].Draw(ctx);
		}*/
		/*
		for (i = 0; i < this.roomSpace.length; i++) {
			this.roomSpace[i].Draw(ctx);
		}
		*/
		
		for (i = 0; i < this.fogTile.length; i++) {
			this.fogTile[i].Draw(ctx);
		}
		/*
		for (i = 0; i < this.fogTile.length; i++) {
			if (this.fogTile[i].x > -transX - 100 && this.fogTile[i].x < -transX + 800 && this.fogTile[i].y > -transY - 100 && this.fogTile[i].y < -transY + 600) {
				this.fogTile[i].Draw(ctx);
			}
		}
		*/
	}
}

// Begin Game Code
// ---------------------------------------
var gameCell = 32;
var currentRoom;

// Transform tracker for mouse recognition
var transX = 0;
var transY = 0;

// Generate a random field within a specified range
var rooms = new Array();
rooms.push(new Room(200, 150, 6, 14, gameCell));
currentRoom = rooms[0];
currentRoom.generateFloor();

// Player
var playerImg = new Image();
playerImg.src = "img/marineImg.png";

var player = new Player();
player.makePlayer(currentRoom.x + (gameCell * 4) + 2, currentRoom.y + (gameCell * 4) + 2, (gameCell - 4), (gameCell - 4));
var playerDeath = false;

// Attack Images
var meleeSrc = new Image();
meleeSrc.src = "img/meleeImg.png";
var shootSrc = new Image();
shootSrc.src = "img/shootImg.png";

// Define Attacks
var meleeAttack = new Attack("Melee");
var shootAttack = new Attack("Shoot");

// Define player classes
player.pClass = "Soldier";
if (player.pClass == "Soldier") {
	player.baseDex = 8;
	player.baseCon = 10;
	player.baseIntel = 6;
	player.baseStr = 12;
	player.abilityOne = meleeAttack;
}

// Player level required exp
var expPerLevel = [0, 50, 200, 400, 700, 1000, 2000];

// Player look toggle
var lookToggle = true;

// World Enemy Array
var worldEnemies = new Array();

// User Interface
var actionBar = new Ui(0, 0, 170, 44, "action");
actionBar.rect.color = new Color(150, 150, 150, 0.9);
actionBar.toggle = true;

var invMenu = new Ui(405, 487, 250, 142, "inv");
invMenu.rect.color = new Color(150, 150, 150, 0.9);
invMenu.toggle = true;

var textBox = new Ui(1, 487, 400, 142, "textBox");
textBox.rect.color = new Color(150, 150, 150, 0.9);
textBox.toggle = true;

var toolTipBox = new Ui(0, 0, 150, 75, "tip");
toolTipBox.rect.color = new Color(200, 200, 200, 1);

// Character Menu
var charMenu = new Ui(658, 487, 140, 150, "char");
charMenu.rect.color = new Color(150, 150, 150, 0.9);
charMenu.headRect = new Rectangle(0, 0, 0, 0);
charMenu.chestRect = new Rectangle(0, 0, 0, 0);
charMenu.gloveRect = new Rectangle(0, 0, 0, 0);
charMenu.bootRect = new Rectangle(0, 0, 0, 0);
charMenu.legRect = new Rectangle(0, 0, 0, 0);
charMenu.weaponRect = new Rectangle(0, 0, 0, 0);
charMenu.toggle = true;

// Player Status
var playerStat = new Ui(840, 20, 100, 160, "stat");
playerStat.rect.color = new Color(150, 150, 150, 0.9); 
playerStat.healthBar.width = new Rectangle(0,0,0,0);
playerStat.shieldBar.width = new Rectangle(0,0,0,0);
playerStat.expBar.width = new Rectangle(0,0,0,0);
playerStat.toggle = true;

// Controls
var lookTog = true;
var takeTog;
var clickTog = true;

// Turn tracker
var playerTurn = true;
var enemyTurn = false;
var turnCount = 0;
var prevPlayer = new Vector2;

// Floor Tracker
var floorLevel = 1;
var floorToggle = new Array;

// World Items
var worldItems = new Array;

// World Enemies
var currentEnemies = new Array;

// Items
// Weapons
var iEBlaster = new Item("E-11 Blaster", "weapon", 2, 2, 2)
iEBlaster.color = new Color(50, 50, 50, 1);
iEBlaster.minDmg = 10;
iEBlaster.maxDmg = 20;

// Armor
// Cloth
var iClothCap = new Item("Cloth Hat", "head", 0, 1, 3);
iClothCap.color = new Color(184, 124, 11, 1);

var iClothGloves = new Item("Cloth Gloves", "gloves", 2, 2, 0);
iClothGloves.color = new Color(255, 140, 0, 1);

var iClothChest = new Item("Cloth Vest", "chest", 0, 4, 0);
iClothChest.color = new Color(139, 69, 19, 1);

var iClothLegs = new Item("Cloth Trousers", "legs", 0, 2, 2);
iClothLegs.color = new Color(255, 218, 0, 1);

var iClothBoots = new Item("Cloth Boots", "boots", 0, 2, 2);
iClothBoots.color = new Color (180, 180, 180, 1);

// Iron
var iIronHelm = new Item("Iron Helm", "head", 4, 1, 2);
iIronHelm.color = new Color(184, 124, 11, 1);

var iIronGloves = new Item("Iron Gloves", "gloves", 3, 3, 0);
iIronGloves.color = new Color(255, 140, 0, 1);

var iIronChest = new Item("Iron Chestplate", "chest", 3, 4, 0);
iIronChest.color = new Color(139, 69, 19, 1);

var iIronLegs = new Item("Iron Pants", "legs", 3, 3, 2);
iIronLegs.color = new Color(255, 218, 0, 1);

var iIronBoots = new Item("Iron Boots", "boots", 4, 2, 2);
iIronBoots.color = new Color (180, 180, 180, 1);

// Consumables
var iHealthPot = new Item("Med Kit", "lowHP");
iHealthPot.color = new Color(190, 0, 0);

// Treasure Room Items
var treasureItems = [iHealthPot, iIronGloves, iIronChest, iIronLegs, iIronBoots];

// Enemy Tiles
var androidImg = new Image();
androidImg.src = "img/androidImg.png";
var mildroidImg = new Image();
mildroidImg.src = "img/mildroidImg.png";

// Enemies
var eAndroid = new Enemy("X5 Android", "android", iHealthPot, 1, 15, 20, 20, 7);
eAndroid.color = new Color(255, 0, 0, 1);
eAndroid.dropChance = 50;

var androidImg = new Image();
androidImg.src = "img/androidImg.png";
eAndroid.img = androidImg;

var eMildroid = new Enemy("I24 Military Droid", "droid", iIronHelm, 3, 20, 30, 20, 10);
eMildroid.color = new Color(125, 0, 0, 1);
eMildroid.dropChance = 50;

var mildroidImg = new Image();
mildroidImg.src = "img/mildroidImg.png";
eMildroid.img = mildroidImg;

// Create empty item to fill slots
var iEmpty = new Item("Empty", "nothing", 0, 0, 0);
iEmpty.color = new Color(100, 100, 100, 0);
player.headSlot = iEmpty;
player.chestSlot = iEmpty;
player.legSlot = iEmpty;
player.bootSlot = iEmpty;
player.gloveSlot = iEmpty;
player.weaponSlot = iEmpty;

// Images
// Tiles
var floorSrc = new Image();
floorSrc.src = "img/floorImg.png";
var wallSrc = new Image();
wallSrc.src = "img/wallImg.png";
var stairSrc = new Image();
stairSrc.src = "img/stairImg.png";
var doorSrc = new Image();
doorSrc.src = "img/doorImg.png";
var itemSrc = new Image();
itemSrc.src = "img/itemImg.png";


// Game Update Loop
function update() {
	
	// Checks to see if a stair tile is ontop of a wall tile.  If so, it cuts it out.
	for (i = 0; i < currentRoom.wallTile.length; i++) {
		for (j = 0; j < currentRoom.doorTile.length; j++) {
			if (currentRoom.wallTile[i].Intersects(currentRoom.doorTile[j])) {
				currentRoom.wallTile.RemoveAt(i);
			}
		}
	}
	
	// Handles the clearing of fog by the player
	for (i = 0; i < currentRoom.fogTile.length; i++) {
		if ((player.rect.x - 150 < currentRoom.fogTile[i].x) && (player.rect.x + 120 > currentRoom.fogTile[i].x) &&
			(player.rect.y - 150 < currentRoom.fogTile[i].y) && (player.rect.y + 120 > currentRoom.fogTile[i].y)) {
			currentRoom.fogTile.RemoveAt(i);
		}
	}
	
	// Handles the player intersection with the stairs and generation of new floors.
	for (i = 0; i < currentRoom.stairTile.length; i++) {
		if (player.rect.Intersects(currentRoom.stairTile[i])) {
			currentRoom.enemyTile.Clear();
			worldEnemies.Clear();
			rooms.push(new Room(currentRoom.stairTile[i].x - (gameCell + 1), currentRoom.stairTile[i].y - (gameCell + 1), 6, 14, gameCell))
			rooms[rooms.length - 1].generateFloor();
			currentRoom = rooms[rooms.length - 1];
			player.rect.x = (currentRoom.x + (gameCell * 4) + 2);
			player.rect.y = (currentRoom.y + (gameCell * 4) + 2);
			floorLevel += 1;
			textBox.addText("Floor " + floorLevel);
		}
	}
	
	// Handles the player intersection with doors and generation of new rooms.
	for (i = 0; i < currentRoom.doorTile.length; i ++) {
		if (player.rect.Intersects(currentRoom.doorTile[i])) {
			var sideDoor = currentRoom.doorType[i];
			currentRoom.doorTile.RemoveAt(i);
			currentRoom.doorType.RemoveAt(i);
			currentRoom.AddRoom(player.rect.x, player.rect.y, sideDoor);
		}
	}
	
	// Handles the player intersection with items.
	for (i = 0; i < currentRoom.itemTile.length; i++) {
	var tempVar = "There is a " + currentRoom.itemList[i].name + " on the ground.";
	var tempVal = textBox.contents.length - 1;
		if (player.rect.Intersects(currentRoom.itemTile[i]) && input.t == true) {
			player.inventory.push(currentRoom.itemList[i]);
			textBox.addText("You have taken a " + currentRoom.itemList[i].name + "!");
			currentRoom.itemList.RemoveAt(i);
			currentRoom.itemTile.RemoveAt(i);
		}
		else if (player.rect.Intersects(currentRoom.itemTile[i]) && textBox.contents[tempVal] != tempVar) {
			textBox.addText("There is a " + currentRoom.itemList[i].name + " on the ground.");
			lookTog = false;
		}
	}
	
	// Moves the inspector Rectangle by checking intersection with tiles - mouse offset
	// Also handles the "look" function to inspect tiles
	for (i = 0; i < currentRoom.itemTile.length; i++) {
		if (currentRoom.itemTile[i].Contains(input.mousePosition.x - transX, input.mousePosition.y - transY)) {
			player.inspectRect.x = currentRoom.itemTile[i].x;
			player.inspectRect.y = currentRoom.itemTile[i].y;
			
			if (input.l == true && lookToggle == true) {
				textBox.addText("There is a " + currentRoom.itemList[i].name + " on the ground.");
				lookToggle = false;
			}
		}
	}
	
	for (i = 0; i < currentRoom.enemyTile.length; i++) {
		if (currentRoom.enemyTile[i].Contains(input.mousePosition.x - transX, input.mousePosition.y - transY)) {
			player.inspectRect.x = currentRoom.enemyTile[i].x;
			player.inspectRect.y = currentRoom.enemyTile[i].y;
			
			if (input.l == true && lookToggle == true) {
				textBox.addText("You see a " + worldEnemies[i].name + "! - Type: " + worldEnemies[i].type + " - HP: " + worldEnemies[i].health);
				lookToggle = false;
			}
		}
	}
	
	for (i = 0; i < currentRoom.doorTile.length; i++) {
		if (currentRoom.doorTile[i].Contains(input.mousePosition.x - transX, input.mousePosition.y - transY)) {
			player.inspectRect.x = currentRoom.doorTile[i].x;
			player.inspectRect.y = currentRoom.doorTile[i].y;
			
			if (input.l == true && lookToggle == true) {
				textBox.addText("Just a door, nothing more!");
				lookToggle = false;
			}
		}
	}
	
	for (i = 0; i < currentRoom.stairTile.length; i++) {
		if (currentRoom.stairTile[i].Contains(input.mousePosition.x - transX, input.mousePosition.y - transY)) {
			player.inspectRect.x = currentRoom.stairTile[i].x;
			player.inspectRect.y = currentRoom.stairTile[i].y;
			
			if (input.l == true && lookToggle == true) {
				textBox.addText("Appears to be a one way stairwell.  Wait, what?");
				lookToggle = false;
			}
		}
	}
	
	for (i = 0; i < currentRoom.floorTile.length; i++) {
		if (currentRoom.floorTile[i].Contains(input.mousePosition.x - transX, input.mousePosition.y - transY)) {
			player.inspectRect.x = currentRoom.floorTile[i].x;
			player.inspectRect.y = currentRoom.floorTile[i].y;
			
			if (input.l == true && lookToggle == true) {
				textBox.addText("There is nothing here!");
				lookToggle = false;
			}
		}
	}
	
	// Enemy Turn
	// Handles the movement of enemies.
	var playerDCheck = new Vector2(player.rect.x + ((gameCell-4)/2), player.rect.y + ((gameCell-4))/2);
	if (playerTurn == false) {
		for (i = 0; i < worldEnemies.length; i++) {
			// Store Previous Location
			var ePrevX = worldEnemies[i].rect.x;
			var ePrevY = worldEnemies[i].rect.y;
			
			// Distance Check
			var enemyDCheck = new Vector2(worldEnemies[i].rect.x + ((gameCell-4)/2), worldEnemies[i].rect.y + ((gameCell-4)/2));
			
			// Player is spotted and enemy moves to attack
			if ((enemyDCheck.Distance(playerDCheck) <= (gameCell * 5)) && (enemyDCheck.Distance(playerDCheck) > (gameCell * 1.5))) {
				// Player directly east
				if ((enemyDCheck.x < playerDCheck.x) && (enemyDCheck.y == playerDCheck.y)) {
					worldEnemies[i].rect.x += gameCell;
				} 
				// Player directly west
				else if ((enemyDCheck.x > playerDCheck.x) && (enemyDCheck.y == playerDCheck.y)) {
					worldEnemies[i].rect.x -= gameCell;
				} 
				// Player directly north
				else if ((enemyDCheck.y > playerDCheck.y) && (enemyDCheck.x == playerDCheck.x)) {
					worldEnemies[i].rect.y -= gameCell;
				} 
				// Player directly south
				else if (enemyDCheck.y < playerDCheck.y && (enemyDCheck.x == playerDCheck.x)) {
					worldEnemies[i].rect.y += gameCell;
				} 
				// Diagonal movement
				// Player is north west
				else if ((enemyDCheck.x > playerDCheck.x) && (enemyDCheck.y > playerDCheck.y)) {
					var tempMovePick = getRandomInt(1, 2);
					if (tempMovePick == 1) {
						worldEnemies[i].rect.x -= gameCell;
					} else {
						worldEnemies[i].rect.y -= gameCell;
					}
				} 
				// Player is north east
				else if ((enemyDCheck.x < playerDCheck.x) && (enemyDCheck.y > playerDCheck.y)) {
					var tempMovePick = getRandomInt(1, 2);
					if (tempMovePick == 1) {
						worldEnemies[i].rect.x += gameCell;
					} else {
						worldEnemies[i].rect.y -= gameCell;
					}
				} 
				// Player is south west
				else if ((enemyDCheck.x > playerDCheck.x) && (enemyDCheck.y < playerDCheck.y)) {
					var tempMovePick = getRandomInt(1, 2);
					if (tempMovePick == 1) {
						worldEnemies[i].rect.x -= gameCell;
					} else {
						worldEnemies[i].rect.y += gameCell;
					}
				} 
				// Player is south east
				else if ((enemyDCheck.x < playerDCheck.x) && (enemyDCheck.y < playerDCheck.y)) {
					var tempMovePick = getRandomInt(1, 2);
					if (tempMovePick == 1) {
						worldEnemies[i].rect.x += gameCell;
					} else {
						worldEnemies[i].rect.y += gameCell;
					}
				} 
			} 
			// Idle enemy movement since player is outside of sight range
			else if (enemyDCheck.Distance(playerDCheck) >= (gameCell * 5)) {
				var tempDirection = getRandomInt(1, 4);
				if (tempDirection == 1) {
					worldEnemies[i].rect.x += gameCell;
				} else if (tempDirection == 2) {
					worldEnemies[i].rect.x -= gameCell;
				} else if (tempDirection == 3) {
					worldEnemies[i].rect.y += gameCell;
				} else if (tempDirection == 4) {
					worldEnemies[i].rect.y -= gameCell;
				}
				
				// Wall collision.
				for (j = 0; j < currentRoom.wallTile.length; j++) {
					if (worldEnemies[i].rect.Intersects(currentRoom.wallTile[j])) {
						worldEnemies[i].rect.x = ePrevX;
						worldEnemies[i].rect.y = ePrevY;
					}
				}
				// Door collision
				for (j = 0; j < currentRoom.doorTile.length; j++) {
					if (worldEnemies[i].rect.Intersects(currentRoom.doorTile[j])) {
						worldEnemies[i].rect.x = ePrevX;
						worldEnemies[i].rect.y = ePrevY;
					}
				}
			}
			// Player is within attack range
			else if (enemyDCheck.Distance(playerDCheck) <= gameCell * 1.5) {
				var enemyAttack = getRandomInt(Math.round(worldEnemies[i].str/2), worldEnemies[i].str);
				player.prevHealth = player.health;
				player.health -= enemyAttack;
				player.newHealth = player.health;
				textBox.addText(worldEnemies[i].name + " hits your for " + enemyAttack + " damage.");
			}
		}
		playerTurn = true;
	}
	
	// Player Turn
	// Handles the collision with walls and player Movement
	if (playerTurn == true && playerDeath == false) {
		prevPlayer.x = player.rect.x;
		prevPlayer.y = player.rect.y;
		player.Move();
		for (i = 0; i < currentRoom.wallTile.length; i++) {
			if (player.rect.Intersects(currentRoom.wallTile[i])) {
				turnCount -= 1;
				player.rect.x = prevPlayer.x;
				player.rect.y = prevPlayer.y;
				player.Move();
			}
		}
		
		// Interaction with Action Bar - Activate attack
		// Ability One:
		if (actionBar.abOneRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
			player.abilityOne.toggle = true;
		} else if (input.z == true) {
			player.abilityOne.toggle = true;
		}
		
		if (actionBar.abTwoRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true && player.abilityTwo != null) {
			player.abilityTwo.toggle = true;
		} else if (input.x == true && player.abilityTwo != null) {
			player.abilityTwo.toggle = true;
		}
		
		// Cancel attack by moving
		if (input.w == true || input.a == true || input.s == true || input.d == true) {
			player.abilityOne.toggle = false;
			if (player.abilityTwo != null) {
				player.abilityTwo.toggle = false;
			}
		}
		
		// Player attacks:
		// Player attack with abilityOne
		if (player.abilityOne != null) {
			for (i = 0; i < worldEnemies.length; i++) {
				if (player.abilityOne.attackRect.Contains(worldEnemies[i].rect.x + transX, worldEnemies[i].rect.y + transY) && 
					player.inspectRect.Intersects(worldEnemies[i].rect) && 
					input.mouseIsDown == true && clickTog == true && player.mana >= player.abilityOne.shieldCost) {
					worldEnemies[i].prevHealth = worldEnemies[i].health;
					player.abilityOne.Atk(worldEnemies[i]);
					worldEnemies[i].newHealth = worldEnemies[i].health;
					playerTurn = false;
					clickTog = false;
					player.abilityOne.toggle = false;
				} else if (player.abilityOne.attackRect.Contains(worldEnemies[i].rect.x + transX, worldEnemies[i].rect.y + transY) && 
					player.inspectRect.Intersects(worldEnemies[i].rect) && 
					input.mouseIsDown == true && clickTog == true && player.mana < player.abilityOne.shieldCost) {
					textBox.addText("Not enough energy!");
				}
			}
		}
		
		// Player attack with abilityTwo
		if (player.abilityTwo != null) {
			for (i = 0; i < worldEnemies.length; i++) {
				if (player.abilityTwo.attackRect.Contains(worldEnemies[i].rect.x + transX, worldEnemies[i].rect.y + transY) && 
					player.inspectRect.Intersects(worldEnemies[i].rect) && 
					input.mouseIsDown == true && clickTog == true && player.mana >= player.abilityTwo.shieldCost) {
					player.abilityTwo.Atk(worldEnemies[i]);
					playerTurn = false;
					clickTog = false;
					player.abilityTwo.toggle = false;
				} else if (player.abilityTwo.attackRect.Contains(worldEnemies[i].rect.x + transX, worldEnemies[i].rect.y + transY) && 
					player.inspectRect.Intersects(worldEnemies[i].rect) && 
					input.mouseIsDown == true && clickTog == true && player.mana < player.abilityTwo.shieldCost) {
					textBox.addText("Not enough energy!");
				}
			}
		}
		
	}
	
	// Check for player or enemy death
	for (i = 0; i < worldEnemies.length; i++) {
		if (worldEnemies[i].health <= 0) {
			player.newHealth = player.prevHealth;
			textBox.addText(worldEnemies[i].name + " dies!");
			var dropRoll = getRandomInt(1, 100);
			if (worldEnemies[i].dropChance >= dropRoll) { 
				player.inventory.push(worldEnemies[i].drop);
				textBox.addText("You collect a " + worldEnemies[i].drop.name);
			}
			player.exp += worldEnemies[i].exp;
			worldEnemies.RemoveAt(i);
			currentRoom.enemyTile.RemoveAt(i);
		}
		if (player.health <= 0) {
			textBox.addText("You have died!  Reload the page to try again!");
			playerDeath = true;
		}
	}
	
	// Player Class abilities:
	if (player.pClass == "Soldier" && player.weaponSlot != iEmpty) {
		player.abilityTwo = shootAttack;
	}
	
	// User Interface Controls
	// Inventory Click Equip
	for (i = 0; i < invMenu.invDisp.length; i++) {
		if (invMenu.invDisp[i].rect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true && clickTog == true) {
			if (invMenu.invDisp[i].type == "chest") {
				player.chestSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "legs") {
				player.legSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "gloves") {
				player.gloveSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "head") {
				player.headSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "boots") {
				player.bootSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "weapon") {
				player.weaponSlot = invMenu.invDisp[i];
			} else if (invMenu.invDisp[i].type == "lowHP") {
				player.health += 20;
				invMenu.invDisp.RemoveAt(i);
				player.inventory.Remove(iHealthPot);
			}
			clickTog = false;
		}
	}
	
	// Character Click Unequip
	if (charMenu.chestRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
		player.chestSlot = iEmpty;
	}
	if (charMenu.headRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
		player.headSlot = iEmpty;
	}
	if (charMenu.legRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
		player.legSlot = iEmpty;
	}
	if (charMenu.gloveRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
		player.gloveSlot = iEmpty;
	}
	if (charMenu.bootRect.Contains(input.mousePosition.x, input.mousePosition.y) && input.mouseIsDown == true) {
		player.bootSlot = iEmpty;
	}
	
	// Tooltip toggle
	toolTipBox.toggle = false;
	// Inventory:
	for (i = 0; i < invMenu.invDisp.length; i++) {
		if (invMenu.invDisp[i].rect.Contains(input.mousePosition.x, input.mousePosition.y)) {
			toolTipBox.toggle = true;
		}
	}
	
	// Character Pane:
	if (charMenu.chestRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	if (charMenu.headRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	if (charMenu.legRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	if (charMenu.gloveRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	if (charMenu.bootRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	if (charMenu.weaponRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.toggle = true;
	}
	
	// Tooltip Location:
	toolTipBox.rect.x = input.mousePosition.x;
	toolTipBox.rect.y = input.mousePosition.y - 75;
	
	// Action Bar:
	if (actionBar.abOneRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.rect.x = input.mousePosition.x + 10;
		toolTipBox.rect.y = input.mousePosition.y + 10;
		toolTipBox.toggle = true;
	} else if (actionBar.abTwoRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.rect.x = input.mousePosition.x + 10;
		toolTipBox.rect.y = input.mousePosition.y + 10;
		toolTipBox.toggle = true;
	} else if (actionBar.abThreeRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.rect.x = input.mousePosition.x + 10;
		toolTipBox.rect.y = input.mousePosition.y + 10;
		toolTipBox.toggle = true;
	} else if (actionBar.abFourRect.Contains(input.mousePosition.x, input.mousePosition.y)) {
		toolTipBox.rect.x = input.mousePosition.x + 10;
		toolTipBox.rect.y = input.mousePosition.y + 10;
		toolTipBox.toggle = true;
	}
	
	// Action Bar Toggle
	if (input.b == true && actionBar.toggle == false && actionBar.inputRelease == true) {
		actionBar.toggle = true;
		actionBar.inputRelease = false;
	}
	else if (input.b == true && actionBar.toggle == true && actionBar.inputRelease == true) {
		actionBar.toggle = false;
		actionBar.inputRelease = false;
	}
	if (input.b == false) {
		actionBar.inputRelease = true;
	}
	
	// Inventory Toggle
	if (input.i == true && invMenu.toggle == false && invMenu.inputRelease == true) {
		invMenu.toggle = true;
		invMenu.inputRelease = false;
	}
	else if (input.i == true && invMenu.toggle == true && invMenu.inputRelease == true) {
		invMenu.toggle = false;
		invMenu.inputRelease = false;
	}
	if (input.i == false) {
		invMenu.inputRelease = true;
	}
	
	// Character Toggle
	if (input.c == true && charMenu.toggle == false && charMenu.inputRelease == true) {
		charMenu.toggle = true;
		charMenu.inputRelease = false;
	}
	else if (input.c == true && charMenu.toggle == true && charMenu.inputRelease == true) {
		charMenu.toggle = false;
		charMenu.inputRelease = false;
	}
	if (input.c == false) {
		charMenu.inputRelease = true;
	}
	
	// Action Toggles
	if (input.l == false) {
		lookToggle = true;
	}
	
	if (input.mouseIsDown == false) {
		clickTog = true;
	}
	
	// Item List:
	if (floorLevel == 1) {
		worldItems = [iClothChest, iClothLegs];
	} 
	else if (floorLevel == 2) {
		worldItems = [iClothLegs, iClothGloves, iClothCap, iEBlaster];
	}
	else {
		worldItems = [iClothChest, iClothLegs, iClothGloves, iClothBoots, iClothCap, iEBlaster];
	}
	
	// Enemy List:
	if (floorLevel <= 1) {
		currentEnemies = [eAndroid];
	} else if (floorLevel >= 2) {
		currentEnemies = [eAndroid, eMildroid];
	}
	
	// Updating attackRect
	// Ability Slot One
	if (player.abilityOne.toggle == true) {
		// Disable other toggles
		if (player.abilityTwo != null) {
			player.abilityTwo.toggle = false;
		}
		//player.abilityThree.toggle = false;
		//player.abilityFour.toggle = false;
	
		if (player.abilityOne.name == "Melee") {
			player.abilityOne.attackRect.x = player.rect.x - gameCell - 2 + transX;
			player.abilityOne.attackRect.y = player.rect.y - gameCell - 2 + transY;
		} else if (player.abilityOne.name == "Shoot") {
			player.abilityOne.attackRect.x = player.rect.x - (gameCell * 4) - 2 + transX;
			player.abilityOne.attackRect.y = player.rect.y - (gameCell * 4) - 2 + transY;
		}
	} else {
		player.abilityOne.attackRect.x = 1000;
	}
	// Ability Slot Two
	if (player.abilityTwo != null) {
		if (player.abilityTwo.toggle == true) {
			// Disable other toggles
			player.abilityOne.toggle = false;
			//player.abilityThree.toggle = false;
			//player.abilityFour.toggle = false;
			
			if (player.abilityTwo.name == "Melee") {
				player.abilityTwo.attackRect.x = player.rect.x - gameCell - 2 + transX;
				player.abilityTwo.attackRect.y = player.rect.y - gameCell - 2 + transY;
			} else if (player.abilityTwo.name == "Shoot") {
				player.abilityTwo.attackRect.x = player.rect.x - (gameCell * 4) - 2 + transX;
				player.abilityTwo.attackRect.y = player.rect.y - (gameCell * 4) - 2 + transY;
			}
		} else {
			player.abilityTwo.attackRect.x = 1000;
		}
	}
	// Update player stats
	if (player.exp >= expPerLevel[player.level]) {
		player.level += 1;
		textBox.addText("Ding! " + " Level " + player.level);
		textBox.addText("Strength + " + player.level);
		textBox.addText("Constitution + " + player.level);
		player.baseStr += player.level;
		player.baseCon += player.level;
	}
	
	player.con = player.baseCon + player.chestSlot.con + player.legSlot.con + player.gloveSlot.con + player.headSlot.con + player.bootSlot.con + player.weaponSlot.con;
	player.intel = player.baseIntel + player.chestSlot.intel + player.legSlot.intel + player.gloveSlot.intel + player.headSlot.intel + player.bootSlot.intel + player.weaponSlot.intel;
	player.str = player.baseStr + player.chestSlot.str + player.legSlot.str + player.gloveSlot.str + player.headSlot.str + player.bootSlot.str + player.weaponSlot.intel;
	
	player.maxHealth = player.con * 10;
	if (player.health > player.maxHealth) {
		player.health = player.maxHealth;
	}
	
	player.maxMana = player.intel * 10;
	if (player.mana > player.maxMana) {
		player.mana = player.maxMana;
	}
	
	// Update Health, Mana, and Exp Bars 
	playerStat.healthBar.width = (player.health/player.maxHealth) * 100; 
	playerStat.shieldBar.width = (player.mana/player.maxMana) * 100;
	playerStat.expBar.width = (player.exp/expPerLevel[player.level]) * 100;
	
	// Update player abilities with new damage levels
	player.abilityOne.Update();
	if (player.abilityTwo != null) {
		player.abilityTwo.Update();
	}
}

function draw() {
	// Clear ctx canvas
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
	
	// Drawing to the ctx canvas
	ctx.fillStyle = "grey";
	ctx.fillRect(-10000, -10000, 20000, 20000);
	currentRoom.Draw();
	
	player.Draw(ctx);
	
	// Clear ctxUi canvas
	ctxUi.clearRect(0, 0, canvasUi.width, canvasUi.height);
	
	// Drawing to the ctxUi canvas
	actionBar.Draw();
	invMenu.Draw();
	textBox.Draw();
	charMenu.Draw();
	playerStat.Draw();
	player.inspectRect.Draw(ctx);
	player.abilityOne.Draw();
	if (player.abilityTwo != null) {
		player.abilityTwo.Draw();
	}
	
	// Temp turn display
	ctxUi.font = "13px Arial";
	ctxUi.fillStyle = "black";
	ctxUi.fillText("Floor: " + floorLevel, 868, 15);

	// ctxUi Tooltips
	toolTipBox.Draw();
}
/*
for (i = 0; i < 10; i++) {
	textBox.addText("Testing!");
}
*/

requestAnimationFrame(animate);    // Start the animation