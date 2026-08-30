import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateHydration,
} from "./calculator";

describe(
  "calculateHydration",
  () => {
    it("calculates a base target from weight", () => {
      const result =
        calculateHydration({
          weightKg: 70,
          activityLevel:
            "low",
          exerciseMinutes: 0,
        });

      expect(
        result.baseTargetMl,
      ).toBe(2450);
    });

    it("adds moderate activity", () => {
      const result =
        calculateHydration({
          weightKg: 70,
          activityLevel:
            "moderate",
          exerciseMinutes: 0,
        });

      expect(
        result.recommendedTargetMl,
      ).toBe(2700);
    });

    it("adds exercise adjustment", () => {
      const result =
        calculateHydration({
          weightKg: 70,
          activityLevel:
            "moderate",
          exerciseMinutes: 60,
        });

      expect(
        result.recommendedTargetMl,
      ).toBe(3200);
    });
  },
);