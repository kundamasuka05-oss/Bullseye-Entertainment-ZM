import React, { useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  contentKey, 
  defaultText, 
  tag: Tag = 'div', 
  className = '' 
}) => {
  const { isEditMode, siteContent, updateContent } = useStore();
  const text = siteContent[contentKey] || defaultText;
  const elementRef = useRef<HTMLElement>(null);

  const handleBlur = () => {
    if (elementRef.current) {
      const newText = elementRef.current.innerText;
      if (newText !== text) {
        updateContent(contentKey, newText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== text) {
      elementRef.current.innerText = text;
    }
  }, [text]);

  if (isEditMode) {
    return (
      <Tag
        ref={elementRef as any}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} outline-none ring-2 ring-blue-400 ring-offset-2 rounded cursor-text bg-white/10 min-w-[20px] inline-block`}
      >
        {text}
      </Tag>
    );
  }

  return <Tag className={className}>{text}</Tag>;
};

export default EditableText;