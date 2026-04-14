
    import React, { useState, useEffect, useRef } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Badge } from '@/components/ui/badge';
    import { Paperclip, Send, ArrowLeft, Search, UserPlus, MoreVertical, MessageSquare } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { useToast } from "@/components/ui/use-toast";

    const mockConversations = [
      { id: 'seller-1', name: 'Artisan Woodworks', lastMessage: 'Sure, I can customize it for you.', unread: 2, avatarSeed: 'artisan wood', type: 'seller' },
      { id: 'user-Alice', name: 'Alice Wonderland', lastMessage: 'Thanks for the update!', unread: 0, avatarSeed: 'alice person', type: 'user' },
      { id: 'seller-2', name: 'Retro Finds', lastMessage: 'Yes, it is genuine leather.', unread: 0, avatarSeed: 'retro shop', type: 'seller' },
      { id: 'user-Bob', name: 'Bob The Builder', lastMessage: 'Can I get a discount?', unread: 1, avatarSeed: 'bob person', type: 'user' },
    ];

    const mockMessages = {
      'seller-1': [
        { id: 1, sender: 'Artisan Woodworks', text: 'Hello! How can I help you with the Handcrafted Wooden Bowl?', time: '10:30 AM', self: true },
        { id: 2, sender: 'You', text: 'I was wondering if you could make it a bit larger?', time: '10:32 AM', self: false },
        { id: 3, sender: 'Artisan Woodworks', text: 'Sure, I can customize it for you.', time: '10:35 AM', self: true },
      ],
      'user-Alice': [
        { id: 1, sender: 'Alice Wonderland', text: 'Hey, how is my order #ORD-789 coming along?', time: 'Yesterday 2:00 PM', self: false },
        { id: 2, sender: 'You', text: 'Hi Alice, it has been shipped! Tracking: XYZ123', time: 'Yesterday 2:05 PM', self: true },
        { id: 3, sender: 'Alice Wonderland', text: 'Thanks for the update!', time: 'Yesterday 2:06 PM', self: false },
      ],
       'seller-2': [
        { id: 1, sender: 'Retro Finds', text: 'Yes, it is genuine leather.', time: '11:00 AM', self: true },
      ],
       'user-Bob': [
        { id: 1, sender: 'Bob The Builder', text: 'Can I get a discount?', time: '09:15 AM', self: false },
      ],
    };


    const ChatPage = () => {
      const { chatId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [conversations, setConversations] = useState(mockConversations);
      const [currentChat, setCurrentChat] = useState(null);
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');
      const [searchTerm, setSearchTerm] = useState('');
      const messagesEndRef = useRef(null);

      const handleNameClick = (chatPartner) => {
        if (!chatPartner) return;
        const { id, type } = chatPartner;
        let path = '';
        
        if (type === 'user') {
          // Assumes id is like 'user-Alice', navigates to '/user/Alice'
          path = `/user/${id.startsWith('user-') ? id.substring(5) : id}`;
        } else if (type === 'seller') {
          // Assumes id is like 'seller-1', navigates to '/seller/1'
          path = `/seller/${id.startsWith('seller-') ? id.substring(7) : id}`;
        }
    
        if (path) {
          navigate(path);
        } else {
          toast({
            title: "Navigation Error",
            description: "Could not determine the profile page for this contact.",
            variant: "destructive",
          });
        }
      };

      useEffect(() => {
        if (chatId) {
          const conversation = conversations.find(c => c.id === chatId);
          if (conversation) {
            setCurrentChat(conversation);
            setMessages(mockMessages[chatId] || []);
          } else {
            const isSellerChat = chatId.startsWith('seller-');
            const newChatName = isSellerChat ? chatId.replace('seller-', 'Seller ') : `User ${chatId}`;
            const newConversation = { id: chatId, name: newChatName, lastMessage: 'Start a conversation...', unread: 0, avatarSeed: newChatName, type: isSellerChat ? 'seller' : 'user' };
            if (!conversations.find(c => c.id === chatId)) {
              setConversations(prev => [newConversation, ...prev]);
            }
            setCurrentChat(newConversation);
            setMessages([]);
          }
        } else if (conversations.length > 0) {
        }
      }, [chatId, conversations, navigate]);

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      const handleSendMessage = () => {
        if (newMessage.trim() === '' || !currentChat) return;
        const newMsg = {
          id: messages.length + 1,
          sender: 'You',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          self: true,
        };
        setMessages(prev => [...prev, newMsg]);
        
        setTimeout(() => {
            const replyMsg = {
                id: messages.length + 2,
                sender: currentChat.name,
                text: `Thanks for your message! I'll get back to you soon. (Automated reply for "${newMessage.substring(0,20)}...")`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                self: false,
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 1000);

        setNewMessage('');
        setConversations(prev => prev.map(conv => 
            conv.id === currentChat.id ? { ...conv, lastMessage: newMessage } : conv
        ));
      };

      const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const selectConversation = (conv) => {
        navigate(`/chat/${conv.id}`);
        if (conv.unread > 0) {
            setConversations(prev => prev.map(c => c.id === conv.id ? {...c, unread: 0} : c));
        }
      };

      return (
        <div className="container mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row my-4 border rounded-lg shadow-xl overflow-hidden bg-card">
          <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-full md:w-1/3 lg:w-1/4 border-r bg-background/70 flex flex-col",
              currentChat && "hidden md:flex" 
            )}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Messages</h2>
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search chats..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center p-3 hover:bg-muted cursor-pointer border-b border-border/50",
                    currentChat?.id === conv.id && "bg-muted"
                  )}
                  onClick={() => selectConversation(conv)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://source.unsplash.com/100x100/?${conv.avatarSeed}`} alt={conv.name} />
                    <AvatarFallback>{conv.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-medium truncate">{conv.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground h-5 px-1.5 text-xs">{conv.unread}</Badge>
                  )}
                </div>
              ))}
              {filteredConversations.length === 0 && (
                <p className="p-4 text-center text-muted-foreground">No conversations found.</p>
              )}
            </ScrollArea>
          </motion.aside>

          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              "flex-1 flex flex-col bg-background",
              !currentChat && "hidden md:flex md:items-center md:justify-center" 
            )}
          >
            {currentChat ? (
              <>
                <header className="p-4 border-b flex items-center justify-between bg-background/90 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setCurrentChat(null)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10 mr-3">
                       <AvatarImage src={`https://source.unsplash.com/100x100/?${currentChat.avatarSeed}`} alt={currentChat.name} />
                       <AvatarFallback>{currentChat.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div onClick={() => handleNameClick(currentChat)} className="cursor-pointer">
                      <h2 className="text-lg font-semibold hover:underline">{currentChat.name}</h2>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </header>

                <ScrollArea className="flex-1 p-4 space-y-4 bg-gradient-to-br from-background to-muted/30">
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex items-end space-x-2 max-w-[75%]",
                        msg.self ? "ml-auto flex-row-reverse space-x-reverse" : ""
                      )}
                    >
                      {!msg.self && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://source.unsplash.com/100x100/?${currentChat.avatarSeed}`} alt={msg.sender} />
                           <AvatarFallback>{msg.sender.substring(0,1)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "p-3 rounded-lg shadow",
                          msg.self ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.self ? "text-primary-foreground/70 text-right" : "text-muted-foreground")}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <footer className="p-4 border-t bg-background/90 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Select a conversation to start chatting</p>
                <p className="text-sm">or find someone to talk to.</p>
              </div>
            )}
          </motion.main>
        </div>
      );
    };

    export default ChatPage;
