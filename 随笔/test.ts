class Hello {
  private _name: string;
  private _age: number;
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get age(): number {
    return this._age;
  }
  set age(age: number) {
    if (age > 0 && age < 100) {
      console.log("年龄在0-100之间"); // 年龄在0-100之间
      return;
    }
    this._age = age;
  }
}

let hello = new Hello();
hello.name = "muyy";
hello.age = 230
console.log(hello.name); // muyy
