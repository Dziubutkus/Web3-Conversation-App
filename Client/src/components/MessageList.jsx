import React, { useRef, useEffect } from "react";
import useStreamMessages from "../hooks/useStreamMessages";
import MessageCard from "./MessageCard";

const MessageList = ({ isNewMsg, convoMessages, selectedConvo }) => {
  useStreamMessages(selectedConvo);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    console.log("TEST")
  }

  useEffect(() => {
    scrollToBottom()
  }, [convoMessages]);

  return (
    <div className="msgs-container flex flex-dir-col">
      <div className="mt-auto">
        {!isNewMsg &&
          convoMessages.map((msg) => {
            return <MessageCard key={msg.id} msg={msg} />;
          })}
      </div>
      <div ref={messagesEndRef}/>
    </div>
  );
};

export default MessageList;
