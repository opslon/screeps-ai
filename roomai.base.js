var constructions = [
    require("construction.extensions"),
    require("construction.extractor"),
    require("construction.ramparts"),
    require("construction.roads")
];

var aspects = [
    require("roomaspect.minerals")
];

var spawnRoomService = require("spawn.roomService");
var spawnClaimGroup = require("spawn.claimGroup");
var structureTower = require("structure.tower");
var structureTerminal = require("structure.terminal");

module.exports = function(room) {
    var spawns = room.find(FIND_MY_SPAWNS);
    var availableSpawns = _.filter(spawns, (s) => !s.spawning);
    
    return {
        room: room,
        run: function() {
            for(var spawn of spawns) {
                var spawning = spawnRoomService.perform(spawn);
                if(!spawning && spawn.name == "Root") {
                    spawnClaimGroup.perform(spawn);
                }
            }
            
            for(var aspect of aspects) {
                aspect(this).run();
            }
            
            for(var tower of room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER })) {
                structureTower.run(tower);
            }
            
            if(room.terminal) {
                structureTerminal(room.terminal).run();
            }
            
            for(var construction of constructions) {
                construction.perform(room);
            }
        },
        spawn: function(parts, memory) {
            var spawn = availableSpawns[0];
            if(!spawn) {
                return false;
            }
            
            var result = spawn.createCreep(parts, undefined, memory);
            if(_.isString(result)) {
                availableSpawns.shift();
            }
            
            return result;
        },
        canSpawn: function() {
            return availableSpawns.length > 0;
        }
    };
};