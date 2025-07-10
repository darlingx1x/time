import React from "react";

// TODO: Получать данные пользователя из контекста или props
const user = {
  name: "Пользователь",
  avatar: "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&rounded=true"
};

export default function TopbarProfile() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={user.avatar}
        alt="Аватар"
        className="w-10 h-10 rounded-full shadow-md border-2 border-accent"
      />
      <span className="font-semibold text-text text-base">{user.name}</span>
    </div>
  );
} 