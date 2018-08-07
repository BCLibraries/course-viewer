import Section from "../auth/Section";
import SectionList from "../auth/SectionList";

const firstSection = new Section('PHIL1090182019S');
const secondSection = new Section('SLAV1121012018U');
const thirdSection = new Section('SLAV1123012019U');
const fourthSection = new Section('CHEM1109012019F');
const fifthSection = new Section('BIOL2000022019F');

it('adds and returns sections as student by year and semester', () => {

    const sectionList = new SectionList();
    sectionList.addAsStudent(firstSection);
    sectionList.addAsStudent(secondSection);
    sectionList.addAsStudent(thirdSection);
    sectionList.addAsStudent(fourthSection);
    sectionList.addAsStudent(fifthSection);

    const fall2019Sections = [fourthSection, fifthSection];
    const spring2019Sections = [firstSection];

    expect(sectionList.coursesAsStudent(2019, 'F')).toEqual(fall2019Sections);
    expect(sectionList.coursesAsStudent(2019, 'S')).toEqual(spring2019Sections);
    expect(sectionList.coursesAsStudent(2020, 'S')).toEqual([]);
});

it('adds and returns sections as student by year and semester', () => {
    const sectionList = new SectionList();
    sectionList.addAsInstructor(firstSection);
    sectionList.addAsInstructor(secondSection);
    sectionList.addAsInstructor(thirdSection);
    sectionList.addAsInstructor(fourthSection);
    sectionList.addAsInstructor(fifthSection);

    const fall2019Sections = [fourthSection, fifthSection];
    const spring2019Sections = [firstSection];

    expect(sectionList.coursesAsInstructor(2019, 'F')).toEqual(fall2019Sections);
    expect(sectionList.coursesAsInstructor(2019, 'S')).toEqual(spring2019Sections);
    expect(sectionList.coursesAsInstructor(2020, 'S')).toEqual([]);
});

it('adds and returns sections as mixed types by year and semester', () => {
    const sectionList = new SectionList();
    sectionList.addAsInstructor(firstSection);
    sectionList.addAsStudent(secondSection);
    sectionList.addAsInstructor(thirdSection);
    sectionList.addAsStudent(fourthSection);
    sectionList.addAsStudent(fifthSection);

    const fall2019Sections = [fourthSection, fifthSection];

    expect(sectionList.coursesAsStudent(2019, 'F')).toEqual(fall2019Sections);
    expect(sectionList.coursesAsInstructor(2019, 'S')).toEqual([firstSection]);
});