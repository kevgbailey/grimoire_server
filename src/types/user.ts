export default interface User {
    id: number;
    username: string;
    password: string;
    authToken: string | null;
}