import Section from "../auth/Section";

it('section is parsed correctly', () => {
    const section = new Section('PHIL1090182019S');
    expect(section.subjectCode).toBe('PHIL');
    expect(section.courseNum).toBe('1090');
    expect(section.sectionNum).toBe('18');
    expect(section.year).toBe(2019);
    expect(section.semester).toBe('S');
    expect(section.ldapIdentifier).toBe('PHIL1090182019S');
});