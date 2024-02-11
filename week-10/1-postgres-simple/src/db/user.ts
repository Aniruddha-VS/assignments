import { client } from "..";

/*
 * Should insert into the users table
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */
export async function createUser(
  username: string,
  password: string,
  name: string
) {
  await client.query(
    `INSERT INTO users(username, password, name) 
    VALUES($1, $2, $3) 
    RETURNING *`,
    [username, password, name]
  );

  const result = await client.query(`SELECT * FROM users`);

  return result.rows[0];
}

/*
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */
export async function getUser(userId: number) {
  const result = await client.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows[0];
}
