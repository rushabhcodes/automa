import { caller } from "@/trpc/server";

/**
 * Renders the Users page by fetching user data and displaying each user's name in a list.
 *
 * @returns A JSX element for the page containing a heading and an unordered list of user names.
 */
export default async function Home() {
  const { users } = await caller.getUsers();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}