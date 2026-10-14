import React, { useEffect, useRef, useState } from 'react';

// Lebar A4 (210mm) dalam piksel CSS pada 96 dpi
const A4_WIDTH_PX = 794;

/**
 * Menampilkan lembar CV A4 secara utuh dan otomatis menyesuaikan lebar panel.
 *
 * Masalah sebelumnya: `transform: scale()` hanya mengecilkan tampilan visual,
 * sedangkan ukuran layout elemen tetap 210mm sehingga sisi kanan/bawah CV
 * terpotong oleh container. Di sini scale dihitung dari lebar panel, dan
 * wrapper diberi ukuran hasil scale supaya seluruh CV (semua halaman)
 * terlihat penuh dan bisa di-scroll ke bawah.
 */
const ScaledA4Preview = ({ children }) => {
  const wrapRef = useRef(null);
  const sheetRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sheet = sheetRef.current;
    if (!wrap || !sheet) return undefined;

    const update = () => {
      const available = wrap.clientWidth;
      if (available > 0) setScale(Math.min(1, available / A4_WIDTH_PX));
      setSheetHeight(sheet.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className="mx-auto bg-white shadow-2xl rounded-sm overflow-hidden"
        style={{ width: A4_WIDTH_PX * scale, height: sheetHeight * scale }}
      >
        <div
          ref={sheetRef}
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScaledA4Preview;