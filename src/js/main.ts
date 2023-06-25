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
    tableBody: HTMLTableSectionElement;
    tableHead: HTMLTableCaptionElement;
    modal: HTMLDivElement;
    modalContent: HTMLDivElement;
    modalClose: HTMLButtonElement;
} = {
    tableBody: document.querySelector('tbody')!,
    tableHead: document.querySelector('thead')!,
    modal: document.querySelector('.modal')!,
    modalContent: document.querySelector('.modal-content')!,
    modalClose: document.querySelector('.modal-close')!,
};

function init() {
    document.addEventListener('DOMContentLoaded', async () => {
        const users = await fetchUsers();
        if (!users) {
            return;
        }
        renderUsersTable(users);
        sortUserTableByHeaderName(users);
        openModal(users);
    });
}

init();

function renderUsersTable(users: User[]) {
    const { tableBody } = ELEMENTS;
    let renderContentHtml = '';

    users.map((user) => {
        renderContentHtml += replacePlaceholders(user, userTableRow);
    });

    tableBody.innerHTML = renderContentHtml;
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

function openModal(users: User[]) {
    const { tableBody, modal, modalContent } = ELEMENTS;

    tableBody?.addEventListener('click', (event) => {
        const target = event.target as HTMLTableElement;
        const userRow = target.parentElement!;
        const userId = userRow?.getAttribute('data-id') as string;

        const userData = users.find((user) => user.id === +userId);
        if (userData) {
            const modalContentHtml = replacePlaceholders(
                userData,
                userDetailsTable
            );

            modalContent.insertAdjacentHTML('beforeend', modalContentHtml);
            modal.style.display = 'block';
        }
        onCloseModal();
    });
}

function onCloseModal() {
    const { modal, modalContent, modalClose } = ELEMENTS;

    function handleCloseModalClick() {
        modalContent.replaceChildren('');
        modal.style.display = 'none';

        modalClose.removeEventListener('click', handleCloseModalClick);
    }

    modalClose.addEventListener('click', handleCloseModalClick);
}
