"use strict";
// Tested with Node.js v22.13.1

// Constructors ----------------------------------------------------------------------------------------

/**
 * Creates a new Person.
 * @constructor
 * @param {string} name - Person name
 * @param {number} age - Person age
 * @throws {TypeError} If name is not string
 * @throws {TypeError} If age is not number
 * @throws {RangeError} If age is negative
 */
export function Person(name, age) {
  if (typeof name !== "string") throw new TypeError("Name must be a string");
  if (typeof age !== "number") throw new TypeError("Age must be a number");
  if (age < 0) throw new RangeError("Age cannot be negative");

  this.name = name;
  this.age = age;
}

export function Student(name, age) {
  Person.call(this, name, age);

  this.courses = [];
  this.passedCourses = new Set();
}

export function Alumni(name, age) {
  Person.call(this, name, age);
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Alumni.prototype = Object.create(Person.prototype);
Alumni.prototype.constructor = Alumni;

// Person methods ----------------------------------------------------------------------------------------

Person.prototype.introduce = function () {
  return `Hello, I am ${this.name} and I am ${this.age}.`;
};

Person.prototype.celebrateBirthday = function () {
  this.age += 1;
};

Person.prototype.goToUniversity = function () {
  if (this instanceof Student) throw new Error("Already a student");
  Student.call(this, this.name, this.age);
  Object.setPrototypeOf(this, Student.prototype);
};

// Student methods ----------------------------------------------------------------------------------------

Student.prototype.enroll = function (course) {
  this.courses.push(course);
};

Student.prototype.assignStudyResultsProvider = function (provider) {
  this.studyResultsProvider = provider;
};

Student.prototype.readyForFinalExam = function () {
  if (this.passedCourses.size >= 10) return true;
  return false;
};

Student.prototype.passFinalExam = function () {
  if (this.readyForFinalExam()) {
    Alumni.call(this, this.name, this.age);
    Object.setPrototypeOf(this, Alumni.prototype);
    return true;
  }
  return false;
};

Student.prototype.goToExam = async function* () {
  if (!this.studyResultsProvider) return;

  while (true) {
    const { value, done } = await this.studyResultsProvider.next();
    if (done) return;
    if (!value) continue;
    if (!this.courses || !this.courses.includes(value.course)) continue;
    if (value.passed) this.passedCourses.add(value.course);

    yield value;
  }
};

// Alumni method ----------------------------------------------------------------------------------------

Alumni.prototype.introduce = function () {
  const baseText = Person.prototype.introduce.call(this);
  return baseText + " I graduated university.";
};
