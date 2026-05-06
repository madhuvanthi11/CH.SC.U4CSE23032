export const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaC5zYy51NGNzZTIzMDMyQGNoLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjU2ODksImlhdCI6MTc3ODA2NDc4OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjZkM2M2ZjFjLWQ3NGQtNDViYi1hNzdiLWU4MmJhMDJmZWYwYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hZGh1dmFudGhpIiwic3ViIjoiNDM3MGRkMDMtODgxNy00YzBlLTk3ZjQtMGY2MjUyNjY2ODY1In0sImVtYWlsIjoiY2guc2MudTRjc2UyMzAzMkBjaC5zdHVkZW50cy5hbXJpdGEuZWR1IiwibmFtZSI6Im1hZGh1dmFudGhpIiwicm9sbE5vIjoiY2guc2MudTRjc2UyMzAzMiIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjQzNzBkZDAzLTg4MTctNGMwZS05N2Y0LTBmNjI1MjY2Njg2NSIsImNsaWVudFNlY3JldCI6ImF2WFh0QnNaek1aRFdCZGQifQ.T2bQ9P8pv1vZi8R9vw7r1D9p72tn44gwZSeCJr3oszc";

const BASE = "/api";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
  _score?: number;
}

export async function fetchNotifications({
  limit,
  page,
  notification_type,
}: {
  limit?: number;
  page?: number;
  notification_type?: string;
} = {}): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(Math.min(limit, 10)));
  if (page) params.set("page", String(page));
  if (notification_type) params.set("notification_type", notification_type);

  const res = await fetch(`${BASE}/notifications?${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.notifications || [];
}

export async function fetchAllNotifications(): Promise<Notification[]> {
  const all: Notification[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 5; page++) {
    const data = await fetchNotifications({ limit: 10, page });
    if (data.length === 0) break;
    for (const item of data) {
      if (!seen.has(item.ID)) {
        seen.add(item.ID);
        all.push(item);
      }
    }
  }
  return all;
}

export function computePriority(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  return notifications
    .map((item) => ({
      ...item,
      _score:
        (TYPE_WEIGHT[item.Type] || 0) * 1e13 +
        new Date(item.Timestamp).getTime(),
    }))
    .sort((a, b) => (b._score || 0) - (a._score || 0))
    .slice(0, n);
}