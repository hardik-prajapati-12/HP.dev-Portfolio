import React from 'react';

export default function EmojiIcon({ emoji, size = 18, color, style = {}, className = '' }) {
  if (!emoji) return null;
  const cleanEmoji = typeof emoji === 'string' ? emoji.trim() : '';

  const mergedStyle = {
    fontSize: `${size}px`,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
    ...style
  };

  return (
    <span style={mergedStyle} className={className} role="img" aria-label="emoji-icon">
      {cleanEmoji}
    </span>
  );
}
