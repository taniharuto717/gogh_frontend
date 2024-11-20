import React, { useState } from 'react';

function ImagePreview({src}) {
  //デフォルト画面の画像スタイル
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'relative'
  };
  // サムネイル画像のスタイル
  const thumbnailStyle = {
    width: '500px', // 幅を150ピクセルに設定
    height: 'auto', // 高さは自動調整（アスペクト比を維持）
    cursor: 'pointer' // カーソルをポインターに変更
  };

  // モーダルの表示状態を管理するステート
  const [isModalOpen, setModalOpen] = useState(false);

  // 画像をクリックしたときのハンドラ
  const handleImageClick = () => {
    setModalOpen(true);
  };

  // モーダルのオーバーレイ部分をクリックしたときのハンドラ
  const handleOverlayClick = () => {
    setModalOpen(false);
  };

  return (
    <div style={wrapperStyle}>
      <img 
        src={src}
        alt="Thumbnail" 
        onClick={handleImageClick} 
        style={thumbnailStyle}
      />

      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 透過背景
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleOverlayClick}
        >
          <img 
            src={src}
            alt="Full-size" 
            style={{maxWidth: '100%', maxHeight: '100%'}}
          />
        </div>
      )}
    </div>
  );
}

export default ImagePreview;
