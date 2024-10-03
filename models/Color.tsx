export default class Color{
  _id: string
  name: string
  colorCode: string

  constructor(
    id:string,
    name:string,
    colorCode:string,
  ){
    this._id = id;
    this.name = name;
    this.colorCode = colorCode;
  }

  getColor(){
    return this.name;
  }
  getId(){
    return this._id;
  }
  getColorCode(){
    return this.colorCode;
  }
}