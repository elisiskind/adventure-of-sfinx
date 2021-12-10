type Ring = 1 | 2 | 3 | 4;
type Sector = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const toSector = (num: number): Sector => {
  switch (((num % 6) + 6) % 6 as 0 | 1 | 2 | 3 | 4 | 5) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    case 4:
      return 'E';
    case 5:
      return 'F';
  }
}

export const fromSector = (sector: Sector) => {
  switch (sector) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    case 'F':
      return 5;
  }
}

export const nextWarpCoordinate = (ring: Ring, sector: Sector): [[Ring, Sector], [Ring, Sector]] => {
  switch (ring) {
    case 1:
      return [[3, toSector(fromSector(sector) + 3)], [2, toSector(fromSector(sector) + 3)]]
    case 2:
      return [[1, toSector(fromSector(sector) + 3)], [4, toSector(fromSector(sector) + 3)]]
    case 3:
      return [[4, toSector(fromSector(sector) + 2)], [1, toSector(fromSector(sector) + 3)]]
    case 4:
      return [[2, toSector(fromSector(sector) + 3)], [3, toSector(fromSector(sector) - 2)]]
  }
}
