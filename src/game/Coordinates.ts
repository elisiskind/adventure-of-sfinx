type Sector = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type Ring = 1 | 2 | 3 | 4;

export const validateSector = (sector: string) => {
  return ['A', 'B', 'C', 'D', 'E', 'F'].includes(sector);
}

export const validateRing = (ring: string) => {
  const val = Number.parseInt(ring);
  return Number.isInteger(val) && val > 0 && val < 5;
}

export const validateCoordinates = (coordinates: string) => {
  const ring = coordinates[0].toString();
  const sector = coordinates[1];

  if (!validateSector(sector)) {
    throw new Error('Invalid sector: ' + sector);
  }

  if (!validateRing(ring)) {
    throw new Error('Invalid ring: ' + ring);
  }
}

export const validateCoordinatesAsYouType = (coordinates: string) => {
  if (coordinates.length === 0) {
    return true;
  } else if (coordinates.length === 1) {
    return validateRing(coordinates[0]);
  } else if (coordinates.length === 2) {
    return validateRing(coordinates[0]) && validateSector(coordinates[1]);
  } else {
    return false;
  }
}

export class Coordinates {
  private readonly _ring: Ring;
  private readonly _sector: Sector;

  constructor(coordinates: [Ring, Sector] | string) {
    const ring = coordinates[0].toString();
    const sector = coordinates[1];

    validateCoordinates(ring + sector)

    this._ring = Number.parseInt(ring) as Ring;
    this._sector = sector as Sector;
  }

  equals(coordinates: Coordinates): boolean {
    return coordinates._sector === this._sector && coordinates._ring === this._ring;
  }

  next(): Coordinates {

    switch (this._ring) {
      case 1:
        return new Coordinates([3, this.toSector(this.fromSector(this._sector) + 3)]);
      case 2:
        return new Coordinates([1, this.toSector(this.fromSector(this._sector) + 3)]);
      case 3:
        return new Coordinates([4, this.toSector(this.fromSector(this._sector) + 2)]);
      case 4:
        return new Coordinates([2, this.toSector(this.fromSector(this._sector) + 3)]);
    }
  }


  previous(): Coordinates {
    switch (this._ring) {
      case 1:
        return new Coordinates([2, this.toSector(this.fromSector(this._sector) + 3)]);
      case 2:
        return new Coordinates([4, this.toSector(this.fromSector(this._sector) + 3)]);
      case 3:
        return new Coordinates([1, this.toSector(this.fromSector(this._sector) + 3)]);
      case 4:
        return new Coordinates([3, this.toSector(this.fromSector(this._sector) - 2)]);
    }
  }

  toSector(num: number): Sector {
    const value = ((num % 6) + 6) % 6;

    switch (value) {
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
      default:
        throw new Error('Invalid value: ' + value)
    }
  }

  fromSector(sector: Sector) {
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
}