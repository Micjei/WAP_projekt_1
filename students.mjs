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

/**
 * Represents a student.
 * Extends {@link Person}.
 *
 * @constructor
 * @param {string} name - The student's name.
 * @param {number} age - The student's age.
 */
function Student(name, age) {
  Person.call(this, name, age);

  /**
   * List of enrolled courses.
   * @type {string[]}
   */
  this.courses = [];

  /**
   * Set of successfully passed courses (unique).
   * @type {Set<string>}
   */
  this.passedCourses = new Set();
}

/**
 * Represents a university alumni.
 * Extends {@link Person}.
 *
 * @constructor
 * @param {string} name - The alumni's name.
 * @param {number} age - The alumni's age.
 */
function Alumni(name, age) {
  Person.call(this, name, age);
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Alumni.prototype = Object.create(Person.prototype);
Alumni.prototype.constructor = Alumni;

// Person methods ----------------------------------------------------------------------------------------

/**
 * Introduces the person.
 *
 * @returns {string} Formatted introduction string.
 */
Person.prototype.introduce = function () {
  return `Hello, I am ${this.name} and I am ${this.age}.`;
};

/**
 * Increments the person's age by one year.
 *
 * @returns {void}
 */
Person.prototype.celebrateBirthday = function () {
  this.age += 1;
};

/**
 * Converts a Person into a Student by changing its prototype.
 *
 * @throws {Error} If the person is already a student.
 * @returns {void}
 */
Person.prototype.goToUniversity = function () {
  if (this instanceof Student) throw new Error("Already a student");
  Student.call(this, this.name, this.age);
  Object.setPrototypeOf(this, Student.prototype);
};

// Student methods ----------------------------------------------------------------------------------------

/**
 * Enrolls the student into a course.
 *
 * @param {string} course - The name of the course.
 * @returns {void}
 */
Student.prototype.enroll = function (course) {
  this.courses.push(course);
};

/**
 * Assigns a study results provider.
 * If called multiple times, the previous provider is replaced.
 *
 * The provider must implement a next() method returning a Promise resolving to:
 * {
 *   value: { course: string, score: number, passed: boolean },
 *   done: boolean
 * }
 *
 * @param {{ next: function(): Promise<{value: object, done: boolean}> }} provider
 * @returns {void}
 */
Student.prototype.assignStudyResultsProvider = function (provider) {
  this.studyResultsProvider = provider;
};

/**
 * Determines whether the student is ready for the final exam.
 *
 * A student is ready if at least 10 unique courses
 * have been successfully passed.
 *
 * @returns {boolean} True if ready, otherwise false.
 */
Student.prototype.readyForFinalExam = function () {
  if (this.passedCourses.size >= 10) return true;
  return false;
};

/**
 * Attempts to pass the final exam.
 *
 * If the student is ready, they become an Alumni
 * by changing the prototype and the method returns true.
 *
 * @returns {boolean} True if successful, otherwise false.
 */
Student.prototype.passFinalExam = function () {
  if (this.readyForFinalExam()) {
    Alumni.call(this, this.name, this.age);
    Object.setPrototypeOf(this, Alumni.prototype);
    return true;
  }
  return false;
};

/**
 * Asynchronous generator that yields study results.
 *
 * Results for non-enrolled courses are ignored.
 * Successfully passed courses are recorded internally.
 *
 * @async
 * @generator
 * @yields {{course: string, score: number, passed: boolean}}
 */
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

/**
 * Introduces the alumni.
 * Extends the base Person introduction by adding graduation text.
 *
 * @returns {string} Formatted introduction string including graduation message.
 */
Alumni.prototype.introduce = function () {
  const baseText = Person.prototype.introduce.call(this);
  return baseText + " I graduated university.";
};
