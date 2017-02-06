var storeStructures = [
    STRUCTURE_CONTAINER, 
    STRUCTURE_LINK,
    STRUCTURE_STORAGE,
    STRUCTURE_TERMINAL
];

module.exports = {
    obtainResults: {
        withdrawn: 0,
        harvested: 1,
        moving: 2,
        pickedUp: 3
    },
    obtainEnergy: function(creep, source, considerStorage) {
        this.pickupSpareEnergy(creep);
        
        if(considerStorage) {
            var result = this.obtainEnergyFromStore(creep, creep.room.storage);
            if(result) {
                return result;
            }
        }
        
        if(!source) return null;
        
        var store = this.storeFor(source);
        var result = this.obtainEnergyFromStore(creep, store);
        if(result) {
            return result;
        } else {
            result = creep.harvest(source);
            if(result == OK) {
                return this.obtainResults.harvested;
            } else if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                return this.obtainResults.moving;
            }
        }
        return null; // something unexpected happened
    },
    obtainEnergyFromStore: function(creep, store) {
        if(store && store.store.energy > 0) {
            var result = creep.withdraw(store, RESOURCE_ENERGY);
            if(result == OK) {
                return this.obtainResults.withdrawn;
            } else if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(store);
                return this.obtainResults.moving;
            }
        }
        
        return null;
    },
    pickupSpareEnergy: function(creep) {
        var resources = creep.pos.lookFor(LOOK_ENERGY);
        if(resources.length > 0) {
            creep.pickup(resources[0]);
        }
    },
    storeFor: function(target, includeConstructions) {
        if(target && storeStructures.includes(target.structureType)) return target;
        
        if(!includeConstructions) {
            var stores = target.room.memory.stores;
            if(stores) {
                var store = Game.getObjectById(stores[target.id]);
                if(store) return store;
            }
        }
        
        var structures = target.pos.findInRange(FIND_STRUCTURES, 2);
        var store = _.find(structures, (r) => storeStructures.includes(r.structureType));
        if(store) {
            target.room.memory.stores = target.room.memory.stores || {};
            target.room.memory.stores[target.id] = store.id;
            return store;
        }
        
        if(includeConstructions) {
            var constructions = target.pos.findInRange(FIND_CONSTRUCTION_SITES, 2);
            return _.find(constructions, (r) => storeStructures.includes(r.structureType));
        } else {
            return null;
        }
    },
    distanceByPath: function(source, destination) {
        if(Memory.distances && Memory.distances[source.id] && Memory.distances[source.id][destination.id]) {
            return Memory.distances[source.id][destination.id];
        }
        
        var path = source.pos.findPathTo(destination, { ignoreCreeps: true, ignoreRoads: true });
        Memory.distances = Memory.distances || {};
        Memory.distances[source.id] = Memory.distances[source.id] || {};
        Memory.distances[source.id][destination.id] = path.length;
        return path.length;
    }
};