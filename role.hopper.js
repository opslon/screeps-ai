const movement = require("helper.movement");

// Hop into a room to take some damage, but go out before it is too late
// Goal is to drain energy out of the room using hostile towers
module.exports = {
    name: "hopper",
    configs: [
        [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    ],
    run: function(creep) {
        let targetName = creep.memory.room;
        if(creep.room.name !== targetName) {
            if(creep.hits == creep.hitsMax) {
                movement.moveToRoom(creep, targetName);
            } else {
                movement.leaveExit(creep);
            }
        } else {
            let damageTaken = creep.memory.lastHits - creep.hits;
            if(creep.hits <= damageTaken * 3) {
                this.moveOut(creep);
            } else {
                movement.leaveExit(creep);
            }
        }
        creep.memory.lastHits = creep.hits;
    },
    moveOut: function(creep) {
        if(creep.pos.x == 1) {
            creep.move(LEFT);
        } else if(creep.pos.x == 48) {
            creep.move(RIGHT);
        } else if(creep.pos.y == 1) {
            creep.move(TOP);
        } else if(creep.pos.y == 48) {
            creep.move(BOTTOM);
        } else {
            // creep somehow got deeper than expected
            creep.move(creep.pos.getDirectionTo(creep.pos.findClosestByRange(FIND_EXIT)));
        }
    }
};