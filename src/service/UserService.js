

const BASE_URL = "https://libraray-management-4ikn.onrender.com";

/**
 * @param {number|string} id
 */
export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load profile. Please try again.");
  }
  return res.json();
}

/**
 * @param {number|string} id
 * @param {object} changes - partial fields to update
 */
export async function updateUser(id, changes) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) {
    throw new Error("Failed to save changes. Please try again.");
  }
  return res.json();
}

/**

 * @param {number|string} id
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export async function changePassword(id, currentPassword, newPassword) {
  const user = await getUserById(id);

  if (user.password !== currentPassword) {
    throw new Error("CURRENT_PASSWORD_MISMATCH");
  }

  return updateUser(id, { password: newPassword });
}
