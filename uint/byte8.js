module.exports = class Uint8 {
  #buffer;
  #size;
  #arr;

  constructor(length = 10) {
    if (length < 0) {
      console.error("Array length is not valid");
      throw new Error("Array length is not valid");
    }
    this.#size = Math.max(10, length);
    this.#buffer = new ArrayBuffer(this.#size);
    this.#arr = new Uint8Array(this.#buffer);
    this.type = "Uint8";
    this.length = length;
  }

  at(index) {
    if (index < 0) index += this.length;
    if (index < 0 || index >= this._length) return undefined;
    return this.#arr[index];
  }

  get(index) {
    return this.at(index);
  }

  set(index, value) {
    if (index >= this.length) {
      this.length = index + 1;
      if (index >= this.#size) {
        this.#grow(index + 1);
      }
    }
    this.#arr[index] = value;
  }

  array() {
    return new Uint8Array(this.#buffer, 0, this.length);
  }

  toArray() {
    return Array.from(this.array());
  }

  clone() {
    return this.#arr.slice(0, this.length);
  }

  slice(start = 0, end = this.length) {
    if (start < 0) start += this.length;
    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    return this.#arr.slice(start, end);
  }

  push(...value) {
    if (this.#size < this.length + value.length) this.#grow();
    for (var x of value) {
      if (typeof x !== "number") continue;
      this.#arr[this.length++] = x;
    }
    return x;
  }

  pop() {
    if (this.length === 0) return;
    var popped = this.#arr[--this.length];
    if (this.length < this.#size / 2) this.#shrink();
    return popped;
  }

  unshift(value) {
    if (typeof value !== "number") return;
    if (this.#size === this.length) this.#grow();
    for (var i = this.length; i > 0; --i) {
      this.#arr[i] = this.#arr[i - 1];
    }
    this.length++;
    this.#arr[0] = value;
    return value;
  }

  shift() {
    if (this.length === 0) throw Error("Array is empty");
    var shifted = this.#arr[0];
    if (this.length < this.#size / 2) this.#shrink();
    for (var i = 1; i < this.length; ++i) {
      this.#arr[i - 1] = this.#arr[i];
    }
    this.length--;
    return shifted;
  }

  concat(arr) {
    var newArr = new Uint8Arr(this.length + arr.length);
    var index = 0,
      pointer = 0;
    while (index < this.length) {
      newArr.set(index, this.#arr[index]);
      ++index;
    }
    while (index < newArr.length) {
      newArr.set(index, arr[pointer]);
      ++pointer;
      ++index;
    }
  }

  sort(comparisonFunction = undefined) {
    var arr = this.array();
    return this.#sort(arr, comparisonFunction);
  }

  reverse() {
    var arr = this.array();
    return arr.reverse();
  }

  fill(value, start = 0, end = this.length) {
    var arr = this.array();
    return arr.fill(value, start, end);
  }

  indexOf(searchElement, fromIndex = 0) {
    var arr = this.array();
    return arr.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement, fromIndex = 0) {
    var arr = this.array();
    return arr.lastIndexOf(searchElement, fromIndex);
  }

  includes(searchElement, fromIndex = 0) {
    var arr = this.array();
    return arr.includes(searchElement, fromIndex);
  }

  findIndex(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.findIndex(callbackFn, thisArg);
  }

  findLast(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.findLast(callbackFn, thisArg);
  }

  findLastIndex(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.findLastIndex(callbackFn, thisArg);
  }

  every(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.every(callbackFn, thisArg);
  }

  some(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.some(callbackFn, thisArg);
  }

  filter(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.filter(callbackFn, thisArg);
  }

  map(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.map(callbackFn, thisArg);
  }

  forEach(callbackFn, thisArg = undefined) {
    var arr = this.array();
    return arr.forEach(callbackFn, thisArg);
  }

  reduce(callbackFn, initialValue = 0) {
    var arr = this.array();
    return arr.reduce(callbackFn, initialValue);
  }

  reduceRight(callbackFn, initialValue = 0) {
    var arr = this.array();
    return arr.reduceRight(callbackFn, initialValue);
  }

  join(separator = ",") {
    var arr = this.array();
    return arr.join(separator);
  }

  #grow(size = this.#size * 2) {
    this.#size = size;
    var buffer = new ArrayBuffer(this.#size);
    var newArr = new Uint8Array(buffer);
    for (var i = 0; i < this.#size; ++i) newArr[i] = this.#arr[i];
    this.#buffer = buffer;
    this.#arr = newArr;
  }

  #shrink() {
    this.#size = Math.max(Math.floor(this.#size / 2), 10);
    var buffer = new ArrayBuffer(this.#size);
    var newArr = new Uint8Array(buffer);
    for (var i = 0; i < this.#size; ++i) newArr[i] = this.#arr[i];
    this.#buffer = buffer;
    this.#arr = newArr;
  }

  #sort(arr, comparisonFunction = undefined) {
    if (comparisonFunction) return arr.sort(comparisonFunction);

    var minElement = Math.min(...arr);
    var maxElement = Math.max(...arr);

    if (maxElement - minElement > arr.length * Math.log2(arr.length)) {
      return arr.sort((a, b) => a - b);
    }

    var freq;
    if (this.length < 1 << 8) {
      freq = new Uint8Array(maxElement + 1);
    } else if (this.length < 1 << 16) {
      freq = new Uint16Array(maxElement + 1);
    } else {
      freq = new Uint32Array(maxElement + 1);
    }
    arr.forEach((x) => ++freq[x]);
    var index = 0;
    freq.forEach((x, cur) => {
      if (x) {
        while (x--) {
          arr[index++] = cur;
        }
      }
    });
    return arr;
  }
};
