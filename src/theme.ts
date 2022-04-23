type ColorValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type ColorValues = {
  [key in ColorValue]: string;
};

export const green: ColorValues = {
  0: "hsl(98, 28%, 15%)",
  1: "hsl(98, 30%, 20%)",
  2: "hsl(98, 35%, 30%)",
  3: "hsl(98, 40%, 40%)",
  4: "hsl(98, 50%, 50%)",
  5: "hsl(98, 70%, 60%)",
  6: "hsl(98, 100%, 70%)",
};

export const yellow: ColorValues = {
  0: "hsl(60, 28%, 15%)",
  1: "hsl(60, 30%, 20%)",
  2: "hsl(60, 35%, 30%)",
  3: "hsl(60, 40%, 40%)",
  4: "hsl(60, 50%, 50%)",
  5: "hsl(60, 70%, 60%)",
  6: "hsl(60, 100%, 70%)",
};

export const blue: ColorValues = {
  0: "hsl(200, 28%, 15%)",
  1: "hsl(200, 30%, 20%)",
  2: "hsl(200, 35%, 30%)",
  3: "hsl(200, 40%, 40%)",
  4: "hsl(200, 50%, 50%)",
  5: "hsl(200, 70%, 60%)",
  6: "hsl(200, 100%, 70%)",
};

export const red: ColorValues = {
  0: "hsl(3, 28%, 15%)",
  1: "hsl(3, 30%, 20%)",
  2: "hsl(3, 35%, 30%)",
  3: "hsl(3, 40%, 40%)",
  4: "hsl(3, 50%, 50%)",
  5: "hsl(3, 70%, 60%)",
  6: "hsl(3, 100%, 70%)",
};

export const purple: ColorValues = {
  0: "hsl(270, 28%, 15%)",
  1: "hsl(270, 30%, 20%)",
  2: "hsl(270, 35%, 30%)",
  3: "hsl(270, 40%, 40%)",
  4: "hsl(270, 50%, 50%)",
  5: "hsl(270, 70%, 60%)",
  6: "hsl(270, 100%, 70%)",
};

export const orange: ColorValues = {
  0: "hsl(25, 28%, 15%)",
  1: "hsl(25, 30%, 20%)",
  2: "hsl(25, 35%, 30%)",
  3: "hsl(25, 40%, 40%)",
  4: "hsl(25, 50%, 50%)",
  5: "hsl(25, 70%, 60%)",
  6: "hsl(25, 100%, 70%)",
};

export type color = "red" | "blue" | "yellow" | "green" | "purple" | "orange";

export const colors: { [key in color]: ColorValues } = {
  green,
  yellow,
  blue,
  red,
  purple,
  orange,
};
