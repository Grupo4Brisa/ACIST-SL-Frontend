import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Home, LogIn, FileText, LayoutDashboard, X, GripVertical, Minimize2, Maximize2 } from 'lucide-react';

export default function DraggableQuickNav() {
  const [position, setPosition] = useState({ x: window.innerWidth - 220, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  if (isClosed) {
    return (
      <button
        onClick={() => setIsClosed(false)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
        title="Mostrar navegação"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      ref={navRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      className="fixed z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-border"
    >
      <div
        className="flex items-center justify-between p-3 border-b border-border cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-[0.75rem] text-muted-foreground">Navegação Rápida</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsClosed(true)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Fechar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-[0.875rem] px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            Landing Page
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 text-[0.875rem] px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            to="/landing"
            className="flex items-center gap-2 text-[0.875rem] px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <FileText className="h-4 w-4" />
            Landing (Campanha)
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-[0.875rem] px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin (CRM)
          </Link>
        </div>
      )}
    </div>
  );
}
