import UserManagement from "@/components/pages/admin/UserManagement";
import { getUsers } from "./actions";

export default async function UsersPage() {
    const users = await getUsers();

    return <UserManagement initialUsers={users} />;
}
