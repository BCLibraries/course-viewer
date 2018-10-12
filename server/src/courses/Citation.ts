const ebookLabel = 'E-book';

class Citation {
    public sortTitle: string = '';
    public id: string;
    public status: string;
    public type: { primary: string; secondary: string };
    public metadata: any;
    public availability: any;

    constructor(almaCite: any) {
        this.id = almaCite.id;
        this.status = almaCite.status.value;
        this.type = {
            primary: isEbook(almaCite) ? ebookLabel : almaCite.type.desc,
            secondary: almaCite.secondary_type.desc
        };
        this.metadata = almaCite.metadata;

        if (this.metadata.title) {
            this.metadata.title = this.metadata.title.replace(/\/$/, "");
        }

        if (this.metadata.author) {
            this.metadata.author = this.metadata.author.replace(/,$/, "");
        }

        this.sortTitle = this.buildSortTitle();
    }

    public setAvailability(availabilityJson: any, homeLibrary: string) {
        const availabilities = availabilityJson.map((json: any) => {
            return {
                availability: json.available_count > 0 ? 'available' : 'unavailable',
                call_number: json.call_number,
                library: json.location.library_name,
                location: json.location.location_name.replace(/-(\d+) Ho/, '- $1 Ho')
            };
        });

        this.availability = availabilities.sort((a: any, b: any) => {
            if (a.library === homeLibrary && b.library !== homeLibrary) {
                return -1;
            }

            if (a.library !== homeLibrary && b.library === homeLibrary) {
                return 1;
            }

            if (a.library !== homeLibrary && b.library !== homeLibrary) {
                return 0;
            }

            if (a.location.includes('Reserves')) {
                return -1;
            }

            if (b.location.includes('Reserves')) {
                return 1
            }

            return 0;
        });

    }

    private buildSortTitle() {
        let sortTitle = this.sortTitle;
        if (this.metadata.title) {
            sortTitle = this.metadata.title;
        } else if (this.metadata.article_title) {
            sortTitle = this.metadata.article_title
        } else if (this.metadata.journal_title) {
            sortTitle = this.metadata.journal_title;
        }

        return sortTitle.toLowerCase().replace(/the |a |an /, '');
    }
}

function isEbook(almaCite: any) {
    if (almaCite.secondary_type.desc === ebookLabel || almaCite.type.desc === ebookLabel) {
        return true;
    }
    return almaCite.metadata.pages && almaCite.metadata.pages.includes('online');
}

export default Citation;