export type Sector = "A" | "B" | "C" | "D" | "E" | "F";
export type Ring = 1 | 2 | 3 | 4;
export type Coordinate = `${Ring}${Sector}`;

export class Coordinates {
  readonly ring: Ring;
  readonly sector: Sector;

  constructor(coordinates: [Ring, Sector] | string) {
    const ring = coordinates[0].toString();
    const sector = coordinates[1];

    this.ring = Number.parseInt(ring) as Ring;
    this.sector = sector as Sector;
  }

  equals(coordinates: Coordinates): boolean {
    return coordinates.sector === this.sector && coordinates.ring === this.ring;
  }

  next(): Coordinates {
    switch (this.ring) {
      case 1:
        return new Coordinates([
          3,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
      case 2:
        return new Coordinates([
          1,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
      case 3:
        return new Coordinates([
          4,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 2),
        ]);
      case 4:
        return new Coordinates([
          2,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
    }
  }

  previous(): Coordinates {
    switch (this.ring) {
      case 1:
        return new Coordinates([
          2,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
      case 2:
        return new Coordinates([
          4,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
      case 3:
        return new Coordinates([
          1,
          Coordinates.toSector(Coordinates.fromSector(this.sector) + 3),
        ]);
      case 4:
        return new Coordinates([
          3,
          Coordinates.toSector(Coordinates.fromSector(this.sector) - 2),
        ]);
    }
  }

  static toSector(num: number): Sector {
    const value = ((num % 6) + 6) % 6;

    switch (value) {
      case 0:
        return "A";
      case 1:
        return "B";
      case 2:
        return "C";
      case 3:
        return "D";
      case 4:
        return "E";
      case 5:
        return "F";
      default:
        throw new Error("Invalid value: " + value);
    }
  }

  static fromSector(sector: Sector) {
    switch (sector) {
      case "A":
        return 0;
      case "B":
        return 1;
      case "C":
        return 2;
      case "D":
        return 3;
      case "E":
        return 4;
      case "F":
        return 5;
    }
  }
}
