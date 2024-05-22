import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { init } from 'bot-ws-plugin-openai';
import 'dotenv/config';
import welcomeFlow from './flows/welcome.flow.js';
import vendedorFlow from './flows/vendedor.flow.js';
import expertoFlow from './flows/experto.flow.js';
import pagarFlow from './flows/pagar.flow.js';

const PORT = process.env.PORT ?? 3008;

// Configuración del Plugin de OpenAI
const employeesAddonConfig = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
};

const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees([
    {
        name: "EMPLEADO_VENDEDOR",
        description:
            "Soy Rob el vendedor amable encargado de atentender si tienes intencion de comprar o interesado en algun producto, mis respuestas son breves.",
        flow: vendedorFlow,
    },
    {
        name: "EMPLEADO_EXPERTO",
        description:
            "Saludos, mi nombre es Leifer.Soy el encargado especializado en resolver tus dudas sobre nuestro curso de chatbot, el cual está desarrollado con Node.js y JavaScript. Este curso está diseñado para facilitar la automatización de ventas en tu negocio. Te proporcionaré respuestas concisas y directas para maximizar tu entendimiento.",
        flow: expertoFlow,
    },
    {
        name: "EMPLEADO_PAGAR",
        description:
            "Saludos, mi nombre es Juan encargado de generar los links de pagos necesarios cuando un usuario quiera hacer la recarga de puntos a la plataforma de cursos.",
        flow: pagarFlow,
    }
]);

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, vendedorFlow, expertoFlow, pagarFlow]);
    const adapterProvider = createProvider(Provider);
    const adapterDB = new Database();

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    }, {
        extensions: {
            employeesAddon,
        },
    });

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body;
            await bot.sendMessage(number, message, { media: urlMedia ?? null });
            return res.end('sended');
        })
    );

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body;
            await bot.dispatch('REGISTER_FLOW', { from: number, name });
            return res.end('trigger');
        })
    );

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body;
            await bot.dispatch('SAMPLES', { from: number, name });
            return res.end('trigger');
        })
    );

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body;
            if (intent === 'remove') bot.blacklist.remove(number);
            if (intent === 'add') bot.blacklist.add(number);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'ok', number, intent }));
        })
    );

    httpServer(+PORT);
};

main();
