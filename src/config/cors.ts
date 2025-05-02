import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        // Whitelist de dominios permitidos
        const whitelist = [
            process.env.FRONTEND_URL,
            'http://localhost:5173' // Por si acaso
        ]

        // Permitir solicitudes sin origen (Postman, móvil, etc.) en desarrollo
        if(process.env.NODE_ENV === 'development') {
            whitelist.push(undefined)
        }

        if(!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            console.error(`Error CORS: Origen no permitido - ${origin}`)
            callback(new Error('No permitido por CORS'))
        }
    },
    credentials: true // Si usas cookies/tokens
}