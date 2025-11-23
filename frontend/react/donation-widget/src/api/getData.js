export async function getData() {
  const res = await fetch("/mock.json");
  if (!res.ok) {
    const error = new Error(`Request failed: ${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error; // 这个会直接传到 .catch(err);
  }
  return res.json();
}
