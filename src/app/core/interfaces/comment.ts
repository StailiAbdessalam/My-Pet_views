import { CurrentPerson } from "./Person";

export class Comment {
    id: number = 0;
    content: string = '';
    person: CurrentPerson = new CurrentPerson();
}