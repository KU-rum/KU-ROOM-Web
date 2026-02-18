import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { getChatbotAnswerApi } from "@apis/chatbot";
import Header from "@/shared/components/Header/Header";

import ChatInput from "../components/ChatInput/ChatInput";
import styles from "./ChatPage.module.css";

interface ChatType {
  content: string;
  type: "question" | "answer";
}

const ChatPage = () => {
  const { question: firstQuestion } = useLocation().state;

  const [inputText, setInputText] = useState(firstQuestion);
  const [chatHistory, setChatHistory] = useState<ChatType[]>([]);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const getChatbotAnswer = useCallback(
    async (question: string) => {
      setIsAnswerLoading(true);
      try {
        const answer = await getChatbotAnswerApi(question);
        setChatHistory((prev) => [
          ...prev,
          { content: answer, type: "answer" },
        ]);
        setIsAnswerLoading(false);
      } catch (error) {
        console.error("챗봇 답변 중 클라 측 오류", error);
      }
    },
    [setIsAnswerLoading, setChatHistory],
  );

  const handleChangeInputText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSendQuestion = useCallback(() => {
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      setInputText("");
      return;
    }
    setChatHistory((prev) => [
      ...prev,
      { content: trimmedText, type: "question" },
    ]);
    getChatbotAnswer(trimmedText);
    setInputText("");
  }, [inputText, getChatbotAnswer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    handleSendQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header>챗봇</Header>
      <div className={styles.ChatArea}>
        <span className={styles.ChatCaution}>
          개발 진행중인 기능으로 오류가 발생할 수 있습니다.
        </span>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={styles.ChatContianer}
            style={
              chat.type === "answer"
                ? {
                    color: "black",
                    background: "white",
                    alignSelf: "flex-start",
                  }
                : {
                    alignSelf: "flex-end",
                  }
            }
          >
            <ReactMarkdown>{chat.content}</ReactMarkdown>
          </div>
        ))}
        {isAnswerLoading && (
          <div
            className={styles.ChatContianer}
            style={{ color: "#9EAAB5", background: "white" }}
          >
            답변을 작성하는 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.InputSection}>
        <ChatInput
          inputText={inputText}
          isAnswerLoading={isAnswerLoading}
          handleChangeInputText={handleChangeInputText}
          handleSendQuestion={handleSendQuestion}
        />
      </div>
    </div>
  );
};

export default ChatPage;
