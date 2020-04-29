function buildReadingClassNames(readingClass:string, status:string) {
    if (status === 'Complete') {
        return readingClass;
    }

    return `${readingClass} being-prepared`;
}

export default buildReadingClassNames;