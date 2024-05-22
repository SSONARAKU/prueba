import { addKeyword } from '@builderbot/bot';

const welcomeFlow = addKeyword(['hi', 'hello', 'hola'])
    .addAnswer(`🙌 Hello, welcome to this *Chatbot*`)
    .addAnswer('How can I help you today?');

export default welcomeFlow;
