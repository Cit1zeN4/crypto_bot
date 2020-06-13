import { expect } from "chai";
import { addArray } from "../script";
import "mocha";

describe("IBot", () => {
  describe("Add array or single object test", () => {
    it("Add array test", () => {
      const arr: number[] = [];
      addArray([1, 2, 3], (item) => {
        arr.push(item);
      });
      expect(arr).to.eql([1, 2, 3]);
    });
    it("Add single object test", () => {
      let numb: number = 0;
      addArray(5, (item) => {
        numb = item;
      });
      expect(numb).to.equal(5);
    });
  });
});
