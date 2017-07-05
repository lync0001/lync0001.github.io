var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = (function () {
    function Game(output, input) {
        this.items = [];
        this.charInv = [];
        this.steps = 15;
        this.parser = new Parser(this, input);
        this.out = new Printer(output);
        this.isOn = true;
        this.createItems();
        this.createRooms();
        this.printWelcome();
    }
    Game.prototype.createRooms = function () {
        var home = new Room(" in your home");
        var mainroad = new Room(" on the main road of your town, Prigorodki");
        var library = new Room(" in the Prigorodki library");
        var field = new Room(" in the corn field behind your house");
        var woods = new Room(" in the woods behind your home town");
        var entrance = new Room(" at the outter entrance of the bunker");
        var hallway = new Room(" in the main hallway of the bunker");
        var bedroom1 = new Room(" in a bedroom with a few bunk beds");
        var bedroom2 = new Room(" in a bedroom with a few bunk beds and a chest");
        var controlroom = new Room(" in a room with a lot of buttons and monitors");
        controlroom.setId(1);
        home.setExits(null, null, null, mainroad);
        mainroad.setExits(library, home, field, null);
        library.setExits(null, null, mainroad, null);
        field.setExits(mainroad, null, woods, null);
        woods.setExits(field, null, entrance, null);
        entrance.setExits(woods, null, hallway, null);
        hallway.setExits(entrance, controlroom, bedroom1, bedroom2);
        bedroom1.setExits(hallway, null, null, null);
        bedroom2.setExits(null, hallway, null, null);
        controlroom.setExits(null, null, null, hallway);
        mainroad.setInventory(this.items[0]);
        library.setInventory(this.items[1]);
        this.currentRoom = home;
    };
    Game.prototype.createItems = function () {
        this.items.push(new Phone("Your oldschool red rotary phone", "Phone"));
        this.items.push(new Chip("A plastic card with a chip in it", "Bunker override chip "));
    };
    Game.prototype.printWelcome = function () {
        this.out.println();
        this.out.println("Welcome to your home town, Arstotzka.");
        this.out.println();
        this.out.println("Arstotzka is on the brink of a nuclear war...");
        this.out.println("Only you know of this, and it is up to you to");
        this.out.println("open the bunker and get into it, first.");
        this.out.println();
        this.out.println("You are currently" + this.currentRoom.description);
        this.out.print("Exits: ");
        if (this.currentRoom.northExit != null) {
            this.out.print("north ");
        }
        if (this.currentRoom.eastExit != null) {
            this.out.print("east ");
        }
        if (this.currentRoom.southExit != null) {
            this.out.print("south ");
        }
        if (this.currentRoom.westExit != null) {
            this.out.print("west ");
        }
        this.out.println();
        this.out.print(">");
    };
    Game.prototype.gameOver = function () {
        this.isOn = false;
        this.out.println("Hit F5 to restart the game");
    };
    Game.prototype.printError = function (params) {
        this.out.println("I don't know what you mean...");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help pickup use");
        return false;
    };
    Game.prototype.printHelp = function (params) {
        if (params.length > 0) {
            this.out.println("Help what?");
            return false;
        }
        this.out.println("You must find a way into the bunker,");
        this.out.println("before it's too late.");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help");
        return false;
    };
    Game.prototype.goRoom = function (params) {
        debugger;
        if (params.length == 0) {
            this.out.println("Go where?");
            return;
        }
        var direction = params[0];
        var nextRoom = null;
        switch (direction) {
            case "north":
                nextRoom = this.currentRoom.northExit;
                break;
            case "east":
                nextRoom = this.currentRoom.eastExit;
                break;
            case "south":
                nextRoom = this.currentRoom.southExit;
                break;
            case "west":
                nextRoom = this.currentRoom.westExit;
                break;
        }
        if (nextRoom == null) {
            this.out.println("There is no way to get through there");
        }
        else {
            this.steps -= 1;
            this.out.println("Steps left till nuclear strike: " + String(this.steps));
            if (this.steps == 0) {
                this.out.println("The nuclear strike succeeded to launch. Game over.");
                return true;
            }
            this.currentRoom = nextRoom;
            this.out.println("You are " + this.currentRoom.description);
            if (this.currentRoom.inventory[0] != null) {
                this.out.println(String("Item in this room: " + this.currentRoom.inventory[0].name));
            }
            ;
            this.out.print("Exits: ");
            if (this.currentRoom.northExit != null) {
                this.out.print("north ");
            }
            if (this.currentRoom.eastExit != null) {
                this.out.print("east ");
            }
            if (this.currentRoom.southExit != null) {
                this.out.print("south ");
            }
            if (this.currentRoom.westExit != null) {
                this.out.print("west ");
            }
            this.out.println();
        }
        return false;
    };
    Game.prototype.pickUp = function (params) {
        var item = this.currentRoom.inventory[0];
        if (item != null) {
            if (item.name == "Phone") {
                this.out.println("You pick up: " + item.name);
                this.out.println("You hear someone talking on the other side....");
                this.out.println("'I lost the override key in de library, shit!' ");
                this.out.println("'Shit dude, if that gets in the wrong hands someone can stop our master plan' ");
                this.currentRoom.inventory = null;
            }
            else {
                this.charInv.push(item);
                this.out.println("You pick up: " + item.name);
                this.currentRoom.inventory = null;
            }
            return false;
        }
        else {
            this.out.println("No item in this room or already picked up.");
        }
    };
    Game.prototype.useItem = function (params) {
        for (var i = 0; i < this.charInv.length; i++) {
            if (this.currentRoom.getId() == 1 && this.charInv[i].name == "Bunker override chip ") {
                this.out.println("You use your override chip to stop the countdown of the nuclear missle. Well done!");
                return true;
            }
        }
        {
            this.out.println("You dont have an item yet, or you're not in the right place to use it.");
            return false;
        }
    };
    Game.prototype.quit = function (params) {
        if (params.length > 0) {
            this.out.println("Quit what?");
            return false;
        }
        else {
            return true;
        }
    };
    return Game;
}());
var Item = (function () {
    function Item(description, name) {
        this.description = description;
        this.name = name;
    }
    return Item;
}());
var Parser = (function () {
    function Parser(game, input) {
        var _this = this;
        this.game = game;
        this.input = input;
        input.onkeyup = function (e) {
            if (e.keyCode == 13 && _this.game.isOn) {
                var command = _this.input.value;
                _this.game.out.println(command);
                _this.parse(command.split(" "));
                _this.input.value = "";
                _this.game.out.print(">");
            }
        };
    }
    Parser.prototype.parse = function (words) {
        var wantToQuit = false;
        var params = words.slice(1);
        switch (words[0]) {
            case "":
                break;
            case "help":
                wantToQuit = this.game.printHelp(params);
                break;
            case "go":
                wantToQuit = this.game.goRoom(params);
                break;
            case "pickup":
                wantToQuit = this.game.pickUp(params);
                break;
            case "use":
                wantToQuit = this.game.useItem(params);
                break;
            case "quit":
                wantToQuit = this.game.quit(params);
                break;
            default:
                wantToQuit = this.game.printError(params);
        }
        if (wantToQuit) {
            this.input.disabled = true;
            this.game.gameOver();
        }
    };
    return Parser;
}());
var Phone = (function (_super) {
    __extends(Phone, _super);
    function Phone(description, name) {
        return _super.call(this, description, name) || this;
    }
    return Phone;
}(Item));
var Printer = (function () {
    function Printer(output) {
        this.output = output;
    }
    Printer.prototype.print = function (text) {
        this.output.innerHTML += text;
    };
    Printer.prototype.println = function (text) {
        if (text === void 0) { text = ""; }
        this.print(text + "<br/>");
        this.output.scrollTop = this.output.scrollHeight;
    };
    return Printer;
}());
var Room = (function () {
    function Room(description) {
        this.inventory = [];
        this.description = description;
    }
    Room.prototype.setExits = function (north, east, south, west) {
        if (north != null) {
            this.northExit = north;
        }
        if (east != null) {
            this.eastExit = east;
        }
        if (south != null) {
            this.southExit = south;
        }
        if (west != null) {
            this.westExit = west;
        }
    };
    Room.prototype.setInventory = function (item) {
        this.inventory[0] = item;
    };
    Room.prototype.setId = function (id) {
        this.id = id;
    };
    Room.prototype.getId = function () {
        return this.id;
    };
    return Room;
}());
var Chip = (function (_super) {
    __extends(Chip, _super);
    function Chip(description, name) {
        return _super.call(this, description, name) || this;
    }
    return Chip;
}(Item));
