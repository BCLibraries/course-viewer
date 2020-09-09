const ebookLabel = 'E-book';

class Citation {
    public sortTitle: string = '';
    public id: string;
    public status: string;
    public type: { primary: string; secondary: string };
    public metadata: any;
    public availability: any;

    /**
     * Constructor
     *
     * @param {} almaCite a citation record from the Alma reserves API
     * @param processDept
     */
    constructor(almaCite: any, processDept: string) {
        this.id = almaCite.id;
        this.status = usesIncomplete(processDept) ? almaCite.status.value : 'Complete';

        // Use Alma types, unless it's an eBook which requires some special logic.
        this.type = {
            primary: isEbook(almaCite) ? ebookLabel : almaCite.type.desc,
            secondary: almaCite.secondary_type.desc
        };

        this.metadata = almaCite.metadata;

        // Drop trailing slashes from titles.
        if (this.metadata.title) {
            this.metadata.title = this.metadata.title.replace(/\/$/, "");
        }

        // Drop trailing commas from author lists.
        if (this.metadata.author) {
            this.metadata.author = this.metadata.author.replace(/,$/, "");
        }

        this.sortTitle = this.buildSortTitle();
    }

    /**
     * Set the bib's availability
     *
     * A bibliographic record can have multiple items, each with its own availability. The
     * Alma API will return each availability status. Reserves patrons only care if there
     * at least one available item, so we need to process all the items and consolidate.
     *
     * @param availabilityJson
     * @param homeLibrary
     */
    public setAvailability(availabilityJson: any, homeLibrary: string) {

        // Build a list of each availability, processed from the Alma API's JSON response.
        const availabilities = availabilityJson.map((json: any) => {
            return {
                availability: json.available_count > 0 ? 'available' : 'unavailable',
                call_number: json.call_number,
                library: json.location.library_name,
                location: json.location.location_name.replace(/-(\d+) Ho/, '- $1 Ho')
            };
        });

        // The list should be returned with items at a course reserves desk in front,
        // followed by items in libraries in alphabetical order.
        // TODO: Add preferred libraries and locations (e.g. don't sort offsite to the top)
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

    public isLoanable(): boolean {
        if (this.availability) {
            console.log('not available');
            return false;
        }
        return true;
    }

    /**
     * Build title for sorting
     */
    private buildSortTitle() {

        // By default use ths sort title from the record.
        let sortTitle = this.sortTitle;

        // Prefer a proper form fitting the kind of resource.
        if (this.metadata.title) {
            sortTitle = this.metadata.title;
        } else if (this.metadata.article_title) {
            sortTitle = this.metadata.article_title
        } else if (this.metadata.journal_title) {
            sortTitle = this.metadata.journal_title;
        }

        // Normalize.
        return sortTitle.toLowerCase().replace(/the |a |an /, '');
    }
}

/**
 * Is this an eBook?
 *
 * @param almaCite
 */
function isEbook(almaCite: any) {

    // If the type is explicitly eBook, it's an eBook.
    if (almaCite.secondary_type.desc === ebookLabel || almaCite.type.desc === ebookLabel) {
        return true;
    }

    // If the page count says has the word "online" in it, it's an eBook.
    if (almaCite.metadata.pages && almaCite.metadata.pages.includes('online')) {
        return true;
    }

    // Otherwise, it's not an eBook.
    return false;
}

function usesIncomplete(processDept: string) {
    switch (processDept) {
        case 'TMLCR':
        case 'ONLCR':
        case 'ERCCR':
            return true;
    }
    return false;
}

export default Citation;