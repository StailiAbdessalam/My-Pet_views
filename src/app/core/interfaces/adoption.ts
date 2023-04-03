import { CurrentPerson } from "./Person";
import { Post } from "./post";

export class Adoption {
    person: CurrentPerson = new CurrentPerson();
    post: Post = new Post();
}