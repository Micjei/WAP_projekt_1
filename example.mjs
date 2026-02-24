"use strict";
/**
 * \brief Ukázkový skript pro první projekt předmětu WAP
 */

/// Využijeme knihovnu, která je předmětem zadání projektu
import { Person } from "./students.mjs";

var pavel = new Person("Pavel", 22);
var hana = new Person("Hana", 25);
var jindra = new Person("Jindra", 21);

jindra.goToUniversity();
jindra.celebrateBirthday();

console.log(
  pavel.introduce === hana.introduce,
  pavel.introduce === jindra.introduce,
);
console.log(pavel.introduce());
console.log(hana.introduce());
console.log(jindra.introduce());

var courses = [
  "IZP",
  "IUS",
  "IAL",
  "IPK",
  "ISA",
  "I1C",
  "I2C",
  "TIN",
  "PDS",
  "WAP",
];

for (let course of courses) {
  jindra.enroll(course);
}

console.log("Is Jindra ready for his final Exam?", jindra.readyForFinalExam());

jindra.assignStudyResultsProvider(
  (async function* () {
    for (let course of ["ABC"].concat(courses)) {
      yield {
        course: course,
        score: 55,
        passed: true,
      };
    }
  })(),
);
jindra.celebrateBirthday();
jindra.celebrateBirthday();
jindra.celebrateBirthday();

for await (let attempt of jindra.goToExam()) {
  console.log(attempt);
}

console.log(
  "Is Jindra now ready for his final Exam?",
  jindra.readyForFinalExam(),
);

console.log(jindra.passFinalExam());
jindra.celebrateBirthday();
console.log(jindra.introduce());
