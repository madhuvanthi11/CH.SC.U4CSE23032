"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Slider, Box,
  Card, CardContent, Chip, CircularProgress,
} from "@mui/material";
import { fetchAllNotifications, computePriority, TOKEN, Notification } from "../../lib/api";
import { Log } from "../../lib/logger";

const TYPE_COLOR: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export default function PriorityPage() {
  const [all, setAll] = useState<Notification[]>([]);
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Log("frontend", "info", "page", "Priority inbox page loaded", TOKEN);
      try {
        const data = await fetchAllNotifications();
        console.log("Total fetched:", data.length);
        setAll(data);
        await Log("frontend", "info", "state", `Fetched ${data.length} notifications for priority`, TOKEN);
      } catch (e: any) {
        console.error("Error:", e.message);
        setError(e.message);
        await Log("frontend", "error", "api", `Priority fetch failed: ${e.message}`, TOKEN);
      }
      setLoading(false);
    })();
  }, []);

  const priority = computePriority(all, topN);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
        Priority Inbox
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Show Top {topN} notifications</Typography>
        <Slider
          value={topN}
          min={5}
          max={20}
          step={5}
          marks
          onChange={(_, v) => setTopN(v as number)}
          sx={{ maxWidth: 300 }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : all.length === 0 ? (
        <Typography color="error">
          No notifications found! Token may be expired — run getToken.js and update api.ts
        </Typography>
      ) : (
        priority.map((n, i) => (
          <Card
            key={n.ID}
            onClick={() => setViewed((prev) => new Set([...prev, n.ID]))}
            sx={{
              mb: 2,
              cursor: "pointer",
              border: viewed.has(n.ID) ? "1px solid #ccc" : "2px solid #9c27b0",
              opacity: viewed.has(n.ID) ? 0.6 : 1,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">#{i + 1} {n.Message}</Typography>
                <Chip label={n.Type} color={TYPE_COLOR[n.Type]} size="small" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.Timestamp).toLocaleString()} —{" "}
                {viewed.has(n.ID) ? "✔ Viewed" : "🔵 New"}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}