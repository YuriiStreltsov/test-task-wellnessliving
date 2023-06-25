import { User } from '../types/users';
import { fetchUsers } from '../api/users';
import { userDetailsTable } from '../templates/modalContent';
import { replacePlaceholders } from '../utils/replacePlaceholdersHtml';
import { userTableRow } from '../templates/usersTable';
import {
    removeClassesFromNotTargetElement,
    toggleArrowClass,
} from '../utils/actionsArrowClass';
import { sortTableByAlphanumeric } from '../utils/sortTable';

const ELEMENTS: {
    table: HTMLTableSectionElement | null;
    tableHead: HTMLTableCaptionElement | null;
    columnHeaders: NodeListOf<HTMLTableCaptionElement>;
    modal: HTMLDivElement | null;
    modalContent: HTMLDivElement | null;
} = {
    table: document.querySelector('tbody'),
    tableHead: document.querySelector('thead'),
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
        sortUserTableByHeaderName(users);
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

function sortUserTableByHeaderName(users: User[]) {
    const { tableHead } = ELEMENTS;

    tableHead?.addEventListener('click', (event) => {
        const headersTh = (
            event.currentTarget as HTMLTableElement
        ).querySelectorAll('th');

        const targetHeader = event.target as HTMLTableCaptionElement;

        const columnName =
            targetHeader.textContent?.toLocaleLowerCase() as keyof User;

        removeClassesFromNotTargetElement(headersTh, targetHeader, [
            'arrow-up',
            'arrow-down',
        ]);

        toggleArrowClass(targetHeader);

        const sortedUsers = targetHeader.classList.contains('arrow-down')
            ? sortTableByAlphanumeric(users, columnName, 'increasing')
            : sortTableByAlphanumeric(users, columnName, 'decreasing');

        renderUsersTable(sortedUsers);
    });
}
