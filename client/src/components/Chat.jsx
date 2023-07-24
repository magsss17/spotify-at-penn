
/* eslint-disable react/no-array-index-key */

import React, { useState, useRef, useEffect } from 'react';
import {
  Tooltip, Button, Textarea, Avatar, Badge, Title, Paper, Container, Center, Stack, NumberInput,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  getMessages, getSockets, newConversation, updateMessages,
} from '../api/getMessages';
import { getFirstName } from '../api/getUserData';

function Chat() {
  const currentUser = window.sessionStorage.getItem('sessionId');
  const [userInitial, setUserInitial] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messageContainerRef = useRef(null);
  const [socket, setSocket] = useState(1);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSocketChange = (n) => {
    getSockets().then((sockets) => {
      if (sockets.includes(n)) {
        setSocket(n);
        getMessages(socket).then((arr) => {
          setMessages(arr);
        });
      } else {
        newConversation(n).then(() => {
          setSocket(n);
          getMessages(socket).then((arr) => {
            setMessages(arr);
          });
        });
      }
    });
  };

  const handleSendMessage = async () => {
    const newMessage = { text: inputValue, sender: currentUser };
    if (newMessage.text === '') return;

    getMessages(socket).then((arr) => {
      setMessages(arr);
    });

    updateMessages(socket, [...messages, newMessage]).then(() => {
      setMessages([...messages, newMessage]);
      setInputValue('');
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (window.sessionStorage.getItem('sessionId') === null || window.sessionStorage.getItem('accessToken') === null) {
      navigate('/login');
    }
    // Get initial (socket 1) messages from the server and display
    getMessages(1).then((arr) => {
      setMessages(arr);
    });
    getFirstName(currentUser).then((name) => {
      setUserInitial(name[0].toUpperCase());
    });
  }, []);

  useEffect(() => {
    // Load new messages when socket changes
    getMessages(socket).then((arr) => {
      setMessages(arr);
    });
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom of the message container after a new message is added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Title
        align="center"
        size={60}
        my={25}
        sx={(theme) => ({
          fontWeight: 900,
        })}
      >
        Chat with friends!
      </Title>
      <Center>
        <Stack>
          <NumberInput
            defaultValue={1}
            min={1}
            max={10}
            placeholder="Socket Number (1-10)"
            label="Choose your chat room"
            value={socket}
            onChange={handleSocketChange}
            withAsterisk
          />
          <Paper w={600} withBorder shadow="md" p={30} radius="md">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                maxHeight: '300px',
                minHeight: '300px',
                overflow: 'auto',
              }}
              ref={messageContainerRef}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === currentUser ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  {message.sender !== currentUser && (
                    <Tooltip label={message.sender} position="left">
                      <Avatar style={{ marginRight: '8px' }}>
                        {message.sender[0].toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  )}
                  <Badge color={message.sender === currentUser ? 'gray' : 'teal'}>
                    {message.text}
                  </Badge>
                  {message.sender === currentUser && (
                    <Tooltip label={message.sender} position="right">
                      <Avatar style={{ marginLeft: '8px' }}>
                        {userInitial}
                      </Avatar>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                style={{ flex: '1', marginRight: '8px' }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </Paper>
        </Stack>
      </Center>

    </>
  );
}

export default Chat;
