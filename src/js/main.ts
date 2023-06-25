import { User } from '../types/users';
import { fetchUsers } from '../api/users';
import { userDetailsTable } from '../templates/modalContent';
import { replacePlaceholders } from '../utils/replacePlaceholdersHtml';
import { userTableRow } from '../templates/usersTable';

const ELEMENTS: {
    table: HTMLTableSectionElement | null;
    columnHeaders: NodeListOf<HTMLTableCellElement>;
    modal: HTMLDivElement | null;
    modalContent: HTMLDivElement | null;
} = {
    table: document.querySelector('tbody'),
    columnHeaders: document.querySelectorAll('th'),
    modal: document.querySelector('.modal'),
    modalContent: document.querySelector('.modal-content'),
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
    const { table } = ELEMENTS;
    let renderContentHtml = '';

    users.map((user) => {
        renderContentHtml += replacePlaceholders(user, userTableRow);
    });
    if (table) {
        table.innerHTML = renderContentHtml;
        openModalHandler(users);
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

function openModalHandler(users: User[]) {
    const { modal, modalContent } = ELEMENTS;
    const tableRows = document.querySelectorAll('tbody tr');
    if (modal && modalContent) {
        tableRows.forEach((row) => {
            const rowId = row.getAttribute('data-id');
            if (rowId) {
                const userData = users.find((user) => user.id === +rowId);

                if (userData) {
                    row.addEventListener('click', () => {
                        const modalContentHtml = replacePlaceholders(
                            userData,
                            userDetailsTable
                        );

                        modalContent.insertAdjacentHTML(
                            'beforeend',
                            modalContentHtml
                        );
                        modal.style.display = 'block';
                        onCloseModal();
                    });
                }
            }
        });
    }
}

function onCloseModal() {
    const { modal, modalContent } = ELEMENTS;
    const modalClose = document.querySelector('.modal-close');

    if (modal && modalClose && modalContent) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modalContent.replaceChildren('');
        });
    }
}
