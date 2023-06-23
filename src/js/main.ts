import { User } from '../types/users';
import { fetchUsers } from '../api/users';

const ELEMENTS: {
    table: HTMLTableSectionElement | null;
    columnHeaders: NodeListOf<HTMLTableCellElement>;
    modal: HTMLDivElement | null;
    modalClose: HTMLSpanElement | null;
    modalName: HTMLHeadingElement | null;
    modalUserName: HTMLParagraphElement | null;
    modalEmail: HTMLParagraphElement | null;
    modalWebsite: HTMLParagraphElement | null;
} = {
    table: document.querySelector('tbody'),
    columnHeaders: document.querySelectorAll('th'),
    modal: document.querySelector('.modal'),
    modalClose: document.querySelector('.modal-close'),
    modalName: document.querySelector('.modal-content__name'),
    modalUserName: document.querySelector('.modal-content__username'),
    modalEmail: document.querySelector('.modal-content__email'),
    modalWebsite: document.querySelector('.modal-content__website'),
};

function init() {
    document.addEventListener('DOMContentLoaded', async () => {
        const users = await fetchUsers();
        if (!users) {
            return;
        }
        renderUsersTable(users);
        onClickColumnHeaderHandler(users);
    });
}

init();

function renderUsersTable(users: User[]) {
    let renderContent = '';

    const { table } = ELEMENTS;

    users.map(({ name, username, email, website }) => {
        renderContent += ` 
        <tr>
            <td>${name}</td>
            <td>${username}</td>
            <td>${email}</td>
             <td>${website}</td>
        </tr>
        `;
    });

    if (table) {
        table.innerHTML = renderContent;
        openModalHandler();
        onCloseModal();
    }
}

function onClickColumnHeaderHandler(users: User[]) {
    const { columnHeaders } = ELEMENTS;
    columnHeaders.forEach((columnHeader) => {
        columnHeader.addEventListener('click', () => {
            const columnName =
                columnHeader.textContent?.toLocaleLowerCase() as keyof User;
            users.sort((prevUser, currUser) =>
                prevUser[columnName] < currUser[columnName] ? -1 : 1
            );
            renderUsersTable(users);
        });
    });
}

function openModalHandler() {
    const {
        modal,
        modalName,
        modalUserName,
        modalEmail,
        modalWebsite,
        columnHeaders,
    } = ELEMENTS;
    const tableRows = document.querySelectorAll('tbody tr');

    if (
        modal &&
        modalName &&
        modalUserName &&
        modalEmail &&
        modalWebsite &&
        columnHeaders
    ) {
        tableRows.forEach((row) => {
            row.addEventListener('click', () => {
                const rowData = getRowDataItem(row);
                modalName.innerHTML = rowData.name;
                modalUserName.innerHTML = 'Username: ' + rowData.userName;
                modalEmail.innerHTML = 'Email: ' + rowData.email;
                modalWebsite.innerHTML = 'Website: ' + rowData.website;

                modal.style.display = 'block';
            });
        });
    }

    function getRowDataItem(row: Element): {
        name: string;
        userName: string;
        email: string;
        website: string;
    } {
        const columns = row.querySelectorAll('td');
        const rowDataItem: {
            name: string;
            userName: string;
            email: string;
            website: string;
        } = {
            name: '',
            userName: '',
            email: '',
            website: '',
        };

        columnHeaders.forEach((header, index) => {
            const headerText = header.textContent?.toLocaleLowerCase();
            const value = columns[index].textContent;
            if (headerText) {
                rowDataItem[headerText] = value;
            }
        });
        return rowDataItem;
    }
}

function onCloseModal() {
    const { modal, modalClose } = ELEMENTS;
    if (modal && modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}
