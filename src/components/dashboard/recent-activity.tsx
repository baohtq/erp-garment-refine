"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn A",
      avatar: "/avatars/user1.png",
      initials: "NA"
    },
    action: "đã thêm bài viết mới",
    target: "Xu hướng thời trang mùa hè 2023",
    date: "10 phút trước",
    type: "blog"
  },
  {
    id: 2,
    user: {
      name: "Trần Thị B",
      avatar: "/avatars/user2.png",
      initials: "TB"
    },
    action: "đã cập nhật banner",
    target: "Trang chủ",
    date: "1 giờ trước",
    type: "image"
  },
  {
    id: 3,
    user: {
      name: "Lê Văn C",
      avatar: "/avatars/user3.png",
      initials: "LC"
    },
    action: "đã trả lời",
    target: "yêu cầu liên hệ từ khách hàng Công ty XYZ",
    date: "2 giờ trước",
    type: "contact"
  },
  {
    id: 4,
    user: {
      name: "Phạm Thị D",
      avatar: "/avatars/user4.png",
      initials: "PD"
    },
    action: "đã thêm",
    target: "vị trí Nhân viên Marketing",
    date: "Hôm qua, 15:30",
    type: "recruitment"
  },
  {
    id: 5,
    user: {
      name: "Hoàng Văn E",
      avatar: "/avatars/user5.png",
      initials: "HE"
    },
    action: "đã cập nhật",
    target: "thông tin công ty",
    date: "Hôm qua, 10:15",
    type: "company"
  }
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg border p-3"
        >
          <Avatar>
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.date}</p>
          </div>
          {activity.type === "blog" && (
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          )}
          {activity.type === "image" && (
            <div className="h-2 w-2 rounded-full bg-green-500" />
          )}
          {activity.type === "contact" && (
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          )}
          {activity.type === "recruitment" && (
            <div className="h-2 w-2 rounded-full bg-purple-500" />
          )}
          {activity.type === "company" && (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      ))}
    </div>
  );
} 