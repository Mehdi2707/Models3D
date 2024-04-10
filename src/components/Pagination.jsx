import { Link } from "react-router-dom"

export function Pagination({ currentPage, totalPages }) {
    return (
        <ul className="pagination">
            <li className={currentPage === 1 ? 'disabled' : 'waves-effect'}>
                {currentPage > 1 ? (
                    <Link to={`/models?page=${currentPage - 1}`}>
                        <i className="material-icons">chevron_left</i>
                    </Link>
                ) : (
                    <a>
                        <i className="material-icons">chevron_left</i>
                    </a>
                )}
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
                <li key={`page-${index + 1}`} className={currentPage === index + 1 ? 'active' : 'waves-effect'}>
                    <Link to={`/models?page=${index + 1}`}>{index + 1}</Link>
                </li>
            ))}
            <li className={currentPage === totalPages ? 'disabled' : 'waves-effect'}>
                {currentPage < totalPages ? (
                    <Link to={`/models?page=${currentPage + 1}`}>
                        <i className="material-icons">chevron_right</i>
                    </Link>
                ) : (
                    <a>
                        <i className="material-icons">chevron_right</i>
                    </a>
                )}
            </li>
        </ul>
    )
}