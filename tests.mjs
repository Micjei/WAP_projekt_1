"use strict";
import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { Person, Student, Alumni } from "./students.mjs";

function makeStudent(name = "Hana", age = 25) {
  const p = new Person(name, age);
  p.goToUniversity();
  return p;
}

function enrollMany(student, courses) {
  for (const c of courses) student.enroll(c);
}

function providerFromAttempts(attempts) {
  return (async function* () {
    for (const a of attempts) yield a;
  })();
}

async function consumeExam(student) {
  for await (const _ of student.goToExam()) {
  }
}

const enrolled = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"];

describe("Person", () => {
  test("introduce() vrací string a přesný formát", () => {
    const name = "Pavel";
    const age = 22;

    const p = new Person(name, age);
    const t = p.introduce();

    const expected = `Hello, I am ${name} and I am ${age}.`;

    assert.equal(t, expected);
    assert.equal(typeof t, "string");
  });

  test("introduce() vrací chybu, záporný věk", () => {
    assert.throws(() => new Person("Jindra", -5), {
      name: "RangeError",
      message: "Age cannot be negative",
    });
  });

  test("introduce() vrací chybu, jméno není string", () => {
    assert.throws(() => new Person(20, 50), {
      name: "TypeError",
      message: "Name must be a string",
    });
  });

  test("introduce() vrací chybu, věk není číslo", () => {
    assert.throws(() => new Person("Michael", "ahoj"), {
      name: "TypeError",
      message: "Age must be a number",
    });
  });

  test("celebrateBirthday() vrací int a zvětší věk o 1", () => {
    const p = new Person("Jindra", 20);

    p.celebrateBirthday();

    assert.equal(p.age, 21);
  });

  test("goToUniversity() je instancí Student", () => {
    const p = makeStudent();
    assert.equal(true, p instanceof Student);
  });

  test("goToUniversity() 2x - chyba", () => {
    const p = makeStudent();
    assert.throws(() => p.goToUniversity(), Error);
  });

  test("goToUniversity() je instancí Student i Person", () => {
    const p = makeStudent();
    assert.equal(true, p instanceof Student);
    assert.equal(true, p instanceof Person);
  });
});

