import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = request.headers.get("authorization") || "";

  const params = new URLSearchParams();
  
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const notification_type = searchParams.get("notification_type");
  
  if (limit) params.set("limit", limit);
  if (page) params.set("page", page);
  if (notification_type) params.set("notification_type", notification_type);

  console.log("Fetching notifications with params:", params.toString());

  const res = await fetch(`http://20.207.122.201/evaluation-service/notifications?${params}`, {
    headers: { 
      Authorization: token,
      "Content-Type": "application/json"
    },
  });

  const data = await res.json();
  console.log("Notifications response:", JSON.stringify(data).slice(0, 200));
  return NextResponse.json(data);
}