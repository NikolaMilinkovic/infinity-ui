export default class DressColor {
  _id: string;
  color: string;
  colorCode: string;
  sizes: { size: string; stock: number }[];

  constructor(id?: string, color?: string, colorCode?: string, sizes?: { size: string; stock: number }[]) {
    this._id = id || '';
    this.color = color || '';
    this.colorCode = colorCode || '';
    this.sizes = sizes || [
      { size: 'UNI', stock: 0 },
      { size: 'XS', stock: 0 },
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 },
    ];
  }

  // Setters
  setId(id: string) {
    this._id = id;
  }
  setColor(color: string) {
    this.color = color;
  }
  setColorCode(colorCode: string) {
    this.colorCode = colorCode;
  }
  setSizes(sizes: { size: string; stock: number }[]) {
    this.sizes = sizes;
  }
  // Getters
  getId() {
    return this._id;
  }
  getColor() {
    return this.color;
  }
  getColorCode() {
    return this.colorCode;
  }
  getSizes() {
    return this.sizes;
  }

  // Size Settings
  getSize(size: string) {
    return this.sizes.find((s) => s.size === size);
  }
  getXS() {
    return this.getSize('XS');
  }
  getS() {
    return this.getSize('S');
  }
  getM() {
    return this.getSize('M');
  }
  getL() {
    return this.getSize('L');
  }
  getXL() {
    return this.getSize('XL');
  }
  getUNI() {
    return this.getSize('UNI');
  }

  // Update size with new amount
  updateSizeAmount(size: string, amount: number) {
    const sizeObj = this.sizes.find((s) => s.size === size);
    if (sizeObj) {
      sizeObj.stock = amount;
    } else {
      console.error(`Size ${size} not found.`);
    }
  }

  // Size ++
  increaseSizeAmount(size: string) {
    const sizeObj = this.sizes.find((s) => s.size === size);
    if (sizeObj) {
      sizeObj.stock += 1;
    } else {
      console.error(`Size ${size} not found.`);
    }
  }

  // Size --
  decreaseSizeAmount(size: string) {
    const sizeObj = this.sizes.find((s) => s.size === size);
    if (sizeObj) {
      if (sizeObj.stock > 0) {
        sizeObj.stock -= 1;
      } else {
        console.error(`Stock for size ${size} is already 0.`);
      }
    } else {
      console.error(`Size ${size} not found.`);
    }
  }

  // print() {
  //   console.log(`Color ID: ${this._id}`);
  //   console.log(`Color: ${this.color}`);
  //   console.log(`Color Code: ${this.colorCode}`);
  //   console.log('Sizes:');
  //   this.sizes.forEach((sizeObj) => {
  //     console.log(`  Size: ${sizeObj.size}, Stock: ${sizeObj.stock}`);
  //   });
  // }
}
