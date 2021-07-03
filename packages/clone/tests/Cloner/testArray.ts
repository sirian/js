import {TestCloner} from "../TestCloner";

TestCloner.multiTest([]);
TestCloner.multiTest([1, 2, 3]);
TestCloner.multiTest(Array.from({length: 10}));
TestCloner.multiTest([{x: 1}, 42]);
