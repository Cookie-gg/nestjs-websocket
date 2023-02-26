'use client';

import { socket } from '~/libs/socket';
import styles from '~/styles/components/Chat.module.css';
import React, { useState, useEffect, useCallback, FormEvent } from 'react';

type ChatLog = {
  socketId: string;
  uname: string;
  time: string;
  text: string;
};

export const Chat: React.FC = () => {
  const [chatLog, setChatLog] = useState<ChatLog[]>([]);

  useEffect(() => {
    //接続が完了したら、発火
    socket.on('connect', () => {
      console.log('接続ID : ', socket.id);
    });

    if (socket.connected) {
      return () => {
        console.log('切断');
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //サーバーからのチャット情報のプッシュを感知→反映
    socket.on('chatToClient', (chat: ChatLog) => {
      console.log('chat受信', chat);
      setChatLog((prev) => Array.from(new Set([...prev, chat])));
    });
  }, []);

  //現在時刻取得
  const getNow = useCallback((): string => {
    const datetime = new Date();
    return `${datetime.getFullYear()}/${
      datetime.getMonth() + 1
    }/${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
  }, []);

  //チャット送信
  const sendChat = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      const formData = Object.fromEntries(
        [...new FormData(e.currentTarget)].filter(
          (el): el is [string, string] => !!el[1] && typeof el[1] === 'string',
        ),
      );

      console.log('送信');
      console.log(formData);
      socket.emit('chatToServer', {
        uname: formData.uname,
        text: formData.message,
        time: getNow(),
      });
      e.currentTarget.reset();
    },
    [getNow],
  );

  return (
    <>
      <div className={styles._}>
        <ul className={styles.chats}>
          {chatLog.map((log, idx) => (
            <li
              key={idx}
              className={`${log.socketId === socket.id && styles.me}`}
            >
              <div className={styles.name}>{log.uname}</div>
              <div className={styles.message}>{log.text}</div>
            </li>
          ))}
        </ul>
        <form onSubmit={sendChat}>
          <input name="uname" placeholder="username" required />
          <input name="message" placeholder="message" required />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12.815 12.197l-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395Z"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};
