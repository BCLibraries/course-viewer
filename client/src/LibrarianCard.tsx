import * as React from 'react';
import {useState} from 'react';

type LibrarianCardProps = {
    expert: any
};

// Minimum permissible width of librarian images
const minImageWidth = 200;

/**
 * Display a single subject specialist
 *
 * @param expert
 * @constructor
 */
function LibrarianCard({expert}: LibrarianCardProps) {

    // Classes on <img> element. Mostly used to hide small images.
    const [imgClasses, setImgClasses] = useState('');

    /**
     * Remove librarian images smaller than a certain size
     *
     * @param img
     */
    const filterSmallImages = ({target: img}: any) => {
        if (img.offsetWidth < minImageWidth) {
            setImgClasses('too-small-thumb');
        }
    };

    // Full name of the librarian.
    const expertName = `${expert.firstName} ${expert.lastName}`;

    return (
        <div className="librarian-box">
            <figure>
                <img src={expert.imageUrl} className={imgClasses} alt={expertName} onLoad={filterSmallImages}/>
                <figcaption>
                    <div className="name">
                        <a href={expert.url} target="_blank" rel="noopener noreferrer">{expertName}</a>
                    </div>
                    <div className="title">Subject Librarian</div>
                </figcaption>
            </figure>
        </div>
    )
}

export default LibrarianCard;