describe("Student", () => {
  test("enroll() přidá více kurzů", () => {
    const p = makeStudent();
    enrollMany(p, enrolled);
    assert.deepEqual(p.courses, enrolled);
  });

  // možná zbytečný test
  test("enroll() vyhodí chybu pokud nejsem student", () => {
    const p = new Person("Hana", 25);

    assert.throws(() => p.enroll("IAL"), Error);
  });

  test("assignStudyResultsProvider() přepisuje původní provider", async () => {
    const p = makeStudent();
    enrollMany(p, ["PRG", "MAT"]);

    p.assignStudyResultsProvider(
      providerFromAttempts([{ course: "PRG", score: 55, passed: true }]),
    );
    p.assignStudyResultsProvider(
      providerFromAttempts([{ course: "MAT", score: 60, passed: true }]),
    );

    const yieldedCourses = [];

    for await (const attempt of p.goToExam())
      yieldedCourses.push(attempt.course);

    assert.deepEqual(yieldedCourses, ["MAT"]);

    assert.equal(p.passedCourses.has("PRG"), false);
    assert.equal(p.passedCourses.has("MAT"), true);
  });

  test("goToExam() bez nastaveného provideru nic negeneruje a nespadne", async () => {
    const p = makeStudent();
    enrollMany(p, ["PRG", "MAT"]);

    const yielded = [];
    for await (const attempt of p.goToExam()) yielded.push(attempt);

    assert.deepEqual(yielded, []);
    assert.equal(false, p.readyForFinalExam());
    assert.equal(false, p.passFinalExam());
  });

  test("goToExam() nezapsané kurzy se ignorují", async () => {
    const p = makeStudent();
    enrollMany(p, ["PRG"]);

    p.assignStudyResultsProvider(
      providerFromAttempts([
        { course: "ABC", score: 55, passed: true },
        { course: "OUS", score: 55, passed: true },
        { course: "PRG", score: 55, passed: true },
      ]),
    );

    await consumeExam(p);

    assert.equal(p.passedCourses.has("ABC"), false);
    assert.equal(p.passedCourses.has("OUS"), false);
    assert.equal(p.passedCourses.has("PRG"), true);
  });

  test("goToExam() chyba -> pass započítá kurz až po pass a jen jednou", async () => {
    const p = makeStudent("Hana", 25);
    enrollMany(p, ["PRG"]);

    p.assignStudyResultsProvider(
      providerFromAttempts([
        { course: "PRG", score: 20, passed: false },
        { course: "PRG", score: 55, passed: true },
        { course: "PRG", score: 55, passed: true },
      ]),
    );

    const gen = p.goToExam();

    const first = await gen.next();
    assert.equal(first.value.course, "PRG");
    assert.equal(first.value.passed, false);
    assert.equal(p.passedCourses.has("PRG"), false);
    assert.equal(p.passedCourses.size, 0);

    const second = await gen.next();
    assert.equal(second.value.course, "PRG");
    assert.equal(second.value.passed, true);
    assert.equal(p.passedCourses.has("PRG"), true);
    assert.equal(p.passedCourses.size, 1);

    const third = await gen.next();
    assert.equal(third.value.course, "PRG");
    assert.equal(third.value.passed, true);
    assert.equal(p.passedCourses.size, 1);

    const done = await gen.next();
    assert.equal(done.done, true);
  });

  test("readyForFinalExam() 9 unikátních passed + 1 fail - false", async () => {
    const p = makeStudent("Jindra", 25);
    enrollMany(p, enrolled);

    p.assignStudyResultsProvider(
      providerFromAttempts([
        ...["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"].map((c) => ({
          course: c,
          score: 55,
          passed: true,
        })),
        { course: "C10", score: 20, passed: false },
      ]),
    );

    await consumeExam(p);

    assert.equal(p.passedCourses.size, 9);
    assert.equal(p.readyForFinalExam(), false);
    assert.equal(p.passFinalExam(), false);
  });

  test("readyForFinalExam jenom 2 předměty", () => {
    const p = makeStudent("Hana", 25);
    enrollMany(p, ["PRG", "MAT"]);

    assert.equal(false, p.readyForFinalExam());
    assert.equal(false, p.passFinalExam());
  });

  test("readyForFinalExam() více jak 10 předmětů, ale bez výsledků", () => {
    const p = makeStudent("Hana", 25);
    enrollMany(p, enrolled);

    assert.equal(false, p.readyForFinalExam());
    assert.equal(false, p.passFinalExam());
  });

  test("readyForFinalExam() více jak 10 předmětů a ukončených", async () => {
    const p = makeStudent();
    enrollMany(p, enrolled);

    const attempts = ["ABC", "OUS", ...enrolled].map((course) => ({
      course,
      score: 55,
      passed: true,
    }));

    p.assignStudyResultsProvider(providerFromAttempts(attempts));

    await consumeExam(p);

    assert.equal(true, p.readyForFinalExam());
    assert.equal(true, p.passFinalExam());
  });

  test("readyForFinalExam() více než 10, ale neunikátní", async () => {
    const p = makeStudent();
    const courses = Array.from({ length: 15 }, () => "PRG");
    enrollMany(p, courses);

    const attempts = ["ABC", "OUS", ...courses].map((course) => ({
      course,
      score: 55,
      passed: true,
    }));

    p.assignStudyResultsProvider(providerFromAttempts(attempts));

    await consumeExam(p);

    assert.equal(false, p.readyForFinalExam());
    assert.equal(false, p.passFinalExam());
    assert.equal(p.passedCourses.size, 1);
  });
});

describe("Alumni", () => {
  test("Alumni: passFinalExam() jsem alumni", async () => {
    const p = makeStudent();
    enrollMany(p, enrolled);

    p.assignStudyResultsProvider(
      providerFromAttempts(
        ["ABC", ...enrolled].map((course) => ({
          course,
          score: 55,
          passed: true,
        })),
      ),
    );

    await consumeExam(p);

    assert.equal(true, p.readyForFinalExam());
    assert.equal(true, p.passFinalExam());
    assert.equal(true, p instanceof Alumni);
    assert.equal(false, p instanceof Student);
  });

  test("passFinalExam() jsem alumni a mám odstudováno", async () => {
    const name = "Pavel";
    const age = 22;
    const p = new Person(name, age);
    const expectedBefore = `Hello, I am ${name} and I am ${age}.`;
    const expectedAfter = `Hello, I am ${name} and I am ${age}. I graduated university.`;
    const b = p.introduce();

    p.goToUniversity();

    enrollMany(p, enrolled);

    p.assignStudyResultsProvider(
      providerFromAttempts(
        enrolled.map((course) => ({ course, score: 55, passed: true })),
      ),
    );

    await consumeExam(p);

    assert.equal(true, p.readyForFinalExam());
    assert.equal(true, p.passFinalExam());

    const a = p.introduce();
    assert.equal(true, p instanceof Alumni);
    assert.equal(false, p instanceof Student);

    assert.equal(b, expectedBefore);
    assert.equal(a, expectedAfter);
  });

  test("po passFinalExam() už nemám metody studenta", async () => {
    const p = makeStudent();
    enrollMany(p, enrolled);

    p.assignStudyResultsProvider(
      providerFromAttempts(
        enrolled.map((course) => ({ course, score: 55, passed: true })),
      ),
    );

    await consumeExam(p);

    assert.equal(true, p.readyForFinalExam());
    assert.equal(true, p.passFinalExam());
    assert.equal(true, p instanceof Alumni);
    assert.equal(false, p instanceof Student);

    assert.throws(() => p.passFinalExam(), TypeError);
    assert.throws(() => p.readyForFinalExam(), TypeError);
  });
});
