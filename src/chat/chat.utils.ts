interface SocketMessage {
  event: string;
  data: any;
}

export function buildMessage(event: string, data: any): SocketMessage {
  const broadCastMessage = {
    event,
    data,
  };
  return broadCastMessage;
}

export function buildChatMessage(user: any, message: string): SocketMessage {
  const chatMessage = buildMessage('message', {
    nickname: user.nickname,
    userId: user._id,
    message,
  });
  return chatMessage;
}

export function buildChatSystemMessage(message: string): SocketMessage {
  const chatMessage = buildMessage('system', message);
  return chatMessage;
}
