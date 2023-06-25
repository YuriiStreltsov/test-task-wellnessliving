import { User } from '../types/users';

export async function fetchUsers(): Promise<Array<User> | undefined> {
    const url = 'https://jsonplaceholder.typicode.com/users';

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error('Not found Users');
        }
        const users = await response.json();
        const updatedUsersFields: User[] = users.map((user) => ({
            ...user,
            company: {
                companyName: user.company.name,
                catchPhrase: user.company.catchPhrase,
                bs: user.company.bs,
            },
        }));

        return updatedUsersFields;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
