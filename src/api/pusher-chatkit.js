import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

const tokenUrl =
    'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/5caa6a0a-c110-41b2-8b58-9165771aae7e/token';
const instanceLocator = 'v1:us1:5caa6a0a-c110-41b2-8b58-9165771aae7e';

export { ChatManager, TokenProvider, tokenUrl, instanceLocator };
