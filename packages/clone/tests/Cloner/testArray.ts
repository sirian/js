import {TestCloner} from "../TestCloner";

TestCloner.multiTest([]);
TestCloner.multiTest([1, 2, 3]);
TestCloner.multiTest(new Array(10));
TestCloner.multiTest([{x: 1}, 42]);
