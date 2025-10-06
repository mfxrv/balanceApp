import React from 'react';

export default function Splash() {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: '#a5cc7f',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                margin: 0,
                padding: 0,
                position: 'fixed',
                top: 0,
                left: 0
            }}
        >
            <img
                src="/icons/icon-192x192.png"
                alt="Balance+ Logo"
                style={{ width: 100, height: 100, marginBottom: 20 }}
            />
            <h1>Bienvenido a Balance+</h1>
            <p>Tu app para controlar gastos personales.</p>
        </div>
    );
}
