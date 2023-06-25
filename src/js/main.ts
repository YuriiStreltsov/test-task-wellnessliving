import { User } from '../types/users';
import { fetchUsers } from '../api/users';

import { newUserForm, userDetailsTable, userTableRow } from '../templates';
import { replacePlaceholders } from '../utils/replacePlaceholdersHtml';
import {
    removeClassesFromNotTargetElement,
    toggleArrowClass,
} from '../utils/actionsArrowClass';
import { sortTableByAlphabetically } from '../utils/sortTable';

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
        onShowUserDetails(users);
        onShowAddUserModal(users);
    });
}

init();

function renderUsersTable(users: User[]) {
    const { tableBody } = ELEMENTS;
    let renderContentHtml = '';

    users.map((user) => {
        renderContentHtml += replacePlaceholders(userTableRow, user);
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
            ? sortTableByAlphabetically(users, columnName, 'increasing')
            : sortTableByAlphabetically(users, columnName, 'decreasing');

        renderUsersTable(sortedUsers);
    });
}

function onShowUserDetails(users: User[]) {
    const { tableBody, modal, modalContent } = ELEMENTS;

    tableBody?.addEventListener('click', (event) => {
        const target = event.target as HTMLTableElement;
        const userRow = target.parentElement!;
        const userId = userRow?.getAttribute('data-id') as string;

        const userData = users.find((user) => user.id === +userId)!;
        if (userData) {
            openModal(userDetailsTable, userData);
        }
    });
}

function onShowAddUserModal(users: User[]) {
    const addNewUserButton = document.querySelector('.addUser');

    addNewUserButton?.addEventListener('click', showNewUserForm);

    function showNewUserForm() {
        openModal(newUserForm);
        const form = document.querySelector(
            '#add-user-form'
        ) as HTMLFormElement;
        submitUserForm(form, users);
    }
}

function openModal(
    template: string,
    templateObjectVariables?: Record<string, any>
) {
    const { modal, modalContent, modalClose } = ELEMENTS;

    const modalContentHtml = replacePlaceholders(
        template,
        templateObjectVariables
    );

    modalContent.insertAdjacentHTML('beforeend', modalContentHtml);
    modal.style.display = 'block';

    modalClose.addEventListener('click', onCloseModal);
}

function onCloseModal() {
    const { modal, modalContent, modalClose } = ELEMENTS;

    modalContent.replaceChildren('');
    modal.style.display = 'none';

    modalClose.removeEventListener('click', onCloseModal);
}

function submitUserForm(form: HTMLFormElement, users: User[]) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const obj = {};

        const userForm = event.target as HTMLFormElement;

        const formData = new FormData(userForm);

        for (const key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        users.push(obj as User);
        onCloseModal();
        renderUsersTable(users);
    });
}
