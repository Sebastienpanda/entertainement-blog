import {faker} from "@faker-js/faker";
import fs from "node:fs";

const USERS_COUNT = 20;
const ARTICLES_MIN = 0;
const ARTICLES_MAX = 5;
const COMMENTS_MIN = 1;
const COMMENTS_MAX = 8;

function createUser() {
    return {
        id: faker.string.uuid(),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        isAuthor: faker.datatype.boolean()
    };
}

function createArticle(authorId) {
    return {
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs({min: 2, max: 50}),
        thumbnail: faker.image.urlPicsumPhotos(),
        author_id: authorId,
        createdAt: faker.date.past()
    };
}

function createComment(userId, articleId) {
    return {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        user_id: userId,
        article_id: articleId,
        createdAt: faker.date.recent()
    };
}

function generateData() {
    const users = Array.from({length: USERS_COUNT}, createUser);

    // Filter only authors
    const authors = users.filter(u => u.isAuthor === true);

    const articles = [];
    const comments = [];

    for (const author of authors) {
        const articlesCount = faker.number.int({min: ARTICLES_MIN, max: ARTICLES_MAX});

        for (let i = 0; i < articlesCount; i++) {
            const article = createArticle(author.id);
            articles.push(article);

            const commentsCount = faker.number.int({min: COMMENTS_MIN, max: COMMENTS_MAX});

            for (let j = 0; j < commentsCount; j++) {
                const randomUser = faker.helpers.arrayElement(users);

                comments.push(createComment(randomUser.id, article.id));
            }
        }
    }

    const db = {
        users,
        articles,
        comments
    };

    fs.writeFileSync("db.json", JSON.stringify(db, null, 2), "utf-8");

    console.log("db.json généré avec succès 🎉");
}

generateData();
