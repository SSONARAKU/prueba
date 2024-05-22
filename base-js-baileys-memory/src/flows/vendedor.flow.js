import { addKeyword } from '@builderbot/bot';

const vendedorFlow = addKeyword('vendedor', {sensitive:true})
    .addAction(async (_, {state, flowDynamic}) => {
        const currentState = state.getMyState();
        console.log(currentState);
        return await flowDynamic(`Hola soy el vendedor...`);
    });

export default vendedorFlow;
