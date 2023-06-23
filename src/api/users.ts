import { User } from '../types/users';

export async function fetchUsers(): Promise<Array<User> | undefined> {
    const url = 'https://jsonplaceholder.typicode.com/users';

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error('Not found Users');
        }

        return await response.json();
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
