import React from 'react'

export default function ThemedHero({ children }) {
    return (
        <section className="relative bg-black py-10 overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b black black z-10"></div>
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(90deg, white 1px, transparent 1px)
              `,
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite'
                    }}
                ></div>
            </div>

            <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
        `}</style>
            {children}
        </section>
    )
}
