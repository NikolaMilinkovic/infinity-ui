export default class Category{
  _id: string
  name: string

  constructor(
    id:string,
    name:string,
  ){
    this._id = id;
    this.name = name;
  }

  getColor(){
    return this.name;
  }
  getId(){
    return this._id;
  }
}