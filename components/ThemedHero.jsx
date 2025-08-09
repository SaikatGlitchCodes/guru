import React from 'react'

export default function ThemedHero({ children, variant = 'dark' }) {
    const isDark = variant === 'dark'
    
    return (
        <section className={`relative ${isDark ? 'bg-black' : 'bg-white'} py-10 overflow-hidden`}>
            {/* Animated Grid Background */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'black black' : 'white white'} z-10`}></div>
                <div
                    className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}
                    style={{
                        backgroundImage: `
                linear-gradient(${isDark ? 'white' : '#e5e7eb'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDark ? 'white' : '#e5e7eb'} 1px, transparent 1px)
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
