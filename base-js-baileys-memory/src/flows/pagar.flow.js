import { addKeyword } from '@builderbot/bot';

const pagarFlow = addKeyword('pagar', {sensitive:true})
    .addAction(async (_, {state, flowDynamic}) => {
        const currentState = state.getMyState();
        console.log(currentState);
        return await flowDynamic(`Hola soy el encargado de pagos...`);
    });

export default pagarFlow;
