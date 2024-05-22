import { addKeyword } from '@builderbot/bot';

const expertoFlow = addKeyword('experto', { sensitive: true })
    .addAction(async (_, { state, flowDynamic }) => {
        const currentState = state.getMyState();
        console.log(currentState);
        return await flowDynamic(`Hola soy el experto...`);
    });

export default expertoFlow;
