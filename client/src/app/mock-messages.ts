import {Message} from './Message';

export const mockmessages: Message[] = [
    { content: 'first message', timestamp: new Date(), authormail: 'admin@postmessages.it', tags: ['Tag1'] },
    { content: 'second message', timestamp: new Date(), authormail: 'admin@postmessages.it', tags: ['Tag1', 'Tag5'] },
    { content: 'third message', timestamp: new Date(), authormail: 'a@test.a', tags: ['Tag5', 'Tag6', 'Tag7'] }
];
