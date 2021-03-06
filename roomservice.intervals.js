module.exports = class Intervals {
    constructor() {
        this.buildSimpleStructure = new Interval(20);
        this.buildComplexStructure = new Interval(100);
        this.buildStores = new Interval(20);
    }
}

class Interval {
    constructor(period) {
        this.period = period;
        this.age = Game.time % this.period;
    }

    isActive() {
        return this.age === 0;
    }

    isActiveIn(ticks) {
        // wrap high tick length into the length of a period
        let leadTime = ticks % this.period;

        return this.age === (this.period - leadTime) % this.period;
    }
}

const profiler = require("screeps-profiler");
profiler.registerClass(Interval, 'Intervals.Interval');
profiler.registerClass(module.exports, 'Intervals');
