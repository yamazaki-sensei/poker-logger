import type { StackSize } from "~/types";

export const stackSizeToText = (stackSize: StackSize): string => {
  switch (stackSize) {
    case "S":
      return "10BB以下";
    case "M":
      return "10BB - 20BB";
    case "L":
      return "20BB - 30BB";
    case "LL":
      return "30BB - 50BB";
    case "LLL":
      return "50BB - 100BB";
    case "LLLL":
      return "50BB以上";
  }
};
