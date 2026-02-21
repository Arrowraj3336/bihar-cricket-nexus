const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const adminApi = async (
  action: string,
  password: string,
  body?: Record<string, unknown> | FormData,
) => {
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    "x-admin-password": password,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/admin-api?action=${action}`,
    {
      method: "POST",
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};
