import { ReactNode } from 'react'

type TableProps = { head: ReactNode, body: ReactNode, colSpan?: number }

const Table: React.FC<TableProps> = ({ head, body, colSpan = 5 }) => {
    const tableStyle = 'table table-borderless table-striped table-sm align-middle'

    body = body?.toString() !== ''
        ? body
        : <tr>
            <td colSpan={colSpan} className='text-center text-red'>
                There is no data.
            </td>
        </tr>

    return <>
        <div className='row mt-3'>
            <div className='col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive text-nowrap'>
                    <table className={tableStyle}>
                        <thead className='text-center'>{head}</thead>
                        <tbody className='table-group-divider scroller'>{body}</tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}

export default Table