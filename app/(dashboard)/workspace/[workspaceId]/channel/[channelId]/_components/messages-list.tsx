import { MessageItem } from "./message/message-item";

const messages = [
  {
    id: 1,
    message: "Hello how are you my friend",
    date: new Date(),
    avatar: "https://avatars.githubusercontent.com/u/107743711?v=4",
    userName: "John Doe",
  },
];

export const MessagesList = () => {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
      </div>
    </div>
  );
};
