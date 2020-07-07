import { expect } from "chai";
import { addArray } from "../script";
import "mocha";

// DELETE

describe("IBot", () => {
  describe("<addArray> Add array or single object test", () => {
    it("Add array test", () => {
      const arr: number[] = [];
      addArray([1, 2, 3], (item) => {
        arr.push(item);
      });
      expect(arr).to.eql([1, 2, 3]);
    });

    it("Add single object test", () => {
      const arr: number[] = [1, 2, 3, 4];
      addArray(5, (item) => {
        arr.push(item);
      });
      expect(arr).to.eql([1, 2, 3, 4, 5]);
    });
  });
});
