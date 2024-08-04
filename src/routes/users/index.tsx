import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";

export const useGetUsers = routeLoader$(async () => {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany();

  return users;
});

export default component$(() => {
  const users = useGetUsers();

  return (
    <div class="flex flex-col gap-10">
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a>Users</a>
          </li>
        </ul>
      </div>
      <h1>Users's directory</h1>

      <div class="overflow-x-auto">
        <a href="/users/create" class="btn btn-primary float-right">
          Create
        </a>

        <table class="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.value.map(({ id, firstName, lastName, email }) => (
              <tr key={id}>
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{email}</td>
                <th>
                  <a href={`/users/${id}`}>
                    <button class="btn btn-ghost btn-xs">Details</button>
                  </a>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
