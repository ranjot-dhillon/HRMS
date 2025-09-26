import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Paperclip,
  X,
  Settings,
  ChevronDown,
  Loader2,
  Mic,
  MessageSquarePlus,
  CornerDownLeft,
  Trash2,
  Sparkles,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/**
 * HRMS Chatbot Widget — drop-in component
 *
 * ✅ Modern floating widget with a polished chat panel
 * ✅ Tailwind + shadcn/ui + framer-motion + lucide-react
 * ✅ Message bubbles, quick prompts, attachments, typing indicator
 * ✅ "Use employee context" toggle (send org/user metadata)
 * ✅ Pluggable onSend handler to connect your backend (Rasa/Llama/LLM API)
 * ✅ Accessible, responsive, mobile-friendly, dark-mode aware
 *
 * Integration:
 * <ChatbotWidget org={{ name: "Techmaa" }} user={{ id: "u123", name: "Keerat" }} onSend={async (payload) => { ...call your API... }} />
 */

const sampleSuggestions = [
  "Show my leave balance",
  "Apply sick leave for tomorrow",
  "Generate salary slip for July",
  "What are WFH policies?",
];

const initialMessages = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hi! I’m your HR Assistant. I can help with leave, payroll, attendance, policies and more. How can I help today?",
    ts: new Date().toISOString(),
  },
];

function MessageBubble({ role, content, ts }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
        isUser
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : "bg-muted text-foreground rounded-bl-sm"
      }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        <div className={`mt-1 text-[10px] opacity-70 ${isUser ? "text-primary-foreground" : "text-foreground"}`}>
          {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 text-muted-foreground text-xs">
      <span className="inline-flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.2s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce "></span>
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.2s]"></span>
      </span>
      typing…
    </div>
  );
}

export default function ChatbotWidget({
  org = { name: "Your Org" },
  user = { id: "emp-001", name: "Employee" },
  onSend = async (payload) => {
    // Mock reply — replace with your API call
    await new Promise((r) => setTimeout(r, 900));
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Got it! You said: "${payload.text}".\n\n(🔌 Connect this to your HRMS backend to fetch real data like leave balance, payroll, etc.)`,
      ts: new Date().toISOString(),
    };
  },
  placement = "bottom-right",
}) {
  const [open, setOpen] = useState(false);
  const [maximize, setMaximize] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [pending, setPending] = useState(false);
  const [text, setText] = useState("");
  const [useContext, setUseContext] = useState(true);
  const [files, setFiles] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending, open]);

  const containerPos = useMemo(() => {
    const base = "fixed z-50 m-4";
    const map = {
      "bottom-right": `${base} bottom-0 right-0`,
      "bottom-left": `${base} bottom-0 left-0`,
      "top-right": `${base} top-0 right-0`,
      "top-left": `${base} top-0 left-0`,
    };
    return map[placement] ?? map["bottom-right"];
  }, [placement]);

  function clearChat() {
    setMessages(initialMessages);
  }

  async function handleSend(customText) {
    const content = (customText ?? text).trim();
    if (!content && files.length === 0) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: content || (files.length ? `${files.length} attachment(s)` : ""),
      ts: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setText("");

    const payload = {
      text: content,
      files, // Array<File>
      meta: useContext
        ? {
            org,
            user,
            // Example of helpful HRMS context you might include
            scopes: ["leave", "payroll", "attendance", "policy"],
          }
        : {},
    };

    try {
      setPending(true);
      const reply = await onSend(payload);
      setMessages((m) => [...m, reply]);
      setFiles([]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn’t reach the assistant right now. Please try again.",
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={containerPos}>
      {/* Floating Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setOpen((v) => !v)}
              className="relative inline-flex items-center gap-2 rounded-full shadow-lg bg-primary text-primary-foreground px-4 py-3 hover:shadow-xl focus:outline-none"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bot className="h-5 w-5" />
              <span className="hidden sm:block font-medium">HR Assistant</span>
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>Chat with your HR assistant</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Card className={`mt-3 w-[22rem] sm:w-[26rem] ${maximize ? "h-[80vh]" : "h-[34rem]"} rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
              <CardHeader className="p-4 flex flex-col gap-2 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold leading-tight">HR Assistant</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                        Online • {org?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setMaximize((v) => !v)}>
                            {maximize ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{maximize ? "Minimize" : "Maximize"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Assistant Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={clearChat}>
                          <Trash2 className="h-4 w-4 mr-2" />Clear conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUseContext((v) => !v)}>
                          <ShieldCheck className="h-4 w-4 mr-2" />Use employee context
                          <div className="ml-auto"><Switch checked={useContext} /></div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Sparkles className="h-4 w-4 mr-2" />Improve responses
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1">
                    <MessageSquarePlus className="h-3.5 w-3.5" /> New conversation
                  </Badge>
                  <Badge variant="outline">v1.0</Badge>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Suggestions */}
                <div className="px-3 pt-3 pb-1 flex flex-wrap gap-2">
                  {sampleSuggestions.map((s) => (
                    <Button key={s} variant="secondary" size="sm" className="rounded-full" onClick={() => handleSend(s)}>
                      {s}
                    </Button>
                  ))}
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3">
                  <div className="space-y-3 py-3">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} role={m.role} content={m.content} ts={m.ts} />
                    ))}
                    {pending && (
                      <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-2xl px-3 py-2 bg-muted text-foreground rounded-bl-sm">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attachments preview */}
                {files.length > 0 && (
                  <div className="px-3 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(files).map((f, idx) => (
                        <div key={idx} className="text-xs px-2 py-1 rounded-md bg-muted flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5" />{f.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator />

              {/* Composer */}
              <CardFooter className="p-3">
                <div className="w-full rounded-xl border bg-background">
                  <div className="px-2 pt-2">
                    <Textarea
                      placeholder="Ask about leave, salary, policies…"
                      className="min-h-[56px] max-h-[160px] resize-none border-0 focus-visible:ring-0"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-1.5">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mic className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Voice (coming soon)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <label className="inline-flex">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setFiles(Array.from(e.target.files || []))}
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </label>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Image input (soon)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-2 pr-1">
                        <Switch checked={useContext} onCheckedChange={setUseContext} id="ctx" />
                        <Label htmlFor="ctx" className="text-xs text-muted-foreground">Use context</Label>
                      </div>

                      <Button onClick={() => handleSend()} className="h-8 px-3">
                        {pending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <span className="hidden sm:inline">Send</span>
                            <CornerDownLeft className="h-4 w-4 sm:ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
