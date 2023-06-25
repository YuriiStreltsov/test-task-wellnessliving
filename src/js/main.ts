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
        sortTableHandler(users);
        showUserDetailsHandler(users);
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

function sortTableHandler(users: User[]) {
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

function showUserDetailsHandler(users: User[]) {
    const { tableBody } = ELEMENTS;

    function onClickTableBodyRowHandler(event: Event) {
        const target = event.target as HTMLTableElement;
        const userRow = target.parentElement!;
        const userId = userRow?.getAttribute('data-id') as string;

        const userData = users.find((user) => user.id === +userId)!;
        if (userData) {
            openModal(userDetailsTable, userData);
            removeUserHandler(users, userId);
        }
    }

    tableBody?.addEventListener('click', onClickTableBodyRowHandler);
}

function onShowAddUserModal(users: User[]) {
    const addNewUserButton = document.querySelector('.addUser');

    addNewUserButton?.addEventListener('click', showNewUserFormHandler);

    function showNewUserFormHandler() {
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
    modal.classList.add('show');

    modalClose.addEventListener('click', onCloseModal);
}

function onCloseModal() {
    const { modal, modalContent, modalClose } = ELEMENTS;

    modalContent.replaceChildren('');
    modal.classList.remove('show');

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

        obj['id'] = Date.now() + Math.random();

        users.push(obj as User);

        onCloseModal();

        renderUsersTable(users);
    });
}

function removeUserHandler(users: User[], userId: string) {
    const removeButton = document.querySelector(
        '.remove-button'
    ) as HTMLButtonElement;

    function onClickRemoveButton(event: MouseEvent) {
        const userIndex = users.findIndex((user) => user.id === +userId);

        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }
        onCloseModal();
        renderUsersTable(users);
    }

    removeButton?.addEventListener('click', onClickRemoveButton);
}
