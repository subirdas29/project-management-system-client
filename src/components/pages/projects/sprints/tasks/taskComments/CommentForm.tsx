'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CommentForm({
  onSubmit,
  placeholder = 'Write a comment…',
  initialValue = '',
}: {
  onSubmit: (text: string) => void;
  placeholder?: string;
  initialValue?: string;
}) {
  const [text, setText] = useState(initialValue);

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />

      <div className="flex justify-end">
        <Button
          size="sm"
       
          disabled={!text.trim()}
          onClick={() => {
            onSubmit(text);
            setText('');
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
