import * as fs from 'fs';
import parse from '../auth/LDAPParser';
import Section from "../auth/Section";

const student = JSON.parse(fs.readFileSync(`${__dirname}/ldap-example-01.json`, 'utf8'));
const instructor = JSON.parse(fs.readFileSync(`${__dirname}/ldap-example-02.json`, 'utf8'));

const biol2000 = new Section('BIOL2000022019F');
const chem1109 = new Section('CHEM1109012019F');
const chem1111 = new Section('CHEM1111012019F');
const phil1090 = new Section('PHIL1090182019S');

const abcd4911082019F = new Section('ABCD4911082019F');
const abcd8014012019F = new Section('ABCD8014012019F');
const abcd8014022019F = new Section('ABCD8014022019F');
const abcd8499012019F = new Section('ABCD8499012019F');

it('parses a student correctly', () => {
    const sections = parse(student);
    const fall2019Sections = [biol2000, chem1109, chem1111];
    const spring2019Sections = [phil1090];
    expect(sections.coursesAsStudent(2019, 'F')).toEqual(fall2019Sections);
    expect(sections.coursesAsStudent(2019, 'S')).toEqual(spring2019Sections);
});

it('does not double count courses as student and as instructor for students', () => {
    const sections = parse(student);
    expect(sections.coursesAsInstructor(2019, 'F')).toEqual([]);
});

it('parses an instructor correctly', () => {
    const sections = parse(instructor);
    const fall2019Sections = [abcd4911082019F, abcd8014012019F, abcd8014022019F, abcd8499012019F];
    expect(sections.coursesAsInstructor(2019, 'F')).toEqual(fall2019Sections);
});

it('does not double count courses as student and as instructor for faculty', () => {
    const sections = parse(instructor);
    expect(sections.coursesAsStudent(2019, 'F')).toEqual([]);
});