export default class PurseColor {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;

  constructor(id?: string, color?: string, colorCode?: string, stock?: number) {
    this._id = id || '';
    this.color = color || '';
    this.colorCode = colorCode || '';
    this.stock = stock || 0;
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
  setStock(stock: number) {
    this.stock = stock;
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
  getStock() {
    return this.stock;
  }
}
