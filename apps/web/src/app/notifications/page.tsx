"use client";
import { useState } from "react";

import { useReadManyNotificationsQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data } = useReadManyNotificationsQuery({ query: { limit, page } });
  const notifications = data?.notifications || [];
  const totalPages = data?.total || 0;

  return (
    <Dashboard title="Notifications">
      <Table
        data={notifications}
        title="Notifications"
        columns={[
          { key: "title", label: "Title" },
          { key: "message", label: "Message" },
          { key: "timeAgo", label: "Date" },
        ]}
        description="Here all of notification that you made before"
        pagination={{
          currentPage: page,
          onPageChange: (newPage) => {
            setPage(newPage);
          },
          totalPages,
        }}
        rowStyles={(row) => (row.isRead ? "bg-green-50" : "bg-orange-50")}
      />
    </Dashboard>
  );
};

export default NotificationPage;
