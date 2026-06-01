"use client";

import { useState } from "react";
import { Bold, Italic, Link, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ComposeFormProps {
  onClose: () => void;
}

export function ComposeForm({ onClose }: ComposeFormProps) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    if (!to.trim()) {
      toast.error("Please enter at least one recipient");
      return;
    }
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    console.log("Email sent:", { to, cc, subject, body });
    toast.success("Email sent successfully");
    onClose();
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved");
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-3">
          {/* To */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground w-10 shrink-0">
                To
              </Label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="border-0 border-b rounded-none px-0 h-8 bg-transparent focus-visible:ring-0 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCc(!showCc)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {showCc ? "Hide CC" : "CC"}
              </button>
            </div>
          </div>

          {/* CC */}
          {showCc && (
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground w-10 shrink-0">
                CC
              </Label>
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com"
                className="border-0 border-b rounded-none px-0 h-8 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
          )}

          <Separator />

          {/* Subject */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-14 shrink-0">
              Subject
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="border-0 border-b rounded-none px-0 h-8 bg-transparent focus-visible:ring-0 text-sm font-medium"
            />
          </div>

          <Separator />

          {/* Body */}
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            className="min-h-[220px] border-0 resize-none px-0 bg-transparent focus-visible:ring-0 text-sm"
          />
        </div>
      </ScrollArea>

      {/* Toolbar */}
      <div className="border-t px-4 py-2 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground"
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground"
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground"
        >
          <Link className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground"
        >
          <Paperclip className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex gap-2">
        <Button onClick={handleSend} className="flex-1 gap-2">
          Send
        </Button>
        <Button variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-destructive hover:text-destructive"
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
