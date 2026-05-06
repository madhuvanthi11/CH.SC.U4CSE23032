"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Select, MenuItem,
  FormControl, InputLabel, Chip, Box,
  CircularProgress, Card, CardContent, Pagination,
} from "@mui/material";
import { fetchNotifications, TOKEN, Notification } from "../lib/api";
import { Log } from "../lib/logger";

const TYPE_COLOR: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Log("frontend", "info", "page", "All notifications page loaded", TOKEN);
      try {
        const data = await fetchNotifications({
          limit: 10,
          page,
          notification_type: filter || undefined,
        });
        setNotifications(data);
        await Log("frontend", "info", "api", `Loaded ${data.length} notifications`, TOKEN);
      } catch (e: any) {
        await Log("frontend", "error", "api", `Failed to load: ${e.message}`, TOKEN);
      }
      setLoading(false);
    })();
  }, [filter, page]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
        All Notifications
      </Typography>

      <FormControl size="small" sx={{ minWidth: 160, mb: 3 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={filter}
          label="Filter by Type"
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {loading ? <CircularProgress /> : (
        <>
          {notifications.map((n) => (
            <Card
              key={n.ID}
              onClick={() => setViewed((prev) => new Set([...prev, n.ID]))}
              sx={{
                mb: 2,
                cursor: "pointer",
                border: viewed.has(n.ID) ? "1px solid #ccc" : "1px solid #1976d2",
                opacity: viewed.has(n.ID) ? 0.6 : 1,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{n.Message}</Typography>
                  <Chip label={n.Type} color={TYPE_COLOR[n.Type]} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.Timestamp).toLocaleString()} —{" "}
                  {viewed.has(n.ID) ? "✔ Viewed" : "🔵 New"}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Pagination
            count={5}
            page={page}
            onChange={(_, v) => setPage(v)}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Container>
  );
}