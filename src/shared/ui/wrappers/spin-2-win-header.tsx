interface Spin2WinHeaderProps {
    text: string;
}

export function Spin2WinHeader({ text }: Spin2WinHeaderProps) {
    return (
        <div
            className="z-12 m-auto relative w-[90%] min-w-[48%] aspect-[192/45.5] flex items-center justify-center border-4 border-pink-light"
            style={{
                top: '-10%',
                backgroundColor: '#FFD7EB',
                borderRadius: '40px 40px 20px 20px',
                boxShadow:
                    '0 0 10px 5px rgba(255,255,255,0.85), inset 0 0 15px 10px rgba(255,162,220,1)',
                fontFamily: 'Bungee, cursive',
                fontSize: '2.5rem',
                lineHeight: 1.2,
                color: '#BBE3F2',
                WebkitTextStroke: '2px #2066BB',
                textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
            }}
        >
            {text}
        </div>
    );
}
