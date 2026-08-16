import { getAdminSession } from "@/lib/admin/session";
import { subscribeLiveOrders } from "@/lib/admin/live";
import { getAdminStore } from "@/lib/admin/store";
import type { LiveOrderEvent } from "@/lib/admin/live-message";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function orderNotifications() {
  return getAdminStore()
    .notifications()
    .filter((item) => item.type === "order")
    .slice(0, 12);
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let lastId = orderNotifications()[0]?.id ?? "";

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: LiveOrderEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      send({ type: "snapshot", notifications: orderNotifications() });

      unsubscribe = subscribeLiveOrders((notification) => {
        lastId = notification.id;
        send({ type: "order", notification });
      });

      heartbeat = setInterval(() => {
        try {
          const newest = orderNotifications()[0];
          if (newest && newest.id !== lastId) {
            lastId = newest.id;
            send({ type: "order", notification: newest });
            return;
          }
          controller.enqueue(encoder.encode(`:hb\n\n`));
        } catch {
          /* stream already closed */
        }
      }, 1000);

      request.signal.addEventListener("abort", () => {
        unsubscribe();
        if (heartbeat) clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      unsubscribe();
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
