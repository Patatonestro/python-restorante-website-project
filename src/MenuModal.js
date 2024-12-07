import React, { useState, useRef } from 'react';
import styles from './MenuModal.css';
import menu from '../src/menu.png';
const MenuModal = ({ isOpen, onClose, menuImage }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {  // 只有在放大状态才能拖动
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // 计算边界以防止图片被拖出可视区域太多
      const bounds = imageRef.current.getBoundingClientRect();
      const maxX = bounds.width * (scale - 1);
      const maxY = bounds.height * (scale - 1);

      setPosition({
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-controls">
          <button onClick={handleZoomOut}>-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn}>+</button>
        </div>
        <div className="modal-image-container">
          <img 
            ref={imageRef}
            src={menu} 
            alt="Menu" 
            style={{ 
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              cursor: scale > 1 ? 'grab' : 'default',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            className="modal-image"
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};


export default MenuModal;