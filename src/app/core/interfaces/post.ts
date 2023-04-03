import { CurrentPerson } from "./Person";
import { Animal } from "./animal";

export class Post {
    person: CurrentPerson = new CurrentPerson();
    animal: Animal = new Animal();
    referencePost: string = '';
    title: string = '';
    description: string = '';
    days: number = 0;
    commentNumber: number = 0;
    adopted: boolean = false;
}